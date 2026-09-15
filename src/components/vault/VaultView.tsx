import React, { useState, useEffect } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { CustomRewardModal } from './CustomRewardModal';
import { soundEngine } from '../../utils/audioSynthesizer';
import { ChestTier } from '../../types';

export const VaultView: React.FC = () => {
  const {
    chests,
    rewards,
    transactions,
    profile,
    startChestUnlock,
    speedUpChest,
    claimChestLoot,
    redeemReward,
  } = useGameState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'chests' | 'bazaar' | 'ledger'>('chests');
  const [, setTick] = useState(0);

  // Live timer tick every 1s for unlock countdowns
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatRemainingTime = (endsAt?: number) => {
    if (!endsAt) return '00:00:00';
    const remainingMs = Math.max(0, endsAt - Date.now());
    const totalSecs = Math.floor(remainingMs / 1000);
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getTierDetails = (tier: ChestTier) => {
    switch (tier) {
      case 'bronze':
        return {
          icon: '📦',
          name: 'Bronze Supply Chest',
          border: 'border-[#d4a373]',
          bg: 'bg-[#fffaf0]',
          badgeBg: 'bg-[#d4a373]',
        };
      case 'silver':
        return {
          icon: '🧰',
          name: 'Silver Tactical Chest',
          border: 'border-[#94a3b8]',
          bg: 'bg-[#f8fafc]',
          badgeBg: 'bg-[#64748b]',
        };
      case 'gold':
        return {
          icon: '👑',
          name: 'Royal Gold Chest',
          border: 'border-[#ffd6a5]',
          bg: 'bg-[#fffbeb]',
          badgeBg: 'bg-[#d48806]',
        };
      case 'mythic':
        return {
          icon: '🔮',
          name: 'Mythic Celestial Chest',
          border: 'border-[#ddd6fe]',
          bg: 'bg-[#faf5ff]',
          badgeBg: 'bg-[#9333ea]',
        };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-fadeIn select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Feather_Bold'] text-2xl sm:text-3xl text-[var(--dark-blue)] tracking-wide">
            VAULT & TREASURY
          </h1>
          <p className="text-sm font-bold text-[var(--gray-light)]">
            Unlock loot chests, spend earned coins in the Rewards Bazaar, and audit your treasury!
          </p>
        </div>

        <button
          onClick={() => {
            soundEngine.playClick();
            setIsModalOpen(true);
          }}
          className="h-11 px-4 bg-[#d48806] hover:bg-[#b57404] text-white font-['Feather_Bold'] text-sm font-black uppercase rounded-2xl border-b-4 border-[#8c5900] active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-md flex items-center gap-1.5"
        >
          <span>+ FORGE CUSTOM REWARD</span>
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-2 border-b-2 border-[#e5e5e5] pb-3">
        {[
          { id: 'chests', label: 'Loot Chests (4 Slots)', icon: '📦' },
          { id: 'bazaar', label: 'Rewards Bazaar', icon: '🎁' },
          { id: 'ledger', label: 'Treasury Ledger', icon: '📜' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              soundEngine.playClick();
              setActiveSubTab(t.id as typeof activeSubTab);
            }}
            className={`px-3.5 py-2 rounded-2xl font-['Feather_Bold'] text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === t.id
                ? 'bg-[var(--dark-blue)] text-white shadow-xs'
                : 'bg-[#f7f7f7] text-[var(--gray-text)] hover:bg-[#ececec]'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* 1. Loot Chests Grid */}
      {activeSubTab === 'chests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-['Feather_Bold'] text-lg text-[var(--dark-blue)]">
              CHEST SLOTS (4/4)
            </h2>
            <span className="text-xs font-bold text-[var(--gray-light)]">
              Speed up unlocks with 💎 Mana Gems!
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {chests.map((chest) => {
              const details = getTierDetails(chest.tier);
              const isUnlocking = chest.status === 'unlocking';
              const isReady = chest.status === 'ready' || (isUnlocking && chest.unlockEndsAt && Date.now() >= chest.unlockEndsAt);

              return (
                <div
                  key={chest.id}
                  className={`rounded-3xl border-2 ${details.border} ${details.bg} p-5 shadow-xs flex flex-col justify-between space-y-4 text-center relative overflow-hidden`}
                >
                  {/* Tier Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full text-white ${details.badgeBg}`}>
                      {chest.tier}
                    </span>
                    <span className="text-xs font-bold text-[var(--gray-light)]">
                      Slot #{chest.slotIndex + 1}
                    </span>
                  </div>

                  {/* Chest Icon */}
                  <div className="my-2">
                    <div className={`text-5xl mx-auto ${isReady ? 'animate-bounce' : ''}`}>
                      {details.icon}
                    </div>
                    <h3 className="font-['Feather_Bold'] text-sm text-[var(--dark-blue)] mt-2">
                      {chest.name}
                    </h3>
                  </div>

                  {/* Rewards preview */}
                  <div className="bg-white/80 p-2.5 rounded-2xl border border-black/5 text-xs font-bold flex items-center justify-around">
                    <span className="text-[var(--blue)]">+{chest.xpReward} XP</span>
                    <span className="text-[#d48806]">+{chest.coinsReward} 🟡</span>
                    <span className="text-[#db2777]">+{chest.gemsReward} 💎</span>
                  </div>

                  {/* Actions depending on status */}
                  <div className="pt-2">
                    {isReady ? (
                      <button
                        onClick={() => claimChestLoot(chest.slotIndex)}
                        className="w-full h-11 bg-[var(--green)] hover:bg-[var(--green-hover)] text-white font-['Feather_Bold'] text-xs font-black uppercase rounded-2xl border-b-4 border-[var(--green-shadow)] active:translate-y-0.5 active:border-b-0 transition-all cursor-pointer shadow-md animate-pulse"
                      >
                        🎉 OPEN & CLAIM!
                      </button>
                    ) : isUnlocking ? (
                      <div className="space-y-2">
                        <div className="text-xs font-mono font-black text-[var(--orange)] bg-white px-2 py-1 rounded-xl border border-[#ffd6a5]">
                          ⏳ {formatRemainingTime(chest.unlockEndsAt)}
                        </div>
                        <button
                          onClick={() => speedUpChest(chest.slotIndex)}
                          className="w-full h-9 bg-[var(--blue)] hover:bg-[#0095de] text-white font-['Feather_Bold'] text-[11px] font-black uppercase rounded-xl border-b-3 border-[#0b80ba] active:translate-y-0.5 transition-all cursor-pointer"
                        >
                          ⚡ SPEED UP (💎 10)
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startChestUnlock(chest.slotIndex)}
                        className="w-full h-11 bg-white hover:bg-[#fafafa] text-[var(--dark-blue)] font-['Feather_Bold'] text-xs font-black uppercase rounded-2xl border-2 border-[#d9d9d9] hover:border-[var(--blue)] transition-all cursor-pointer"
                      >
                        🔓 START UNLOCK ({Math.round(chest.totalUnlockSeconds / 60)}m)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Rewards Bazaar */}
      {activeSubTab === 'bazaar' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-['Feather_Bold'] text-lg text-[var(--dark-blue)]">
              REWARDS BAZAAR
            </h2>
            <div className="text-xs font-black px-3 py-1 rounded-xl bg-[#fffbe6] border border-[#ffe58f] text-[#d48806]">
              Your Balance: {profile.coins} 🟡
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {rewards.map((r) => {
              const canAfford = profile.coins >= r.cost;

              return (
                <div
                  key={r.id}
                  className="bg-white rounded-3xl border-2 border-[#e5e5e5] hover:border-[#ffe58f] p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{r.icon}</span>
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#f7f7f7] text-[var(--gray-light)]">
                        {r.category}
                      </span>
                    </div>

                    <h3 className="font-['Feather_Bold'] text-base text-[var(--dark-blue)] mb-1">
                      {r.title}
                    </h3>
                    <p className="text-xs text-[var(--gray-text)] font-semibold leading-relaxed">
                      {r.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#f0f0f0] flex items-center justify-between gap-3">
                    <div className="font-['Feather_Bold'] text-base font-black text-[#d48806]">
                      {r.cost} 🟡
                    </div>

                    <button
                      onClick={() => redeemReward(r.id)}
                      disabled={!canAfford}
                      className={`px-4 py-2 rounded-2xl font-['Feather_Bold'] text-xs font-black uppercase transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-[#d48806] hover:bg-[#b57404] text-white border-b-3 border-[#8c5900] active:translate-y-0.5 active:border-b-0 shadow-xs'
                          : 'bg-[#f0f0f0] text-[var(--gray-light)] cursor-not-allowed border-2 border-transparent'
                      }`}
                    >
                      {canAfford ? 'REDEEM' : 'NEED COINS'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Treasury Ledger */}
      {activeSubTab === 'ledger' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-['Feather_Bold'] text-lg text-[var(--dark-blue)]">
              TRANSACTION AUDIT LEDGER
            </h2>
            <span className="text-xs font-bold text-[var(--gray-light)]">
              {transactions.length} Total Records
            </span>
          </div>

          <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] overflow-hidden shadow-xs">
            <div className="divide-y-2 divide-[#f0f0f0]">
              {transactions.slice(0, 15).map((t) => {
                const isEarn = t.type === 'earn';
                const dateStr = new Date(t.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={t.id}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-[#fafafa] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-black ${
                          isEarn
                            ? 'bg-[#eef8ff] text-[var(--blue)]'
                            : 'bg-[#ffeef0] text-[var(--red)]'
                        }`}
                      >
                        {isEarn ? '↓' : '↑'}
                      </div>
                      <div>
                        <div className="font-['Feather_Bold'] text-sm text-[var(--dark-blue)]">
                          {t.reason}
                        </div>
                        <div className="text-[11px] font-semibold text-[var(--gray-light)]">
                          {dateStr}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`font-['Feather_Bold'] text-sm font-black ${
                          isEarn ? 'text-[var(--green)]' : 'text-[var(--red)]'
                        }`}
                      >
                        {isEarn ? '+' : '-'}{t.amount} {t.currency === 'coins' ? '🟡' : t.currency === 'gems' ? '💎' : '❤️'}
                      </div>
                      <span className="text-[10px] font-black uppercase text-[var(--gray-light)]">
                        {t.type}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Custom Reward Modal */}
      <CustomRewardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
};