/**
 * AUCTUS Notification Service
 * Provides platform-aware notifications:
 * - Native Android notifications via @capacitor/local-notifications when running in Capacitor
 * - Web Notifications API fallback when running in a standard browser
 */

import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export interface AuctusNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  badge?: string;
}

export function isNativeApp(): boolean {
  return Capacitor.isNativePlatform();
}

export function isNotificationSupported(): boolean {
  if (isNativeApp()) return true;
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    return Notification.permission;
  }
  return 'default';
}

export async function getNotificationPermissionState(): Promise<NotificationPermission> {
  if (isNativeApp()) {
    try {
      const status = await LocalNotifications.checkPermissions();
      if (status.display === 'granted') return 'granted';
      if (status.display === 'denied') return 'denied';
      return 'default';
    } catch {
      return 'default';
    }
  }

  return getNotificationPermission();
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (isNativeApp()) {
    try {
      const status = await LocalNotifications.requestPermissions();
      if (status.display === 'granted') {
        // Create default Android notification channel
        try {
          await LocalNotifications.createChannel({
            id: 'auctus_alerts',
            name: 'Auctus Tactical Alerts',
            description: 'Focus completion, chest unlock, and streak notifications',
            importance: 4, // High importance
            visibility: 1,
            vibration: true,
          });
        } catch {
          // Channel creation fallback
        }
        return 'granted';
      }
      return status.display === 'denied' ? 'denied' : 'default';
    } catch {
      return 'denied';
    }
  }

  if (!isNotificationSupported()) return 'denied';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return 'denied';
  }
}

export function sendLocalNotification(
  title: string,
  options?: {
    body?: string;
    icon?: string;
    tag?: string;
    badge?: string;
  }
): boolean {
  if (isNativeApp()) {
    try {
      const notificationId = Math.floor(Math.random() * 100000) + 1;
      LocalNotifications.schedule({
        notifications: [
          {
            id: notificationId,
            title,
            body: options?.body || 'Auctus Notification',
            channelId: 'auctus_alerts',
            smallIcon: 'ic_stat_crest',
            iconColor: '#3744c9',
          },
        ],
      }).catch(err => {
        console.warn('Native notification scheduling failed:', err);
      });
      return true;
    } catch (error) {
      console.warn('Failed to schedule native notification:', error);
      return false;
    }
  }

  // Web Browser fallback
  if (!isNotificationSupported()) return false;
  if (Notification.permission !== 'granted') return false;

  try {
    new Notification(title, {
      body: options?.body || 'Auctus Notification',
      icon: options?.icon || '/assets/crest.png',
      badge: options?.badge || '/assets/crest.png',
      tag: options?.tag,
    });
    return true;
  } catch (error) {
    console.warn('Failed to dispatch local browser notification:', error);
    return false;
  }
}

/**
 * Pre-defined notification triggers for key RPG events
 */
export const NotifyTriggers = {
  focusCompleted: (sessionMinutes: number, xpEarned: number) => {
    sendLocalNotification('⚡ Focus Session Complete!', {
      body: `You forged ${sessionMinutes}m of deep focus and earned +${xpEarned} XP!`,
      tag: 'auctus-focus',
    });
  },
  chestReady: (tier: string) => {
    sendLocalNotification('📦 Chest Ready to Unlock!', {
      body: `Your ${tier} Chest timer has completed. Tap to claim your loot!`,
      tag: 'auctus-chest',
    });
  },
  streakWarning: (streakDays: number) => {
    sendLocalNotification('🔥 Maintain Your Streak!', {
      body: `You have an active ${streakDays}-day streak! Complete a quest or habit today to keep it burning.`,
      tag: 'auctus-streak',
    });
  },
  achievementUnlocked: (name: string, titleReward?: string) => {
    sendLocalNotification('🏆 Achievement Unlocked!', {
      body: `You unlocked "${name}"${titleReward ? ` and earned the title "${titleReward}"` : ''}!`,
      tag: 'auctus-achievement',
    });
  },
};
