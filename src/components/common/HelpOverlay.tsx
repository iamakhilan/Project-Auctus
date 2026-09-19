import React, { useEffect } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';

export interface HelpOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

type Shortcut = { keys: string; label: string; desc: string; icon: string };

const SHORTCUTS: Shortcut[] = [
  { keys: '?', label: 'Help', desc: 'Open this help overlay', icon: '❓' },
  { keys: 'Esc', label: 'Close', desc: 'Close modals & overlays', icon: '⎋' },
  { keys: 'Ctrl + K', label: 'Palette', desc: 'Open command palette (⌘K on Mac)', icon: '⌘' },
  { keys: '1 – 6', label: 'Tabs', desc: 'Jump to Realm / Quests / Focus / Vault / Citadel / Analytics', icon: '🔢' },
];

const TAB_HINTS: { key: string; label: string; icon: string }[] = [
  { key: '1', label: 'Realm', icon: '🗺️' },
  { key: '2', label: 'Quests', icon: '⚔️' },
  { key: '3', label: 'Focus', icon: '⏱️' },
  { key: '4', label: 'Vault', icon: '📦' },
  { key: '5', label: 'Citadel', icon: '🏰' },
  { key: '6', label: 'Analytics', icon: '📊' },
];

export const HelpOverlay: React.FC<HelpOverlayProps> = ({ isOpen, onClose }) => {
  const trapRef = useFocusTrap<HTMLDivElement>(isOpen, onClose);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts help"
        tabIndex={-1}
        className="relative w-full max-w-2xl bg-white rounded-3xl border-4 border-[#e5e5e5] shadow-2xl p-6 sm:p-8 outline-none max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-[var(--green)] border-b-4 border-[var(--green-shadow)] flex items-center justify-center text-xl shadow-sm">
              ⌨️
            </span>
            <div>
              <h2 className="font-['Feather_Bold'] text-xl sm:text-2xl text-[var(--dark-blue)] tracking-wide leading-none">
                KEYBOARD SHORTCUTS
              </h2>
              <p className="text-xs font-extrabold text-[var(--gray-light)] mt-1">Move faster. Press ? anytime.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close help"
            className="w-9 h-9 rounded-xl bg-[#f0f0f0] text-[var(--gray-text)] hover:bg-[#e0e0e0] font-black text-sm flex items-center justify-center cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Shortcut cards — Duolingo style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5">
          {SHORTCUTS.map((s) => (
            <div
              key={s.keys}
              className="p-4 rounded-2xl border-2 bg-white border-[#e5e5e5] flex items-start gap-3 shadow-sm text-left"
            >
              <span className="w-10 h-10 rounded-xl bg-[#f7f7f7] border-2 border-[#e5e5e5] flex items-center justify-center text-lg shrink-0">
                {s.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center justify-center px-2 py-1 rounded-xl bg-[var(--dark-blue)] text-white text-[11px] font-black tracking-widest border-b-2 border-black/20">
                    {s.keys}
                  </span>
                  <span className="text-sm font-['Feather_Bold'] text-[var(--dark-blue)]">{s.label}</span>
                </div>
                <p className="text-xs font-semibold text-[var(--gray-light)] leading-relaxed mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 1-6 tabs card */}
        <div className="p-4 rounded-2xl border-2 bg-[#f7f7f7] border-[#e5e5e5] mb-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-black uppercase tracking-widest text-[var(--gray-light)]">Quick tab jump — press 1 – 6</span>
            <span className="text-[11px] font-extrabold text-[var(--gray-light)] hidden sm:inline">Works outside inputs</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {TAB_HINTS.map((t) => (
              <div
                key={t.key}
                className="flex flex-col items-center gap-1 py-2.5 rounded-2xl bg-white border-2 border-[#e5e5e5] shadow-xs"
              >
                <span className="text-lg leading-none">{t.icon}</span>
                <span className="w-6 h-6 rounded-lg bg-[var(--dark-blue)] text-white text-xs font-black flex items-center justify-center border-b-2 border-black/20">
                  {t.key}
                </span>
                <span className="text-[11px] font-extrabold text-[var(--gray-text)]">{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-12 bg-[var(--green)] hover:bg-[var(--green-hover)] text-white font-['Feather_Bold'] text-sm font-black tracking-wider uppercase rounded-2xl border-b-4 border-[var(--green-shadow)] active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-md"
          >
            GOT IT — LET'S GO ⚡
          </button>
          <span className="hidden sm:flex items-center justify-center text-xs font-bold text-[var(--gray-light)] px-2">
            Tip: Ctrl+K anywhere
          </span>
        </div>
      </div>
    </div>
  );
};

export default HelpOverlay;
