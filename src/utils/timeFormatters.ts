export function formatFocusTimerDisplay(seconds: number): {
  minutesStr: string;
  secondsStr: string;
  formatted: string;
} {
  const safeSecs = Math.max(0, Math.floor(seconds));
  const m = Math.floor(safeSecs / 60);
  const s = safeSecs % 60;
  const minutesStr = m.toString().padStart(2, '0');
  const secondsStr = s.toString().padStart(2, '0');

  return {
    minutesStr,
    secondsStr,
    formatted: `${minutesStr}:${secondsStr}`,
  };
}

export function formatChestRemainingTime(endsAt?: number, now: number = Date.now()): string {
  if (!endsAt) return '00:00:00';
  const remainingMs = Math.max(0, endsAt - now);
  const totalSecs = Math.floor(remainingMs / 1000);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;

  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function calculateRemainingSeconds(targetEndsAt?: number, now: number = Date.now()): number {
  if (!targetEndsAt) return 0;
  const diffMs = targetEndsAt - now;
  return Math.max(0, Math.ceil(diffMs / 1000));
}
