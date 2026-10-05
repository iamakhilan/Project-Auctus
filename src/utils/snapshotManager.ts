export interface StateSnapshot {
  id: string;
  timestamp: number;
  label: string;
  data: string;
}

const SNAPSHOT_STORAGE_KEY = 'auctus_duo_state_snapshots';
const DEFAULT_MAX_SNAPSHOTS = 5;

export function getSnapshots(): StateSnapshot[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SNAPSHOT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSnapshot(
  data: string,
  label: string = 'Pre-import automatic snapshot',
  maxSnapshots: number = DEFAULT_MAX_SNAPSHOTS
): StateSnapshot {
  const snapshot: StateSnapshot = {
    id: `snap_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
    label,
    data,
  };

  const existing = getSnapshots();
  const updated = [snapshot, ...existing].slice(0, maxSnapshots);

  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage quota errors
    }
  }

  return snapshot;
}

export function clearSnapshots(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(SNAPSHOT_STORAGE_KEY);
  }
}
