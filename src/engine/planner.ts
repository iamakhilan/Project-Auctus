import type { Quest, Campaign, DailyObjective, QuestPriority } from '../types';

const PRIORITY_WEIGHT: Record<QuestPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

function daysUntil(dateStr?: string): number | null {
  if (!dateStr) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(dateStr + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return null;
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

function isQuestBlocked(q: Quest, questById: Map<string, Quest>): { blocked: boolean; by: string[] } {
  if (!q.dependsOn || q.dependsOn.length === 0) return { blocked: false, by: [] };
  const blockers = q.dependsOn.filter(depId => {
    const dep = questById.get(depId);
    return !dep || !dep.isCompleted;
  });
  return { blocked: blockers.length > 0, by: blockers };
}

export function computeUrgency(q: Quest, campaign?: Campaign, questById?: Map<string, Quest>): { score: number; reasons: string[]; blocked: boolean; blockedBy: string[] } {
  const reasons: string[] = [];
  let score = 10;

  // Priority
  const pw = PRIORITY_WEIGHT[q.priority ?? 'medium'] ?? 2;
  score += pw * 8;
  if (pw >= 3) reasons.push(q.priority === 'critical' ? 'Critical priority' : 'High priority');

  // Due date pressure
  const du = daysUntil(q.dueDate);
  if (du !== null) {
    if (du < 0) {
      const overdue = Math.abs(du);
      score += 35 + Math.min(15, overdue * 3);
      reasons.push(`Overdue by ${overdue} day${overdue>1?'s':''}`);
    } else if (du === 0) {
      score += 28;
      reasons.push('Due today');
    } else if (du === 1) {
      score += 20;
      reasons.push('Due tomorrow');
    } else if (du <= 3) {
      score += 14;
      reasons.push(`Due in ${du} days`);
    } else if (du <= 7) {
      score += 6;
      reasons.push(`Due in ${du} days`);
    }
    // Deadline influences also via campaign targetDate — boost if campaign near deadline
    if (campaign) {
      const cdu = daysUntil(campaign.targetDate);
      if (cdu !== null && cdu <= 7 && cdu >= 0) {
        score += 6;
        reasons.push(`Campaign "${campaign.title}" due in ${cdu}d`);
      } else if (cdu !== null && cdu < 0) {
        score += 10;
        reasons.push(`Campaign "${campaign.title}" overdue`);
      }
    }
  } else if (campaign) {
    // No quest due date but campaign has one — inherit mild urgency
    const cdu = daysUntil(campaign.targetDate);
    if (cdu !== null && cdu <= 2) { score += 8; reasons.push(`Campaign deadline approaching`); }
  }

  // Campaign milestone ordering: earlier milestones more urgent
  if (campaign && q.milestoneId) {
    const ms = campaign.milestones.find(m => m.id === q.milestoneId);
    if (ms) {
      // Earlier order => more urgent (foundation before polish)
      const orderBoost = Math.max(0, 6 - ms.order);
      score += orderBoost;
      if (ms.status === 'active') { score += 8; reasons.push(`Active milestone: ${ms.title}`); }
      if (ms.status === 'locked') { score += 2; reasons.push(`Upcoming milestone: ${ms.title}`); }
    }
  }

  // Postponed quests: surface but apply fatigue penalty (avoid rewarding procrastination loop)
  if ((q.postponedCount ?? 0) > 0) {
    const pc = q.postponedCount!;
    score += Math.min(6, pc * 1.5);
    reasons.push(`Postponed ${pc}x — consider scheduling`);
  }

  // Category weight: epic > bounty > daily (but daily still urgent if due)
  if (q.category === 'epic') score += 4;
  else if (q.category === 'bounty') score += 2;

  // Blocked quests: strongly deprioritize but keep visible
  let blocked = false;
  let blockedBy: string[] = [];
  if (questById) {
    const b = isQuestBlocked(q, questById);
    blocked = b.blocked; blockedBy = b.by;
    if (blocked) {
      score -= 22;
      reasons.push(`Blocked by ${blockedBy.length} quest${blockedBy.length>1?'s':''}`);
    }
  }

  // Very old uncompleted quests — gentle nudge
  if (q.createdAt) {
    const ageDays = Math.round((Date.now() - new Date(q.createdAt).getTime()) / 86400000);
    if (ageDays > 14 && !q.isCompleted) { score += 4; reasons.push(`Open ${ageDays} days`); }
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  return { score, reasons, blocked, blockedBy };
}

export function buildDailyObjectives(quests: Quest[], campaigns: Campaign[], opts?: { max?: number; availableMinutes?: number }): DailyObjective[] {
  const max = opts?.max ?? 5;
  const availableMinutes = opts?.availableMinutes;
  const questById = new Map(quests.map(q => [q.id, q] as const));
  const campaignById = new Map(campaigns.map(c => [c.id, c] as const));

  const candidates = quests.filter(q => !q.isCompleted);

  const scored: DailyObjective[] = candidates.map(q => {
    const campaign = q.campaignId ? campaignById.get(q.campaignId) : undefined;
    const { score, reasons, blocked, blockedBy } = computeUrgency(q, campaign, questById);
    return {
      questId: q.id,
      urgencyScore: score,
      reasons,
      isBlocked: blocked,
      blockedBy: blocked ? blockedBy : undefined,
      campaignId: q.campaignId,
      milestoneId: q.milestoneId,
    };
  });

  // Sort: unblocked first, then urgency desc, then due date asc
  scored.sort((a, b) => {
    if (a.isBlocked !== b.isBlocked) return a.isBlocked ? 1 : -1;
    if (b.urgencyScore !== a.urgencyScore) return b.urgencyScore - a.urgencyScore;
    const qa = questById.get(a.questId)!; const qb = questById.get(b.questId)!;
    const da = qa.dueDate ?? '9999-12-31'; const db = qb.dueDate ?? '9999-12-31';
    return da.localeCompare(db);
  });

  if (availableMinutes && availableMinutes > 0) {
    const packed: DailyObjective[] = [];
    let used = 0;
    for (const o of scored) {
      if (o.isBlocked) continue;
      const q = questById.get(o.questId)!;
      const est = q.estimatedMinutes ?? 30;
      const fits = used + est <= availableMinutes + 15;
      if (packed.length < max && fits) {
        packed.push(o); used += est;
      }
      if (packed.length >= max) break;
    }
    // always ensure at least one objective even if over budget
    if (packed.length === 0) {
      const first = scored.find(s => !s.isBlocked);
      if (first) return [first];
      return scored.filter(s => s.isBlocked).slice(0, max);
    }
    return packed;
  }

  return scored.filter(s => !s.isBlocked).slice(0, max).concat(
    // Append up to 1 blocked if all else empty? keep them visible but low priority
    scored.filter(s => s.isBlocked).slice(0, 1)
  ).slice(0, max);
}

export function estimateCampaignProgress(campaign: Campaign, quests: Quest[]): number {
  const allIds = campaign.milestones.flatMap(m => m.questIds);
  if (allIds.length === 0) return 0;
  const byId = new Map(quests.map(q => [q.id, q] as const));
  const done = allIds.filter(id => byId.get(id)?.isCompleted).length;
  return Math.round((done / allIds.length) * 100);
}

export function getNextActiveMilestone(campaign: Campaign, quests: Quest[]): import('../types').Milestone | null {
  const qById = new Map(quests.map(q => [q.id, q] as const));
  // Recompute milestone statuses based on live quests
  for (const m of [...campaign.milestones].sort((a,b)=>a.order-b.order)) {
    if (m.questIds.length === 0) continue;
    const allDone = m.questIds.every(id => qById.get(id)?.isCompleted);
    const someDone = m.questIds.some(id => qById.get(id)?.isCompleted);
    if (allDone) continue; // completed milestone — skip
    // First non-completed milestone is active
    void someDone;
    return m;
  }
  return null;
}
