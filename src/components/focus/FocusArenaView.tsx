import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { calculateFocusYield } from '../../domain/focus';

export const FocusArenaView: React.FC = () => {
  const {
    focusSession,
    quests,
    startFocusSession,
    pauseFocusSession,
    resumeFocusSession,
    cancelFocusSession,
    completeFocusSession,
    toggleManaOvercharge,
    setSoundscapeTrack,
    setActiveTab,
  } = useGameState();

  const [soundscapeMenuOpen, setSoundscapeMenuOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [selectedQuestId, setSelectedQuestId] = useState<string | undefined>(undefined);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const targetSecs = focusSession.targetDurationSeconds || 1500;
  const progressRatio = Math.min(1, Math.max(0, (targetSecs - focusSession.remainingSeconds) / targetSecs));

  // Circumference of radius 114 circle = 2 * PI * 114 = 716.28
  const circumference = 716.28;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const getSoundscapeName = (track = focusSession.soundscapeTrack) => {
    switch (track) {
      case 'binaural': return 'Deep Space Binaural 432Hz';
      case 'cyber-rain': return 'Cyber Citadel Rainstorm';
      case 'forest-spire': return 'Arcane Forest Resonance';
      case 'white-noise': return 'Cosmic Static Shield';
      case 'none': return 'Muted Atmosphere';
      default: return 'Deep Space Binaural 432Hz';
    }
  };

  const activeQuest = quests.find(q => q.id === selectedQuestId) || quests.find(q => !q.isCompleted);

  const presets = [
    { label: '15m', mins: 15, name: 'Tactical Sprint' },
    { label: '25m', mins: 25, name: 'Crucible Standard' },
    { label: '45m', mins: 45, name: 'Deep Probe' },
    { label: '60m', mins: 60, name: 'Titan Focus' },
    { label: '90m', mins: 90, name: 'Apex Flow' },
  ];

  const estimatedYield = calculateFocusYield(selectedDuration, false);

  return (
    <div className="flex flex-col w-full max-w-screen mx-auto pb-32 pt-3 min-h-screen">
      {/* Dynamic Arena Header Stats */}
      <div className="px-4 pt-1 pb-3 flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          {/* Gem Stat Chip */}
          <div className="bg-surface-container rounded-control p-2 flex items-center gap-2 shadow-card border border-outline-variant">
            <div className="w-8 h-8 rounded-control bg-gradient-to-b from-amber-300 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_2px_6px_rgba(217,119,6,0.6)] border border-amber-200/50">
              <span className="material-symbols-outlined text-[#451a03] text-[20px] fill-1">
                diamond
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-sky-200/70 uppercase truncate">
                Mana Gems
              </span>
              <span className="font-headline-sm text-body-md text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] truncate font-extrabold">
                +12
              </span>
            </div>
          </div>

          {/* Live XP Multiplier */}
          <div className="bg-surface-container rounded-control p-2 flex items-center gap-2 shadow-card border border-outline-variant">
            <div className="w-8 h-8 rounded-control bg-gradient-to-b from-cyan-300 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_2px_6px_rgba(6,182,212,0.6)] border border-cyan-200/50">
              <span className="material-symbols-outlined text-[#022c44] text-[20px] fill-1">
                bolt
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-sky-200/70 uppercase truncate">
                Streak Yield
              </span>
              <span className="font-headline-sm text-body-md text-[#00e5ff] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] truncate font-extrabold">
                {focusSession.isOvercharged ? '2.0x Boost' : '1.5x Multi'}
              </span>
            </div>
          </div>

          {/* Spire Ward Level */}
          <div className="bg-surface-container rounded-control p-2 flex items-center gap-2 shadow-card border border-outline-variant">
            <div className="w-8 h-8 rounded-control bg-gradient-to-b from-emerald-400 to-emerald-700 flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_2px_6px_rgba(16,185,129,0.5)] border border-emerald-200/40">
              <span className="material-symbols-outlined text-[#022c1b] text-[20px] fill-1">
                shield
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-sky-200/70 uppercase truncate">
                Defenses
              </span>
              <span className="font-headline-sm text-body-md text-emerald-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] truncate font-extrabold">
                T-2 Spire
              </span>
            </div>
          </div>
        </div>

        {/* Active Target Mission HUD Tile */}
        <div className="bg-gradient-to-b from-surface-container-high via-surface-container to-surface-container-low rounded-control p-3 shadow-card-raised border-t border-secondary/40 border-b-2 border-black/60 flex items-center justify-between gap-3 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-control bg-navy-hi flex items-center justify-center flex-shrink-0 shadow-inset-well border border-secondary/30">
              <span className="material-symbols-outlined text-cyan-300 text-[24px] drop-shadow-[0_0_6px_rgba(0,229,255,0.7)] fill-1">
                swords
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${focusSession.isActive ? 'bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse' : 'bg-cyan-400'}`} />
                <span className="font-label-sm text-label-sm text-emerald-300 uppercase tracking-wider font-extrabold">
                  {focusSession.isActive ? 'Crucible Mission In Progress' : 'Designated Target Bounty'}
                </span>
              </div>
              <span className="font-headline-sm text-headline-sm text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] truncate font-bold">
                {focusSession.isActive
                  ? focusSession.selectedQuestTitle || 'Deep Work: Strategy Sprint'
                  : activeQuest ? activeQuest.title : 'Deep Work: Strategy Sprint'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (focusSession.isActive) {
                setActiveTab('quests');
              } else {
                const uncompleted = quests.filter(q => !q.isCompleted);
                if (uncompleted.length > 0) {
                  const currentIdx = uncompleted.findIndex(q => q.id === (selectedQuestId || activeQuest?.id));
                  const nextIdx = (currentIdx + 1) % uncompleted.length;
                  setSelectedQuestId(uncompleted[nextIdx].id);
                }
              }
            }}
            className="flex-shrink-0 w-9 h-9 rounded-control bg-surface-container-high hover:bg-surface-bright border border-secondary/25 flex items-center justify-center text-sky-200 hover:text-white shadow-card active:scale-95 transition-all"
            title={focusSession.isActive ? "View All Quests" : "Cycle Target Bounty"}
          >
            <span className="material-symbols-outlined text-[20px]">
              {focusSession.isActive ? 'edit_note' : 'sync'}
            </span>
          </button>
        </div>
      </div>

      {/* Central Holographic Timer Ring */}
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
              strokeDashoffset={focusSession.isActive ? strokeDashoffset : 0}
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
          <div className="w-56 h-56 rounded-full bg-gradient-to-b from-surface-container-low via-[#09152e] to-surface-container-lowest flex flex-col items-center justify-center shadow-[inset_0_4px_16px_rgba(0,0,0,0.8),0_10px_24px_rgba(0,0,0,0.6)] border-2 border-sky-400/40 p-4 relative overflow-hidden text-center">
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
                <span className="font-label-sm text-label-sm text-cyan-300 uppercase tracking-wider font-extrabold drop-shadow">
                  {focusSession.isActive
                    ? focusSession.isPaused ? 'Focus Paused' : 'Mana Spire Resonating'
                    : 'Chamber Ready'}
                </span>
              </div>

              {/* Digital Clock Readout */}
              <span className="font-headline-xl text-[38px] font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,210,255,0.6)] font-mono">
                {focusSession.isActive
                  ? formatTime(focusSession.remainingSeconds)
                  : `${selectedDuration}:00`}
              </span>
              <span className="font-body-sm text-body-sm text-sky-200/80 mb-2 font-semibold">
                {focusSession.isActive
                  ? `Session Target ${Math.round(targetSecs / 60)}:00`
                  : `Target: ${selectedDuration} Minutes`}
              </span>

              {/* Real-Time Harvest Badges */}
              <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500/20 via-surface-container to-amber-500/20 border border-amber-400/40 px-2.5 py-1 rounded-full shadow-inset-well">
                <span className="material-symbols-outlined text-amber-300 text-[14px]">
                  auto_awesome
                </span>
                <span className="font-label-sm text-label-sm text-amber-300 font-extrabold tracking-wide">
                  +{focusSession.isActive ? focusSession.accumulatedXp : estimatedYield.xp} XP Potential
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Ward Status Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 w-full">
          <div className="flex items-center gap-1.5 bg-gradient-to-b from-emerald-950/90 to-emerald-950/60 border border-emerald-400/50 px-3 py-1 rounded-full shadow-[0_2px_8px_rgba(5,150,105,0.3)]">
            <span className="material-symbols-outlined text-emerald-300 text-[15px]">security</span>
            <span className="font-label-sm text-label-md text-emerald-200 font-bold tracking-wide">
              Distraction Ward: Active
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-gradient-to-b from-rose-950/90 to-rose-950/60 border border-rose-400/50 px-3 py-1 rounded-full shadow-[0_2px_8px_rgba(225,29,72,0.3)]">
            <span className="material-symbols-outlined text-rose-300 text-[15px]">notifications_off</span>
            <span className="font-label-sm text-label-md text-rose-200 font-bold tracking-wide">
              Shield: Notifications Silenced
            </span>
          </div>
        </div>
      </div>

      {/* Preset Duration Selector if Not Active */}
      {!focusSession.isActive && (
        <div className="px-4 my-3 flex flex-col gap-2">
          <span className="font-label-sm text-label-sm text-sky-200/70 uppercase font-bold tracking-wider">
            Select Focus Crucible Duration
          </span>
          <div className="grid grid-cols-5 gap-1.5">
            {presets.map(p => (
              <button
                key={p.mins}
                onClick={() => setSelectedDuration(p.mins)}
                className={`py-2 px-1 rounded-control font-headline-sm text-center flex flex-col items-center justify-center transition-all ${
                  selectedDuration === p.mins
                    ? 'bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 font-black shadow-[0_0_12px_rgba(245,158,11,0.5)] border border-amber-200'
                    : 'bg-surface-container hover:bg-surface-bright text-sky-200 border border-outline-variant'
                }`}
              >
                <span className="text-body-md font-extrabold">{p.label}</span>
                <span className="text-[10px] opacity-80 truncate">{p.mins}m</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Audio Atmosphere / Soundscape Control Card */}
      <div className="px-4 mt-2 mb-1 relative">
        <div className="bg-gradient-to-b from-surface-container-high via-surface-container to-surface-container-low rounded-control p-3 shadow-card-raised border-t border-secondary/30 border-b-2 border-black/60 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-control bg-navy-hi flex items-center justify-center flex-shrink-0 text-cyan-300 border border-secondary/30 shadow-inset-well">
              <span className="material-symbols-outlined text-[22px] fill-1">headphones</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-sky-200/70 uppercase font-bold tracking-wider">
                Soundscape Frequency
              </span>
              <span className="font-headline-sm text-headline-sm text-white truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-bold">
                {getSoundscapeName()}
              </span>
            </div>
          </div>

          <button
            onClick={() => setSoundscapeMenuOpen(!soundscapeMenuOpen)}
            className="w-9 h-9 rounded-control bg-surface-container-high hover:bg-surface-bright border border-secondary/30 flex items-center justify-center text-cyan-300 hover:text-white transition-all flex-shrink-0 shadow-card active:scale-95"
            title="Configure Soundscape"
          >
            <span className="material-symbols-outlined text-[22px]">graphic_eq</span>
          </button>
        </div>

        {/* Soundscape Selector Dropdown Menu */}
        {soundscapeMenuOpen && (
          <div className="absolute left-4 right-4 top-full mt-2 z-30 bg-surface-container-lowest border border-secondary/40 rounded-control p-2 shadow-card-raised backdrop-blur-xl flex flex-col gap-1 animate-fadeIn">
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
                className={`text-left px-3 py-2 rounded-control font-label-md text-label-lg flex items-center justify-between transition-colors ${
                  focusSession.soundscapeTrack === opt.id
                    ? 'bg-navy-hi text-amber-300 font-bold border border-amber-400/30'
                    : 'text-on-surface-variant hover:text-white hover:bg-surface-container'
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
        {focusSession.isActive ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              {/* Pause / Resume Button */}
              <button
                onClick={focusSession.isPaused ? resumeFocusSession : pauseFocusSession}
                className={`btn h-12 font-headline-sm text-headline-sm uppercase tracking-wider font-black ${
                  focusSession.isPaused
                    ? 'btn-emerald'
                    : 'btn-navy'
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
                className="btn btn-ruby h-12 font-headline-sm text-headline-sm uppercase tracking-wider font-black"
              >
                <span className="material-symbols-outlined text-[20px] text-rose-200">flag</span>
                <span>Yield Run</span>
              </button>
            </div>

            {/* Overcharge Mana Action Button */}
            <button
              onClick={toggleManaOvercharge}
              className={`btn h-12 w-full font-headline-md text-headline-md uppercase tracking-wide font-black ${
                focusSession.isOvercharged
                  ? 'btn-cyan animate-pulse'
                  : 'btn-gold'
              }`}
            >
              <span className="material-symbols-outlined text-[24px] fill-1">electric_bolt</span>
              <span className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">
                {focusSession.isOvercharged
                  ? 'Mana Overcharged! (+50% Burst Active)'
                  : 'Overcharge Mana (+50% Burst)'}
              </span>
            </button>

            {/* Complete Session Early Action */}
            <button
              onClick={completeFocusSession}
              className="w-full mt-1 py-2 rounded-control bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-label-sm text-label-sm uppercase font-bold hover:bg-emerald-900/70 hover:border-emerald-400/60 transition-colors flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Claim Victorious Early Completion</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => startFocusSession(selectedDuration, activeQuest?.id, activeQuest?.title)}
            className="btn btn-gold h-14 w-full font-headline-md text-headline-md uppercase tracking-wide font-black shadow-[0_4px_20px_rgba(245,158,11,0.5)]"
          >
            <span className="material-symbols-outlined text-[28px] fill-1">play_arrow</span>
            <span>Ignite Focus Crucible ({selectedDuration}m)</span>
          </button>
        )}
      </div>

      {/* Motivational Progression Footer Card */}
      <div className="px-4 mt-2 mb-3">
        <div className="bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-low rounded-control p-3 shadow-card-raised border-t border-secondary/30 border-b-2 border-black/60 flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-control bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_4px_12px_rgba(217,119,6,0.6)] border border-amber-200/60">
            <span className="material-symbols-outlined text-[#451a03] text-[26px] fill-1">
              package_2
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-label-sm text-amber-300 uppercase tracking-wider font-extrabold">
              Victorious Completion Reward
            </span>
            <p className="font-body-sm text-body-sm text-sky-100 leading-tight mt-0.5 font-medium">
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