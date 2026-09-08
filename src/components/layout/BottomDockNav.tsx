import React from 'react';
import { useGameState } from '../../context/GameStateContext';
import { TabType } from '../../types';
import { SwordsIcon } from '../common/GameIcons';

export const BottomDockNav: React.FC = () => {
  const { activeTab, setActiveTab, quests, chests } = useGameState();

  const activeQuestsCount = quests.filter(q => !q.isCompleted).length;
  const readyChestsCount = chests.filter(c => c.status === 'ready').length;

  const tabs: { id: TabType; label: string; icon: string; badge?: number | string; badgeColor?: string }[] = [
    { id: 'realm', label: 'Realm', icon: 'castle' },
    {
      id: 'quests',
      label: 'Missions',
      icon: 'military_tech',
      badge: activeQuestsCount > 0 ? activeQuestsCount : undefined,
      badgeColor: 'bg-gradient-to-b from-red to-red-dark text-white border-red-300',
    },
    { id: 'focus-arena', label: 'BATTLE', icon: 'swords' }, // Center action
    {
      id: 'vault',
      label: 'Vault',
      icon: 'inventory_2',
      badge: readyChestsCount > 0 ? 'CLAIM' : undefined,
      badgeColor: 'bg-gradient-to-b from-gold-light to-gold-dark text-game-darkest font-black border-yellow-200 animate-bounce',
    },
    { id: 'citadel', label: 'Citadel', icon: 'shield_person' },
  ];

  return (
    <nav className="pb-safe fixed bottom-0 left-0 right-0 z-40 bg-game-dark/95 border-t-2 border-game-border backdrop-blur-xl shadow-[0_-6px_24px_rgba(0,0,0,0.8)]">
      <div className="max-w-screen mx-auto h-16 px-2 sm:px-4 flex items-center justify-around">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;

          if (tab.id === 'focus-arena') {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex flex-col items-center justify-center min-w-[64px] -mt-5 transition-transform hover:scale-105 active:scale-95 focus:outline-none cursor-pointer group"
                aria-label="Battle Focus Arena"
              >
                {/* Center 3D Battle Button */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all shadow-game-card ${
                    isActive
                      ? 'btn-game-green border-white scale-105'
                      : 'btn-game-green border-green-300/80'
                  }`}
                >
                  <SwordsIcon size={28} className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] group-hover:rotate-12 transition-transform" />
                </div>
                <span
                  className={`font-game text-[10px] mt-0.5 font-black uppercase tracking-wider ${
                    isActive ? 'text-green-light' : 'text-game-muted'
                  }`}
                >
                  FOCUS
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center min-w-[50px] h-12 transition-all focus:outline-none active:scale-90 cursor-pointer ${
                isActive ? 'text-gold-light' : 'text-game-muted hover:text-game-text'
              }`}
              aria-label={tab.label}
            >
              <div className="relative">
                {/* Active tab pill */}
                <div
                  className={`flex items-center justify-center h-7 w-10 rounded-xl transition-all ${
                    isActive
                      ? 'bg-game-card border-2 border-gold shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                      : 'border border-transparent'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${isActive ? 'fill-1 text-gold-light' : ''}`}>
                    {tab.icon}
                  </span>
                </div>

                {/* Badge Notification */}
                {tab.badge !== undefined && (
                  <span
                    className={`absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full font-game text-[9px] leading-none font-black shadow-md border flex items-center justify-center ${tab.badgeColor}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`font-game text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-black text-gold-light' : 'font-bold'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};