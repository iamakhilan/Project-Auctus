import { Quest, QuestTier, QuestCategory, QuestTag } from '../../types';

export interface QuestCreationParams {
  title: string;
  tier?: QuestTier;
  category?: QuestCategory;
  tag?: QuestTag;
  dueLabel?: string;
  description?: string;
  isUrgent?: boolean;
  notes?: string;
  estimatedMinutes?: number;
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
  const tier = params.tier || 'Tier I';
  const { xpReward, coinReward } = getTierRewards(tier);
  const isUrgent = params.isUrgent ?? (tier === 'Urgent');

  return {
    id: `quest-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: params.title.trim(),
    description: params.description || 'Tactical bounty deployed from the Mission Forge.',
    category: params.category || 'bounty',
    tier,
    tag: params.tag || 'Work',
    xpReward,
    coinReward,
    streakShieldReward: isUrgent ? 1 : undefined,
    dueLabel: params.dueLabel || 'Today',
    isUrgent,
    isStreakAtRisk: isUrgent,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    notes: params.notes,
    estimatedMinutes: params.estimatedMinutes || 25,
  };
}

/**
 * Updates an existing quest with new fields, recalculating rewards if tier changes.
 */
export function updateQuestEntity(quest: Quest, updates: Partial<QuestCreationParams>): Quest {
  const tier = updates.tier || quest.tier;
  const { xpReward, coinReward } = getTierRewards(tier);
  const isUrgent = updates.isUrgent ?? (tier === 'Urgent' ? true : quest.isUrgent);

  return {
    ...quest,
    ...updates,
    title: updates.title !== undefined ? updates.title.trim() : quest.title,
    tier,
    xpReward,
    coinReward,
    isUrgent,
    isStreakAtRisk: isUrgent && !quest.isCompleted,
  };
}

/**
 * Filters a list of quests by a category view filter.
 */
export function filterQuestsByCategory(
  quests: Quest[],
  filter: 'all' | 'bounty' | 'epic' | 'habit' | 'completed'
): Quest[] {
  switch (filter) {
    case 'all':
      return quests.filter(q => !q.isCompleted);
    case 'bounty':
      return quests.filter(q => !q.isCompleted && q.category === 'bounty');
    case 'epic':
      return quests.filter(q => !q.isCompleted && q.category === 'epic');
    case 'habit':
      return quests.filter(q => !q.isCompleted && q.category === 'habit');
    case 'completed':
      return quests.filter(q => q.isCompleted);
    default:
      return quests;
  }
}

/**
 * Sorts quests with priority: Urgent pending first, then high tier, then others, completed last.
 */
export function sortQuestsByPriority(quests: Quest[]): Quest[] {
  const tierWeight: Record<QuestTier, number> = {
    'Epic': 5,
    'Urgent': 6,
    'Tier III': 4,
    'Tier II': 3,
    'Rare': 3,
    'Tier I': 2,
    'Common': 1,
  };

  return [...quests].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    if (a.isUrgent !== b.isUrgent) {
      return a.isUrgent ? -1 : 1;
    }
    const weightA = tierWeight[a.tier] || 0;
    const weightB = tierWeight[b.tier] || 0;
    return weightB - weightA;
  });
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
    isStreakAtRisk: false,
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

/**
 * Removes a quest by ID from the quest list.
 */
export function deleteQuestEntity(quests: Quest[], questId: string): Quest[] {
  return quests.filter(q => q.id !== questId);
}
