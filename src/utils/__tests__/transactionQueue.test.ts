import { describe, it, expect } from 'vitest';
import { TransactionQueue } from '../transactionQueue';
import { INITIAL_PROFILE } from '../../services/storage';

describe('TransactionQueue', () => {
  it('enqueues transactions and reports size', () => {
    const queue = new TransactionQueue();
    expect(queue.size()).toBe(0);

    queue.enqueue({ amount: 50, currency: 'coins', type: 'earn', reason: 'Quest reward' });
    queue.enqueue({ amount: 20, currency: 'coins', type: 'spend', reason: 'Item purchase' });

    expect(queue.size()).toBe(2);
  });

  it('flushes queued transactions sequentially and updates profile', () => {
    const queue = new TransactionQueue();
    queue.enqueue({ amount: 100, currency: 'coins', type: 'earn', reason: 'Bounty' });
    queue.enqueue({ amount: 40, currency: 'coins', type: 'spend', reason: 'Store purchase' });

    const result = queue.flush(INITIAL_PROFILE);
    expect(result.applied).toHaveLength(2);
    expect(result.failed).toHaveLength(0);
    expect(result.newProfile.coins).toBe(INITIAL_PROFILE.coins + 60);
    expect(queue.size()).toBe(0);
  });

  it('rejects invalid spends during flush without crashing queue', () => {
    const queue = new TransactionQueue();
    queue.enqueue({ amount: 999999, currency: 'coins', type: 'spend', reason: 'Overdraft spend' });

    const result = queue.flush(INITIAL_PROFILE);
    expect(result.applied).toHaveLength(0);
    expect(result.failed).toHaveLength(1);
    expect(result.newProfile.coins).toBe(INITIAL_PROFILE.coins);
  });
});
