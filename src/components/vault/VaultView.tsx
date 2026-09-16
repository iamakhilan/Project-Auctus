import React, { useState, useEffect, useMemo } from 'react';
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

  // ledger controls
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerCurrency, setLedgerCurrency] = useState<'all' | 'coins' | 'gems'>('all');
  const [ledgerPage, setLedgerPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // reset page when filters change
  useEffect(() => {
    setLedgerPage(1);
  }, [ledgerSearch, ledgerCurrency, activeSubTab]);

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
        return { icon: '📦', name: 'Bronze Supply Chest', border: 'border-[#d4a373]', bg: 'bg-[#fffaf0]', badgeBg: 'bg-[#d4a373]' };
      case 'silver':
        return { icon: '🧰', name: 'Silver Tactical Chest', border: 'border-[#94a3b8]', bg: 'bg-[#f8fafc]', badgeBg: 'bg-[#64748b]' };
      case 'gold':
        return { icon: '👑', name: 'Royal Gold Chest', border: 'border-[#ffd6a5]', bg: 'bg-[#fffbeb]', badgeBg: 'bg-[#d48806]' };
      case 'mythic':
        return { icon: '🔮', name: 'Mythic Celestial Chest', border: 'border-[#ddd6fe]', bg: 'bg-[#faf5ff]', badgeBg: 'bg-[#9333ea]' };
    }
  };

  const filteredTx = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = !ledgerSearch.trim() || t.reason.toLowerCase().includes(ledgerSearch.toLowerCase()) || t.type.toLowerCase().includes(ledgerSearch.toLowerCase());
      const matchesCurrency = ledgerCurrency === 'all' || t.currency === ledgerCurrency;
      return matchesSearch && matchesCurrency;
    });
  }, [transactions, ledgerSearch, ledgerCurrency]);

  const totalPages = Math.max(1, Math.ceil(filteredTx.length / PAGE_SIZE));
  const pagedTx = useMemo(() => {
    const start = (ledgerPage - 1) * PAGE_SIZE;
    return filteredTx.slice(start, start + PAGE_SIZE);
  }, [filteredTx, ledgerPage]);

  const EmptyState: React.FC<{ icon: string; title: string; desc: string; action?: React.ReactNode }> = ({ icon, title, desc, action }) => (
    <div className="bg-white rounded-3xl border-2 border-dashed border-[#d9d9d9] p-8 sm:p-10 text-center">
      <div className="mx-auto w-20 h-20 rounded-3xl bg-[#f7f7f7] border-2 border-[#e5e5e5] flex items-center justify-center text-4xl mb-4">{icon}</div>
      <h3 className="font-['Feather_Bold'] text-base text-[var(--dark-blue)]">{title}</h3>
      <p className="text-xs font-bold text-[var(--gray-light)] mt-1 max-w-sm mx-auto">{desc}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-fadeIn select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Feather_Bold'] text-2xl sm:text-3xl text-[var(--dark-blue)] tracking-wide">VAULT & TREASURY</h1>
          <p className="text-sm font-bold text-[var(--gray-light)]">Unlock loot chests, spend earned coins in the Rewards Bazaar, and audit your treasury!</p>
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
              activeSubTab === t.id ? 'bg-[var(--dark-blue)] text-white shadow-xs' : 'bg-[#f7f7f7] text-[var(--gray-text)] hover:bg-[#ececec]'
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
            <h2 className="font-['Feather_Bold'] text-lg text-[var(--dark-blue)]">CHEST SLOTS (4/4)</h2>
            <span className="text-xs font-bold text-[var(--gray-light)]">Speed up unlocks with 💎 Mana Gems!</span>
          </div>
          {chests.length === 0 ? (
            <EmptyState icon="📦" title="No chests available" desc="Chests appear as you complete quests. Check back soon!" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {chests.map((chest) => {
                const details = getTierDetails(chest.tier);
                const isUnlocking = chest.status === 'unlocking';
                const isReady = chest.status === 'ready' || (isUnlocking && chest.unlockEndsAt && Date.now() >= chest.unlockEndsAt);
                const isEmpty = chest.status === 'empty';
                return (
                  <div
                    key={chest.id}
                    className={`rounded-3xl border-2 ${details.border} ${details.bg} p-5 shadow-xs flex flex-col justify-between space-y-4 text-center relative overflow-hidden`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full text-white ${details.badgeBg}`}>{chest.tier}</span>
                      <span className="text-xs font-bold text-[var(--gray-light)]">Slot #{chest.slotIndex + 1}</span>
                    </div>
                    <div className="my-2">
                      <div className={`text-5xl mx-auto ${isReady ? 'animate-bounce' : isEmpty ? 'opacity-40 grayscale' : ''}`}>{isEmpty ? '🕳️' : details.icon}</div>
                      <h3 className="font-['Feather_Bold'] text-sm text-[var(--dark-blue)] mt-2">{chest.name}</h3>
                      {isEmpty && <p className="text-[11px] font-bold text-[var(--gray-light)] mt-1">Awaiting next reward cycle</p>}
                    </div>
                    {!isEmpty && (
                      <div className="bg-white/80 p-2.5 rounded-2xl border-2 border-black/5 text-xs font-bold flex items-center justify-around">
                        <span className="text-[var(--blue)]">+{chest.xpReward} XP</span>
                        <span className="text-[#d48806]">+{chest.coinsReward} 🟡</span>
                        <span className="text-[#db2777]">+{chest.gemsReward} 💎</span>
                      </div>
                    )}
                    <div className="pt-2">
                      {isEmpty ? (
                        <div className="h-11 flex items-center justify-center rounded-2xl bg-[#f7f7f7] border-2 border-[#e5e5e5] text-xs font-black text-[var(--gray-light)]">EMPTY SLOT</div>
                      ) : isReady ? (
                        <button
                          onClick={() => {
                            soundEngine.playClick();
                            claimChestLoot(chest.slotIndex);
                          }}
                          className="w-full h-11 bg-[var(--green)] hover:bg-[var(--green-hover)] text-white font-['Feather_Bold'] text-xs font-black uppercase rounded-2xl border-b-4 border-[var(--green-shadow)] active:translate-y-0.5 active:border-b-0 transition-all cursor-pointer shadow-md animate-pulse"
                        >
                          🎉 OPEN & CLAIM!
                        </button>
                      ) : isUnlocking ? (
                        <div className="space-y-2">
                          <div className="text-xs font-mono font-black text-[var(--orange)] bg-white px-2 py-1 rounded-xl border-2 border-[#ffd6a5]">⏳ {formatRemainingTime(chest.unlockEndsAt)}</div>
                          <button
                            onClick={() => {
                              soundEngine.playClick();
                              speedUpChest(chest.slotIndex);
                            }}
                            className="w-full h-9 bg-[var(--blue)] hover:bg-[#0095de] text-white font-['Feather_Bold'] text-[11px] font-black uppercase rounded-xl border-b-3 border-[#0b80ba] active:translate-y-0.5 transition-all cursor-pointer"
                          >
                            ⚡ SPEED UP (💎 10)
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            soundEngine.playClick();
                            startChestUnlock(chest.slotIndex);
                          }}
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
          )}
        </div>
      )}

      {/* 2. Rewards Bazaar */}
      {activeSubTab === 'bazaar' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-['Feather_Bold'] text-lg text-[var(--dark-blue)]">REWARDS BAZAAR</h2>
            <div className="text-xs font-black px-3 py-1 rounded-xl bg-[#fffbe6] border-2 border-[#ffe58f] text-[#d48806]">Your Balance: {profile.coins} 🟡</div>
          </div>
          {rewards.length === 0 ? (
            <EmptyState
              icon="🎁"
              title="Bazaar is empty"
              desc="Forge a custom reward to motivate your next win!"
              action={
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 rounded-2xl bg-[#d48806] text-white font-black text-xs uppercase border-b-4 border-[#8c5900] cursor-pointer"
                >
                  + Forge Reward
                </button>
              }
            />
          ) : (
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
                        <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#f7f7f7] text-[var(--gray-light)] border border-[#e5e5e5]">{r.category}</span>
                      </div>
                      <h3 className="font-['Feather_Bold'] text-base text-[var(--dark-blue)] mb-1">{r.title}</h3>
                      <p className="text-xs text-[var(--gray-text)] font-semibold leading-relaxed">{r.description}</p>
                    </div>
                    <div className="pt-3 border-t-2 border-[#f0f0f0] flex items-center justify-between gap-3">
                      <div className="font-['Feather_Bold'] text-base font-black text-[#d48806]">{r.cost} 🟡</div>
                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          redeemReward(r.id);
                        }}
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
          )}
        </div>
      )}

      {/* 3. Treasury Ledger */}
      {activeSubTab === 'ledger' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-['Feather_Bold'] text-lg text-[var(--dark-blue)]">TRANSACTION AUDIT LEDGER</h2>
            <span className="text-xs font-bold text-[var(--gray-light)]">
              {filteredTx.length} / {transactions.length} Records
            </span>
          </div>

          {/* Ledger controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white rounded-3xl border-2 border-[#e5e5e5] p-3">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gray-light)] text-xs">🔍</span>
              <input
                type="text"
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                placeholder="Search by reason or type (earn/spend)..."
                className="w-full pl-8 pr-3 py-2 rounded-2xl border-2 border-[#e5e5e5] focus:border-[var(--blue)] focus:outline-hidden font-bold text-xs text-[var(--dark-blue)]"
              />
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-[#f7f7f7] rounded-2xl border-2 border-[#e5e5e5]">
              {[
                { id: 'all', label: 'All' },
                { id: 'coins', label: '🟡 Coins' },
                { id: 'gems', label: '💎 Gems' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setLedgerCurrency(c.id as typeof ledgerCurrency);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    ledgerCurrency === c.id ? 'bg-[var(--dark-blue)] text-white shadow-xs' : 'text-[var(--gray-text)] hover:bg-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            {(ledgerSearch || ledgerCurrency !== 'all') && (
              <button
                onClick={() => {
                  setLedgerSearch('');
                  setLedgerCurrency('all');
                }}
                className="px-3 py-2 rounded-2xl bg-[#ffeef0] border-2 border-[#ffc9cc] text-xs font-black text-[var(--red)] hover:bg-[#ffd6d9] cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] overflow-hidden shadow-xs">
            {filteredTx.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-3xl bg-[#f7f7f7] border-2 border-[#e5e5e5] flex items-center justify-center text-2xl mb-3">📭</div>
                <h3 className="font-['Feather_Bold'] text-sm text-[var(--dark-blue)]">No matching ledger entries</h3>
                <p className="text-xs font-bold text-[var(--gray-light)] mt-1">
                  {transactions.length === 0 ? 'Your treasury audit trail will appear here after you earn or spend.' : 'Try different search or currency filter.'}
                </p>
                {(ledgerSearch || ledgerCurrency !== 'all') && (
                  <button
                    onClick={() => {
                      setLedgerSearch('');
                      setLedgerCurrency('all');
                    }}
                    className="mt-3 px-4 py-2 rounded-2xl bg-[#eef8ff] text-[var(--blue)] font-black text-xs uppercase hover:bg-[#b9e5fb] cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="divide-y-2 divide-[#f0f0f0]">
                  {pagedTx.map((t) => {
                    const isEarn = t.type === 'earn';
                    const dateStr = new Date(t.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
                    return (
                      <div key={t.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#fafafa] transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-black shrink-0 border-2 ${
                              isEarn ? 'bg-[#eef8ff] text-[var(--blue)] border-[#b9e5fb]' : 'bg-[#ffeef0] text-[var(--red)] border-[#ffc9cc]'
                            }`}
                          >
                            {isEarn ? '↓' : '↑'}
                          </div>
                          <div className="min-w-0">
                            <div className="font-['Feather_Bold'] text-sm text-[var(--dark-blue)] truncate">{t.reason}</div>
                            <div className="text-[11px] font-semibold text-[var(--gray-light)]">{dateStr}</div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={`font-['Feather_Bold'] text-sm font-black ${isEarn ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                            {isEarn ? '+' : '-'}
                            {Math.abs(t.amount)} {t.currency === 'coins' ? '🟡' : t.currency === 'gems' ? '💎' : '❤️'}
                          </div>
                          <div className="flex items-center justify-end gap-1 mt-0.5">
                            <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md bg-[#f7f7f7] border border-[#e5e5e5] text-[var(--gray-light)]">{t.currency}</span>
                            <span className="text-[10px] font-black uppercase text-[var(--gray-light)]">{t.type}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between p-3 bg-[#fafafa] border-t-2 border-[#e5e5e5] gap-2">
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        setLedgerPage((p) => Math.max(1, p - 1));
                      }}
                      disabled={ledgerPage === 1}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                        ledgerPage === 1 ? 'bg-[#f0f0f0] text-[var(--gray-light)] border-transparent cursor-not-allowed' : 'bg-white border-[#e5e5e5] text-[var(--dark-blue)] hover:border-[var(--blue)]'
                      }`}
                    >
                      ← Prev
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }).map((_, i) => {
                        const n = i + 1;
                        // windowing: show first, last, current ±1
                        if (totalPages > 7 && n !== 1 && n !== totalPages && Math.abs(n - ledgerPage) > 1) {
                          if (n === 2 || n === totalPages - 1) return <span key={n} className="text-[var(--gray-light)] px-1">…</span>;
                          return null;
                        }
                        return (
                          <button
                            key={n}
                            onClick={() => {
                              soundEngine.playClick();
                              setLedgerPage(n);
                            }}
                            className={`w-8 h-8 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                              n === ledgerPage ? 'bg-[var(--dark-blue)] text-white border-[var(--dark-blue)]' : 'bg-white text-[var(--gray-text)] border-[#e5e5e5] hover:border-[#b9e5fb]'
                            }`}
                          >
                            {n}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        setLedgerPage((p) => Math.min(totalPages, p + 1));
                      }}
                      disabled={ledgerPage === totalPages}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                        ledgerPage === totalPages ? 'bg-[#f0f0f0] text-[var(--gray-light)] border-transparent cursor-not-allowed' : 'bg-white border-[#e5e5e5] text-[var(--dark-blue)] hover:border-[var(--blue)]'
                      }`}
                    >
                      Next →
                    </button>
                  </div>
                )}
                <div className="px-4 py-2 bg-[#f7f7f7] text-[11px] font-bold text-[var(--gray-light)] text-center border-t border-[#f0f0f0]">
                  Page {ledgerPage} of {totalPages} • {filteredTx.length} entries • 10 per page
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <CustomRewardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
