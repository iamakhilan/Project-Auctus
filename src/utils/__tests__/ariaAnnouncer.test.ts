import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ariaAnnouncer } from '../ariaAnnouncer';

describe('ariaAnnouncer', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    ariaAnnouncer.init();
  });

  it('creates an accessible live region element in the document', () => {
    const region = document.getElementById('a11y-live-region');
    expect(region).not.toBeNull();
    expect(region?.getAttribute('aria-live')).toBe('polite');
    expect(region?.getAttribute('role')).toBe('status');
  });

  it('announces messages with specified priority', async () => {
    vi.useFakeTimers();
    ariaAnnouncer.announce('Quest completed!', 'assertive');
    const region = document.getElementById('a11y-live-region');
    expect(region?.getAttribute('aria-live')).toBe('assertive');

    vi.advanceTimersByTime(100);
    expect(region?.textContent).toBe('Quest completed!');
    vi.useRealTimers();
  });

  it('clears live region content', async () => {
    vi.useFakeTimers();
    ariaAnnouncer.announce('Hello world');
    vi.advanceTimersByTime(100);

    ariaAnnouncer.clear();
    const region = document.getElementById('a11y-live-region');
    expect(region?.textContent).toBe('');
    vi.useRealTimers();
  });
});
