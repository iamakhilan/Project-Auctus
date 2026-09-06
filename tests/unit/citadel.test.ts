import { describe, it, expect } from 'vitest';
import {
  getCitadelTierConfig,
  canUpgradeCitadelTier,
  upgradeCitadelEntity,
  MAX_CITADEL_TIER,
} from '../../src/domain/citadel';
import { PlayerProfile } from '../../src/types';
import { initialProfile } from '../../src/utils/storage';

describe('Citadel Progression Domain Engine', () => {
  it('should retrieve proper tier config for all tiers', () => {
    const tier1 = getCitadelTierConfig(1);
    expect(tier1.tier).toBe(1);
    expect(tier1.name).toBe('Genesis Outpost');

    const tier2 = getCitadelTierConfig(2);
    expect(tier2.tier).toBe(2);
    expect(tier2.name).toBe('Emerald Stronghold');
    expect(tier2.minLevel).toBe(4);
    expect(tier2.maxPower).toBe(2500);

    const tier5 = getCitadelTierConfig(5);
    expect(tier5.tier).toBe(5);
    expect(tier5.name).toBe('Celestial Apex Citadel');
  });

  it('should block upgrade if power requirement is not met', () => {
    const profile: PlayerProfile = {
      ...initialProfile,
      citadelTier: 1,
      citadelPower: 500,
      citadelMaxPower: 1000,
      level: 5,
    };

    const result = canUpgradeCitadelTier(profile);
    expect(result.canUpgrade).toBe(false);
    expect(result.reason).toContain('Citadel Power requirement not met');
  });

  it('should block upgrade if level requirement is not met', () => {
    const profile: PlayerProfile = {
      ...initialProfile,
      citadelTier: 1,
      citadelPower: 1000,
      citadelMaxPower: 1000,
      level: 2, // Tier 2 requires Level 4
    };

    const result = canUpgradeCitadelTier(profile);
    expect(result.canUpgrade).toBe(false);
    expect(result.reason).toContain('Requires Champion Level 4');
  });

  it('should allow and perform valid Citadel upgrade', () => {
    const profile: PlayerProfile = {
      ...initialProfile,
      citadelTier: 1,
      citadelPower: 1000,
      citadelMaxPower: 1000,
      level: 5,
      coins: 200,
      shards: 5,
    };

    const validation = canUpgradeCitadelTier(profile);
    expect(validation.canUpgrade).toBe(true);
    expect(validation.nextTier?.tier).toBe(2);

    const upgradeRes = upgradeCitadelEntity(profile);
    expect(upgradeRes).not.toBeNull();
    expect(upgradeRes?.profile.citadelTier).toBe(2);
    expect(upgradeRes?.profile.citadelMaxPower).toBe(2500);
    expect(upgradeRes?.profile.title).toBe('Emerald Sentinel');
    expect(upgradeRes?.profile.coins).toBe(200 + 300); // granted 300 coins
    expect(upgradeRes?.profile.shards).toBe(5 + 5);    // granted 5 shards
  });

  it('should block upgrade once pinnacle max tier is reached', () => {
    const maxProfile: PlayerProfile = {
      ...initialProfile,
      citadelTier: MAX_CITADEL_TIER,
      citadelPower: 25000,
      citadelMaxPower: 25000,
      level: 25,
    };

    const validation = canUpgradeCitadelTier(maxProfile);
    expect(validation.canUpgrade).toBe(false);
    expect(validation.reason).toContain('Citadel is already at maximum Pinnacle Tier');
    expect(upgradeCitadelEntity(maxProfile)).toBeNull();
  });
});
