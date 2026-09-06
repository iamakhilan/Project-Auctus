import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { getCitadelTierConfig, canUpgradeCitadelTier } from '../../domain/citadel';
import { DailySummaryModal } from '../analytics/DailySummaryModal';
import { AchievementCategory } from '../../types';

export const CitadelView: React.FC = () => {
  const {
    profile,
    toggleSound,
    achievements,
    upgradeCitadel,
    exportData,
    importData,
  } = useGameState();

  const [achievementFilter, setAchievementFilter] = useState<AchievementCategory | 'all'>('all');
  const [dailySummaryOpen, setDailySummaryOpen] = useState(false);

  const xpPercent = Math.min(100, Math.round((profile.xp / profile.xpToNextLevel) * 100));
  const tierConfig = getCitadelTierConfig(profile.citadelTier || 1);
  const upgradeCheck = canUpgradeCitadelTier(profile);
  const powerPercent = Math.min(100, Math.round((profile.citadelPower / profile.citadelMaxPower) * 100));

  const filteredAchievements = achievements.filter(
    a => achievementFilter === 'all' || a.category === achievementFilter
  );
  const unlockedCount = achievements.filter(a => a.isUnlocked).length;

  return (
    <div className="flex flex-col w-full max-w-screen mx-auto px-3.5 sm:px-4 pt-3 pb-8 space-y-4">
      {/* 1. COMMANDER PROFILE CARD */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-surface-container via-surface-container to-surface-container-low border border-accent/60 p-4 shadow-card flex flex-col gap-3">
        <div className="flex items-center gap-3.5">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-surface-container-high border-2 border-accent overflow-hidden shadow-card flex items-center justify-center">
              <img src="/assets/avatar.png" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-gradient-to-r from-primary to-accent text-light text-[10px] font-black border border-secondary/60 shadow-sm leading-tight">
              LV.{profile.level}
            </span>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-headline-sm text-base sm:text-lg text-light font-extrabold truncate">
                {profile.name}
              </h2>
              <span className="px-2 py-0.5 rounded bg-primary/30 border border-secondary/40 text-light font-label-sm text-[10px] uppercase font-bold">
                {profile.leagueRank}
              </span>
            </div>
            <span className="text-xs text-secondary font-semibold truncate mt-0.5">
              {profile.title}
            </span>
            <span className="text-[11px] text-on-surface-variant font-medium mt-0.5">
              {profile.trophyPoints.toLocaleString()} Trophies • Tier {profile.citadelTier} Citadel
            </span>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="flex flex-col gap-1 bg-surface-dim p-2.5 rounded-xl border border-outline-variant/40">
          <div className="flex items-center justify-between text-xs">
            <span className="text-secondary font-bold">Level {profile.level} Progression</span>
            <span className="text-on-surface-variant font-semibold">
              {profile.xp.toLocaleString()} / {profile.xpToNextLevel.toLocaleString()} XP
            </span>
          </div>
          <div className="w-full h-2 bg-surface-container-lowest rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full shadow-primary-aura transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* 2. CITADEL TIER ASCENDANCY */}
      <section className="rounded-2xl bg-surface-container border border-accent/40 p-4 shadow-card flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-navy-hi border border-accent/40 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">account_balance</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-sm sm:text-base text-light font-extrabold">
                  {tierConfig.name}
                </h3>
                <span className="px-2 py-0.2 rounded bg-primary/30 text-light border border-secondary/40 text-[10px] font-bold">
                  Tier {tierConfig.tier}
                </span>
              </div>
              <span className="text-xs text-secondary font-medium">
                {tierConfig.subtitle} • +{tierConfig.xpBoostPercent}% XP Perk
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">
          {tierConfig.description}
        </p>

        {/* Citadel Power Gauge */}
        <div className="flex flex-col gap-1 bg-surface-dim p-2.5 rounded-xl border border-outline-variant/40">
          <div className="flex items-center justify-between text-xs">
            <span className="text-secondary font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              Power Stored
            </span>
            <span className="text-on-surface-variant font-bold">
              {profile.citadelPower.toLocaleString()} / {profile.citadelMaxPower.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-2 bg-surface-container-lowest rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full shadow-primary-aura transition-all duration-500"
              style={{ width: `${powerPercent}%` }}
            />
          </div>
        </div>

        {upgradeCheck.canUpgrade && upgradeCheck.nextTier ? (
          <button
            onClick={upgradeCitadel}
            className="btn btn-primary w-full h-11 font-headline-sm text-xs uppercase tracking-wider font-black shadow-md animate-pulse"
          >
            <span className="material-symbols-outlined text-[18px]">upgrade</span>
            <span>Ascend to {upgradeCheck.nextTier.name} (Tier {upgradeCheck.nextTier.tier})</span>
          </button>
        ) : upgradeCheck.nextTier ? (
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-dim border border-outline-variant/40 text-xs">
            <span className="text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-secondary">lock</span>
              Next: <strong className="text-light">{upgradeCheck.nextTier.name}</strong>
            </span>
            <span className="text-secondary font-semibold">{upgradeCheck.reason}</span>
          </div>
        ) : (
          <div className="text-center py-1 text-xs text-light font-black">
            ✦ PINNACLE CELESTIAL TIER ACHIEVED ✦
          </div>
        )}
      </section>

      {/* 3. PRODUCTIVITY TELEMETRY */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">analytics</span>
            <h3 className="font-headline-sm text-sm text-light font-extrabold">
              Productivity Telemetry
            </h3>
          </div>

          <button
            onClick={() => setDailySummaryOpen(true)}
            className="flex items-center gap-1 px-3 py-1 rounded-xl bg-surface-dim hover:bg-surface-container border border-accent/40 text-secondary text-xs font-bold transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[15px]">summarize</span>
            <span>Daily Debrief</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-surface-container border border-outline-variant p-3 flex flex-col shadow-sm">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase">Total Deep Work</span>
            <span className="font-headline-lg text-base sm:text-lg text-light font-black mt-0.5">
              {Math.floor(profile.totalFocusMinutes / 60)}h {profile.totalFocusMinutes % 60}m
            </span>
            <span className="text-[10px] text-secondary font-semibold mt-0.5">+140m this week</span>
          </div>

          <div className="rounded-xl bg-surface-container border border-outline-variant p-3 flex flex-col shadow-sm">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase">Consistency Streak</span>
            <span className="font-headline-lg text-base sm:text-lg text-light font-black mt-0.5 flex items-center gap-1">
              <span>{profile.streakDays} Days</span>
              <span className="material-symbols-outlined text-[16px] fill-1 text-accent">local_fire_department</span>
            </span>
            <span className="text-[10px] text-secondary font-semibold mt-0.5">{profile.streakShields} Shields Active</span>
          </div>

          <div className="rounded-xl bg-surface-container border border-outline-variant p-3 flex flex-col shadow-sm">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase">Bounties Conquered</span>
            <span className="font-headline-lg text-base sm:text-lg text-light font-black mt-0.5">
              {profile.completedQuestsCount} <span className="text-xs text-on-surface-variant font-medium">missions</span>
            </span>
            <span className="text-[10px] text-secondary font-semibold mt-0.5">High completion pace</span>
          </div>

          <div className="rounded-xl bg-surface-container border border-outline-variant p-3 flex flex-col shadow-sm">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase">Chests Claimed</span>
            <span className="font-headline-lg text-base sm:text-lg text-light font-black mt-0.5">
              {profile.unlockedChestsCount} <span className="text-xs text-on-surface-variant font-medium">chests</span>
            </span>
            <span className="text-[10px] text-secondary font-semibold mt-0.5">Guaranteed rare loot</span>
          </div>
        </div>
      </section>

      {/* 4. HALL OF ACHIEVEMENTS */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">military_tech</span>
            <h3 className="font-headline-sm text-sm text-light font-extrabold">
              Hall of Achievements
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-primary/30 border border-secondary/40 text-[10px] text-light font-black">
            {unlockedCount} / {achievements.length} Unlocked
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 custom-scrollbar">
          {(['all', 'focus', 'quests', 'habits', 'economy', 'citadel'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setAchievementFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold capitalize whitespace-nowrap transition-all ${
                achievementFilter === cat
                  ? 'bg-navy-hi border border-accent text-light shadow-sm'
                  : 'bg-surface-dim text-on-surface-variant hover:text-light border border-outline-variant/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Achievement List */}
        <div className="flex flex-col gap-2">
          {filteredAchievements.map(ach => {
            const isCompleted = ach.isUnlocked;
            const progressPercent = Math.min(100, Math.round((ach.currentValue / ach.targetValue) * 100));

            return (
              <div
                key={ach.id}
                className={`p-3 rounded-xl border flex flex-col gap-2 shadow-card transition-all ${
                  isCompleted
                    ? 'bg-surface-container border-accent/50'
                    : 'bg-surface-container/60 border-outline-variant/60 opacity-80'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isCompleted ? 'bg-accent text-light font-bold' : 'bg-surface-dim text-on-surface-variant'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">{ach.icon}</span>
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-headline-sm text-xs sm:text-sm text-light font-bold truncate">
                        {ach.title}
                      </h4>
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      ) : (
                        <span className="text-[10px] text-on-surface-variant font-bold">
                          {ach.currentValue} / {ach.targetValue}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                      {ach.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold text-secondary pt-1 border-t border-outline-variant/30">
                  <span>+{ach.rewards.xp} XP {ach.rewards.coins ? `• +${ach.rewards.coins} G` : ''}</span>
                  {!isCompleted && (
                    <div className="w-20 bg-surface-dim h-1.5 rounded-full overflow-hidden">
                      <div className="bg-accent h-full rounded-full" style={{ width: `${progressPercent}%` }} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. DATA BACKUP & PREFERENCES */}
      <section className="rounded-2xl bg-surface-container border border-outline-variant p-4 flex flex-col gap-3 shadow-card">
        <h3 className="font-headline-sm text-sm text-light font-extrabold flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[18px]">cloud_sync</span>
          <span>Local-First Data & Settings</span>
        </h3>

        <div className="grid grid-cols-2 gap-2">
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
            className="btn btn-primary py-2.5 px-3 text-xs uppercase font-black flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Export Backup</span>
          </button>

          <label className="btn btn-secondary py-2.5 px-3 text-xs uppercase font-black flex items-center justify-center gap-1.5 cursor-pointer">
            <span className="material-symbols-outlined text-[16px] text-secondary">upload_file</span>
            <span>Import Backup</span>
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

        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/40">
          <span className="text-xs text-on-surface font-medium">Sound FX & Haptics</span>
          <button
            onClick={toggleSound}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              profile.soundEnabled
                ? 'bg-accent text-light font-black shadow-sm'
                : 'bg-surface-dim text-on-surface-variant border border-outline-variant'
            }`}
          >
            {profile.soundEnabled ? 'ENABLED' : 'MUTED'}
          </button>
        </div>
      </section>

      {/* Daily Debrief Modal */}
      <DailySummaryModal
        isOpen={dailySummaryOpen}
        onClose={() => setDailySummaryOpen(false)}
      />
    </div>
  );
};