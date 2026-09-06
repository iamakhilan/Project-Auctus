import { describe, it, expect } from 'vitest';
import {
  calculateDisciplineScore,
  generateDailySummary,
  formatDailyDebriefText,
  computeProductivityVelocity,
  getTodayDateStr,
} from '../../src/domain/analytics';
import { PlayerProfile, Quest, Habit, EconomyTransaction } from '../../src/types';
import { initialProfile } from '../../src/utils/storage';

describe('Analytics & Daily Telemetry Domain Engine', () => {
  it('should calculate discipline score and tier rating based on metrics', () => {
    // 0 productivity -> 0 / Novice Sentry
    const zeroScore = calculateDisciplineScore(0, 0, 0);
    expect(zeroScore.score).toBe(0);
    expect(zeroScore.ratingTitle).toBe('Novice Sentry');

    // 60m focus (40pts) + 3 quests (30pts) + 3 habits (30pts) = 100 / Apex Archon
    const maxScore = calculateDisciplineScore(60, 3, 3);
    expect(maxScore.score).toBe(100);
    expect(maxScore.ratingTitle).toContain('Apex Archon');

    // 30m focus (20pts) + 2 quests (20pts) + 1 habit (10pts) = 50 / Sanctuary Knight
    const midScore = calculateDisciplineScore(30, 2, 1);
    expect(midScore.score).toBe(50);
    expect(midScore.ratingTitle).toContain('Sanctuary Knight');
  });

  it('should generate accurate daily summary from active state and transactions', () => {
    const todayStr = getTodayDateStr();
    const now = Date.now();

    const mockProfile: PlayerProfile = {
      ...initialProfile,
      name: 'Vanguard Warrior',
      totalFocusMinutes: 45,
    };

    const mockQuests: Quest[] = [
      {
        id: 'q1',
        title: 'Strategy Architecture',
        description: '',
        dueLabel: 'Today',
        isCompleted: true,
        xpReward: 100,
        coinReward: 25,
        tier: 'Tier II',
        category: 'bounty',
        tag: 'Coding',
        createdAt: new Date().toISOString(),
      },
    ];

    const mockHabits: Habit[] = [
      {
        id: 'h1',
        title: 'Read research paper',
        description: '',
        category: 'focus',
        streakCount: 5,
        bestStreak: 5,
        lastCompletedDate: todayStr,
        completedDates: [todayStr],
        xpYield: 75,
        coinYield: 10,
        milestonesAchieved: [],
        createdAt: new Date().toISOString(),
      },
    ];

    const mockTransactions: EconomyTransaction[] = [
      {
        id: 'tx-1',
        timestamp: now,
        amount: 150,
        currency: 'coins',
        type: 'earn',
        reason: 'Quest bounty',
        balanceAfter: 150,
      },
      {
        id: 'tx-2',
        timestamp: now,
        amount: 50,
        currency: 'coins',
        type: 'spend',
        reason: 'Perk redemption',
        balanceAfter: 100,
      },
    ];

    const summary = generateDailySummary(
      todayStr,
      mockProfile,
      mockQuests,
      mockHabits,
      mockTransactions,
      45
    );

    expect(summary.date).toBe(todayStr);
    expect(summary.focusMinutes).toBe(45);
    expect(summary.questsCompletedCount).toBe(1);
    expect(summary.habitsCheckedInCount).toBe(1);
    expect(summary.coinsEarned).toBe(150);
    expect(summary.coinsSpent).toBe(50);
    expect(summary.disciplineScore).toBeGreaterThan(0);
  });

  it('should format clipboard debrief text with all required RPG metrics', () => {
    const summary = generateDailySummary(
      '2026-09-06',
      initialProfile,
      [],
      [],
      [],
      30
    );

    const debrief = formatDailyDebriefText(summary, 'Akhilan');
    expect(debrief).toContain('AUCTUS DAILY DEBRIEF');
    expect(debrief).toContain('Akhilan');
    expect(debrief).toContain('Deep Work: 30m logged');
    expect(debrief).toContain('Forged with Auctus V2');
  });

  it('should compute productivity velocities and completion rates', () => {
    const mockQuests: Quest[] = [
      {
        id: 'q1',
        title: 'Q1',
        description: '',
        dueLabel: 'Today',
        isCompleted: true,
        xpReward: 50,
        coinReward: 10,
        tier: 'Tier I',
        category: 'bounty',
        tag: 'Coding',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'q2',
        title: 'Q2',
        description: '',
        dueLabel: 'Today',
        isCompleted: false,
        xpReward: 50,
        coinReward: 10,
        tier: 'Tier I',
        category: 'bounty',
        tag: 'Coding',
        createdAt: new Date().toISOString(),
      },
    ];

    const mockHabits: Habit[] = [
      {
        id: 'h1',
        title: 'Habit 1',
        description: '',
        category: 'morning',
        streakCount: 3,
        bestStreak: 3,
        completedDates: [],
        xpYield: 75,
        coinYield: 10,
        milestonesAchieved: [],
        createdAt: new Date().toISOString(),
      },
    ];

    const velocity = computeProductivityVelocity(
      { ...initialProfile, xp: 700, totalFocusMinutes: 140 },
      mockQuests,
      mockHabits
    );

    expect(velocity.weeklyAverageXp).toBe(100);
    expect(velocity.weeklyAverageFocusMinutes).toBe(20);
    expect(velocity.questCompletionRatePercent).toBe(50);
    expect(velocity.habitConsistencyScore).toBe(100);
  });
});
