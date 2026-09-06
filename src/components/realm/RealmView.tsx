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
    openCustomClaimModal
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
    <div className="flex flex-col w-full max-w-screen mx-auto px-4 pb-32 pt-3 space-y-5">
      {/* 1. TOP PROGRESSION CARDS (Clash-style dual banner cards) */}
      <section className="grid grid-cols-2 gap-3 pt-1">
        {/* Chest 1: Daily Focus Chest */}
        <div
          onClick={() => {
            openCustomClaimModal({
              title: 'Daily Focus Chest',
              subtitle: 'DAILY LOOT PROGRESS',
              description: 'Complete 2 more deep work sessions today to claim this sapphire chest.',
              coins: 120,
              xp: 180,
              icon: 'lock_clock'
            });
          }}
          className="relative bg-gradient-to-b from-surface-container to-surface-container-low border border-outline-variant/80 rounded-card p-3 flex flex-col justify-between overflow-hidden shadow-card-raised cursor-pointer active:translate-y-0.5 transition-all card-hover hover:border-amber-400/40 group"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-amber-400/15 via-transparent to-transparent pointer-events-none" />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="inline-block font-label-sm text-label-sm text-[#fbc02d] uppercase tracking-wider font-extrabold">
                Daily Loot
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface leading-tight font-black">
                Focus Chest
              </h3>
            </div>
            <div className="w-7 h-7 rounded-control bg-surface-dim border border-outline-variant flex items-center justify-center text-amber-400 shadow-inset-well group-hover:border-amber-400 transition-colors">
              <span className="material-symbols-outlined text-[18px]">lock_clock</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 mt-2 relative z-10">
            <div className="w-10 h-10 rounded-control bg-surface-dim border border-outline-variant overflow-hidden flex-shrink-0 shadow-card">
              <img
                src="/assets/chest_focus.png"
                alt="Focus Chest"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">
                Cooldown
              </span>
              <span className="font-label-md text-label-lg text-[#f43f5e] font-black flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[12px]">timer</span> 1h 45m
              </span>
            </div>
          </div>

          {/* Segmented Mini Tracker */}
          <div className="w-full bg-surface-dim h-2 rounded-full mt-2 overflow-hidden border border-outline-variant/60 p-px">
            <div
              className="bg-gradient-to-r from-[#059669] to-[#10b981] h-full rounded-full shadow-emerald-aura"
              style={{ width: '65%' }}
            />
          </div>
        </div>

        {/* Chest 2: Crown Quest */}
        <div
          onClick={() => setActiveTab('quests')}
          className="relative bg-gradient-to-b from-surface-container to-surface-container-low border border-outline-variant/80 rounded-card p-3 flex flex-col justify-between overflow-hidden shadow-card-raised cursor-pointer active:translate-y-0.5 transition-all card-hover hover:border-amber-400/40 group"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#fbc02d]/15 via-transparent to-transparent pointer-events-none" />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="inline-block font-label-sm text-label-sm text-[#fbc02d] uppercase tracking-wider font-extrabold">
                Pass Quest
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface leading-tight font-black">
                Crown Vault
              </h3>
            </div>
            <div className="w-7 h-7 rounded-control bg-surface-dim border border-outline-variant flex items-center justify-center text-[#fbc02d] shadow-inset-well group-hover:border-[#fbc02d] transition-colors">
              <span className="material-symbols-outlined text-[18px] fill-1">military_tech</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 mt-2 relative z-10">
            <div className="w-10 h-10 rounded-control bg-surface-dim border border-outline-variant overflow-hidden flex-shrink-0 shadow-card">
              <img
                src="/assets/crown.png"
                alt="Crown Vault"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">
                Progress
              </span>
              <div className="flex items-baseline gap-0.5">
                <span className="font-label-md text-label-lg text-[#fde047] font-black">3</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">/ 5 Sessions</span>
              </div>
            </div>
          </div>

          {/* Crown Stud Meter (5 segments) */}
          <div className="grid grid-cols-5 gap-1 mt-2">
            <div className="h-2 rounded-full bg-gradient-to-b from-[#fde047] to-[#f59e0b] shadow-[0_0_8px_rgba(251,192,45,0.7)] border border-[#ffdf6d]/60" />
            <div className="h-2 rounded-full bg-gradient-to-b from-[#fde047] to-[#f59e0b] shadow-[0_0_8px_rgba(251,192,45,0.7)] border border-[#ffdf6d]/60" />
            <div className="h-2 rounded-full bg-gradient-to-b from-[#fde047] to-[#f59e0b] shadow-[0_0_8px_rgba(251,192,45,0.7)] border border-[#ffdf6d]/60" />
            <div className="h-2 rounded-full bg-surface-dim border border-outline-variant" />
            <div className="h-2 rounded-full bg-surface-dim border border-outline-variant" />
          </div>
        </div>
      </section>

      {/* 2. CENTRAL VISUAL REALM (Floating Productivity Citadel Island) */}
      <section className="relative w-full rounded-card bg-gradient-to-b from-surface-container via-surface-container-low to-surface overflow-hidden border border-outline-variant/70 shadow-card-raised flex flex-col items-center">
        {/* Starfield Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface-dim via-surface-container-low to-surface-container opacity-80 pointer-events-none" />
        <div className="absolute inset-0 opacity-25 mix-blend-screen pointer-events-none bg-grid-dots" />

        {/* Realm Header Strip */}
        <div className="relative z-10 w-full px-4 pt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-control bg-surface-dim border border-tertiary/50 flex items-center justify-center text-tertiary shadow-card">
              <span className="material-symbols-outlined text-[20px] fill-1">spa</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-[#34d399] uppercase tracking-wider font-extrabold">
                Realm Tier {profile.citadelTier}
              </span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface leading-tight font-black">
                Emerald Sanctuary
              </h2>
            </div>
          </div>

          {/* Citadel Power Meter */}
          <div className="flex flex-col items-end">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
              Citadel Power
            </span>
            <div className="flex items-center gap-1">
              <span className="font-label-md text-body-sm text-[#38bdf8] font-black">
                {profile.citadelPower}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                / {profile.citadelMaxPower}
              </span>
              <span className="material-symbols-outlined text-[#38bdf8] text-[14px] fill-1">
                bolt
              </span>
            </div>
          </div>
        </div>

        {/* Realm Power Mini Bar */}
        <div className="relative z-10 w-[92%] h-2 bg-surface-dim rounded-full mt-2 overflow-hidden shadow-inset-well border border-outline-variant/60 p-px">
          <div
            className="h-full bg-gradient-to-r from-[#00c853] to-[#10b981] rounded-full shadow-emerald-aura transition-all duration-500"
            style={{ width: `${citadelPowerPercent}%` }}
          />
        </div>

        {/* Main Island Display with Floating Tactical Badges */}
        <div className="relative w-full h-64 mt-2 flex items-center justify-center">
          {/* Left Floating Badges */}
          <div className="absolute left-3 top-4 z-20 flex flex-col gap-2">
            {/* Trophy League */}
            <div
              onClick={() => setActiveTab('citadel')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-control bg-surface-container/95 border border-amber-400/50 backdrop-blur-md shadow-card cursor-pointer active:scale-95 card-hover hover:border-amber-400 transition-all"
            >
              <div className="w-6 h-6 rounded-control bg-gradient-to-b from-[#fbc02d] to-[#d97706] text-[#361e00] flex items-center justify-center shadow">
                <span className="material-symbols-outlined text-[16px] fill-1">emoji_events</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-[#fde047] font-black leading-none">
                  {profile.leagueRank}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface leading-tight font-extrabold">
                  {profile.trophyPoints.toLocaleString()} pts
                </span>
              </div>
            </div>

            {/* Streak Shield */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-control bg-surface-container/95 border border-ruby/50 backdrop-blur-md shadow-card cursor-pointer active:scale-95 card-hover hover:border-ruby transition-all">
              <div className="w-6 h-6 rounded-control bg-gradient-to-b from-[#f43f5e] to-[#be123c] text-white flex items-center justify-center shadow">
                <span className="material-symbols-outlined text-[16px] fill-1">local_fire_department</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-error font-black leading-none">
                  STREAK
                </span>
                <span className="font-label-sm text-label-sm text-on-surface leading-tight font-extrabold">
                  {profile.streakDays} Days
                </span>
              </div>
            </div>
          </div>

          {/* Right Floating Badges */}
          <div className="absolute right-3 top-4 z-20 flex flex-col gap-2 items-end">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-control bg-surface-container/95 border border-secondary/40 backdrop-blur-md shadow-card cursor-pointer active:scale-95 card-hover hover:border-secondary transition-all">
              <div className="flex flex-col text-right">
                <span className="font-label-sm text-label-sm text-[#fbc02d] font-black leading-none">
                  CLAN BUFF
                </span>
                <span className="font-label-sm text-label-sm text-[#34d399] leading-tight font-black">
                  +10% XP Boost
                </span>
              </div>
              <div className="w-6 h-6 rounded-control bg-surface-container text-[#38bdf8] flex items-center justify-center shadow-card border border-outline-variant">
                <span className="material-symbols-outlined text-[16px]">group</span>
              </div>
            </div>

            {/* Online Aura Beacon */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-control bg-surface-container-low/90 border border-tertiary/50 backdrop-blur-sm shadow-card">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
              <span className="font-label-sm text-label-sm text-[#34d399] font-black">
                Citadel Online
              </span>
            </div>
          </div>

          {/* 3D Floating Island Artwork */}
          <div className="relative w-56 h-56 flex items-center justify-center">
            {/* Ambient Underglow */}
            <div className="absolute w-44 h-16 rounded-full bg-[#10b981]/25 blur-xl translate-y-16 pointer-events-none" />
            <img
              src="/assets/island.png"
              alt="Emerald Sanctuary Island"
              className="w-full h-full object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.85)] animate-float"
            />
          </div>

          {/* Island Stage Switcher / Milestone Anchor */}
          <div
            onClick={() => setActiveTab('citadel')}
            className="absolute bottom-2 z-20 flex items-center gap-1.5 bg-surface-container-low/90 border border-outline-variant backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-card cursor-pointer hover:border-amber-400/50 card-hover transition-all"
          >
            <span className="material-symbols-outlined text-[#fbc02d] text-[16px]">
              domain_verification
            </span>
            <span className="font-label-sm text-label-lg text-on-surface font-bold">
              Upgrade Citadel at {profile.citadelMaxPower.toLocaleString()} Power
            </span>
            <span className="material-symbols-outlined text-on-surface-variant text-[14px]">
              arrow_forward
            </span>
          </div>
        </div>
      </section>

      {/* 3. MASSIVE PRIMARY ACTION (Tactile 3D Clash-Style Execute Button) */}
      <section className="w-full flex flex-col items-center">
        <button
          onClick={() => startFocusSession(25)}
          className="group relative w-full h-20 rounded-card bg-gradient-to-b from-[#fde047] via-[#f59e0b] to-[#d97706] p-1 border-2 border-[#ffdf6d] shadow-bevel-gold active:translate-y-1.5 active:shadow-bevel-gold-active transition-all overflow-hidden cursor-pointer focus:outline-none hover:brightness-[1.04]"
          id="start-focus-btn"
        >
          {/* Inner Bevel Highlight */}
          <div className="w-full h-full rounded-control bg-gradient-to-b from-white/30 via-transparent to-black/15 flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              {/* Action Glyph Shield */}
              <div className="w-12 h-12 rounded-control bg-[#78350f]/35 border border-white/25 flex items-center justify-center text-[#451a03] shadow-inset-well">
                <span className="material-symbols-outlined text-[32px] fill-1 group-hover:rotate-12 transition-transform drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                  swords
                </span>
              </div>

              {/* CTA Text Hierarchy */}
              <div className="flex flex-col text-left">
                <span className="font-headline-lg text-headline-xl text-[#361e00] tracking-wider drop-shadow-[0_1px_0_rgba(255,255,255,0.5)] uppercase font-black">
                  START FOCUS
                </span>
                <span className="font-label-md text-label-lg text-[#451a03] font-black flex items-center gap-1 opacity-95">
                  <span className="material-symbols-outlined text-[15px] fill-1">bolt</span>
                  25 Min Deep Work • +120 XP, 15 Coins
                </span>
              </div>
            </div>

            {/* Sparkle Play Indicator */}
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/30 text-[#451a03] shadow-inset-well group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px] font-black">
                play_arrow
              </span>
            </div>
          </div>
        </button>
      </section>

      {/* 4. REWARD CHEST SLOTS (4 Tactile Gaming Deck Slots) */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#fbc02d] text-[20px] fill-1">
              inventory_2
            </span>
            <span className="font-headline-md text-headline-md text-on-surface font-black">
              Mission Loot Deck
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-extrabold">
            {chests.filter(c => c.status !== 'empty').length} / 4 In Vault
          </span>
        </div>

        {/* 4 Slot Grid with Inset Housing */}
        <div className="grid grid-cols-4 gap-2 p-2 bg-surface-dim border border-outline-variant/70 rounded-card shadow-inset-well">
          {chests.map(slot => {
            if (slot.status === 'unlocking') {
              const shardCost = calculateSpeedUpCost(slot.unlockTimeRemainingSeconds);
              return (
                <div
                  key={slot.id}
                  className="relative bg-gradient-to-b from-surface-container to-surface-container-low border border-sky-400/40 rounded-control p-1.5 flex flex-col items-center justify-between min-h-[132px] overflow-hidden shadow-card"
                >
                  <div className="w-full text-center py-0.5 rounded bg-surface-container-high border border-secondary/30">
                    <span className="font-label-sm text-label-sm text-[#7dd3fc] font-black uppercase tracking-tight">
                      UNLOCKING
                    </span>
                  </div>

                  <div className="relative w-12 h-12 my-1">
                    <div className="absolute inset-0 bg-[#38bdf8]/20 rounded-full blur-md animate-pulse" />
                    <img
                      src={slot.image || '/assets/chest_silver.png'}
                      alt={slot.name}
                      className="w-full h-full object-contain relative z-10"
                    />
                  </div>

                  <div className="flex flex-col items-center text-center w-full gap-1">
                    <span className="font-label-sm text-label-sm text-[#34d399] flex items-center gap-0.5 font-black">
                      <span className="material-symbols-outlined text-[10px]">schedule</span>
                      {formatSeconds(slot.unlockTimeRemainingSeconds)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speedUpChest(slot.slotIndex);
                      }}
                      className="w-full py-0.5 px-1 rounded bg-sky-950/80 hover:bg-sky-900 border border-sky-400/50 text-sky-200 font-label-sm text-label-sm font-black flex items-center justify-center gap-0.5 active:scale-95 transition-all"
                      title={`Speed up unlock for ${shardCost} Spire Shard(s)`}
                    >
                      <span className="material-symbols-outlined text-[11px] text-sky-300">diamond</span>
                      <span>{shardCost}</span>
                    </button>
                  </div>
                </div>
              );
            }

            if (slot.status === 'queued') {
              return (
                <div
                  key={slot.id}
                  onClick={() => unlockChest(slot.slotIndex)}
                  className="relative bg-gradient-to-b from-surface-container to-surface-container-low border border-outline-variant rounded-control p-1.5 flex flex-col items-center justify-between min-h-[132px] overflow-hidden shadow-card cursor-pointer active:translate-y-0.5 hover:border-amber-400/50 transition-all card-hover group"
                  title="Tap to start unlock timer"
                >
                  <div className="w-full text-center py-0.5 rounded bg-surface-container border border-outline-variant group-hover:bg-surface-container-high transition-colors">
                    <span className="font-label-sm text-label-sm text-amber-300 font-black uppercase tracking-tight">
                      TAP UNLOCK
                    </span>
                  </div>

                  <div className="w-12 h-12 my-1">
                    <img
                      src={slot.image || '/assets/chest_gold.png'}
                      alt={slot.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex flex-col items-center text-center w-full">
                    <span className="font-label-sm text-label-sm text-on-surface font-extrabold truncate w-full">
                      {slot.name}
                    </span>
                    <span className="font-label-sm text-label-sm text-[#fbc02d] flex items-center gap-0.5 font-black">
                      <span className="material-symbols-outlined text-[10px]">timer</span>
                      {formatSeconds(slot.totalUnlockSeconds)}
                    </span>
                  </div>
                </div>
              );
            }

            if (slot.status === 'ready') {
              return (
                <div
                  key={slot.id}
                  onClick={() => claimChestLoot(slot.slotIndex)}
                  className="relative bg-gradient-to-b from-[#2a1d05] via-surface-container to-surface-container-low border-2 border-[#fbc02d] rounded-control p-1.5 flex flex-col items-center justify-between min-h-[132px] overflow-hidden shadow-[0_0_18px_rgba(251,192,45,0.45)] cursor-pointer active:scale-95 transition-transform animate-pulse"
                  title="Open reward chest!"
                >
                  <div className="w-full text-center py-0.5 rounded bg-gradient-to-r from-[#fde047] to-[#f59e0b] text-[#361e00] shadow">
                    <span className="font-label-sm text-label-sm font-black uppercase tracking-tight">
                      OPEN NOW!
                    </span>
                  </div>

                  <div className="relative w-12 h-12 my-1 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#fbc02d]/30 rounded-full blur-md" />
                    <span className="absolute -top-1 -right-1 text-[#fde047] text-[12px] font-bold select-none animate-bounce">
                      ✨
                    </span>
                    <img
                      src={slot.image || '/assets/chest_ready.png'}
                      alt={slot.name}
                      className="w-full h-full object-contain relative z-10"
                    />
                  </div>

                  <div className="flex flex-col items-center text-center w-full">
                    <span className="font-label-sm text-label-sm text-[#fde047] font-black truncate w-full">
                      Ready!
                    </span>
                    <span className="font-label-sm text-label-sm text-[#361e00] bg-gradient-to-b from-[#fde047] to-[#f59e0b] px-2 py-0.5 rounded-full font-black shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                      CLAIM
                    </span>
                  </div>
                </div>
              );
            }

            // Empty Slot
            return (
              <div
                key={slot.id}
                onClick={() => setActiveTab('quests')}
                className="relative bg-surface-container-lowest/60 border border-dashed border-outline-variant rounded-control p-1.5 flex flex-col items-center justify-between min-h-[132px] overflow-hidden shadow-inset-well cursor-pointer hover:bg-surface-container/40 hover:border-amber-400/40 transition-all group"
                title="Complete quests to earn loot chests"
              >
                <div className="w-full text-center py-0.5 rounded bg-surface-dim">
                  <span className="font-label-sm text-label-sm text-outline font-black uppercase tracking-tight">
                    FREE SLOT
                  </span>
                </div>

                <div className="w-12 h-12 my-1 rounded-control bg-surface-dim border border-outline-variant flex items-center justify-center text-outline group-hover:text-amber-400 group-hover:border-amber-400/40 transition-colors">
                  <span className="material-symbols-outlined text-[24px]">add</span>
                </div>

                <div className="flex flex-col items-center text-center w-full pb-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium leading-tight">
                    Complete 1 Quest to earn loot
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};