import { describe, it, expect } from 'vitest';
import { buildSnapshot, deriveInsights } from '../intelligence';
import type { Quest, FocusEffortLog } from '../../types';

function q(overrides: Partial<Quest> & { id: string }): Quest {
  return { title: 'T', category: 'bounty', tag: 'Study', xpReward: 100, coinsReward: 50, isCompleted: false, estimatedMinutes: 30, ...overrides } as Quest;
}
function log(overrides: Partial<FocusEffortLog> = {}): FocusEffortLog {
  return { id: 'log-1', plannedMinutes: 25, actualMinutes: 25, startedAt: Date.now()-100000, endedAt: Date.now(), completed: true, interrupted: false, ...overrides };
}

describe('buildSnapshot', () => {
  it('computes postponed and overdue', () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now()-86400000).toISOString().split('T')[0];
    const quests = [
      q({ id: 'q1', dueDate: yesterday, postponedCount: 2 }),
      q({ id: 'q2', dueDate: today, postponedCount: 0, isCompleted: true, completedAt: new Date().toISOString(), actualMinutes: 40 }),
      q({ id: 'q3', dueDate: yesterday, postponedCount: 1 }),
    ];
    const snap = buildSnapshot(quests, [], 14);
    expect(snap.postponedCount).toBe(3);
    expect(snap.overdueCount).toBe(2);
    expect(snap.completionRate).toBeGreaterThan(0);
  });
  it('handles legacy quests without createdAt as all in window', () => {
    const quests = [q({ id: 'q1' }), q({ id: 'q2', isCompleted: true, completedAt: new Date().toISOString() })];
    const snap = buildSnapshot(quests, [], 14);
    expect(snap.totalQuests).toBe(2);
  });
  it('derives estimation bias', () => {
    const quests = [
      q({ id: 'q1', estimatedMinutes: 20, actualMinutes: 30, isCompleted: true, completedAt: new Date().toISOString() }),
      q({ id: 'q2', estimatedMinutes: 20, actualMinutes: 30, isCompleted: true, completedAt: new Date().toISOString() }),
    ];
    const snap = buildSnapshot(quests, [log({ actualMinutes: 30 }), log({ actualMinutes: 30 })], 14);
    expect(snap.estimationBias).toBeGreaterThan(0);
  });
});

describe('deriveInsights', () => {
  it('returns insight for empty', () => {
    const snap = buildSnapshot([], [], 14);
    const insights = deriveInsights(snap, [], []);
    expect(insights[0]).toMatch(/No quests/);
  });
  it('mentions overdue', () => {
    const yesterday = new Date(Date.now()-86400000).toISOString().split('T')[0];
    const quests = [q({ id: 'q1', dueDate: yesterday })];
    const snap = buildSnapshot(quests, [], 14);
    const insights = deriveInsights(snap, [], quests);
    expect(insights.join(' ')).toMatch(/overdue/i);
  });
});
