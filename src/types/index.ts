export type TabType = 'realm' | 'quests' | 'focus-arena' | 'vault' | 'citadel';

export type QuestTier = 'Tier I' | 'Tier II' | 'Tier III' | 'Epic' | 'Urgent' | 'Rare' | 'Common';

export type QuestCategory = 'bounty' | 'epic' | 'habit';

export type QuestTag = 'Study' | 'Coding' | 'Health' | 'Personal' | 'College' | 'Project' | 'Creative' | 'Work';

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  tier: QuestTier;
  tag?: QuestTag;
  xpReward: number;
  coinReward: number;
  streakShieldReward?: number;
  focusStonesRequired?: number;
  dueLabel: string;
  isUrgent?: boolean;
  isStreakAtRisk?: boolean;
  phaseLabel?: string;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  notes?: string;
  estimatedMinutes?: number;
}

export type HabitCategory = 'morning' | 'focus' | 'vitality' | 'evening' | 'custom';

export interface Habit {
  id: string;
  title: string;
  description: string;
  category: HabitCategory;
  streakCount: number;
  bestStreak: number;
  lastCompletedDate?: string; // YYYY-MM-DD
  completedDates: string[]; // List of YYYY-MM-DD
  xpYield: number;
  coinYield: number;
  milestonesAchieved: number[];
  createdAt: string;
  icon?: string;
}

export type ChestStatus = 'unlocking' | 'queued' | 'ready' | 'empty' | 'locked';

export interface ChestSlot {
  id: string;
  slotIndex: number;
  name: string;
  tier: 'silver' | 'gold' | 'magical' | 'relic' | 'empty';
  status: ChestStatus;
  unlockTimeRemainingSeconds: number; // For countdown display
  totalUnlockSeconds: number;
  unlockStartedAt?: number; // ms timestamp
  unlockEndsAt?: number; // ms timestamp
  image: string;
  coinsReward: number;
  xpReward: number;
  shardsReward: number;
}

export interface RewardItem {
  id: string;
  title: string;
  type: 'irl' | 'game';
  cost: number;
  category: string;
  icon: string;
  iconColor?: string;
  unlocked: boolean;
  requiredLevel?: number;
  description: string;
  isCustom?: boolean;
}

export interface PlayerProfile {
  name: string;
  title: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  diamonds: number; // Mana Gems
  shards: number; // Spire Shards
  streakDays: number;
  streakShields: number;
  trophyPoints: number;
  leagueRank: string;
  citadelTier: number;
  citadelPower: number;
  citadelMaxPower: number;
  totalFocusMinutes: number;
  completedQuestsCount: number;
  unlockedChestsCount: number;
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
  soundscapeTrack: 'binaural' | 'cyber-rain' | 'forest-spire' | 'white-noise' | 'none';
  startedAt?: number;
  endsAt?: number;
  pausedAt?: number;
  sessionMode?: 'work' | 'break';
}

export interface ClaimModalData {
  isOpen: boolean;
  title: string;
  subtitle: string;
  description: string;
  coins?: number;
  xp?: number;
  shards?: number;
  icon?: string;
  badge?: string;
}

export type CurrencyType = 'coins' | 'diamonds' | 'shards';
export type EconomyTransactionType = 'earn' | 'spend';

export interface EconomyTransaction {
  id: string;
  timestamp: number;
  amount: number;
  currency: CurrencyType;
  type: EconomyTransactionType;
  reason: string;
  balanceAfter: number;
}

