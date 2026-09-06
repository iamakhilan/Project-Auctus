import { describe, it, expect } from 'vitest';
import {
  getInitialAchievements,
  evaluateAchievements,
} from '../../src/domain/achievements';
import { PlayerProfile, Habit, Quest } from '../../src/types';
import { initialProfile } from '../../src/utils/storage';

const cleanTestProfile: PlayerProfile = {
  ...initialProfile,
  streakDays: 0,
  coins: 0,
  shards: 0,
  diamonds: 0,
  totalFocusMinutes: 0,
  completedQuestsCount: 0,
  unlockedChestsCount: 0,
  level: 1,
  citadelTier: 1,
};

describe('Achievements Domain Engine', () => {
  it('should initialize 15+ rich achievements in locked state', () => {
    const achievements = getInitialAchievements();
    expect(achievements.length).toBeGreaterThanOrEqual(15);
    expect(achievements.every(a => !a.isUnlocked)).toBe(true);

    const categories = new Set(achievements.map(a => a.category));
    expect(categories.has('focus')).toBe(true);
    expect(categories.has('quests')).toBe(true);
    expect(categories.has('habits')).toBe(true);
    expect(categories.has('economy')).toBe(true);
    expect(categories.has('citadel')).toBe(true);
  });

  it('should evaluate and unlock focus achievements based on focus minutes', () => {
    const achievements = getInitialAchievements();
    const profile: PlayerProfile = {
      ...cleanTestProfile,
      totalFocusMinutes: 75,
    };

    const { updated, newlyUnlocked } = evaluateAchievements(achievements, profile, [], []);

    const initiate = updated.find(a => a.id === 'ach-focus-initiate');
    expect(initiate?.isUnlocked).toBe(true);

    const novice = updated.find(a => a.id === 'ach-focus-novice'); // requires 60m
    expect(novice?.isUnlocked).toBe(true);

    const scholar = updated.find(a => a.id === 'ach-focus-scholar'); // requires 300m
    expect(scholar?.isUnlocked).toBe(false);
    expect(scholar?.currentValue).toBe(75);

    expect(newlyUnlocked.length).toBe(2);
  });

  it('should evaluate and unlock quest achievements', () => {
    const achievements = getInitialAchievements();
    const mockQuests: Quest[] = Array.from({ length: 12 }, (_, i) => ({
      id: `quest-${i}`,
      title: `Quest ${i}`,
      description: 'Test quest',
      dueLabel: 'Today',
      isCompleted: true,
      xpReward: 50,
      coinReward: 10,
      tier: 'Tier I',
      category: 'bounty',
      tags: [],
      priority: 'medium',
      createdAt: new Date().toISOString(),
    }));

    const profile: PlayerProfile = {
      ...cleanTestProfile,
      completedQuestsCount: 12,
    };

    const { updated, newlyUnlocked } = evaluateAchievements(achievements, profile, [], mockQuests);

    const first = updated.find(a => a.id === 'ach-quest-first');
    expect(first?.isUnlocked).toBe(true);

    const assassin = updated.find(a => a.id === 'ach-quest-assassin'); // requires 10
    expect(assassin?.isUnlocked).toBe(true);

    const centurion = updated.find(a => a.id === 'ach-quest-centurion'); // requires 50
    expect(centurion?.isUnlocked).toBe(false);
    expect(centurion?.currentValue).toBe(12);

    expect(newlyUnlocked.some(a => a.id === 'ach-quest-assassin')).toBe(true);
  });

  it('should evaluate habit streak milestones', () => {
    const achievements = getInitialAchievements();
    const mockHabits: Habit[] = [
      {
        id: 'h1',
        title: 'Morning workout',
        description: '',
        category: 'vitality',
        streakCount: 8,
        bestStreak: 8,
        completedDates: [],
        xpYield: 75,
        coinYield: 10,
        milestonesAchieved: [7],
        createdAt: new Date().toISOString(),
      },
    ];

    const { updated, newlyUnlocked } = evaluateAchievements(achievements, cleanTestProfile, mockHabits, []);

    const spark = updated.find(a => a.id === 'ach-habit-spark'); // requires 3
    expect(spark?.isUnlocked).toBe(true);

    const vanguard = updated.find(a => a.id === 'ach-habit-vanguard'); // requires 7
    expect(vanguard?.isUnlocked).toBe(true);

    const ironWill = updated.find(a => a.id === 'ach-habit-ironwill'); // requires 30
    expect(ironWill?.isUnlocked).toBe(false);
    expect(ironWill?.currentValue).toBe(8);

    expect(newlyUnlocked.length).toBe(2);
  });
});
