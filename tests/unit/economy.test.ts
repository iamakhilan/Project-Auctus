import { describe, it, expect } from 'vitest';
import {
  validateRedemption,
  deductCoins,
  createCustomRewardEntity,
} from '../../src/domain/economy';
import { initialProfile, initialRewards } from '../../src/utils/storage';

describe('Economy Domain Engine', () => {
  it('should validate affordable and unlocked rewards', () => {
    const profile = { ...initialProfile, coins: 500, level: 5 };
    const reward = initialRewards.find(r => r.id === 'reward-espresso')!;
    const validation = validateRedemption(profile, reward);

    expect(validation.isValid).toBe(true);
    expect(validation.canAfford).toBe(true);
  });

  it('should reject redemption if coins are insufficient', () => {
    const profile = { ...initialProfile, coins: 50 };
    const reward = initialRewards.find(r => r.id === 'reward-game-night')!; // cost 300
    const validation = validateRedemption(profile, reward);

    expect(validation.isValid).toBe(false);
    expect(validation.canAfford).toBe(false);
    expect(validation.reason).toContain('Insufficient Gold Coins');
  });

  it('should reject redemption if required level is not reached', () => {
    const profile = { ...initialProfile, coins: 1000, level: 3 };
    const reward = initialRewards.find(r => r.id === 'reward-island-skin')!; // level 10
    const validation = validateRedemption(profile, reward);

    expect(validation.isValid).toBe(false);
    expect(validation.meetsLevelReq).toBe(false);
    expect(validation.reason).toContain('Level 10');
  });

  it('should deduct coins cleanly and protect from negative balance', () => {
    const profile = { ...initialProfile, coins: 200 };
    const updated = deductCoins(profile, 150);
    expect(updated).not.toBeNull();
    expect(updated?.coins).toBe(50);

    const invalidDeduction = deductCoins(profile, 300);
    expect(invalidDeduction).toBeNull();
  });

  it('should create custom reward entity with positive cost', () => {
    const custom = createCustomRewardEntity('1 Hour Walk in Park', 80, 'Health', 'nature');
    expect(custom.title).toBe('1 Hour Walk in Park');
    expect(custom.cost).toBe(80);
    expect(custom.isCustom).toBe(true);
    expect(custom.unlocked).toBe(true);
  });
});
