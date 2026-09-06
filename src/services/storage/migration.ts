import {
  initialProfile,
  initialQuests,
  initialChests,
  initialRewards,
  initialFocusSession,
} from '../../utils/storage';
import { AuctusV2SaveData, MigrationResult } from './types';
import { PlayerProfile, Quest, ChestSlot, RewardItem, FocusSessionState } from '../../types';

export const V1_KEYS = {
  PROFILE: 'auctus_profile_v1',
  QUESTS: 'auctus_quests_v1',
  CHESTS: 'auctus_chests_v1',
  REWARDS: 'auctus_rewards_v1',
  FOCUS: 'auctus_focus_session_v1',
};

export const V2_KEYS = {
  MASTER: 'auctus_v2_data',
  PROFILE: 'auctus_profile_v2',
  QUESTS: 'auctus_quests_v2',
  CHESTS: 'auctus_chests_v2',
  REWARDS: 'auctus_rewards_v2',
  FOCUS: 'auctus_focus_v2',
  HABITS: 'auctus_habits_v2',
  TRANSACTIONS: 'auctus_transactions_v2',
  ACHIEVEMENTS: 'auctus_achievements_v2',
  BACKUP_V1: 'auctus_v1_backup',
};

export function safeParseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (err) {
    console.warn('Storage JSON parse failure, utilizing fallback baseline', err);
    return fallback;
  }
}

/**
 * Checks if legacy V1 data exists in localStorage and migrates safely to V2 schema.
 * Never destroys legacy keys without creating a safe backup copy first.
 */
export function migrateV1ToV2(): MigrationResult {
  const v1ProfileRaw = localStorage.getItem(V1_KEYS.PROFILE);
  const v1QuestsRaw = localStorage.getItem(V1_KEYS.QUESTS);
  const v1ChestsRaw = localStorage.getItem(V1_KEYS.CHESTS);
  const v1RewardsRaw = localStorage.getItem(V1_KEYS.REWARDS);
  const v1FocusRaw = localStorage.getItem(V1_KEYS.FOCUS);

  const hasLegacyData = Boolean(
    v1ProfileRaw || v1QuestsRaw || v1ChestsRaw || v1RewardsRaw || v1FocusRaw
  );

  const profile: PlayerProfile = safeParseJson(v1ProfileRaw, initialProfile);
  const quests: Quest[] = safeParseJson(v1QuestsRaw, initialQuests);
  const chests: ChestSlot[] = safeParseJson(v1ChestsRaw, initialChests);
  const rewards: RewardItem[] = safeParseJson(v1RewardsRaw, initialRewards);
  const focusSession: FocusSessionState = safeParseJson(v1FocusRaw, initialFocusSession);

  // Preserve legacy backup
  if (hasLegacyData && !localStorage.getItem(V2_KEYS.BACKUP_V1)) {
    try {
      const v1Snapshot = {
        profile: v1ProfileRaw,
        quests: v1QuestsRaw,
        chests: v1ChestsRaw,
        rewards: v1RewardsRaw,
        focus: v1FocusRaw,
        snapshottedAt: new Date().toISOString(),
      };
      localStorage.setItem(V2_KEYS.BACKUP_V1, JSON.stringify(v1Snapshot));
    } catch (e) {
      console.warn('Could not store legacy backup snapshot', e);
    }
  }

  const v2Data: AuctusV2SaveData = {
    schemaVersion: 2,
    exportedAt: new Date().toISOString(),
    profile: {
      ...initialProfile,
      ...profile,
      // Ensure all v2 profile fields exist
      soundEnabled: profile.soundEnabled ?? true,
      citadelTier: profile.citadelTier || 2,
      citadelPower: profile.citadelPower || 850,
      citadelMaxPower: profile.citadelMaxPower || 1200,
    },
    quests: quests.map(q => ({
      ...q,
      category: q.category || 'bounty',
      tier: q.tier || 'Tier I',
      isCompleted: !!q.isCompleted,
    })),
    chests: chests.map(c => ({
      ...c,
      status: c.status || 'empty',
    })),
    rewards: rewards.map(r => ({
      ...r,
      unlocked: r.unlocked ?? true,
    })),
    focusSession: {
      ...initialFocusSession,
      ...focusSession,
      sessionMode: focusSession.sessionMode || 'work',
    },
  };

  return {
    migrated: hasLegacyData,
    fromVersion: 1,
    toVersion: 2,
    data: v2Data,
  };
}
