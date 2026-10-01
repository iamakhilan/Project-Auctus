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
}

type SyncListener = (message: SyncMessage) => void;

class StateSyncChannel {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<SyncListener> = new Set();
  private channelName = 'auctus_state_sync_channel';

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(this.channelName);
        this.channel.onmessage = (event: MessageEvent<SyncMessage>) => {
          if (event.data && typeof event.data === 'object') {
            this.notifyListeners(event.data);
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
          JSON.stringify({ ...message, nonce: Math.random() })
        );
      } catch {
        // quota fallback
      }
    }

    this.notifyListeners(message);
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
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
}

export const syncChannel = new StateSyncChannel();
