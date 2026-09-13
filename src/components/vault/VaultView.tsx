import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { calculateNetFlow, filterTransactions } from '../../domain/economy';
import { CurrencyType, EconomyTransactionType } from '../../types';
import { CoinIcon, GemIcon, FireStreakIcon, StarIcon, TrophyIcon } from '../common/GameIcons';

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
  const [customIcon, setCustomIcon] = useState('sports_esports');

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
    <div className="flex flex-col w-full max-w-2xl mx-auto px-3.5 sm:px-4 pt-3 pb-24 space-y-4 text-white">
      {/* 1. ROYAL TREASURY BALANCE CHAMBER */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-game-panel via-game-dark to-game-darker border-2 border-game-border shadow-game-card p-4 flex flex-col gap-3">
        {/* Decorative Golden Highlights */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-accent/40 to-transparent" />
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold-accent/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-gold-accent/20 to-gold-dark/40 border-2 border-gold-dark flex items-center justify-center shadow-game-sm">
              <span className="material-symbols-outlined text-[22px] text-gold-accent fill-1">account_balance</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-gold-accent font-black tracking-widest uppercase">
                  CITADEL TREASURY
                </span>
                <span className="px-1.5 py-0.2 rounded bg-gold-dark/30 border border-gold-dark/50 text-[9px] font-black text-gold-light">
                  SECURE
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide drop-shadow-sm">
                Resource Vault
              </h2>
            </div>
          </div>

          <button
            onClick={() => setLedgerModalOpen(true)}
            className="btn-game-blue px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            <span>Ledger</span>
          </button>
        </div>

        {/* Currency Triad */}
        <div className="grid grid-cols-3 gap-2">
          {/* Coins */}
          <div className="p-2.5 rounded-xl bg-game-darker/90 border border-game-border text-center flex flex-col items-center justify-center shadow-inner relative overflow-hidden group">
            <div className="flex items-center gap-1.5">
              <CoinIcon size={20} />
              <span className="text-base sm:text-lg font-black text-gold-accent tabular-nums drop-shadow-sm">
                {profile.coins.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mt-0.5">
              Auctus Coins
            </span>
          </div>

          {/* Shards */}
          <div className="p-2.5 rounded-xl bg-game-darker/90 border border-game-border text-center flex flex-col items-center justify-center shadow-inner relative overflow-hidden group">
            <div className="flex items-center gap-1.5">
              <GemIcon size={20} />
              <span className="text-base sm:text-lg font-black text-blue-400 tabular-nums drop-shadow-sm">
                {profile.shards}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mt-0.5">
              Spire Shards
            </span>
          </div>

          {/* Unclaimed Chests */}
          <div className="p-2.5 rounded-xl bg-game-darker/90 border border-game-border text-center flex flex-col items-center justify-center shadow-inner relative overflow-hidden group">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-green-400 text-[20px] fill-1">redeem</span>
              <span className="text-base sm:text-lg font-black text-green-400 tabular-nums drop-shadow-sm">
                {dailyStreakClaimed ? 0 : 1}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mt-0.5">
              Loot Drops
            </span>
          </div>
        </div>

        {/* 24h Flow Summary */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-game-darker/80 border border-game-border/80 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-gray-400 font-bold">24h Flow:</span>
            <span className="text-green-400 font-black">+{netFlowCoins.earned}</span>
            <span className="text-gray-500">/</span>
            <span className="text-red-400 font-black">-{netFlowCoins.spent}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400 font-bold">Net Yield:</span>
            <span className={`font-black ${netFlowCoins.net >= 0 ? 'text-gold-accent' : 'text-red-400'}`}>
              {netFlowCoins.net >= 0 ? `+${netFlowCoins.net}` : netFlowCoins.net} Coins
            </span>
          </div>
        </div>
      </section>

      {/* 2. MILESTONE LOOT CHESTS */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <TrophyIcon size={18} />
            <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              Milestone Loot Chests
            </h3>
          </div>
          <span className="text-[10px] text-gold-accent font-black uppercase tracking-wider">
            Tier-Based Drops
          </span>
        </div>

        {/* Daily Streak Chest Card */}
        <div className="rounded-2xl bg-gradient-to-b from-game-panel to-game-dark border-2 border-gold-dark/60 p-4 shadow-game-card flex flex-col gap-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold-accent/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-start gap-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-game-darker border-2 border-gold-dark flex-shrink-0 overflow-hidden flex items-center justify-center relative shadow-game-sm">
              <span className="material-symbols-outlined text-[32px] text-gold-accent animate-pulse">redeem</span>
              <div className="absolute -bottom-1 -right-1">
                <FireStreakIcon size={18} />
              </div>
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-red-950/80 border border-red-500/50 text-[10px] font-black text-red-400 uppercase tracking-wide flex items-center gap-1">
                  <FireStreakIcon size={12} />
                  {profile.streakDays} Day Streak Reward
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-black text-white tracking-wide mt-1">
                Daily Streak Loot Chest
              </h4>
              <p className="text-xs text-gray-300 font-medium line-clamp-2 mt-0.5">
                Contains guaranteed 140 Coins, 2 Spire Shards, and bonus XP elixir.
              </p>
            </div>
          </div>

          <button
            onClick={handleClaimDailyStreak}
            disabled={dailyStreakClaimed}
            className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
              dailyStreakClaimed
                ? 'btn-game-dark opacity-60 cursor-not-allowed text-gray-400'
                : 'btn-game-gold text-game-darker shadow-game-btn active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {dailyStreakClaimed ? 'check_circle' : 'redeem'}
            </span>
            <span>{dailyStreakClaimed ? 'CLAIMED FOR TODAY' : 'CLAIM CHEST LOOT (140 COINS)'}</span>
          </button>
        </div>

        {/* Weekly Focus Chest */}
        <div className="rounded-2xl bg-game-dark/80 border-2 border-game-border p-3.5 shadow-game-card flex flex-col gap-2.5">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-game-darker border border-game-border flex-shrink-0 flex items-center justify-center opacity-80">
              <span className="material-symbols-outlined text-[24px] text-blue-400">lock_clock</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-400 font-black uppercase text-[10px] tracking-wider">
                  Unlocks in 2 Days
                </span>
                <span className="text-gray-400 font-black text-[11px]">14 / 20 hrs Focus</span>
              </div>
              <h4 className="text-xs sm:text-sm font-black text-white mt-0.5">
                Weekly Focus Grand Chest
              </h4>
              {/* Progress Bar */}
              <div className="w-full bg-game-darker h-2 rounded-full overflow-hidden mt-1.5 border border-game-border">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                  style={{ width: '70%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. REWARD BAZAAR */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-gold-accent text-[20px]">storefront</span>
            <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              Reward Bazaar
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-game-darker p-1 rounded-xl border border-game-border">
            <button
              onClick={() => setActiveShopTab('irl')}
              className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                activeShopTab === 'irl'
                  ? 'btn-game-gold text-game-darker text-[11px]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Real-World
            </button>
            <button
              onClick={() => setActiveShopTab('game')}
              className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                activeShopTab === 'game'
                  ? 'btn-game-gold text-game-darker text-[11px]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Perks & Boosts
            </button>
          </div>
        </div>

        {/* Rewards List */}
        <div className="flex flex-col gap-2.5">
          {filteredRewards.map(item => {
            const canAfford = profile.coins >= item.cost;
            const isLevelLocked = item.requiredLevel !== undefined && profile.level < item.requiredLevel;

            if (isLevelLocked) {
              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-game-panel/50 p-3.5 flex items-center justify-between gap-3 border border-game-border/50 opacity-60 shadow-game-card"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-game-darker flex items-center justify-center text-gray-500 flex-shrink-0 border border-game-border">
                      <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-gray-300 truncate">
                        {item.title}
                      </h4>
                      <span className="text-[11px] text-gold-accent font-bold">
                        Unlocks at Citadel LV.{item.requiredLevel}
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-game-darker border border-game-border text-gray-400 text-xs font-black uppercase tracking-wider flex-shrink-0">
                    LV.{item.requiredLevel} LOCK
                  </span>
                </div>
              );
            }

            if (!canAfford) {
              const diff = item.cost - profile.coins;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-game-panel/80 p-3.5 flex items-center justify-between gap-3 border border-game-border shadow-game-card"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-game-darker flex items-center justify-center text-gray-400 flex-shrink-0 border border-game-border">
                      <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gold-accent font-black flex items-center gap-1">
                          <CoinIcon size={14} />
                          {item.cost}
                        </span>
                        <span className="text-gray-400 text-[11px] font-medium">• Need {diff} more</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-game-darker border border-game-border text-gray-400 text-xs font-black uppercase tracking-wider flex-shrink-0">
                    LOCKED
                  </span>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-game-panel p-3.5 flex items-center justify-between gap-3 border-2 border-game-border hover:border-gold-accent/50 shadow-game-card transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-game-darker border-2 border-gold-dark flex items-center justify-center text-gold-accent flex-shrink-0 shadow-game-sm">
                    <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h4 className="text-xs sm:text-sm font-black text-white truncate group-hover:text-gold-accent transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs mt-0.5">
                      <span className="text-gold-accent font-black flex items-center gap-1">
                        <CoinIcon size={15} />
                        {item.cost}
                      </span>
                      <span className="text-gray-400 text-[11px] font-medium">• {item.category}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => redeemReward(item.id)}
                  className="btn-game-green px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex-shrink-0 flex items-center gap-1 shadow-game-btn active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">redeem</span>
                  <span>Redeem</span>
                </button>
              </div>
            );
          })}

          {/* Forge Custom Reward Banner */}
          <button
            onClick={() => setCustomModalOpen(true)}
            className="rounded-2xl bg-gradient-to-r from-game-panel to-game-dark hover:from-game-panel hover:to-game-panel border-2 border-dashed border-gold-dark/60 p-3.5 flex items-center justify-between text-left transition-all mt-1 group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gold-dark/30 border border-gold-dark flex items-center justify-center text-gold-accent">
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
              </div>
              <div>
                <span className="text-xs font-black text-white group-hover:text-gold-accent transition-colors block">
                  Forge Custom Real-World Reward
                </span>
                <span className="text-[10px] text-gray-400">
                  Set custom coin bounty for your favorite hobbies & treats
                </span>
              </div>
            </div>
            <span className="btn-game-gold px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-game-darker">
              Configure
            </span>
          </button>
        </div>
      </section>

      {/* 4. CUSTOM REWARD MODAL */}
      {customModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setCustomModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-game-panel border-2 border-gold-dark p-5 shadow-game-modal z-10 animate-slideUp flex flex-col gap-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b-2 border-game-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gold-dark/40 border border-gold-dark flex items-center justify-center text-gold-accent">
                  <StarIcon size={16} />
                </div>
                <h3 className="text-base font-black text-white uppercase tracking-wider">
                  Forge Custom Reward
                </h3>
              </div>
              <button
                onClick={() => setCustomModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-game-darker hover:bg-game-dark border border-game-border flex items-center justify-center text-gray-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddCustomReward} className="flex flex-col gap-3.5">
              <div>
                <label className="text-[10px] text-gold-accent uppercase font-black tracking-wider block mb-1">
                  Reward Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Saturday Movie Night, Boba Tea..."
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-game-darker border-2 border-game-border text-white text-sm focus:outline-none focus:border-gold-accent font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] text-gold-accent uppercase font-black tracking-wider block mb-1">
                    Cost (Coins)
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={customCost}
                    onChange={e => setCustomCost(Number(e.target.value))}
                    className="w-full h-11 px-3.5 rounded-xl bg-game-darker border-2 border-game-border text-gold-accent text-sm focus:outline-none focus:border-gold-accent font-black"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gold-accent uppercase font-black tracking-wider block mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-game-darker border-2 border-game-border text-white text-sm focus:outline-none focus:border-gold-accent font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gold-accent uppercase font-black tracking-wider block mb-1">
                  Icon Glyph
                </label>
                <div className="grid grid-cols-6 gap-1 bg-game-darker p-1.5 rounded-xl border border-game-border">
                  {['sports_esports', 'coffee', 'local_pizza', 'flight', 'shopping_bag', 'movie'].map(ic => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setCustomIcon(ic)}
                      className={`h-9 rounded-lg flex items-center justify-center transition-all ${
                        customIcon === ic
                          ? 'btn-game-gold text-game-darker'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{ic}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="btn-game-green w-full py-3 mt-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-game-btn active:scale-95"
              >
                Create Custom Reward
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. TREASURY LEDGER MODAL */}
      {ledgerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setLedgerModalOpen(false)} />
          <div className="relative w-full max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-game-panel border-2 border-game-border p-5 shadow-game-modal z-10 animate-slideUp flex flex-col gap-3 text-white">
            <div className="flex items-center justify-between pb-2.5 border-b-2 border-game-border">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gold-accent text-[22px]">receipt_long</span>
                <h3 className="text-base font-black text-white uppercase tracking-wider">
                  Treasury Ledger
                </h3>
                <span className="text-[10px] text-gold-light font-black bg-gold-dark/30 px-2 py-0.5 rounded-full border border-gold-dark/50">
                  {transactions.length} records
                </span>
              </div>
              <button
                onClick={() => setLedgerModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-game-darker hover:bg-game-dark border border-game-border flex items-center justify-center text-gray-400 hover:text-white"
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
                className="w-full h-9 px-3 rounded-xl bg-game-darker border border-game-border text-xs text-white focus:outline-none focus:border-gold-accent font-medium"
              />

              <div className="flex items-center justify-between gap-1 flex-wrap">
                <div className="flex items-center gap-1 bg-game-darker p-0.5 rounded-lg border border-game-border">
                  {(['all', 'coins', 'shards'] as const).map(curr => (
                    <button
                      key={curr}
                      onClick={() => setLedgerCurrencyFilter(curr)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-all ${
                        ledgerCurrencyFilter === curr
                          ? 'btn-game-gold text-game-darker'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 bg-game-darker p-0.5 rounded-lg border border-game-border">
                  {(['all', 'earn', 'spend'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setLedgerTypeFilter(type)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-all ${
                        ledgerTypeFilter === type
                          ? 'btn-game-blue text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {type === 'all' ? 'All' : type === 'earn' ? '+ Inflow' : '- Outflow'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scrollable Records */}
            <div className="flex-1 overflow-y-auto space-y-2 max-h-80 pr-1 custom-scrollbar">
              {filteredLedger.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-400 font-medium">
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
                      className="p-2.5 rounded-xl bg-game-darker border border-game-border flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isEarn
                              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-400'
                              : 'bg-red-950/80 border border-red-500/50 text-red-400'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {isEarn ? 'arrow_upward' : 'arrow_downward'}
                          </span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-black text-white truncate">{tx.reason}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{dateStr}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end flex-shrink-0">
                        <span
                          className={`text-xs font-black tabular-nums ${
                            isEarn ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {isEarn ? '+' : '-'}{tx.amount.toLocaleString()} {tx.currency}
                        </span>
                        <span className="text-[10px] text-gray-400 font-semibold">
                          Bal: {tx.balanceAfter.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-2.5 border-t-2 border-game-border flex items-center justify-end">
              <button
                onClick={() => setLedgerModalOpen(false)}
                className="btn-game-dark px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-gray-300 hover:text-white"
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