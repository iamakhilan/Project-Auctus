export const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTimezoneOffsetString = (date: Date = new Date()): string => {
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absMinutes = Math.abs(offsetMinutes);
  const hours = String(Math.floor(absMinutes / 60)).padStart(2, '0');
  const minutes = String(absMinutes % 60).padStart(2, '0');
  return `${sign}${hours}:${minutes}`;
};

export const getLocalISOStringWithOffset = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const offset = getTimezoneOffsetString(date);
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offset}`;
};

export const parseLocalDateParts = (dateStr: string): { year: number; month: number; day: number } => {
  const [year, month, day] = dateStr.slice(0, 10).split('-').map(Number);
  return { year, month, day };
};

export const getPreviousLocalDateString = (dateStr: string): string => {
  const { year, month, day } = parseLocalDateParts(dateStr);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() - 1);
  return getLocalDateString(d);
};

export const getCalendarDayDifference = (earlierDateStr: string, laterDateStr: string): number => {
  const { year: y1, month: m1, day: d1 } = parseLocalDateParts(earlierDateStr);
  const { year: y2, month: m2, day: d2 } = parseLocalDateParts(laterDateStr);

  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);

  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((utc2 - utc1) / msPerDay);
};

export interface StreakCalculationResult {
  streakCount: number;
  bestStreak: number;
  completedDates: string[];
  lastCompletedDate: string;
}

export const calculateUpdatedStreak = (
  currentCompletedDates: string[],
  currentStreak: number,
  bestStreak: number,
  checkInDate: string = getLocalDateString()
): StreakCalculationResult => {
  const datesSet = new Set(currentCompletedDates || []);
  if (datesSet.has(checkInDate)) {
    return {
      streakCount: currentStreak,
      bestStreak,
      completedDates: currentCompletedDates,
      lastCompletedDate: checkInDate,
    };
  }

  const updatedDates = [...(currentCompletedDates || []), checkInDate].sort();
  const yesterdayStr = getPreviousLocalDateString(checkInDate);
  const wasConsecutive = datesSet.has(yesterdayStr);
  const newStreak = wasConsecutive ? currentStreak + 1 : 1;
  const newBestStreak = Math.max(newStreak, bestStreak);

  return {
    streakCount: newStreak,
    bestStreak: newBestStreak,
    completedDates: updatedDates,
    lastCompletedDate: checkInDate,
  };
};

export const recalculateFullStreakFromDates = (
  completedDates: string[],
  referenceDate: string = getLocalDateString()
): { currentStreak: number; bestStreak: number } => {
  if (!completedDates || completedDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  const sortedUnique = Array.from(new Set(completedDates)).sort();
  let maxStreak = 0;
  let runningStreak = 0;
  let prevDate: string | null = null;

  for (const d of sortedUnique) {
    if (!prevDate) {
      runningStreak = 1;
    } else {
      const diff = getCalendarDayDifference(prevDate, d);
      if (diff === 1) {
        runningStreak += 1;
      } else if (diff > 1) {
        runningStreak = 1;
      }
    }
    maxStreak = Math.max(maxStreak, runningStreak);
    prevDate = d;
  }

  const lastDate = sortedUnique[sortedUnique.length - 1];
  const daysSinceLast = getCalendarDayDifference(lastDate, referenceDate);
  let activeStreak = 0;
  if (daysSinceLast === 0 || daysSinceLast === 1) {
    activeStreak = 1;
    for (let i = sortedUnique.length - 1; i > 0; i--) {
      const diff = getCalendarDayDifference(sortedUnique[i - 1], sortedUnique[i]);
      if (diff === 1) {
        activeStreak += 1;
      } else {
        break;
      }
    }
  }

  return {
    currentStreak: activeStreak,
    bestStreak: maxStreak,
  };
};

export const isHabitScheduledForDay = (
  frequency: 'daily' | 'weekdays' | 'weekends' = 'daily',
  dateStr: string = getLocalDateString()
): boolean => {
  if (frequency === 'daily') return true;
  const { year, month, day } = parseLocalDateParts(dateStr);
  const dayOfWeek = new Date(year, month - 1, day).getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  if (frequency === 'weekdays') return !isWeekend;
  if (frequency === 'weekends') return isWeekend;
  return true;
};

export const calculateDayHeatIntensity = (completedCount: number, totalHabits: number): number => {
  if (completedCount <= 0 || totalHabits <= 0) return 0;
  const ratio = completedCount / totalHabits;
  if (ratio >= 1.0) return 4;
  if (ratio >= 0.75) return 3;
  if (ratio >= 0.5) return 2;
  return 1;
};

export const isMilestoneStreak = (streak: number): boolean => {
  const milestones = [3, 7, 14, 21, 30, 60, 90, 100];
  return milestones.includes(streak);
};
