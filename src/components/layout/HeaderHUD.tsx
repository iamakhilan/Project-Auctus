import React from 'react';
import { useGameState } from '../../context/GameStateContext';
import { CoinIcon, GemIcon, EnergyIcon, FireStreakIcon } from '../common/GameIcons';

interface HeaderHUDProps {
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({ onOpenProfile, onOpenSettings }) => {
  const { profile, activeTab, toggleSound, setActiveTab } = useGameState();

  const getScreenTitle = () => {
    switch (activeTab) {
      case 'realm': return 'Sanctuary Realm';
      case 'quests': return 'Mission Command';
      case 'focus-arena': return 'Focus Arena';
      case 'vault': return 'Treasury Vault';
      case 'citadel': return 'Commander HQ';
      default: return 'Auctus';
    }
  };

  const xpPercent = Math.min(100, Math.round((profile.xp / profile.xpToNextLevel) * 100));

  return (
    <header className="pt-safe fixed top-0 left-0 right-0 z-40 bg-game-dark/95 border-b-2 border-game-border backdrop-blur-xl shadow-[0_6px_24px_rgba(0,0,0,0.8)]">
      <div className="max-w-screen mx-auto h-16 px-2.5 sm:px-4 flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Left: Commander Avatar with Hexagonal Level Badge & XP bar */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onOpenProfile || (() => setActiveTab('citadel'))}
            className="relative flex-shrink-0 flex items-center justify-center group focus:outline-none cursor-pointer"
            title="Commander Profile"
          >
            <div className="w-10 h-10 rounded-xl bg-game-card border-2 border-game-borderHi group-hover:border-gold overflow-hidden shadow-game-card flex items-center justify-center transition-all">
              <img
                src="/assets/avatar.png"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-gradient-to-b from-gold-light to-gold-dark text-game-darkest font-game text-[10px] font-black border border-amber-300 shadow-sm leading-tight">
              {profile.level}
            </div>
          </button>

          <div className="flex flex-col min-w-0">
            <h1 className="font-game text-xs sm:text-sm text-game-text font-black truncate leading-tight tracking-tight uppercase">
              {getScreenTitle()}
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-body text-[10px] text-game-muted font-bold truncate">
                {profile.name}
              </span>
              <div className="w-14 h-1.5 bg-game-darkest rounded-full overflow-hidden border border-game-border/60">
                <div
                  className="h-full bg-gradient-to-r from-blue to-cyan rounded-full transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Tactile Resource Currency Pills */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          {/* Gold Coins Pill */}
          <button
            onClick={() => setActiveTab('vault')}
            className="currency-pill flex items-center gap-1 pl-1.5 pr-2 py-1 cursor-pointer hover:border-gold transition-colors active:scale-95"
            title="Treasury Coins"
          >
            <CoinIcon size={16} />
            <span className="font-game text-[11px] sm:text-xs text-amber-300 font-extrabold tabular-nums">
              {profile.coins >= 1000 ? `${(profile.coins / 1000).toFixed(1)}k` : profile.coins}
            </span>
          </button>

          {/* Diamonds / Gems Pill */}
          <button
            onClick={() => setActiveTab('vault')}
            className="currency-pill flex items-center gap-1 pl-1.5 pr-2 py-1 cursor-pointer hover:border-blue transition-colors active:scale-95"
            title="Spire Gems"
          >
            <GemIcon size={16} />
            <span className="font-game text-[11px] sm:text-xs text-cyan-300 font-extrabold tabular-nums">
              {profile.diamonds}
            </span>
          </button>

          {/* Energy / Stamina Pill */}
          <div
            className="currency-pill hidden sm:flex items-center gap-1 pl-1.5 pr-2 py-1"
            title="Battle Energy"
          >
            <EnergyIcon size={16} />
            <span className="font-game text-[11px] text-yellow-300 font-extrabold tabular-nums">
              50/50
            </span>
          </div>

          {/* Streak Flame Pill */}
          <div
            className="currency-pill flex items-center gap-0.5 pl-1.5 pr-2 py-1"
            title="Active Daily Streak"
          >
            <FireStreakIcon size={16} className="animate-pulse" />
            <span className="font-game text-[11px] text-orange-400 font-extrabold tabular-nums">
              {profile.streakDays}d
            </span>
          </div>

          {/* Audio SFX Toggle Button */}
          <button
            onClick={toggleSound}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              profile.soundEnabled
                ? 'bg-blue/20 border border-blue text-blue-light shadow-sm'
                : 'bg-game-card border border-game-border text-game-dim hover:text-game-text'
            }`}
            title={profile.soundEnabled ? 'Audio Sound FX Active' : 'Audio SFX Muted'}
            aria-label="Toggle Sound Effects"
          >
            <span className="material-symbols-outlined text-[17px]">
              {profile.soundEnabled ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings || (() => setActiveTab('citadel'))}
            className="w-8 h-8 rounded-lg bg-game-card border border-game-border text-game-muted hover:text-game-text flex items-center justify-center active:scale-95 transition-all cursor-pointer"
            title="Settings & Tutorial"
            aria-label="Settings"
          >
            <span className="material-symbols-outlined text-[17px]">settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};