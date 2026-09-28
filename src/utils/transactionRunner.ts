import { PlayerProfile, EconomyTransaction } from '../types';

export interface TransactionPayload {
  amount: number;
  currency: 'coins' | 'gems' | 'energy';
  type?: 'earn' | 'spend';
  reason: string;
  timestamp?: number;
}

export interface TransactionResult {
  success: boolean;
  error?: string;
  newProfile: PlayerProfile;
  transaction?: EconomyTransaction;
}

export class AtomicTransactionQueue {
  private queue: Promise<void> = Promise.resolve();

  public async run<T>(action: () => Promise<T> | T): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue = this.queue.then(async () => {
        try {
          const result = await action();
          resolve(result);
        } catch (err) {
          reject(err);
        }
      });
    });
  }
}

export const applyAtomicTransaction = (
  profile: PlayerProfile,
  payload: TransactionPayload
): TransactionResult => {
  const transactionType = payload.type || (payload.amount >= 0 ? 'earn' : 'spend');
  const delta = payload.type === 'spend' && payload.amount > 0 ? -payload.amount : payload.amount;
  const targetCurrency = payload.currency;

  const currentBalance = profile[targetCurrency] ?? 0;
  const newBalance = currentBalance + delta;

  if (newBalance < 0) {
    return {
      success: false,
      error: `Insufficient ${targetCurrency} balance (available: ${currentBalance}, required: ${Math.abs(delta)})`,
      newProfile: profile,
    };
  }

  const newProfile: PlayerProfile = {
    ...profile,
    [targetCurrency]: newBalance,
  };

  const transaction: EconomyTransaction = {
    id: `tx-${payload.timestamp || Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: payload.timestamp || Date.now(),
    amount: delta,
    currency: targetCurrency,
    type: transactionType,
    reason: payload.reason,
  };

  return {
    success: true,
    newProfile,
    transaction,
  };
};
