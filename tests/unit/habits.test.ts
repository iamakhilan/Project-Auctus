import { describe, it, expect } from 'vitest';
import {
  createHabitEntity,
  completeHabitEntity,
  isHabitCompletedOnDate,
  getYesterdayDateStr,
  getHabitMilestoneBonus,
} from '../../src/domain/habits';

describe('Habits Domain Engine', () => {
  it('should create habit entity with initial zero streak', () => {
    const habit = createHabitEntity({
      title: 'Daily Code Katas',
      category: 'focus',
      xpYield: 90,
      coinYield: 15,
    });

    expect(habit.title).toBe('Daily Code Katas');
    expect(habit.streakCount).toBe(0);
    expect(habit.bestStreak).toBe(0);
    expect(habit.xpYield).toBe(90);
    expect(habit.coinYield).toBe(15);
    expect(habit.completedDates).toEqual([]);
  });

  it('should increment streak when completed on consecutive days', () => {
    const habit = createHabitEntity({ title: 'Meditation' });
    const day1Result = completeHabitEntity(habit, '2026-09-01');

    expect(day1Result.habit.streakCount).toBe(1);
    expect(day1Result.habit.lastCompletedDate).toBe('2026-09-01');

    const day2Result = completeHabitEntity(day1Result.habit, '2026-09-02');
    expect(day2Result.habit.streakCount).toBe(2);
    expect(day2Result.habit.bestStreak).toBe(2);

    const day3Result = completeHabitEntity(day2Result.habit, '2026-09-03');
    expect(day3Result.habit.streakCount).toBe(3);
  });

  it('should reset streak to 1 if a day is skipped', () => {
    const habit = {
      ...createHabitEntity({ title: 'Gym' }),
      streakCount: 5,
      bestStreak: 10,
      lastCompletedDate: '2026-09-01',
    };

    // Complete on 2026-09-04 (skipped Sep 2 and 3)
    const result = completeHabitEntity(habit, '2026-09-04');
    expect(result.habit.streakCount).toBe(1);
    expect(result.habit.bestStreak).toBe(10); // best streak remains 10
  });

  it('should award milestone bonuses when hitting landmark streaks', () => {
    const habit = {
      ...createHabitEntity({ title: 'Streak Milestone Protocol' }),
      streakCount: 6,
      bestStreak: 6,
      lastCompletedDate: '2026-09-06',
    };

    // Completing on 2026-09-07 reaches streak 7 (milestone!)
    const result = completeHabitEntity(habit, '2026-09-07');
    expect(result.habit.streakCount).toBe(7);
    expect(result.newMilestoneDay).toBe(7);
    expect(result.milestoneBonus).toEqual({ xp: 150, coins: 25 });
    expect(result.xpEarned).toBe(habit.xpYield + 150);
    expect(result.coinsEarned).toBe(habit.coinYield + 25);
    expect(result.habit.milestonesAchieved).toContain(7);
  });

  it('should prevent multiple completions on the same day (idempotent)', () => {
    const habit = createHabitEntity({ title: 'Water intake' });
    const first = completeHabitEntity(habit, '2026-09-06');
    expect(first.xpEarned).toBe(75);

    const second = completeHabitEntity(first.habit, '2026-09-06');
    expect(second.xpEarned).toBe(0);
    expect(second.coinsEarned).toBe(0);
    expect(second.habit.streakCount).toBe(1);
  });

  it('should calculate yesterday date accurately across month boundaries', () => {
    expect(getYesterdayDateStr('2026-09-02')).toBe('2026-09-01');
    expect(getYesterdayDateStr('2026-09-01')).toBe('2026-08-31');
    expect(getYesterdayDateStr('2026-03-01')).toBe('2026-02-28');
    expect(getYesterdayDateStr('2026-01-01')).toBe('2025-12-31');
  });

  it('should accurately verify completion status on date', () => {
    const habit = {
      ...createHabitEntity({ title: 'Reading' }),
      completedDates: ['2026-09-01', '2026-09-02'],
      lastCompletedDate: '2026-09-02',
    };

    expect(isHabitCompletedOnDate(habit, '2026-09-01')).toBe(true);
    expect(isHabitCompletedOnDate(habit, '2026-09-02')).toBe(true);
    expect(isHabitCompletedOnDate(habit, '2026-09-03')).toBe(false);
  });

  it('should return correct bonus for milestones', () => {
    expect(getHabitMilestoneBonus(7)).toEqual({ xp: 150, coins: 25 });
    expect(getHabitMilestoneBonus(14)).toEqual({ xp: 250, coins: 40 });
    expect(getHabitMilestoneBonus(21)).toEqual({ xp: 350, coins: 60 });
    expect(getHabitMilestoneBonus(30)).toEqual({ xp: 500, coins: 100 });
    expect(getHabitMilestoneBonus(5)).toBeNull();
  });
});
