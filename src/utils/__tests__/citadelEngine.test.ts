import { describe, it, expect } from 'vitest';
import { calculateCitadelPower, calculateCitadelLevelThreshold, getCitadelMultiplier } from '../citadelEngine';

describe('Citadel Engine', () => {
  it('calculates aggregate citadel power from quests, focus, and streak', () => {
    const power = calculateCitadelPower(10, 100, 7);
    // 10 * 15 = 150
    // 100 * 0.8 = 80
    // 7 * 25 = 175
    // 150 + 80 + 175 = 405
    expect(power).toBe(405);
  });

  it('handles zero inputs gracefully', () => {
    expect(calculateCitadelPower(0, 0, 0)).toBe(0);
  });

  it('calculates exponential level thresholds per tier', () => {
    expect(calculateCitadelLevelThreshold(1)).toBe(500);
    expect(calculateCitadelLevelThreshold(2)).toBe(750);
    expect(calculateCitadelLevelThreshold(3)).toBe(1125);
  });

  it('computes correct XP multiplier boost per citadel tier', () => {
    expect(getCitadelMultiplier(1)).toBe(1.0);
    expect(getCitadelMultiplier(2)).toBe(1.2);
    expect(getCitadelMultiplier(3)).toBe(1.4);
    expect(getCitadelMultiplier(4)).toBe(1.6);
  });
});
