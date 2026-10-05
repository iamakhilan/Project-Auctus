import { Achievement, PlayerProfile, Quest, Habit } from '../types';

export interface EvaluationContext {
  profile: PlayerProfile;
  quests: Quest[];
  habits: Habit[];
}

export function evaluateAchievementProgress(
  achievement: Achievement,
  context: EvaluationContext
): { currentValue: number; isUnlocked: boolean } {
  let currentValue = 0;

  switch (achievement.category) {
    case 'focus':
      currentValue = context.profile.totalFocusMinutes;
      break;
    case 'quests':
      currentValue = context.quests.filter((q) => q.isCompleted).length;
      break;
    case 'habits':
      currentValue = context.habits.reduce(
        (max, h) => Math.max(max, h.streakCount),
        0
      );
      break;
    case 'citadel':
      currentValue = context.profile.citadelPower;
      break;
    case 'streak':
      currentValue = context.profile.streakDays;
      break;
    default:
      currentValue = achievement.currentValue;
  }

  const isUnlocked = achievement.isUnlocked || currentValue >= achievement.targetValue;
  return {
    currentValue,
    isUnlocked,
  };
}

export function findNewlyUnlockedAchievements(
  achievements: Achievement[],
  context: EvaluationContext
): Achievement[] {
  const newlyUnlocked: Achievement[] = [];

  for (const ach of achievements) {
    if (ach.isUnlocked) continue;
    const { currentValue, isUnlocked } = evaluateAchievementProgress(ach, context);
    if (isUnlocked && !ach.isUnlocked) {
      newlyUnlocked.push({
        ...ach,
        currentValue,
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
      });
    }
  }

  return newlyUnlocked;
}
