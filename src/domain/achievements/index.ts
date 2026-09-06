import { Achievement, PlayerProfile, Habit, Quest } from '../../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  // Focus category
  {
    id: 'ach-focus-initiate',
    title: 'Focus Initiate',
    description: 'Complete your first deep work focus sprint in the Focus Arena.',
    category: 'focus',
    icon: 'swords',
    targetValue: 1,
    currentValue: 0,
    isUnlocked: false,
    rewards: { xp: 150, coins: 50 },
  },
  {
    id: 'ach-focus-novice',
    title: 'Deep Work Novice',
    description: 'Accumulate 60 minutes of deep focus time.',
    category: 'focus',
    icon: 'timer',
    targetValue: 60,
    currentValue: 0,
    isUnlocked: false,
    rewards: { xp: 300, coins: 100, shards: 2 },
  },
  {
    id: 'ach-focus-scholar',
    title: 'Spire Scholar',
    description: 'Accumulate 300 minutes (5 hours) of uninterrupted focus.',
    category: 'focus',
    icon: 'psychology',
    targetValue: 300,
    currentValue: 0,
    isUnlocked: false,
    rewards: { xp: 800, coins: 250, shards: 5, titleReward: 'Spire Scholar' },
  },
  {
    id: 'ach-focus-chronomancer',
    title: 'Grand Chronomancer',
    description: 'Master the flow of time by logging 1,000 minutes of deep work.',
    category: 'focus',
    icon: 'hourglass_top',
    targetValue: 1000,
    currentValue: 0,
    isUnlocked: false,
    rewards: { xp: 2500, coins: 1000, shards: 15, titleReward: 'Chronomancer' },
  },

  // Quests category
  {
    id: 'ach-quest-first',
    title: 'First Bounty',
    description: 'Complete your very first mission bounty in the Mission Forge.',
    category: 'quests',
    icon: 'task_alt',
    targetValue: 1,
    currentValue: 0,
    isUnlocked: false,
    rewards: { xp: 100, coins: 30 },
  },
  {
    id: 'ach-quest-assassin',
    title: 'Task Assassin',
    description: 'Conquer 10 mission bounties across the realm.',
    category: 'quests',
    icon: 'done_all',
    targetValue: 10,
    currentValue: 0,
    isUnlocked: false,
    rewards: { xp: 400, coins: 150, shards: 3 },
  },
  {
    id: 'ach-quest-centurion',
    title: 'Centurion Crusader',
    description: 'Complete 50 mission bounties with unflinching resolve.',
    category: 'quests',
    icon: 'military_tech',
    targetValue: 50,
    currentValue: 0,
    isUnlocked: false,
    rewards: { xp: 2000, coins: 750, shards: 12, titleReward: 'Centurion' },
  },

  // Habits category
  {
    id: 'ach-habit-spark',
    title: 'Discipline Spark',
    description: 'Maintain a 3-day streak on any daily habit.',
    category: 'habits',
    icon: 'local_fire_department',
    targetValue: 3,
    currentValue: 0,
    isUnlocked: false,
    rewards: { xp: 200, coins: 50 },
  },
  {
    id: 'ach-habit-vanguard',
    title: 'Unbroken Vanguard',
    description: 'Reach a 7-day streak on any daily discipline ritual.',
    category: 'habits',
    icon: 'bolt',
    targetValue: 7,
    currentValue: 0,
    isUnlocked: false,
    rewards: { xp: 600, coins: 200, shards: 4, titleReward: 'Vanguard' },
  },
  {
    id: 'ach-habit-ironwill',
    title: 'Iron Will Sovereign',
    description: 'Achieve an unbroken 30-day streak on a single habit.',
    category: 'habits',
    icon: 'verified',
    targetValue: 30,
    currentValue: 0,
    isUnlocked: false,
    rewards: { xp: 3000, coins: 1200, shards: 20, titleReward: 'Iron Sovereign' },
  },

  // Economy & Chests category
  {
    id: 'ach-eco-chest-hunter',
    title: 'Relic Hunter',
    description: 'Crack open and claim loot from 5 mission chests.',
    category: 'economy',
    icon: 'inventory_2',
    targetValue: 5,
    currentValue: 0,
    isUnlocked: false,
    rewards: { xp: 350, coins: 100, shards: 2 },
  },
  {
    id: 'ach-eco-tycoon',
    title: 'Vault Tycoon',
    description: 'Accumulate 1,000 Auctus Gold Coins in your Citadel Treasury.',
    category: 'economy',
    icon: 'monetization_on',
    targetValue: 1000,
    currentValue: 0,
    isUnlocked: false,
    rewards: { xp: 750, coins: 250, shards: 5, titleReward: 'Vault Tycoon' },
  },
  {
    id: 'ach-eco-shards',
    title: 'Shard Collector',
    description: 'Bank 15 Spire Shards in your royal reserve.',
    category: 'economy',
    icon: 'diamond',
    targetValue: 15,
    currentValue: 0,
    isUnlocked: false,
    rewards: { xp: 500, coins: 200, shards: 5 },
  },

  // Citadel category
  {
    id: 'ach-citadel-stronghold',
    title: 'Emerald Stronghold',
    description: 'Upgrade your citadel to Tier 2: Emerald Stronghold.',
    category: 'citadel',
    icon: 'account_balance',
    targetValue: 2,
    currentValue: 1,
    isUnlocked: false,
    rewards: { xp: 800, coins: 300, shards: 5 },
  },
  {
    id: 'ach-citadel-champion',
    title: 'Apex Archon',
    description: 'Reach Citadel Champion Level 10.',
    category: 'citadel',
    icon: 'shield_moon',
    targetValue: 10,
    currentValue: 1,
    isUnlocked: false,
    rewards: { xp: 2500, coins: 1000, shards: 25, titleReward: 'Apex Archon' },
  },
];

export function getInitialAchievements(): Achievement[] {
  return INITIAL_ACHIEVEMENTS.map(a => ({ ...a }));
}

/**
 * Pure evaluation function that calculates current progress for every achievement
 * and identifies newly unlocked ones.
 */
export function evaluateAchievements(
  currentAchievements: Achievement[],
  profile: PlayerProfile,
  habits: Habit[],
  quests: Quest[]
): { updated: Achievement[]; newlyUnlocked: Achievement[] } {
  const newlyUnlocked: Achievement[] = [];
  const completedQuestsCount = quests.filter(q => q.isCompleted).length;
  const bestHabitStreak = habits.reduce((max, h) => Math.max(max, h.bestStreak, h.streakCount), 0);

  const updated = currentAchievements.map(ach => {
    let currentVal = 0;

    switch (ach.id) {
      // Focus
      case 'ach-focus-initiate':
        currentVal = profile.totalFocusMinutes > 0 ? 1 : 0;
        break;
      case 'ach-focus-novice':
      case 'ach-focus-scholar':
      case 'ach-focus-chronomancer':
        currentVal = profile.totalFocusMinutes;
        break;

      // Quests
      case 'ach-quest-first':
      case 'ach-quest-assassin':
      case 'ach-quest-centurion':
        currentVal = Math.max(profile.completedQuestsCount, completedQuestsCount);
        break;

      // Habits
      case 'ach-habit-spark':
      case 'ach-habit-vanguard':
      case 'ach-habit-ironwill':
        currentVal = Math.max(profile.streakDays, bestHabitStreak);
        break;

      // Economy
      case 'ach-eco-chest-hunter':
        currentVal = profile.unlockedChestsCount;
        break;
      case 'ach-eco-tycoon':
        currentVal = profile.coins;
        break;
      case 'ach-eco-shards':
        currentVal = profile.shards;
        break;

      // Citadel
      case 'ach-citadel-stronghold':
        currentVal = profile.citadelTier;
        break;
      case 'ach-citadel-champion':
        currentVal = profile.level;
        break;

      default:
        currentVal = ach.currentValue;
    }

    const cappedVal = Math.min(ach.targetValue, currentVal);
    const shouldUnlock = cappedVal >= ach.targetValue;

    if (shouldUnlock && !ach.isUnlocked) {
      const unlockedAch: Achievement = {
        ...ach,
        currentValue: cappedVal,
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
      };
      newlyUnlocked.push(unlockedAch);
      return unlockedAch;
    }

    return {
      ...ach,
      currentValue: cappedVal,
    };
  });

  return { updated, newlyUnlocked };
}
