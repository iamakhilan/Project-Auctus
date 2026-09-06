import { describe, it, expect } from 'vitest';
import {
  rollChestTier,
  createChestSlotEntity,
  findAvailableSlotIndex,
  createEmptyChestSlot,
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
});
