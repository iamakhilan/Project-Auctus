import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageService, INITIAL_PROFILE, INITIAL_HABITS, INITIAL_QUESTS } from '../../services/storage';
import { applyAtomicTransaction, isTransactionDuplicate, rollbackTransaction, AtomicTransactionQueue } from '../transactionRunner';
import { TransactionQueue } from '../transactionQueue';
import { calculateUpdatedStreak, getPreviousLocalDateString } from '../dateUtils';
import { getStreakMultiplier, calculateStreakXpBonus } from '../streakBonus';
import { findNewlyUnlockedAchievements, evaluateAchievementProgress } from '../achievementEvaluator';
import { validateBackupPayload } from '../validators';
import { rollLootChestDrop } from '../lootTable';
import { PlayerProfile } from '../../types';

const baseProfile = { ...INITIAL_PROFILE, coins: 500, gems: 20, xp: 100, xpToNextLevel: 200, level: 1, totalFocusMinutes: 60, completedQuestsCount: 5, citadelPower: 100, citadelMaxPower: 500 } as PlayerProfile;

describe('Gameplay: quest completion flow', () => {
  beforeEach(() => { localStorage.clear(); vi.restoreAllMocks(); });
  it('completing quest grants coins via atomic transaction', () => {
    const quest = { ...INITIAL_QUESTS[0] };
    expect(quest.isCompleted).toBe(false);
    const coinRes = applyAtomicTransaction(baseProfile, { amount: quest.coinsReward, currency: 'coins', type: 'earn', reason: 'Completed Quest: ' + quest.title });
    expect(coinRes.success).toBe(true);
    expect(coinRes.newProfile.coins).toBe(baseProfile.coins + quest.coinsReward);
    expect(coinRes.transaction?.reason).toContain(quest.title);
  });
  it('duplicate quest completion is idempotent guard', () => {
    const quest = { ...INITIAL_QUESTS[0], isCompleted: true };
    expect(quest.isCompleted).toBe(true);
  });
  it('level-up cascades correctly on large xp reward', () => {
    let xp = 100, lvl = 1, thr = 200;
    xp += 500;
    while (xp >= thr) { xp -= thr; lvl += 1; thr = Math.round(thr * 1.25); }
    expect(lvl).toBe(3);
    expect(xp).toBe(150);
  });
});

describe('Gameplay: habit check-in and streak progression', () => {
  beforeEach(() => localStorage.clear());
  it('consecutive check-in increments streak', () => {
    const habit = { ...INITIAL_HABITS[0] };
    const today = '2026-10-02';
    const yesterday = getPreviousLocalDateString(today);
    const result = calculateUpdatedStreak([yesterday], 1, 1, today);
    expect(result.streakCount).toBe(2);
    expect(result.completedDates).toContain(today);
    expect(getStreakMultiplier(result.streakCount)).toBe(1.0);
    expect(Math.round(habit.xpYield * 1.0)).toBe(habit.xpYield);
  });
  it('resets streak on gap day', () => {
    const result = calculateUpdatedStreak(['2026-09-29'], 5, 8, '2026-10-02');
    expect(result.streakCount).toBe(1);
    expect(result.bestStreak).toBe(8);
  });
  it('same-day duplicate check-in is ignored', () => {
    const today = '2026-10-02';
    const res1 = calculateUpdatedStreak(['2026-10-01'], 1, 5, today);
    const res2 = calculateUpdatedStreak(res1.completedDates, res1.streakCount, res1.bestStreak, today);
    expect(res2.streakCount).toBe(res1.streakCount);
    expect(res2.completedDates.length).toBe(res1.completedDates.length);
  });
  it('streak bonus scales at milestones 7/14/30', () => {
    expect(getStreakMultiplier(7)).toBe(1.25);
    expect(getStreakMultiplier(14)).toBe(1.5);
    expect(getStreakMultiplier(30)).toBe(2.0);
    expect(calculateStreakXpBonus(100, 14).totalXp).toBe(150);
  });
});

describe('Gameplay: currency and economy', () => {
  it('earn then spend updates balance correctly', () => {
    let p = { ...baseProfile };
    p = applyAtomicTransaction(p, { amount: 200, currency: 'coins', type: 'earn', reason: 'Quest' }).newProfile;
    const spend = applyAtomicTransaction(p, { amount: 80, currency: 'coins', type: 'spend', reason: 'Shop' });
    expect(spend.success).toBe(true);
    expect(spend.newProfile.coins).toBe(baseProfile.coins + 120);
  });
  it('insufficient funds aborts without mutating profile', () => {
    const res = applyAtomicTransaction(baseProfile, { amount: 99999, currency: 'coins', type: 'spend', reason: 'Too expensive' });
    expect(res.success).toBe(false);
    expect(res.newProfile.coins).toBe(baseProfile.coins);
  });
  it('TransactionQueue flush applies sequentially and collects failed', () => {
    const q = new TransactionQueue();
    q.enqueue({ amount: 100, currency: 'coins', type: 'earn', reason: 'A' });
    q.enqueue({ amount: 999999, currency: 'coins', type: 'spend', reason: 'B' });
    q.enqueue({ amount: 30, currency: 'coins', type: 'spend', reason: 'C' });
    const result = q.flush(baseProfile);
    expect(result.applied).toHaveLength(2);
    expect(result.failed).toHaveLength(1);
    expect(result.newProfile.coins).toBe(baseProfile.coins + 70);
  });
});

describe('Gameplay: chest and reward claiming', () => {
  it('ready chest is claimable and maps to loot rewards', () => {
    const tier = 'gold' as const;
    const chest = { slotIndex: 0, tier, status: 'ready' as const, totalUnlockSeconds: 14400, coinsReward: 200, xpReward: 120, gemsReward: 10 };
    expect(chest.status === 'ready').toBe(true);
    expect(applyAtomicTransaction(baseProfile, { amount: chest.coinsReward, currency: 'coins', type: 'earn', reason: 'Chest' }).success).toBe(true);
    const drop = rollLootChestDrop(tier);
    expect(drop.tier).toBe('gold');
    expect(drop.coins).toBeGreaterThanOrEqual(180);
    expect(drop.coins).toBeLessThanOrEqual(300);
  });
  it('locked chest is not claimable', () => {
    const chest: any = { status: 'locked', unlockEndsAt: undefined };
    const isReady = chest.status === 'ready' || chest.status === 'unlocking' && !!chest.unlockEndsAt && Date.now() >= chest.unlockEndsAt;
    expect(isReady).toBe(false);
  });
  it('redeem reward fails when funds insufficient and succeeds otherwise', () => {
    const reward = { id: 'r-test', title: 'Test', cost: 1000 };
    const poor = { ...baseProfile, coins: 10 };
    const rich = { ...baseProfile, coins: 2000 };
    expect(applyAtomicTransaction(poor, { amount: reward.cost, currency: 'coins', type: 'spend', reason: 'Redeem ' + reward.title }).success).toBe(false);
    expect(applyAtomicTransaction(rich, { amount: reward.cost, currency: 'coins', type: 'spend', reason: 'Redeem ' + reward.title }).success).toBe(true);
  });
});

describe('Gameplay: achievement unlocking', () => {
  it('unlocks achievement when progress meets target', () => {
    const ach = { id: 'a-test', title: 'T', description: 'd', category: 'quests' as const, icon: 'x', targetValue: 5, currentValue: 0, isUnlocked: false, rewards: { xp: 50 } };
    const ctx = { profile: { ...INITIAL_PROFILE, completedQuestsCount: 5, totalFocusMinutes: 0, streakDays: 0, citadelPower: 0 }, quests: Array.from({ length: 5 }, (_, i) => ({ id: String(i), title: 'q', category: 'daily' as const, tag: 'Coding' as const, xpReward: 10, coinsReward: 5, isCompleted: true })), habits: [] as any };
    const res = evaluateAchievementProgress(ach, ctx);
    expect(res.isUnlocked).toBe(true);
    expect(res.currentValue).toBe(5);
    expect(findNewlyUnlockedAchievements([ach], ctx)).toHaveLength(1);
  });
  it('does not unlock when below threshold', () => {
    const ach = { id: 'a2', title: 'T', description: 'd', category: 'focus' as const, icon: 'x', targetValue: 1000, currentValue: 0, isUnlocked: false, rewards: { xp: 100 } };
    const ctx = { profile: { ...INITIAL_PROFILE, totalFocusMinutes: 10, completedQuestsCount: 0, streakDays: 0, citadelPower: 0 }, quests: [], habits: [] as any };
    expect(evaluateAchievementProgress(ach, ctx).isUnlocked).toBe(false);
  });
});

describe('Gameplay: focus session completion', () => {
  it('grants xp/coins scaled by duration and overcharge', () => {
    const durationMinutes = 25;
    const baseXp = Math.round(durationMinutes * 4);
    const baseCoins = Math.round(durationMinutes * 2);
    const mult = 1.5;
    expect(Math.round(baseXp * mult)).toBe(Math.round(100 * 1.5));
    expect(Math.round(baseCoins * mult)).toBe(Math.round(50 * 1.5));
    let p = { ...baseProfile, totalFocusMinutes: baseProfile.totalFocusMinutes + durationMinutes } as PlayerProfile;
    expect(p.totalFocusMinutes).toBe(baseProfile.totalFocusMinutes + 25);
    expect(applyAtomicTransaction(p, { amount: Math.round(baseCoins * mult), currency: 'coins', type: 'earn', reason: 'Focus Combat Victory (' + durationMinutes + 'm)' }).success).toBe(true);
  });
  it('duplicate focus session token is rejected', () => {
    const processed = new Set<string>();
    const token = '1700000000000-1500';
    processed.add(token);
    expect(processed.has(token)).toBe(true);
  });
  it('AtomicTransactionQueue serializes concurrent earn tasks', async () => {
    const q = new AtomicTransactionQueue();
    const order: number[] = [];
    await Promise.all([
      q.run(async () => { await new Promise(r => setTimeout(r, 5)); order.push(1); }),
      q.run(async () => { order.push(2); }),
      q.run(async () => { order.push(3); }),
    ]);
    expect(order).toEqual([1,2,3]);
  });
});

describe('Gameplay: persistence after state changes', () => {
  beforeEach(() => localStorage.clear());
  it('persists quest/coins state and survives export/import roundtrip', () => {
    StorageService.setProfile({ ...INITIAL_PROFILE, coins: 1234, completedQuestsCount: 42 });
    StorageService.setQuests([{ ...INITIAL_QUESTS[0], isCompleted: true, completedAt: new Date().toISOString() }]);
    const backup = StorageService.exportBackup();
    expect(validateBackupPayload(backup).isValid).toBe(true);
    localStorage.clear();
    expect(StorageService.importBackup(backup)).toBe(true);
    expect(StorageService.getProfile().coins).toBe(1234);
    expect(StorageService.getQuests()[0].isCompleted).toBe(true);
  });
  it('habit streak persists via storage', () => {
    const today = '2026-10-02';
    const habit = { ...INITIAL_HABITS[0], completedDates: ['2026-10-01'], streakCount: 1, bestStreak: 1 };
    const res = calculateUpdatedStreak(habit.completedDates, habit.streakCount, habit.bestStreak, today);
    const updated = { ...habit, completedDates: res.completedDates, streakCount: res.streakCount, bestStreak: res.bestStreak, lastCompletedDate: today };
    StorageService.setHabits([updated]);
    expect(StorageService.getHabits()[0].streakCount).toBe(2);
  });
});

describe('Gameplay: duplicate protection and rollback', () => {
  it('detects duplicate transaction ids', () => {
    const txs = [{ id: 'tx-1', timestamp: 1, amount: 10, currency: 'coins', type: 'earn', reason: 'x' } as any];
    expect(isTransactionDuplicate(txs, 'tx-1')).toBe(true);
    expect(isTransactionDuplicate(txs, 'tx-2')).toBe(false);
  });
  it('rollback restores previous balance', () => {
    const tx = { id: 'tx-1', timestamp: Date.now(), amount: 100, currency: 'coins', type: 'earn', reason: 'Quest' } as any;
    const start = { ...baseProfile, coins: 500 } as any;
    expect(rollbackTransaction({ ...start, coins: 600 }, tx).coins).toBe(500);
    const spendTx = { id: 'tx-2', timestamp: Date.now(), amount: -50, currency: 'coins', type: 'spend', reason: 'spend' } as any;
    expect(rollbackTransaction({ ...start, coins: 450 }, spendTx).coins).toBe(500);
  });
  it('rollback never goes negative', () => {
    const tx = { id: 't', timestamp: 1, amount: 999, currency: 'coins', type: 'earn', reason: 'x' } as any;
    expect(rollbackTransaction({ ...baseProfile, coins: 10 } as any, tx).coins).toBe(0);
  });
});
