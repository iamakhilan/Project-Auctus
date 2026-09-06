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

  // Circumference of radius 96 circle = 2 * PI * 96 = 603.18
  const circumference = 603.18;
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
    { label: '15m', mins: 15 },
    { label: '25m', mins: 25 },
    { label: '45m', mins: 45 },
    { label: '60m', mins: 60 },
    { label: '90m', mins: 90 },
  ];

  const estimatedYield = calculateFocusYield(selectedDuration, false);

  return (
    <div className="flex flex-col w-full max-w-screen mx-auto px-3.5 sm:px-4 pt-3 pb-8 space-y-4">
      {/* 1. DESIGNATED TARGET BOUNTY HUD */}
      <section className="rounded-2xl bg-surface-container border border-outline-variant/60 p-3.5 shadow-card flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-navy-hi border border-cyan-400/40 flex items-center justify-center text-cyan-300 flex-shrink-0">
            <span className="material-symbols-outlined text-[22px] fill-1">swords</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${focusSession.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                {focusSession.isActive ? 'Crucible In Progress' : 'Designated Target Bounty'}
              </span>
            </div>
            <h2 className="font-headline-sm text-sm text-white truncate font-bold mt-0.5">
              {focusSession.isActive
                ? focusSession.selectedQuestTitle || 'Deep Work: Strategy Sprint'
                : activeQuest ? activeQuest.title : 'Deep Work: Strategy Sprint'}
            </h2>
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
          className="w-9 h-9 rounded-xl bg-surface-dim hover:bg-surface-container-high border border-outline-variant/60 flex items-center justify-center text-sky-200 hover:text-white flex-shrink-0 active:scale-95 transition-all"
          title={focusSession.isActive ? 'View All Quests' : 'Cycle Target Bounty'}
        >
          <span className="material-symbols-outlined text-[18px]">
            {focusSession.isActive ? 'edit_note' : 'sync'}
          </span>
        </button>
      </section>

      {/* 2. STAT TRIAD STRIP */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-surface-container border border-outline-variant/50 p-2 text-center flex flex-col items-center">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Yield Boost</span>
          <span className="font-headline-sm text-xs text-cyan-300 font-black mt-0.5">
            {focusSession.isOvercharged ? '2.0x Active' : '1.5x Multi'}
          </span>
        </div>
        <div className="rounded-xl bg-surface-container border border-outline-variant/50 p-2 text-center flex flex-col items-center">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Potential XP</span>
          <span className="font-headline-sm text-xs text-amber-300 font-black mt-0.5">
            +{focusSession.isActive ? focusSession.accumulatedXp : estimatedYield.xp} XP
          </span>
        </div>
        <div className="rounded-xl bg-surface-container border border-outline-variant/50 p-2 text-center flex flex-col items-center">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Spire Shield</span>
          <span className="font-headline-sm text-xs text-emerald-400 font-black mt-0.5">
            T-2 Protected
          </span>
        </div>
      </div>

      {/* 3. CENTRAL COUNTDOWN CRUCIBLE RING */}
      <section className="relative flex flex-col items-center justify-center py-4">
        {/* Ambient Ring Glow */}
        <div className="absolute w-60 h-60 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 filter drop-shadow-[0_0_12px_rgba(0,210,255,0.35)]"
            viewBox="0 0 220 220"
          >
            <defs>
              <linearGradient id="focusCyanGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#00e5ff" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>

            {/* Inset Background Track */}
            <circle
              cx="110"
              cy="110"
              fill="none"
              r="96"
              stroke="#0c1a33"
              strokeWidth="12"
            />

            {/* Dynamic Countdown Fill Arc */}
            <circle
              cx="110"
              cy="110"
              fill="none"
              r="96"
              stroke="url(#focusCyanGradient)"
              strokeDasharray={circumference}
              strokeDashoffset={focusSession.isActive ? strokeDashoffset : 0}
              strokeLinecap="round"
              strokeWidth="12"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Inner Display Pod */}
          <div className="w-48 h-48 rounded-full bg-gradient-to-b from-surface-container to-surface-dim flex flex-col items-center justify-center border border-sky-400/30 p-3 text-center shadow-inner">
            <span className="text-[10px] text-cyan-300 font-extrabold uppercase tracking-wider mb-0.5">
              {focusSession.isActive
                ? focusSession.isPaused ? 'Focus Paused' : 'Mana Spire Active'
                : 'Chamber Ready'}
            </span>

            {/* Digital Clock */}
            <span className="font-headline-xl text-4xl font-black text-white tracking-tight font-mono tabular-nums drop-shadow-sm">
              {focusSession.isActive
                ? formatTime(focusSession.remainingSeconds)
                : `${selectedDuration}:00`}
            </span>

            <span className="text-xs text-on-surface-variant font-medium mt-0.5">
              {focusSession.isActive
                ? `Target ${Math.round(targetSecs / 60)}m`
                : `Target: ${selectedDuration} Minutes`}
            </span>
          </div>
        </div>
      </section>

      {/* 4. PRESET DURATION SELECTOR (WHEN IDLE) */}
      {!focusSession.isActive && (
        <section className="flex flex-col gap-1.5">
          <span className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
            Duration Preset
          </span>
          <div className="grid grid-cols-5 gap-1.5">
            {presets.map(p => (
              <button
                key={p.mins}
                onClick={() => setSelectedDuration(p.mins)}
                className={`py-2 rounded-xl text-center font-headline-sm transition-all ${
                  selectedDuration === p.mins
                    ? 'bg-amber-400 text-amber-950 font-black shadow-card border border-yellow-200'
                    : 'bg-surface-container border border-outline-variant/60 text-sky-200 hover:text-white'
                }`}
              >
                <span className="text-xs font-black">{p.label}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 5. SOUNDSCAPE FREQUENCY STRIP */}
      <section className="relative">
        <div className="rounded-xl bg-surface-container border border-outline-variant/60 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-navy-hi border border-cyan-400/30 flex items-center justify-center text-cyan-300 flex-shrink-0">
              <span className="material-symbols-outlined text-[18px] fill-1">headphones</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
                Soundscape Frequency
              </span>
              <span className="font-headline-sm text-xs text-white truncate font-bold">
                {getSoundscapeName()}
              </span>
            </div>
          </div>

          <button
            onClick={() => setSoundscapeMenuOpen(!soundscapeMenuOpen)}
            className="w-8 h-8 rounded-lg bg-surface-dim hover:bg-surface-container-high border border-outline-variant/60 flex items-center justify-center text-cyan-300 hover:text-white transition-all flex-shrink-0 active:scale-95"
            title="Configure Soundscape"
          >
            <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
          </button>
        </div>

        {soundscapeMenuOpen && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-surface-container border border-cyan-400/40 rounded-2xl p-2 shadow-crown backdrop-blur-xl flex flex-col gap-1 animate-fadeIn">
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
                className={`text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  focusSession.soundscapeTrack === opt.id
                    ? 'bg-navy-hi text-amber-300 font-bold border border-amber-400/40'
                    : 'text-on-surface-variant hover:text-white hover:bg-surface-dim'
                }`}
              >
                <span>{opt.label}</span>
                {focusSession.soundscapeTrack === opt.id && (
                  <span className="material-symbols-outlined text-[15px] text-amber-400">check</span>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 6. PRIMARY TACTICAL CONTROLS */}
      <section className="flex flex-col gap-2 pt-1">
        {focusSession.isActive ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={focusSession.isPaused ? resumeFocusSession : pauseFocusSession}
                className={`h-12 btn font-headline-sm text-xs uppercase tracking-wider font-black ${
                  focusSession.isPaused ? 'btn-emerald' : 'btn-navy'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {focusSession.isPaused ? 'play_circle' : 'pause_circle'}
                </span>
                <span>{focusSession.isPaused ? 'Resume Focus' : 'Pause Focus'}</span>
              </button>

              <button
                onClick={cancelFocusSession}
                className="btn btn-ruby h-12 font-headline-sm text-xs uppercase tracking-wider font-black"
              >
                <span className="material-symbols-outlined text-[18px]">flag</span>
                <span>Yield Run</span>
              </button>
            </div>

            <button
              onClick={toggleManaOvercharge}
              className={`btn h-12 w-full font-headline-sm text-xs uppercase tracking-wide font-black ${
                focusSession.isOvercharged
                  ? 'btn-cyan animate-pulse'
                  : 'btn-gold'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] fill-1">electric_bolt</span>
              <span>
                {focusSession.isOvercharged
                  ? 'Mana Overcharged! (+50% Burst Active)'
                  : 'Overcharge Mana (+50% Burst)'}
              </span>
            </button>

            <button
              onClick={completeFocusSession}
              className="w-full py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-900/70 transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Claim Victorious Early Completion</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => startFocusSession(selectedDuration, activeQuest?.id, activeQuest?.title)}
            className="btn btn-gold h-14 w-full font-headline-sm text-sm uppercase tracking-wider font-black shadow-md"
          >
            <span className="material-symbols-outlined text-[24px] fill-1">play_arrow</span>
            <span>Ignite Focus Crucible ({selectedDuration}m)</span>
          </button>
        )}
      </section>
    </div>
  );
};