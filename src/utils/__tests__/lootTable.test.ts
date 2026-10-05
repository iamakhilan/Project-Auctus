import { describe, it, expect } from 'vitest';
import { rollLootChestDrop, CHEST_BASE_DROPS } from '../lootTable';

describe('Loot Table Engine', () => {
  it('contains valid base configs for all tiers', () => {
    expect(CHEST_BASE_DROPS.bronze.minCoins).toBeLessThan(CHEST_BASE_DROPS.bronze.maxCoins);
    expect(CHEST_BASE_DROPS.silver.xp).toBeGreaterThan(CHEST_BASE_DROPS.bronze.xp);
    expect(CHEST_BASE_DROPS.gold.gems).toBeGreaterThan(CHEST_BASE_DROPS.silver.gems);
    expect(CHEST_BASE_DROPS.mythic.gems).toBeGreaterThan(CHEST_BASE_DROPS.gold.gems);
  });

  it('rolls randomized drops within expected bounds', () => {
    const bronzeDrop = rollLootChestDrop('bronze');
    expect(bronzeDrop.coins).toBeGreaterThanOrEqual(CHEST_BASE_DROPS.bronze.minCoins);
    expect(bronzeDrop.coins).toBeLessThanOrEqual(CHEST_BASE_DROPS.bronze.maxCoins);
    expect(bronzeDrop.xp).toBe(30);
    expect(bronzeDrop.gems).toBe(2);

    const mythicDrop = rollLootChestDrop('mythic');
    expect(mythicDrop.coins).toBeGreaterThanOrEqual(CHEST_BASE_DROPS.mythic.minCoins);
    expect(mythicDrop.coins).toBeLessThanOrEqual(CHEST_BASE_DROPS.mythic.maxCoins);
    expect(mythicDrop.xp).toBe(250);
    expect(mythicDrop.gems).toBe(30);
  });
});
