import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { calculateFocusYield } from '../../domain/focus';
import { SwordsIcon, ShieldIcon } from '../common/GameIcons';

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

  // Boss HP remaining percentage (inverts as focus progress increases)
  const bossHpPercent = Math.max(0, Math.round((1 - progressRatio) * 100));

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
    <div className="flex flex-col w-full max-w-screen mx-auto px-3 sm:px-4 pt-3 pb-8 space-y-4">
      {/* 1. BOSS COMBAT & TARGET HUD */}
      <section className="rounded-3xl bg-game-card border-2 border-game-border p-4 shadow-game-card flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-red/20 border-2 border-red/60 flex items-center justify-center text-red-light flex-shrink-0 shadow-sm">
              <SwordsIcon size={24} className="text-red-400" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${focusSession.isActive ? 'bg-red-500 animate-ping' : 'bg-game-dim'}`} />
                <span className="font-game text-[10px] font-black uppercase tracking-wider text-red-400">
                  {focusSession.isActive ? 'STAGE 3: BOSS WAVE' : 'TARGET BOUNTY'}
                </span>
              </div>
              <h2 className="font-game text-sm sm:text-base text-game-text truncate font-black mt-0.5 uppercase tracking-tight">
                {focusSession.isActive
                  ? focusSession.selectedQuestTitle || 'Procrastination Titan'
                  : activeQuest ? activeQuest.title : 'Deep Focus Combat'}
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
            className="w-9 h-9 rounded-xl bg-game-darkest hover:bg-game-cardHi border border-game-border flex items-center justify-center text-game-muted hover:text-game-text flex-shrink-0 active:scale-95 transition-all cursor-pointer"
            title={focusSession.isActive ? 'View Missions' : 'Cycle Target'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {focusSession.isActive ? 'military_tech' : 'sync'}
            </span>
          </button>
        </div>

        {/* Boss HP Bar */}
        <div className="flex flex-col gap-1 bg-game-darkest p-2.5 rounded-2xl border border-game-border shadow-inner">
          <div className="flex items-center justify-between text-[10px] font-game font-black">
            <span className="text-red-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">skull</span>
              BOSS HP
            </span>
            <span className="text-game-muted">{focusSession.isActive ? `${bossHpPercent}%` : '100%'}</span>
          </div>
          <div className="w-full bg-game-card h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-red-500 to-amber-400 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${focusSession.isActive ? bossHpPercent : 100}%` }}
            />
          </div>
        </div>
      </section>

      {/* 2. STAT TRIAD STRIP */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-game-card border-2 border-game-border p-2.5 text-center flex flex-col items-center shadow-game-card">
          <span className="font-game text-[10px] text-game-muted font-black uppercase tracking-wider">Multiplier</span>
          <span className="font-game text-xs text-amber-300 font-black mt-0.5">
            {focusSession.isOvercharged ? '2.0x Active' : '1.5x Multi'}
          </span>
        </div>
        <div className="rounded-2xl bg-game-card border-2 border-game-border p-2.5 text-center flex flex-col items-center shadow-game-card">
          <span className="font-game text-[10px] text-game-muted font-black uppercase tracking-wider">Loot XP</span>
          <span className="font-game text-xs text-blue-light font-black mt-0.5">
            +{focusSession.isActive ? focusSession.accumulatedXp : estimatedYield.xp} XP
          </span>
        </div>
        <div className="rounded-2xl bg-game-card border-2 border-game-border p-2.5 text-center flex flex-col items-center shadow-game-card">
          <span className="font-game text-[10px] text-game-muted font-black uppercase tracking-wider">Shield</span>
          <span className="font-game text-xs text-green-light font-black mt-0.5 flex items-center gap-0.5">
            <ShieldIcon size={14} />
            LVL 2
          </span>
        </div>
      </div>

      {/* 3. CENTRAL COMBAT COUNTDOWN RING */}
      <section className="relative flex flex-col items-center justify-center py-2">
        {/* Ambient Glow */}
        <div className="absolute w-64 h-64 bg-blue/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 filter drop-shadow-[0_0_16px_rgba(59,130,246,0.45)]"
            viewBox="0 0 220 220"
          >
            <defs>
              <linearGradient id="focusCombatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>

            {/* Background Track */}
            <circle
              cx="110"
              cy="110"
              fill="none"
              r="96"
              stroke="#070a12"
              strokeWidth="14"
            />

            {/* Dynamic Arc */}
            <circle
              cx="110"
              cy="110"
              fill="none"
              r="96"
              stroke="url(#focusCombatGrad)"
              strokeDasharray={circumference}
              strokeDashoffset={focusSession.isActive ? strokeDashoffset : 0}
              strokeLinecap="round"
              strokeWidth="14"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Inner Combat Dial */}
          <div className="w-48 h-48 rounded-full bg-gradient-to-b from-game-card to-game-darkest flex flex-col items-center justify-center border-2 border-game-border p-3 text-center shadow-inner">
            <span className="font-game text-[10px] text-amber-300 font-black uppercase tracking-wider mb-0.5">
              {focusSession.isActive
                ? focusSession.isPaused ? 'Battle Paused' : 'Combat Wave Active'
                : 'Crucible Ready'}
            </span>

            {/* Digital Clock */}
            <span className="font-game text-4xl font-black text-white tracking-tight tabular-nums drop-shadow">
              {focusSession.isActive
                ? formatTime(focusSession.remainingSeconds)
                : `${selectedDuration}:00`}
            </span>

            <span className="font-body text-xs text-game-muted font-bold mt-0.5">
              {focusSession.isActive
                ? `Wave Target: ${Math.round(targetSecs / 60)}m`
                : `Target: ${selectedDuration} Minutes`}
            </span>
          </div>
        </div>
      </section>

      {/* 4. PRESET DURATION SELECTOR (WHEN IDLE) */}
      {!focusSession.isActive && (
        <section className="flex flex-col gap-1.5">
          <span className="font-game text-xs text-game-muted font-black uppercase tracking-wider">
            Duration Presets
          </span>
          <div className="grid grid-cols-5 gap-1.5">
            {presets.map(p => (
              <button
                key={p.mins}
                onClick={() => setSelectedDuration(p.mins)}
                className={`py-2.5 rounded-2xl text-center font-game transition-all cursor-pointer ${
                  selectedDuration === p.mins
                    ? 'bg-blue text-white font-black shadow-game-btn-blue border border-blue-light'
                    : 'bg-game-card border border-game-border text-game-muted hover:text-game-text'
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
        <div className="rounded-2xl bg-game-card border-2 border-game-border p-3 flex items-center justify-between shadow-game-card">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue/20 border border-blue flex items-center justify-center text-blue-light flex-shrink-0">
              <span className="material-symbols-outlined text-[18px] fill-1">headphones</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-game text-[10px] text-game-muted uppercase font-black tracking-wider">
                Soundscape Frequency
              </span>
              <span className="font-game text-xs text-game-text truncate font-bold">
                {getSoundscapeName()}
              </span>
            </div>
          </div>

          <button
            onClick={() => setSoundscapeMenuOpen(!soundscapeMenuOpen)}
            className="w-8 h-8 rounded-xl bg-game-darkest hover:bg-game-cardHi border border-game-border flex items-center justify-center text-game-muted hover:text-game-text transition-all flex-shrink-0 active:scale-95 cursor-pointer"
            title="Configure Soundscape"
          >
            <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
          </button>
        </div>

        {soundscapeMenuOpen && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-game-card border-2 border-game-borderHi rounded-2xl p-2 shadow-game-card-raised backdrop-blur-xl flex flex-col gap-1 animate-scaleUp">
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
                className={`text-left px-3 py-2 rounded-xl text-xs font-game font-bold flex items-center justify-between transition-colors cursor-pointer ${
                  focusSession.soundscapeTrack === opt.id
                    ? 'bg-blue text-white shadow-sm'
                    : 'text-game-muted hover:text-game-text hover:bg-game-darkest'
                }`}
              >
                <span>{opt.label}</span>
                {focusSession.soundscapeTrack === opt.id && (
                  <span className="material-symbols-outlined text-[15px] text-white">check</span>
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
                className="h-12 btn-game btn-game-gold font-game text-xs uppercase tracking-wider font-black"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {focusSession.isPaused ? 'play_circle' : 'pause_circle'}
                </span>
                <span>{focusSession.isPaused ? 'Resume Battle' : 'Pause Battle'}</span>
              </button>

              <button
                onClick={cancelFocusSession}
                className="btn-game btn-game-red h-12 font-game text-xs uppercase tracking-wider font-black"
              >
                <span className="material-symbols-outlined text-[18px]">flag</span>
                <span>Surrender Wave</span>
              </button>
            </div>

            <button
              onClick={toggleManaOvercharge}
              className={`btn-game h-12 w-full font-game text-xs uppercase tracking-wide font-black ${
                focusSession.isOvercharged
                  ? 'btn-game-green animate-pulse'
                  : 'btn-game-blue'
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
              className="w-full py-2.5 rounded-2xl bg-game-darkest border border-green/40 text-green-light font-game text-xs font-black hover:bg-game-card transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Claim Victorious Early Completion</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => startFocusSession(selectedDuration, activeQuest?.id, activeQuest?.title)}
            className="btn-game btn-game-green h-14 w-full font-game text-sm uppercase tracking-wider font-black shadow-game-btn-green"
          >
            <span className="material-symbols-outlined text-[24px] fill-1">play_arrow</span>
            <span>Ignite Focus Battle ({selectedDuration}m)</span>
          </button>
        )}
      </section>
    </div>
  );
};