import { PlayerProfile, Quest, ChestSlot, RewardItem, FocusSessionState } from '../types';

const PROFILE_STORAGE_KEY = 'auctus_profile_v1';
const QUESTS_STORAGE_KEY = 'auctus_quests_v1';
const CHESTS_STORAGE_KEY = 'auctus_chests_v1';
const REWARDS_STORAGE_KEY = 'auctus_rewards_v1';

export const initialProfile: PlayerProfile = {
  name: 'Commander Nova',
  title: 'Citadel Champion',
  level: 7,
  xp: 1400,
  xpToNextLevel: 2000,
  coins: 420,
  diamonds: 65,
  shards: 18,
  streakDays: 12,
  streakShields: 1,
  trophyPoints: 1840,
  leagueRank: 'GOLD I',
  citadelTier: 2,
  citadelPower: 850,
  citadelMaxPower: 1200,
  totalFocusMinutes: 1450,
  completedQuestsCount: 38,
  unlockedChestsCount: 14,
  soundEnabled: true,
};

export const initialQuests: Quest[] = [
  {
    id: 'mission-epic',
    title: 'Ship Q3 Roadmap Deck',
    description: 'Deliver strategy milestones and resource locks to council guild leaders.',
    category: 'epic',
    tier: 'Epic',
    xpReward: 350,
    coinReward: 45,
    focusStonesRequired: 3,
    dueLabel: '5:00 PM',
    phaseLabel: 'Phase 3/4',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mission-flame',
    title: 'Clear Inbox Zero (Streak Guard)',
    description: 'Zero out dispatch queue before the midnight refresh cycle kicks in.',
    category: 'bounty',
    tier: 'Urgent',
    xpReward: 120,
    coinReward: 0,
    streakShieldReward: 1,
    dueLabel: 'Due Midnight',
    isUrgent: true,
    isStreakAtRisk: true,
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mission-cyan',
    title: 'Deep Code Review for Auth Module',
    description: 'Validate JWT rotate routine, security tokens, and token leak vectors.',
    category: 'bounty',
    tier: 'Rare',
    xpReward: 180,
    coinReward: 20,
    dueLabel: 'Est. 45m',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mission-habit-1',
    title: 'Morning 20-Min Tactical Stretch',
    description: 'Maintain physical vitality baseline and core resilience.',
    category: 'habit',
    tier: 'Tier I',
    xpReward: 80,
    coinReward: 10,
    dueLabel: 'Daily Routine',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mission-completed-1',
    title: '30-Min High Intensity Reading',
    description: 'Tactical leadership doctrine: Chapter 4 to 6.',
    category: 'bounty',
    tier: 'Common',
    xpReward: 90,
    coinReward: 10,
    dueLabel: 'Archived',
    isCompleted: true,
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
];

export const initialChests: ChestSlot[] = [
  {
    id: 'slot-1',
    slotIndex: 0,
    name: 'Silver Chest',
    tier: 'silver',
    status: 'unlocking',
    unlockTimeRemainingSeconds: 2520, // 42m
    totalUnlockSeconds: 3600,
    image: '/assets/chest_silver.png',
    coinsReward: 65,
    xpReward: 100,
    shardsReward: 1,
  },
  {
    id: 'slot-2',
    slotIndex: 1,
    name: 'Gold Vault',
    tier: 'gold',
    status: 'queued',
    unlockTimeRemainingSeconds: 10800, // 3h
    totalUnlockSeconds: 10800,
    image: '/assets/chest_gold.png',
    coinsReward: 180,
    xpReward: 250,
    shardsReward: 2,
  },
  {
    id: 'slot-3',
    slotIndex: 2,
    name: 'Crown Relic',
    tier: 'magical',
    status: 'ready',
    unlockTimeRemainingSeconds: 0,
    totalUnlockSeconds: 7200,
    image: '/assets/chest_ready.png',
    coinsReward: 140,
    xpReward: 200,
    shardsReward: 2,
  },
  {
    id: 'slot-4',
    slotIndex: 3,
    name: 'Empty Slot',
    tier: 'empty',
    status: 'empty',
    unlockTimeRemainingSeconds: 0,
    totalUnlockSeconds: 0,
    image: '',
    coinsReward: 0,
    xpReward: 0,
    shardsReward: 0,
  }
];

export const initialRewards: RewardItem[] = [
  {
    id: 'reward-game-night',
    title: 'Guilt-Free Gaming (2 hrs)',
    type: 'irl',
    cost: 300,
    category: 'Self-Care Pass',
    icon: 'sports_esports',
    unlocked: true,
    description: 'Indulge in your favorite console or PC title without guilt.',
  },
  {
    id: 'reward-espresso',
    title: 'Specialty Espresso Treat',
    type: 'irl',
    cost: 150,
    category: 'Café Voucher',
    icon: 'coffee',
    unlocked: true,
    description: 'Treat yourself to an artisanal pour-over or cortado.',
  },
  {
    id: 'reward-book',
    title: 'Buy New Sci-Fi Book',
    type: 'irl',
    cost: 500,
    category: 'Learning Bounty',
    icon: 'auto_stories',
    unlocked: false,
    description: 'Purchase that exciting hard sci-fi novel on your reading list.',
  },
  {
    id: 'reward-island-skin',
    title: 'Cyber Spire Island Skin',
    type: 'game',
    cost: 800,
    category: 'Citadel Perk',
    icon: 'fort',
    unlocked: false,
    requiredLevel: 10,
    description: 'Transforms your Productivity Realm with glowing cyber runes.',
  },
  {
    id: 'reward-streak-potion',
    title: '24h Streak Freeze Potion',
    type: 'game',
    cost: 200,
    category: 'Emergency Safeguard',
    icon: 'ac_unit',
    unlocked: true,
    description: 'Freezes your productivity streak for 24 hours in case of travel.',
  }
];

// Helper functions for LocalStorage
export function loadProfile(): PlayerProfile {
  try {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialProfile;
  } catch {
    return initialProfile;
  }
}

export function saveProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function loadQuests(): Quest[] {
  try {
    const saved = localStorage.getItem(QUESTS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialQuests;
  } catch {
    return initialQuests;
  }
}

export function saveQuests(quests: Quest[]): void {
  try {
    localStorage.setItem(QUESTS_STORAGE_KEY, JSON.stringify(quests));
  } catch (e) {
    console.error('Failed to save quests', e);
  }
}

export function loadChests(): ChestSlot[] {
  try {
    const saved = localStorage.getItem(CHESTS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialChests;
  } catch {
    return initialChests;
  }
}

export function saveChests(chests: ChestSlot[]): void {
  try {
    localStorage.setItem(CHESTS_STORAGE_KEY, JSON.stringify(chests));
  } catch (e) {
    console.error('Failed to save chests', e);
  }
}

export function loadRewards(): RewardItem[] {
  try {
    const saved = localStorage.getItem(REWARDS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialRewards;
  } catch {
    return initialRewards;
  }
}

export function saveRewards(rewards: RewardItem[]): void {
  try {
    localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(rewards));
  } catch (e) {
    console.error('Failed to save rewards', e);
  }
}

export const FOCUS_SESSION_STORAGE_KEY = 'auctus_focus_session_v1';

export const initialFocusSession: FocusSessionState = {
  isActive: false,
  isPaused: false,
  targetDurationSeconds: 1500, // 25 min default
  remainingSeconds: 1500,
  accumulatedXp: 120,
  accumulatedCoins: 15,
  isOvercharged: false,
  soundscapeTrack: 'binaural',
  sessionMode: 'work',
};

export function loadFocusSession(): FocusSessionState {
  try {
    const saved = localStorage.getItem(FOCUS_SESSION_STORAGE_KEY);
    if (!saved) return initialFocusSession;
    const parsed: FocusSessionState = JSON.parse(saved);
    // If active and was timestamped, derive remaining seconds
    if (parsed.isActive && parsed.endsAt && !parsed.isPaused) {
      const remaining = Math.max(0, Math.ceil((parsed.endsAt - Date.now()) / 1000));
      return { ...parsed, remainingSeconds: remaining };
    }
    return parsed;
  } catch {
    return initialFocusSession;
  }
}

export function saveFocusSession(session: FocusSessionState): void {
  try {
    localStorage.setItem(FOCUS_SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save focus session', e);
  }
}

