import { useEffect, useRef } from 'react';

/**
 * Trap Tab / Shift+Tab inside `containerRef` while `isOpen` is true.
 * - Restores focus to the previously active element on close (or unmount).
 * - Calls `onClose` on `Escape`.
 *
 * Usage:
 *   const ref = useFocusTrap<HTMLDivElement>(isOpen, onClose);
 *   return isOpen ? <div ref={ref} tabIndex={-1} role="dialog" ...> : null
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(
  isOpen: boolean,
  onClose?: () => void,
): React.RefObject<T> {
  const containerRef = useRef<T>(null);
  const previousActiveRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousActiveRef.current = document.activeElement as HTMLElement | null;

    const container = containerRef.current;
    if (!container) return;

    const getFocusable = (): HTMLElement[] => {
      const nodes = container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      return Array.from(nodes).filter((el) => {
        // filter out hidden / zero-size elements is handled by :not([disabled]) + tabindex,
        // but keep check for offsetParent-like visibility? cheap filter:
        return el.tabIndex !== -1 || el.getAttribute('tabindex') !== '-1';
      });
    };

    // Focus first focusable (or container itself) after mount
    const focusable = getFocusable();
    const target = focusable[0] ?? (container as unknown as HTMLElement);
    // ensure container can be focused if nothing else
    if (!focusable.length && !container.hasAttribute('tabindex')) {
      container.setAttribute('tabindex', '-1');
    }
    requestAnimationFrame(() => target.focus());

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (onClose) {
          e.stopPropagation();
          onClose();
        }
        return;
      }

      if (e.key !== 'Tab') return;

      const els = getFocusable();
      if (els.length === 0) {
        // nothing to trap — prevent leaving modal
        e.preventDefault();
        (container as unknown as HTMLElement).focus();
        return;
      }

      const first = els[0];
      const last = els[els.length - 1];
      const active = document.activeElement as HTMLElement | null;

      // If focus outside container, bring it back
      if (!container.contains(active)) {
        e.preventDefault();
        first.focus();
        return;
      }

      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      const prev = previousActiveRef.current;
      if (prev && typeof prev.focus === 'function') {
        // restore focus asynchronously so unmount has completed
        requestAnimationFrame(() => prev.focus());
      }
    };
  }, [isOpen, onClose]);

  return containerRef as React.RefObject<T>;
}

export default useFocusTrap;
