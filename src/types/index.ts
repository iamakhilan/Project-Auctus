export type TabType = 'realm' | 'quests' | 'focus' | 'vault' | 'citadel' | 'analytics' | 'campaigns';

export type QuestCategory = 'daily' | 'bounty' | 'epic' | 'habit';
export type QuestTag = 'Study' | 'Coding' | 'Fitness' | 'Personal' | 'Work' | 'Creative' | 'Deep Work';
export type QuestDifficulty = 'normal' | 'hard' | 'elite';
export type QuestPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Quest {
  id: string;
  title: string;
  description?: string;
  category: QuestCategory;
  tag: QuestTag;
  difficulty?: QuestDifficulty;
  xpReward: number;
  coinsReward: number;
  isCompleted: boolean;
  completedAt?: string;
  dueLabel?: string;
  estimatedMinutes?: number;
  campaignId?: string;
  milestoneId?: string;
  dependsOn?: string[];
  priority?: QuestPriority;
  dueDate?: string;
  actualMinutes?: number;
  postponedCount?: number;
  createdAt?: string;
  source?: 'manual' | 'campaign' | 'review';
}

export type HabitFrequency = 'daily' | 'weekdays' | 'weekends';

export interface Habit {
  id: string;
  title: string;
  category: 'focus' | 'vitality' | 'mind' | 'routine';
  frequency?: HabitFrequency;
  streakCount: number;
  bestStreak: number;
  lastCompletedDate?: string;
  completedDates: string[];
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
  unlockStartedAt?: number;
  unlockEndsAt?: number;
  coinsReward: number;
  xpReward: number;
  gemsReward: number;
}

export type RewardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface RewardItem {
  id: string;
  title: string;
  cost: number;
  category: string;
  icon: string;
  description: string;
  isCustom?: boolean;
  rarity?: RewardRarity;
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
  rewards: { xp: number; coins?: number; gems?: number; titleReward?: string };
}

export interface AchievementLock {
  achievementId: string;
  unlockedAt: string;
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
  streakFreezeCount?: number;
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
  targetEndsAt?: number;
  pausedAt?: number;
}

export interface FocusSessionRecord {
  id: string;
  questId?: string;
  questTitle?: string;
  durationMinutes: number;
  completedAt: number;
  actualSeconds: number;
  xpEarned: number;
  coinsEarned: number;
}

export interface AudioSettings {
  soundEnabled: boolean;
  masterVolume: number;
  soundscapeVolume: number;
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

// ===== Connected productivity engine =====

export type CampaignStatus = 'active' | 'paused' | 'completed' | 'archived';
export type CampaignGoalType = 'exam' | 'project' | 'skill' | 'custom';

export interface Milestone {
  id: string;
  campaignId: string;
  title: string;
  description?: string;
  order: number;
  status: 'locked' | 'active' | 'completed';
  questIds: string[];
  targetDate?: string;
}

export interface Campaign {
  id: string;
  title: string;
  description?: string;
  goalType: CampaignGoalType;
  targetDate: string;
  status: CampaignStatus;
  createdAt: string;
  completedAt?: string;
  archivedAt?: string;
  milestones: Milestone[];
  estimatedTotalMinutes?: number;
  color?: string;
  icon?: string;
}

export interface FocusEffortLog {
  id: string;
  questId?: string;
  campaignId?: string;
  milestoneId?: string;
  plannedMinutes: number;
  actualMinutes: number;
  startedAt: number;
  endedAt: number;
  completed: boolean;
  interrupted: boolean;
  xpEarned?: number;
  coinsEarned?: number;
}

export interface DailyObjective {
  questId: string;
  urgencyScore: number;
  reasons: string[];
  isBlocked: boolean;
  blockedBy?: string[];
  campaignId?: string;
  milestoneId?: string;
}

export interface ProductivitySnapshot {
  windowDays: number;
  totalQuests: number;
  completedQuests: number;
  completionRate: number;
  avgEstimatedMinutes: number;
  avgActualMinutes: number;
  estimationBias: number;
  postponedCount: number;
  overdueCount: number;
  focusSessions: number;
  focusCompletionRate: number;
  avgFocusMinutes: number;
  velocityPerDay: number;
}

export interface WeeklyReview {
  id: string;
  weekStart: string;
  weekEnd: string;
  generatedAt: string;
  stats: {
    planned: number;
    completed: number;
    completionRate: number;
    totalFocusMinutes: number;
    overdueCarried: number;
    campaignsActive: number;
    campaignsProgress: Array<{ campaignId: string; title: string; progress: number }>;
  };
  insights: string[];
  suggestedActions: Array<{ label: string; questIds?: string[]; campaignId?: string }>;
  carryOverQuestIds: string[];
  archived: boolean;
}
