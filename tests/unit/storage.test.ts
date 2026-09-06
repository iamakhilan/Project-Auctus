import { describe, it, expect, beforeEach } from 'vitest';
import {
  safeParseJson,
  migrateV1ToV2,
  loadProfileV2,
  saveProfileV2,
  exportAuctusBackup,
  importAuctusBackup,
  V1_KEYS,
  V2_KEYS,
} from '../../src/services/storage';
import { initialProfile } from '../../src/utils/storage';

describe('Storage & Schema Migration Service', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should safely parse JSON and return fallbacks on corrupted data', () => {
    expect(safeParseJson('{"a":1}', { a: 0 })).toEqual({ a: 1 });
    expect(safeParseJson('invalid json syntax', { fallback: true })).toEqual({ fallback: true });
    expect(safeParseJson('', { empty: true })).toEqual({ empty: true });
    expect(safeParseJson(null, { nullCase: true })).toEqual({ nullCase: true });
  });

  it('should migrate legacy V1 data to V2 schema with backup preservation', () => {
    const legacyProfile = { ...initialProfile, name: 'Commander Test', coins: 999 };
    window.localStorage.setItem(V1_KEYS.PROFILE, JSON.stringify(legacyProfile));

    const migration = migrateV1ToV2();
    expect(migration.migrated).toBe(true);
    expect(migration.data.profile.name).toBe('Commander Test');
    expect(migration.data.profile.coins).toBe(999);
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

    const missingProfileResult = importAuctusBackup(JSON.stringify({ quests: [] }));
    expect(missingProfileResult.success).toBe(false);
    expect(missingProfileResult.error).toContain('missing required profile');
  });
});
