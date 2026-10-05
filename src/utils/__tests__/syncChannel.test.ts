import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { syncChannel, SyncMessage } from '../syncChannel';

describe('syncChannel', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('subscribes and notifies listeners on broadcast', () => {
    const received: SyncMessage[] = [];
    const unsubscribe = syncChannel.subscribe((msg) => {
      received.push(msg);
    });

    syncChannel.broadcast('DELETE_QUEST', 'q-123');

    expect(received).toHaveLength(1);
    expect(received[0].type).toBe('DELETE_QUEST');
    expect(received[0].entityId).toBe('q-123');

    unsubscribe();
  });

  it('unsubscribes cleanly without memory leaks', () => {
    const received: SyncMessage[] = [];
    const unsubscribe = syncChannel.subscribe((msg) => {
      received.push(msg);
    });

    unsubscribe();
    syncChannel.broadcast('DELETE_HABIT', 'h-456');

    expect(received).toHaveLength(0);
  });

  it('persists fallback event to localStorage', () => {
    const setSpy = vi.spyOn(Storage.prototype, 'setItem');
    syncChannel.broadcast('DELETE_REWARD', 'r-789');

    expect(setSpy).toHaveBeenCalledWith(
      'auctus_sync_event_fallback',
      expect.stringContaining('DELETE_REWARD')
    );
  });
});
