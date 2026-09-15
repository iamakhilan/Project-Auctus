import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { soundEngine } from '../../utils/audioSynthesizer';

export const CitadelView: React.FC = () => {
  const {
    profile,
    achievements,
    ascendCitadel,
    exportData,
    importData,
    openClaimModal,
    addXp,
    addGems,
  } = useGameState();

  const [activeCategory, setActiveCategory] = useState<'all' | 'focus' | 'quests' | 'habits' | 'citadel' | 'streak'>('all');
  const [importJsonText, setImportJsonText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const tiers = [
    { tier: 1, name: 'Pathfinder Outpost', icon: '🏕️', perk: '+5% XP Boost', minPower: 200 },
    { tier: 2, name: 'Sentinel Stronghold', icon: '🏰', perk: '+10% Quest XP & +10% Gold', minPower: 500 },
    { tier: 3, name: 'Aegis Bastion', icon: '🛡️', perk: '+20% XP & Chests unlock 15% faster', minPower: 1000 },
    { tier: 4, name: 'Sovereign Citadel', icon: '👑', perk: '+35% XP & +25% Gold on all missions', minPower: 2000 },
    { tier: 5, name: 'Celestial Spire', icon: '✨', perk: 'Supreme Ascendant: 2.0x permanent boost', minPower: 5000 },
  ];

  const currentTierInfo = tiers.find((t) => t.tier === profile.citadelTier) || tiers[0];
  const nextTierInfo = tiers.find((t) => t.tier === profile.citadelTier + 1);

  const canAscend = profile.citadelPower >= profile.citadelMaxPower && !!nextTierInfo;

  const handleAscend = () => {
    if (canAscend) {
      ascendCitadel();
    } else {
      soundEngine.playClick();
    }
  };

  const handleClaimAchievement = (ach: typeof achievements[0]) => {
    soundEngine.playSuccess();
    if (ach.rewards.xp) addXp(ach.rewards.xp);
    if (ach.rewards.gems) addGems(ach.rewards.gems, `Achievement: ${ach.title}`);
    
    openClaimModal({
      title: 'Trophy Claimed!',
      subtitle: ach.title,
      description: ach.description,
      xp: ach.rewards.xp,
      gems: ach.rewards.gems,
      icon: ach.icon || '🏆',
    });
  };

  const handleExport = () => {
    soundEngine.playClick();
    const data = exportData();
    navigator.clipboard.writeText(data);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const success = importData(importJsonText);
    if (success) {
      soundEngine.playSuccess();
      setImportStatus('Backup restored successfully!');
      setImportJsonText('');
    } else {
      setImportStatus('Failed to parse JSON backup. Please verify format.');
    }
    setTimeout(() => setImportStatus(null), 3000);
  };

  const filteredAchievements = achievements.filter((a) => {
    if (activeCategory === 'all') return true;
    return a.category === activeCategory;
  });

  const powerPercent = Math.min(100, Math.round((profile.citadelPower / profile.citadelMaxPower) * 100));

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-fadeIn select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Feather_Bold'] text-2xl sm:text-3xl text-[var(--dark-blue)] tracking-wide">
            CITADEL & PRESTIGE
          </h1>
          <p className="text-sm font-bold text-[var(--gray-light)]">
            Ascend citadel tiers, claim trophy medals, and safeguard your productivity archives!
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-2xl bg-[#f5f3ff] border-2 border-[#ddd6fe] text-[#7c3aed] font-black text-xs uppercase flex items-center gap-2">
          <span>{currentTierInfo.icon}</span>
          <span>Tier {profile.citadelTier}: {currentTierInfo.name}</span>
        </div>
      </div>

      {/* Citadel Ascension Battery Card */}
      <div className="bg-gradient-to-r from-[#2e1065] to-[#4c1d95] rounded-3xl p-6 sm:p-8 text-white shadow-lg border-b-6 border-[#1e1b4b] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-black uppercase text-[#e9d5ff]">
              <span>👑 Sovereign Stronghold</span>
              <span>•</span>
              <span>Permanent Buffs</span>
            </div>
            <h2 className="font-['Feather_Bold'] text-2xl sm:text-3xl tracking-wide text-white">
              {currentTierInfo.name} (Tier {profile.citadelTier})
            </h2>
            <p className="text-white/80 font-bold text-xs sm:text-sm max-w-lg">
              Active Perks: <span className="text-[#fde047]">{currentTierInfo.perk}</span>
            </p>
          </div>

          {/* Power Battery Gauge & Ascend Button */}
          <div className="bg-black/30 p-5 rounded-2xl border border-white/10 w-full md:w-72 text-center space-y-3">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-[#e9d5ff] uppercase">Citadel Power</span>
              <span className="text-white">{profile.citadelPower} / {profile.citadelMaxPower}</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] rounded-full transition-all duration-500"
                style={{ width: `${powerPercent}%` }}
              />
            </div>

            <button
              onClick={handleAscend}
              disabled={!canAscend}
              className={`w-full h-11 rounded-2xl font-['Feather_Bold'] text-xs font-black uppercase transition-all ${
                canAscend
                  ? 'bg-[var(--golden)] hover:bg-[#e0b000] text-[var(--dark-blue)] border-b-4 border-[#b88c00] active:translate-y-0.5 active:border-b-0 cursor-pointer shadow-md animate-bounce'
                  : 'bg-white/10 text-white/40 cursor-not-allowed border-2 border-white/5'
              }`}
            >
              {nextTierInfo
                ? canAscend
                  ? `⚡ ASCEND TO TIER ${nextTierInfo.tier}!`
                  : `REQUIRES ${profile.citadelMaxPower} POWER`
                : 'MAX TIER REACHED 👑'}
            </button>
          </div>
        </div>
      </div>

      {/* Hall of Trophies (Achievements) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-[#e5e5e5] pb-4">
          <div>
            <h2 className="font-['Feather_Bold'] text-xl text-[var(--dark-blue)] flex items-center gap-2">
              <span>🏆</span> HALL OF TROPHIES ({achievements.filter((a) => a.isUnlocked).length}/{achievements.length})
            </h2>
            <p className="text-xs font-bold text-[var(--gray-light)]">
              Complete epic career milestones to unlock rare badges and gems!
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'focus', label: 'Focus' },
              { id: 'quests', label: 'Quests' },
              { id: 'habits', label: 'Habits' },
              { id: 'streak', label: 'Streak' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveCategory(c.id as typeof activeCategory);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === c.id
                    ? 'bg-[var(--dark-blue)] text-white'
                    : 'bg-[#f0f0f0] text-[var(--gray-text)] hover:bg-[#e5e5e5]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((ach) => {
            const isCompleted = ach.isUnlocked;
            const progress = Math.min(100, Math.round((ach.currentValue / ach.targetValue) * 100));

            return (
              <div
                key={ach.id}
                className={`rounded-3xl border-2 p-5 shadow-xs flex flex-col justify-between space-y-3 transition-all ${
                  isCompleted
                    ? 'bg-[#fffbeb] border-[#fde68a]'
                    : 'bg-white border-[#e5e5e5]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{ach.icon || '🏅'}</span>
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#f7f7f7] text-[var(--gray-light)]">
                      {ach.category}
                    </span>
                  </div>

                  <h3 className="font-['Feather_Bold'] text-base text-[var(--dark-blue)]">
                    {ach.title}
                  </h3>
                  <p className="text-xs text-[var(--gray-text)] font-semibold mt-0.5">
                    {ach.description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[var(--gray-light)]">
                    <span>Progress</span>
                    <span>{ach.currentValue} / {ach.targetValue}</span>
                  </div>
                  <div className="w-full h-2 bg-[#e5e5e5] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-[var(--golden)]' : 'bg-[var(--blue)]'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Reward & Status */}
                <div className="pt-2 flex items-center justify-between border-t border-[#f0f0f0]">
                  <div className="flex items-center gap-2 text-xs font-black">
                    <span className="text-[var(--blue)]">+{ach.rewards.xp} XP</span>
                    {ach.rewards.gems && (
                      <span className="text-[#db2777]">+{ach.rewards.gems} 💎</span>
                    )}
                  </div>

                  {isCompleted ? (
                    <button
                      onClick={() => handleClaimAchievement(ach)}
                      className="px-3 py-1 rounded-xl bg-[var(--golden)] text-[var(--dark-blue)] font-black text-xs uppercase shadow-xs hover:scale-105 transition-transform cursor-pointer"
                    >
                      CLAIMED 🌟
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-[var(--gray-light)]">
                      {progress}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Archivist (Vault Backup & Restore) */}
      <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#f0f0f0] pb-3">
          <div>
            <h3 className="font-['Feather_Bold'] text-lg text-[var(--dark-blue)] flex items-center gap-2">
              <span>💾</span> DATA ARCHIVIST & VAULT BACKUP
            </h3>
            <p className="text-xs font-bold text-[var(--gray-light)]">
              Export and import your game save file locally at any time.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export */}
          <div className="p-4 bg-[#f8fafc] rounded-2xl border-2 border-[#e2e8f0] space-y-3">
            <h4 className="font-['Feather_Bold'] text-sm text-[var(--dark-blue)]">
              Export Productivity Data (JSON)
            </h4>
            <p className="text-xs text-[var(--gray-text)] font-semibold">
              Creates a portable snapshot of all your quests, habits, chests, and player levels.
            </p>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-[var(--blue)] hover:bg-[#0095de] text-white font-['Feather_Bold'] text-xs font-black uppercase rounded-xl border-b-3 border-[#0b80ba] active:translate-y-0.5 transition-all cursor-pointer shadow-xs"
            >
              {copySuccess ? 'COPIED TO CLIPBOARD! ✅' : '📋 EXPORT TO CLIPBOARD'}
            </button>
          </div>

          {/* Import */}
          <div className="p-4 bg-[#f8fafc] rounded-2xl border-2 border-[#e2e8f0] space-y-3">
            <h4 className="font-['Feather_Bold'] text-sm text-[var(--dark-blue)]">
              Import Productivity Data (JSON)
            </h4>
            <input
              type="text"
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste JSON save data string here..."
              className="w-full px-3 py-1.5 rounded-xl border border-[#cbd5e1] font-mono text-xs focus:border-[var(--blue)] focus:outline-hidden"
            />
            {importStatus && (
              <div className="text-xs font-bold text-[var(--blue)]">{importStatus}</div>
            )}
            <button
              onClick={handleImport}
              className="px-4 py-2 bg-[var(--green)] hover:bg-[var(--green-hover)] text-white font-['Feather_Bold'] text-xs font-black uppercase rounded-xl border-b-3 border-[var(--green-shadow)] active:translate-y-0.5 transition-all cursor-pointer shadow-xs"
            >
              📥 RESTORE BACKUP
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};