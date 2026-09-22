export interface CitadelStats {
  tier: number;
  power: number;
  maxPower: number;
  energyCap: number;
  xpMultiplier: number;
  tierName: string;
}

export const calculateCitadelPower = (
  completedQuests: number,
  totalFocusMinutes: number,
  streakDays: number
): number => {
  const questContribution = completedQuests * 15;
  const focusContribution = Math.round(totalFocusMinutes * 0.8);
  const streakContribution = streakDays * 25;

  return Math.max(0, questContribution + focusContribution + streakContribution);
};

export const calculateCitadelLevelThreshold = (tier: number): number => {
  const base = 500;
  return Math.round(base * Math.pow(1.5, Math.max(0, tier - 1)));
};

export const getCitadelMultiplier = (tier: number): number => {
  return 1.0 + Math.max(0, tier - 1) * 0.2;
};
