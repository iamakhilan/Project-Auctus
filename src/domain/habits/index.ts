import { Habit, HabitCategory } from '../../types';

export interface HabitCreationParams {
  title: string;
  category?: HabitCategory;
  description?: string;
  xpYield?: number;
  coinYield?: number;
  icon?: string;
}

export interface HabitCompletionResult {
  habit: Habit;
  xpEarned: number;
  coinsEarned: number;
  milestoneBonus: { xp: number; coins: number } | null;
  newMilestoneDay: number | null;
}

export const HABIT_MILESTONES = [7, 14, 21, 30, 60, 100, 365];

export function getHabitMilestoneBonus(streak: number): { xp: number; coins: number } | null {
  switch (streak) {
    case 7:
      return { xp: 150, coins: 25 };
    case 14:
      return { xp: 250, coins: 40 };
    case 21:
      return { xp: 350, coins: 60 };
    case 30:
      return { xp: 500, coins: 100 };
    case 60:
      return { xp: 1000, coins: 200 };
    case 100:
      return { xp: 2000, coins: 400 };
    case 365:
      return { xp: 5000, coins: 1000 };
    default:
      return null;
  }
}

/**
 * Format Date to YYYY-MM-DD
 */
export function formatDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Computes yesterday's date string YYYY-MM-DD
 */
export function getYesterdayDateStr(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - 1);
  return formatDateKey(date);
}

export function createHabitEntity(params: HabitCreationParams): Habit {
  return {
    id: `habit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: params.title.trim(),
    description: params.description || 'Consistent daily productivity discipline protocol.',
    category: params.category || 'vitality',
    streakCount: 0,
    bestStreak: 0,
    completedDates: [],
    xpYield: params.xpYield || 75,
    coinYield: params.coinYield || 10,
    milestonesAchieved: [],
    createdAt: new Date().toISOString(),
    icon: params.icon || 'auto_fix',
  };
}

export function isHabitCompletedOnDate(habit: Habit, dateStr: string): boolean {
  return (
    habit.lastCompletedDate === dateStr ||
    habit.completedDates.includes(dateStr)
  );
}

/**
 * Completes a habit for a given day with streak and milestone calculation.
 */
export function completeHabitEntity(
  habit: Habit,
  dateStr = formatDateKey()
): HabitCompletionResult {
  if (isHabitCompletedOnDate(habit, dateStr)) {
    return {
      habit,
      xpEarned: 0,
      coinsEarned: 0,
      milestoneBonus: null,
      newMilestoneDay: null,
    };
  }

  const yesterdayStr = getYesterdayDateStr(dateStr);
  const wasYesterdayCompleted = habit.lastCompletedDate === yesterdayStr;

  const newStreak = wasYesterdayCompleted ? habit.streakCount + 1 : 1;
  const newBestStreak = Math.max(habit.bestStreak, newStreak);

  let milestoneBonus: { xp: number; coins: number } | null = null;
  let newMilestoneDay: number | null = null;
  const milestonesAchieved = [...habit.milestonesAchieved];

  if (HABIT_MILESTONES.includes(newStreak) && !milestonesAchieved.includes(newStreak)) {
    milestonesAchieved.push(newStreak);
    milestoneBonus = getHabitMilestoneBonus(newStreak);
    newMilestoneDay = newStreak;
  }

  const updatedHabit: Habit = {
    ...habit,
    streakCount: newStreak,
    bestStreak: newBestStreak,
    lastCompletedDate: dateStr,
    completedDates: [...habit.completedDates, dateStr],
    milestonesAchieved,
  };

  const totalXp = habit.xpYield + (milestoneBonus ? milestoneBonus.xp : 0);
  const totalCoins = habit.coinYield + (milestoneBonus ? milestoneBonus.coins : 0);

  return {
    habit: updatedHabit,
    xpEarned: totalXp,
    coinsEarned: totalCoins,
    milestoneBonus,
    newMilestoneDay,
  };
}

export const initialHabits: Habit[] = [
  {
    id: 'habit-stretch',
    title: 'Morning 20-Min Tactical Stretch',
    description: 'Maintain physical vitality baseline and core resilience.',
    category: 'vitality',
    streakCount: 4,
    bestStreak: 12,
    lastCompletedDate: undefined,
    completedDates: [],
    xpYield: 80,
    coinYield: 10,
    milestonesAchieved: [],
    createdAt: new Date().toISOString(),
    icon: 'fitness_center',
  },
  {
    id: 'habit-deepwork',
    title: '2-Hour Zero Distraction Deep Work Block',
    description: 'Conquer highest cognitive tasks before midday distractions occur.',
    category: 'focus',
    streakCount: 7,
    bestStreak: 14,
    lastCompletedDate: undefined,
    completedDates: [],
    xpYield: 120,
    coinYield: 20,
    milestonesAchieved: [7],
    createdAt: new Date().toISOString(),
    icon: 'bolt',
  },
  {
    id: 'habit-reading',
    title: '30-Min High Intensity Reading & Study',
    description: 'Tactical leadership doctrine and engineering architecture books.',
    category: 'morning',
    streakCount: 3,
    bestStreak: 8,
    lastCompletedDate: undefined,
    completedDates: [],
    xpYield: 70,
    coinYield: 10,
    milestonesAchieved: [],
    createdAt: new Date().toISOString(),
    icon: 'menu_book',
  },
  {
    id: 'habit-review',
    title: 'Evening Run Recap & Midnight Lock',
    description: 'Audit tasks completed, organize Mission Forge queue for tomorrow.',
    category: 'evening',
    streakCount: 5,
    bestStreak: 9,
    lastCompletedDate: undefined,
    completedDates: [],
    xpYield: 60,
    coinYield: 5,
    milestonesAchieved: [],
    createdAt: new Date().toISOString(),
    icon: 'checklist',
  },
];
