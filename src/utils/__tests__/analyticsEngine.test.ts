import { describe, it, expect } from 'vitest';
import {
  calculateFocusVelocity,
  calculateCategoryBreakdown,
  calculateHourlyFocusDistribution,
  calculateConsistencyScore,
} from '../analyticsEngine';
import { FocusSessionRecord, Quest } from '../../types';

describe('analyticsEngine', () => {
  const refDate = new Date('2026-09-25T12:00:00Z');
  const refTime = refDate.getTime();
  const dayMs = 86400000;

  describe('calculateFocusVelocity', () => {
    it('returns zero metrics when no sessions exist', () => {
      const result = calculateFocusVelocity([], 7, refDate);
      expect(result.totalMinutes).toBe(0);
      expect(result.dailyAverage).toBe(0);
      expect(result.velocityScore).toBe(0);
      expect(result.trend).toBe('steady');
    });

    it('calculates velocity and rising trend correctly', () => {
      const mockSessions: FocusSessionRecord[] = [
        {
          id: '1',
          durationMinutes: 60,
          completedAt: refTime - dayMs * 2,
          actualSeconds: 3600,
          xpEarned: 100,
          coinsEarned: 50,
        },
        {
          id: '2',
          durationMinutes: 45,
          completedAt: refTime - dayMs * 4,
          actualSeconds: 2700,
          xpEarned: 80,
          coinsEarned: 40,
        },
        {
          id: '3',
          durationMinutes: 20,
          completedAt: refTime - dayMs * 10,
          actualSeconds: 1200,
          xpEarned: 30,
          coinsEarned: 15,
        },
      ];

      const result = calculateFocusVelocity(mockSessions, 7, refDate);
      expect(result.totalMinutes).toBe(105);
      expect(result.dailyAverage).toBe(15);
      expect(result.velocityScore).toBe(25);
      expect(result.trend).toBe('rising');
    });
  });

  describe('calculateCategoryBreakdown', () => {
    it('calculates category counts and percentages', () => {
      const quests: Quest[] = [
        {
          id: 'q1',
          title: 'Quest 1',
          category: 'daily',
          tag: 'Coding',
          xpReward: 50,
          coinsReward: 20,
          isCompleted: true,
        },
        {
          id: 'q2',
          title: 'Quest 2',
          category: 'daily',
          tag: 'Study',
          xpReward: 50,
          coinsReward: 20,
          isCompleted: true,
        },
        {
          id: 'q3',
          title: 'Quest 3',
          category: 'bounty',
          tag: 'Work',
          xpReward: 100,
          coinsReward: 50,
          isCompleted: true,
        },
        {
          id: 'q4',
          title: 'Quest 4',
          category: 'epic',
          tag: 'Personal',
          xpReward: 200,
          coinsReward: 100,
          isCompleted: false,
        },
      ];

      const breakdown = calculateCategoryBreakdown(quests);
      expect(breakdown).toHaveLength(2);
      expect(breakdown[0].category).toBe('daily');
      expect(breakdown[0].count).toBe(2);
      expect(breakdown[0].percentage).toBe(67);
      expect(breakdown[1].category).toBe('bounty');
      expect(breakdown[1].count).toBe(1);
      expect(breakdown[1].percentage).toBe(33);
    });
  });

  describe('calculateConsistencyScore', () => {
    it('calculates score based on active dates within lookback', () => {
      const activeDates = ['2026-09-25', '2026-09-24', '2026-09-23', '2026-09-20'];
      const score = calculateConsistencyScore(activeDates, 10, refDate);
      expect(score).toBe(40);
    });
  });
});
