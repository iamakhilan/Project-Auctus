import React from 'react';
import { useGameState } from '../../context/GameStateContext';
import { calculateSpeedUpCost } from '../../domain/chests';

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
    <div className="flex flex-col w-full max-w-screen mx-auto px-3.5 sm:px-4 pt-3 pb-8 space-y-4">
      {/* 1. CENTRAL CITADEL SANCTUARY CHAMBER */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-surface-container via-surface-container to-surface-container-low border border-outline-variant shadow-card p-4 flex flex-col items-center">
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-radial-gradient from-accent/15 via-transparent to-transparent pointer-events-none" />

        {/* Top Tier & Power Header */}
        <div className="w-full flex items-center justify-between pb-2 border-b border-outline-variant/40 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-surface-dim border border-accent/40 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">spa</span>
            </div>
            <div>
              <span className="font-label-sm text-[10px] text-secondary font-extrabold uppercase tracking-wider block">
                Realm Tier {profile.citadelTier}
              </span>
              <h2 className="font-headline-sm text-sm sm:text-base text-light font-black leading-tight">
                Citadel Sanctuary
              </h2>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-label-sm text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
              Citadel Power
            </span>
            <div className="flex items-center gap-1 font-headline-sm text-xs text-light font-black">
              <span>{profile.citadelPower}</span>
              <span className="text-on-surface-variant text-[11px]">/{profile.citadelMaxPower}</span>
              <span className="material-symbols-outlined text-[14px] text-accent fill-1">bolt</span>
            </div>
          </div>
        </div>

        {/* Power Mini Bar */}
        <div className="w-full h-1.5 bg-surface-dim rounded-full overflow-hidden my-2.5 border border-outline-variant/40">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full shadow-primary-aura transition-all duration-500"
            style={{ width: `${citadelPowerPercent}%` }}
          />
        </div>

        {/* 3D Floating Island Visual Presentation */}
        <div className="relative w-full h-44 sm:h-52 flex items-center justify-center my-1">
          <div className="absolute w-40 h-12 bg-accent/20 rounded-full blur-xl translate-y-12 pointer-events-none" />
          <img
            src="/assets/island.png"
            alt="Citadel Island"
            className="w-40 h-40 sm:w-48 sm:h-48 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] animate-float"
          />
        </div>

        {/* Tactical Badges Row */}
        <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-outline-variant/40 relative z-10">
          <button
            onClick={() => setActiveTab('citadel')}
            className="flex items-center gap-2 p-2 rounded-xl bg-surface-dim border border-outline-variant hover:border-accent/50 text-left transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-primary/30 text-secondary flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[16px] fill-1">emoji_events</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-[10px] text-secondary font-extrabold uppercase leading-none">
                {profile.leagueRank}
              </span>
              <span className="font-headline-sm text-xs text-light font-bold truncate mt-0.5">
                {profile.trophyPoints.toLocaleString()} pts
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('citadel')}
            className="flex items-center gap-2 p-2 rounded-xl bg-surface-dim border border-outline-variant hover:border-accent/50 text-left transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-accent/25 text-light flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[16px]">domain_verification</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-[10px] text-secondary font-extrabold uppercase leading-none">
                Next Ascension
              </span>
              <span className="font-headline-sm text-xs text-light font-bold truncate mt-0.5">
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
          className="group relative w-full h-16 rounded-2xl btn-primary border border-secondary/50 shadow-md active:scale-[0.98] transition-all flex items-center justify-between px-4 sm:px-5 cursor-pointer"
          id="start-focus-btn"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-deep/40 flex items-center justify-center text-light shadow-inner">
              <span className="material-symbols-outlined text-[24px] fill-1 group-hover:rotate-12 transition-transform">
                swords
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-headline-sm text-sm sm:text-base text-light font-black tracking-wide uppercase leading-tight">
                START FOCUS CRUCIBLE
              </span>
              <span className="font-label-sm text-[11px] text-light/90 font-extrabold flex items-center gap-1">
                25 Min Deep Work • +120 XP, 15 Coins
              </span>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-deep/30 text-light flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px] font-black">play_arrow</span>
          </div>
        </button>
      </section>

      {/* 3. MISSION LOOT DECK (4 TACTILE SLOTS) */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px] fill-1">
              inventory_2
            </span>
            <h3 className="font-headline-sm text-sm text-light font-extrabold">
              Mission Loot Deck
            </h3>
          </div>
          <span className="font-label-sm text-[11px] text-on-surface-variant font-bold">
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
                  className="rounded-xl bg-surface-container border border-accent/50 p-2 flex flex-col items-center justify-between min-h-[128px] shadow-sm relative overflow-hidden"
                >
                  <span className="text-[9px] font-black text-light uppercase tracking-tight bg-primary/80 px-1.5 py-0.2 rounded border border-secondary/40">
                    UNLOCKING
                  </span>

                  <div className="w-10 h-10 my-1">
                    <img
                      src={slot.image || '/assets/chest_silver.png'}
                      alt={slot.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="w-full flex flex-col items-center gap-1">
                    <span className="text-[10px] font-black text-light flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[10px]">schedule</span>
                      {formatSeconds(slot.unlockTimeRemainingSeconds)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speedUpChest(slot.slotIndex);
                      }}
                      className="w-full py-0.5 rounded bg-primary hover:bg-primary-hover text-light text-[10px] font-black flex items-center justify-center gap-0.5 border border-secondary/40 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[10px] text-secondary">diamond</span>
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
                  className="rounded-xl bg-gradient-to-b from-primary/40 to-surface-container border-2 border-accent p-2 flex flex-col items-center justify-between min-h-[128px] shadow-[0_0_14px_rgba(87,99,232,0.45)] active:scale-95 transition-transform animate-pulse text-left"
                >
                  <span className="text-[9px] font-black text-deep uppercase tracking-tight bg-light px-1.5 py-0.2 rounded shadow-sm">
                    OPEN NOW
                  </span>

                  <div className="w-10 h-10 my-1">
                    <img
                      src={slot.image || '/assets/chest_ready.png'}
                      alt={slot.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <span className="w-full text-center text-[10px] font-black text-light bg-surface-dim py-0.5 rounded">
                    CLAIM!
                  </span>
                </button>
              );
            }

            if (slot.status === 'queued') {
              return (
                <button
                  key={slot.id}
                  onClick={() => unlockChest(slot.slotIndex)}
                  className="rounded-xl bg-surface-container border border-outline-variant hover:border-accent/50 p-2 flex flex-col items-center justify-between min-h-[128px] shadow-sm active:scale-95 transition-all text-left"
                >
                  <span className="text-[9px] font-bold text-secondary uppercase tracking-tight bg-surface-dim px-1.5 py-0.2 rounded">
                    UNLOCK
                  </span>

                  <div className="w-10 h-10 my-1">
                    <img
                      src={slot.image || '/assets/chest_gold.png'}
                      alt={slot.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="w-full text-center">
                    <span className="text-[10px] text-on-surface-variant font-bold block truncate">
                      {slot.name}
                    </span>
                    <span className="text-[10px] text-secondary font-extrabold">
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
                className="rounded-xl bg-surface-dim/40 border border-dashed border-outline-variant/60 p-2 flex flex-col items-center justify-center gap-1.5 min-h-[128px] text-on-surface-variant hover:text-accent hover:border-accent/40 transition-all text-center"
              >
                <div className="w-8 h-8 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </div>
                <span className="text-[10px] font-semibold">Free Slot</span>
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
              subtitle: 'DAILY LOOT PROGRESS',
              description: 'Complete 2 more deep work sessions today to claim this sapphire chest.',
              coins: 120,
              xp: 180,
              icon: 'lock_clock',
            });
          }}
          className="rounded-2xl bg-surface-container border border-outline-variant p-3 flex flex-col justify-between gap-2 shadow-card cursor-pointer hover:border-accent/50 transition-all active:scale-95"
        >
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[10px] text-secondary font-extrabold uppercase">Daily Focus</span>
            <span className="material-symbols-outlined text-secondary text-[16px]">lock_clock</span>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/chest_focus.png" alt="Focus Chest" className="w-8 h-8 object-contain" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-light leading-tight">Focus Chest</span>
              <span className="text-[10px] text-on-surface-variant font-semibold">Cooldown 1h 45m</span>
            </div>
          </div>
          <div className="w-full bg-surface-dim h-1.5 rounded-full overflow-hidden">
            <div className="bg-accent h-full rounded-full" style={{ width: '65%' }} />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('quests')}
          className="rounded-2xl bg-surface-container border border-outline-variant p-3 flex flex-col justify-between gap-2 shadow-card cursor-pointer hover:border-accent/50 transition-all active:scale-95"
        >
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[10px] text-secondary font-extrabold uppercase">Pass Quest</span>
            <span className="material-symbols-outlined text-secondary text-[16px] fill-1">military_tech</span>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/crown.png" alt="Crown" className="w-8 h-8 object-contain" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-light leading-tight">Crown Vault</span>
              <span className="text-[10px] text-secondary font-semibold">3 / 5 Sessions</span>
            </div>
          </div>
          <div className="w-full bg-surface-dim h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: '60%' }} />
          </div>
        </div>
      </section>
    </div>
  );
};