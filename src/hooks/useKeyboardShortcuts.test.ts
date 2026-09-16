import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  it('opens help for ? outside a typing target', () => {
    const onHelp = vi.fn();
    renderHook(() => useKeyboardShortcuts({ onHelp }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }));
    expect(onHelp).toHaveBeenCalledTimes(1);
  });

  it('does not open help while typing', () => {
    const onHelp = vi.fn();
    const input = document.createElement('input');
    document.body.appendChild(input);
    renderHook(() => useKeyboardShortcuts({ onHelp }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: '?', bubbles: true }));
    expect(onHelp).not.toHaveBeenCalled();
    input.remove();
  });

  it('handles Ctrl+K and prevents the browser default', () => {
    const onPalette = vi.fn();
    renderHook(() => useKeyboardShortcuts({ onPalette }));
    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, cancelable: true });
    window.dispatchEvent(event);
    expect(onPalette).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it('can be disabled and cleans up its listener', () => {
    const onEscape = vi.fn();
    const { rerender, unmount } = renderHook(({ enabled }) => useKeyboardShortcuts({ onEscape, enabled }), { initialProps: { enabled: true } });
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onEscape).toHaveBeenCalledTimes(1);
    rerender({ enabled: false });
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onEscape).toHaveBeenCalledTimes(1);
    unmount();
  });
});
