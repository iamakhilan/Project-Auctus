import { ChestTier } from '../types';

export interface LootChestDrop {
  tier: ChestTier;
  coins: number;
  xp: number;
  gems: number;
  bonusItem?: string;
}

export const CHEST_BASE_DROPS: Record<ChestTier, { minCoins: number; maxCoins: number; xp: number; gems: number; bonusChance: number }> = {
  bronze: { minCoins: 30, maxCoins: 70, xp: 30, gems: 2, bonusChance: 0.1 },
  silver: { minCoins: 80, maxCoins: 150, xp: 60, gems: 5, bonusChance: 0.25 },
  gold: { minCoins: 180, maxCoins: 300, xp: 120, gems: 12, bonusChance: 0.5 },
  mythic: { minCoins: 350, maxCoins: 600, xp: 250, gems: 30, bonusChance: 0.9 },
};

export const rollLootChestDrop = (tier: ChestTier): LootChestDrop => {
  const cfg = CHEST_BASE_DROPS[tier] || CHEST_BASE_DROPS.bronze;
  const coins = Math.floor(Math.random() * (cfg.maxCoins - cfg.minCoins + 1)) + cfg.minCoins;
  const hasBonus = Math.random() < cfg.bonusChance;

  let bonusItem: string | undefined;
  if (hasBonus) {
    if (tier === 'mythic') bonusItem = 'Streak Shield Potion';
    else if (tier === 'gold') bonusItem = 'Mana Overcharge Rune';
    else bonusItem = 'Focus Tea Elixir';
  }

  return {
    tier,
    coins,
    xp: cfg.xp,
    gems: cfg.gems,
    bonusItem,
  };
};
