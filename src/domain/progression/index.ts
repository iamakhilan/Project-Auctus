import { PlayerProfile } from '../../types';

export interface LevelProgressionResult {
  level: number;
  xp: number;
  xpToNextLevel: number;
  leveledUp: boolean;
  levelsGained: number;
  citadelPowerBonus: number;
}

/**
 * Calculates updated XP, level, and XP thresholds given current state and XP earned.
 * Multiplier curve: XP to next level increases by 30% each level (Math.round(prev * 1.3)).
 */
export function calculateLevelProgression(
  currentXp: number,
  currentLevel: number,
  currentXpToNextLevel: number,
  xpEarned: number
): LevelProgressionResult {
  let newXp = Math.max(0, currentXp + xpEarned);
  let newLevel = currentLevel;
  let newXpTarget = currentXpToNextLevel || 1000;
  let levelsGained = 0;

  while (newXp >= newXpTarget) {
    newXp -= newXpTarget;
    newLevel += 1;
    levelsGained += 1;
    newXpTarget = Math.round(newXpTarget * 1.3);
  }

  const citadelPowerBonus = Math.round(xpEarned * 0.4);

  return {
    level: newLevel,
    xp: newXp,
    xpToNextLevel: newXpTarget,
    leveledUp: levelsGained > 0,
    levelsGained,
    citadelPowerBonus,
  };
}

/**
 * Calculates rank classification based on trophy points.
 */
export function calculateLeagueRank(trophyPoints: number): string {
  if (trophyPoints >= 3000) return 'MASTER I';
  if (trophyPoints >= 2500) return 'DIAMOND I';
  if (trophyPoints >= 2000) return 'PLATINUM I';
  if (trophyPoints >= 1500) return 'GOLD I';
  if (trophyPoints >= 1000) return 'SILVER I';
  return 'BRONZE I';
}

/**
 * Computes updated profile after applying XP gain.
 */
export function applyXpGain(profile: PlayerProfile, xpAmount: number): {
  profile: PlayerProfile;
  progression: LevelProgressionResult;
} {
  const progression = calculateLevelProgression(
    profile.xp,
    profile.level,
    profile.xpToNextLevel,
    xpAmount
  );

  const updatedProfile: PlayerProfile = {
    ...profile,
    level: progression.level,
    xp: progression.xp,
    xpToNextLevel: progression.xpToNextLevel,
    citadelPower: Math.min(
      profile.citadelMaxPower,
      profile.citadelPower + progression.citadelPowerBonus
    ),
  };

  return { profile: updatedProfile, progression };
}
