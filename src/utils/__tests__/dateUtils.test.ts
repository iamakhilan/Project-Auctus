import { describe, it, expect } from 'vitest';
import {
  getLocalDateString,
  getPreviousLocalDateString,
  getCalendarDayDifference,
  calculateUpdatedStreak,
  recalculateFullStreakFromDates,
  getLocalISOStringWithOffset,
  isHabitScheduledForDay,
} from '../dateUtils';

describe('dateUtils', () => {
  it('formats local date string as YYYY-MM-DD correctly', () => {
    const d = new Date(2026, 8, 30); // Sept 30, 2026
    expect(getLocalDateString(d)).toBe('2026-09-30');
  });

  it('calculates previous local date across month boundary', () => {
    expect(getPreviousLocalDateString('2026-10-01')).toBe('2026-09-30');
    expect(getPreviousLocalDateString('2026-01-01')).toBe('2025-12-31');
    expect(getPreviousLocalDateString('2024-03-01')).toBe('2024-02-29'); // Leap year
  });

  it('computes exact calendar day differences', () => {
    expect(getCalendarDayDifference('2026-09-29', '2026-09-30')).toBe(1);
    expect(getCalendarDayDifference('2026-09-28', '2026-09-30')).toBe(2);
    expect(getCalendarDayDifference('2026-09-30', '2026-09-30')).toBe(0);
    expect(getCalendarDayDifference('2026-09-30', '2026-10-01')).toBe(1);
  });

  it('calculates updated streak with consecutive day check-in', () => {
    const res = calculateUpdatedStreak(['2026-09-29'], 1, 1, '2026-09-30');
    expect(res.streakCount).toBe(2);
    expect(res.bestStreak).toBe(2);
    expect(res.completedDates).toEqual(['2026-09-29', '2026-09-30']);
  });

  it('resets streak to 1 when a day is missed', () => {
    const res = calculateUpdatedStreak(['2026-09-27'], 5, 10, '2026-09-30');
    expect(res.streakCount).toBe(1);
    expect(res.bestStreak).toBe(10);
  });

  it('handles same-day check-in idempotently', () => {
    const res = calculateUpdatedStreak(['2026-09-30'], 3, 3, '2026-09-30');
    expect(res.streakCount).toBe(3);
    expect(res.completedDates).toEqual(['2026-09-30']);
  });

  it('recalculates full streak history accurately across gaps', () => {
    const dates = ['2026-09-25', '2026-09-26', '2026-09-27', '2026-09-29', '2026-09-30'];
    const { currentStreak, bestStreak } = recalculateFullStreakFromDates(dates, '2026-09-30');
    expect(currentStreak).toBe(2);
    expect(bestStreak).toBe(3);
  });

  it('generates localized ISO string with timezone offset', () => {
    const iso = getLocalISOStringWithOffset(new Date(2026, 8, 30, 12, 0, 0));
    expect(iso).toMatch(/^2026-09-30T12:00:00[+-]\d{2}:\d{2}$/);
  });

  it('validates habit frequency scheduling for daily, weekdays, and weekends', () => {
    // 2026-09-23 was Wednesday (weekday)
    expect(isHabitScheduledForDay('daily', '2026-09-23')).toBe(true);
    expect(isHabitScheduledForDay('weekdays', '2026-09-23')).toBe(true);
    expect(isHabitScheduledForDay('weekends', '2026-09-23')).toBe(false);

    // 2026-09-26 was Saturday (weekend)
    expect(isHabitScheduledForDay('daily', '2026-09-26')).toBe(true);
    expect(isHabitScheduledForDay('weekdays', '2026-09-26')).toBe(false);
    expect(isHabitScheduledForDay('weekends', '2026-09-26')).toBe(true);
  });
});
