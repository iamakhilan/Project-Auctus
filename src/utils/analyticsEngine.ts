import { FocusSessionRecord, Quest } from '../types';

export interface FocusVelocityMetrics {
  totalMinutes: number;
  dailyAverage: number;
  velocityScore: number;
  trend: 'rising' | 'steady' | 'declining';
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
}

export interface HourlyDistribution {
  hour: number;
  label: string;
  count: number;
  minutes: number;
}

export function calculateFocusVelocity(
  sessions: FocusSessionRecord[],
  days: number = 7,
  referenceDate: Date = new Date()
): FocusVelocityMetrics {
  const refTime = referenceDate.getTime();
  const msInDay = 86400000;
  const currentWindowStart = refTime - days * msInDay;
  const previousWindowStart = refTime - 2 * days * msInDay;

  const currentWindowSessions = sessions.filter(
    (s) => s.completedAt >= currentWindowStart && s.completedAt <= refTime
  );
  const previousWindowSessions = sessions.filter(
    (s) => s.completedAt >= previousWindowStart && s.completedAt < currentWindowStart
  );

  const totalMinutes = currentWindowSessions.reduce(
    (acc, s) => acc + Math.round(s.actualSeconds / 60),
    0
  );
  const previousMinutes = previousWindowSessions.reduce(
    (acc, s) => acc + Math.round(s.actualSeconds / 60),
    0
  );

  const dailyAverage = Math.round(totalMinutes / Math.max(1, days));
  const velocityScore = Math.min(100, Math.round((totalMinutes / (days * 60)) * 100));

  let trend: 'rising' | 'steady' | 'declining' = 'steady';
  if (totalMinutes > previousMinutes * 1.1) {
    trend = 'rising';
  } else if (totalMinutes < previousMinutes * 0.9) {
    trend = 'declining';
  }

  return {
    totalMinutes,
    dailyAverage,
    velocityScore,
    trend,
  };
}

export function calculateCategoryBreakdown(quests: Quest[]): CategoryBreakdown[] {
  const completed = quests.filter((q) => q.isCompleted);
  if (completed.length === 0) return [];

  const counts: Record<string, number> = {};
  for (const quest of completed) {
    counts[quest.category] = (counts[quest.category] || 0) + 1;
  }

  const total = completed.length;
  return Object.entries(counts)
    .map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

export function calculateHourlyFocusDistribution(sessions: FocusSessionRecord[]): HourlyDistribution[] {
  const buckets: HourlyDistribution[] = Array.from({ length: 24 }, (_, hour) => {
    const formattedHour = hour.toString().padStart(2, '0');
    return {
      hour,
      label: `${formattedHour}:00`,
      count: 0,
      minutes: 0,
    };
  });

  for (const session of sessions) {
    const date = new Date(session.completedAt);
    const hour = date.getHours();
    if (hour >= 0 && hour < 24) {
      buckets[hour].count += 1;
      buckets[hour].minutes += Math.round(session.actualSeconds / 60);
    }
  }

  return buckets;
}

export function calculateConsistencyScore(
  activeDates: string[],
  lookbackDays: number = 14,
  today: Date = new Date()
): number {
  if (lookbackDays <= 0) return 0;

  const dateSet = new Set(activeDates);
  let activeCount = 0;

  for (let i = 0; i < lookbackDays; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().split('T')[0];
    if (dateSet.has(iso)) {
      activeCount += 1;
    }
  }

  return Math.round((activeCount / lookbackDays) * 100);
}

export function detectPeakFocusHour(
  distribution: HourlyDistribution[]
): { hour: number; label: string; minutes: number } | null {
  const activeHours = distribution.filter((d) => d.minutes > 0);
  if (activeHours.length === 0) return null;

  return activeHours.reduce((peak, current) =>
    current.minutes > peak.minutes ? current : peak
  );
}

export function formatMinutesToHoursAndMins(totalMinutes: number): string {
  if (totalMinutes <= 0) return '0m';
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

