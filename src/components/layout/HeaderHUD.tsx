import React from 'react';
import { useGameState } from '../../context/GameStateContext';

interface HeaderHUDProps {
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({ onOpenProfile, onOpenSettings }) => {
  const { profile, activeTab, toggleSound, setActiveTab } = useGameState();

  const xpPercent = Math.min(100, Math.round((profile.xp / profile.xpToNextLevel) * 100));

  const getScreenTitle = () => {
    switch (activeTab) {
      case 'realm': return 'Realm';
      case 'quests': return 'Quests';
      case 'focus-arena': return 'Focus Arena';
      case 'vault': return 'Vault';
      case 'citadel': return 'Citadel';
      default: return 'Auctus';
    }
  };

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-[#060d1b]/95 border-b border-[#244888]/60 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
      <div className="max-w-4xl mx-auto h-20 px-4 sm:px-6 flex items-center justify-between gap-2">
        {/* Left Side: Crest, Avatar & Level */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('realm')}
            className="flex items-center gap-2.5 focus:outline-none group"
            title="Return to Realm"
          >
            <img
              src="/assets/crest.png"
              alt="Auctus Crest"
              className="h-8 w-auto object-contain drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)] group-hover:scale-105 transition-transform"
            />
          </button>

          {/* Player Avatar with Level Badge */}
          <div className="flex items-center gap-2.5">
            <div 
              onClick={onOpenProfile || (() => setActiveTab('citadel'))}
              className="relative flex items-center justify-center cursor-pointer group"
              title="View Player Profile"
            >
              <div className="w-10 h-10 rounded-xl bg-[#142a54] border-2 border-amber-400/80 overflow-hidden shadow-[0_0_10px_rgba(251,191,36,0.3)] flex items-center justify-center group-hover:border-amber-300 transition-colors">
                <img
                  src="/assets/avatar.png"
                  alt="Player Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 font-label-sm text-[9px] font-black border border-yellow-200/80 shadow-md">
                LV.{profile.level}
              </span>
            </div>

            {/* XP Progress Bar */}
            <div className="hidden sm:flex flex-col gap-0.5">
              <div className="flex items-center justify-between text-[10px] font-label-sm">
                <span className="text-amber-400 font-bold">XP</span>
                <span className="text-on-surface-variant font-medium">
                  {profile.xp >= 1000 ? `${(profile.xp / 1000).toFixed(1)}k` : profile.xp} / {profile.xpToNextLevel >= 1000 ? `${(profile.xpToNextLevel / 1000).toFixed(1)}k` : profile.xpToNextLevel}
                </span>
              </div>
              <div className="w-20 h-2 bg-[#060d1b] rounded-full overflow-hidden border border-[#1a3668]/80 p-[1px]">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          <span className="font-headline-sm text-headline-sm text-on-surface tracking-wide hidden md:inline-block font-extrabold ml-1">
            {getScreenTitle()}
          </span>
        </div>

        {/* Center/Right: Resource Counters (Diamonds, Coins, Streak) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto py-1">
          {/* Diamonds / Mana Gems */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#142a54] border border-[#244888] shadow-sm">
            <span className="material-symbols-outlined text-cyan-400 text-[16px] fill-1">
              diamond
            </span>
            <span className="font-label-md text-[13px] text-cyan-300 font-bold">
              {profile.diamonds}
            </span>
          </div>

          {/* Auctus Coins */}
          <div 
            onClick={() => setActiveTab('vault')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#142a54] border border-amber-400/50 shadow-[0_0_8px_rgba(245,158,11,0.25)] cursor-pointer hover:border-amber-400 transition-colors"
            title="Open Treasury Vault"
          >
            <span className="material-symbols-outlined text-amber-400 text-[16px] fill-1">
              monetization_on
            </span>
            <span className="font-label-md text-[13px] text-amber-300 font-extrabold">
              {profile.coins}
            </span>
          </div>

          {/* Streak Flame */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#142a54] border border-rose-500/50 shadow-sm">
            <span className="material-symbols-outlined text-rose-500 text-[16px] fill-1 animate-pulse">
              local_fire_department
            </span>
            <span className="font-label-md text-[13px] text-rose-200 font-bold">
              {profile.streakDays}d
            </span>
          </div>
        </div>

        {/* Action Utility Buttons (Sound SFX, Settings, Profile) */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleSound}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              profile.soundEnabled
                ? 'text-amber-400 bg-[#142a54] border border-amber-400/40'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-[#142a54]'
            }`}
            title={profile.soundEnabled ? 'Sound Effects Enabled' : 'Sound Effects Muted'}
          >
            <span className="material-symbols-outlined text-[19px]">
              {profile.soundEnabled ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          <button
            onClick={onOpenSettings || (() => setActiveTab('citadel'))}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-[#142a54] transition-colors"
            title="Citadel Settings"
          >
            <span className="material-symbols-outlined text-[19px]">
              settings
            </span>
          </button>

          <button
            onClick={onOpenProfile || (() => setActiveTab('citadel'))}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border border-yellow-200 flex items-center justify-center shadow-md active:scale-95 transition-transform"
            title="Commander Profile"
          >
            <span className="material-symbols-outlined text-amber-950 text-[17px] font-bold">
              person
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
