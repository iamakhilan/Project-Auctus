import React from 'react';
import { useGameState } from '../../context/GameStateContext';

interface HeaderHUDProps {
  onOpenProfile?: () => void;
  onOpenHelp?: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({ onOpenProfile, onOpenHelp }) => {
  const { profile, toggleSound } = useGameState();

  const xpPercentage = Math.min(100, Math.round((profile.xp / profile.xpToNextLevel) * 100));

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b-2 border-[#e5e5e5] shadow-xs select-none pt-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
       
        {/* Brand & Level Progress */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <button
              type="button"
            className="flex items-center gap-2 cursor-pointer group"
            onClick={onOpenProfile}
            aria-label="View profile and commander statistics"
          >
            <div className="w-10 h-10 rounded-2xl bg-[var(--green)] border-b-4 border-[var(--green-shadow)] flex items-center justify-center text-white font-black text-xl shadow-xs group-hover:scale-105 active:translate-y-1 transition-all">
              ⚡
            </div>
            <div className="hidden sm:block text-left min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-['Feather_Bold'] text-lg text-[var(--dark-blue)] tracking-wide truncate">
                  AUCTUS
                </span>
                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-md bg-[var(--green)] text-white shrink-0">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-[var(--gray-light)] font-bold truncate max-w-[120px]">
                {profile.title}
              </p>
            </div>
            <div className="hidden md:block text-left min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-['Feather_Bold'] text-lg text-[var(--dark-blue)] tracking-wide truncate">
                  AUCTUS
                </span>
                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-md bg-[var(--green)] text-white shrink-0">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-[var(--gray-light)] font-bold truncate max-w-[120px]">
                {profile.title}
              </p>
            </div>
          </button>

          {/* Level & XP Gauge */}
          <div className="hidden sm:flex items-center gap-2 bg-[#f7f7f7] border-2 border-[#e5e5e5] px-3 py-1.5 rounded-2xl min-w-0 flex-1">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black text-[var(--dark-blue)] shrink-0">
                  LVL {profile.level}
                </span>
                <span className="text-[11px] font-bold text-[var(--gray-light)] shrink-0" aria-label={`${profile.xp} out of ${profile.xpToNextLevel} experience points`}>
                  {profile.xp}/{profile.xpToNextLevel} XP
                </span>
              </div>
              <div className="w-20 sm:w-32 h-2.5 bg-[#e5e5e5] rounded-full overflow-hidden mt-0.5" role="progressbar" aria-valuenow={xpPercentage} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className="h-full bg-[var(--green)] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Currency & Vitality Status HUD */}
        <div className="flex items-center gap-1.5 sm:gap-3">
         
          {/* Streak Flame */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-[#fff5ea] border-2 border-[#ffd6a5] text-[var(--orange)] font-extrabold text-sm hover:scale-105 transition-transform cursor-default touch-target-sm"
            title={`${profile.streakDays} Day Productivity Streak!`}
          >
            <span className="text-base animate-pulse">🔥</span>
            <span>{profile.streakDays}</span>
          </div>

          {/* Energy Hearts - visible on mobile too but compact */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-[#ffeef0] border-2 border-[#ffccd2] text-[var(--red)] font-extrabold text-sm hover:scale-105 transition-transform cursor-default touch-target-sm"
            title={`Energy: ${profile.energy}/${profile.maxEnergy}`}
          >
            <span className="text-base">❤️</span>
            <span>{profile.energy}/{profile.maxEnergy}</span>
          </div>

          {/* Energy - mobile compact version */}
          <div className="sm:hidden flex items-center gap-1 px-2 py-1.5 rounded-xl bg-[#ffeef0] border-2 border-[#ffccd2] text-[var(--red)] font-extrabold text-xs touch-target-sm" title={`Energy: ${profile.energy}/${profile.maxEnergy}`}>
            <span className="text-sm">❤️</span>
            <span>{profile.energy}</span>
          </div>

          {/* Mana Gems */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-[#eef8ff] border-2 border-[#b9e5fb] text-[var(--blue)] font-extrabold text-sm hover:scale-105 transition-transform cursor-default touch-target-sm"
            title={`Mana Gems: ${profile.gems}`}
          >
            <span className="text-base">💎</span>
            <span>{profile.gems}</span>
          </div>

          {/* Gold Coins */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-[#fffbe6] border-2 border-[#ffe58f] text-[#d48806] font-extrabold text-sm hover:scale-105 transition-transform cursor-default touch-target-sm"
            title={`Gold Coins: ${profile.coins}`}
          >
            <span className="text-base">🟡</span>
            <span>{profile.coins}</span>
          </div>

          {/* Help Button */}
          {onOpenHelp && (
            <button
              type="button"
              onClick={onOpenHelp}
              className="w-9 h-9 sm:w-9 sm:h-9 rounded-xl border-2 border-[#e5e5e5] bg-white text-[var(--dark-blue)] hover:border-[var(--blue)] hover:bg-[#f0f9ff] flex items-center justify-center text-sm font-black transition-all touch-target"
              title="How to Play"
            >
              ❓
            </button>
          )}

          {/* Sound Mute Toggle */}
          <button
              type="button"
            onClick={toggleSound}
            className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center text-sm font-bold transition-all touch-target ${
              profile.soundEnabled
                ? 'bg-white border-[#e5e5e5] text-[var(--dark-blue)] hover:border-[var(--blue)] hover:bg-[#f0f9ff]'
                : 'bg-[#f5f5f5] border-[#d9d9d9] text-[var(--gray-light)] opacity-70'
            }`}
            title={profile.soundEnabled ? 'Audio Synthesizer: ON' : 'Audio Synthesizer: MUTED'}
            aria-label="Toggle Sound"
          >
            {profile.soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>

      </div>
    </header>
  );
};