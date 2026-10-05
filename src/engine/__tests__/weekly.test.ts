import { describe, it, expect } from 'vitest';
import { computeWeeklyWindow, buildWeeklyReview, shouldShowWeeklyReview } from '../weekly';
import type { Quest } from '../../types';

describe('computeWeeklyWindow', () => {
  it('is Monday to Sunday even on Sunday', () => {
    const sunday = new Date('2026-09-20T12:00:00'); // known Sunday
    const { start, end } = computeWeeklyWindow(sunday);
    expect(start).toBe('2026-09-14'); // Monday
    expect(end).toBe('2026-09-20');
  });
  it('shouldShowWeeklyReview fires on new week', () => {
    expect(shouldShowWeeklyReview('2026-09-07', new Date('2026-09-14T10:00:00'))).toBe(true);
    expect(shouldShowWeeklyReview('2026-09-14', new Date('2026-09-14T10:00:00'))).toBe(false);
    expect(shouldShowWeeklyReview(undefined)).toBe(true);
  });
  it('buildWeeklyReview includes overdue carry-over', () => {
    const yesterday = new Date(Date.now()-86400000).toISOString().split('T')[0];
    const quests: Quest[] = [
      { id: 'q1', title: 'Overdue', category: 'bounty', tag: 'Study', xpReward: 100, coinsReward: 50, isCompleted: false, dueDate: yesterday } as Quest,
    ];
    const wr = buildWeeklyReview(quests, [], []);
    expect(wr.carryOverQuestIds).toContain('q1');
    expect(wr.suggestedActions.some(a=> a.questIds?.includes('q1'))).toBe(true);
  });
});
