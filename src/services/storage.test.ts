import { beforeEach, describe, expect, it } from 'vitest';
import { INITIAL_PROFILE, StorageService, loadFromStorage } from './storage';

describe('storage and backup behavior', () => {
  beforeEach(() => localStorage.clear());

  it('falls back when persisted JSON is malformed', () => {
    localStorage.setItem('auctus_duo_profile', '{not-json');
    expect(StorageService.getProfile()).toEqual(INITIAL_PROFILE);
  });

  it('falls back when the profile payload is missing', () => {
    expect(StorageService.getProfile()).toEqual(INITIAL_PROFILE);
  });

  it('supports the generic storage loader with a fallback', () => {
    localStorage.setItem('test-value', JSON.stringify({ ok: true }));
    expect(loadFromStorage('test-value', { ok: false })).toEqual({ ok: true });
    expect(loadFromStorage('missing-value', { ok: false })).toEqual({ ok: false });
  });

  it('exports a self-contained JSON backup', () => {
    const backup = JSON.parse(StorageService.exportBackup());
    expect(backup.profile).toEqual(INITIAL_PROFILE);
    expect(backup.quests).toBeInstanceOf(Array);
    expect(backup.habits).toBeInstanceOf(Array);
    expect(backup.chests).toBeInstanceOf(Array);
    expect(backup.rewards).toBeInstanceOf(Array);
    expect(backup.achievements).toBeInstanceOf(Array);
    expect(backup.transactions).toBeInstanceOf(Array);
    expect(backup.exportedAt).toEqual(expect.any(String));
  });

  it('does not mutate state when importing malformed JSON', () => {
    StorageService.setProfile(INITIAL_PROFILE);
    expect(StorageService.importBackup('{not-json')).toBe(false);
    expect(StorageService.getProfile()).toEqual(INITIAL_PROFILE);
  });
});
