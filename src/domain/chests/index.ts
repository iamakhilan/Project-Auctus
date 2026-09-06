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
 * Calculates dynamic loot yields with minor variance.
 */
export function rollChestLoot(
  tier: ChestTier,
  playerLevel = 1,
  randomVariance = Math.random()
): { xp: number; coins: number; shards: number } {
  const config = CHEST_TIERS[tier];
  if (!config) return { xp: 50, coins: 50, shards: 0 };

  const levelMult = 1 + (playerLevel - 1) * 0.05; // 5% bonus per level
  const varianceMult = 0.9 + randomVariance * 0.2; // 0.9x to 1.1x

  return {
    xp: Math.round(config.baseXp * levelMult * varianceMult),
    coins: Math.round(config.baseCoins * levelMult * varianceMult),
    shards: config.shards,
  };
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
 * Initiates the timestamp-based countdown for a chest.
 */
export function startChestUnlockEntity(slot: ChestSlot, now = Date.now()): ChestSlot {
  if (slot.status !== 'queued' && slot.status !== 'locked') return slot;

  const durationSec = slot.totalUnlockSeconds || 3600;
  return {
    ...slot,
    status: 'unlocking',
    unlockStartedAt: now,
    unlockEndsAt: now + durationSec * 1000,
    unlockTimeRemainingSeconds: durationSec,
  };
}

/**
 * Calculates accurate remaining seconds using wall-clock timestamps.
 */
export function calculateChestRemainingSeconds(slot: ChestSlot, now = Date.now()): number {
  if (slot.status === 'ready') return 0;
  if (slot.status !== 'unlocking') return slot.unlockTimeRemainingSeconds;

  if (slot.unlockEndsAt) {
    return Math.max(0, Math.ceil((slot.unlockEndsAt - now) / 1000));
  }
  return slot.unlockTimeRemainingSeconds;
}

/**
 * Recomputes chest status based on wall-clock time.
 */
export function syncChestStatusWithTimestamp(slot: ChestSlot, now = Date.now()): ChestSlot {
  if (slot.status !== 'unlocking') return slot;

  const remaining = calculateChestRemainingSeconds(slot, now);
  if (remaining <= 0) {
    return {
      ...slot,
      status: 'ready',
      unlockTimeRemainingSeconds: 0,
      image: '/assets/chest_ready.png',
    };
  }

  return {
    ...slot,
    unlockTimeRemainingSeconds: remaining,
  };
}

/**
 * Calculates the Spire Shards cost required to instantly unlock a chest.
 * Rate: 1 Spire Shard per 3600 seconds (1 hour) remaining, min 1 shard.
 */
export function calculateSpeedUpCost(remainingSeconds: number): number {
  if (remainingSeconds <= 0) return 0;
  return Math.max(1, Math.ceil(remainingSeconds / 3600));
}

/**
 * Instantly completes chest unlock via speed-up.
 */
export function speedUpChestUnlockEntity(slot: ChestSlot): ChestSlot {
  return {
    ...slot,
    status: 'ready',
    unlockTimeRemainingSeconds: 0,
    unlockEndsAt: undefined,
    image: '/assets/chest_ready.png',
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
