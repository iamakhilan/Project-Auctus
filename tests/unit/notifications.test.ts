import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  sendLocalNotification,
  NotifyTriggers,
} from '../../src/services/notifications';

describe('Notification Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should detect notification support and permission state', () => {
    const supported = isNotificationSupported();
    expect(typeof supported).toBe('boolean');

    const perm = getNotificationPermission();
    expect(['default', 'granted', 'denied']).toContain(perm);
  });

  it('should handle requestNotificationPermission gracefully', async () => {
    // If window.Notification exists in jsdom
    if (typeof window !== 'undefined' && 'Notification' in window) {
      vi.spyOn(window.Notification, 'requestPermission').mockResolvedValue('granted');
      const perm = await requestNotificationPermission();
      expect(perm).toBe('granted');
    }
  });

  it('should execute pre-defined notify triggers and sendLocalNotification without crashing', () => {
    expect(() => {
      sendLocalNotification('Test Notification', { body: 'Test Body' });
      NotifyTriggers.focusCompleted(25, 120);
      NotifyTriggers.chestReady('Gold');
      NotifyTriggers.streakWarning(5);
      NotifyTriggers.achievementUnlocked('Master of the Void', 'Void Commander');
    }).not.toThrow();
  });
});
