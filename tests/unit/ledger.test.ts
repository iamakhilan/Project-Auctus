import { describe, it, expect } from 'vitest';
import {
  createTransactionEntity,
  recordTransaction,
  validateSufficientBalance,
  calculateNetFlow,
  filterTransactions,
  getInitialTransactions,
  MAX_LEDGER_ENTRIES,
} from '../../src/domain/economy/ledger';
import { EconomyTransaction } from '../../src/types';

describe('Economy Ledger Domain Engine', () => {
  it('should create an immutable transaction entity with correct fields', () => {
    const tx = createTransactionEntity({
      amount: 150.8,
      currency: 'coins',
      type: 'earn',
      reason: 'Conquered Epic Quest',
      balanceAfter: 1250,
    });

    expect(tx.id).toMatch(/^tx-/);
    expect(tx.amount).toBe(151); // rounded
    expect(tx.currency).toBe('coins');
    expect(tx.type).toBe('earn');
    expect(tx.reason).toBe('Conquered Epic Quest');
    expect(tx.balanceAfter).toBe(1250);
    expect(typeof tx.timestamp).toBe('number');
  });

  it('should prepend transaction and cap ledger at max entries', () => {
    let ledger: EconomyTransaction[] = [];

    for (let i = 0; i < MAX_LEDGER_ENTRIES + 10; i++) {
      const tx = createTransactionEntity({
        amount: 10,
        currency: 'coins',
        type: 'earn',
        reason: `Grant #${i}`,
        balanceAfter: (i + 1) * 10,
      });
      ledger = recordTransaction(ledger, tx, MAX_LEDGER_ENTRIES);
    }

    expect(ledger.length).toBe(MAX_LEDGER_ENTRIES);
    // Newest is at index 0
    expect(ledger[0].reason).toBe(`Grant #${MAX_LEDGER_ENTRIES + 9}`);
  });

  it('should validate balance affordability correctly', () => {
    expect(validateSufficientBalance(500, 200)).toBe(true);
    expect(validateSufficientBalance(200, 200)).toBe(true);
    expect(validateSufficientBalance(199, 200)).toBe(false);
    expect(validateSufficientBalance(0, 100)).toBe(false);
    expect(validateSufficientBalance(50, 0)).toBe(true);
  });

  it('should calculate net currency flow across time windows', () => {
    const now = Date.now();
    const mockLedger: EconomyTransaction[] = [
      {
        id: 'tx-1',
        timestamp: now - 1000,
        amount: 200,
        currency: 'coins',
        type: 'earn',
        reason: 'Focus sprint',
        balanceAfter: 200,
      },
      {
        id: 'tx-2',
        timestamp: now - 2000,
        amount: 50,
        currency: 'coins',
        type: 'spend',
        reason: 'Coffee break perk',
        balanceAfter: 150,
      },
      {
        id: 'tx-3',
        timestamp: now - 3000,
        amount: 300,
        currency: 'coins',
        type: 'earn',
        reason: 'Quest Bounty',
        balanceAfter: 450,
      },
      {
        id: 'tx-4',
        timestamp: now - 1000,
        amount: 5,
        currency: 'shards',
        type: 'earn',
        reason: 'Spire chest',
        balanceAfter: 5,
      },
    ];

    const coinsFlow = calculateNetFlow(mockLedger, 'coins');
    expect(coinsFlow.earned).toBe(500);
    expect(coinsFlow.spent).toBe(50);
    expect(coinsFlow.net).toBe(450);
    expect(coinsFlow.count).toBe(3);

    const shardsFlow = calculateNetFlow(mockLedger, 'shards');
    expect(shardsFlow.earned).toBe(5);
    expect(shardsFlow.spent).toBe(0);
    expect(shardsFlow.net).toBe(5);
  });

  it('should filter transactions by currency, type, and search query', () => {
    const mockLedger: EconomyTransaction[] = [
      createTransactionEntity({ amount: 100, currency: 'coins', type: 'earn', reason: 'Epic Bounty', balanceAfter: 100 }),
      createTransactionEntity({ amount: 50, currency: 'coins', type: 'spend', reason: 'Gaming Hour', balanceAfter: 50 }),
      createTransactionEntity({ amount: 2, currency: 'shards', type: 'earn', reason: 'Spire Bounty', balanceAfter: 2 }),
    ];

    const coinsOnly = filterTransactions(mockLedger, { currency: 'coins' });
    expect(coinsOnly.length).toBe(2);

    const spendOnly = filterTransactions(mockLedger, { type: 'spend' });
    expect(spendOnly.length).toBe(1);
    expect(spendOnly[0].reason).toBe('Gaming Hour');

    const searched = filterTransactions(mockLedger, { search: 'Bounty' });
    expect(searched.length).toBe(2);
  });

  it('should provide default starter initial transactions', () => {
    const initial = getInitialTransactions();
    expect(initial.length).toBeGreaterThanOrEqual(3);
    expect(initial.some(tx => tx.currency === 'coins')).toBe(true);
    expect(initial.some(tx => tx.currency === 'shards')).toBe(true);
  });
});
