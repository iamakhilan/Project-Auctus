import { ChestSlot } from '../../types';

export type ChestTier = 'silver' | 'gold' | 'magical' | 'relic';

export interface ChestTierConfig {
  tier: ChestTier;
  name: string;
  image: string;
  totalUnlockSeconds: number;
  baseCoins: number;
  baseXp: number;
  shards: number;
}

export const CHEST_TIERS: Record<ChestTier, ChestTierConfig> = {
  silver: {
    tier: 'silver',
    name: 'Silver Quest Chest',
    image: '/assets/chest_silver.png',
    totalUnlockSeconds: 3600, // 1 hour
    baseCoins: 75,
    baseXp: 120,
    shards: 1,
  },
  gold: {
    tier: 'gold',
    name: 'Gold Vault Chest',
    image: '/assets/chest_gold.png',
    totalUnlockSeconds: 10800, // 3 hours
    baseCoins: 180,
    baseXp: 250,
    shards: 2,
  },
  magical: {
    tier: 'magical',
    name: 'Crown Relic Vault',
    image: '/assets/chest_gold.png',
    totalUnlockSeconds: 21600, // 6 hours
    baseCoins: 350,
    baseXp: 450,
    shards: 4,
  },
  relic: {
    tier: 'relic',
    name: 'Citadel Apex Relic',
    image: '/assets/chest_ready.png',
    totalUnlockSeconds: 43200, // 12 hours
    baseCoins: 800,
    baseXp: 1000,
    shards: 10,
  },
};

/**
 * Rolls a random chest tier based on standard RPG weighted drop rates.
 */
export function rollChestTier(randomSeed = Math.random()): ChestTier {
  if (randomSeed < 0.60) return 'silver'; // 60%
  if (randomSeed < 0.90) return 'gold';   // 30%
  if (randomSeed < 0.98) return 'magical'; // 8%
  return 'relic';                         // 2%
}

/**
 * Creates a new ChestSlot entity for a given slot index and tier.
 */
export function createChestSlotEntity(
  slotIndex: number,
  tier: ChestTier = 'silver'
): ChestSlot {
  const config = CHEST_TIERS[tier];
  return {
    id: `chest-${Date.now()}-${slotIndex}`,
    slotIndex,
    name: config.name,
    tier: config.tier,
    status: 'queued',
    unlockTimeRemainingSeconds: config.totalUnlockSeconds,
    totalUnlockSeconds: config.totalUnlockSeconds,
    image: config.image,
    coinsReward: config.baseCoins,
    xpReward: config.baseXp,
    shardsReward: config.shards,
  };
}

/**
 * Finds the first available empty slot index in a deck of 4 slots.
 */
export function findAvailableSlotIndex(deck: ChestSlot[]): number {
  return deck.findIndex(slot => slot.status === 'empty' || slot.tier === 'empty');
}

/**
 * Creates an empty chest slot.
 */
export function createEmptyChestSlot(slotIndex: number): ChestSlot {
  return {
    id: `slot-empty-${slotIndex}`,
    slotIndex,
    name: 'Empty Slot',
    tier: 'empty',
    status: 'empty',
    unlockTimeRemainingSeconds: 0,
    totalUnlockSeconds: 0,
    image: '',
    coinsReward: 0,
    xpReward: 0,
    shardsReward: 0,
  };
}
