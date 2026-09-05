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
      badgeColor: 'bg-gradient-to-b from-[#f43f5e] to-[#be123c] text-white border-white/30'
    },
    { id: 'focus-arena', label: 'Focus', icon: 'swords' }, // Center action
    { 
      id: 'vault', 
      label: 'Vault', 
      icon: 'inventory_2', 
      badge: readyChestsCount > 0 ? 'CLAIM' : undefined,
      badgeColor: 'bg-gradient-to-b from-[#fde047] to-[#f59e0b] text-[#361e00] border-[#ffdf6d]'
    },
    { id: 'citadel', label: 'Citadel', icon: 'shield_person' }
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#060d1b]/95 border-t border-[#244888]/60 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.7)]">
      <div className="max-w-md mx-auto h-nav-bar-height px-3 flex items-center justify-around">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;

          if (tab.id === 'focus-arena') {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center justify-center min-w-[56px] min-h-[56px] -mt-5 transition-transform hover:scale-105 active:scale-95 focus:outline-none"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all ${
                  isActive
                    ? 'bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] text-white border-cyan-200 shadow-[0_6px_0_#075985,0_0_24px_rgba(56,189,248,0.6)]'
                    : 'bg-gradient-to-b from-[#fde047] via-[#f59e0b] to-[#d97706] text-[#361e00] border-[#ffdf6d] shadow-[0_6px_0_#78350f,0_0_20px_rgba(245,158,11,0.5)]'
                }`}>
                  <span className="material-symbols-outlined text-[28px] font-black fill-1">
                    swords
                  </span>
                </div>
                <span className={`font-label-sm text-[11px] mt-1 font-black ${
                  isActive ? 'text-cyan-300' : 'text-[#fde047]'
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
              className={`relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] transition-all focus:outline-none ${
                isActive ? 'text-[#fbc02d] scale-105' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div className="relative">
                <span className={`material-symbols-outlined text-[22px] ${isActive ? 'fill-1' : ''}`}>
                  {tab.icon}
                </span>

                {/* Badge Notification */}
                {tab.badge !== undefined && (
                  <span className={`absolute -top-1.5 -right-3 px-1.5 py-0.2 rounded-full font-label-sm text-[9px] leading-tight font-black shadow border ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`font-label-sm text-[10px] mt-1 ${isActive ? 'font-black' : 'font-bold'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
