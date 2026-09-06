import { Quest, QuestTier } from '../../types';

export interface QuestCreationParams {
  title: string;
  tier: QuestTier;
  category?: 'bounty' | 'epic' | 'habit';
  dueLabel?: string;
  description?: string;
  isUrgent?: boolean;
}

export interface QuestCompletionResult {
  quest: Quest;
  xpEarned: number;
  coinsEarned: number;
  streakShieldsEarned: number;
  trophyPointsEarned: number;
  shouldDropChest: boolean;
}

/**
 * Calculates standard XP and coin rewards for a given quest tier.
 */
export function getTierRewards(tier: QuestTier): { xpReward: number; coinReward: number } {
  switch (tier) {
    case 'Tier I':
    case 'Common':
      return { xpReward: 80, coinReward: 10 };
    case 'Tier II':
    case 'Rare':
      return { xpReward: 150, coinReward: 20 };
    case 'Tier III':
      return { xpReward: 300, coinReward: 40 };
    case 'Epic':
      return { xpReward: 350, coinReward: 45 };
    case 'Urgent':
      return { xpReward: 120, coinReward: 0 };
    default:
      return { xpReward: 80, coinReward: 10 };
  }
}

/**
 * Creates a new quest object with defaults.
 */
export function createQuestEntity(params: QuestCreationParams): Quest {
  const { xpReward, coinReward } = getTierRewards(params.tier);

  return {
    id: `quest-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: params.title.trim(),
    description: params.description || 'Tactical bounty deployed from the Mission Forge.',
    category: params.category || 'bounty',
    tier: params.tier,
    xpReward,
    coinReward,
    streakShieldReward: params.isUrgent || params.tier === 'Urgent' ? 1 : undefined,
    dueLabel: params.dueLabel || 'Today',
    isUrgent: params.isUrgent ?? (params.tier === 'Urgent'),
    isCompleted: false,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Resolves quest completion and calculates all yields.
 */
export function completeQuestEntity(quest: Quest): QuestCompletionResult {
  if (quest.isCompleted) {
    return {
      quest,
      xpEarned: 0,
      coinsEarned: 0,
      streakShieldsEarned: 0,
      trophyPointsEarned: 0,
      shouldDropChest: false,
    };
  }

  const completedQuest: Quest = {
    ...quest,
    isCompleted: true,
    completedAt: new Date().toISOString(),
  };

  return {
    quest: completedQuest,
    xpEarned: quest.xpReward,
    coinsEarned: quest.coinReward,
    streakShieldsEarned: quest.streakShieldReward || 0,
    trophyPointsEarned: 25,
    shouldDropChest: true,
  };
}
