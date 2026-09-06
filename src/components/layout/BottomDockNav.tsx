import React from 'react';
import { useGameState } from '../../context/GameStateContext';
import { TabType } from '../../types';

export const BottomDockNav: React.FC = () => {
  const { activeTab, setActiveTab, quests, chests } = useGameState();

  const activeQuestsCount = quests.filter(q => !q.isCompleted).length;
  const readyChestsCount = chests.filter(c => c.status === 'ready').length;

  const tabs: { id: TabType; label: string; icon: string; badge?: number | string; badgeColor?: string }[] = [
    { id: 'realm', label: 'Realm', icon: 'castle' },
    {
      id: 'quests',
      label: 'Quests',
      icon: 'history_edu',
      badge: activeQuestsCount > 0 ? activeQuestsCount : undefined,
      badgeColor: 'bg-rose-500 text-white border-rose-300/40'
    },
    { id: 'focus-arena', label: 'Focus', icon: 'swords' }, // Center action
    {
      id: 'vault',
      label: 'Vault',
      icon: 'inventory_2',
      badge: readyChestsCount > 0 ? 'CLAIM' : undefined,
      badgeColor: 'bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 font-black border-yellow-200'
    },
    { id: 'citadel', label: 'Citadel', icon: 'shield_person' }
  ];

  return (
    <nav className="pb-safe fixed bottom-0 left-0 right-0 z-40 bg-surface/92 border-t border-outline-variant/50 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.6)]">
      <div className="max-w-screen mx-auto h-16 px-2 sm:px-4 flex items-center justify-around">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;

          if (tab.id === 'focus-arena') {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center justify-center min-w-[56px] -mt-4 transition-transform hover:scale-105 active:scale-95 focus:outline-none"
                aria-label="Focus Arena"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                  isActive
                    ? 'bg-gradient-to-b from-cyan-400 via-sky-500 to-blue-600 text-white border-cyan-200 shadow-[0_4px_16px_rgba(56,189,248,0.5)]'
                    : 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-amber-950 border-yellow-200/80 shadow-[0_4px_14px_rgba(245,158,11,0.4)]'
                }`}>
                  <span className="material-symbols-outlined text-[24px] font-black fill-1">
                    swords
                  </span>
                </div>
                <span className={`font-label-sm text-[10px] mt-0.5 font-extrabold uppercase tracking-wider ${
                  isActive ? 'text-cyan-300' : 'text-amber-400'
                }`}>
                  Focus
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center min-w-[48px] h-12 transition-all focus:outline-none active:scale-90 ${
                isActive ? 'text-amber-300' : 'text-on-surface-variant hover:text-on-surface'
              }`}
              aria-label={tab.label}
            >
              <div className="relative">
                {/* Active tab pill */}
                <div className={`flex items-center justify-center h-7 w-10 rounded-lg transition-all ${
                  isActive
                    ? 'bg-surface-container-high border border-amber-400/30 shadow-[0_0_10px_rgba(251,191,36,0.15)]'
                    : 'border border-transparent'
                }`}>
                  <span className={`material-symbols-outlined text-[20px] ${isActive ? 'fill-1 text-amber-400' : ''}`}>
                    {tab.icon}
                  </span>
                </div>

                {/* Badge Notification */}
                {tab.badge !== undefined && (
                  <span className={`absolute -top-1 -right-1.5 min-w-[16px] h-[16px] px-1 rounded-full font-label-sm text-[9px] leading-none font-black shadow border flex items-center justify-center ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`font-label-sm text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-black text-amber-300' : 'font-semibold'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};