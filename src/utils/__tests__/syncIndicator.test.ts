import { describe, it, expect } from 'vitest';
import { getSyncStatusBadge, formatLastSyncTime } from '../syncIndicator';

describe('syncIndicator', () => {
  describe('getSyncStatusBadge', () => {
    it('returns offline status badge when disconnected', () => {
      const badge = getSyncStatusBadge(false);
      expect(badge.label).toBe('Offline (Local Save)');
      expect(badge.icon).toBe('🔌');
    });

    it('returns syncing badge when pending messages exist', () => {
      const badge = getSyncStatusBadge(true, 3);
      expect(badge.label).toBe('Syncing (3 pending)');
      expect(badge.icon).toBe('🔄');
    });

    it('returns active green badge when connected and idle', () => {
      const badge = getSyncStatusBadge(true, 0);
      expect(badge.label).toBe('Live Multi-Tab Sync Active');
      expect(badge.icon).toBe('⚡');
    });
  });

  describe('formatLastSyncTime', () => {
    it('formats recent elapsed time', () => {
      const now = 100000;
      expect(formatLastSyncTime(now - 4000, now)).toBe('Just now');
      expect(formatLastSyncTime(now - 35000, now)).toBe('35s ago');
      expect(formatLastSyncTime(now - 180000, now)).toBe('3m ago');
    });
  });
});
