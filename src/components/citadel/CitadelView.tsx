import React, { useState, useEffect, useMemo } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { soundEngine } from '../../utils/audioSynthesizer';

const TIER_DEFS = [
  { tier: 1, name: 'Pathfinder Outpost', icon: '🏕️', perk: '+5% XP Boost', detail: 'Starter discipline multiplier', minPower: 200 },
  { tier: 2, name: 'Sentinel Stronghold', icon: '🏰', perk: '+10% Quest XP & +10% Gold', detail: 'Gold yields enhanced', minPower: 500 },
  { tier: 3, name: 'Aegis Bastion', icon: '🛡️', perk: '+20% XP & Chests unlock 15% faster', detail: 'Chest timers reduced', minPower: 1000 },
  { tier: 4, name: 'Sovereign Citadel', icon: '👑', perk: '+35% XP & +25% Gold on all missions', detail: 'Elite mission bonus', minPower: 2000 },
  { tier: 5, name: 'Celestial Spire', icon: '✨', perk: 'Supreme Ascendant: 2.0x permanent boost', detail: 'Max ascension perk', minPower: 5000 },
] as const;

function validateImportJson(raw: string): { ok: boolean; error?: string; parsed?: unknown } {
  if (!raw.trim()) return { ok: false, error: 'Paste JSON backup first.' };
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid JSON';
    return { ok: false, error: `Malformed JSON: ${msg}` };
  }
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, error: 'Root must be a JSON object (not array/null).' };
  }
  const obj = data as Record<string, unknown>;
  const allowedKeys = ['profile', 'quests', 'habits', 'chests', 'rewards', 'achievements', 'transactions', 'exportedAt'];
  const hasAny = allowedKeys.some((k) => k in obj);
  if (!hasAny) return { ok: false, error: 'Missing backup keys. Expected one of: profile, quests, habits, chests, rewards, achievements, transactions.' };
  // shallow shape checks
  if ('profile' in obj && obj.profile !== null && typeof obj.profile !== 'object') return { ok: false, error: 'profile must be an object.' };
  if ('quests' in obj && !Array.isArray(obj.quests)) return { ok: false, error: 'quests must be an array.' };
  if ('habits' in obj && !Array.isArray(obj.habits)) return { ok: false, error: 'habits must be an array.' };
  if ('chests' in obj && !Array.isArray(obj.chests)) return { ok: false, error: 'chests must be an array.' };
  if ('rewards' in obj && !Array.isArray(obj.rewards)) return { ok: false, error: 'rewards must be an array.' };
  if ('achievements' in obj && !Array.isArray(obj.achievements)) return { ok: false, error: 'achievements must be an array.' };
  if ('transactions' in obj && !Array.isArray(obj.transactions)) return { ok: false, error: 'transactions must be an array.' };
  if ('profile' in obj && obj.profile && typeof obj.profile === 'object') {
    const p = obj.profile as Record<string, unknown>;
    if ('citadelTier' in p && typeof p.citadelTier !== 'number') return { ok: false, error: 'profile.citadelTier must be a number.' };
    if ('citadelPower' in p && typeof p.citadelPower !== 'number') return { ok: false, error: 'profile.citadelPower must be a number.' };
    if ('level' in p && typeof p.level !== 'number') return { ok: false, error: 'profile.level must be a number.' };
  }
  // size guard
  if (raw.length > 2_000_000) return { ok: false, error: 'Backup too large (>2MB). File may be corrupted.' };
  return { ok: true, parsed: data };
}

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
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [importFieldError, setImportFieldError] = useState<string | null>(null);
  const [powerTick, setPowerTick] = useState(0);

  // animated power tick pulse every 1.6s
  useEffect(() => {
    const id = setInterval(() => setPowerTick((t) => t + 1), 1600);
    return () => clearInterval(id);
  }, []);

  const currentTierInfo = TIER_DEFS.find((t) => t.tier === profile.citadelTier) || TIER_DEFS[0];
  const nextTierInfo = TIER_DEFS.find((t) => t.tier === profile.citadelTier + 1);
  const canAscend = profile.citadelPower >= profile.citadelMaxPower && !!nextTierInfo;
  const powerPercent = Math.min(100, Math.round((profile.citadelPower / profile.citadelMaxPower) * 100));

  const handleAscend = () => {
    if (canAscend) ascendCitadel();
    else soundEngine.playClick();
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
    setImportFieldError(null);
    setImportStatus(null);
    const validation = validateImportJson(importJsonText);
    if (!validation.ok) {
      setImportFieldError(validation.error || 'Invalid backup');
      setImportStatus({ type: 'error', msg: validation.error || 'Import rejected' });
      soundEngine.playClick();
      return;
    }
    const success = importData(importJsonText);
    if (success) {
      soundEngine.playSuccess();
      setImportStatus({ type: 'success', msg: 'Backup restored successfully!' });
      setImportJsonText('');
      setImportFieldError(null);
    } else {
      setImportStatus({ type: 'error', msg: 'Restore failed — storage rejected backup.' });
      setImportFieldError('Restore failed — check console for details.');
    }
    setTimeout(() => setImportStatus(null), 3500);
  };

  const filteredAchievements = useMemo(() => {
    if (activeCategory === 'all') return achievements;
    return achievements.filter((a) => a.category === activeCategory);
  }, [achievements, activeCategory]);

  const liveValidation = useMemo(() => {
    if (!importJsonText.trim()) return null;
    return validateImportJson(importJsonText);
  }, [importJsonText]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-fadeIn select-none">
      <style>{`
        @keyframes citadel-power-pulse {
          0%, 100% { transform: scale(1); opacity: 0.85; box-shadow: 0 0 0 0 rgba(168,85,247,0.45); }
          50% { transform: scale(1.03); opacity: 1; box-shadow: 0 0 0 8px rgba(168,85,247,0); }
        }
        @keyframes citadel-tick-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        .citadel-pulse { animation: citadel-power-pulse 1.6s ease-in-out infinite; }
        .citadel-tick-dot { animation: citadel-tick-glow 1.6s ease-in-out infinite; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Feather_Bold'] text-2xl sm:text-3xl text-[var(--dark-blue)] tracking-wide">CITADEL & PRESTIGE</h1>
          <p className="text-sm font-bold text-[var(--gray-light)]">Ascend citadel tiers, claim trophy medals, and safeguard your productivity archives!</p>
        </div>
        <div className="px-3.5 py-1.5 rounded-2xl bg-[#f5f3ff] border-2 border-[#ddd6fe] text-[#7c3aed] font-black text-xs uppercase flex items-center gap-2">
          <span className="citadel-tick-dot inline-block w-2 h-2 rounded-full bg-[#a855f7]" style={{ animationDelay: `${powerTick % 2 ? '0s' : '0.8s'}` }} />
          <span>{currentTierInfo.icon}</span>
          <span>Tier {profile.citadelTier}: {currentTierInfo.name}</span>
        </div>
      </div>

      {/* Citadel Ascension Battery Card */}
      <div className="bg-gradient-to-r from-[#2e1065] to-[#4c1d95] rounded-3xl p-6 sm:p-8 text-white shadow-lg border-b-6 border-[#1e1b4b] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl citadel-tick-dot" />
          <div className="absolute left-1/3 top-1/2 w-32 h-32 rounded-full bg-[#ec4899]/10 blur-2xl" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-black uppercase text-[#e9d5ff]">
              <span className="w-2 h-2 rounded-full bg-[#fde047] citadel-tick-dot inline-block" />
              <span>Sovereign Stronghold</span>
              <span>•</span>
              <span>Permanent Buffs</span>
            </div>
            <h2 className="font-['Feather_Bold'] text-2xl sm:text-3xl tracking-wide text-white">
              {currentTierInfo.name} (Tier {profile.citadelTier})
            </h2>
            <p className="text-white/80 font-bold text-xs sm:text-sm max-w-lg">
              Active Perks: <span className="text-[#fde047]">{currentTierInfo.perk}</span>
            </p>
            <p className="text-white/50 font-bold text-[11px]">{currentTierInfo.detail}</p>
          </div>

          {/* Power Battery Gauge & Ascend Button */}
          <div className="bg-black/30 p-5 rounded-3xl border-2 border-white/10 w-full md:w-80 text-center space-y-3">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-[#e9d5ff] uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#a855f7] citadel-tick-dot inline-block" /> Citadel Power
              </span>
              <span className="text-white font-mono">{profile.citadelPower} / {profile.citadelMaxPower}</span>
            </div>
            <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden border border-white/10 p-1">
              <div
                className="h-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] rounded-full transition-all duration-700 citadel-pulse"
                style={{ width: `${powerPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold text-white/60">
              <span>{powerPercent}% charged</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] citadel-tick-dot inline-block" /> live tick
              </span>
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
              {nextTierInfo ? (canAscend ? `⚡ ASCEND TO TIER ${nextTierInfo.tier}!` : `REQUIRES ${profile.citadelMaxPower} POWER`) : 'MAX TIER REACHED 👑'}
            </button>
            {nextTierInfo && !canAscend && (
              <p className="text-[11px] font-bold text-white/50">Need {Math.max(0, profile.citadelMaxPower - profile.citadelPower)} more power to ascend</p>
            )}
          </div>
        </div>
      </div>

      {/* Richer Tier Perk Comparison Table */}
      <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] overflow-hidden shadow-xs">
        <div className="px-5 sm:px-6 py-4 border-b-2 border-[#e5e5e5] flex items-center justify-between gap-3">
          <div>
            <h3 className="font-['Feather_Bold'] text-base sm:text-lg text-[var(--dark-blue)] flex items-center gap-2">
              <span>⚖️</span> TIER PERK COMPARISON
            </h3>
            <p className="text-xs font-bold text-[var(--gray-light)]">Compare ascension rewards across all citadel tiers</p>
          </div>
          <span className="hidden sm:inline-flex text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-[#f5f3ff] border-2 border-[#ddd6fe] text-[#7c3aed]">You: Tier {profile.citadelTier}</span>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#fafafa] border-b-2 border-[#e5e5e5] text-[11px] font-black uppercase text-[var(--gray-light)]">
                <th className="text-left px-4 py-2.5">Tier</th>
                <th className="text-left px-4 py-2.5">Stronghold</th>
                <th className="text-left px-4 py-2.5">Min Power</th>
                <th className="text-left px-4 py-2.5">Perks</th>
                <th className="text-right px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0]">
              {TIER_DEFS.map((t) => {
                const isCurrent = t.tier === profile.citadelTier;
                const isUnlocked = profile.citadelTier >= t.tier;
                const isNext = nextTierInfo?.tier === t.tier;
                return (
                  <tr key={t.tier} className={`${isCurrent ? 'bg-[#fffbeb] border-l-4 border-l-[var(--golden)]' : isUnlocked ? 'bg-white' : 'bg-[#fafafa]/60'} hover:bg-[#f8fafc] transition-colors`}>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl border-2 font-black text-xs ${isCurrent ? 'bg-[var(--golden)] border-[#b88c00] text-[var(--dark-blue)] citadel-pulse' : isUnlocked ? 'bg-[#eef8ff] border-[#b9e5fb] text-[var(--blue)]' : 'bg-white border-[#e5e5e5] text-[var(--gray-light)]'}`}>{t.tier}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{t.icon}</span>
                        <div>
                          <div className={`font-['Feather_Bold'] text-sm ${isCurrent ? 'text-[var(--dark-blue)]' : 'text-[var(--dark-blue)]'}`}>{t.name}</div>
                          <div className="text-[11px] font-bold text-[var(--gray-light)]">{t.detail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-bold text-[var(--gray-text)]">{t.minPower.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-black px-2 py-1 rounded-xl border ${isCurrent ? 'bg-[#fff5ea] border-[#ffd6a5] text-[var(--orange)]' : 'bg-[#f7f7f7] border-[#e5e5e5] text-[var(--gray-text)]'}`}>{t.perk}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--green)] text-white text-[11px] font-black uppercase"><span className="w-1.5 h-1.5 rounded-full bg-white citadel-tick-dot inline-block" /> Current</span>
                      ) : isUnlocked ? (
                        <span className="inline-flex px-2 py-1 rounded-full bg-[#eef8ff] border border-[#b9e5fb] text-[var(--blue)] text-[11px] font-black uppercase">Unlocked</span>
                      ) : isNext ? (
                        <span className="inline-flex px-2 py-1 rounded-full bg-[#f5f3ff] border border-[#ddd6fe] text-[#7c3aed] text-[11px] font-black uppercase">Next — {powerPercent}%</span>
                      ) : (
                        <span className="inline-flex px-2 py-1 rounded-full bg-[#f0f0f0] text-[var(--gray-light)] text-[11px] font-bold">Locked</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y-2 divide-[#f0f0f0]">
          {TIER_DEFS.map((t) => {
            const isCurrent = t.tier === profile.citadelTier;
            const isUnlocked = profile.citadelTier >= t.tier;
            return (
              <div key={t.tier} className={`p-4 flex items-start justify-between gap-3 ${isCurrent ? 'bg-[#fffbeb]' : ''}`}>
                <div className="flex gap-3">
                  <span className={`w-9 h-9 rounded-2xl border-2 flex items-center justify-center text-sm font-black shrink-0 ${isCurrent ? 'bg-[var(--golden)] border-[#b88c00]' : isUnlocked ? 'bg-[#eef8ff] border-[#b9e5fb]' : 'bg-[#f7f7f7] border-[#e5e5e5]'}`}>{t.tier}</span>
                  <div>
                    <div className="font-['Feather_Bold'] text-sm text-[var(--dark-blue)] flex items-center gap-1"><span>{t.icon}</span> {t.name}</div>
                    <div className="text-[11px] font-bold text-[var(--gray-light)]">{t.minPower} power • {t.perk}</div>
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full shrink-0 ${isCurrent ? 'bg-[var(--green)] text-white' : isUnlocked ? 'bg-[#eef8ff] text-[var(--blue)] border border-[#b9e5fb]' : 'bg-[#f0f0f0] text-[var(--gray-light)]'}`}>{isCurrent ? 'Current' : isUnlocked ? 'Done' : 'Locked'}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hall of Trophies (Achievements) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-[#e5e5e5] pb-4">
          <div>
            <h2 className="font-['Feather_Bold'] text-xl text-[var(--dark-blue)] flex items-center gap-2">
              <span>🏆</span> HALL OF TROPHIES ({achievements.filter((a) => a.isUnlocked).length}/{achievements.length})
            </h2>
            <p className="text-xs font-bold text-[var(--gray-light)]">Complete epic career milestones to unlock rare badges and gems!</p>
          </div>
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
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeCategory === c.id ? 'bg-[var(--dark-blue)] text-white' : 'bg-[#f0f0f0] text-[var(--gray-text)] hover:bg-[#e5e5e5]'}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((ach) => {
            const isCompleted = ach.isUnlocked;
            const progress = Math.min(100, Math.round((ach.currentValue / ach.targetValue) * 100));
            return (
              <div key={ach.id} className={`rounded-3xl border-2 p-5 shadow-xs flex flex-col justify-between space-y-3 transition-all ${isCompleted ? 'bg-[#fffbeb] border-[#fde68a]' : 'bg-white border-[#e5e5e5]'}`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{ach.icon || '🏅'}</span>
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#f7f7f7] text-[var(--gray-light)] border border-[#e5e5e5]">{ach.category}</span>
                  </div>
                  <h3 className="font-['Feather_Bold'] text-base text-[var(--dark-blue)]">{ach.title}</h3>
                  <p className="text-xs text-[var(--gray-text)] font-semibold mt-0.5">{ach.description}</p>
                </div>
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[var(--gray-light)]">
                    <span>Progress</span>
                    <span>{ach.currentValue} / {ach.targetValue}</span>
                  </div>
                  <div className="w-full h-2 bg-[#e5e5e5] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-[var(--golden)]' : 'bg-[var(--blue)]'}`} style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between border-t-2 border-[#f0f0f0]">
                  <div className="flex items-center gap-2 text-xs font-black">
                    <span className="text-[var(--blue)]">+{ach.rewards.xp} XP</span>
                    {ach.rewards.gems && <span className="text-[#db2777]">+{ach.rewards.gems} 💎</span>}
                  </div>
                  {isCompleted ? (
                    <button onClick={() => handleClaimAchievement(ach)} className="px-3 py-1 rounded-xl bg-[var(--golden)] text-[var(--dark-blue)] font-black text-xs uppercase shadow-xs hover:scale-105 transition-transform cursor-pointer">
                      CLAIMED 🌟
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-[var(--gray-light)]">{progress}%</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Archivist (Vault Backup & Restore) with safe import validator */}
      <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#f0f0f0] pb-3">
          <div>
            <h3 className="font-['Feather_Bold'] text-lg text-[var(--dark-blue)] flex items-center gap-2">
              <span>💾</span> DATA ARCHIVIST & VAULT BACKUP
            </h3>
            <p className="text-xs font-bold text-[var(--gray-light)]">Export and import your game save locally. Malformed JSON is rejected with inline error.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export */}
          <div className="p-4 bg-[#f8fafc] rounded-3xl border-2 border-[#e2e8f0] space-y-3">
            <h4 className="font-['Feather_Bold'] text-sm text-[var(--dark-blue)]">Export Productivity Data (JSON)</h4>
            <p className="text-xs text-[var(--gray-text)] font-semibold">Creates portable snapshot of quests, habits, chests, and player levels.</p>
            <button onClick={handleExport} className="px-4 py-2 bg-[var(--blue)] hover:bg-[#0095de] text-white font-['Feather_Bold'] text-xs font-black uppercase rounded-xl border-b-3 border-[#0b80ba] active:translate-y-0.5 transition-all cursor-pointer shadow-xs">
              {copySuccess ? 'COPIED TO CLIPBOARD! ✅' : '📋 EXPORT TO CLIPBOARD'}
            </button>
          </div>

          {/* Import with validator */}
          <div className="p-4 bg-[#f8fafc] rounded-3xl border-2 border-[#e2e8f0] space-y-3">
            <h4 className="font-['Feather_Bold'] text-sm text-[var(--dark-blue)]">Import Productivity Data (JSON)</h4>
            <textarea
              value={importJsonText}
              onChange={(e) => {
                setImportJsonText(e.target.value);
                if (importFieldError) setImportFieldError(null);
                if (importStatus?.type === 'error') setImportStatus(null);
              }}
              placeholder='Paste JSON save data string here... (must contain profile/quests/etc.)'
              rows={3}
              className={`w-full px-3 py-2 rounded-2xl border-2 font-mono text-xs focus:outline-hidden resize-none transition-colors ${
                importFieldError
                  ? 'border-[var(--red)] bg-[#ffeef0] focus:border-[var(--red)]'
                  : liveValidation && !liveValidation.ok
                  ? 'border-[#f59e0b] bg-[#fffbeb] focus:border-[#f59e0b]'
                  : liveValidation?.ok
                  ? 'border-[var(--green)] bg-[#f0fdf4] focus:border-[var(--green)]'
                  : 'border-[#cbd5e1] bg-white focus:border-[var(--blue)]'
              }`}
            />
            {/* inline validation hint */}
            {importJsonText.trim() && liveValidation && !liveValidation.ok && !importFieldError && (
              <div className="text-[11px] font-bold text-[#d48806] bg-[#fffbeb] border border-[#fde68a] rounded-xl px-2.5 py-1.5">⚠️ {liveValidation.error}</div>
            )}
            {liveValidation?.ok && !importFieldError && (
              <div className="text-[11px] font-bold text-[var(--green)] bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-2.5 py-1.5">✓ JSON looks valid — ready to restore</div>
            )}
            {importFieldError && (
              <div className="text-xs font-black text-[var(--red)] bg-[#ffeef0] border-2 border-[#ffc9cc] rounded-2xl px-3 py-2 flex items-start gap-2">
                <span className="text-sm leading-none">⛔</span>
                <span className="leading-tight">{importFieldError}</span>
              </div>
            )}
            {importStatus && (
              <div className={`text-xs font-black rounded-2xl px-3 py-2 border-2 ${importStatus.type === 'success' ? 'bg-[#f0fdf4] border-[#bbf7d0] text-[var(--green)]' : 'bg-[#ffeef0] border-[#ffc9cc] text-[var(--red)]'}`}>
                {importStatus.type === 'success' ? '✅' : '⛔'} {importStatus.msg}
              </div>
            )}
            <button
              onClick={handleImport}
              disabled={!!(liveValidation && !liveValidation.ok)}
              className={`px-4 py-2 font-['Feather_Bold'] text-xs font-black uppercase rounded-xl border-b-3 active:translate-y-0.5 transition-all shadow-xs ${
                liveValidation && !liveValidation.ok
                  ? 'bg-[#f0f0f0] text-[var(--gray-light)] border-transparent cursor-not-allowed'
                  : 'bg-[var(--green)] hover:bg-[var(--green-hover)] text-white border-[var(--green-shadow)] cursor-pointer'
              }`}
            >
              📥 RESTORE BACKUP
            </button>
            <p className="text-[11px] font-bold text-[var(--gray-light)]">Rejected imports leave current save untouched.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
