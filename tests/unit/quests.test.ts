import { describe, it, expect } from 'vitest';
import {
  getTierRewards,
  createQuestEntity,
  completeQuestEntity,
} from '../../src/domain/quests';

describe('Quests Domain Engine', () => {
  it('should return tier rewards correctly', () => {
    expect(getTierRewards('Tier I')).toEqual({ xpReward: 80, coinReward: 10 });
    expect(getTierRewards('Tier II')).toEqual({ xpReward: 150, coinReward: 20 });
    expect(getTierRewards('Tier III')).toEqual({ xpReward: 300, coinReward: 40 });
    expect(getTierRewards('Epic')).toEqual({ xpReward: 350, coinReward: 45 });
    expect(getTierRewards('Urgent')).toEqual({ xpReward: 120, coinReward: 0 });
  });

  it('should construct a valid quest entity', () => {
    const quest = createQuestEntity({
      title: 'Deploy Production Hotfix',
      tier: 'Tier II',
      dueLabel: '14:00',
    });

    expect(quest.title).toBe('Deploy Production Hotfix');
    expect(quest.tier).toBe('Tier II');
    expect(quest.xpReward).toBe(150);
    expect(quest.coinReward).toBe(20);
    expect(quest.dueLabel).toBe('14:00');
    expect(quest.isCompleted).toBe(false);
    expect(quest.id).toMatch(/^quest-/);
  });

  it('should grant streak shield on urgent quest completion', () => {
    const quest = createQuestEntity({
      title: 'Critical Server Alert',
      tier: 'Urgent',
      isUrgent: true,
    });

    expect(quest.streakShieldReward).toBe(1);

    const result = completeQuestEntity(quest);
    expect(result.quest.isCompleted).toBe(true);
    expect(result.streakShieldsEarned).toBe(1);
    expect(result.xpEarned).toBe(120);
    expect(result.shouldDropChest).toBe(true);
  });

  it('should be idempotent if quest is already completed', () => {
    const quest = createQuestEntity({
      title: 'Completed Task',
      tier: 'Tier I',
    });
    const firstCompletion = completeQuestEntity(quest);
    const secondCompletion = completeQuestEntity(firstCompletion.quest);

    expect(secondCompletion.xpEarned).toBe(0);
    expect(secondCompletion.coinsEarned).toBe(0);
    expect(secondCompletion.shouldDropChest).toBe(false);
  });
});
