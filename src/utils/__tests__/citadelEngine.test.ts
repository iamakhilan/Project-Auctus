import { describe, it, expect } from 'vitest';
import {
  calculateCitadelPower,
  calculateCitadelLevelThreshold,
  getCitadelMultiplier,
  getCitadelTierConfig,
} from '../citadelEngine';

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

  it('returns valid tier configuration and perks', () => {
    const tier2 = getCitadelTierConfig(2);
    expect(tier2.name).toBe('Bastion Outpost');
    expect(tier2.energyCap).toBe(6);
    expect(tier2.bonusMultiplier).toBe(1.2);

    const tier5 = getCitadelTierConfig(5);
    expect(tier5.name).toBe('Apex Sovereign');
    expect(tier5.energyCap).toBe(10);
  });

  it('provides sensible fallback for dynamic high tiers', () => {
    const highTier = getCitadelTierConfig(9);
    expect(highTier.tier).toBe(9);
    expect(highTier.energyCap).toBe(10);
    expect(highTier.bonusMultiplier).toBeGreaterThan(2.0);
  });
});
