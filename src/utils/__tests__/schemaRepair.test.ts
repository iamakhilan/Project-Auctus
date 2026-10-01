import { describe, it, expect } from 'vitest';
import { repairCorruptedBackup } from '../schemaRepair';

describe('schemaRepair', () => {
  it('returns null for non-JSON strings', () => {
    expect(repairCorruptedBackup('invalid { json')).toBeNull();
  });

  it('repairs missing arrays and version string', () => {
    const broken = JSON.stringify({
      profile: { name: 'Player' },
    });

    const res = repairCorruptedBackup(broken);
    expect(res).not.toBeNull();
    expect(res?.repairedPayload.version).toBe('2.0');
    expect(Array.isArray(res?.repairedPayload.quests)).toBe(true);
    expect(Array.isArray(res?.repairedPayload.habits)).toBe(true);
    expect(Array.isArray(res?.repairedPayload.transactions)).toBe(true);
    expect(res?.issuesFixed.length).toBeGreaterThan(0);
  });
});
