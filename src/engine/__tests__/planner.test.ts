import { describe, it, expect } from 'vitest';
import { computeUrgency, buildDailyObjectives } from '../planner';
import type { Quest, Campaign } from '../../types';

function q(overrides: Partial<Quest> & { id: string; title: string }): Quest {
  return {
    category: 'bounty', tag: 'Study', xpReward: 100, coinsReward: 50, isCompleted: false,
    estimatedMinutes: 30, priority: 'medium',
    ...overrides,
  } as Quest;
}
function camp(overrides: Partial<Campaign> = {}): Campaign {
  return {
    id: 'camp-1', title: 'Exam', goalType: 'exam', targetDate: new Date(Date.now()+5*86400000).toISOString().split('T')[0],
    status: 'active', createdAt: new Date().toISOString(), milestones: [],
    ...overrides,
  } as Campaign;
}

describe('computeUrgency', () => {
  it('boosts overdue and critical priority', () => {
    const quest = q({ id: 'q1', title: 'A', priority: 'critical', dueDate: new Date(Date.now()-2*86400000).toISOString().split('T')[0] });
    const { score, reasons } = computeUrgency(quest);
    expect(score).toBeGreaterThan(70);
    expect(reasons.join(' ')).toMatch(/Overdue|Critical/);
  });
  it('deprioritizes blocked quests', () => {
    const a = q({ id: 'a', title: 'A' });
    const b = q({ id: 'b', title: 'B', dependsOn: ['a'] });
    const map = new Map([['a', a], ['b', b]]);
    const { blocked, score } = computeUrgency(b, undefined, map);
    expect(blocked).toBe(true);
    const { score: unblockedScore } = computeUrgency({ ...b, dependsOn: [] }, undefined, map);
    expect(score).toBeLessThan(unblockedScore);
  });
  it('clamps score 0..100', () => {
    const quest = q({ id: 'q', title: 'X', priority: 'critical', dueDate: '2000-01-01' });
    const { score } = computeUrgency(quest);
    expect(score).toBeLessThanOrEqual(100);
    expect(score).toBeGreaterThanOrEqual(0);
  });
});

describe('buildDailyObjectives', () => {
  it('ranks unblocked by urgency and respects time budget', () => {
    const today = new Date().toISOString().split('T')[0];
    const quests = [
      q({ id: 'q1', title: 'Low', priority: 'low', estimatedMinutes: 60 }),
      q({ id: 'q2', title: 'Critical due today', priority: 'critical', dueDate: today, estimatedMinutes: 20 }),
      q({ id: 'q3', title: 'Blocked', priority: 'critical', dependsOn: ['q-missing'], estimatedMinutes: 15 }),
    ];
    const objs = buildDailyObjectives(quests, [], { max: 5, availableMinutes: 30 });
    // q3 is blocked, so excluded when budget-packing; verify q2 is still top
    expect(objs.some(o=> o.questId==='q3')).toBe(false);
    expect(objs[0].questId).toBe('q2');
    // budget 30: only q2 fits (20) ; q1 60 would overflow beyond +15 slack
    expect(objs.length).toBe(1);
  });
  it('always returns at least one if unblocked exists even over budget', () => {
    const quests = [q({ id: 'q1', title: 'Huge', estimatedMinutes: 300 })];
    const objs = buildDailyObjectives(quests, [], { availableMinutes: 15 });
    expect(objs.length).toBe(1);
    expect(objs[0].questId).toBe('q1');
  });
  it('includes campaign milestone ordering boost', () => {
    const mActive = { id: 'ms-1', campaignId: 'camp-1', title: 'M1', order: 0, status: 'active' as const, questIds: ['q1'] };
    const mLocked = { id: 'ms-2', campaignId: 'camp-1', title: 'M2', order: 3, status: 'locked' as const, questIds: ['q2'] };
    const campaign = camp({ milestones: [mActive, mLocked] });
    const quests = [
      q({ id: 'q1', title: 'Early active', milestoneId: 'ms-1', campaignId: 'camp-1', priority: 'medium' }),
      q({ id: 'q2', title: 'Later locked', milestoneId: 'ms-2', campaignId: 'camp-1', priority: 'medium' }),
    ];
    const objs = buildDailyObjectives(quests, [campaign]);
    expect(objs[0].questId).toBe('q1');
  });
});
