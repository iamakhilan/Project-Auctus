import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  safeParseJson,
  migrateV1ToV2,
  loadProfileV2,
  saveProfileV2,
  loadQuestsV2,
  loadChestsV2,
  loadHabitsV2,
  loadTransactionsV2,
  loadAchievementsV2,
  exportAuctusBackup,
  importAuctusBackup,
  V1_KEYS,
  V2_KEYS,
} from '../../src/services/storage';
import { initialProfile, initialQuests } from '../../src/utils/storage';

describe('Storage & Schema Migration Service', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should safely parse JSON and return fallbacks on corrupted data', () => {
    // Suppress expected console.warn for invalid json test
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(safeParseJson('{"a":1}', { a: 0 })).toEqual({ a: 1 });
    expect(safeParseJson('invalid json syntax', { fallback: true })).toEqual({ fallback: true });
    expect(safeParseJson('', { empty: true })).toEqual({ empty: true });
    expect(safeParseJson(null, { nullCase: true })).toEqual({ nullCase: true });
    warnSpy.mockRestore();
  });

  it('should migrate legacy V1 data to V2 schema with backup preservation', () => {
    const legacyProfile = { ...initialProfile, name: 'Commander Test', coins: 999 };
    const legacyQuests = [{ ...initialQuests[0], title: 'Legacy Mission 1' }];
    window.localStorage.setItem(V1_KEYS.PROFILE, JSON.stringify(legacyProfile));
    window.localStorage.setItem(V1_KEYS.QUESTS, JSON.stringify(legacyQuests));

    const migration = migrateV1ToV2();
    expect(migration.migrated).toBe(true);
    expect(migration.data.profile.name).toBe('Commander Test');
    expect(migration.data.profile.coins).toBe(999);
    expect(migration.data.quests[0].title).toBe('Legacy Mission 1');
    expect(migration.data.schemaVersion).toBe(2);

    // Verify backup key was created
    const backup = window.localStorage.getItem(V2_KEYS.BACKUP_V1);
    expect(backup).not.toBeNull();
  });

  it('should roundtrip export and import backups cleanly', () => {
    const customProfile = { ...initialProfile, name: 'Backup Master', coins: 777 };
    saveProfileV2(customProfile);

    const backupJson = exportAuctusBackup();
    expect(backupJson).toContain('Backup Master');
    expect(backupJson).toContain('schemaVersion');

    // Clear and re-import
    window.localStorage.clear();
    expect(loadProfileV2().name).toBe(initialProfile.name);

    const importResult = importAuctusBackup(backupJson);
    expect(importResult.success).toBe(true);
    expect(loadProfileV2().name).toBe('Backup Master');
    expect(loadProfileV2().coins).toBe(777);
  });

  it('should reject invalid or malformed backup JSON payloads safely', () => {
    const invalidResult = importAuctusBackup('{ not valid json');
    expect(invalidResult.success).toBe(false);
    expect(invalidResult.error).toContain('JSON parse error');

    const emptyResult = importAuctusBackup('');
    expect(emptyResult.success).toBe(false);
    expect(emptyResult.error).toContain('Empty or invalid');

    const missingProfileResult = importAuctusBackup(JSON.stringify({ quests: [] }));
    expect(missingProfileResult.success).toBe(false);
    expect(missingProfileResult.error).toContain('missing required profile');

    const invalidQuestsResult = importAuctusBackup(JSON.stringify({ profile: initialProfile, quests: 'not-an-array' }));
    expect(invalidQuestsResult.success).toBe(false);
    expect(invalidQuestsResult.error).toContain('invalid quests format');
  });

  it('should safely initialize all V2 default entities when local storage is empty', () => {
    const profile = loadProfileV2();
    const quests = loadQuestsV2();
    const chests = loadChestsV2();
    const habits = loadHabitsV2();
    const transactions = loadTransactionsV2();
    const achievements = loadAchievementsV2();

    expect(profile).toBeDefined();
    expect(Array.isArray(quests)).toBe(true);
    expect(chests.length).toBe(4);
    expect(Array.isArray(habits)).toBe(true);
    expect(Array.isArray(transactions)).toBe(true);
    expect(achievements.length).toBeGreaterThan(10);
  });
});
