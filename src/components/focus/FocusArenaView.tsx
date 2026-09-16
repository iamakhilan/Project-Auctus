import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { soundEngine } from '../../utils/audioSynthesizer';

export const FocusArenaView: React.FC = () => {
  const {
    focusSession,
    startFocusSession,
    pauseFocusSession,
    resumeFocusSession,
    cancelFocusSession,
    completeFocusSession,
    toggleManaOvercharge,
    setSoundscapeTrack,
    quests,
  } = useGameState();

  const [selectedDuration, setSelectedDuration] = useState(25);
  const [selectedQuestId, setSelectedQuestId] = useState<string>('');

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = focusSession.isActive && focusSession.targetDurationSeconds > 0
    ? Math.min(100, Math.round(((focusSession.targetDurationSeconds - focusSession.remainingSeconds) / focusSession.targetDurationSeconds) * 100))
    : 0;

  // Boss HP is inverse of progress (100% down to 0%)
  const bossHpPercent = Math.max(0, 100 - progressPercent);

  const handleStart = () => {
    soundEngine.playClick();
    const linkedQuest = quests.find((q) => q.id === selectedQuestId);
    startFocusSession(selectedDuration, selectedQuestId || undefined, linkedQuest ? linkedQuest.title : undefined);
  };

  const handleSoundscapeChange = (track: typeof focusSession.soundscapeTrack) => {
    soundEngine.playClick();
    setSoundscapeTrack(track);
  };

  const pendingQuests = quests.filter((q) => !q.isCompleted);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-fadeIn select-none">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff5ea] border border-[#ffd6a5] text-[var(--orange)] font-black text-xs uppercase tracking-wider mb-1">
          <span>⚔️ Combat Sector</span>
          <span>•</span>
          <span>Deep Work Battle Engine</span>
        </div>
        <h1 className="font-['Feather_Bold'] text-3xl sm:text-4xl text-[var(--dark-blue)] tracking-wide">
          FOCUS ARENA
        </h1>
        <p className="text-sm font-bold text-[var(--gray-light)] max-w-lg mx-auto">
          Channel uninterrupted attention into boss-slaying power. Slay the Procrastination Behemoth!
        </p>
      </div>

      {/* Boss Encounter HUD */}
      <div
        className={`rounded-3xl p-5 sm:p-6 border-4 transition-all shadow-md relative overflow-hidden ${
          focusSession.isOvercharged
            ? 'bg-gradient-to-r from-[#2a0845] to-[#6441a5] border-[var(--orange)] text-white shadow-[0_0_25px_rgba(255,150,0,0.3)]'
            : 'bg-[#100f3e] border-[#2c2b64] text-white'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-3xl shadow-inner animate-pulse">
              👾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Feather_Bold'] text-lg sm:text-xl text-white">
                  Chronos: The Distraction Fiend
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[var(--red)] text-white">
                  BOSS LVL 4
                </span>
              </div>
              <p className="text-xs text-white/80 font-semibold mt-0.5">
                {focusSession.isActive
                  ? focusSession.isPaused
                    ? '⚠️ Distraction shield recovering! Resume combat!'
                    : '⚡ Siphoning distraction energy with deep work...'
                  : 'Boss stands undefeated. Initiate focus sprint to attack!'}
              </p>
            </div>
          </div>

          {/* Boss HP Gauge */}
          <div className="w-full sm:w-56 bg-black/40 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-xs font-black mb-1">
              <span className="text-[var(--red)] uppercase tracking-wider">BOSS HP</span>
              <span className="text-white">{bossHpPercent}%</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--red)] to-[#ff7875] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${bossHpPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Battle Timer Card */}
      <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-6 sm:p-8 shadow-xs flex flex-col items-center">
        
        {/* Circular SVG Timer */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 240 240">
            {/* Background Track */}
            <circle
              cx="120"
              cy="120"
              r="100"
              stroke="#e5e5e5"
              strokeWidth="16"
              fill="transparent"
            />
            {/* Progress Track */}
            <circle
              cx="120"
              cy="120"
              r="100"
              stroke={focusSession.isOvercharged ? '#ff9600' : '#1cb0f6'}
              strokeWidth="16"
              strokeDasharray={2 * Math.PI * 100}
              strokeDashoffset={2 * Math.PI * 100 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Center Digital Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none" role="timer" aria-live="polite" aria-atomic="true" aria-label={focusSession.isActive ? `Time remaining ${formatTime(focusSession.remainingSeconds)}` : `Ready to start ${selectedDuration} minute session`}>
            <span className="text-xs font-black uppercase text-[var(--gray-light)] tracking-widest mb-1">
              {focusSession.isActive
                ? focusSession.isPaused
                  ? 'PAUSED'
                  : 'FOCUSING'
                : 'READY'}
            </span>
            <div className="font-['Feather_Bold'] text-5xl sm:text-6xl text-[var(--dark-blue)] tracking-tight">
              {focusSession.isActive ? formatTime(focusSession.remainingSeconds) : `${selectedDuration}:00`}
            </div>

            {focusSession.selectedQuestTitle && (
              <div className="text-[11px] font-bold text-[var(--blue)] max-w-[180px] truncate mt-1 bg-[#eef8ff] px-2 py-0.5 rounded-md">
                🎯 {focusSession.selectedQuestTitle}
              </div>
            )}
          </div>
        </div>

        {/* Configuration Controls (When not active) */}
        {!focusSession.isActive ? (
          <div className="w-full space-y-5 max-w-md">
            
            {/* Duration presets */}
            <div>
              <label className="block text-xs font-black uppercase text-[var(--gray-light)] text-center mb-2">
                Select Battle Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { m: 15, label: '15m Blitz' },
                  { m: 25, label: '25m Pomodoro' },
                  { m: 45, label: '45m Deep' },
                  { m: 60, label: '60m Flow' },
                ].map((preset) => (
                  <button
              type="button"
                    key={preset.m}
                    aria-pressed={selectedDuration === preset.m}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedDuration(preset.m);
                    }}
                    className={`py-2 px-1 rounded-2xl border-2 font-['Feather_Bold'] text-xs font-black transition-all cursor-pointer ${
                      selectedDuration === preset.m
                        ? 'border-[var(--blue)] bg-[#eef8ff] text-[var(--blue)] scale-105 shadow-xs'
                        : 'border-[#e5e5e5] bg-white text-[var(--gray-text)] hover:bg-[#fafafa]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Link Quest Option */}
            {pendingQuests.length > 0 && (
              <div>
                <label className="block text-xs font-black uppercase text-[var(--gray-light)] text-center mb-1.5">
                  Link Mission Objective (Optional)
                </label>
                <select
                  value={selectedQuestId}
                  onChange={(e) => setSelectedQuestId(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl border-2 border-[#e5e5e5] focus:border-[var(--blue)] text-xs font-bold text-[var(--dark-blue)] bg-white cursor-pointer"
                >
                  <option value="">No linked mission (Pure Deep Work)</option>
                  {pendingQuests.map((q) => (
                    <option key={q.id} value={q.id}>
                      [{q.tag}] {q.title} (+{q.xpReward} XP)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Mana Overcharge Toggle */}
            <div
              onClick={toggleManaOvercharge}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                focusSession.isOvercharged
                  ? 'bg-[#fff5ea] border-[var(--orange)] shadow-xs'
                  : 'bg-[#fafafa] border-[#e5e5e5] hover:border-[#ffd6a5]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl animate-pulse">⚡</span>
                <div>
                  <div className="font-['Feather_Bold'] text-sm text-[var(--dark-blue)]">
                    Mana Overcharge
                  </div>
                  <div className="text-[11px] font-bold text-[var(--orange)]">
                    +50% XP & Gold yield bonus!
                  </div>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center font-black text-xs ${
                  focusSession.isOvercharged
                    ? 'bg-[var(--orange)] border-[#c77700] text-white'
                    : 'bg-white border-[#d9d9d9]'
                }`}
              >
                {focusSession.isOvercharged ? '✓' : ''}
              </div>
            </div>

            {/* Start Button */}
            <button
              type="button"
              onClick={handleStart}
              className="w-full h-14 bg-[var(--green)] hover:bg-[var(--green-hover)] text-white font-['Feather_Bold'] text-lg font-black tracking-wider uppercase rounded-2xl border-b-6 border-[var(--green-shadow)] active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              <span>ENGAGE BATTLE ⚔️</span>
            </button>
          </div>
        ) : (
          /* Active Combat Controls */
          <div className="w-full max-w-md space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {focusSession.isPaused ? (
                <button
              type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    resumeFocusSession();
                  }}
                  className="h-12 bg-[var(--green)] hover:bg-[var(--green-hover)] text-white font-['Feather_Bold'] text-sm font-black uppercase rounded-2xl border-b-4 border-[var(--green-shadow)] active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-md"
                >
                  ▶️ RESUME
                </button>
              ) : (
                <button
              type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    pauseFocusSession();
                  }}
                  className="h-12 bg-[#fffbe6] hover:bg-[#fff1b8] text-[#d48806] font-['Feather_Bold'] text-sm font-black uppercase rounded-2xl border-2 border-[#ffe58f] active:translate-y-1 transition-all cursor-pointer"
                >
                  ⏸️ PAUSE
                </button>
              )}

              <button
              type="button"
                onClick={() => {
                  soundEngine.playClick();
                  completeFocusSession();
                }}
                className="h-12 bg-[var(--blue)] hover:bg-[#0095de] text-white font-['Feather_Bold'] text-sm font-black uppercase rounded-2xl border-b-4 border-[#0b80ba] active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-md"
              >
                👑 CLAIM VICTORY
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                cancelFocusSession();
              }}
              className="w-full py-2 text-xs font-black uppercase text-[var(--red)] hover:bg-[#ffeef0] rounded-xl transition-colors cursor-pointer"
            >
              🛑 RETREAT / CANCEL SESSION
            </button>
          </div>
        )}

      </div>

      {/* Soundscape Audio Synthesizer Controls */}
      <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-[#f0f0f0]">
          <div>
            <h3 className="font-['Feather_Bold'] text-base sm:text-lg text-[var(--dark-blue)] flex items-center gap-2">
              <span>🎧</span> PROCEDURAL SOUNDSCAPES
            </h3>
            <p className="text-xs font-bold text-[var(--gray-light)]">
              Synthesized live with Web Audio API for cognitive focus.
            </p>
          </div>
          <span className="text-xs font-black uppercase px-2 py-0.5 rounded-full bg-[#eef8ff] text-[var(--blue)]">
            Zero Latency
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[
            { id: 'cyber-rain', label: '🌧️ Cyber Rain' },
            { id: 'binaural', label: '🧘 432Hz Alpha' },
            { id: 'forest', label: '🌲 Forest Glow' },
            { id: 'white-noise', label: '📻 White Noise' },
            { id: 'none', label: '🔇 Off' },
          ].map((track) => {
            const isPlaying = focusSession.soundscapeTrack === track.id;
            return (
              <button
              type="button"
                key={track.id}
                aria-pressed={isPlaying}
                onClick={() => handleSoundscapeChange(track.id as typeof focusSession.soundscapeTrack)}
                className={`py-3 px-2 rounded-2xl border-2 font-['Feather_Bold'] text-xs font-extrabold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  isPlaying
                    ? 'border-[var(--blue)] bg-[#eef8ff] text-[var(--blue)] shadow-xs scale-105'
                    : 'border-[#e5e5e5] bg-white text-[var(--gray-text)] hover:bg-[#fafafa]'
                }`}
              >
                <span>{track.label}</span>
                {isPlaying && (
                  <span className="text-[9px] font-black uppercase text-[var(--blue)] animate-pulse">
                    PLAYING
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};