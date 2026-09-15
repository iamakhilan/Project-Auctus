import {
  PlayerProfile,
  Quest,
  Habit,
  ChestSlot,
  RewardItem,
  Achievement,
  EconomyTransaction,
  FocusSessionState,
} from '../types';

const STORAGE_KEYS = {
  PROFILE: 'auctus_duo_profile',
  QUESTS: 'auctus_duo_quests',
  HABITS: 'auctus_duo_habits',
  CHESTS: 'auctus_duo_chests',
  REWARDS: 'auctus_duo_rewards',
  ACHIEVEMENTS: 'auctus_duo_achievements',
  TRANSACTIONS: 'auctus_duo_transactions',
  FOCUS: 'auctus_duo_focus',
};

export const INITIAL_PROFILE: PlayerProfile = {
  name: 'Commander Alex',
  title: 'Novice Pathfinder',
  level: 4,
  xp: 420,
  xpToNextLevel: 600,
  coins: 850,
  gems: 45,
  energy: 5,
  maxEnergy: 5,
  streakDays: 14,
  citadelTier: 2,
  citadelPower: 380,
  citadelMaxPower: 500,
  totalFocusMinutes: 285,
  completedQuestsCount: 19,
  soundEnabled: true,
};

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'q1',
    title: 'Complete System Architecture Spec',
    description: 'Finalize interface definitions and domain logic engines.',
    category: 'bounty',
    tag: 'Coding',
    xpReward: 120,
    coinsReward: 60,
    isCompleted: false,
    dueLabel: 'Today',
    estimatedMinutes: 45,
  },
  {
    id: 'q2',
    title: 'Morning Deep Reading & Research',
    description: 'Read 20 pages of distributed systems literature.',
    category: 'daily',
    tag: 'Study',
    xpReward: 60,
    coinsReward: 30,
    isCompleted: true,
    completedAt: new Date().toISOString(),
    dueLabel: 'Done',
    estimatedMinutes: 25,
  },
  {
    id: 'q3',
    title: 'Full Body Mobility & Core Workout',
    description: '30-minute workout routine followed by hydration.',
    category: 'daily',
    tag: 'Fitness',
    xpReward: 80,
    coinsReward: 40,
    isCompleted: false,
    dueLabel: 'Tonight',
    estimatedMinutes: 30,
  },
  {
    id: 'q4',
    title: 'Deploy Production Release 2.0',
    description: 'Execute build pipeline, verify smoke tests, and deploy.',
    category: 'epic',
    tag: 'Work',
    xpReward: 250,
    coinsReward: 150,
    isCompleted: false,
    dueLabel: 'This Week',
    estimatedMinutes: 60,
  },
];

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'h1',
    title: 'Morning Focus Sprint (25m)',
    category: 'focus',
    streakCount: 14,
    bestStreak: 21,
    xpYield: 30,
    coinYield: 15,
  },
  {
    id: 'h2',
    title: 'Hydration Protocol (2.5L)',
    category: 'vitality',
    streakCount: 8,
    bestStreak: 12,
    xpYield: 20,
    coinYield: 10,
  },
  {
    id: 'h3',
    title: 'Nightly Retrospective & Journaling',
    category: 'mind',
    streakCount: 5,
    bestStreak: 9,
    xpYield: 25,
    coinYield: 12,
  },
  {
    id: 'h4',
    title: 'Zero Distraction Coding Block',
    category: 'focus',
    streakCount: 11,
    bestStreak: 14,
    xpYield: 40,
    coinYield: 20,
  },
];

export const INITIAL_CHESTS: ChestSlot[] = [
  {
    id: 'c1',
    slotIndex: 0,
    name: 'Mythic Obsidian Chest',
    tier: 'mythic',
    status: 'ready',
    totalUnlockSeconds: 28800,
    coinsReward: 400,
    xpReward: 250,
    gemsReward: 25,
  },
  {
    id: 'c2',
    slotIndex: 1,
    name: 'Gold Relic Chest',
    tier: 'gold',
    status: 'unlocking',
    totalUnlockSeconds: 14400,
    unlockStartedAt: Date.now() - 7200000,
    unlockEndsAt: Date.now() + 7200000,
    coinsReward: 200,
    xpReward: 120,
    gemsReward: 10,
  },
  {
    id: 'c3',
    slotIndex: 2,
    name: 'Silver Quest Chest',
    tier: 'silver',
    status: 'locked',
    totalUnlockSeconds: 7200,
    coinsReward: 100,
    xpReward: 60,
    gemsReward: 5,
  },
  {
    id: 'c4',
    slotIndex: 3,
    name: 'Bronze Supply Chest',
    tier: 'bronze',
    status: 'empty',
    totalUnlockSeconds: 3600,
    coinsReward: 50,
    xpReward: 30,
    gemsReward: 2,
  },
];

export const INITIAL_REWARDS: RewardItem[] = [
  {
    id: 'r1',
    title: '1 Hour Gaming Session',
    cost: 150,
    category: 'Entertainment',
    icon: '??',
    description: 'Guilt-free gaming block on your favorite PC or console game.',
  },
  {
    id: 'r2',
    title: 'Artisan Espresso / Cafe Treat',
    cost: 100,
    category: 'Treats',
    icon: '?',
    description: 'A specialty coffee or dessert at your favorite local cafe.',
  },
  {
    id: 'r3',
    title: 'Movie Night & Popcorn',
    cost: 220,
    category: 'Leisure',
    icon: '??',
    description: 'Watch a movie or new series episode with complete peace of mind.',
  },
  {
    id: 'r4',
    title: 'Book / Tech Gear Purchase',
    cost: 500,
    category: 'Investment',
    icon: '??',
    description: 'Buy that book, mechanical keycap, or productivity gadget.',
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'a1',
    title: 'First Blood',
    description: 'Complete your first tactical bounty.',
    category: 'quests',
    icon: '??',
    targetValue: 1,
    currentValue: 1,
    isUnlocked: true,
    unlockedAt: '2026-09-01',
    rewards: { xp: 50, coins: 25 },
  },
  {
    id: 'a2',
    title: 'Focus Champion',
    description: 'Log over 250 minutes in the Focus Arena.',
    category: 'focus',
    icon: '??',
    targetValue: 250,
    currentValue: 285,
    isUnlocked: true,
    unlockedAt: '2026-09-10',
    rewards: { xp: 100, gems: 10, titleReward: 'Chrono Adept' },
  },
  {
    id: 'a3',
    title: 'Iron Discipline',
    description: 'Reach a consecutive 14-day streak flame.',
    category: 'streak',
    icon: '??',
    targetValue: 14,
    currentValue: 14,
    isUnlocked: true,
    unlockedAt: '2026-09-14',
    rewards: { xp: 150, gems: 20 },
  },
  {
    id: 'a4',
    title: 'Citadel Ascendant',
    description: 'Ascend to Citadel Tier II (Bastion Outpost).',
    category: 'citadel',
    icon: '??',
    targetValue: 2,
    currentValue: 2,
    isUnlocked: true,
    unlockedAt: '2026-09-12',
    rewards: { xp: 120, coins: 80 },
  },
  {
    id: 'a5',
    title: 'Centurion',
    description: 'Complete 50 total missions.',
    category: 'quests',
    icon: '??',
    targetValue: 50,
    currentValue: 19,
    isUnlocked: false,
    rewards: { xp: 300, gems: 30, titleReward: 'Centurion' },
  },
  {
    id: 'a6',
    title: 'Deep Work Master',
    description: 'Accumulate 1,000 focus minutes.',
    category: 'focus',
    icon: '?',
    targetValue: 1000,
    currentValue: 285,
    isUnlocked: false,
    rewards: { xp: 400, gems: 50 },
  },
];

export const INITIAL_TRANSACTIONS: EconomyTransaction[] = [
  {
    id: 't1',
    timestamp: Date.now() - 86400000,
    amount: 120,
    currency: 'coins',
    type: 'earn',
    reason: 'Completed Bounty: Refactor API Endpoints',
  },
  {
    id: 't2',
    timestamp: Date.now() - 43200000,
    amount: 100,
    currency: 'coins',
    type: 'spend',
    reason: 'Redeemed: Artisan Espresso Cafe Treat',
  },
  {
    id: 't3',
    timestamp: Date.now() - 21600000,
    amount: 60,
    currency: 'coins',
    type: 'earn',
    reason: 'Morning Deep Reading & Research',
  },
];

export const loadFromStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

export const saveToStorage = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // quota safe
  }
};

export const StorageService = {
  getProfile: () => loadFromStorage<PlayerProfile>(STORAGE_KEYS.PROFILE, INITIAL_PROFILE),
  setProfile: (p: PlayerProfile) => saveToStorage(STORAGE_KEYS.PROFILE, p),

  getQuests: () => loadFromStorage<Quest[]>(STORAGE_KEYS.QUESTS, INITIAL_QUESTS),
  setQuests: (q: Quest[]) => saveToStorage(STORAGE_KEYS.QUESTS, q),

  getHabits: () => loadFromStorage<Habit[]>(STORAGE_KEYS.HABITS, INITIAL_HABITS),
  setHabits: (h: Habit[]) => saveToStorage(STORAGE_KEYS.HABITS, h),

  getChests: () => loadFromStorage<ChestSlot[]>(STORAGE_KEYS.CHESTS, INITIAL_CHESTS),
  setChests: (c: ChestSlot[]) => saveToStorage(STORAGE_KEYS.CHESTS, c),

  getRewards: () => loadFromStorage<RewardItem[]>(STORAGE_KEYS.REWARDS, INITIAL_REWARDS),
  setRewards: (r: RewardItem[]) => saveToStorage(STORAGE_KEYS.REWARDS, r),

  getAchievements: () => loadFromStorage<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, INITIAL_ACHIEVEMENTS),
  setAchievements: (a: Achievement[]) => saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, a),

  getTransactions: () => loadFromStorage<EconomyTransaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS),
  setTransactions: (t: EconomyTransaction[]) => saveToStorage(STORAGE_KEYS.TRANSACTIONS, t),

  getFocusState: () => loadFromStorage<FocusSessionState | null>(STORAGE_KEYS.FOCUS, null),
  setFocusState: (f: FocusSessionState | null) => saveToStorage(STORAGE_KEYS.FOCUS, f),

  exportBackup: (): string => {
    const backup = {
      profile: StorageService.getProfile(),
      quests: StorageService.getQuests(),
      habits: StorageService.getHabits(),
      chests: StorageService.getChests(),
      rewards: StorageService.getRewards(),
      achievements: StorageService.getAchievements(),
      transactions: StorageService.getTransactions(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackup: (json: string): boolean => {
    try {
      const data = JSON.parse(json);
      if (data.profile) StorageService.setProfile(data.profile);
      if (data.quests) StorageService.setQuests(data.quests);
      if (data.habits) StorageService.setHabits(data.habits);
      if (data.chests) StorageService.setChests(data.chests);
      if (data.rewards) StorageService.setRewards(data.rewards);
      if (data.achievements) StorageService.setAchievements(data.achievements);
      if (data.transactions) StorageService.setTransactions(data.transactions);
      return true;
    } catch {
      return false;
    }
  },
};
