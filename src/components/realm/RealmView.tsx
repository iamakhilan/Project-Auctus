import React from 'react';
import { useGameState } from '../../context/GameStateContext';
import { calculateSpeedUpCost } from '../../domain/chests';
import { TrophyIcon, SwordsIcon, GemIcon } from '../common/GameIcons';

export const RealmView: React.FC = () => {
  const {
    profile,
    chests,
    unlockChest,
    speedUpChest,
    claimChestLoot,
    startFocusSession,
    setActiveTab,
    openCustomClaimModal,
  } = useGameState();

  const formatSeconds = (totalSec: number) => {
    if (totalSec <= 0) return '0m';
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const citadelPowerPercent = Math.min(100, Math.round((profile.citadelPower / profile.citadelMaxPower) * 100));

  return (
    <div className="flex flex-col w-full max-w-screen mx-auto px-3 sm:px-4 pt-3 pb-8 space-y-4">
      {/* 1. CENTRAL CITADEL SANCTUARY CHAMBER */}
      <section className="relative overflow-hidden rounded-3xl bg-game-card border-2 border-game-border shadow-game-card p-4 sm:p-5 flex flex-col items-center">
        {/* Ambient Top Glow */}
        <div className="absolute inset-0 bg-radial-gradient from-blue/15 via-transparent to-transparent pointer-events-none" />

        {/* Top Tier & Power Header Plate */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-game-border relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue/20 border border-blue flex items-center justify-center text-blue-light shadow-sm">
              <span className="material-symbols-outlined text-[20px] fill-1">castle</span>
            </div>
            <div>
              <span className="font-game text-[10px] text-amber-300 font-black uppercase tracking-wider block">
                Sanctuary Tier {profile.citadelTier}
              </span>
              <h2 className="font-game text-sm sm:text-base text-game-text font-black leading-tight uppercase tracking-tight">
                Citadel Fortress
              </h2>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-game text-[10px] text-game-muted font-bold uppercase tracking-wider">
              Citadel Power
            </span>
            <div className="flex items-center gap-1 font-game text-xs text-game-text font-black">
              <span className="text-amber-300">{profile.citadelPower}</span>
              <span className="text-game-dim text-[11px]">/{profile.citadelMaxPower}</span>
              <span className="material-symbols-outlined text-[15px] text-amber-400 fill-1">bolt</span>
            </div>
          </div>
        </div>

        {/* Power Progress Bar */}
        <div className="w-full h-2.5 bg-game-darkest rounded-full overflow-hidden my-3 border border-game-border p-0.5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue via-cyan to-green rounded-full shadow-green-glow transition-all duration-500"
            style={{ width: `${citadelPowerPercent}%` }}
          />
        </div>

        {/* 3D Floating Island Visual */}
        <div className="relative w-full h-44 sm:h-52 flex items-center justify-center my-1">
          <div className="absolute w-44 h-14 bg-blue/25 rounded-full blur-2xl translate-y-12 pointer-events-none" />
          <img
            src="/assets/island.png"
            alt="Citadel Island"
            className="w-40 h-40 sm:w-48 sm:h-48 object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.85)] animate-float"
          />
        </div>

        {/* Tactical Badges Row */}
        <div className="w-full grid grid-cols-2 gap-2 pt-3 border-t border-game-border relative z-10">
          <button
            onClick={() => setActiveTab('citadel')}
            className="flex items-center gap-2 p-2.5 rounded-2xl bg-game-darkest border border-game-border hover:border-gold text-left transition-all cursor-pointer active:scale-95"
          >
            <div className="w-8 h-8 rounded-xl bg-gold/20 text-amber-300 flex items-center justify-center flex-shrink-0 border border-gold/40 shadow-sm">
              <TrophyIcon size={18} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-game text-[10px] text-amber-300 font-extrabold uppercase leading-none">
                {profile.leagueRank}
              </span>
              <span className="font-game text-xs text-game-text font-bold truncate mt-0.5">
                {profile.trophyPoints.toLocaleString()} pts
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('citadel')}
            className="flex items-center gap-2 p-2.5 rounded-2xl bg-game-darkest border border-game-border hover:border-blue text-left transition-all cursor-pointer active:scale-95"
          >
            <div className="w-8 h-8 rounded-xl bg-blue/20 text-blue-light flex items-center justify-center flex-shrink-0 border border-blue/40 shadow-sm">
              <span className="material-symbols-outlined text-[18px] fill-1">military_tech</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-game text-[10px] text-blue-light font-extrabold uppercase leading-none">
                Next Ascension
              </span>
              <span className="font-game text-xs text-game-text font-bold truncate mt-0.5">
                {profile.citadelMaxPower.toLocaleString()} Power
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* 2. PRIMARY FOCUS CRUCIBLE CTA */}
      <section className="w-full">
        <button
          onClick={() => startFocusSession(25)}
          className="group relative w-full h-16 rounded-2xl btn-game btn-game-green shadow-game-card flex items-center justify-between px-4 sm:px-5 cursor-pointer"
          id="start-focus-btn"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-black/25 flex items-center justify-center text-white shadow-inner border border-white/20">
              <SwordsIcon size={24} className="group-hover:rotate-12 transition-transform" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-game text-sm sm:text-base text-white font-black tracking-wide uppercase leading-tight drop-shadow">
                START FOCUS BATTLE
              </span>
              <span className="font-body text-[11px] text-green-100 font-bold flex items-center gap-1">
                25 Min Deep Work • +120 XP, 15 Coins
              </span>
            </div>
          </div>

          <div className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center border border-white/30">
            <span className="material-symbols-outlined text-[22px] font-black">play_arrow</span>
          </div>
        </button>
      </section>

      {/* 3. MISSION LOOT DECK (4 TACTILE SLOTS) */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-amber-300 text-[20px] fill-1">
              inventory_2
            </span>
            <h3 className="font-game text-xs sm:text-sm text-game-text font-black uppercase tracking-tight">
              Mission Loot Deck
            </h3>
          </div>
          <span className="font-game text-[11px] text-game-muted font-bold">
            {chests.filter(c => c.status !== 'empty').length}/4 In Vault
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {chests.map(slot => {
            if (slot.status === 'unlocking') {
              const shardCost = calculateSpeedUpCost(slot.unlockTimeRemainingSeconds);
              return (
                <div
                  key={slot.id}
                  className="rounded-2xl bg-game-card border-2 border-blue p-2 flex flex-col items-center justify-between min-h-[132px] shadow-game-card relative overflow-hidden"
                >
                  <span className="text-[9px] font-game font-black text-white uppercase tracking-tight bg-blue px-1.5 py-0.2 rounded border border-blue-light shadow-sm">
                    UNLOCKING
                  </span>

                  <div className="w-10 h-10 my-1">
                    <img
                      src={slot.image || '/assets/chest_silver.png'}
                      alt={slot.name}
                      className="w-full h-full object-contain drop-shadow"
                    />
                  </div>

                  <div className="w-full flex flex-col items-center gap-1">
                    <span className="text-[10px] font-game font-bold text-game-text flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[10px]">schedule</span>
                      {formatSeconds(slot.unlockTimeRemainingSeconds)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speedUpChest(slot.slotIndex);
                      }}
                      className="w-full py-0.5 rounded-lg btn-game btn-game-blue text-[10px] font-game font-black flex items-center justify-center gap-0.5"
                    >
                      <GemIcon size={12} />
                      <span>{shardCost}</span>
                    </button>
                  </div>
                </div>
              );
            }

            if (slot.status === 'ready') {
              return (
                <button
                  key={slot.id}
                  onClick={() => claimChestLoot(slot.slotIndex)}
                  className="rounded-2xl bg-gradient-to-b from-gold-light/25 via-game-card to-game-card border-2 border-gold p-2 flex flex-col items-center justify-between min-h-[132px] shadow-gold-glow active:scale-95 transition-transform animate-pulse text-left cursor-pointer"
                >
                  <span className="text-[9px] font-game font-black text-game-darkest uppercase tracking-tight bg-gradient-to-r from-gold-light to-gold px-1.5 py-0.2 rounded shadow-sm border border-yellow-200">
                    READY!
                  </span>

                  <div className="w-10 h-10 my-1">
                    <img
                      src={slot.image || '/assets/chest_ready.png'}
                      alt={slot.name}
                      className="w-full h-full object-contain drop-shadow"
                    />
                  </div>

                  <span className="w-full text-center text-[10px] font-game font-black text-game-darkest bg-gradient-to-r from-gold-light to-gold py-0.5 rounded border border-yellow-200 uppercase">
                    CLAIM
                  </span>
                </button>
              );
            }

            if (slot.status === 'queued') {
              return (
                <button
                  key={slot.id}
                  onClick={() => unlockChest(slot.slotIndex)}
                  className="rounded-2xl bg-game-card border-2 border-game-border hover:border-game-borderHi p-2 flex flex-col items-center justify-between min-h-[132px] shadow-game-card active:scale-95 transition-all text-left cursor-pointer"
                >
                  <span className="text-[9px] font-game font-bold text-game-muted uppercase tracking-tight bg-game-darkest px-1.5 py-0.2 rounded border border-game-border">
                    UNLOCK
                  </span>

                  <div className="w-10 h-10 my-1">
                    <img
                      src={slot.image || '/assets/chest_gold.png'}
                      alt={slot.name}
                      className="w-full h-full object-contain drop-shadow"
                    />
                  </div>

                  <div className="w-full text-center">
                    <span className="text-[10px] text-game-muted font-game font-bold block truncate">
                      {slot.name}
                    </span>
                    <span className="text-[10px] text-blue-light font-game font-extrabold">
                      {formatSeconds(slot.totalUnlockSeconds)}
                    </span>
                  </div>
                </button>
              );
            }

            // Empty Slot
            return (
              <button
                key={slot.id}
                onClick={() => setActiveTab('quests')}
                className="rounded-2xl bg-game-darkest/60 border-2 border-dashed border-game-border p-2 flex flex-col items-center justify-center gap-1.5 min-h-[132px] text-game-dim hover:text-gold hover:border-gold/50 transition-all text-center cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-game-card border border-game-border flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </div>
                <span className="font-game text-[10px] font-bold">Free Slot</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. DAILY MILESTONES (FOCUS CHEST & CROWN VAULT) */}
      <section className="grid grid-cols-2 gap-2.5">
        <div
          onClick={() => {
            openCustomClaimModal({
              title: 'Daily Focus Chest',
              subtitle: 'DAILY REWARD LOOT',
              description: 'Complete 2 more deep work sessions today to claim this sapphire chest.',
              coins: 120,
              xp: 180,
              icon: 'lock_clock',
            });
          }}
          className="rounded-2xl bg-game-card border-2 border-game-border p-3.5 flex flex-col justify-between gap-2.5 shadow-game-card cursor-pointer hover:border-blue transition-all active:scale-95"
        >
          <div className="flex items-center justify-between">
            <span className="font-game text-[10px] text-blue-light font-black uppercase tracking-wider">Daily Focus</span>
            <span className="material-symbols-outlined text-blue-light text-[18px]">lock_clock</span>
          </div>
          <div className="flex items-center gap-2.5">
            <img src="/assets/chest_focus.png" alt="Focus Chest" className="w-9 h-9 object-contain drop-shadow" />
            <div className="flex flex-col">
              <span className="text-xs font-game font-black text-game-text leading-tight">Focus Chest</span>
              <span className="text-[10px] text-game-muted font-bold font-body">1h 45m cooldown</span>
            </div>
          </div>
          <div className="w-full bg-game-darkest h-2 rounded-full overflow-hidden border border-game-border p-0.5">
            <div className="bg-gradient-to-r from-blue to-cyan h-full rounded-full" style={{ width: '65%' }} />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('quests')}
          className="rounded-2xl bg-game-card border-2 border-game-border p-3.5 flex flex-col justify-between gap-2.5 shadow-game-card cursor-pointer hover:border-gold transition-all active:scale-95"
        >
          <div className="flex items-center justify-between">
            <span className="font-game text-[10px] text-amber-300 font-black uppercase tracking-wider">Pass Quest</span>
            <span className="material-symbols-outlined text-amber-300 text-[18px] fill-1">military_tech</span>
          </div>
          <div className="flex items-center gap-2.5">
            <img src="/assets/crown.png" alt="Crown" className="w-9 h-9 object-contain drop-shadow" />
            <div className="flex flex-col">
              <span className="text-xs font-game font-black text-game-text leading-tight">Crown Pass</span>
              <span className="text-[10px] text-amber-300/80 font-bold font-body">3 / 5 Sessions</span>
            </div>
          </div>
          <div className="w-full bg-game-darkest h-2 rounded-full overflow-hidden border border-game-border p-0.5">
            <div className="bg-gradient-to-r from-gold to-amber-300 h-full rounded-full" style={{ width: '60%' }} />
          </div>
        </div>
      </section>
    </div>
  );
};