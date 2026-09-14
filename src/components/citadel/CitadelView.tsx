import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { getCitadelTierConfig, canUpgradeCitadelTier } from '../../domain/citadel';
import { DailySummaryModal } from '../analytics/DailySummaryModal';
import { AchievementCategory } from '../../types';
import { TrophyIcon, FireStreakIcon, StarIcon, ShieldIcon, SwordsIcon } from '../common/GameIcons';

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
    <div className="flex flex-col w-full max-w-2xl mx-auto px-3.5 sm:px-4 pt-3 pb-24 space-y-4 text-white">
      {/* 1. COMMANDER PROFILE CARD */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-game-panel via-game-dark to-game-darker border-2 border-game-border shadow-game-card p-4 flex flex-col gap-3.5">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-accent/40 to-transparent" />
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold-accent/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3.5">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-game-darker border-2 border-gold-dark overflow-hidden shadow-game-sm flex items-center justify-center relative">
              <img src="/assets/avatar.png" alt="Commander Avatar" className="w-full h-full object-cover" />
            </div>
            <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-lg bg-gradient-to-b from-gold-accent to-gold-dark text-game-darker text-[10px] font-black border border-gold-light shadow-game-sm leading-tight">
              LV.{profile.level}
            </span>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide truncate">
                {profile.name}
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-blue-950/80 border border-blue-500/50 text-blue-400 text-[10px] uppercase font-black tracking-wider">
                {profile.leagueRank}
              </span>
            </div>
            <span className="text-xs text-gold-accent font-bold truncate mt-0.5">
              {profile.title}
            </span>
            <div className="flex items-center gap-2 text-[11px] text-gray-300 font-semibold mt-1">
              <span className="flex items-center gap-1 text-gold-accent font-black">
                <TrophyIcon size={14} />
                {profile.trophyPoints.toLocaleString()} Trophies
              </span>
              <span>•</span>
              <span className="text-blue-400 font-bold">Tier {profile.citadelTier} Citadel</span>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="flex flex-col gap-1.5 bg-game-darker/90 p-3 rounded-xl border border-game-border shadow-inner">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gold-accent font-black uppercase tracking-wider text-[10px] flex items-center gap-1">
              <StarIcon size={14} />
              Level {profile.level} Progression
            </span>
            <span className="text-gray-300 font-bold text-[11px] tabular-nums">
              {profile.xp.toLocaleString()} / {profile.xpToNextLevel.toLocaleString()} XP
            </span>
          </div>
          <div className="w-full h-2.5 bg-game-darker rounded-full overflow-hidden border border-game-border">
            <div
              className="h-full bg-gradient-to-r from-gold-dark via-gold-accent to-yellow-300 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.6)] transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* 2. CITADEL TIER ASCENDANCY */}
      <section className="rounded-2xl bg-gradient-to-b from-game-panel to-game-dark border-2 border-gold-dark/60 p-4 shadow-game-card flex flex-col gap-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-gold-accent/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-game-darker border-2 border-gold-dark flex items-center justify-center text-gold-accent shadow-game-sm">
              <ShieldIcon size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white tracking-wide">
                  {tierConfig.name}
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-gold-dark/30 text-gold-light border border-gold-dark/50 text-[10px] font-black uppercase tracking-wider">
                  Tier {tierConfig.tier}
                </span>
              </div>
              <span className="text-xs text-gold-accent font-bold">
                {tierConfig.subtitle} • +{tierConfig.xpBoostPercent}% XP Boost
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed font-medium">
          {tierConfig.description}
        </p>

        {/* Citadel Power Gauge */}
        <div className="flex flex-col gap-1.5 bg-game-darker/90 p-3 rounded-xl border border-game-border shadow-inner">
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-400 font-black uppercase text-[10px] tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              Citadel Power Battery
            </span>
            <span className="text-gray-300 font-bold text-[11px] tabular-nums">
              {profile.citadelPower.toLocaleString()} / {profile.citadelMaxPower.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-2.5 bg-game-darker rounded-full overflow-hidden border border-game-border">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)] transition-all duration-500"
              style={{ width: `${powerPercent}%` }}
            />
          </div>
        </div>

        {upgradeCheck.canUpgrade && upgradeCheck.nextTier ? (
          <button
            onClick={upgradeCitadel}
            className="btn-game-gold w-full py-3 rounded-xl text-xs uppercase tracking-widest font-black text-game-darker shadow-game-btn active:scale-95 animate-pulse flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">upgrade</span>
            <span>Ascend to {upgradeCheck.nextTier.name} (Tier {upgradeCheck.nextTier.tier})</span>
          </button>
        ) : upgradeCheck.nextTier ? (
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-game-darker border border-game-border text-xs">
            <span className="text-gray-400 flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[15px] text-gold-accent">lock</span>
              Next: <strong className="text-white font-bold">{upgradeCheck.nextTier.name}</strong>
            </span>
            <span className="text-gold-accent font-bold">{upgradeCheck.reason}</span>
          </div>
        ) : (
          <div className="text-center py-1.5 text-xs text-gold-accent font-black tracking-widest uppercase">
            ✦ PINNACLE CELESTIAL TIER ACHIEVED ✦
          </div>
        )}
      </section>

      {/* 3. PRODUCTIVITY TELEMETRY */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-gold-accent text-[20px]">analytics</span>
            <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              Productivity Telemetry
            </h3>
          </div>

          <button
            onClick={() => setDailySummaryOpen(true)}
            className="btn-game-blue px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[15px]">summarize</span>
            <span>Daily Debrief</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl bg-game-panel border-2 border-game-border p-3.5 flex flex-col shadow-game-card">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
              Deep Work Time
            </span>
            <span className="text-base sm:text-lg font-black text-white mt-0.5 tabular-nums">
              {Math.floor(profile.totalFocusMinutes / 60)}h {profile.totalFocusMinutes % 60}m
            </span>
            <span className="text-[10px] text-green-400 font-bold mt-1">High Focus Yield</span>
          </div>

          <div className="rounded-2xl bg-game-panel border-2 border-game-border p-3.5 flex flex-col shadow-game-card">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
              Consistency Streak
            </span>
            <span className="text-base sm:text-lg font-black text-gold-accent mt-0.5 flex items-center gap-1.5">
              <span>{profile.streakDays} Days</span>
              <FireStreakIcon size={18} />
            </span>
            <span className="text-[10px] text-blue-400 font-bold mt-1">
              {profile.streakShields} Shield{profile.streakShields !== 1 ? 's' : ''} Armed
            </span>
          </div>

          <div className="rounded-2xl bg-game-panel border-2 border-game-border p-3.5 flex flex-col shadow-game-card">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
              Bounties Conquered
            </span>
            <span className="text-base sm:text-lg font-black text-white mt-0.5 flex items-center gap-1.5">
              <span>{profile.completedQuestsCount}</span>
              <SwordsIcon size={18} className="text-red-400" />
            </span>
            <span className="text-[10px] text-gray-400 font-semibold mt-1">Completed Quests</span>
          </div>

          <div className="rounded-2xl bg-game-panel border-2 border-game-border p-3.5 flex flex-col shadow-game-card">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
              Chests Claimed
            </span>
            <span className="text-base sm:text-lg font-black text-white mt-0.5 flex items-center gap-1.5">
              <span>{profile.unlockedChestsCount}</span>
              <span className="material-symbols-outlined text-[18px] text-gold-accent">redeem</span>
            </span>
            <span className="text-[10px] text-gold-accent font-semibold mt-1">Rare Loot Drops</span>
          </div>
        </div>
      </section>

      {/* 4. HALL OF ACHIEVEMENTS */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <TrophyIcon size={18} />
            <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              Hall of Achievements
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-gold-dark/30 border border-gold-dark/50 text-[10px] text-gold-light font-black uppercase tracking-wider">
            {unlockedCount} / {achievements.length} Unlocked
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {(['all', 'focus', 'quests', 'habits', 'economy', 'citadel'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setAchievementFilter(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-black capitalize whitespace-nowrap transition-all ${
                achievementFilter === cat
                  ? 'btn-game-gold text-game-darker text-[11px]'
                  : 'btn-game-dark text-gray-400 hover:text-white text-[11px]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Achievement List */}
        <div className="flex flex-col gap-2.5">
          {filteredAchievements.map(ach => {
            const isCompleted = ach.isUnlocked;
            const progressPercent = Math.min(100, Math.round((ach.currentValue / ach.targetValue) * 100));

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border-2 flex flex-col gap-2.5 shadow-game-card transition-all ${
                  isCompleted
                    ? 'bg-game-panel border-gold-dark/70'
                    : 'bg-game-panel/60 border-game-border opacity-75'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border-2 ${
                      isCompleted
                        ? 'bg-game-darker border-gold-dark text-gold-accent shadow-game-sm'
                        : 'bg-game-darker border-game-border text-gray-500'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{ach.icon}</span>
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs sm:text-sm font-black text-white truncate">
                        {ach.title}
                      </h4>
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-green-400 text-[18px]">
                          check_circle
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-bold tabular-nums">
                          {ach.currentValue} / {ach.targetValue}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-300 font-medium line-clamp-1 mt-0.5">
                      {ach.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-black text-gold-accent pt-1.5 border-t border-game-border/80">
                  <span className="flex items-center gap-1">
                    <StarIcon size={12} />
                    +{ach.rewards.xp} XP {ach.rewards.coins ? `• +${ach.rewards.coins} Gold` : ''}
                  </span>
                  {!isCompleted && (
                    <div className="w-24 bg-game-darker h-2 rounded-full overflow-hidden border border-game-border">
                      <div
                        className="bg-gradient-to-r from-gold-dark to-gold-accent h-full rounded-full shadow-[0_0_6px_rgba(245,158,11,0.5)]"
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

      {/* 5. DATA BACKUP & PREFERENCES */}
      <section className="rounded-2xl bg-game-panel border-2 border-game-border p-4 flex flex-col gap-3 shadow-game-card">
        <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
          <span className="material-symbols-outlined text-gold-accent text-[20px]">cloud_sync</span>
          <span>Local Data Vault & Settings</span>
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
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
            className="btn-game-blue py-2.5 px-3 rounded-xl text-xs uppercase font-black tracking-wider flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Export Backup</span>
          </button>

          <label className="btn-game-dark py-2.5 px-3 rounded-xl text-xs uppercase font-black tracking-wider flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 text-gray-300 hover:text-white">
            <span className="material-symbols-outlined text-[16px] text-gold-accent">upload_file</span>
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

        <div className="flex items-center justify-between pt-2.5 border-t-2 border-game-border">
          <span className="text-xs text-gray-300 font-bold">Sound FX & Haptics</span>
          <button
            onClick={toggleSound}
            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              profile.soundEnabled
                ? 'btn-game-green text-white'
                : 'btn-game-dark text-gray-400'
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