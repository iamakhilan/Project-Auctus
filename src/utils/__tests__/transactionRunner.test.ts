import { describe, it, expect } from 'vitest';
import { applyAtomicTransaction, AtomicTransactionQueue } from '../transactionRunner';
import { PlayerProfile } from '../../types';

const mockProfile: PlayerProfile = {
  name: 'Alex',
  title: 'Novice',
  level: 1,
  xp: 100,
  xpToNextLevel: 200,
  coins: 500,
  gems: 20,
  energy: 5,
  maxEnergy: 5,
  streakDays: 3,
  citadelTier: 1,
  citadelPower: 100,
  citadelMaxPower: 200,
  totalFocusMinutes: 60,
  completedQuestsCount: 5,
  soundEnabled: true,
};

describe('applyAtomicTransaction', () => {
  it('successfully applies earn transactions to coins', () => {
    const res = applyAtomicTransaction(mockProfile, {
      amount: 100,
      currency: 'coins',
      type: 'earn',
      reason: 'Quest reward',
    });

    expect(res.success).toBe(true);
    expect(res.newProfile.coins).toBe(600);
    expect(res.transaction).toBeDefined();
    expect(res.transaction?.type).toBe('earn');
    expect(res.transaction?.amount).toBe(100);
  });

  it('successfully applies valid spend transactions', () => {
    const res = applyAtomicTransaction(mockProfile, {
      amount: 200,
      currency: 'coins',
      type: 'spend',
      reason: 'Bazaar item purchase',
    });

    expect(res.success).toBe(true);
    expect(res.newProfile.coins).toBe(300);
    expect(res.transaction?.type).toBe('spend');
    expect(res.transaction?.amount).toBe(-200);
  });

  it('aborts transaction and guards against negative coin balance', () => {
    const res = applyAtomicTransaction(mockProfile, {
      amount: 600,
      currency: 'coins',
      type: 'spend',
      reason: 'Expensive item',
    });

    expect(res.success).toBe(false);
    expect(res.error).toContain('Insufficient coins balance');
    expect(res.newProfile.coins).toBe(500);
    expect(res.transaction).toBeUndefined();
  });

  it('aborts transaction when spending more gems than available', () => {
    const res = applyAtomicTransaction(mockProfile, {
      amount: 50,
      currency: 'gems',
      type: 'spend',
      reason: 'Instant unlock',
    });

    expect(res.success).toBe(false);
    expect(res.error).toContain('Insufficient gems balance');
    expect(res.newProfile.gems).toBe(20);
    expect(res.transaction).toBeUndefined();
  });

  it('handles negative amount directly without explicit spend type', () => {
    const res = applyAtomicTransaction(mockProfile, {
      amount: -100,
      currency: 'coins',
      reason: 'Penalty debit',
    });

    expect(res.success).toBe(true);
    expect(res.newProfile.coins).toBe(400);
    expect(res.transaction?.type).toBe('spend');
  });
});

describe('AtomicTransactionQueue', () => {
  it('processes sequential tasks in execution order', async () => {
    const queue = new AtomicTransactionQueue();
    const order: number[] = [];

    await Promise.all([
      queue.run(async () => {
        await new Promise((r) => setTimeout(r, 10));
        order.push(1);
      }),
      queue.run(async () => {
        order.push(2);
      }),
      queue.run(async () => {
        order.push(3);
      }),
    ]);

    expect(order).toEqual([1, 2, 3]);
  });
});
