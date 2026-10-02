export type SyncEventType =
  | 'DELETE_QUEST'
  | 'DELETE_HABIT'
  | 'DELETE_REWARD'
  | 'STATE_SYNC';

export interface SyncMessage {
  type: SyncEventType;
  entityId?: string;
  payload?: unknown;
  timestamp: number;
  nonce?: string;
}

type SyncListener = (message: SyncMessage) => void;

class StateSyncChannel {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<SyncListener> = new Set();
  private channelName = 'auctus_state_sync_channel';
  private seenNonces = new Set<string>();
  private seenTimestamps = new Map<string, number>();

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(this.channelName);
        this.channel.onmessage = (event: MessageEvent<SyncMessage>) => {
          if (event.data && typeof event.data === 'object') {
            this.deliverWithDedup(event.data);
          }
        };
      } catch {
        this.channel = null;
      }
    }
  }

  public broadcast(type: SyncEventType, entityId?: string, payload?: unknown): void {
    const message: SyncMessage = {
      type,
      entityId,
      payload,
      timestamp: Date.now(),
      nonce: (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? (crypto as Crypto).randomUUID() : Math.random().toString(36).slice(2)) + '-' + Date.now(),
    };

    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch {
        // channel error fallback
      }
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(
          'auctus_sync_event_fallback',
          JSON.stringify(message)
        );
      } catch {
        // quota fallback
      }
    }

    this.deliverWithDedup(message, true);
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private deliverWithDedup(message: SyncMessage, isLocal = false): void {
    const dedupKey = message.nonce || message.type + ':' + (message.entityId || '') + ':' + message.timestamp;
    if (this.seenNonces.has(dedupKey)) return;
    this.seenNonces.add(dedupKey);
    this.seenTimestamps.set(dedupKey, Date.now());
    if (this.seenNonces.size > 100) {
      const now = Date.now();
      for (const [k, t] of Array.from(this.seenTimestamps.entries())) {
        if (now - t > 30000) {
          this.seenNonces.delete(k);
          this.seenTimestamps.delete(k);
        }
      }
    }
    void isLocal;
    this.notifyListeners(message);
  }

  private notifyListeners(message: SyncMessage): void {
    this.listeners.forEach((listener) => {
      try {
        listener(message);
      } catch {
        // ignore listener error
      }
    });
  }

  public close(): void {
    if (this.channel) {
      try {
        this.channel.close();
      } catch {}
      this.channel = null;
    }
    this.listeners.clear();
  }
}

export const syncChannel = new StateSyncChannel();
