import { describe, it, expect } from 'vitest';
import {
  getStreakMultiplier,
  calculateStreakXpBonus,
  getNextStreakMilestone,
} from '../streakBonus';

describe('streakBonus', () => {
  describe('getStreakMultiplier', () => {
    it('returns base 1.0 for streaks under 7 days', () => {
      expect(getStreakMultiplier(0)).toBe(1.0);
      expect(getStreakMultiplier(6)).toBe(1.0);
    });

    it('returns 1.25 for 7-day streak', () => {
      expect(getStreakMultiplier(7)).toBe(1.25);
      expect(getStreakMultiplier(13)).toBe(1.25);
    });

    it('returns 1.5 for 14-day streak', () => {
      expect(getStreakMultiplier(14)).toBe(1.5);
    });

    it('returns 2.0 for 30-day streak', () => {
      expect(getStreakMultiplier(30)).toBe(2.0);
    });

    it('returns 3.0 for 100-day streak', () => {
      expect(getStreakMultiplier(100)).toBe(3.0);
      expect(getStreakMultiplier(250)).toBe(3.0);
    });
  });

  describe('calculateStreakXpBonus', () => {
    it('calculates total XP with bonus applied', () => {
      const res = calculateStreakXpBonus(100, 14);
      expect(res.multiplier).toBe(1.5);
      expect(res.bonusXp).toBe(50);
      expect(res.totalXp).toBe(150);
    });
  });

  describe('getNextStreakMilestone', () => {
    it('determines the next milestone and remaining days', () => {
      const res = getNextStreakMilestone(4);
      expect(res.milestoneDays).toBe(7);
      expect(res.daysRemaining).toBe(3);
      expect(res.multiplier).toBe(1.25);
    });
  });
});
