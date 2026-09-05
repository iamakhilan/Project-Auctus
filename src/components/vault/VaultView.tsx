import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';

export const VaultView: React.FC = () => {
  const {
    profile,
    rewards,
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

  const filteredRewards = rewards.filter(r => r.type === activeShopTab);

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
    <div className="flex flex-col w-full max-w-lg mx-auto px-4 pb-32 pt-2 space-y-5">
      {/* 1. ROYAL TREASURY CHAMBER HUD */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#162e59] to-[#0c1c38] border-2 border-[#2b4c85] shadow-[0_12px_32px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] p-4 flex flex-col gap-3">
        {/* Ambient Royal Flare */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 border border-amber-300 shadow-[0_4px_10px_rgba(245,158,11,0.4)] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#3d1a00] text-[24px] fill-1">
                account_balance
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm font-extrabold text-white tracking-wide text-[16px] drop-shadow-sm">
                Treasury Chamber
              </span>
              <span className="font-label-sm text-[10px] text-amber-300/90 uppercase font-black tracking-wider">
                Season 4 Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#08152c]/90 border border-emerald-500/40 shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
            <span className="font-label-sm text-[10px] text-emerald-400 font-extrabold tracking-wider uppercase">
              Vault Secure
            </span>
          </div>
        </div>

        {/* Currency Triad HUD Tiles */}
        <div className="grid grid-cols-3 gap-2 relative z-10">
          {/* Coins Counter */}
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-b from-[#1a386b] to-[#102447] border border-amber-400/30 shadow-[0_5px_0_#09172f,0_8px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] transition-transform active:scale-95">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-amber-400 text-[18px] drop-shadow-[0_2px_4px_rgba(245,158,11,0.5)] fill-1">
                monetization_on
              </span>
              <span className="font-headline-sm text-[16px] text-amber-300 font-black tracking-tight">
                {profile.coins.toLocaleString()}
              </span>
            </div>
            <span className="font-label-sm text-[9px] text-amber-200/80 uppercase font-bold tracking-wider mt-0.5">
              Auctus Coins
            </span>
          </div>

          {/* Spire Shards */}
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-b from-[#1a386b] to-[#102447] border border-sky-400/30 shadow-[0_5px_0_#09172f,0_8px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] transition-transform active:scale-95">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sky-400 text-[18px] drop-shadow-[0_2px_4px_rgba(56,189,248,0.5)] fill-1">
                diamond
              </span>
              <span className="font-headline-sm text-[16px] text-sky-300 font-black tracking-tight">
                {profile.shards}
              </span>
            </div>
            <span className="font-label-sm text-[9px] text-sky-200/80 uppercase font-bold tracking-wider mt-0.5">
              Spire Shards
            </span>
          </div>

          {/* Ready Chests */}
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-b from-[#214b8a] to-[#132c54] border-2 border-emerald-400/60 shadow-[0_5px_0_#09172f,0_8px_16px_rgba(0,200,83,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] transition-transform active:scale-95">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-emerald-400 text-[18px] drop-shadow-[0_2px_6px_rgba(0,200,83,0.6)] fill-1">
                redeem
              </span>
              <span className="font-headline-sm text-[16px] text-emerald-300 font-black tracking-tight">
                {dailyStreakClaimed ? 0 : 1}
              </span>
            </div>
            <span className="font-label-sm text-[9px] text-emerald-200 uppercase font-black tracking-wider mt-0.5">
              Unclaimed
            </span>
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
            <h2 className="font-headline-md font-extrabold text-[18px] text-white tracking-wide drop-shadow-sm">
              Loot Chest Gallery
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 font-label-sm text-[10px] text-emerald-300 uppercase font-black tracking-wider">
            {dailyStreakClaimed ? '0 Unlocked' : '1 Unlocked'}
          </span>
        </div>

        {/* CHEST 1: Daily Streak Chest (Ready to open!) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#183569] to-[#0f2142] p-4 border-2 border-amber-400/60 shadow-[0_12px_28px_rgba(245,158,11,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)] flex flex-col gap-3">
          <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-amber-400/25 blur-3xl pointer-events-none" />
          <div className="flex items-start gap-3 relative z-10">
            {/* Chest Artwork Image Pedestal */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-[#0a162b] border-2 border-amber-400 shadow-[0_6px_16px_rgba(0,0,0,0.6)]">
              <img
                src="/assets/chest_streak.png"
                alt="Daily Streak Chest"
                className="w-full h-full object-cover"
              />
              {!dailyStreakClaimed && (
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-yellow-300 text-[#3f1900] font-label-sm text-[9px] uppercase font-black shadow-md border border-yellow-100">
                  READY
                </span>
              )}
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-1 text-rose-400">
                <span className="material-symbols-outlined text-[15px] text-ruby drop-shadow fill-1">
                  local_fire_department
                </span>
                <span className="font-label-sm text-[10px] text-rose-300 uppercase tracking-wide font-black">
                  {profile.streakDays}-Day Streak Perk
                </span>
              </div>
              <h3 className="font-headline-sm font-extrabold text-[16px] text-white truncate mt-0.5 drop-shadow">
                Daily Streak Chest
              </h3>
              <p className="font-body-sm text-[12px] text-on-surface-variant line-clamp-2 mt-0.5 leading-snug">
                Guaranteed 120-180 Auctus Coins, bonus XP spark, and rare focus elixir.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-md bg-purple-900/60 border border-purple-400/40 text-purple-200 font-label-sm text-[9px] uppercase font-bold">
                  Tier I Epic
                </span>
                <span className="font-label-sm text-[10px] text-amber-300 font-semibold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">timer</span> Expires in 7h 42m
                </span>
              </div>
            </div>
          </div>

          {/* Tactile Luminous Gold 3D Action Button */}
          <button
            onClick={handleClaimDailyStreak}
            disabled={dailyStreakClaimed}
            className={`w-full py-3.5 px-4 rounded-xl font-headline-sm font-black text-[15px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              dailyStreakClaimed
                ? 'bg-[#142340] border border-white/10 text-on-surface-variant cursor-not-allowed shadow-none'
                : 'bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-500 text-[#3d1a00] border-t border-yellow-100 shadow-[0_6px_0_#9a6200,0_10px_22px_rgba(245,158,11,0.5)] active:translate-y-1 active:shadow-[0_2px_0_#9a6200] cursor-pointer'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] fill-1">redeem</span>
            <span>{dailyStreakClaimed ? 'CLAIMED!' : 'CLAIM LOOT'}</span>
          </button>
        </div>

        {/* CHEST 2: Weekly Focus Grand Chest */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0f2244] p-4 border border-[#22447d] shadow-[0_6px_18px_rgba(0,0,0,0.4)] flex flex-col gap-2">
          <div className="flex items-start gap-3">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[#071328] border border-sky-400/30 shadow-inner">
              <img
                src="/assets/chest_cyber.png"
                alt="Cyber Grand Chest"
                className="w-full h-full object-cover grayscale opacity-60"
              />
              <div className="absolute inset-0 bg-[#081427]/60 backdrop-blur-[1px] flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-[24px]">lock_clock</span>
              </div>
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[10px] text-sky-400 uppercase font-extrabold">
                  Unlocks in 2 Days
                </span>
                <span className="font-label-sm text-[10px] text-sky-200 font-black">14 / 20 hrs</span>
              </div>
              <h3 className="font-headline-sm font-bold text-white text-[15px] truncate mt-0.5">
                Weekly Focus Grand Chest
              </h3>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">
                Log 6 more deep work hours to break the cyber seal.
              </p>
              {/* Progress Track */}
              <div className="w-full h-2.5 bg-[#060e1d] rounded-full overflow-hidden mt-2 p-0.5 border border-sky-500/20 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-sky-300 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                  style={{ width: '70%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* CHEST 3: Mastery Relic Case */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0f2244] p-4 border border-[#22447d] shadow-[0_6px_18px_rgba(0,0,0,0.4)] flex flex-col gap-2">
          <div className="flex items-start gap-3">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[#071328] border border-emerald-400/30 shadow-inner">
              <img
                src="/assets/chest_relic.png"
                alt="Relic Case"
                className="w-full h-full object-cover grayscale opacity-60"
              />
              <div className="absolute inset-0 bg-[#081427]/60 backdrop-blur-[1px] flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-400 text-[24px]">lock</span>
              </div>
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[10px] text-emerald-400 uppercase font-extrabold">
                  Milestone: Deep Sessions
                </span>
                <span className="font-label-sm text-[10px] text-emerald-200 font-black">42 / 50</span>
              </div>
              <h3 className="font-headline-sm font-bold text-white text-[15px] truncate mt-0.5">
                Mastery Relic Case
              </h3>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">
                Complete 8 more 45m+ Pomodoro sessions to unlock.
              </p>
              <div className="w-full h-2.5 bg-[#060e1d] rounded-full overflow-hidden mt-2 p-0.5 border border-emerald-500/20 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full shadow-[0_0_10px_rgba(0,200,83,0.7)]"
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
            <h2 className="font-headline-md font-extrabold text-[18px] text-white tracking-wide drop-shadow-sm">
              Reward Bazaar
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-[#071329] p-1 rounded-xl border border-outline-variant/50 shadow-inner">
            <button
              onClick={() => setActiveShopTab('irl')}
              className={`px-3 py-1 rounded-lg font-label-sm text-[11px] font-bold transition-all ${
                activeShopTab === 'irl'
                  ? 'bg-gradient-to-b from-[#21437c] to-[#162f59] border border-sky-400/40 text-white shadow'
                  : 'text-on-surface-variant hover:text-white'
              }`}
            >
              Real-Life
            </button>
            <button
              onClick={() => setActiveShopTab('game')}
              className={`px-3 py-1 rounded-lg font-label-sm text-[11px] font-bold transition-all ${
                activeShopTab === 'game'
                  ? 'bg-gradient-to-b from-[#21437c] to-[#162f59] border border-sky-400/40 text-white shadow'
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
                  className="rounded-2xl bg-[#0b172e] p-3 flex items-center justify-between gap-3 border border-[#1b345e] shadow-inner opacity-80"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-[#081122] flex items-center justify-center flex-shrink-0 text-on-surface-variant/70 border border-white/5">
                      <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1">
                        <h4 className="font-headline-sm font-bold text-white/80 text-[14px] truncate">
                          {item.title}
                        </h4>
                        <span className="material-symbols-outlined text-sky-400 text-[15px]">lock</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-label-sm text-[10px] text-sky-300 font-black">
                          Unlocks at Citadel LV.{item.requiredLevel}
                        </span>
                        <span className="text-on-surface-variant font-label-sm text-[10px]">
                          (Current: LV.{profile.level})
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    disabled
                    className="px-3.5 py-2 rounded-xl bg-[#142340] border border-white/5 text-on-surface-variant font-headline-sm font-bold text-[13px] flex-shrink-0 cursor-not-allowed"
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
                  className="rounded-2xl bg-[#0b172e] p-3 flex items-center justify-between gap-3 border border-[#1b345e] shadow-inner opacity-85"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-[#081122] flex items-center justify-center flex-shrink-0 text-on-surface-variant/70 border border-white/5">
                      <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1">
                        <h4 className="font-headline-sm font-bold text-white/80 text-[14px] truncate">
                          {item.title}
                        </h4>
                        <span className="material-symbols-outlined text-on-surface-variant text-[15px]">lock</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="flex items-center gap-0.5 font-label-md text-on-surface-variant font-bold text-[12px]">
                          <span className="material-symbols-outlined text-[14px]">monetization_on</span>
                          {item.cost}
                        </span>
                        <span className="text-rose-400 font-label-sm text-[10px] font-bold">
                          • Need {diff} more coins
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    disabled
                    className="px-4 py-2.5 rounded-xl bg-[#142340] border border-white/5 text-on-surface-variant/60 font-headline-sm font-bold text-[13px] tracking-wide cursor-not-allowed flex-shrink-0"
                  >
                    Locked
                  </button>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-gradient-to-b from-[#13274c] to-[#0c1a36] p-3 flex items-center justify-between gap-3 border border-[#23457d] shadow-[0_4px_14px_rgba(0,0,0,0.4)]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#1c3a6e] to-[#102244] border border-amber-400/30 flex items-center justify-center flex-shrink-0 text-amber-400 shadow-inner">
                    <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h4 className="font-headline-sm font-bold text-white text-[14px] truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="flex items-center gap-0.5 font-label-md text-amber-300 font-extrabold text-[12px]">
                        <span className="material-symbols-outlined text-amber-400 text-[14px] fill-1">
                          monetization_on
                        </span>
                        {item.cost}
                      </span>
                      <span className="text-on-surface-variant font-label-sm text-[10px]">
                        • {item.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Emerald Gem Green Beveled 3D Button */}
                <button
                  onClick={() => redeemReward(item.id)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-b from-emerald-400 to-emerald-600 text-white font-headline-sm font-black text-[13px] uppercase tracking-wide border-t border-emerald-200 shadow-[0_4px_0_#00702e,0_6px_14px_rgba(0,200,83,0.4)] active:translate-y-1 active:shadow-[0_1px_0_#00702e] transition-all flex-shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <span>Redeem</span>
                </button>
              </div>
            );
          })}

          {/* User Custom Reward Builder Trigger */}
          <div
            onClick={() => setCustomModalOpen(true)}
            className="mt-1 rounded-2xl bg-gradient-to-r from-[#0d1d3b] to-[#12274e] border border-dashed border-sky-400/40 p-3 flex items-center justify-between shadow-inner cursor-pointer hover:border-amber-400 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-[20px]">add_circle</span>
              <span className="font-label-md text-on-surface-variant font-semibold text-[13px]">
                Set custom real-world reward
              </span>
            </div>
            <span className="font-label-sm text-amber-300 uppercase font-black text-[11px]">
              Configure
            </span>
          </div>
        </div>
      </section>

      {/* CUSTOM REWARD CREATOR MODAL */}
      {customModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#040a16]/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#173264] to-[#0c1c38] border-2 border-amber-400/80 p-5 shadow-2xl flex flex-col relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-[22px]">stars</span>
                <h3 className="font-headline-sm text-white font-bold text-[16px]">
                  New Custom Reward
                </h3>
              </div>
              <button
                onClick={() => setCustomModalOpen(false)}
                className="text-on-surface-variant hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddCustomReward} className="flex flex-col gap-3">
              <div>
                <label className="font-label-sm text-[10px] text-amber-300 uppercase font-bold block mb-1">
                  Reward Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Saturday Movie Night, Boba Tea..."
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#071224] border border-[#24457e] text-on-surface text-[13px] placeholder:text-outline focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-label-sm text-[10px] text-amber-300 uppercase font-bold block mb-1">
                    Cost (Coins)
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={customCost}
                    onChange={e => setCustomCost(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg bg-[#071224] border border-[#24457e] text-on-surface text-[13px] focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="font-label-sm text-[10px] text-amber-300 uppercase font-bold block mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[#071224] border border-[#24457e] text-on-surface text-[13px] focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="font-label-sm text-[10px] text-amber-300 uppercase font-bold block mb-1">
                  Choose Icon Glyph
                </label>
                <div className="flex items-center justify-between gap-1 bg-[#071224] p-1.5 rounded-lg border border-[#24457e]">
                  {['sports_esports', 'coffee', 'local_pizza', 'flight', 'shopping_bag', 'movie'].map(ic => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setCustomIcon(ic)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                        customIcon === ic
                          ? 'bg-amber-400 text-amber-950 font-bold shadow'
                          : 'text-on-surface-variant hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{ic}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-500 text-[#3d1a00] font-headline-sm font-black text-[14px] uppercase tracking-wide border-t border-yellow-100 shadow-[0_4px_0_#9a6200] active:translate-y-1 active:shadow-none transition-all"
              >
                Create Reward
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
