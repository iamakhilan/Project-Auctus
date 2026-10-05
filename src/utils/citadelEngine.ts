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

export interface CitadelTierConfig {
  tier: number;
  name: string;
  perkDescription: string;
  energyCap: number;
  bonusMultiplier: number;
}

export const CITADEL_TIER_CONFIGS: Record<number, CitadelTierConfig> = {
  1: {
    tier: 1,
    name: 'Outpost Haven',
    perkDescription: 'Base focus energy capacity + standard bounty rates.',
    energyCap: 5,
    bonusMultiplier: 1.0,
  },
  2: {
    tier: 2,
    name: 'Bastion Outpost',
    perkDescription: '+20% XP boost across all tactical focus sessions.',
    energyCap: 6,
    bonusMultiplier: 1.2,
  },
  3: {
    tier: 3,
    name: 'Iron Vanguard',
    perkDescription: '+40% XP boost and +1 maximum energy heart reservoir.',
    energyCap: 7,
    bonusMultiplier: 1.4,
  },
  4: {
    tier: 4,
    name: 'Aether Archon',
    perkDescription: '+60% XP boost and accelerated chest unlock cooldowns.',
    energyCap: 8,
    bonusMultiplier: 1.6,
  },
  5: {
    tier: 5,
    name: 'Apex Sovereign',
    perkDescription: '+80% XP boost and maximum productivity power gauge.',
    energyCap: 10,
    bonusMultiplier: 1.8,
  },
};

export const getCitadelTierConfig = (tier: number): CitadelTierConfig => {
  return CITADEL_TIER_CONFIGS[tier] || {
    tier,
    name: `Ascendant Citadel ${tier}`,
    perkDescription: `+${Math.round((tier - 1) * 20)}% XP multiplier active.`,
    energyCap: Math.min(10, 5 + (tier - 1)),
    bonusMultiplier: 1.0 + (tier - 1) * 0.2,
  };
};
