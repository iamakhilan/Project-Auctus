import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  StorageService,
  loadFromStorage,
  saveToStorage,
  INITIAL_PROFILE,
  INITIAL_QUESTS,
  INITIAL_HABITS,
} from '../storage';

const PROFILE_KEY = 'auctus_duo_profile';

describe('loadFromStorage / saveToStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('saveToStorage and loadFromStorage roundtrip', () => {
    const data = { foo: 'bar', num: 42 };
    saveToStorage('test_roundtrip_key', data);
    const loaded = loadFromStorage('test_roundtrip_key', { foo: '', num: 0 });
    expect(loaded).toEqual(data);
  });

  it('loadFromStorage returns fallback when key missing', () => {
    const fallback = { fallback: true };
    expect(loadFromStorage('missing_key_xyz', fallback)).toEqual(fallback);
  });

  it('loadFromStorage returns fallback on corrupt JSON', () => {
    localStorage.setItem('corrupt_key', '{ not valid json,,,');
    const fallback = { ok: false };
    expect(loadFromStorage('corrupt_key', fallback)).toEqual(fallback);
  });

  it('loadFromStorage returns fallback when getItem throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('getItem failed');
    });
    const fallback = { fallback: true };
    expect(loadFromStorage('any_key', fallback)).toEqual(fallback);
  });

  it('saveToStorage does not throw when setItem throws (quota)', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceeded');
    });
    expect(() => saveToStorage('quota_key', { x: 1 })).not.toThrow();
  });
});

describe('StorageService get/set roundtrip with mocked localStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('setProfile / getProfile roundtrip', () => {
    const custom = { ...INITIAL_PROFILE, name: 'Test Commander', coins: 9999, level: 99 };
    StorageService.setProfile(custom);
    expect(StorageService.getProfile()).toEqual(custom);
  });

  it('setQuests / getQuests roundtrip', () => {
    const customQuests = [{ ...INITIAL_QUESTS[0], title: 'Custom Quest Title' }];
    StorageService.setQuests(customQuests);
    expect(StorageService.getQuests()).toEqual(customQuests);
  });

  it('setHabits / getHabits roundtrip', () => {
    const customHabits = [{ ...INITIAL_HABITS[0], title: 'Custom Habit' }];
    StorageService.setHabits(customHabits);
    expect(StorageService.getHabits()).toEqual(customHabits);
  });

  it('setTransactions / getTransactions roundtrip including FocusState null', () => {
    StorageService.setFocusState(null);
    expect(StorageService.getFocusState()).toBeNull();

    const focus = {
      isActive: true,
      isPaused: false,
      targetDurationSeconds: 1500,
      remainingSeconds: 1200,
      accumulatedXp: 10,
      accumulatedCoins: 5,
      isOvercharged: false,
      soundscapeTrack: 'none' as const,
    };
    StorageService.setFocusState(focus);
    expect(StorageService.getFocusState()).toEqual(focus);
  });

  it('falls back to initial data on corrupt JSON', () => {
    localStorage.setItem(PROFILE_KEY, '{ corrupt json');
    expect(StorageService.getProfile()).toEqual(INITIAL_PROFILE);

    localStorage.setItem('auctus_duo_quests', 'not-json-at-all');
    expect(StorageService.getQuests()).toEqual(INITIAL_QUESTS);
  });

  it('falls back to initial data when getItem throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage failure');
    });
    expect(StorageService.getProfile()).toEqual(INITIAL_PROFILE);
    expect(StorageService.getQuests()).toEqual(INITIAL_QUESTS);
  });

  it('exportBackup and importBackup roundtrip', () => {
    const customProfile = { ...INITIAL_PROFILE, name: 'Backup Test' };
    StorageService.setProfile(customProfile);

    const backupJson = StorageService.exportBackup();
    const parsed = JSON.parse(backupJson);
    expect(parsed.profile.name).toBe('Backup Test');
    expect(parsed.exportedAt).toBeDefined();

    // clear and restore
    localStorage.clear();
    expect(StorageService.getProfile()).toEqual(INITIAL_PROFILE);

    const ok = StorageService.importBackup(backupJson);
    expect(ok).toBe(true);
    expect(StorageService.getProfile()).toEqual(customProfile);
  });

  it('importBackup returns false on invalid JSON and does not corrupt storage', () => {
    const before = StorageService.getProfile();
    const result = StorageService.importBackup('{ not valid json');
    expect(result).toBe(false);
    expect(StorageService.getProfile()).toEqual(before);
  });

  it('importBackup handles partial backup (only profile)', () => {
    const partial = JSON.stringify({ profile: { ...INITIAL_PROFILE, name: 'Partial' } });
    const ok = StorageService.importBackup(partial);
    expect(ok).toBe(true);
    expect(StorageService.getProfile().name).toBe('Partial');
  });

  it('uses mocked localStorage via spy for get/set', () => {
    const setSpy = vi.spyOn(Storage.prototype, 'setItem');
    const getSpy = vi.spyOn(Storage.prototype, 'getItem');

    const custom = { ...INITIAL_PROFILE, name: 'Spy Test' };
    StorageService.setProfile(custom);
    expect(setSpy).toHaveBeenCalledWith(PROFILE_KEY, JSON.stringify(custom));

    getSpy.mockReturnValue(JSON.stringify(custom));
    expect(StorageService.getProfile()).toEqual(custom);
  });

  it('exportBackup includes version 2.0 and roundtrips', () => {
    const json = StorageService.exportBackup();
    const parsed = JSON.parse(json);
    expect(parsed.version).toBe('2.0');
    expect(parsed.exportedAt).toBeDefined();
    // roundtrip should succeed
    localStorage.clear();
    expect(StorageService.importBackup(json)).toBe(true);
  });

  it('importBackup accepts legacy backup without version', () => {
    const legacy = JSON.stringify({ profile: INITIAL_PROFILE, quests: [], habits: [] });
    expect(StorageService.importBackup(legacy)).toBe(true);
    expect(StorageService.getProfile().name).toBe(INITIAL_PROFILE.name);
  });
});
