export interface SyncStatusBadge {
  label: string;
  icon: string;
  className: string;
}

export function getSyncStatusBadge(
  isConnected: boolean,
  pendingCount: number = 0
): SyncStatusBadge {
  if (!isConnected) {
    return {
      label: 'Offline (Local Save)',
      icon: '🔌',
      className: 'bg-[#fafafa] text-[var(--gray-light)] border-[#e5e5e5]',
    };
  }

  if (pendingCount > 0) {
    return {
      label: `Syncing (${pendingCount} pending)`,
      icon: '🔄',
      className: 'bg-[#fffbe6] text-[#d48806] border-[#ffe58f]',
    };
  }

  return {
    label: 'Live Multi-Tab Sync Active',
    icon: '⚡',
    className: 'bg-[#e8f8d8] text-[#3a6b00] border-[#b7e986]',
  };
}

export function formatLastSyncTime(timestamp: number, now: number = Date.now()): string {
  const elapsedSecs = Math.max(0, Math.floor((now - timestamp) / 1000));
  if (elapsedSecs < 10) return 'Just now';
  if (elapsedSecs < 60) return `${elapsedSecs}s ago`;
  const mins = Math.floor(elapsedSecs / 60);
  return `${mins}m ago`;
}
