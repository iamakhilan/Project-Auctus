import React from 'react';
import { useGameState } from '../../context/GameStateContext';

export const CitadelView: React.FC = () => {
  const { profile, toggleSound, quests } = useGameState();

  const completedQuests = quests.filter(q => q.isCompleted);
  const xpPercent = Math.min(100, Math.round((profile.xp / profile.xpToNextLevel) * 100));

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto px-4 pb-32 pt-2 space-y-4">
      {/* 1. COMMANDER PROFILE CARD */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#162e59] via-[#102447] to-[#0c1a36] border-2 border-amber-400/60 p-5 shadow-[0_12px_32px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col gap-4">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-[#142a54] border-2 border-amber-400 overflow-hidden shadow-[0_0_15px_rgba(251,191,36,0.4)] flex items-center justify-center">
              <img
                src="/assets/avatar.png"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 font-label-sm text-[10px] font-black border border-yellow-200 shadow">
              LV.{profile.level}
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-headline-md text-[18px] text-white font-extrabold truncate">
                {profile.name}
              </h2>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 text-amber-300 font-label-sm text-[9px] uppercase font-bold">
                {profile.leagueRank}
              </span>
            </div>
            <span className="font-label-sm text-[11px] text-amber-300/90 uppercase font-black tracking-wider">
              {profile.title}
            </span>
            <div className="flex items-center gap-2 mt-1 text-[12px] text-on-surface-variant font-medium">
              <span>{profile.trophyPoints.toLocaleString()} Trophies</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">Tier {profile.citadelTier} Citadel</span>
            </div>
          </div>
        </div>

        {/* Level & XP Progression */}
        <div className="flex flex-col gap-1.5 relative z-10 bg-[#08152c]/80 p-3 rounded-xl border border-[#24457e]">
          <div className="flex items-center justify-between text-[11px] font-label-sm">
            <span className="text-amber-300 font-bold">XP Level Progression</span>
            <span className="text-on-surface-variant font-semibold">
              {profile.xp.toLocaleString()} / {profile.xpToNextLevel.toLocaleString()} XP
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#060d1b] rounded-full overflow-hidden border border-[#1a3668] p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* 2. PRODUCTIVITY TELEMETRY & STATS */}
      <section className="flex flex-col gap-2.5">
        <h3 className="font-headline-sm text-[16px] text-white font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-cyan-400 text-[20px]">analytics</span>
          <span>Productivity Telemetry</span>
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Total Focus Time */}
          <div className="rounded-xl bg-gradient-to-b from-[#142a54] to-[#0e2246] border border-[#244888] p-3 flex flex-col shadow">
            <span className="font-label-sm text-[10px] text-on-surface-variant uppercase font-bold">
              Total Deep Work
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-headline-lg text-[22px] text-cyan-300 font-black">
                {Math.floor(profile.totalFocusMinutes / 60)}h {profile.totalFocusMinutes % 60}m
              </span>
            </div>
            <span className="font-label-sm text-[10px] text-emerald-400 font-semibold mt-0.5">
              +140m this week
            </span>
          </div>

          {/* Streak Flame */}
          <div className="rounded-xl bg-gradient-to-b from-[#142a54] to-[#0e2246] border border-[#244888] p-3 flex flex-col shadow">
            <span className="font-label-sm text-[10px] text-on-surface-variant uppercase font-bold">
              Consistency Streak
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-headline-lg text-[22px] text-rose-400 font-black">
                {profile.streakDays} Days
              </span>
              <span className="material-symbols-outlined text-rose-500 text-[18px] fill-1">
                local_fire_department
              </span>
            </div>
            <span className="font-label-sm text-[10px] text-amber-300 font-semibold mt-0.5">
              {profile.streakShields} Shield Safeguard
            </span>
          </div>

          {/* Quests Conquered */}
          <div className="rounded-xl bg-gradient-to-b from-[#142a54] to-[#0e2246] border border-[#244888] p-3 flex flex-col shadow">
            <span className="font-label-sm text-[10px] text-on-surface-variant uppercase font-bold">
              Bounties Conquered
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-headline-lg text-[22px] text-amber-300 font-black">
                {profile.completedQuestsCount}
              </span>
              <span className="font-label-sm text-[11px] text-on-surface-variant">missions</span>
            </div>
            <span className="font-label-sm text-[10px] text-cyan-300 font-semibold mt-0.5">
              Top tier completion rate
            </span>
          </div>

          {/* Chests Unlocked */}
          <div className="rounded-xl bg-gradient-to-b from-[#142a54] to-[#0e2246] border border-[#244888] p-3 flex flex-col shadow">
            <span className="font-label-sm text-[10px] text-on-surface-variant uppercase font-bold">
              Loot Chests Claimed
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-headline-lg text-[22px] text-emerald-300 font-black">
                {profile.unlockedChestsCount}
              </span>
              <span className="font-label-sm text-[11px] text-on-surface-variant">chests</span>
            </div>
            <span className="font-label-sm text-[10px] text-amber-300 font-semibold mt-0.5">
              Guaranteed rare yields
            </span>
          </div>
        </div>
      </section>

      {/* 3. RECENT VICTORY ARCHIVES */}
      <section className="flex flex-col gap-2">
        <h3 className="font-headline-sm text-[16px] text-white font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400 text-[20px] fill-1">
            verified
          </span>
          <span>Recent Victorious Deeds</span>
        </h3>

        <div className="flex flex-col gap-2">
          {completedQuests.map(cq => (
            <div
              key={cq.id}
              className="rounded-xl bg-[#0c1a36] border border-[#244888]/60 p-3 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-emerald-400 text-[20px] fill-1">
                  check_circle
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="font-headline-sm text-[13px] text-white font-bold truncate">
                    {cq.title}
                  </span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">
                    +{cq.xpReward} XP • +{cq.coinReward} Coins
                  </span>
                </div>
              </div>
              <span className="font-label-sm text-[10px] text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                Victorious
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SETTINGS & SOUND PREFERENCES */}
      <section className="rounded-xl bg-[#0e2246] border border-[#244888] p-4 flex flex-col gap-3">
        <h3 className="font-headline-sm text-[15px] text-white font-bold">
          Citadel Preferences
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-[20px]">
              {profile.soundEnabled ? 'volume_up' : 'volume_off'}
            </span>
            <span className="font-body-md text-[13px] text-on-surface">Game Sound FX & Haptics</span>
          </div>
          <button
            onClick={toggleSound}
            className={`px-3 py-1 rounded-lg font-label-sm text-[11px] font-bold transition-all ${
              profile.soundEnabled
                ? 'bg-amber-400 text-amber-950 shadow'
                : 'bg-[#142a54] text-on-surface-variant'
            }`}
          >
            {profile.soundEnabled ? 'ENABLED' : 'MUTED'}
          </button>
        </div>
      </section>
    </div>
  );
};
