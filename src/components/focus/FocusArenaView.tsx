import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';

export const FocusArenaView: React.FC = () => {
  const {
    focusSession,
    pauseFocusSession,
    resumeFocusSession,
    cancelFocusSession,
    completeFocusSession,
    toggleManaOvercharge,
    setSoundscapeTrack,
    setActiveTab,
  } = useGameState();

  const [soundscapeMenuOpen, setSoundscapeMenuOpen] = useState(false);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const targetSecs = focusSession.targetDurationSeconds || 1500;
  const progressRatio = (targetSecs - focusSession.remainingSeconds) / targetSecs;
  
  // Circumference of radius 114 circle = 2 * PI * 114 = 716.28
  const circumference = 716.28;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const getSoundscapeName = () => {
    switch (focusSession.soundscapeTrack) {
      case 'binaural': return 'Deep Space Binaural 432Hz';
      case 'cyber-rain': return 'Cyber Citadel Rainstorm';
      case 'forest-spire': return 'Arcane Forest Resonance';
      case 'white-noise': return 'Cosmic Static Shield';
      case 'none': return 'Muted Atmosphere';
    }
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto pb-32 pt-2 min-h-screen">
      {/* Dynamic Arena Header Stats */}
      <div className="px-4 pt-1 pb-3 flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          {/* Gem Stat Chip */}
          <div className="bg-gradient-to-b from-[#1b3463] to-[#122346] rounded-xl p-2 flex items-center gap-2 shadow-lg border-t border-sky-400/30 border-b-2 border-black/50">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-amber-300 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_2px_6px_rgba(217,119,6,0.6)] border border-amber-200/50">
              <span className="material-symbols-outlined text-[#451a03] text-[20px] fill-1">
                diamond
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-[9px] text-sky-200/70 uppercase truncate">
                Mana Gems
              </span>
              <span className="font-headline-sm text-[14px] text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] truncate">
                +12
              </span>
            </div>
          </div>

          {/* Live XP Multiplier */}
          <div className="bg-gradient-to-b from-[#1b3463] to-[#122346] rounded-xl p-2 flex items-center gap-2 shadow-lg border-t border-sky-400/30 border-b-2 border-black/50">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-cyan-300 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_2px_6px_rgba(6,182,212,0.6)] border border-cyan-200/50">
              <span className="material-symbols-outlined text-[#022c44] text-[20px] fill-1">
                bolt
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-[9px] text-sky-200/70 uppercase truncate">
                Streak Yield
              </span>
              <span className="font-headline-sm text-[14px] text-[#00e5ff] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] truncate">
                {focusSession.isOvercharged ? '2.0x Boost' : '1.5x Multi'}
              </span>
            </div>
          </div>

          {/* Spire Ward Level */}
          <div className="bg-gradient-to-b from-[#1b3463] to-[#122346] rounded-xl p-2 flex items-center gap-2 shadow-lg border-t border-sky-400/30 border-b-2 border-black/50">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-emerald-400 to-emerald-700 flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_2px_6px_rgba(16,185,129,0.5)] border border-emerald-200/40">
              <span className="material-symbols-outlined text-[#022c1b] text-[20px] fill-1">
                shield
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-[9px] text-sky-200/70 uppercase truncate">
                Defenses
              </span>
              <span className="font-headline-sm text-[14px] text-emerald-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] truncate">
                T-2 Spire
              </span>
            </div>
          </div>
        </div>

        {/* Active Target Mission HUD Tile */}
        <div className="bg-gradient-to-b from-[#18315c] via-[#122448] to-[#0c1a35] rounded-xl p-3 shadow-[0_8px_20px_rgba(0,0,0,0.5)] border-t border-sky-400/40 border-b-2 border-black/60 flex items-center justify-between gap-3 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#244580] to-[#142850] flex items-center justify-center flex-shrink-0 shadow-inner border border-sky-400/30">
              <span className="material-symbols-outlined text-cyan-300 text-[24px] drop-shadow-[0_0_6px_rgba(0,229,255,0.7)] fill-1">
                swords
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
                <span className="font-label-sm text-[10px] text-emerald-300 uppercase tracking-wider font-extrabold">
                  Crucible Mission In Progress
                </span>
              </div>
              <span className="font-headline-sm text-[15px] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] truncate font-bold">
                {focusSession.selectedQuestTitle || 'Deep Work: Write Strategy Memo'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('quests')}
            className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#203a6a] hover:bg-[#284882] border border-sky-400/25 flex items-center justify-center text-sky-200 hover:text-white shadow-md active:scale-95 transition-all"
            title="Switch Target Bounty"
          >
            <span className="material-symbols-outlined text-[20px]">edit_note</span>
          </button>
        </div>
      </div>

      {/* Central Focus Crucible / Circular Holographic Timer Ring */}
      <div className="px-4 my-2 flex flex-col items-center justify-center relative">
        {/* Ambient Glow Pods */}
        <div className="absolute w-72 h-72 bg-[#00d2ff]/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute w-52 h-52 bg-amber-500/20 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="relative w-72 h-72 flex items-center justify-center">
          {/* Outer Runic Ring SVG */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 filter drop-shadow-[0_0_16px_rgba(0,210,255,0.45)]"
            viewBox="0 0 260 260"
          >
            <defs>
              <linearGradient id="arenaCyanGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#00e5ff" />
                <stop offset="60%" stopColor="#00b4d8" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>

            {/* Inset Background Track */}
            <circle
              cx="130"
              cy="130"
              fill="none"
              r="114"
              stroke="#0a1a36"
              strokeWidth="14"
            />

            {/* Dynamic Countdown Fill Arc */}
            <circle
              cx="130"
              cy="130"
              fill="none"
              r="114"
              stroke="url(#arenaCyanGradient)"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              strokeWidth="14"
              className="transition-all duration-1000 ease-linear"
            />

            {/* Segmented Gold Clash Markers */}
            <circle
              cx="130"
              cy="130"
              fill="none"
              opacity="0.8"
              r="125"
              stroke="#f59e0b"
              strokeDasharray="3 29"
              strokeWidth="3"
            />
          </svg>

          {/* Inner Holographic Energy Crucible */}
          <div className="w-56 h-56 rounded-full bg-gradient-to-b from-[#0e2145] via-[#09152e] to-[#040c1d] flex flex-col items-center justify-center shadow-[inset_0_4px_16px_rgba(0,0,0,0.8),0_10px_24px_rgba(0,0,0,0.6)] border-2 border-sky-400/40 p-4 relative overflow-hidden text-center">
            {/* Living Mana Core Icon Illusion */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <span className="material-symbols-outlined text-cyan-300 text-[140px] animate-pulse drop-shadow-[0_0_20px_#00d2ff] fill-1">
                token
              </span>
            </div>

            <div className="z-10 flex flex-col items-center">
              <div className="flex items-center gap-1 mb-1">
                <span className="material-symbols-outlined text-amber-400 text-[15px] drop-shadow-[0_0_4px_#fbbf24]">
                  bolt
                </span>
                <span className="font-label-sm text-[10px] text-cyan-300 uppercase tracking-wider font-extrabold drop-shadow">
                  {focusSession.isPaused ? 'Focus Paused' : 'Mana Spire Resonating'}
                </span>
              </div>

              {/* Digital Clock Readout */}
              <span className="font-headline-xl text-[38px] font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,210,255,0.6)] font-mono">
                {formatTime(focusSession.remainingSeconds)}
              </span>
              <span className="font-body-sm text-[12px] text-sky-200/80 mb-2 font-semibold">
                Session Target {Math.round(targetSecs / 60)}:00
              </span>

              {/* Real-Time Harvest Badges */}
              <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500/20 via-[#18315c] to-amber-500/20 border border-amber-400/40 px-2.5 py-1 rounded-full shadow-inner">
                <span className="material-symbols-outlined text-amber-300 text-[14px]">
                  auto_awesome
                </span>
                <span className="font-label-sm text-[10px] text-amber-300 font-extrabold tracking-wide">
                  +{focusSession.accumulatedXp} XP Accumulated
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Ward Status Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 w-full">
          <div className="flex items-center gap-1.5 bg-gradient-to-b from-[#064e3b]/80 to-[#022c22]/90 border border-emerald-400/50 px-3 py-1 rounded-full shadow-[0_2px_8px_rgba(5,150,105,0.3)]">
            <span className="material-symbols-outlined text-emerald-300 text-[15px]">security</span>
            <span className="font-label-sm text-[11px] text-emerald-200 font-bold tracking-wide">
              Distraction Ward: Active
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-gradient-to-b from-[#881337]/80 to-[#4c0519]/90 border border-rose-400/50 px-3 py-1 rounded-full shadow-[0_2px_8px_rgba(225,29,72,0.3)]">
            <span className="material-symbols-outlined text-rose-300 text-[15px]">notifications_off</span>
            <span className="font-label-sm text-[11px] text-rose-200 font-bold tracking-wide">
              Shield: Notifications Silenced
            </span>
          </div>
        </div>
      </div>

      {/* Audio Atmosphere / Soundscape Control Card */}
      <div className="px-4 mt-3 mb-1 relative">
        <div className="bg-gradient-to-b from-[#18315c] via-[#122448] to-[#0c1a35] rounded-xl p-3 shadow-lg border-t border-sky-400/30 border-b-2 border-black/60 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#25467e] to-[#162d55] flex items-center justify-center flex-shrink-0 text-cyan-300 border border-sky-400/30 shadow-inner">
              <span className="material-symbols-outlined text-[22px] fill-1">headphones</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-[10px] text-sky-200/70 uppercase font-bold tracking-wider">
                Soundscape Frequency
              </span>
              <span className="font-headline-sm text-[14px] text-white truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-bold">
                {getSoundscapeName()}
              </span>
            </div>
          </div>

          <button
            onClick={() => setSoundscapeMenuOpen(!soundscapeMenuOpen)}
            className="w-9 h-9 rounded-xl bg-[#203a6a] hover:bg-[#2a4d8b] border border-sky-400/30 flex items-center justify-center text-cyan-300 hover:text-white transition-all flex-shrink-0 shadow-md active:scale-95"
            title="Configure Soundscape"
          >
            <span className="material-symbols-outlined text-[22px]">graphic_eq</span>
          </button>
        </div>

        {/* Soundscape Selector Dropdown Menu */}
        {soundscapeMenuOpen && (
          <div className="absolute left-4 right-4 top-full mt-2 z-30 bg-[#0d1c38] border border-sky-400/40 rounded-xl p-2 shadow-2xl backdrop-blur-xl flex flex-col gap-1 animate-fadeIn">
            {(
              [
                { id: 'binaural', label: 'Deep Space Binaural 432Hz' },
                { id: 'cyber-rain', label: 'Cyber Citadel Rainstorm' },
                { id: 'forest-spire', label: 'Arcane Forest Resonance' },
                { id: 'white-noise', label: 'Cosmic Static Shield' },
                { id: 'none', label: 'Muted Atmosphere' },
              ] as const
            ).map(opt => (
              <button
                key={opt.id}
                onClick={() => {
                  setSoundscapeTrack(opt.id);
                  setSoundscapeMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg font-label-md text-[12px] flex items-center justify-between transition-colors ${
                  focusSession.soundscapeTrack === opt.id
                    ? 'bg-[#21437c] text-amber-300 font-bold'
                    : 'text-on-surface-variant hover:text-white hover:bg-[#15294e]'
                }`}
              >
                <span>{opt.label}</span>
                {focusSession.soundscapeTrack === opt.id && (
                  <span className="material-symbols-outlined text-[16px] text-amber-400">check</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Primary Battle Tactical Controls */}
      <div className="px-4 my-2 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Pause / Resume Button */}
          <button
            onClick={focusSession.isPaused ? resumeFocusSession : pauseFocusSession}
            className={`font-headline-sm text-[14px] uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg border-t border-b-4 active:border-b active:translate-y-1 transition-all font-black ${
              focusSession.isPaused
                ? 'bg-gradient-to-b from-[#059669] via-[#047857] to-[#064e3b] text-emerald-200 border-emerald-300/40 border-black/70'
                : 'bg-gradient-to-b from-[#24457e] via-[#19335f] to-[#102242] text-white border-sky-400/40 border-black/70'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] text-cyan-300">
              {focusSession.isPaused ? 'play_circle' : 'pause_circle'}
            </span>
            <span>{focusSession.isPaused ? 'Resume Focus' : 'Pause Focus'}</span>
          </button>

          {/* Yield Run / Cancel Button */}
          <button
            onClick={cancelFocusSession}
            className="bg-gradient-to-b from-[#881337] via-[#5b0e25] to-[#380616] text-rose-200 hover:text-white font-headline-sm text-[14px] uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg border-t border-rose-400/50 border-b-4 border-black/80 active:border-b active:translate-y-1 transition-all font-black"
          >
            <span className="material-symbols-outlined text-[20px] text-rose-400">flag</span>
            <span>Yield Run</span>
          </button>
        </div>

        {/* Overcharge Mana Action Button */}
        <button
          onClick={toggleManaOvercharge}
          className={`w-full font-headline-md text-[15px] uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all font-black tracking-wide ${
            focusSession.isOvercharged
              ? 'bg-gradient-to-b from-cyan-300 via-cyan-500 to-cyan-700 text-[#022c44] border-t-2 border-white/90 shadow-[0_6px_0_#0369a1,0_12px_24px_rgba(6,182,212,0.6)] animate-pulse'
              : 'bg-gradient-to-b from-[#fde047] via-[#f59e0b] to-[#d97706] text-[#451a03] border-t-2 border-white/80 shadow-[0_6px_0_#92400e,0_12px_24px_rgba(245,158,11,0.45)]'
          } active:shadow-none active:border-b-0 active:translate-y-1.5`}
        >
          <span className="material-symbols-outlined text-[24px] fill-1">electric_bolt</span>
          <span className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">
            {focusSession.isOvercharged
              ? 'Mana Overcharged! (+50% Burst Active)'
              : 'Overcharge Mana (+50% Burst)'}
          </span>
        </button>

        {/* Complete Session Action Button (for testing or early victory) */}
        <button
          onClick={completeFocusSession}
          className="w-full mt-1 py-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-label-sm text-[11px] uppercase font-bold hover:bg-emerald-900/60 transition-colors flex items-center justify-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>Claim Victorious Early Completion</span>
        </button>
      </div>

      {/* Motivational Progression Footer Card */}
      <div className="px-4 mt-2 mb-3">
        <div className="bg-gradient-to-r from-[#18315c] via-[#14284d] to-[#10203f] rounded-xl p-3 shadow-xl border-t border-sky-400/30 border-b-2 border-black/60 flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_4px_12px_rgba(217,119,6,0.6)] border border-amber-200/60">
            <span className="material-symbols-outlined text-[#451a03] text-[26px] fill-1">
              package_2
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-[10px] text-amber-300 uppercase tracking-wider font-extrabold">
              Victorious Completion Reward
            </span>
            <p className="font-body-sm text-[12px] text-sky-100 leading-tight mt-0.5 font-medium">
              Unlocks{' '}
              <span className="text-amber-300 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Silver Quest Chest
              </span>{' '}
              and promotes your Focus Spire to{' '}
              <span className="text-cyan-300 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Tier 3
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
