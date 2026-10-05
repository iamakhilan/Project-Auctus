import type { Quest, Campaign, WeeklyReview, FocusEffortLog } from '../types';
import { buildSnapshot, deriveInsights } from './intelligence';

function mondayOf(date: Date): Date {
  const d = new Date(date); d.setHours(0,0,0,0);
  const day = d.getDay(); // 0 Sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}
function fmt(d: Date): string { return d.toISOString().split('T')[0]; }

export function computeWeeklyWindow(now = new Date()): { start: string; end: string } {
  const mon = mondayOf(now);
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
  return { start: fmt(mon), end: fmt(sun) };
}

export function buildWeeklyReview(quests: Quest[], campaigns: Campaign[], logs: FocusEffortLog[], now = new Date()): WeeklyReview {
  const { start, end } = computeWeeklyWindow(now);
  const since = new Date(start + 'T00:00:00').getTime();
  const until = new Date(end + 'T23:59:59').getTime();

  const planned = quests.filter(q => {
    const c = q.createdAt ? new Date(q.createdAt).getTime() : 0;
    return c >= since && c <= until;
  }).length || quests.length; // fallback for legacy without createdAt

  const completed = quests.filter(q => q.isCompleted && q.completedAt && new Date(q.completedAt).getTime() >= since && new Date(q.completedAt).getTime() <= until).length;
  const completionRate = planned ? Math.round((completed / planned)*100) : 0;
  const totalFocusMinutes = logs.filter(l=> l.startedAt >= since && l.startedAt <= until).reduce((s,l)=> s + l.actualMinutes, 0);
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueCarried = quests.filter(q=> !q.isCompleted && q.dueDate && q.dueDate < todayStr).length;

  const snapshot = buildSnapshot(quests, logs, 7);
  const insights = deriveInsights(snapshot, campaigns, quests);

  const activeCampaigns = campaigns.filter(c=> c.status==='active');
  const campaignsProgress = activeCampaigns.map(c=>{
    const ids = c.milestones.flatMap(m=>m.questIds);
    const byId = new Map(quests.map(q=>[q.id,q] as const));
    const done = ids.filter(id=> byId.get(id)?.isCompleted).length;
    return { campaignId: c.id, title: c.title, progress: ids.length? Math.round(done/ids.length*100):0 };
  });

  const carryOverQuestIds = quests.filter(q=> !q.isCompleted && q.dueDate && q.dueDate < todayStr).map(q=>q.id).slice(0, 10);

  const suggestedActions: WeeklyReview['suggestedActions'] = [];
  if (carryOverQuestIds.length) suggestedActions.push({ label: `Reschedule ${carryOverQuestIds.length} overdue quest${carryOverQuestIds.length>1?'s':''} to this week`, questIds: carryOverQuestIds });
  for (const cp of campaignsProgress) {
    if (cp.progress < 30) suggestedActions.push({ label: `Unblock campaign "${cp.title}" — focus on first milestone`, campaignId: cp.campaignId });
    else if (cp.progress >= 80) suggestedActions.push({ label: `Close campaign "${cp.title}" — finish final quests`, campaignId: cp.campaignId });
  }
  if (snapshot.postponedCount >= 3) suggestedActions.push({ label: `Break down postponed quests into smaller chain steps` });
  if (snapshot.focusCompletionRate > 0 && snapshot.focusCompletionRate < 60) suggestedActions.push({ label: `Shorten focus sessions to 15-25m to improve completion` });

  return {
    id: `wr-${start}`,
    weekStart: start,
    weekEnd: end,
    generatedAt: new Date().toISOString(),
    stats: { planned, completed, completionRate, totalFocusMinutes, overdueCarried, campaignsActive: activeCampaigns.length, campaignsProgress },
    insights,
    suggestedActions: suggestedActions.slice(0,5),
    carryOverQuestIds,
    archived: false,
  };
}

export function shouldShowWeeklyReview(lastWeekStart?: string, now = new Date()): boolean {
  const { start } = computeWeeklyWindow(now);
  if (!lastWeekStart) return true; // first run
  return start !== lastWeekStart;
}
