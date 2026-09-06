import { describe, it, expect } from 'vitest';
import {
  calculateLevelProgression,
  calculateLeagueRank,
  applyXpGain,
} from '../../src/domain/progression';
import { initialProfile } from '../../src/utils/storage';

describe('Progression Domain Engine', () => {
  it('should increase XP without leveling up when below threshold', () => {
    const res = calculateLevelProgression(100, 1, 1000, 200);
    expect(res.level).toBe(1);
    expect(res.xp).toBe(300);
    expect(res.xpToNextLevel).toBe(1000);
    expect(res.leveledUp).toBe(false);
    expect(res.levelsGained).toBe(0);
    expect(res.citadelPowerBonus).toBe(80);
  });

  it('should level up and scale next level target by 1.3x when XP exceeds threshold', () => {
    const res = calculateLevelProgression(900, 1, 1000, 200);
    // 900 + 200 = 1100 >= 1000 => level 2, remaining 100 xp, next target Math.round(1000 * 1.3) = 1300
    expect(res.level).toBe(2);
    expect(res.xp).toBe(100);
    expect(res.xpToNextLevel).toBe(1300);
    expect(res.leveledUp).toBe(true);
    expect(res.levelsGained).toBe(1);
  });

  it('should handle multi-level leaps correctly', () => {
    // Start at lvl 1 (0/1000), gain 5000 XP
    // lvl 1->2: 1000 used, 4000 left, next 1300
    // lvl 2->3: 1300 used, 2700 left, next 1690
    // lvl 3->4: 1690 used, 1010 left, next 2197
    const res = calculateLevelProgression(0, 1, 1000, 5000);
    expect(res.level).toBe(4);
    expect(res.levelsGained).toBe(3);
    expect(res.xp).toBe(1010);
    expect(res.xpToNextLevel).toBe(2197);
  });

  it('should calculate league ranks by trophy points accurately', () => {
    expect(calculateLeagueRank(500)).toBe('BRONZE I');
    expect(calculateLeagueRank(1200)).toBe('SILVER I');
    expect(calculateLeagueRank(1600)).toBe('GOLD I');
    expect(calculateLeagueRank(2100)).toBe('PLATINUM I');
    expect(calculateLeagueRank(2600)).toBe('DIAMOND I');
    expect(calculateLeagueRank(3500)).toBe('MASTER I');
  });

  it('should apply XP gain to player profile cleanly', () => {
    const profile = { ...initialProfile, xp: 500, level: 2, xpToNextLevel: 1000, citadelPower: 100 };
    const { profile: updated, progression } = applyXpGain(profile, 600);
    expect(progression.leveledUp).toBe(true);
    expect(updated.level).toBe(3);
    expect(updated.xp).toBe(100);
    expect(updated.citadelPower).toBe(100 + Math.round(600 * 0.4));
  });
});
