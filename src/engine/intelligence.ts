import type { Quest, FocusEffortLog, ProductivitySnapshot, Campaign } from '../types';

function daysAgo(n: number): number { return Date.now() - n * 86400000; }

export function buildSnapshot(quests: Quest[], logs: FocusEffortLog[], windowDays = 14): ProductivitySnapshot {
  const since = daysAgo(windowDays);
  const windowQuests = quests.filter(q => {
    const c = q.createdAt ? new Date(q.createdAt).getTime() : 0;
    const d = q.completedAt ? new Date(q.completedAt).getTime() : 0;
    const hasCreatedAt = Boolean(q.createdAt);
    if (!hasCreatedAt) return true; // legacy quests always in window for fallback
    return c >= since || d >= since || (!q.isCompleted && c === 0);
  });
  const hasTimestamps = quests.some(q => Boolean(q.createdAt));
  const totalQuests = hasTimestamps ? windowQuests.length : quests.length;
  const src = hasTimestamps ? windowQuests : quests;
  const completedQuests = src.filter(q => q.isCompleted && q.completedAt && new Date(q.completedAt).getTime() >= since).length;
  const completionRate = totalQuests ? Math.round((src.filter(q=>q.isCompleted).length / totalQuests) * 100) : 0;

  const estimated = src.map(q => q.estimatedMinutes).filter((v): v is number => typeof v === 'number');
  const actual = src.filter(q=> typeof q.actualMinutes === 'number').map(q=> q.actualMinutes!);
  const avgEstimatedMinutes = estimated.length ? Math.round(estimated.reduce((a,b)=>a+b,0)/estimated.length) : 0;
  const avgActualMinutes = actual.length ? Math.round(actual.reduce((a,b)=>a+b,0)/actual.length) : 0;
  const estimationBias = avgEstimatedMinutes && avgActualMinutes ? Math.round(((avgActualMinutes - avgEstimatedMinutes)/avgEstimatedMinutes)*100) : 0;
  const postponedCount = src.reduce((s,q)=> s + (q.postponedCount ?? 0), 0);
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueCount = src.filter(q=> !q.isCompleted && q.dueDate && q.dueDate < todayStr).length;

  const windowLogs = logs.filter(l=> l.startedAt >= since);
  const focusSessions = windowLogs.length;
  const completedFocus = windowLogs.filter(l=> l.completed).length;
  const focusCompletionRate = focusSessions ? Math.round((completedFocus / focusSessions)*100) : 0;
  const avgFocusMinutes = focusSessions ? Math.round(windowLogs.reduce((s,l)=> s+l.actualMinutes,0)/focusSessions) : 0;
  const velocityPerDay = windowDays ? +(completedQuests / windowDays).toFixed(2) : 0;

  return {
    windowDays,
    totalQuests,
    completedQuests: src.filter(q=>q.isCompleted).length,
    completionRate,
    avgEstimatedMinutes,
    avgActualMinutes,
    estimationBias,
    postponedCount,
    overdueCount,
    focusSessions,
    focusCompletionRate,
    avgFocusMinutes,
    velocityPerDay,
  };
}

export function deriveInsights(snapshot: ProductivitySnapshot, campaigns: Campaign[], quests: Quest[]): string[] {
  const insights: string[] = [];
  if (snapshot.totalQuests === 0) {
    insights.push("No quests in window — create a campaign or forge quests to start tracking velocity.");
    return insights;
  }
  if (snapshot.completionRate < 40) {
    insights.push(`Completion rate ${snapshot.completionRate}% is low — plan fewer objectives per day and focus on the top 3 daily priorities.`);
  } else if (snapshot.completionRate >= 75) {
    insights.push(`Strong completion ${snapshot.completionRate}% — velocity ${snapshot.velocityPerDay}/day suggests capacity for a stretch goal.`);
  } else {
    insights.push(`Completion ${snapshot.completionRate}% — steady. Keep batching blocked quests and protecting focus time.`);
  }
  if (Math.abs(snapshot.estimationBias) >= 20) {
    if (snapshot.estimationBias > 0) insights.push(`Tasks take ~${snapshot.estimationBias}% longer than estimated — add buffer to future estimates.`);
    else insights.push(`Tasks finish ~${Math.abs(snapshot.estimationBias)}% faster than estimated — you can tighten plans.`);
  }
  if (snapshot.postponedCount >= 5) {
    insights.push(`Postponed ${snapshot.postponedCount}x in ${snapshot.windowDays} days — break large quests into smaller dependencies.`);
  }
  if (snapshot.overdueCount > 0) {
    insights.push(`${snapshot.overdueCount} overdue quest${snapshot.overdueCount>1?'s':''} pending — prioritize overdue in today's command center.`);
  }
  if (snapshot.focusSessions > 0 && snapshot.focusCompletionRate < 60) {
    insights.push(`Focus sessions complete only ${snapshot.focusCompletionRate}% — shorten default duration or remove blockers before starting.`);
  } else if (snapshot.focusSessions >= 5 && snapshot.focusCompletionRate >= 80) {
    insights.push(`Focus discipline high (${snapshot.focusCompletionRate}%) — extend sessions by 5 min for deeper work.`);
  }
  // Campaign insights
  const active = campaigns.filter(c=> c.status==='active');
  if (active.length === 0 && snapshot.totalQuests > 0) {
    insights.push("No active campaign — group related quests into a campaign to unlock milestone tracking.");
  } else {
    for (const c of active) {
      const mIds = c.milestones.flatMap(m=>m.questIds);
      const byId = new Map(quests.map(q=>[q.id,q] as const));
      const done = mIds.filter(id=> byId.get(id)?.isCompleted).length;
      const pct = mIds.length ? Math.round(done/mIds.length*100) : 0;
      if (mIds.length > 0 && pct < 20) insights.push(`Campaign "${c.title}" at ${pct}% — first milestone needs momentum.`);
      if (mIds.length > 0 && pct >= 80) insights.push(`Campaign "${c.title}" at ${pct}% — push to close the final milestone.`);
    }
  }
  if (snapshot.velocityPerDay < 0.5 && snapshot.totalQuests >= 6) {
    insights.push(`Velocity ${snapshot.velocityPerDay}/day is below throughput — reduce WIP by archiving paused campaigns.`);
  }
  return insights.slice(0, 6);
}

export function suggestDailyBudget(snapshot: ProductivitySnapshot): number {
  // Recommend available minutes based on past focus + velocity
  if (snapshot.avgFocusMinutes > 0) return Math.min(180, Math.max(60, snapshot.avgFocusMinutes * 3));
  return 90;
}
