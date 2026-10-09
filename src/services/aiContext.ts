import type { 
  Quest,
  Habit,
  Campaign,
  FocusEffortLog,
  Achievement,
  PlayerProfile,
  EconomyTransaction,
  WeeklyReview,
  ProductivitySnapshot,
  DailyObjective
} from '../types';
import { buildSnapshot } from '../engine/intelligence';
import { computeWeeklyWindow } from '../engine/weekly';
import { computeUrgency } from '../engine/planner';

export interface AIContextSnapshot {
  // Core player state
  profile: PlayerProfile;
  
  // Recent activity (last 14 days unless specified)
  quests: Quest[];
  habits: Habit[];
  focusLogs: FocusEffortLog[];
  campaigns: Campaign[];
  achievements: Achievement[];
  transactions: EconomyTransaction[];
  weeklyReviews: WeeklyReview[];
  
  // Derived analytics (calculated from existing systems)
  productivitySnapshot: ProductivitySnapshot;
  weeklyInsights: string[];
  dailyObjectives: DailyObjective[];
  
  // Current state
  activeTab: string;
  focusSessionActive: boolean;
  
  // Temporal context
  currentDate: string;
  currentWeek: { start: string; end: string };
  
  // Metadata
  contextVersion: string;
  generatedAt: string;
}

/**
 * Builds a comprehensive but focused AI context snapshot from existing AUCTUS data
 * Does NOT expose raw localStorage - only processes and aggregates existing data
 */
export function buildAIContext(
  quests: Quest[],
  habits: Habit[],
  focusLogs: FocusEffortLog[],
  campaigns: Campaign[],
  achievements: Achievement[],
  playerProfile: PlayerProfile,
  transactions: EconomyTransaction[],
  weeklyReviews: WeeklyReview[],
  activeTab: string,
  focusSessionActive: boolean,
  
): AIContextSnapshot {
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const { start: weekStart, end: weekEnd } = computeWeeklyWindow(now);
  
  // Build productivity snapshot using existing intelligence system (last 14 days)
  const productivitySnapshot = buildSnapshot(quests, focusLogs, 14);
  
  // Get latest weekly review if available
  const latestWeeklyReview = weeklyReviews[0] || null;
  const weeklyInsights = latestWeeklyReview?.insights || [];
  
  // Get current daily objectives
  const dailyObjectives = quests
    .filter(q => !q.isCompleted && q.source === 'review')
    .map(q => {
      // Find or create daily objective for this quest
      return {
        questId: q.id,
        urgencyScore: 0, // Will be computed below
        reasons: [],
        isBlocked: false,
        blockedBy: [],
        campaignId: q.campaignId,
        milestoneId: q.milestoneId
      };
    });
  
  // Enhance daily objectives with urgency scores and blocking info
  const questById = new Map(quests.map(q => [q.id, q]));
  const enhancedObjectives: DailyObjective[] = dailyObjectives.map(obj => {
    const quest = questById.get(obj.questId);
    if (!quest) return obj;
    
    const { score, reasons, blocked, blockedBy } = computeUrgency(
      quest, 
      campaigns.find(c => c.id === quest.campaignId), 
      questById
    );
    
    return {
      ...obj,
      urgencyScore: score,
      reasons,
      isBlocked: blocked,
      blockedBy
    };
  }).sort((a, b) => b.urgencyScore - a.urgencyScore); // Sort by urgency descending
  
  // Limit to most recent data to prevent context overflow
  const recentQuests = quests.slice(0, 50);
  const recentHabits = habits.slice(0, 20);
  const recentFocusLogs = focusLogs.slice(0, 100);
  const recentCampaigns = campaigns.slice(0, 20);
  const recentAchievements = achievements.slice(0, 50);
  const recentTransactions = transactions.slice(0, 100);
  const recentWeeklyReviews = weeklyReviews.slice(0, 12); // Last 3 months
  
  return {
    profile: playerProfile,
    quests: recentQuests,
    habits: recentHabits,
    focusLogs: recentFocusLogs,
    campaigns: recentCampaigns,
    achievements: recentAchievements,
    transactions: recentTransactions,
    weeklyReviews: recentWeeklyReviews,
    productivitySnapshot,
    weeklyInsights,
    dailyObjectives: enhancedObjectives,
    activeTab,
    focusSessionActive,
    currentDate,
    currentWeek: { start: weekStart, end: weekEnd },
    contextVersion: '1.0',
    generatedAt: now.toISOString()
  };
}

/**
 * Creates a condensed, token-efficient summary of the AI context for LLM consumption
 * Focuses on the most relevant information for productivity coaching
 */
export function createAISummary(context: AIContextSnapshot): string {
  const { 
    profile, 
    quests, 
    habits, 
    focusLogs, 
    campaigns, 
    achievements, 
    productivitySnapshot,
    weeklyInsights,
    dailyObjectives,
    currentDate
  } = context;
  
  // Calculate key metrics
  const activeQuests = quests.filter(q => !q.isCompleted).length;
  const completedToday = quests.filter(q => 
    q.isCompleted && q.completedAt && q.completedAt.startsWith(currentDate)
  ).length;
  
  const habitStreaks = habits.map(h => ({
    title: h.title,
    streak: h.streakCount,
    best: h.bestStreak
  }));
  
  const recentFocus = focusLogs.slice(0, 5).map(log => ({
    date: new Date(log.startedAt).toISOString().split('T')[0],
    minutes: log.actualMinutes,
    completed: log.completed
  }));
  
  const _campaignProgress = campaigns.map(c => ({
    title: c.title,
    progress: c.milestones.reduce((done, _m) => {
      // This would need quest completion data to calculate properly
      return done;
    }, 0),
    total: c.milestones.length
  }));
  
  const unlockedAchievements = achievements.filter(_a => 
    // This would need achievement lock data to check properly
    false // Placeholder - would need to check against achievement locks
  ).length;
  
  return `
PLAYER PROFILE:
- Level: ${profile.level} (${profile.xp}/${profile.xpToNextLevel} XP)
- Title: ${profile.title}
- Streak: ${profile.streakDays} days
- Citadel Tier: ${profile.citadelTier}/${profile.citadelMaxPower}

TODAY (${currentDate}):
- Completed Quests: ${completedToday}
- Active Quests: ${activeQuests}
- Focus Sessions Today: ${focusLogs.filter(l => 
  new Date(l.startedAt).toISOString().split('T')[0] === currentDate
).length}

RECENT PRODUCTIVITY (LAST 14 DAYS):
- Quest Completion Rate: ${productivitySnapshot.completionRate}%
- Avg Focus Session: ${productivitySnapshot.avgFocusMinutes} minutes
- Estimation Bias: ${productivitySnapshot.estimationBias}% 
  (${productivitySnapshot.estimationBias > 0 ? 'underestimating' : 'overestimating'} time)
- Focus Velocity: ${productivitySnapshot.velocityPerDay} quests/day
- Postponed Quests: ${productivitySnapshot.postponedCount}
- Overdue Quests: ${productivitySnapshot.overdueCount}

HABITS & STREAKS:
${habitStreaks.map(h => `- ${h.title}: ${h.streak}/${h.best} day streak`).join('\n')}

RECENT FOCUS SESSIONS:
${recentFocus.map(f => `- ${f.date}: ${f.minutes}min (${f.completed ? 'completed' : 'interrupted'})`).join('\n')}

ACTIVE CAMPAIGNS:
${campaigns.filter(c => c.status === 'active').map(c => `- ${c.title}`).join('\n') || 'None'}

WEEKLY INSIGHTS:
${weeklyInsights.map(i => `- ${i}`).join('\n') || 'No weekly review available'}

TOP PRIORITIES FOR TODAY:
${dailyObjectives.slice(0, 5).map(obj => {
  const quest = quests.find(q => q.id === obj.questId);
  return `- ${quest?.title || 'Unknown Quest'} (Urgency: ${obj.urgencyScore})${obj.isBlocked ? ' [BLOCKED]' : ''}`;
}).join('\n') || 'No daily objectives'}

RECENT ACHIEVEMENTS UNLOCKED: ${unlockedAchievements}
  `.trim();
}