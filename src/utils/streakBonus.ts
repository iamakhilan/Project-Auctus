export interface StreakBonusResult {
  multiplier: number;
  bonusXp: number;
  totalXp: number;
}

export interface NextMilestone {
  milestoneDays: number;
  daysRemaining: number;
  multiplier: number;
}

export function getStreakMultiplier(streakDays: number): number {
  if (streakDays >= 100) return 3.0;
  if (streakDays >= 30) return 2.0;
  if (streakDays >= 14) return 1.5;
  if (streakDays >= 7) return 1.25;
  return 1.0;
}

export function calculateStreakXpBonus(baseXp: number, streakDays: number): StreakBonusResult {
  const multiplier = getStreakMultiplier(streakDays);
  const totalXp = Math.round(baseXp * multiplier);
  const bonusXp = Math.max(0, totalXp - baseXp);

  return {
    multiplier,
    bonusXp,
    totalXp,
  };
}

export function getNextStreakMilestone(streakDays: number): NextMilestone {
  const milestones = [
    { days: 7, mult: 1.25 },
    { days: 14, mult: 1.5 },
    { days: 30, mult: 2.0 },
    { days: 100, mult: 3.0 },
  ];

  for (const m of milestones) {
    if (streakDays < m.days) {
      return {
        milestoneDays: m.days,
        daysRemaining: m.days - streakDays,
        multiplier: m.mult,
      };
    }
  }

  return {
    milestoneDays: streakDays + 50,
    daysRemaining: 50,
    multiplier: 3.0,
  };
}
