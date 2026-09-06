import {
  PlayerProfile,
  Quest,
  ChestSlot,
  RewardItem,
  FocusSessionState,
} from '../../types';
import {
  initialProfile,
  initialQuests,
  initialChests,
  initialRewards,
  initialFocusSession,
} from '../../utils/storage';
import { AuctusV2SaveData } from './types';
import { V2_KEYS, safeParseJson, migrateV1ToV2 } from './migration';

export * from './types';
export * from './migration';

/**
 * Loads profile from V2 storage with automated fallback and migration from V1.
 */
export function loadProfileV2(): PlayerProfile {
  try {
    const raw = localStorage.getItem(V2_KEYS.PROFILE);
    if (raw) return safeParseJson(raw, initialProfile);

    // Run migration if no V2 key exists
    const migration = migrateV1ToV2();
    saveProfileV2(migration.data.profile);
    return migration.data.profile;
  } catch {
    return initialProfile;
  }
}

export function saveProfileV2(profile: PlayerProfile): void {
  try {
    localStorage.setItem(V2_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save V2 profile', e);
  }
}

/**
 * Loads quests from V2 storage with automated fallback and migration from V1.
 */
export function loadQuestsV2(): Quest[] {
  try {
    const raw = localStorage.getItem(V2_KEYS.QUESTS);
    if (raw) return safeParseJson(raw, initialQuests);

    const migration = migrateV1ToV2();
    saveQuestsV2(migration.data.quests);
    return migration.data.quests;
  } catch {
    return initialQuests;
  }
}

export function saveQuestsV2(quests: Quest[]): void {
  try {
    localStorage.setItem(V2_KEYS.QUESTS, JSON.stringify(quests));
  } catch (e) {
    console.error('Failed to save V2 quests', e);
  }
}

/**
 * Loads chests from V2 storage with automated fallback and migration from V1.
 */
export function loadChestsV2(): ChestSlot[] {
  try {
    const raw = localStorage.getItem(V2_KEYS.CHESTS);
    if (raw) return safeParseJson(raw, initialChests);

    const migration = migrateV1ToV2();
    saveChestsV2(migration.data.chests);
    return migration.data.chests;
  } catch {
    return initialChests;
  }
}

export function saveChestsV2(chests: ChestSlot[]): void {
  try {
    localStorage.setItem(V2_KEYS.CHESTS, JSON.stringify(chests));
  } catch (e) {
    console.error('Failed to save V2 chests', e);
  }
}

/**
 * Loads rewards from V2 storage with automated fallback and migration from V1.
 */
export function loadRewardsV2(): RewardItem[] {
  try {
    const raw = localStorage.getItem(V2_KEYS.REWARDS);
    if (raw) return safeParseJson(raw, initialRewards);

    const migration = migrateV1ToV2();
    saveRewardsV2(migration.data.rewards);
    return migration.data.rewards;
  } catch {
    return initialRewards;
  }
}

export function saveRewardsV2(rewards: RewardItem[]): void {
  try {
    localStorage.setItem(V2_KEYS.REWARDS, JSON.stringify(rewards));
  } catch (e) {
    console.error('Failed to save V2 rewards', e);
  }
}

/**
 * Loads focus session from V2 storage with automated fallback.
 */
export function loadFocusSessionV2(): FocusSessionState {
  try {
    const raw = localStorage.getItem(V2_KEYS.FOCUS);
    if (!raw) {
      const migration = migrateV1ToV2();
      return migration.data.focusSession || initialFocusSession;
    }

    const session: FocusSessionState = safeParseJson(raw, initialFocusSession);
    if (session.isActive && session.endsAt && !session.isPaused) {
      const remaining = Math.max(0, Math.ceil((session.endsAt - Date.now()) / 1000));
      return { ...session, remainingSeconds: remaining };
    }
    return session;
  } catch {
    return initialFocusSession;
  }
}

export function saveFocusSessionV2(session: FocusSessionState): void {
  try {
    localStorage.setItem(V2_KEYS.FOCUS, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save V2 focus session', e);
  }
}

/**
 * Exports complete player data as a clean JSON backup string.
 */
export function exportAuctusBackup(): string {
  const data: AuctusV2SaveData = {
    schemaVersion: 2,
    exportedAt: new Date().toISOString(),
    profile: loadProfileV2(),
    quests: loadQuestsV2(),
    chests: loadChestsV2(),
    rewards: loadRewardsV2(),
    focusSession: loadFocusSessionV2(),
  };

  return JSON.stringify(data, null, 2);
}

export interface ImportResult {
  success: boolean;
  error?: string;
  data?: AuctusV2SaveData;
}

/**
 * Validates and imports a player backup JSON string into V2 storage.
 */
export function importAuctusBackup(jsonString: string): ImportResult {
  try {
    if (!jsonString || typeof jsonString !== 'string') {
      return { success: false, error: 'Empty or invalid JSON payload.' };
    }

    const parsed = JSON.parse(jsonString.trim());

    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Malformed backup data structure.' };
    }

    if (!parsed.profile || typeof parsed.profile !== 'object') {
      return { success: false, error: 'Backup is missing required profile record.' };
    }

    if (!Array.isArray(parsed.quests)) {
      return { success: false, error: 'Backup contains invalid quests format.' };
    }

    // Backup current state before overwriting
    try {
      const currentBackup = exportAuctusBackup();
      localStorage.setItem('auctus_pre_import_backup', currentBackup);
    } catch {
      // ignore
    }

    // Write imported data
    saveProfileV2({ ...initialProfile, ...parsed.profile });
    saveQuestsV2(parsed.quests);
    if (Array.isArray(parsed.chests)) saveChestsV2(parsed.chests);
    if (Array.isArray(parsed.rewards)) saveRewardsV2(parsed.rewards);
    if (parsed.focusSession) saveFocusSessionV2(parsed.focusSession);

    return {
      success: true,
      data: parsed as AuctusV2SaveData,
    };
  } catch (err) {
    return {
      success: false,
      error: `JSON parse error: ${(err as Error).message}`,
    };
  }
}
