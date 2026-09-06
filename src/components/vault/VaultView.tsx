import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { calculateNetFlow, filterTransactions } from '../../domain/economy';
import { CurrencyType, EconomyTransactionType } from '../../types';

export const VaultView: React.FC = () => {
  const {
    profile,
    rewards,
    transactions,
    redeemReward,
    createCustomReward,
    openCustomClaimModal,
  } = useGameState();

  const [activeShopTab, setActiveShopTab] = useState<'irl' | 'game'>('irl');
  const [dailyStreakClaimed, setDailyStreakClaimed] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customCost, setCustomCost] = useState(200);
  const [customCategory, setCustomCategory] = useState('Personal Reward');
  const [customIcon, setCustomIcon] = useState('stars');

  // Ledger state
  const [ledgerModalOpen, setLedgerModalOpen] = useState(false);
  const [ledgerCurrencyFilter, setLedgerCurrencyFilter] = useState<CurrencyType | 'all'>('all');
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<EconomyTransactionType | 'all'>('all');
  const [ledgerSearch, setLedgerSearch] = useState('');

  const filteredRewards = rewards.filter(r => r.type === activeShopTab);
  const netFlowCoins = calculateNetFlow(transactions, 'coins', 24 * 3600 * 1000);
  const filteredLedger = filterTransactions(transactions, {
    currency: ledgerCurrencyFilter,
    type: ledgerTypeFilter,
    search: ledgerSearch,
  });

  const handleClaimDailyStreak = () => {
    if (dailyStreakClaimed) return;
    setDailyStreakClaimed(true);
    openCustomClaimModal({
      title: 'Daily Streak Chest Claimed!',
      subtitle: 'LOOT SECURED',
      description: '140 Auctus Coins and 2 Spire Shards banked to your Citadel Treasury.',
      coins: 140,
      shards: 2,
      icon: 'redeem',
    });
  };

  const handleAddCustomReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    createCustomReward(customTitle.trim(), Number(customCost), customCategory, customIcon);
    setCustomTitle('');
    setCustomModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full max-w-screen mx-auto px-3.5 sm:px-4 pt-3 pb-8 space-y-4">
      {/* 1. ROYAL TREASURY BALANCE CHAMBER */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-surface-container via-surface-container to-surface-container-low border border-outline-variant/60 shadow-card p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
              <span className="material-symbols-outlined text-[20px] fill-1">account_balance</span>
            </div>
            <div>
              <span className="font-label-sm text-[10px] text-amber-400 uppercase tracking-wider font-extrabold block">
                Citadel Treasury
              </span>
              <h2 className="font-headline-sm text-sm sm:text-base text-white font-black">
                Resource Vault
              </h2>
            </div>
          </div>

          <button
            onClick={() => setLedgerModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-dim hover:bg-surface-container-high border border-outline-variant/60 text-amber-300 text-xs font-bold shadow-sm active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            <span>Ledger</span>
          </button>
        </div>

        {/* Currency Triad */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-surface-dim border border-amber-400/30 text-center flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-amber-400 text-[18px] fill-1">monetization_on</span>
              <span className="font-headline-sm text-sm sm:text-base text-amber-300 font-black tabular-nums">
                {profile.coins.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] text-on-surface-variant font-bold uppercase mt-0.5">Auctus Coins</span>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-dim border border-sky-400/30 text-center flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-cyan-400 text-[18px] fill-1">diamond</span>
              <span className="font-headline-sm text-sm sm:text-base text-cyan-300 font-black tabular-nums">
                {profile.shards}
              </span>
            </div>
            <span className="text-[10px] text-on-surface-variant font-bold uppercase mt-0.5">Spire Shards</span>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-dim border border-emerald-500/30 text-center flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-emerald-400 text-[18px] fill-1">redeem</span>
              <span className="font-headline-sm text-sm sm:text-base text-emerald-300 font-black tabular-nums">
                {dailyStreakClaimed ? 0 : 1}
              </span>
            </div>
            <span className="text-[10px] text-on-surface-variant font-bold uppercase mt-0.5">Unclaimed</span>
          </div>
        </div>

        {/* 24h Flow Summary */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-surface-dim/70 border border-outline-variant/40 text-xs text-on-surface-variant">
          <span>24h Earned: <strong className="text-emerald-400">+{netFlowCoins.earned}</strong></span>
          <span>Spent: <strong className="text-rose-400">-{netFlowCoins.spent}</strong></span>
          <span className="text-amber-300 font-bold">
            Net: {netFlowCoins.net >= 0 ? `+${netFlowCoins.net}` : netFlowCoins.net}
          </span>
        </div>
      </section>

      {/* 2. LOOT CHESTS */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-amber-400 text-[18px] fill-1">military_tech</span>
            <h3 className="font-headline-sm text-sm text-white font-extrabold">
              Milestone Loot Chests
            </h3>
          </div>
        </div>

        {/* Daily Streak Chest Card */}
        <div className="rounded-2xl bg-surface-container border border-amber-400/50 p-3.5 shadow-card flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-surface-dim border border-amber-400/50 flex-shrink-0 overflow-hidden flex items-center justify-center">
              <img src="/assets/chest_streak.png" alt="Streak Chest" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1 text-rose-400">
                <span className="material-symbols-outlined text-[13px] fill-1">local_fire_department</span>
                <span className="text-[10px] font-extrabold uppercase">{profile.streakDays}-Day Streak Reward</span>
              </div>
              <h4 className="font-headline-sm text-sm text-white font-extrabold mt-0.5">
                Daily Streak Chest
              </h4>
              <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">
                Guaranteed 140 Coins, 2 Spire Shards, and bonus XP elixir.
              </p>
            </div>
          </div>

          <button
            onClick={handleClaimDailyStreak}
            disabled={dailyStreakClaimed}
            className={`h-11 btn font-headline-sm text-xs uppercase tracking-wider font-black w-full ${
              dailyStreakClaimed
                ? 'bg-surface-dim border border-outline-variant/50 text-on-surface-variant cursor-not-allowed'
                : 'btn-gold shadow-md'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">redeem</span>
            <span>{dailyStreakClaimed ? 'CLAIMED TODAY' : 'CLAIM CHEST LOOT'}</span>
          </button>
        </div>

        {/* Weekly Focus Chest */}
        <div className="rounded-2xl bg-surface-container border border-outline-variant/60 p-3.5 shadow-card flex flex-col gap-2.5">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-surface-dim border border-outline-variant/60 flex-shrink-0 overflow-hidden flex items-center justify-center opacity-70">
              <img src="/assets/chest_cyber.png" alt="Cyber Chest" className="w-full h-full object-contain grayscale" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-cyan-400 font-bold uppercase text-[10px]">Unlocks in 2 Days</span>
                <span className="text-on-surface-variant font-medium">14 / 20 hrs</span>
              </div>
              <h4 className="font-headline-sm text-sm text-white font-bold mt-0.5">
                Weekly Focus Grand Chest
              </h4>
              <div className="w-full bg-surface-dim h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: '70%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. REWARD BAZAAR */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-amber-400 text-[18px]">storefront</span>
            <h3 className="font-headline-sm text-sm text-white font-extrabold">
              Reward Bazaar
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-surface-dim p-0.5 rounded-xl border border-outline-variant/50">
            <button
              onClick={() => setActiveShopTab('irl')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeShopTab === 'irl'
                  ? 'bg-navy-hi border border-secondary/40 text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-white'
              }`}
            >
              Real-Life
            </button>
            <button
              onClick={() => setActiveShopTab('game')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeShopTab === 'game'
                  ? 'bg-navy-hi border border-secondary/40 text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-white'
              }`}
            >
              Perks
            </button>
          </div>
        </div>

        {/* Rewards List */}
        <div className="flex flex-col gap-2">
          {filteredRewards.map(item => {
            const canAfford = profile.coins >= item.cost;
            const isLevelLocked = item.requiredLevel !== undefined && profile.level < item.requiredLevel;

            if (isLevelLocked) {
              return (
                <div
                  key={item.id}
                  className="rounded-xl bg-surface-container/60 p-3 flex items-center justify-between gap-3 border border-outline-variant/40 opacity-70"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-surface-dim flex items-center justify-center text-on-surface-variant flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h4 className="font-headline-sm text-xs sm:text-sm text-white/80 truncate font-bold">
                        {item.title}
                      </h4>
                      <span className="text-[11px] text-cyan-300 font-semibold">
                        Unlocks at Citadel LV.{item.requiredLevel}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-surface-dim text-on-surface-variant text-xs font-bold flex-shrink-0">
                    LV.{item.requiredLevel}
                  </span>
                </div>
              );
            }

            if (!canAfford) {
              const diff = item.cost - profile.coins;
              return (
                <div
                  key={item.id}
                  className="rounded-xl bg-surface-container/80 p-3 flex items-center justify-between gap-3 border border-outline-variant/60"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-surface-dim flex items-center justify-center text-on-surface-variant flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h4 className="font-headline-sm text-xs sm:text-sm text-white truncate font-bold">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                        <span className="text-amber-300/80 font-bold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[13px]">monetization_on</span>
                          {item.cost}
                        </span>
                        <span>• Need {diff} more</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-surface-dim border border-outline-variant/40 text-on-surface-variant text-xs font-bold flex-shrink-0">
                    Locked
                  </span>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className="rounded-xl bg-surface-container p-3 flex items-center justify-between gap-3 border border-outline-variant hover:border-amber-400/40 shadow-card transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-navy-hi border border-amber-400/30 flex items-center justify-center text-amber-300 flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h4 className="font-headline-sm text-xs sm:text-sm text-white truncate font-bold">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-amber-300 font-extrabold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px] fill-1">monetization_on</span>
                        {item.cost}
                      </span>
                      <span className="text-on-surface-variant text-[11px]">• {item.category}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => redeemReward(item.id)}
                  className="btn btn-emerald h-9 px-3.5 font-headline-sm text-xs uppercase tracking-wider font-black flex-shrink-0"
                >
                  Redeem
                </button>
              </div>
            );
          })}

          <button
            onClick={() => setCustomModalOpen(true)}
            className="rounded-xl bg-surface-container/60 hover:bg-surface-container border border-dashed border-cyan-400/40 p-3 flex items-center justify-between text-left transition-all mt-1"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-[18px]">add_circle</span>
              <span className="text-xs font-bold text-sky-200">Create Custom Real-World Reward</span>
            </div>
            <span className="text-[10px] text-amber-300 uppercase font-black">Configure</span>
          </button>
        </div>
      </section>

      {/* 4. CUSTOM REWARD MODAL */}
      {customModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setCustomModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-surface-container border border-amber-400/60 p-5 shadow-crown z-10 animate-slideUp flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/40">
              <h3 className="font-headline-sm text-base text-white font-extrabold">
                New Custom Reward
              </h3>
              <button
                onClick={() => setCustomModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddCustomReward} className="flex flex-col gap-3">
              <div>
                <label className="font-label-sm text-xs text-on-surface-variant uppercase font-bold block mb-1">
                  Reward Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Saturday Movie Night, Boba Tea..."
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-dim border border-outline-variant text-on-surface text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-label-sm text-xs text-on-surface-variant uppercase font-bold block mb-1">
                    Cost (Coins)
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={customCost}
                    onChange={e => setCustomCost(Number(e.target.value))}
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-dim border border-outline-variant text-on-surface text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="font-label-sm text-xs text-on-surface-variant uppercase font-bold block mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-dim border border-outline-variant text-on-surface text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-label-sm text-xs text-on-surface-variant uppercase font-bold block mb-1">
                  Icon Glyph
                </label>
                <div className="grid grid-cols-6 gap-1 bg-surface-dim p-1.5 rounded-xl border border-outline-variant/60">
                  {['sports_esports', 'coffee', 'local_pizza', 'flight', 'shopping_bag', 'movie'].map(ic => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setCustomIcon(ic)}
                      className={`h-9 rounded-lg flex items-center justify-center transition-all ${
                        customIcon === ic
                          ? 'bg-amber-400 text-amber-950 font-bold shadow-sm'
                          : 'text-on-surface-variant hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{ic}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-gold w-full h-12 mt-2 font-headline-sm text-xs uppercase tracking-wider font-black shadow-md"
              >
                Create Custom Reward
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. TREASURY LEDGER MODAL */}
      {ledgerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setLedgerModalOpen(false)} />
          <div className="relative w-full max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-surface-container border border-outline-variant/70 p-5 shadow-crown z-10 animate-slideUp flex flex-col gap-3 custom-scrollbar">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/40">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-[20px]">receipt_long</span>
                <h3 className="font-headline-sm text-base text-white font-extrabold">
                  Treasury Ledger
                </h3>
                <span className="text-[10px] text-amber-300 font-bold bg-surface-dim px-2 py-0.5 rounded-full border border-amber-400/20">
                  {transactions.length} records
                </span>
              </div>
              <button
                onClick={() => setLedgerModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Search ledger entries..."
                value={ledgerSearch}
                onChange={e => setLedgerSearch(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-surface-dim border border-outline-variant text-xs text-on-surface focus:outline-none focus:border-amber-400"
              />

              <div className="flex items-center justify-between gap-1 flex-wrap">
                <div className="flex items-center gap-1 bg-surface-dim p-0.5 rounded-lg border border-outline-variant/50">
                  {(['all', 'coins', 'shards'] as const).map(curr => (
                    <button
                      key={curr}
                      onClick={() => setLedgerCurrencyFilter(curr)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold capitalize ${
                        ledgerCurrencyFilter === curr
                          ? 'bg-navy-hi text-amber-300 border border-amber-400/40'
                          : 'text-on-surface-variant hover:text-white'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 bg-surface-dim p-0.5 rounded-lg border border-outline-variant/50">
                  {(['all', 'earn', 'spend'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setLedgerTypeFilter(type)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold capitalize ${
                        ledgerTypeFilter === type
                          ? 'bg-navy-hi text-cyan-300 border border-cyan-400/40'
                          : 'text-on-surface-variant hover:text-white'
                      }`}
                    >
                      {type === 'all' ? 'All' : type === 'earn' ? '+ Inflow' : '- Outflow'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scrollable Records */}
            <div className="flex-1 overflow-y-auto space-y-2 max-h-80 pr-0.5 custom-scrollbar">
              {filteredLedger.length === 0 ? (
                <div className="p-8 text-center text-xs text-on-surface-variant">
                  No records match your filter.
                </div>
              ) : (
                filteredLedger.map(tx => {
                  const isEarn = tx.type === 'earn';
                  const dateStr = new Date(tx.timestamp).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={tx.id}
                      className="p-2.5 rounded-xl bg-surface-dim border border-outline-variant/40 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isEarn ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                        }`}>
                          <span className="material-symbols-outlined text-[16px]">
                            {isEarn ? 'arrow_upward' : 'arrow_downward'}
                          </span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-white truncate">{tx.reason}</span>
                          <span className="text-[10px] text-on-surface-variant">{dateStr}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end flex-shrink-0">
                        <span className={`text-xs font-black tabular-nums ${isEarn ? 'text-emerald-300' : 'text-rose-400'}`}>
                          {isEarn ? '+' : '-'}{tx.amount.toLocaleString()} {tx.currency}
                        </span>
                        <span className="text-[10px] text-amber-200/70">Bal: {tx.balanceAfter.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-end">
              <button
                onClick={() => setLedgerModalOpen(false)}
                className="btn btn-navy h-9 px-4 text-xs font-bold uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};