const BASE_TITLE = 'Auctus ⚡ Productivity RPG';

export function formatTimerTitle(remainingSeconds: number): string {
  const m = Math.floor(remainingSeconds / 60);
  const s = remainingSeconds % 60;
  return `(${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}) Focus Battle`;
}

export function updateDocumentTitleForFocus(
  remainingSeconds: number,
  isActive: boolean,
  isPaused: boolean
): void {
  if (typeof document === 'undefined') return;

  if (!isActive) {
    document.title = BASE_TITLE;
    return;
  }

  if (isPaused) {
    document.title = `[PAUSED] ${formatTimerTitle(remainingSeconds)} - Auctus`;
    return;
  }

  document.title = `${formatTimerTitle(remainingSeconds)} - Auctus`;
}

export function resetDocumentTitle(): void {
  if (typeof document !== 'undefined') {
    document.title = BASE_TITLE;
  }
}
