import { describe, it, expect } from 'vitest';
import {
  isLeapYear,
  getDaysInMonth,
  toLocalDateISOString,
  parseLocalISOString,
} from '../calendarBoundary';

describe('calendarBoundary', () => {
  it('correctly identifies leap years', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2026)).toBe(false);
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
  });

  it('calculates days in month with leap year consideration', () => {
    expect(getDaysInMonth(2024, 1)).toBe(29); // Feb 2024
    expect(getDaysInMonth(2026, 1)).toBe(28); // Feb 2026
    expect(getDaysInMonth(2026, 8)).toBe(30); // Sept 2026
    expect(getDaysInMonth(2026, 9)).toBe(31); // Oct 2026
  });

  it('formats and parses local ISO dates idempotently', () => {
    const iso = '2026-09-30';
    const date = parseLocalISOString(iso);
    expect(toLocalDateISOString(date)).toBe(iso);
  });
});
