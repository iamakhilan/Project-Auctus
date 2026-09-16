import { beforeEach, describe, expect, it } from 'vitest';
import {
  INITIAL_PROFILE,
  StorageService,
  isValidFocus,
  isValidProfile,
  loadFromStorage,
} from './storage';

describe('storage validation and backup contract', () => {
  beforeEach(() => localStorage.clear());

  it('falls back when persisted JSON is malformed', () => {
    localStorage.setItem('auctus_duo_profile', '{not-json');
    expect(StorageService.getProfile()).toEqual(INITIAL_PROFILE);
  });

  it('falls back when persisted data has the wrong shape', () => {
    localStorage.setItem('auctus_duo_profile', JSON.stringify({ coins: 'lots' }));
    expect(StorageService.getProfile()).toEqual(INITIAL_PROFILE);
  });

  it('supports validated generic storage reads', () => {
    localStorage.setItem('profile', JSON.stringify(INITIAL_PROFILE));
    expect(loadFromStorage('profile', { name: 'fallback' }, isValidProfile)).toEqual(INITIAL_PROFILE);

    localStorage.setItem('profile', JSON.stringify({ name: 42 }));
    expect(loadFromStorage('profile', { name: 'fallback' }, isValidProfile)).toEqual({ name: 'fallback' });
  });

  it('rejects unsafe focus state values through the validator', () => {
    expect(isValidFocus({
      isActive: true,
      isPaused: false,
      targetDurationSeconds: -1,
      remainingSeconds: 0,
      accumulatedXp: 0,
      accumulatedCoins: 0,
      isOvercharged: false,
      soundscapeTrack: 'none',
    })).toBe(false);
  });

  it('exports a versioned, self-contained backup', () => {
    const backup = JSON.parse(StorageService.exportBackup());
    expect(backup.version).toBe(1);
    expect(backup.profile).toBeDefined();
    expect(backup.quests).toBeInstanceOf(Array);
    expect(backup.habits).toBeInstanceOf(Array);
    expect(backup.chests).toBeInstanceOf(Array);
    expect(backup.rewards).toBeInstanceOf(Array);
    expect(backup.achievements).toBeInstanceOf(Array);
    expect(backup.transactions).toBeInstanceOf(Array);
    expect(backup.exportedAt).toEqual(expect.any(String));
  });

  it('does not mutate state when importing invalid JSON', () => {
    StorageService.setProfile(INITIAL_PROFILE);
    expect(StorageService.importBackup('{"version":1,"profile":{"coins":"infinite"}}')).toBe(false);
    expect(StorageService.getProfile()).toEqual(INITIAL_PROFILE);
  });
});
