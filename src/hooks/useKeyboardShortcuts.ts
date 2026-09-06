import { useEffect } from 'react';
import { TabType } from '../types';

interface ShortcutHandlers {
  onTabChange?: (tab: TabType) => void;
  onOpenHelp?: () => void;
  onToggleSound?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts({
  onTabChange,
  onOpenHelp,
  onToggleSound,
  onEscape,
}: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keystrokes when user is typing in input or textarea
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        if (e.key === 'Escape' && onEscape) {
          onEscape();
        }
        return;
      }

      if (e.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }

      if (e.key === '?' && onOpenHelp) {
        e.preventDefault();
        onOpenHelp();
        return;
      }

      if (e.key === 'm' || e.key === 'M') {
        if (onToggleSound) {
          onToggleSound();
        }
        return;
      }

      if (onTabChange) {
        switch (e.key) {
          case '1':
            onTabChange('realm');
            break;
          case '2':
            onTabChange('quests');
            break;
          case '3':
            onTabChange('focus-arena');
            break;
          case '4':
            onTabChange('vault');
            break;
          case '5':
            onTabChange('citadel');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTabChange, onOpenHelp, onToggleSound, onEscape]);
}
