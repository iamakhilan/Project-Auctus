import { describe, it, expect, beforeEach } from 'vitest';
import {
  formatTimerTitle,
  updateDocumentTitleForFocus,
  resetDocumentTitle,
} from '../titleUpdater';

describe('titleUpdater', () => {
  beforeEach(() => {
    resetDocumentTitle();
  });

  it('formats remaining seconds into mm:ss format', () => {
    expect(formatTimerTitle(1500)).toBe('(25:00) Focus Battle');
    expect(formatTimerTitle(65)).toBe('(01:05) Focus Battle');
    expect(formatTimerTitle(0)).toBe('(00:00) Focus Battle');
  });

  it('updates document title with active focus timer', () => {
    updateDocumentTitleForFocus(1500, true, false);
    expect(document.title).toBe('(25:00) Focus Battle - Auctus');

    updateDocumentTitleForFocus(1500, true, true);
    expect(document.title).toBe('[PAUSED] (25:00) Focus Battle - Auctus');

    updateDocumentTitleForFocus(1500, false, false);
    expect(document.title).toBe('Auctus ⚡ Productivity RPG');
  });
});
