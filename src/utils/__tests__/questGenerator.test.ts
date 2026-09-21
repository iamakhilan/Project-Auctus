import { describe, it, expect } from 'vitest';
import { generateDailyMissions, getQuestDifficultyMultiplier, QUEST_TEMPLATES } from '../questGenerator';

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
});
