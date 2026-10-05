import { EconomyTransaction, PlayerProfile } from '../types';
import { applyAtomicTransaction, TransactionInput } from './transactionRunner';

export interface QueuedTransaction {
  id: string;
  input: TransactionInput;
  queuedAt: number;
}

export class TransactionQueue {
  private queue: QueuedTransaction[] = [];

  public enqueue(input: TransactionInput): QueuedTransaction {
    const item: QueuedTransaction = {
      id: `txq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      input,
      queuedAt: Date.now(),
    };
    this.queue.push(item);
    return item;
  }

  public size(): number {
    return this.queue.length;
  }

  public clear(): void {
    this.queue = [];
  }

  public flush(profile: PlayerProfile): {
    newProfile: PlayerProfile;
    applied: EconomyTransaction[];
    failed: QueuedTransaction[];
  } {
    let currentProfile = { ...profile };
    const applied: EconomyTransaction[] = [];
    const failed: QueuedTransaction[] = [];

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) break;

      const result = applyAtomicTransaction(currentProfile, item.input);
      if (result.success && result.transaction) {
        currentProfile = result.newProfile;
        applied.push(result.transaction);
      } else {
        failed.push(item);
      }
    }

    return {
      newProfile: currentProfile,
      applied,
      failed,
    };
  }
}
