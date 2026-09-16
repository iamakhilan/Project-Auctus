import React from 'react';
import { TabType } from '../../types';
import { useGameState } from '../../context/GameStateContext';
import { soundEngine } from '../../utils/audioSynthesizer';

interface NavTabsProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

interface TabItem {
  id: TabType;
  label: string;
  icon: string;
  badge?: number | string;
}

export const NavTabs: React.FC<NavTabsProps> = ({ activeTab, onSelectTab }) => {
  const { quests, chests, focusSession } = useGameState();

  const pendingQuests = quests.filter((q) => !q.isCompleted && q.category === 'daily').length;
  const readyChests = chests.filter((c) => c.status === 'ready').length;

  const tabs: TabItem[] = [
    {
      id: 'realm',
      label: 'Realm',
      icon: '🗺️',
    },
    {
      id: 'quests',
      label: 'Quests',
      icon: '⚔️',
      badge: pendingQuests > 0 ? pendingQuests : undefined,
    },
    {
      id: 'focus',
      label: 'Focus Arena',
      icon: '⏱️',
      badge: focusSession.isActive ? 'BATTLE' : undefined,
    },
    {
      id: 'vault',
      label: 'Vault',
      icon: '📦',
      badge: readyChests > 0 ? 'LOOT!' : undefined,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📊',
    },
    {
      id: 'citadel',
      label: 'Citadel',
      icon: '🏰',
    },
  ];

  const handleTabClick = (tabId: TabType) => {
    soundEngine.playClick();
    onSelectTab(tabId);
  };

  return (
    <nav className="w-full bg-white border-b-2 border-[#e5e5e5] px-2 sm:px-4 select-none sticky top-16 z-20 shadow-xs">
      <div className="max-w-4xl mx-auto flex items-center justify-around sm:justify-center sm:gap-2 md:gap-4 py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`${tab.label}${tab.badge ? `, ${tab.badge}` : ''}`}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl font-['Feather_Bold'] text-sm sm:text-base font-extrabold tracking-wide transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#eef8ff] text-[var(--blue)] border-2 border-[#b9e5fb] shadow-xs'
                  : 'text-[var(--gray-light)] hover:text-[var(--gray-text)] hover:bg-[#f7f7f7] border-2 border-transparent'
              }`}
            >
              <span className="text-lg sm:text-xl">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>

              {/* Badges */}
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider text-white shadow-xs ${
                    tab.badge === 'BATTLE'
                      ? 'bg-[var(--red)] animate-pulse'
                      : tab.badge === 'LOOT!'
                      ? 'bg-[var(--golden)] text-[var(--dark-blue)] animate-bounce'
                      : 'bg-[var(--blue)]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}

              {/* Active Indicator Underline */}
              {isActive && (
                <span className="absolute bottom-0 left-3 right-3 h-1 bg-[var(--blue)] rounded-full -mb-2" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};