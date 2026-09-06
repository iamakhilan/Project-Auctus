import { PlayerProfile } from '../../types';

export interface CitadelTierConfig {
  tier: number;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  maxPower: number;
  minLevel: number;
  xpBoostPercent: number;
  rewardGrant: {
    coins: number;
    shards: number;
    title: string;
  };
}

export const CITADEL_TIERS: Record<number, CitadelTierConfig> = {
  1: {
    tier: 1,
    name: 'Genesis Outpost',
    subtitle: 'Foundation of Discipline',
    description: 'The nascent sanctuary where champions forge their daily routines.',
    image: '/assets/island.png',
    maxPower: 1000,
    minLevel: 1,
    xpBoostPercent: 0,
    rewardGrant: { coins: 100, shards: 2, title: 'Outpost Warden' },
  },
  2: {
    tier: 2,
    name: 'Emerald Stronghold',
    subtitle: 'Bastion of Focus',
    description: 'A thriving haven fortified by deep work rituals and consistent habits.',
    image: '/assets/island.png',
    maxPower: 2500,
    minLevel: 4,
    xpBoostPercent: 5,
    rewardGrant: { coins: 300, shards: 5, title: 'Emerald Sentinel' },
  },
  3: {
    tier: 3,
    name: 'Azure Spire',
    subtitle: 'Tower of Mastery',
    description: 'Skyward spires pulsating with raw mental mana and unlocked focus elixirs.',
    image: '/assets/island.png',
    maxPower: 6000,
    minLevel: 8,
    xpBoostPercent: 10,
    rewardGrant: { coins: 750, shards: 12, title: 'Spire Architect' },
  },
  4: {
    tier: 4,
    name: 'Obsidian Fortress',
    subtitle: 'Citadel of Dominion',
    description: 'Impenetrable citadel radiating high productivity resonance across realms.',
    image: '/assets/island.png',
    maxPower: 12000,
    minLevel: 13,
    xpBoostPercent: 15,
    rewardGrant: { coins: 1500, shards: 25, title: 'Obsidian Overlord' },
  },
  5: {
    tier: 5,
    name: 'Celestial Apex Citadel',
    subtitle: 'Sovereign Realm of Mastery',
    description: 'The ultimate monument to peak human discipline, wisdom, and lifelong execution.',
    image: '/assets/island.png',
    maxPower: 25000,
    minLevel: 20,
    xpBoostPercent: 25,
    rewardGrant: { coins: 5000, shards: 100, title: 'Grand Sovereign of Auctus' },
  },
};

export const MAX_CITADEL_TIER = 5;

/**
 * Retrieves configuration for a given Citadel tier.
 */
export function getCitadelTierConfig(tier: number): CitadelTierConfig {
  return CITADEL_TIERS[tier] || CITADEL_TIERS[1];
}

/**
 * Validates whether the player can upgrade their Citadel to the next tier.
 */
export function canUpgradeCitadelTier(profile: PlayerProfile): {
  canUpgrade: boolean;
  reason?: string;
  nextTier?: CitadelTierConfig;
} {
  const currentTier = profile.citadelTier || 1;
  if (currentTier >= MAX_CITADEL_TIER) {
    return {
      canUpgrade: false,
      reason: 'Citadel is already at maximum Pinnacle Tier.',
    };
  }

  const nextTierConfig = CITADEL_TIERS[currentTier + 1];
  if (!nextTierConfig) {
    return { canUpgrade: false, reason: 'No higher tier available.' };
  }

  if (profile.citadelPower < profile.citadelMaxPower) {
    return {
      canUpgrade: false,
      reason: `Citadel Power requirement not met (${profile.citadelPower}/${profile.citadelMaxPower}).`,
      nextTier: nextTierConfig,
    };
  }

  if (profile.level < nextTierConfig.minLevel) {
    return {
      canUpgrade: false,
      reason: `Requires Champion Level ${nextTierConfig.minLevel} (Current: LV.${profile.level}).`,
      nextTier: nextTierConfig,
    };
  }

  return {
    canUpgrade: true,
    nextTier: nextTierConfig,
  };
}

/**
 * Upgrades player Citadel tier, granting tier rewards and advancing power threshold.
 */
export function upgradeCitadelEntity(
  profile: PlayerProfile
): { profile: PlayerProfile; upgradedTier: CitadelTierConfig } | null {
  const validation = canUpgradeCitadelTier(profile);
  if (!validation.canUpgrade || !validation.nextTier) {
    return null;
  }

  const nextTier = validation.nextTier;
  const updatedProfile: PlayerProfile = {
    ...profile,
    citadelTier: nextTier.tier,
    citadelMaxPower: nextTier.maxPower,
    title: nextTier.rewardGrant.title,
    coins: profile.coins + nextTier.rewardGrant.coins,
    shards: profile.shards + nextTier.rewardGrant.shards,
    trophyPoints: profile.trophyPoints + 150,
  };

  return {
    profile: updatedProfile,
    upgradedTier: nextTier,
  };
}
