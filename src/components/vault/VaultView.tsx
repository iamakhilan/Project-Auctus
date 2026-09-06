import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import {
  calculateNetFlow,
  filterTransactions,
} from '../../domain/economy';
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
    <div className="flex flex-col w-full max-w-screen mx-auto px-4 pb-32 pt-3 space-y-5">
      {/* 1. ROYAL TREASURY CHAMBER HUD */}
      <section className="relative overflow-hidden rounded-card bg-gradient-to-b from-surface-container-high to-surface-container-low border border-outline-variant shadow-card-raised p-4 flex flex-col gap-3">
        {/* Ambient Royal Flare */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-control bg-gradient-to-b from-amber-400 to-amber-600 border border-amber-300 shadow-[0_4px_10px_rgba(245,158,11,0.4)] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#3d1a00] text-[24px] fill-1">
                account_balance
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm font-extrabold text-white tracking-wide drop-shadow-sm">
                Treasury Chamber
              </span>
              <span className="font-label-sm text-label-sm text-amber-300/90 uppercase font-black tracking-wider">
                Season 4 Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLedgerModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-surface-dim hover:bg-surface-container border border-amber-400/40 text-amber-300 font-label-sm text-label-sm font-bold shadow-card transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              <span>Ledger</span>
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-dim/90 border border-emerald-500/40 shadow-inset-well">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
              <span className="font-label-sm text-label-sm text-emerald-400 font-extrabold tracking-wider uppercase">
                Secure
              </span>
            </div>
          </div>
        </div>

        {/* Currency Triad HUD Tiles */}
        <div className="grid grid-cols-3 gap-2 relative z-10">
          {/* Coins Counter */}
          <div className="flex flex-col items-center justify-center p-2 rounded-control bg-surface-container border border-amber-400/30 shadow-card transition-transform active:scale-95">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-amber-400 text-[18px] drop-shadow-[0_2px_4px_rgba(245,158,11,0.5)] fill-1">
                monetization_on
              </span>
              <span className="font-headline-sm text-headline-sm text-amber-300 font-black tracking-tight">
                {profile.coins.toLocaleString()}
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-amber-200/80 uppercase font-bold tracking-wider mt-0.5">
              Auctus Coins
            </span>
          </div>

          {/* Spire Shards */}
          <div className="flex flex-col items-center justify-center p-2 rounded-control bg-surface-container border border-sky-400/30 shadow-card transition-transform active:scale-95">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sky-400 text-[18px] drop-shadow-[0_2px_4px_rgba(56,189,248,0.5)] fill-1">
                diamond
              </span>
              <span className="font-headline-sm text-headline-sm text-sky-300 font-black tracking-tight">
                {profile.shards}
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-sky-200/80 uppercase font-bold tracking-wider mt-0.5">
              Spire Shards
            </span>
          </div>

          {/* Ready Chests */}
          <div className="flex flex-col items-center justify-center p-2 rounded-control bg-surface-container border-2 border-emerald-400/60 shadow-card transition-transform active:scale-95">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-emerald-400 text-[18px] drop-shadow-[0_2px_6px_rgba(0,200,83,0.6)] fill-1">
                redeem
              </span>
              <span className="font-headline-sm text-headline-sm text-emerald-300 font-black tracking-tight">
                {dailyStreakClaimed ? 0 : 1}
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-emerald-200 uppercase font-black tracking-wider mt-0.5">
              Unclaimed
            </span>
          </div>
        </div>

        {/* 24h Flow Pill Banner */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-control bg-surface-dim/70 border border-outline-variant text-label-sm text-on-surface-variant relative z-10">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-amber-400">trending_up</span>
            <span>24h Inflow: <strong className="text-emerald-400">+{netFlowCoins.earned}</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-rose-400">shopping_bag</span>
            <span>Spent: <strong className="text-rose-400">-{netFlowCoins.spent}</strong></span>
          </div>
          <div className="font-bold text-amber-300">
            Net: {netFlowCoins.net >= 0 ? `+${netFlowCoins.net}` : netFlowCoins.net}
          </div>
        </div>
      </section>

      {/* 2. LOOT CHEST GALLERY */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-[22px] fill-1">
              military_tech
            </span>
            <h2 className="font-headline-md text-headline-md font-extrabold text-white tracking-wide drop-shadow-sm">
              Loot Chest Gallery
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 font-label-sm text-label-sm text-emerald-300 uppercase font-black tracking-wider">
            {dailyStreakClaimed ? '0 Unlocked' : '1 Unlocked'}
          </span>
        </div>

        {/* CHEST 1: Daily Streak Chest (Ready to open!) */}
        <div className="relative overflow-hidden rounded-card bg-gradient-to-b from-surface-container-high to-surface-container-low p-4 border border-amber-400/60 shadow-[0_12px_28px_rgba(245,158,11,0.25)] flex flex-col gap-3">
          <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-amber-400/25 blur-3xl pointer-events-none" />
          <div className="flex items-start gap-3 relative z-10">
            {/* Chest Artwork Image Pedestal */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-control overflow-hidden bg-surface-dim border-2 border-amber-400 shadow-[0_6px_16px_rgba(0,0,0,0.6)]">
              <img
                src="/assets/chest_streak.png"
                alt="Daily Streak Chest"
                className="w-full h-full object-cover"
              />
              {!dailyStreakClaimed && (
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-yellow-300 text-[#3f1900] font-label-sm text-label-sm uppercase font-black shadow-md border border-yellow-100">
                  READY
                </span>
              )}
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-1 text-rose-400">
                <span className="material-symbols-outlined text-[15px] text-ruby drop-shadow fill-1">
                  local_fire_department
                </span>
                <span className="font-label-sm text-label-sm text-rose-300 uppercase tracking-wide font-black">
                  {profile.streakDays}-Day Streak Perk
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-extrabold text-white truncate mt-0.5 drop-shadow">
                Daily Streak Chest
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-0.5 leading-snug">
                Guaranteed 120-180 Auctus Coins, bonus XP spark, and rare focus elixir.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-md bg-purple-900/60 border border-purple-400/40 text-purple-200 font-label-sm text-label-sm uppercase font-bold">
                  Tier I Epic
                </span>
                <span className="font-label-sm text-label-sm text-amber-300 font-semibold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">timer</span> Expires in 7h 42m
                </span>
              </div>
            </div>
          </div>

          {/* Tactile Luminous Gold 3D Action Button */}
          <button
            onClick={handleClaimDailyStreak}
            disabled={dailyStreakClaimed}
            className={`btn w-full h-12 font-headline-sm text-headline-sm uppercase tracking-wider ${
              dailyStreakClaimed
                ? 'bg-surface-dim border border-outline-variant/60 text-on-surface-variant cursor-not-allowed shadow-none'
                : 'btn-gold'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] fill-1">redeem</span>
            <span>{dailyStreakClaimed ? 'CLAIMED!' : 'CLAIM LOOT'}</span>
          </button>
        </div>

        {/* CHEST 2: Weekly Focus Grand Chest */}
        <div className="relative overflow-hidden rounded-card bg-surface-container-low p-4 border border-outline-variant shadow-card flex flex-col gap-2">
          <div className="flex items-start gap-3">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-control overflow-hidden bg-surface-dim border border-secondary/30 shadow-inset-well">
              <img
                src="/assets/chest_cyber.png"
                alt="Cyber Grand Chest"
                className="w-full h-full object-cover grayscale opacity-60"
              />
              <div className="absolute inset-0 bg-surface-dim/60 backdrop-blur-[1px] flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-[24px]">lock_clock</span>
              </div>
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-sky-400 uppercase font-extrabold">
                  Unlocks in 2 Days
                </span>
                <span className="font-label-sm text-label-sm text-sky-200 font-black">14 / 20 hrs</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-white truncate mt-0.5">
                Weekly Focus Grand Chest
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Log 6 more deep work hours to break the cyber seal.
              </p>
              {/* Progress Track */}
              <div className="w-full h-2.5 bg-surface-dim rounded-full overflow-hidden mt-2 p-0.5 border border-secondary/20 shadow-inset-well">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-sky-300 rounded-full shadow-cyan-aura"
                  style={{ width: '70%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* CHEST 3: Mastery Relic Case */}
        <div className="relative overflow-hidden rounded-card bg-surface-container-low p-4 border border-outline-variant shadow-card flex flex-col gap-2">
          <div className="flex items-start gap-3">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-control overflow-hidden bg-surface-dim border border-emerald-400/30 shadow-inset-well">
              <img
                src="/assets/chest_relic.png"
                alt="Relic Case"
                className="w-full h-full object-cover grayscale opacity-60"
              />
              <div className="absolute inset-0 bg-surface-dim/60 backdrop-blur-[1px] flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-400 text-[24px]">lock</span>
              </div>
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-emerald-400 uppercase font-extrabold">
                  Milestone: Deep Sessions
                </span>
                <span className="font-label-sm text-label-sm text-emerald-200 font-black">42 / 50</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-white truncate mt-0.5">
                Mastery Relic Case
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Complete 8 more 45m+ Pomodoro sessions to unlock.
              </p>
              <div className="w-full h-2.5 bg-surface-dim rounded-full overflow-hidden mt-2 p-0.5 border border-emerald-500/20 shadow-inset-well">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full shadow-emerald-aura"
                  style={{ width: '84%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. REAL-WORLD & IN-GAME REWARD SHOP (REWARD BAZAAR) */}
      <section className="flex flex-col gap-3">
        {/* Header & Filter Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-[22px]">storefront</span>
            <h2 className="font-headline-md text-headline-md font-extrabold text-white tracking-wide drop-shadow-sm">
              Reward Bazaar
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-surface-dim p-1 rounded-control border border-outline-variant/60 shadow-inset-well">
            <button
              onClick={() => setActiveShopTab('irl')}
              className={`px-3 py-1 rounded-control font-label-sm text-label-sm font-bold transition-all ${
                activeShopTab === 'irl'
                  ? 'bg-navy-hi border border-secondary/40 text-white shadow-card'
                  : 'text-on-surface-variant hover:text-white'
              }`}
            >
              Real-Life
            </button>
            <button
              onClick={() => setActiveShopTab('game')}
              className={`px-3 py-1 rounded-control font-label-sm text-label-sm font-bold transition-all ${
                activeShopTab === 'game'
                  ? 'bg-navy-hi border border-secondary/40 text-white shadow-card'
                  : 'text-on-surface-variant hover:text-white'
              }`}
            >
              Citadel Perks
            </button>
          </div>
        </div>

        {/* Reward Items Stream */}
        <div className="flex flex-col gap-2.5">
          {filteredRewards.map(item => {
            const canAfford = profile.coins >= item.cost;
            const isLevelLocked = item.requiredLevel !== undefined && profile.level < item.requiredLevel;

            if (isLevelLocked) {
              return (
                <div
                  key={item.id}
                  className="rounded-card bg-surface-container-low p-3 flex items-center justify-between gap-3 border border-outline-variant shadow-inset-well opacity-80"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-control bg-surface-dim flex items-center justify-center flex-shrink-0 text-on-surface-variant/70 border border-outline-variant/50">
                      <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1">
                        <h4 className="font-headline-sm text-headline-sm font-bold text-white/80 truncate">
                          {item.title}
                        </h4>
                        <span className="material-symbols-outlined text-sky-400 text-[15px]">lock</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-label-sm text-label-sm text-sky-300 font-black">
                          Unlocks at Citadel LV.{item.requiredLevel}
                        </span>
                        <span className="text-on-surface-variant font-label-sm text-label-sm">
                          (Current: LV.{profile.level})
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    disabled
                    className="px-3.5 py-2 rounded-control bg-surface-dim border border-outline-variant/50 text-on-surface-variant font-headline-sm text-headline-sm font-bold flex-shrink-0 cursor-not-allowed"
                  >
                    LV.{item.requiredLevel}
                  </button>
                </div>
              );
            }

            if (!canAfford) {
              const diff = item.cost - profile.coins;
              return (
                <div
                  key={item.id}
                  className="rounded-card bg-surface-container-low p-3 flex items-center justify-between gap-3 border border-outline-variant shadow-inset-well opacity-85"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-control bg-surface-dim flex items-center justify-center flex-shrink-0 text-on-surface-variant/70 border border-outline-variant/50">
                      <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1">
                        <h4 className="font-headline-sm text-headline-sm font-bold text-white/80 truncate">
                          {item.title}
                        </h4>
                        <span className="material-symbols-outlined text-on-surface-variant text-[15px]">lock</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="flex items-center gap-0.5 font-label-md text-label-lg text-on-surface-variant font-bold">
                          <span className="material-symbols-outlined text-[14px]">monetization_on</span>
                          {item.cost}
                        </span>
                        <span className="text-rose-400 font-label-sm text-label-sm font-bold">
                          • Need {diff} more coins
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    disabled
                    className="px-4 py-2.5 rounded-control bg-surface-dim border border-outline-variant/50 text-on-surface-variant/60 font-headline-sm text-headline-sm font-bold tracking-wide cursor-not-allowed flex-shrink-0"
                  >
                    Locked
                  </button>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className="rounded-card bg-gradient-to-b from-surface-container to-surface-container-low p-3 flex items-center justify-between gap-3 border border-outline-variant shadow-card card-hover hover:border-amber-400/40"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-control bg-navy-hi border border-amber-400/30 flex items-center justify-center flex-shrink-0 text-amber-400 shadow-inset-well">
                    <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h4 className="font-headline-sm text-headline-sm font-bold text-white truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="flex items-center gap-0.5 font-label-md text-label-lg text-amber-300 font-extrabold">
                        <span className="material-symbols-outlined text-amber-400 text-[14px] fill-1">
                          monetization_on
                        </span>
                        {item.cost}
                      </span>
                      <span className="text-on-surface-variant font-label-sm text-label-sm">
                        • {item.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Emerald Gem Green Beveled 3D Button */}
                <button
                  onClick={() => redeemReward(item.id)}
                  className="btn btn-emerald h-10 px-4 font-headline-sm text-headline-sm uppercase tracking-wide flex-shrink-0"
                >
                  <span>Redeem</span>
                </button>
              </div>
            );
          })}

          {/* User Custom Reward Builder Trigger */}
          <div
            onClick={() => setCustomModalOpen(true)}
            className="mt-1 rounded-card bg-gradient-to-r from-surface-container-low to-surface-container border border-dashed border-secondary/40 p-3 flex items-center justify-between shadow-inset-well cursor-pointer hover:border-amber-400/50 hover:bg-surface-container transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-[20px]">add_circle</span>
              <span className="font-label-md text-label-lg text-on-surface-variant font-semibold">
                Set custom real-world reward
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-amber-300 uppercase font-black">
              Configure
            </span>
          </div>
        </div>
      </section>

      {/* CUSTOM REWARD CREATOR MODAL */}
      {customModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-surface-container-high to-surface-container-low border border-amber-400/70 p-5 shadow-crown flex flex-col relative animate-scaleUp">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-[22px]">stars</span>
                <h3 className="font-headline-sm text-headline-sm text-white font-bold">
                  New Custom Reward
                </h3>
              </div>
              <button
                onClick={() => setCustomModalOpen(false)}
                className="w-8 h-8 rounded-control flex items-center justify-center text-on-surface-variant hover:text-white hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddCustomReward} className="flex flex-col gap-3">
              <div>
                <label className="font-label-sm text-label-sm text-amber-300 uppercase font-bold block mb-1">
                  Reward Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Saturday Movie Night, Boba Tea..."
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-control bg-surface-dim border border-outline-variant text-on-surface text-body-sm placeholder:text-outline focus:outline-none focus:border-amber-400 transition-all shadow-inset-well"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-label-sm text-label-sm text-amber-300 uppercase font-bold block mb-1">
                    Cost (Coins)
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={customCost}
                    onChange={e => setCustomCost(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-control bg-surface-dim border border-outline-variant text-on-surface text-body-sm focus:outline-none focus:border-amber-400 transition-all shadow-inset-well"
                  />
                </div>

                <div>
                  <label className="font-label-sm text-label-sm text-amber-300 uppercase font-bold block mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-control bg-surface-dim border border-outline-variant text-on-surface text-body-sm focus:outline-none focus:border-amber-400 transition-all shadow-inset-well"
                  />
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="font-label-sm text-label-sm text-amber-300 uppercase font-bold block mb-1">
                  Choose Icon Glyph
                </label>
                <div className="flex items-center justify-between gap-1 bg-surface-dim p-1.5 rounded-control border border-outline-variant shadow-inset-well">
                  {['sports_esports', 'coffee', 'local_pizza', 'flight', 'shopping_bag', 'movie'].map(ic => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setCustomIcon(ic)}
                      className={`w-9 h-9 rounded-control flex items-center justify-center transition-all ${
                        customIcon === ic
                          ? 'bg-amber-400 text-amber-950 font-bold shadow-card'
                          : 'text-on-surface-variant hover:text-white hover:bg-surface-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{ic}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-gold w-full h-12 mt-2 font-headline-sm text-headline-sm uppercase tracking-wide"
              >
                Create Reward
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. TREASURY TRANSACTION HISTORY LEDGER MODAL */}
      {ledgerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg max-h-[85vh] rounded-3xl bg-gradient-to-b from-surface-container-high to-surface-container-low border border-amber-400/60 p-5 shadow-crown flex flex-col relative animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-control bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
                  <span className="material-symbols-outlined text-[22px]">receipt_long</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-white font-extrabold flex items-center gap-2">
                    Treasury Ledger
                    <span className="text-label-sm font-semibold px-2 py-0.5 rounded-full bg-surface-dim border border-outline-variant text-amber-300">
                      {transactions.length} records
                    </span>
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Auditable on-device record of all currency flows.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLedgerModalOpen(false)}
                className="w-8 h-8 rounded-control flex items-center justify-center text-on-surface-variant hover:text-white hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Filters Bar */}
            <div className="py-3 flex flex-col gap-2 border-b border-outline-variant/40">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search ledger entries..."
                    value={ledgerSearch}
                    onChange={e => setLedgerSearch(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 rounded-control bg-surface-dim border border-outline-variant text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Currency & Type Filter Pills */}
              <div className="flex items-center justify-between gap-1 flex-wrap">
                <div className="flex items-center gap-1 bg-surface-dim p-0.5 rounded-control border border-outline-variant/60">
                  {(['all', 'coins', 'shards'] as const).map(curr => (
                    <button
                      key={curr}
                      onClick={() => setLedgerCurrencyFilter(curr)}
                      className={`px-2 py-0.5 rounded-control font-label-sm text-label-sm capitalize transition-all ${
                        ledgerCurrencyFilter === curr
                          ? 'bg-navy-hi border border-amber-400/50 text-amber-300 font-bold'
                          : 'text-on-surface-variant hover:text-white'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 bg-surface-dim p-0.5 rounded-control border border-outline-variant/60">
                  {(['all', 'earn', 'spend'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setLedgerTypeFilter(type)}
                      className={`px-2 py-0.5 rounded-control font-label-sm text-label-sm capitalize transition-all ${
                        ledgerTypeFilter === type
                          ? 'bg-navy-hi border border-sky-400/50 text-sky-300 font-bold'
                          : 'text-on-surface-variant hover:text-white'
                      }`}
                    >
                      {type === 'all' ? 'All Flow' : type === 'earn' ? '+ Inflow' : '- Outflow'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scrollable Transaction Stream */}
            <div className="flex-1 overflow-y-auto py-2 space-y-2 pr-1 custom-scrollbar">
              {filteredLedger.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center text-on-surface-variant gap-2">
                  <span className="material-symbols-outlined text-[36px] opacity-40">search_off</span>
                  <p className="font-body-sm text-body-sm">No transactions matched your filter.</p>
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
                      className="p-2.5 rounded-control bg-surface-container border border-outline-variant/60 flex items-center justify-between gap-2.5 hover:border-amber-400/30 transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-control flex items-center justify-center flex-shrink-0 ${
                            isEarn
                              ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-400'
                              : 'bg-rose-950/70 border border-rose-500/50 text-rose-400'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {isEarn ? 'arrow_upward' : 'arrow_downward'}
                          </span>
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className="font-headline-sm text-label-md font-bold text-white truncate">
                            {tx.reason}
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">
                            {dateStr}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end flex-shrink-0">
                        <span
                          className={`font-headline-sm text-label-lg font-black tracking-tight flex items-center gap-0.5 ${
                            isEarn ? 'text-emerald-300' : 'text-rose-400'
                          }`}
                        >
                          <span>{isEarn ? '+' : '-'}</span>
                          <span>{tx.amount.toLocaleString()}</span>
                          <span className="font-label-sm text-label-sm uppercase ml-0.5 text-on-surface-variant">
                            {tx.currency}
                          </span>
                        </span>
                        <span className="font-label-sm text-label-sm text-amber-200/60">
                          Bal: {tx.balanceAfter.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Local-first zero-telemetry cryptoledger
              </span>
              <button
                onClick={() => setLedgerModalOpen(false)}
                className="btn btn-navy h-8 px-4 font-label-sm text-label-sm uppercase"
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