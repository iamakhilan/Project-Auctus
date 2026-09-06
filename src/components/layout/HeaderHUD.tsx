import React from 'react';
import { useGameState } from '../../context/GameStateContext';

interface HeaderHUDProps {
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({ onOpenProfile, onOpenSettings }) => {
  const { profile, activeTab, toggleSound, setActiveTab } = useGameState();

  const getScreenTitle = () => {
    switch (activeTab) {
      case 'realm': return 'Citadel Realm';
      case 'quests': return 'Mission Forge';
      case 'focus-arena': return 'Focus Arena';
      case 'vault': return 'Treasury Vault';
      case 'citadel': return 'Commander Citadel';
      default: return 'Auctus';
    }
  };

  return (
    <header className="pt-safe fixed top-0 left-0 right-0 z-40 bg-surface/90 border-b border-outline-variant/50 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-screen mx-auto h-16 px-3 sm:px-4 flex items-center justify-between gap-2">
        {/* Left: Avatar with Level Badge + Screen / Player Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onOpenProfile || (() => setActiveTab('citadel'))}
            className="relative flex-shrink-0 flex items-center justify-center group focus:outline-none"
            title="View Commander Profile"
          >
            <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-amber-400/80 overflow-hidden shadow-card flex items-center justify-center group-hover:border-amber-300 transition-colors">
              <img
                src="/assets/avatar.png"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 font-label-sm text-[10px] font-black border border-yellow-200 shadow-sm leading-tight">
              {profile.level}
            </span>
          </button>

          <div className="flex flex-col min-w-0">
            <h1 className="font-headline-sm text-sm sm:text-base text-on-surface font-extrabold truncate leading-tight tracking-tight">
              {getScreenTitle()}
            </h1>
            <span className="font-label-sm text-[11px] text-on-surface-variant font-medium truncate leading-none mt-0.5">
              {profile.name} • {profile.leagueRank}
            </span>
          </div>
        </div>

        {/* Right: Curated Resource Counters & Quick Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Auctus Coins */}
          <button
            onClick={() => setActiveTab('vault')}
            className="flex items-center gap-1 px-2 py-1 rounded-control bg-surface-container border border-amber-400/40 hover:border-amber-400 active:scale-95 transition-all shadow-sm"
            title="Treasury Coins"
          >
            <span className="material-symbols-outlined text-amber-400 text-[16px] fill-1">
              monetization_on
            </span>
            <span className="font-label-md text-xs sm:text-sm text-amber-300 font-extrabold tabular-nums">
              {profile.coins >= 1000 ? `${(profile.coins / 1000).toFixed(1)}k` : profile.coins}
            </span>
          </button>

          {/* Diamonds / Shards */}
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-control bg-surface-container border border-sky-400/40 shadow-sm"
            title="Spire Shards"
          >
            <span className="material-symbols-outlined text-cyan-400 text-[16px] fill-1">
              diamond
            </span>
            <span className="font-label-md text-xs sm:text-sm text-cyan-300 font-bold tabular-nums">
              {profile.diamonds}
            </span>
          </div>

          {/* Streak Flame */}
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-control bg-surface-container border border-rose-500/40 shadow-sm"
            title="Consistency Streak"
          >
            <span className="material-symbols-outlined text-rose-500 text-[16px] fill-1 animate-pulse">
              local_fire_department
            </span>
            <span className="font-label-md text-xs sm:text-sm text-rose-200 font-bold tabular-nums">
              {profile.streakDays}d
            </span>
          </div>

          {/* Audio SFX Toggle */}
          <button
            onClick={toggleSound}
            className={`w-8 h-8 rounded-control flex items-center justify-center transition-all ${
              profile.soundEnabled
                ? 'text-amber-400 bg-surface-container border border-amber-400/40'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container border border-transparent'
            }`}
            title={profile.soundEnabled ? 'SFX Audio Enabled' : 'SFX Audio Muted'}
            aria-label="Toggle Sound"
          >
            <span className="material-symbols-outlined text-[17px]">
              {profile.soundEnabled ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          {/* Settings / Tutorial */}
          <button
            onClick={onOpenSettings || (() => setActiveTab('citadel'))}
            className="w-8 h-8 rounded-control flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container border border-transparent active:scale-95 transition-all"
            title="Citadel Settings & Guide"
            aria-label="Settings and Tutorial"
          >
            <span className="material-symbols-outlined text-[18px]">
              settings
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};