export type TabType = 'realm' | 'quests' | 'focus' | 'vault' | 'citadel' | 'analytics';

export type QuestCategory = 'daily' | 'bounty' | 'epic' | 'habit';
export type QuestTag = 'Study' | 'Coding' | 'Fitness' | 'Personal' | 'Work' | 'Creative' | 'Deep Work';

export interface Quest {
  id: string;
  title: string;
  description?: string;
  category: QuestCategory;
  tag: QuestTag;
  xpReward: number;
  coinsReward: number;
  isCompleted: boolean;
  completedAt?: string;
  dueLabel?: string;
  estimatedMinutes?: number;
}

export interface Habit {
  id: string;
  title: string;
  category: 'focus' | 'vitality' | 'mind' | 'routine';
  streakCount: number;
  bestStreak: number;
  lastCompletedDate?: string; // YYYY-MM-DD
  xpYield: number;
  coinYield: number;
  icon?: string;
}

export type ChestTier = 'bronze' | 'silver' | 'gold' | 'mythic';
export type ChestStatus = 'empty' | 'locked' | 'unlocking' | 'ready';

export interface ChestSlot {
  id: string;
  slotIndex: number;
  name: string;
  tier: ChestTier;
  status: ChestStatus;
  totalUnlockSeconds: number;
  unlockStartedAt?: number; // timestamp ms
  unlockEndsAt?: number;    // timestamp ms
  coinsReward: number;
  xpReward: number;
  gemsReward: number;
}

export interface RewardItem {
  id: string;
  title: string;
  cost: number;
  category: string;
  icon: string;
  description: string;
  isCustom?: boolean;
}

export interface EconomyTransaction {
  id: string;
  timestamp: number;
  amount: number;
  currency: 'coins' | 'gems' | 'energy';
  type: 'earn' | 'spend';
  reason: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'focus' | 'quests' | 'habits' | 'citadel' | 'streak';
  icon: string;
  targetValue: number;
  currentValue: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  rewards: {
    xp: number;
    coins?: number;
    gems?: number;
    titleReward?: string;
  };
}

export interface PlayerProfile {
  name: string;
  title: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  gems: number;
  energy: number;
  maxEnergy: number;
  streakDays: number;
  citadelTier: number;
  citadelPower: number;
  citadelMaxPower: number;
  totalFocusMinutes: number;
  completedQuestsCount: number;
  soundEnabled: boolean;
}

export interface FocusSessionState {
  isActive: boolean;
  isPaused: boolean;
  targetDurationSeconds: number;
  remainingSeconds: number;
  accumulatedXp: number;
  accumulatedCoins: number;
  selectedQuestId?: string;
  selectedQuestTitle?: string;
  isOvercharged: boolean;
  soundscapeTrack: 'none' | 'cyber-rain' | 'binaural' | 'forest' | 'white-noise';
  startedAt?: number;
}

export interface ClaimModalData {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  description?: string;
  coins?: number;
  xp?: number;
  gems?: number;
  icon?: string;
}
