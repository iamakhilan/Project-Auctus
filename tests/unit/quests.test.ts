import { describe, it, expect } from 'vitest';
import {
  getTierRewards,
  createQuestEntity,
  completeQuestEntity,
  updateQuestEntity,
  filterQuestsByCategory,
  sortQuestsByPriority,
  deleteQuestEntity,
} from '../../src/domain/quests';
import { Quest } from '../../src/types';

describe('Quests Domain Engine', () => {
  it('should return tier rewards correctly', () => {
    expect(getTierRewards('Tier I')).toEqual({ xpReward: 80, coinReward: 10 });
    expect(getTierRewards('Tier II')).toEqual({ xpReward: 150, coinReward: 20 });
    expect(getTierRewards('Tier III')).toEqual({ xpReward: 300, coinReward: 40 });
    expect(getTierRewards('Epic')).toEqual({ xpReward: 350, coinReward: 45 });
    expect(getTierRewards('Urgent')).toEqual({ xpReward: 120, coinReward: 0 });
  });

  it('should construct a valid quest entity with tags and estimates', () => {
    const quest = createQuestEntity({
      title: 'Deploy Production Hotfix',
      tier: 'Tier II',
      tag: 'Coding',
      dueLabel: '14:00',
      estimatedMinutes: 45,
    });

    expect(quest.title).toBe('Deploy Production Hotfix');
    expect(quest.tier).toBe('Tier II');
    expect(quest.tag).toBe('Coding');
    expect(quest.estimatedMinutes).toBe(45);
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
    expect(result.quest.isStreakAtRisk).toBe(false);
    expect(result.streakShieldsEarned).toBe(1);
    expect(result.xpEarned).toBe(120);
    expect(result.shouldDropChest).toBe(true);
  });

  it('should update quest and recalculate rewards if tier changes', () => {
    const quest = createQuestEntity({
      title: 'Initial Title',
      tier: 'Tier I',
    });

    const updated = updateQuestEntity(quest, {
      title: 'Upgraded Mission',
      tier: 'Tier III',
      tag: 'Project',
    });

    expect(updated.title).toBe('Upgraded Mission');
    expect(updated.tier).toBe('Tier III');
    expect(updated.xpReward).toBe(300);
    expect(updated.coinReward).toBe(40);
    expect(updated.tag).toBe('Project');
  });

  it('should filter quests by category and completion status', () => {
    const q1 = createQuestEntity({ title: 'Bounty 1', tier: 'Tier I', category: 'bounty' });
    const q2 = createQuestEntity({ title: 'Epic 1', tier: 'Epic', category: 'epic' });
    const q3 = createQuestEntity({ title: 'Habit 1', tier: 'Tier I', category: 'habit' });
    const q4 = { ...createQuestEntity({ title: 'Done 1', tier: 'Tier I' }), isCompleted: true };

    const list: Quest[] = [q1, q2, q3, q4];

    expect(filterQuestsByCategory(list, 'all')).toHaveLength(3);
    expect(filterQuestsByCategory(list, 'bounty')).toEqual([q1]);
    expect(filterQuestsByCategory(list, 'epic')).toEqual([q2]);
    expect(filterQuestsByCategory(list, 'habit')).toEqual([q3]);
    expect(filterQuestsByCategory(list, 'completed')).toEqual([q4]);
  });

  it('should sort quests with urgent and high priority first', () => {
    const common = createQuestEntity({ title: 'Common', tier: 'Tier I' });
    const urgent = createQuestEntity({ title: 'Urgent Alert', tier: 'Urgent', isUrgent: true });
    const epic = createQuestEntity({ title: 'Epic', tier: 'Epic' });
    const done = { ...createQuestEntity({ title: 'Done', tier: 'Tier III' }), isCompleted: true };

    const sorted = sortQuestsByPriority([common, done, epic, urgent]);
    expect(sorted[0].title).toBe('Urgent Alert');
    expect(sorted[1].title).toBe('Epic');
    expect(sorted[2].title).toBe('Common');
    expect(sorted[3].title).toBe('Done');
  });

  it('should delete quest from list cleanly', () => {
    const q1 = createQuestEntity({ title: 'Keep' });
    const q2 = createQuestEntity({ title: 'Delete Me' });
    const filtered = deleteQuestEntity([q1, q2], q2.id);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe(q1.id);
  });
});
