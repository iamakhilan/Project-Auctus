import { describe, it, expect } from 'vitest';
import {
  evaluateAchievementProgress,
  findNewlyUnlockedAchievements,
  EvaluationContext,
} from '../achievementEvaluator';
import { Achievement, PlayerProfile } from '../../types';
import { INITIAL_PROFILE } from '../../services/storage';

describe('achievementEvaluator', () => {
  const mockProfile: PlayerProfile = {
    ...INITIAL_PROFILE,
    totalFocusMinutes: 120,
    citadelPower: 80,
    streakDays: 7,
  };

  const mockContext: EvaluationContext = {
    profile: mockProfile,
    quests: [
      { id: '1', title: 'Q1', category: 'daily', tag: 'Coding', xpReward: 50, coinsReward: 20, isCompleted: true },
      { id: '2', title: 'Q2', category: 'bounty', tag: 'Study', xpReward: 50, coinsReward: 20, isCompleted: true },
    ],
    habits: [
      { id: 'h1', title: 'H1', category: 'focus', streakCount: 5, bestStreak: 5, completedDates: [], xpYield: 10, coinYield: 5 },
    ],
  };

  it('evaluates focus achievement progress correctly', () => {
    const ach: Achievement = {
      id: 'f1',
      title: 'Deep Diver',
      description: 'Focus for 100 minutes',
      category: 'focus',
      icon: '⏱️',
      targetValue: 100,
      currentValue: 0,
      isUnlocked: false,
      rewards: { xp: 100 },
    };

    const res = evaluateAchievementProgress(ach, mockContext);
    expect(res.currentValue).toBe(120);
    expect(res.isUnlocked).toBe(true);
  });

  it('identifies newly unlocked achievements from list', () => {
    const achievements: Achievement[] = [
      {
        id: 'q1',
        title: 'Novice Adventurer',
        description: 'Complete 2 quests',
        category: 'quests',
        icon: '⚔️',
        targetValue: 2,
        currentValue: 0,
        isUnlocked: false,
        rewards: { xp: 50 },
      },
      {
        id: 'q2',
        title: 'Master Adventurer',
        description: 'Complete 100 quests',
        category: 'quests',
        icon: '👑',
        targetValue: 100,
        currentValue: 0,
        isUnlocked: false,
        rewards: { xp: 500 },
      },
    ];

    const newlyUnlocked = findNewlyUnlockedAchievements(achievements, mockContext);
    expect(newlyUnlocked).toHaveLength(1);
    expect(newlyUnlocked[0].id).toBe('q1');
    expect(newlyUnlocked[0].isUnlocked).toBe(true);
  });
});
