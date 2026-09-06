import { EconomyTransaction, CurrencyType, EconomyTransactionType } from '../../types';

export interface CreateTransactionParams {
  amount: number;
  currency: CurrencyType;
  type: EconomyTransactionType;
  reason: string;
  balanceAfter: number;
  timestamp?: number;
}

export const MAX_LEDGER_ENTRIES = 200;

/**
 * Creates a valid, immutable EconomyTransaction entity.
 */
export function createTransactionEntity(params: CreateTransactionParams): EconomyTransaction {
  return {
    id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: params.timestamp ?? Date.now(),
    amount: Math.max(0, Math.round(params.amount)),
    currency: params.currency,
    type: params.type,
    reason: params.reason.trim() || 'Treasury Adjustment',
    balanceAfter: Math.max(0, Math.round(params.balanceAfter)),
  };
}

/**
 * Appends a transaction to the ledger and caps size to prevent unbound storage growth.
 * Transactions are ordered newest first (descending timestamp).
 */
export function recordTransaction(
  ledger: EconomyTransaction[],
  tx: EconomyTransaction,
  maxEntries: number = MAX_LEDGER_ENTRIES
): EconomyTransaction[] {
  const updated = [tx, ...ledger];
  if (updated.length > maxEntries) {
    return updated.slice(0, maxEntries);
  }
  return updated;
}

/**
 * Validates whether the player has sufficient balance for a spend transaction.
 */
export function validateSufficientBalance(currentBalance: number, amountToSpend: number): boolean {
  if (amountToSpend <= 0) return true;
  return currentBalance >= amountToSpend;
}

/**
 * Calculates net flow (total earned, total spent, net gain/loss) for a given currency over an optional time window.
 */
export function calculateNetFlow(
  ledger: EconomyTransaction[],
  currency: CurrencyType,
  timeRangeMs?: number
): { earned: number; spent: number; net: number; count: number } {
  const now = Date.now();
  const filtered = ledger.filter(tx => {
    if (tx.currency !== currency) return false;
    if (timeRangeMs !== undefined && now - tx.timestamp > timeRangeMs) return false;
    return true;
  });

  let earned = 0;
  let spent = 0;

  for (const tx of filtered) {
    if (tx.type === 'earn') {
      earned += tx.amount;
    } else if (tx.type === 'spend') {
      spent += tx.amount;
    }
  }

  return {
    earned,
    spent,
    net: earned - spent,
    count: filtered.length,
  };
}

/**
 * Filters transaction ledger by currency, transaction type, or search term.
 */
export function filterTransactions(
  ledger: EconomyTransaction[],
  filters?: {
    currency?: CurrencyType | 'all';
    type?: EconomyTransactionType | 'all';
    search?: string;
  }
): EconomyTransaction[] {
  if (!filters) return ledger;

  return ledger.filter(tx => {
    if (filters.currency && filters.currency !== 'all' && tx.currency !== filters.currency) {
      return false;
    }
    if (filters.type && filters.type !== 'all' && tx.type !== filters.type) {
      return false;
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      return tx.reason.toLowerCase().includes(q) || tx.amount.toString().includes(q);
    }
    return true;
  });
}

/**
 * Initial starter transactions for new players.
 */
export function getInitialTransactions(): EconomyTransaction[] {
  const now = Date.now();
  return [
    {
      id: 'tx-genesis-coins',
      timestamp: now - 3600000 * 2,
      amount: 100,
      currency: 'coins',
      type: 'earn',
      reason: 'Genesis Pioneer Welcome Grant',
      balanceAfter: 100,
    },
    {
      id: 'tx-genesis-shards',
      timestamp: now - 3600000 * 2,
      amount: 5,
      currency: 'shards',
      type: 'earn',
      reason: 'Spire Architect Starter Shards',
      balanceAfter: 5,
    },
    {
      id: 'tx-genesis-diamonds',
      timestamp: now - 3600000 * 2,
      amount: 25,
      currency: 'diamonds',
      type: 'earn',
      reason: 'Citadel Treasury Charter Bonus',
      balanceAfter: 25,
    },
  ];
}
