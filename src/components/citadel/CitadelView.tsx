import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { getCitadelTierConfig, canUpgradeCitadelTier } from '../../domain/citadel';
import { DailySummaryModal } from '../analytics/DailySummaryModal';
import { AchievementCategory } from '../../types';

export const CitadelView: React.FC = () => {
  const {
    profile,
    toggleSound,
    quests,
    achievements,
    upgradeCitadel,
    exportData,
    importData,
  } = useGameState();

  const [achievementFilter, setAchievementFilter] = useState<AchievementCategory | 'all'>('all');
  const [dailySummaryOpen, setDailySummaryOpen] = useState(false);

  const completedQuests = quests.filter(q => q.isCompleted);
  const xpPercent = Math.min(100, Math.round((profile.xp / profile.xpToNextLevel) * 100));

  const tierConfig = getCitadelTierConfig(profile.citadelTier || 1);
  const upgradeCheck = canUpgradeCitadelTier(profile);
  const powerPercent = Math.min(100, Math.round((profile.citadelPower / profile.citadelMaxPower) * 100));

  const filteredAchievements = achievements.filter(
    a => achievementFilter === 'all' || a.category === achievementFilter
  );
  const unlockedCount = achievements.filter(a => a.isUnlocked).length;

  return (
    <div className="flex flex-col w-full max-w-screen mx-auto px-4 pb-32 pt-3 space-y-5">
      {/* 1. COMMANDER PROFILE CARD */}
      <section className="relative overflow-hidden rounded-card bg-gradient-to-b from-surface-container-high via-surface-container to-surface-container-low border border-amber-400/60 p-5 shadow-card-raised flex flex-col gap-4">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-surface-container-high border-2 border-amber-400 overflow-hidden shadow-gold-aura flex items-center justify-center">
              <img
                src="/assets/avatar.png"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 font-label-sm text-label-sm font-black border border-yellow-200 shadow">
              LV.{profile.level}
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-headline-md text-headline-md text-white font-extrabold truncate">
                {profile.name}
              </h2>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 text-amber-300 font-label-sm text-label-sm uppercase font-bold">
                {profile.leagueRank}
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-amber-300/90 uppercase font-black tracking-wider">
              {profile.title}
            </span>
            <div className="flex items-center gap-2 mt-1 text-body-sm text-on-surface-variant font-medium">
              <span>{profile.trophyPoints.toLocaleString()} Trophies</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">Tier {profile.citadelTier} Citadel</span>
            </div>
          </div>
        </div>

        {/* Level & XP Progression */}
        <div className="flex flex-col gap-1.5 relative z-10 bg-surface-dim/80 p-3 rounded-control border border-outline-variant">
          <div className="flex items-center justify-between font-label-sm text-label-sm">
            <span className="text-amber-300 font-bold">XP Level Progression</span>
            <span className="text-on-surface-variant font-semibold">
              {profile.xp.toLocaleString()} / {profile.xpToNextLevel.toLocaleString()} XP
            </span>
          </div>
          <div className="w-full h-2.5 bg-surface-container-lowest rounded-full overflow-hidden border border-outline-variant/60 p-px">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-emerald-aura transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* 2. CITADEL TIER ASCENDANCY & REALM POWER */}
      <section className="relative overflow-hidden rounded-card bg-gradient-to-b from-surface-container-high to-surface-container border border-sky-400/40 p-4 shadow-card flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-control bg-sky-950 border border-sky-400/50 flex items-center justify-center text-sky-300 shadow-cyan-aura">
              <span className="material-symbols-outlined text-[24px]">account_balance</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-headline-sm text-white font-extrabold">
                  {tierConfig.name}
                </h3>
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/40 font-label-sm text-label-sm uppercase font-bold">
                  Tier {tierConfig.tier}
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-sky-300/80 font-semibold">
                {tierConfig.subtitle} • +{tierConfig.xpBoostPercent}% XP Passive Boost
              </span>
            </div>
          </div>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {tierConfig.description}
        </p>

        {/* Citadel Power Progress Bar */}
        <div className="flex flex-col gap-1 bg-surface-dim/80 p-3 rounded-control border border-outline-variant">
          <div className="flex items-center justify-between font-label-sm text-label-sm">
            <span className="text-sky-300 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              Citadel Power Stored
            </span>
            <span className="text-on-surface-variant font-bold">
              {profile.citadelPower.toLocaleString()} / {profile.citadelMaxPower.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-2.5 bg-surface-container-lowest rounded-full overflow-hidden border border-sky-500/20 p-px">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-cyan-300 rounded-full shadow-cyan-aura transition-all duration-500"
              style={{ width: `${powerPercent}%` }}
            />
          </div>
        </div>

        {/* Upgrade Citadel CTA */}
        {upgradeCheck.canUpgrade && upgradeCheck.nextTier ? (
          <button
            onClick={upgradeCitadel}
            className="btn btn-gold w-full h-11 font-headline-sm text-headline-sm uppercase tracking-wide animate-pulse"
          >
            <span className="material-symbols-outlined text-[20px]">upgrade</span>
            <span>Ascend to {upgradeCheck.nextTier.name} (Tier {upgradeCheck.nextTier.tier})</span>
          </button>
        ) : upgradeCheck.nextTier ? (
          <div className="flex items-center justify-between px-3 py-2 rounded-control bg-surface-dim/60 border border-outline-variant/60 text-label-sm">
            <span className="text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-amber-400">lock</span>
              Next Tier: <strong className="text-white">{upgradeCheck.nextTier.name}</strong>
            </span>
            <span className="text-amber-300/80 font-semibold">{upgradeCheck.reason}</span>
          </div>
        ) : (
          <div className="text-center py-1 font-label-sm text-label-sm text-emerald-400 font-black">
            ✦ PINNACLE CELESTIAL TIER ACHIEVED ✦
          </div>
        )}
      </section>

      {/* 3. ACHIEVEMENTS & TROPHY VAULT */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-[22px]">military_tech</span>
            <h3 className="font-headline-sm text-headline-md text-white font-extrabold tracking-wide">
              Hall of Achievements
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 font-label-sm text-label-sm text-amber-300 font-black uppercase">
            {unlockedCount} / {achievements.length} Unlocked
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 custom-scrollbar">
          {(['all', 'focus', 'quests', 'habits', 'economy', 'citadel'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setAchievementFilter(cat)}
              className={`px-3 py-1 rounded-control font-label-sm text-label-sm capitalize whitespace-nowrap transition-all ${
                achievementFilter === cat
                  ? 'bg-navy-hi border border-amber-400/50 text-amber-300 font-bold shadow-card'
                  : 'bg-surface-dim text-on-surface-variant hover:text-white border border-outline-variant/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredAchievements.map(ach => {
            const isCompleted = ach.isUnlocked;
            const progressPercent = Math.min(100, Math.round((ach.currentValue / ach.targetValue) * 100));

            return (
              <div
                key={ach.id}
                className={`p-3 rounded-card border flex flex-col justify-between gap-2.5 transition-all shadow-card ${
                  isCompleted
                    ? 'bg-gradient-to-b from-amber-950/40 via-surface-container to-surface-container-low border-amber-400/50 shadow-[0_4px_16px_rgba(245,158,11,0.15)]'
                    : 'bg-surface-container-low border-outline-variant/70 opacity-90'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-control flex items-center justify-center flex-shrink-0 ${
                      isCompleted
                        ? 'bg-amber-400 text-amber-950 font-bold shadow-gold-aura'
                        : 'bg-surface-dim text-on-surface-variant border border-outline-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{ach.icon}</span>
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-headline-sm text-label-lg font-bold text-white truncate">
                        {ach.title}
                      </h4>
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-emerald-400 text-[18px]">
                          check_circle
                        </span>
                      ) : (
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                          {ach.currentValue} / {ach.targetValue}
                        </span>
                      )}
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">
                      {ach.description}
                    </p>
                  </div>
                </div>

                {/* Progress bar or Reward Badge */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-outline-variant/30">
                  <div className="flex items-center gap-1.5 text-label-sm font-bold text-amber-300">
                    <span>+{ach.rewards.xp} XP</span>
                    {ach.rewards.coins && <span>• +{ach.rewards.coins} Coins</span>}
                    {ach.rewards.shards && <span>• +{ach.rewards.shards} Shards</span>}
                  </div>

                  {!isCompleted && (
                    <div className="w-24 h-1.5 bg-surface-dim rounded-full overflow-hidden border border-outline-variant/40">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PRODUCTIVITY TELEMETRY & STATS */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm text-white font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-400 text-[20px]">analytics</span>
            <span>Productivity Telemetry</span>
          </h3>
          <button
            onClick={() => setDailySummaryOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-control bg-surface-dim hover:bg-surface-container border border-amber-400/40 text-amber-300 font-label-sm text-label-sm font-bold shadow-card transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">summarize</span>
            <span>Daily Debrief</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Total Focus Time */}
          <div className="rounded-control bg-surface-container border border-outline-variant p-3 flex flex-col shadow-card">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">
              Total Deep Work
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-headline-lg text-headline-lg text-cyan-300 font-black">
                {Math.floor(profile.totalFocusMinutes / 60)}h {profile.totalFocusMinutes % 60}m
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-emerald-400 font-semibold mt-0.5">
              +140m this week
            </span>
          </div>

          {/* Streak Flame */}
          <div className="rounded-control bg-surface-container border border-outline-variant p-3 flex flex-col shadow-card">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">
              Consistency Streak
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-headline-lg text-headline-lg text-rose-400 font-black">
                {profile.streakDays} Days
              </span>
              <span className="material-symbols-outlined text-rose-500 text-[18px] fill-1">
                local_fire_department
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-amber-300 font-semibold mt-0.5">
              {profile.streakShields} Shield Safeguard
            </span>
          </div>

          {/* Quests Conquered */}
          <div className="rounded-control bg-surface-container border border-outline-variant p-3 flex flex-col shadow-card">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">
              Bounties Conquered
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-headline-lg text-headline-lg text-amber-300 font-black">
                {profile.completedQuestsCount}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">missions</span>
            </div>
            <span className="font-label-sm text-label-sm text-cyan-300 font-semibold mt-0.5">
              Top tier completion rate
            </span>
          </div>

          {/* Chests Unlocked */}
          <div className="rounded-control bg-surface-container border border-outline-variant p-3 flex flex-col shadow-card">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">
              Loot Chests Claimed
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-headline-lg text-headline-lg text-emerald-300 font-black">
                {profile.unlockedChestsCount}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">chests</span>
            </div>
            <span className="font-label-sm text-label-sm text-amber-300 font-semibold mt-0.5">
              Guaranteed rare yields
            </span>
          </div>
        </div>
      </section>

      {/* 5. RECENT VICTORY ARCHIVES */}
      <section className="flex flex-col gap-2">
        <h3 className="font-headline-sm text-headline-sm text-white font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400 text-[20px] fill-1">
            verified
          </span>
          <span>Recent Victorious Deeds</span>
        </h3>

        <div className="flex flex-col gap-2">
          {completedQuests.slice(0, 5).map(cq => (
            <div
              key={cq.id}
              className="rounded-control bg-surface-container-low border border-outline-variant/60 p-3 flex items-center justify-between shadow-card card-hover hover:border-emerald-500/40"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-emerald-400 text-[20px] fill-1">
                  check_circle
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="font-headline-sm text-headline-sm text-white font-bold truncate">
                    {cq.title}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    +{cq.xpReward} XP • +{cq.coinReward} Coins
                  </span>
                </div>
              </div>
              <span className="font-label-sm text-label-sm text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                Victorious
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. DATA BACKUP & RECOVERY VAULT */}
      <section className="rounded-card bg-surface-container border border-outline-variant p-4 flex flex-col gap-3 shadow-card">
        <h3 className="font-headline-sm text-headline-sm text-white font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-cyan-400 text-[20px]">cloud_sync</span>
          <span>Data Archives & Backup</span>
        </h3>
        <p className="font-body-sm text-body-sm text-sky-200/70">
          AUCTUS runs entirely local-first. Export a full JSON archive to safeguard your progress across devices or browser resets.
        </p>

        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            onClick={() => {
              const json = exportData();
              const blob = new Blob([json], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `auctus-backup-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="btn btn-gold py-2.5 px-3 text-label-md uppercase font-black flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export JSON</span>
          </button>

          <label className="btn btn-navy py-2.5 px-3 text-label-md uppercase font-black flex items-center justify-center gap-1.5 cursor-pointer">
            <span className="material-symbols-outlined text-[18px] text-cyan-300">upload_file</span>
            <span>Import JSON</span>
            <input
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                  const content = event.target?.result as string;
                  if (content) {
                    const success = importData(content);
                    if (success) {
                      alert('Auctus data successfully restored!');
                    } else {
                      alert('Failed to import backup. Please check file format.');
                    }
                  }
                };
                reader.readAsText(file);
              }}
            />
          </label>
        </div>
      </section>

      {/* 7. SETTINGS & SOUND PREFERENCES */}
      <section className="rounded-card bg-surface-container border border-outline-variant p-4 flex flex-col gap-3 shadow-card">
        <h3 className="font-headline-sm text-headline-sm text-white font-bold">
          Citadel Preferences
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-[20px]">
              {profile.soundEnabled ? 'volume_up' : 'volume_off'}
            </span>
            <span className="font-body-md text-body-md text-on-surface">Game Sound FX & Haptics</span>
          </div>
          <button
            onClick={toggleSound}
            className={`px-3 py-1 rounded-control font-label-sm text-label-sm font-bold transition-all ${
              profile.soundEnabled
                ? 'bg-amber-400 text-amber-950 shadow-card hover:brightness-110'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-bright hover:text-on-surface'
            }`}
          >
            {profile.soundEnabled ? 'ENABLED' : 'MUTED'}
          </button>
        </div>
      </section>

      {/* Daily Summary Debrief Modal */}
      <DailySummaryModal
        isOpen={dailySummaryOpen}
        onClose={() => setDailySummaryOpen(false)}
      />
    </div>
  );
};