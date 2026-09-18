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

export const STORAGE_KEYS = {
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
    lastCompletedDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    completedDates: Array.from({ length: 14 }, (_, i) => new Date(Date.now() - (13 - i) * 86400000).toISOString().split('T')[0]),
    xpYield: 30,
    coinYield: 15,
  },
  {
    id: 'h2',
    title: 'Hydration Protocol (2.5L)',
    category: 'vitality',
    streakCount: 8,
    bestStreak: 12,
    lastCompletedDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    completedDates: Array.from({ length: 8 }, (_, i) => new Date(Date.now() - (7 - i) * 86400000).toISOString().split('T')[0]),
    xpYield: 20,
    coinYield: 10,
  },
  {
    id: 'h3',
    title: 'Nightly Retrospective & Journaling',
    category: 'mind',
    streakCount: 5,
    bestStreak: 9,
    lastCompletedDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    completedDates: Array.from({ length: 5 }, (_, i) => new Date(Date.now() - (4 - i) * 86400000).toISOString().split('T')[0]),
    xpYield: 25,
    coinYield: 12,
  },
  {
    id: 'h4',
    title: 'Zero Distraction Coding Block',
    category: 'focus',
    streakCount: 11,
    bestStreak: 14,
    lastCompletedDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    completedDates: Array.from({ length: 11 }, (_, i) => new Date(Date.now() - (10 - i) * 86400000).toISOString().split('T')[0]),
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
    icon: '🎮',
    description: 'Guilt-free gaming block on your favorite PC or console game.',
  },
  {
    id: 'r2',
    title: 'Artisan Espresso / Cafe Treat',
    cost: 100,
    category: 'Treats',
    icon: '☕',
    description: 'A specialty coffee or dessert at your favorite local cafe.',
  },
  {
    id: 'r3',
    title: 'Movie Night & Popcorn',
    cost: 220,
    category: 'Leisure',
    icon: '🎬',
    description: 'Watch a movie or new series episode with complete peace of mind.',
  },
  {
    id: 'r4',
    title: 'Book / Tech Gear Purchase',
    cost: 500,
    category: 'Investment',
    icon: '📚',
    description: 'Buy that book, mechanical keycap, or productivity gadget.',
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'a1',
    title: 'First Blood',
    description: 'Complete your first tactical bounty.',
    category: 'quests',
    icon: '🎯',
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
    icon: '⚔️',
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
    icon: '🔥',
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
    icon: '🏰',
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
    icon: '🏆',
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
    icon: '🧠',
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
      version: "2.0",
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackup: (json: string): boolean => {
    try {
      const data = JSON.parse(json);
      // version-aware: accept 2.0 and legacy (no version) backups
      if (data.version && data.version !== '2.0' && data.version !== '1.0') {
        // unknown future version — still attempt to import known keys
      }
      
      // Validate imported data structure
      if (data.profile) {
        // Ensure required profile fields exist with safe defaults
        const validatedProfile = {
          name: typeof data.profile.name === 'string' ? data.profile.name : INITIAL_PROFILE.name,
          title: typeof data.profile.title === 'string' ? data.profile.title : INITIAL_PROFILE.title,
          level: Number.isInteger(data.profile.level) && data.profile.level > 0 ? data.profile.level : INITIAL_PROFILE.level,
          xp: Number.isInteger(data.profile.xp) && data.profile.xp >= 0 ? data.profile.xp : INITIAL_PROFILE.xp,
          xpToNextLevel: Number.isInteger(data.profile.xpToNextLevel) && data.profile.xpToNextLevel > 0 ? data.profile.xpToNextLevel : INITIAL_PROFILE.xpToNextLevel,
          coins: Number.isInteger(data.profile.coins) && data.profile.coins >= 0 ? data.profile.coins : INITIAL_PROFILE.coins,
          gems: Number.isInteger(data.profile.gems) && data.profile.gems >= 0 ? data.profile.gems : INITIAL_PROFILE.gems,
          energy: Number.isInteger(data.profile.energy) && data.profile.energy >= 0 ? data.profile.energy : INITIAL_PROFILE.energy,
          maxEnergy: Number.isInteger(data.profile.maxEnergy) && data.profile.maxEnergy > 0 ? data.profile.maxEnergy : INITIAL_PROFILE.maxEnergy,
          streakDays: Number.isInteger(data.profile.streakDays) && data.profile.streakDays >= 0 ? data.profile.streakDays : INITIAL_PROFILE.streakDays,
          citadelTier: Number.isInteger(data.profile.citadelTier) && data.profile.citadelTier >= 0 ? data.profile.citadelTier : INITIAL_PROFILE.citadelTier,
          citadelPower: Number.isInteger(data.profile.citadelPower) && data.profile.citadelPower >= 0 ? data.profile.citadelPower : INITIAL_PROFILE.citadelPower,
          citadelMaxPower: Number.isInteger(data.profile.citadelMaxPower) && data.profile.citadelMaxPower > 0 ? data.profile.citadelMaxPower : INITIAL_PROFILE.citadelMaxPower,
          totalFocusMinutes: Number.isInteger(data.profile.totalFocusMinutes) && data.profile.totalFocusMinutes >= 0 ? data.profile.totalFocusMinutes : INITIAL_PROFILE.totalFocusMinutes,
          completedQuestsCount: Number.isInteger(data.profile.completedQuestsCount) && data.profile.completedQuestsCount >= 0 ? data.profile.completedQuestsCount : INITIAL_PROFILE.completedQuestsCount,
          soundEnabled: typeof data.profile.soundEnabled === 'boolean' ? data.profile.soundEnabled : INITIAL_PROFILE.soundEnabled,
        };
        StorageService.setProfile(validatedProfile);
      }
      
      // Validate quests
      if (Array.isArray(data.quests)) {
        const validatedQuests = data.quests
          .filter((q: unknown): q is Record<string, unknown> => q !== null && typeof q === 'object' && typeof (q as Record<string, unknown>).id === 'string' && typeof (q as Record<string, unknown>).title === 'string')
          .map((q: Record<string, unknown>) => ({
            id: q.id as string,
            title: q.title as string,
            description: typeof q.description === 'string' ? q.description : undefined,
            category: ['daily', 'bounty', 'epic', 'habit'].includes(q.category as string) ? (q.category as 'daily' | 'bounty' | 'epic' | 'habit') : 'daily',
            tag: ['Study', 'Coding', 'Fitness', 'Personal', 'Work', 'Creative', 'Deep Work'].includes(q.tag as string) ? (q.tag as 'Study' | 'Coding' | 'Fitness' | 'Personal' | 'Work' | 'Creative' | 'Deep Work') : 'Personal',
            xpReward: Number.isInteger(q.xpReward) && typeof q.xpReward === 'number' && q.xpReward >= 0 ? q.xpReward : 0,
            coinsReward: Number.isInteger(q.coinsReward) && typeof q.coinsReward === 'number' && q.coinsReward >= 0 ? q.coinsReward : 0,
            isCompleted: Boolean(q.isCompleted),
            completedAt: typeof q.completedAt === 'string' ? q.completedAt : undefined,
            dueLabel: typeof q.dueLabel === 'string' ? q.dueLabel : undefined,
            estimatedMinutes: Number.isInteger(q.estimatedMinutes) && typeof q.estimatedMinutes === 'number' && q.estimatedMinutes > 0 ? q.estimatedMinutes : undefined,
          }));
        StorageService.setQuests(validatedQuests);
      }
      
      // Validate habits
      if (Array.isArray(data.habits)) {
        const validatedHabits = data.habits
          .filter((h: unknown): h is Record<string, unknown> => h !== null && typeof h === 'object' && typeof (h as Record<string, unknown>).id === 'string' && typeof (h as Record<string, unknown>).title === 'string')
          .map((h: Record<string, unknown>) => ({
            id: h.id as string,
            title: h.title as string,
            category: ['focus', 'vitality', 'mind', 'routine'].includes(h.category as string) ? (h.category as 'focus' | 'vitality' | 'mind' | 'routine') : 'routine',
            streakCount: Number.isInteger(h.streakCount) && typeof h.streakCount === 'number' && h.streakCount >= 0 ? h.streakCount : 0,
            bestStreak: Number.isInteger(h.bestStreak) && typeof h.bestStreak === 'number' && h.bestStreak >= 0 ? h.bestStreak : 0,
            lastCompletedDate: typeof h.lastCompletedDate === 'string' ? h.lastCompletedDate : undefined,
            completedDates: Array.isArray(h.completedDates) ? h.completedDates.filter((d: unknown): d is string => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) : [],
            xpYield: Number.isInteger(h.xpYield) && typeof h.xpYield === 'number' && h.xpYield >= 0 ? h.xpYield : 0,
            coinYield: Number.isInteger(h.coinYield) && typeof h.coinYield === 'number' && h.coinYield >= 0 ? h.coinYield : 0,
            icon: typeof h.icon === 'string' ? h.icon : undefined,
          }));
        StorageService.setHabits(validatedHabits);
      }
      
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
