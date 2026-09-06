/**
 * AUCTUS Notification Service
 * Provides browser Web Notifications integration with fallback handling.
 */

export interface AuctusNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  badge?: string;
}

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
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
