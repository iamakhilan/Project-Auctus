import { describe, it, expect } from 'vitest';
import {
  rollChestTier,
  createChestSlotEntity,
  findAvailableSlotIndex,
  createEmptyChestSlot,
  startChestUnlockEntity,
  calculateChestRemainingSeconds,
  syncChestStatusWithTimestamp,
  calculateSpeedUpCost,
  speedUpChestUnlockEntity,
  rollChestLoot,
  CHEST_TIERS,
} from '../../src/domain/chests';
import { ChestSlot } from '../../src/types';

describe('Chests Domain Engine', () => {
  it('should roll chest tiers according to probability brackets', () => {
    expect(rollChestTier(0.1)).toBe('silver');
    expect(rollChestTier(0.59)).toBe('silver');
    expect(rollChestTier(0.70)).toBe('gold');
    expect(rollChestTier(0.89)).toBe('gold');
    expect(rollChestTier(0.95)).toBe('magical');
    expect(rollChestTier(0.99)).toBe('relic');
  });

  it('should create chest slot entity with proper tier parameters', () => {
    const silverChest = createChestSlotEntity(0, 'silver');
    expect(silverChest.tier).toBe('silver');
    expect(silverChest.status).toBe('queued');
    expect(silverChest.totalUnlockSeconds).toBe(CHEST_TIERS.silver.totalUnlockSeconds);
    expect(silverChest.coinsReward).toBe(CHEST_TIERS.silver.baseCoins);

    const relicChest = createChestSlotEntity(3, 'relic');
    expect(relicChest.tier).toBe('relic');
    expect(relicChest.shardsReward).toBe(10);
  });

  it('should find first empty slot index or return -1 if deck is full', () => {
    const deck: ChestSlot[] = [
      createChestSlotEntity(0, 'silver'),
      createChestSlotEntity(1, 'gold'),
      createEmptyChestSlot(2),
      createEmptyChestSlot(3),
    ];

    expect(findAvailableSlotIndex(deck)).toBe(2);

    const fullDeck: ChestSlot[] = [
      createChestSlotEntity(0, 'silver'),
      createChestSlotEntity(1, 'gold'),
      createChestSlotEntity(2, 'magical'),
      createChestSlotEntity(3, 'relic'),
    ];

    expect(findAvailableSlotIndex(fullDeck)).toBe(-1);
  });

  it('should start unlock with wall-clock timestamps and calculate remaining seconds accurately', () => {
    const chest = createChestSlotEntity(0, 'silver'); // 3600 seconds
    const startTime = 1000000;
    const unlockingChest = startChestUnlockEntity(chest, startTime);

    expect(unlockingChest.status).toBe('unlocking');
    expect(unlockingChest.unlockStartedAt).toBe(startTime);
    expect(unlockingChest.unlockEndsAt).toBe(startTime + 3600 * 1000);

    // 1000 seconds later
    const rem1 = calculateChestRemainingSeconds(unlockingChest, startTime + 1000 * 1000);
    expect(rem1).toBe(2600);

    // After 3600 seconds (exact finish)
    const rem2 = calculateChestRemainingSeconds(unlockingChest, startTime + 3600 * 1000);
    expect(rem2).toBe(0);

    // After 4000 seconds (overtime)
    const rem3 = calculateChestRemainingSeconds(unlockingChest, startTime + 4000 * 1000);
    expect(rem3).toBe(0);
  });

  it('should sync chest status with timestamps (resilient across tab closes and app reboots)', () => {
    const chest = createChestSlotEntity(0, 'silver');
    const startTime = 1000000;
    const unlockingChest = startChestUnlockEntity(chest, startTime);

    // 10 minutes in
    const syncedMid = syncChestStatusWithTimestamp(unlockingChest, startTime + 600 * 1000);
    expect(syncedMid.status).toBe('unlocking');
    expect(syncedMid.unlockTimeRemainingSeconds).toBe(3000);

    // 2 hours in (timer finished while user was away)
    const syncedComplete = syncChestStatusWithTimestamp(unlockingChest, startTime + 7200 * 1000);
    expect(syncedComplete.status).toBe('ready');
    expect(syncedComplete.unlockTimeRemainingSeconds).toBe(0);
  });

  it('should calculate speed up costs and instantly ready a chest', () => {
    expect(calculateSpeedUpCost(0)).toBe(0);
    expect(calculateSpeedUpCost(1200)).toBe(1); // 20m remaining -> 1 shard
    expect(calculateSpeedUpCost(3600)).toBe(1); // 1h remaining -> 1 shard
    expect(calculateSpeedUpCost(7200)).toBe(2); // 2h remaining -> 2 shards
    expect(calculateSpeedUpCost(21600)).toBe(6); // 6h remaining -> 6 shards

    const unlockingChest = startChestUnlockEntity(createChestSlotEntity(0, 'gold'));
    const spedUp = speedUpChestUnlockEntity(unlockingChest);
    expect(spedUp.status).toBe('ready');
    expect(spedUp.unlockTimeRemainingSeconds).toBe(0);
  });

  it('should roll chest loot with level scaling and reward parameters', () => {
    const level1Loot = rollChestLoot('gold', 1, 0.5);
    expect(level1Loot.coins).toBeGreaterThanOrEqual(160);
    expect(level1Loot.xp).toBeGreaterThanOrEqual(220);
    expect(level1Loot.shards).toBe(2);

    const level10Loot = rollChestLoot('gold', 10, 0.5);
    expect(level10Loot.xp).toBeGreaterThan(level1Loot.xp);
  });
});
