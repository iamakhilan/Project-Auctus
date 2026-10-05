import { describe, it, expect } from 'vitest';
import {
  formatFocusTimerDisplay,
  formatChestRemainingTime,
  calculateRemainingSeconds,
} from '../timeFormatters';

describe('timeFormatters', () => {
  describe('formatFocusTimerDisplay', () => {
    it('formats seconds into minutes and seconds components', () => {
      const res = formatFocusTimerDisplay(125);
      expect(res.minutesStr).toBe('02');
      expect(res.secondsStr).toBe('05');
      expect(res.formatted).toBe('02:05');
    });

    it('handles zero seconds gracefully', () => {
      const res = formatFocusTimerDisplay(0);
      expect(res.formatted).toBe('00:00');
    });
  });

  describe('formatChestRemainingTime', () => {
    it('formats remaining hours, minutes, and seconds', () => {
      const now = 1727600000000;
      const endsAt = now + (2 * 3600 + 15 * 60 + 30) * 1000;
      expect(formatChestRemainingTime(endsAt, now)).toBe('02:15:30');
    });

    it('returns zeroes when endsAt is past', () => {
      const now = 1727600000000;
      expect(formatChestRemainingTime(now - 1000, now)).toBe('00:00:00');
    });
  });

  describe('calculateRemainingSeconds', () => {
    it('calculates remaining ceiling seconds', () => {
      const now = 10000;
      const endsAt = 15500;
      expect(calculateRemainingSeconds(endsAt, now)).toBe(6);
    });
  });
});
