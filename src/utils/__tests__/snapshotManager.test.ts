import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveSnapshot,
  getSnapshots,
  clearSnapshots,
} from '../snapshotManager';

describe('snapshotManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and retrieves snapshots in LIFO order', () => {
    saveSnapshot('{"version":"1.0"}', 'Snapshot 1');
    saveSnapshot('{"version":"2.0"}', 'Snapshot 2');

    const list = getSnapshots();
    expect(list).toHaveLength(2);
    expect(list[0].label).toBe('Snapshot 2');
    expect(list[1].label).toBe('Snapshot 1');
  });

  it('respects maximum snapshot retention limits', () => {
    for (let i = 1; i <= 8; i++) {
      saveSnapshot(`{"iter":${i}}`, `Snap ${i}`, 3);
    }

    const list = getSnapshots();
    expect(list).toHaveLength(3);
    expect(list[0].label).toBe('Snap 8');
  });

  it('clears snapshots on demand', () => {
    saveSnapshot('{}', 'Test');
    clearSnapshots();
    expect(getSnapshots()).toHaveLength(0);
  });
});
