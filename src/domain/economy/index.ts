import { RewardItem, PlayerProfile } from '../../types';

export interface RedemptionValidation {
  canAfford: boolean;
  meetsLevelReq: boolean;
  isValid: boolean;
  reason?: string;
}

/**
 * Validates whether a player can redeem a reward.
 */
export function validateRedemption(
  profile: PlayerProfile,
  reward: RewardItem
): RedemptionValidation {
  if (reward.requiredLevel && profile.level < reward.requiredLevel) {
    return {
      canAfford: profile.coins >= reward.cost,
      meetsLevelReq: false,
      isValid: false,
      reason: `Requires Citadel Champion Level ${reward.requiredLevel}.`,
    };
  }

  if (!reward.unlocked) {
    return {
      canAfford: profile.coins >= reward.cost,
      meetsLevelReq: true,
      isValid: false,
      reason: 'Reward is currently locked.',
    };
  }

  if (profile.coins < reward.cost) {
    return {
      canAfford: false,
      meetsLevelReq: true,
      isValid: false,
      reason: `Insufficient Gold Coins. Need ${reward.cost - profile.coins} more.`,
    };
  }

  return {
    canAfford: true,
    meetsLevelReq: true,
    isValid: true,
  };
}

/**
 * Pure function to deduct coins safely and return updated profile.
 */
export function deductCoins(profile: PlayerProfile, amount: number): PlayerProfile | null {
  if (amount < 0 || profile.coins < amount) {
    return null;
  }
  return {
    ...profile,
    coins: profile.coins - amount,
  };
}

/**
 * Creates a custom player reward item.
 */
export function createCustomRewardEntity(
  title: string,
  cost: number,
  category: string,
  icon: string
): RewardItem {
  return {
    id: `reward-custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: title.trim(),
    cost: Math.max(1, Math.round(cost)),
    category: category.trim() || 'Custom Bounty',
    icon: icon || 'stars',
    type: 'irl',
    unlocked: true,
    description: 'Custom player-defined real-world reward.',
    isCustom: true,
  };
}

export * from './ledger';

