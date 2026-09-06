import {
  PlayerProfile,
  Quest,
  Habit,
  EconomyTransaction,
} from '../../types';

export interface DailySummaryMetrics {
  date: string; // YYYY-MM-DD
  xpEarned: number;
  coinsEarned: number;
  coinsSpent: number;
  focusMinutes: number;
  questsCompletedCount: number;
  habitsCheckedInCount: number;
  disciplineScore: number; // 0 - 100
  ratingTitle: string;
}

export interface ProductivityVelocity {
  weeklyAverageXp: number;
  weeklyAverageFocusMinutes: number;
  questCompletionRatePercent: number;
  habitConsistencyScore: number;
}

/**
 * Formats Date to YYYY-MM-DD string.
 */
export function getTodayDateStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates a 0-100 Discipline Rating based on daily productivity milestones.
 */
export function calculateDisciplineScore(
  focusMinutes: number,
  questsCompleted: number,
  habitsCompleted: number
): { score: number; ratingTitle: string } {
  // Focus score (up to 40 pts for 60m+ focus)
  const focusPts = Math.min(40, Math.round((focusMinutes / 60) * 40));

  // Quest score (up to 30 pts for 3+ quests)
  const questPts = Math.min(30, questsCompleted * 10);

  // Habit score (up to 30 pts for 3+ habits)
  const habitPts = Math.min(30, habitsCompleted * 10);

  const totalScore = Math.min(100, Math.max(0, focusPts + questPts + habitPts));

  let ratingTitle = 'Novice Sentry';
  if (totalScore >= 90) ratingTitle = 'Apex Archon (S-Tier)';
  else if (totalScore >= 75) ratingTitle = 'Spire Paragon (A-Tier)';
  else if (totalScore >= 50) ratingTitle = 'Sanctuary Knight (B-Tier)';
  else if (totalScore >= 25) ratingTitle = 'Disciplined Warden (C-Tier)';

  return { score: totalScore, ratingTitle };
}

/**
 * Generates an auditable daily summary for today.
 */
export function generateDailySummary(
  dateStr = getTodayDateStr(),
  profile: PlayerProfile,
  quests: Quest[],
  habits: Habit[],
  transactions: EconomyTransaction[],
  todayFocusMinutes = 0
): DailySummaryMetrics {
  const startOfDayMs = new Date(`${dateStr}T00:00:00`).getTime();
  const endOfDayMs = startOfDayMs + 24 * 3600 * 1000;

  // Filter transactions for today
  const todayTxs = transactions.filter(
    tx => tx.timestamp >= startOfDayMs && tx.timestamp <= endOfDayMs
  );

  let coinsEarned = 0;
  let coinsSpent = 0;
  for (const tx of todayTxs) {
    if (tx.currency === 'coins') {
      if (tx.type === 'earn') coinsEarned += tx.amount;
      else if (tx.type === 'spend') coinsSpent += tx.amount;
    }
  }

  // Quests completed
  const questsCompletedCount = quests.filter(q => q.isCompleted).length;

  // Habits checked in today
  const habitsCheckedInCount = habits.filter(
    h => h.lastCompletedDate === dateStr || h.completedDates.includes(dateStr)
  ).length;

  // Focus time (use provided or estimate from profile)
  const focusMinutes = todayFocusMinutes > 0 ? todayFocusMinutes : Math.min(profile.totalFocusMinutes, 60);

  const { score, ratingTitle } = calculateDisciplineScore(
    focusMinutes,
    questsCompletedCount,
    habitsCheckedInCount
  );

  // Estimated XP earned
  const xpEarned = focusMinutes * 4 + questsCompletedCount * 75 + habitsCheckedInCount * 75;

  return {
    date: dateStr,
    xpEarned,
    coinsEarned,
    coinsSpent,
    focusMinutes,
    questsCompletedCount,
    habitsCheckedInCount,
    disciplineScore: score,
    ratingTitle,
  };
}

/**
 * Generates formatted markdown text suitable for copying to clipboard or team sharing.
 */
export function formatDailyDebriefText(metrics: DailySummaryMetrics, playerName = 'Champion'): string {
  return [
    `🏰 AUCTUS DAILY DEBRIEF — ${metrics.date}`,
    `Commander: ${playerName}`,
    `Rating: ${metrics.disciplineScore}/100 • ${metrics.ratingTitle}`,
    `----------------------------------------`,
    `⚡ Deep Work: ${metrics.focusMinutes}m logged`,
    `⚔️ Missions Conquered: ${metrics.questsCompletedCount}`,
    `🔥 Habits Maintained: ${metrics.habitsCheckedInCount}`,
    `💰 Treasury Inflow: +${metrics.coinsEarned} Coins | Spent: -${metrics.coinsSpent}`,
    `✨ XP Generated: +${metrics.xpEarned} XP`,
    `----------------------------------------`,
    `Forged with Auctus V2 — Personal Productivity RPG`,
  ].join('\n');
}

/**
 * Computes 7-day velocity metrics.
 */
export function computeProductivityVelocity(
  profile: PlayerProfile,
  quests: Quest[],
  habits: Habit[]
): ProductivityVelocity {
  const totalQuests = quests.length;
  const completedQuests = quests.filter(q => q.isCompleted).length;
  const completionRate = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 100;

  const totalHabits = habits.length;
  const activeHabits = habits.filter(h => h.streakCount > 0).length;
  const habitConsistency = totalHabits > 0 ? Math.round((activeHabits / totalHabits) * 100) : 100;

  return {
    weeklyAverageXp: Math.round(profile.xp / 7),
    weeklyAverageFocusMinutes: Math.round(profile.totalFocusMinutes / 7),
    questCompletionRatePercent: completionRate,
    habitConsistencyScore: habitConsistency,
  };
}
