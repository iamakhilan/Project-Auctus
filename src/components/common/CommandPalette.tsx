import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import type { TabType } from '../../types';
import { sanitize } from '../../utils/validators';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaletteItem = {
  id: string;
  label: string;
  hint?: string;
  icon: string;
  kind: 'tab' | 'action';
  tab?: TabType;
  action?: 'new-quest' | 'new-habit' | 'start-focus';
};

const TAB_ITEMS: PaletteItem[] = [
  { id: 'tab-realm', label: 'Go to Realm', hint: 'Home overview', icon: '🗺️', kind: 'tab', tab: 'realm' },
  { id: 'tab-quests', label: 'Go to Quests', hint: 'Missions & habits', icon: '⚔️', kind: 'tab', tab: 'quests' },
  { id: 'tab-focus', label: 'Go to Focus Arena', hint: 'Pomodoro battles', icon: '⏱️', kind: 'tab', tab: 'focus' },
  { id: 'tab-vault', label: 'Go to Vault', hint: 'Chests & loot', icon: '📦', kind: 'tab', tab: 'vault' },
  { id: 'tab-citadel', label: 'Go to Citadel', hint: 'Ascension & trophies', icon: '🏰', kind: 'tab', tab: 'citadel' },
  { id: 'tab-analytics', label: 'Go to Analytics', hint: 'Stats & progress', icon: '📊', kind: 'tab', tab: 'analytics' },
];

const ACTION_ITEMS: PaletteItem[] = [
  { id: 'act-new-quest', label: 'New Quest', hint: 'Forge a tactical quest', icon: '✨', kind: 'action', action: 'new-quest' },
  { id: 'act-new-habit', label: 'New Habit', hint: 'Forge a daily habit', icon: '🔥', kind: 'action', action: 'new-habit' },
  { id: 'act-start-focus', label: 'Start Focus Session', hint: 'Jump into Focus Arena', icon: '▶️', kind: 'action', action: 'start-focus' },
];

const ALL_ITEMS: PaletteItem[] = [...TAB_ITEMS, ...ACTION_ITEMS];

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const { setActiveTab, createQuest, createHabit, startFocusSession } = useGameState();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const trapRef = useFocusTrap<HTMLDivElement>(isOpen, onClose);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_ITEMS;
    return ALL_ITEMS.filter((it) => {
      const hay = `${it.label} ${it.hint ?? ''} ${it.tab ?? ''} ${it.action ?? ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  // Clamp activeIndex when filtered changes
  useEffect(() => {
    if (activeIndex >= filtered.length) setActiveIndex(Math.max(0, filtered.length - 1));
  }, [filtered.length, activeIndex]);

  // Auto-focus input when opening, reset state
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  // Prevent body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const runItem = (item: PaletteItem) => {
    if (item.kind === 'tab' && item.tab) {
      setActiveTab(item.tab);
      onClose();
      return;
    }
    if (item.action === 'new-quest') {
      // Create a placeholder quest and jump to quests
      createQuest({
        title: sanitize('New Quest'),
        description: sanitize('Created via Command Palette — edit me!'),
        category: 'daily',
        tag: 'Personal',
        xpReward: 60,
        coinsReward: 30,
        dueLabel: 'Today',
        estimatedMinutes: 25,
      });
      setActiveTab('quests');
      onClose();
      return;
    }
    if (item.action === 'new-habit') {
      createHabit({
        title: sanitize('New Habit'),
        category: 'routine',
        icon: '⚡',
        xpYield: 40,
        coinYield: 20,
        completedDates: [],
      });
      setActiveTab('quests');
      onClose();
      return;
    }
    if (item.action === 'start-focus') {
      // Default 25m focus session; FocusArenaView handles active session display
      try {
        startFocusSession(25);
      } catch {
        // no-op if already active / storage guards
      }
      setActiveTab('focus');
      onClose();
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item) runItem(item);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh] bg-black/50 backdrop-blur-sm"
      aria-hidden={false}
      onMouseDown={(e) => {
        // close on backdrop click only
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className="w-full max-w-xl rounded-3xl border-2 border-white/20 bg-white/80 backdrop-blur-xl shadow-2xl overflow-hidden outline-none"
      >
        {/* Search */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-black/5">
          <span className="text-lg select-none" aria-hidden>
            ⌘
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search tabs & actions…  (try 'focus', 'quest', 'vault')"
            className="flex-1 bg-transparent outline-none text-sm font-bold text-[var(--dark-blue)] placeholder:text-[var(--gray-light)]"
            aria-label="Search commands"
          />
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black tracking-widest text-[var(--gray-light)] select-none">
            <kbd className="px-1.5 py-1 rounded-lg bg-black/5 border border-black/10">ESC</kbd>
          </span>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <div className="text-2xl mb-2">🔍</div>
              <div className="text-sm font-extrabold text-[var(--gray-light)]">No results for “{query}”</div>
              <div className="text-xs font-semibold text-[var(--gray-light)] mt-1">Try: realm, quests, focus, vault, citadel, analytics</div>
            </div>
          ) : (
            <ul role="listbox" aria-label="Commands" className="space-y-1">
              {filtered.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <li key={item.id} role="option" aria-selected={isActive}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => runItem(item)}
                      className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-2xl border-2 transition-all ${
                        isActive
                          ? 'bg-white border-[#b9e5fb] shadow-sm'
                          : 'bg-white/60 border-transparent hover:bg-white hover:border-black/5'
                      }`}
                    >
                      <span className="w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-[#f7f7f7] border border-black/5 shrink-0">
                        {item.icon}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-extrabold text-[var(--dark-blue)] leading-none truncate">
                          {item.label}
                        </span>
                        {item.hint && (
                          <span className="block text-xs font-semibold text-[var(--gray-light)] truncate">{item.hint}</span>
                        )}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full bg-black/5 text-[var(--gray-text)] border border-black/5 shrink-0">
                        {item.kind === 'tab' ? item.tab : 'action'}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 bg-[#f7f7f7] border-t border-black/5 flex items-center justify-between text-[11px] font-bold text-[var(--gray-light)]">
          <span className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-black/10 shadow-xs">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-black/10 shadow-xs">↓</kbd>
              <span className="ml-1">Navigate</span>
            </span>
            <span className="inline-flex items-center gap-1 ml-3">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-black/10 shadow-xs">↵</kbd>
              <span className="ml-1">Select</span>
            </span>
          </span>
          <span className="hidden sm:inline">Ctrl / ⌘ + K to toggle</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
