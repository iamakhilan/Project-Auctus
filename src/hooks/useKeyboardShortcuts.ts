import { useEffect } from 'react';

export interface UseKeyboardShortcutsOptions {
  /** Called when `?` is pressed (no modifiers, not in an input). */
  onHelp?: () => void;
  /** Called on `Escape` — expected to close modals/drawers. */
  onEscape?: () => void;
  /** Called on `Ctrl+K` / `Cmd+K` — command palette hook. */
  onPalette?: () => void;
  /** When false the listener is not attached. Default true. */
  enabled?: boolean;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  return false;
}

/**
 * Global keyboard shortcuts:
 *  - `?` → onHelp (outside typing context)
 *  - `Escape` → onEscape
 *  - `Ctrl+K` / `Meta+K` → onPalette (preventDefault to avoid browser search)
 */
export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions): void {
  const { onHelp, onEscape, onPalette, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      // Palette — check first because it uses modifiers
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        if (!onPalette) return;
        e.preventDefault();
        onPalette();
        return;
      }

      if (e.key === 'Escape' || e.key === 'Esc') {
        if (!onEscape) return;
        onEscape();
        return;
      }

      // `?` / `Shift+/` — ignore when typing
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (!onHelp) return;
        if (isTypingTarget(e.target)) return;
        e.preventDefault();
        onHelp();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [enabled, onHelp, onEscape, onPalette]);
}

export default useKeyboardShortcuts;
