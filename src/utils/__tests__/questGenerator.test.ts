import { describe, it, expect } from 'vitest';
import { generateDailyMissions, getQuestDifficultyMultiplier, QUEST_TEMPLATES, calculateDailyQuestCompletionBonus } from '../questGenerator';
import { Quest } from '../../types';

describe('Quest Generator & Template Engine', () => {
  it('computes correct difficulty multipliers', () => {
    expect(getQuestDifficultyMultiplier('normal')).toBe(1.0);
    expect(getQuestDifficultyMultiplier('hard')).toBe(1.35);
    expect(getQuestDifficultyMultiplier('elite')).toBe(1.75);
    expect(getQuestDifficultyMultiplier(undefined)).toBe(1.0);
  });

  it('generates requested number of unique quests with positive yields', () => {
    const quests = generateDailyMissions(3);
    expect(quests).toHaveLength(3);

    const ids = new Set(quests.map(q => q.id));
    expect(ids.size).toBe(3);

    quests.forEach(q => {
      expect(q.xpReward).toBeGreaterThan(0);
      expect(q.coinsReward).toBeGreaterThan(0);
      expect(q.isCompleted).toBe(false);
      expect(typeof q.title).toBe('string');
      expect(q.title.length).toBeGreaterThan(0);
    });
  });

  it('contains valid static quest templates', () => {
    expect(QUEST_TEMPLATES.length).toBeGreaterThanOrEqual(4);
    QUEST_TEMPLATES.forEach(tmpl => {
      expect(tmpl.baseXp).toBeGreaterThan(0);
      expect(tmpl.baseCoins).toBeGreaterThan(0);
      expect(tmpl.estimatedMinutes).toBeGreaterThan(0);
    });
  });

  it('calculates completion bonus when all daily quests are finished', () => {
    const dailyQuests: Quest[] = [
      { id: '1', title: 'Task 1', category: 'daily', tag: 'Coding', xpReward: 100, coinsReward: 50, isCompleted: true },
      { id: '2', title: 'Task 2', category: 'daily', tag: 'Study', xpReward: 100, coinsReward: 50, isCompleted: true },
    ];

    const result = calculateDailyQuestCompletionBonus(dailyQuests);
    expect(result.allCompleted).toBe(true);
    expect(result.totalXp).toBe(200);
    expect(result.bonusXp).toBe(50);
    expect(result.bonusCoins).toBe(25);
  });

  it('returns zero bonus when daily quests remain incomplete', () => {
    const mixedQuests: Quest[] = [
      { id: '1', title: 'Task 1', category: 'daily', tag: 'Coding', xpReward: 100, coinsReward: 50, isCompleted: true },
      { id: '2', title: 'Task 2', category: 'daily', tag: 'Study', xpReward: 100, coinsReward: 50, isCompleted: false },
    ];

    const result = calculateDailyQuestCompletionBonus(mixedQuests);
    expect(result.allCompleted).toBe(false);
    expect(result.totalXp).toBe(100);
    expect(result.bonusXp).toBe(0);
    expect(result.bonusCoins).toBe(0);
  });
});
