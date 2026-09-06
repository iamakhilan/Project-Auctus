import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';

export const QuestsView: React.FC = () => {
  const { quests, completeQuest, createQuest, startFocusSession } = useGameState();

  const [activeCategoryTab, setActiveCategoryTab] = useState<'bounty' | 'epic' | 'habit' | 'all'>('bounty');
  const [newTitle, setNewTitle] = useState('');
  const [selectedTier, setSelectedTier] = useState<'Tier I' | 'Tier II' | 'Tier III'>('Tier II');
  const [selectedDeadline, setSelectedDeadline] = useState<'Today' | 'Tonight' | 'Tomorrow'>('Today');

  const filteredQuests = quests.filter(q => {
    if (activeCategoryTab === 'all') return true;
    return q.category === activeCategoryTab;
  });

  const totalQuests = quests.length;
  const completedCount = quests.filter(q => q.isCompleted).length;
  const clearancePercent = totalQuests > 0 ? Math.round((completedCount / totalQuests) * 100) : 0;

  const getTierYield = (tier: 'Tier I' | 'Tier II' | 'Tier III') => {
    switch (tier) {
      case 'Tier I': return { xp: 80, coins: 10 };
      case 'Tier II': return { xp: 150, coins: 20 };
      case 'Tier III': return { xp: 300, coins: 40 };
    }
  };

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createQuest(newTitle.trim(), selectedTier, selectedDeadline);
    setNewTitle('');
  };

  const currentYield = getTierYield(selectedTier);

  return (
    <div className="flex flex-col w-full max-w-screen mx-auto px-4 pb-32 pt-3 space-y-5">
      {/* DAILY CLEARANCE BANNER */}
      <section className="relative overflow-hidden rounded-card bg-gradient-to-b from-surface-container to-surface-container-low border border-outline-variant shadow-card-raised p-4">
        <div className="absolute -right-10 -top-10 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-3 top-3 opacity-15 pointer-events-none">
          <span className="material-symbols-outlined text-[84px] text-amber-400">military_tech</span>
        </div>

        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-control bg-surface-dim border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inset-well">
              <span className="material-symbols-outlined text-[20px] fill-1">target</span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-amber-400 uppercase tracking-wider block font-bold">
                Bounty Deck Alpha
              </span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                Daily Clearance: {completedCount}/{totalQuests} Completed
              </h2>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 font-label-sm text-label-lg font-black">
            {clearancePercent}%
          </span>
        </div>

        {/* Glowing Progress Track */}
        <div className="relative w-full h-3 bg-surface-dim rounded-full overflow-hidden mb-3 p-0.5 border border-outline-variant/60">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-emerald-aura transition-all duration-500 relative"
            style={{ width: `${clearancePercent}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-75 animate-pulse" />
          </div>
        </div>

        {/* Reward Milestone */}
        <div className="flex items-center justify-between pt-2 bg-surface-dim/90 border-t border-outline-variant/60 -mx-4 -mb-4 px-4 py-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-amber-400 fill-1">stars</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Bonus:</span>
            <span className="font-label-md text-label-lg text-amber-300 font-bold">
              +250 XP & Relic Box
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-label-sm text-label-sm text-emerald-300 uppercase tracking-wider font-extrabold">
              Unlocks at {totalQuests}/{totalQuests}
            </span>
          </div>
        </div>
      </section>

      {/* HUD NAVIGATION TABS */}
      <nav className="flex items-center justify-between gap-1.5 bg-surface-dim p-1.5 rounded-control border border-outline-variant/60 shadow-inset-well">
        <button
          onClick={() => setActiveCategoryTab('bounty')}
          className={`flex-1 py-2 px-1 rounded-control font-label-md text-label-lg flex items-center justify-center gap-1 transition-all ${
            activeCategoryTab === 'bounty'
              ? 'bg-navy-hi text-amber-300 border border-amber-400/40 font-bold shadow-card'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] text-amber-400">swords</span>
          <span>Bounties</span>
          <span className="ml-0.5 px-1.5 py-px rounded-full bg-amber-400 text-amber-950 font-label-sm text-label-sm font-black">
            {quests.filter(q => q.category === 'bounty' && !q.isCompleted).length}
          </span>
        </button>

        <button
          onClick={() => setActiveCategoryTab('epic')}
          className={`flex-1 py-2 px-1 rounded-control font-label-md text-label-lg flex items-center justify-center gap-1 transition-all ${
            activeCategoryTab === 'epic'
              ? 'bg-navy-hi text-purple-300 border border-purple-400/40 font-bold shadow-card'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] text-purple-400">fort</span>
          <span>Epic</span>
          <span className="ml-0.5 px-1.5 py-px rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 font-label-sm text-label-sm font-bold">
            {quests.filter(q => q.category === 'epic' && !q.isCompleted).length}
          </span>
        </button>

        <button
          onClick={() => setActiveCategoryTab('habit')}
          className={`flex-1 py-2 px-1 rounded-control font-label-md text-label-lg flex items-center justify-center gap-1 transition-all ${
            activeCategoryTab === 'habit'
              ? 'bg-navy-hi text-cyan-300 border border-cyan-400/40 font-bold shadow-card'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] text-cyan-400">auto_fix</span>
          <span>Habits</span>
          <span className="ml-0.5 px-1.5 py-px rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-label-sm text-label-sm font-bold">
            {quests.filter(q => q.category === 'habit' && !q.isCompleted).length}
          </span>
        </button>
      </nav>

      {/* MISSION CARDS STREAM */}
      <section className="flex flex-col space-y-3" id="quest-list">
        {filteredQuests.length === 0 ? (
          <div className="min-h-[200px] flex flex-col items-center justify-center gap-2 rounded-card bg-surface-container-low/40 border border-dashed border-outline-variant px-6 py-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-dim border border-amber-400/30 flex items-center justify-center text-amber-400/80 shadow-inset-well">
              <span className="material-symbols-outlined text-[32px]">military_tech</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              No Active Missions
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[240px]">
              Forge a new tactical bounty below to earn XP and loot chests!
            </p>
            <span className="mt-1 font-label-sm text-label-lg text-amber-300 uppercase tracking-wider font-extrabold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
              Mission Forge
            </span>
          </div>
        ) : (
          filteredQuests.map(quest => {
            if (quest.isCompleted) {
              return (
                <article
                  key={quest.id}
                  className="relative rounded-card bg-surface-container-low/80 border border-emerald-500/30 p-4 shadow-card overflow-hidden opacity-85 transition-opacity"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500" />

                  {/* Glowing Victory Stamp */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 rotate-[-12deg] pointer-events-none flex flex-col items-center justify-center px-4 py-1.5 rounded-control bg-emerald-950/90 border-2 border-emerald-400 text-emerald-300 shadow-emerald-aura animate-stamp">
                    <span className="font-headline-sm text-headline-sm tracking-widest font-black uppercase text-emerald-300">
                      VICTORY
                    </span>
                    <span className="font-label-sm text-label-sm tracking-tight text-emerald-200 leading-none font-bold">
                      CLAIMED +{quest.xpReward} XP
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm tracking-wider uppercase font-bold">
                        {quest.tier}
                      </span>
                      <span className="line-through font-label-sm text-label-sm text-on-surface-variant font-semibold">
                        Archived
                      </span>
                    </div>
                  </div>

                  <h3 className="font-headline-sm text-headline-sm text-on-surface line-through opacity-75 mb-1 font-extrabold">
                    {quest.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-through mb-2">
                    {quest.description}
                  </p>

                  <div className="flex items-center gap-3 py-1">
                    <div className="flex items-center gap-1 opacity-80">
                      <span className="material-symbols-outlined text-[16px] text-emerald-400 fill-1">
                        check_circle
                      </span>
                      <span className="font-label-md text-label-lg text-emerald-300 font-bold">
                        +{quest.xpReward} XP Acquired
                      </span>
                    </div>
                    {quest.coinReward > 0 && (
                      <div className="flex items-center gap-1 opacity-80">
                        <span className="material-symbols-outlined text-[16px] text-amber-400 fill-1">
                          monetization_on
                        </span>
                        <span className="font-label-md text-label-lg text-amber-300 font-bold">
                          +{quest.coinReward} Coins
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              );
            }

            // Category & Tier Styling
            const isEpic = quest.tier === 'Epic' || quest.category === 'epic';
            const isUrgent = quest.tier === 'Urgent' || quest.isUrgent;
            const isCyan = quest.tier === 'Rare';

            return (
              <article
                key={quest.id}
                className={`relative rounded-card bg-surface-container border p-4 shadow-card overflow-hidden transition-all duration-200 hover:-translate-y-0.5 card-hover ${
                  isEpic
                    ? 'border-indigo-500/40 hover:border-indigo-400/70 shadow-[0_6px_20px_rgba(99,102,241,0.2)]'
                    : isUrgent
                    ? 'border-rose-500/50 hover:border-rose-400/70 shadow-[0_6px_20px_rgba(225,29,72,0.25)]'
                    : isCyan
                    ? 'border-cyan-500/40 hover:border-cyan-400/70'
                    : 'border-outline-variant hover:border-amber-400/50'
                }`}
              >
                {/* Left Colored Stripe */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    isEpic
                      ? 'bg-gradient-to-b from-indigo-400 to-purple-500'
                      : isUrgent
                      ? 'bg-gradient-to-b from-rose-500 to-red-600'
                      : isCyan
                      ? 'bg-cyan-400'
                      : 'bg-amber-400'
                  }`}
                />

                {/* Ambient Top Glow */}
                {isEpic && (
                  <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                )}
                {isUrgent && (
                  <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none">
                    <span className="material-symbols-outlined text-[90px] text-rose-500">
                      local_fire_department
                    </span>
                  </div>
                )}

                {/* Card Header Badges */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isEpic && (
                      <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-950/90 to-indigo-950/90 border border-purple-400/50 text-purple-300 font-label-sm text-label-sm tracking-wider uppercase flex items-center gap-1 font-bold shadow-sm">
                        <span className="material-symbols-outlined text-[12px] text-purple-300">diamond</span> Epic Bounty
                      </span>
                    )}

                    {isUrgent && (
                      <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-red-600 text-white font-label-sm text-label-sm tracking-wider uppercase flex items-center gap-1 animate-pulse font-extrabold shadow-md">
                        <span className="material-symbols-outlined text-[13px] fill-1">local_fire_department</span> Urgent
                      </span>
                    )}

                    {isCyan && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-label-sm text-label-sm tracking-wider uppercase flex items-center gap-1 font-bold">
                        <span className="material-symbols-outlined text-[12px]">code</span> Citadel Engineering
                      </span>
                    )}

                    {!isEpic && !isUrgent && !isCyan && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 font-label-sm text-label-sm tracking-wider uppercase font-bold">
                        {quest.tier} Bounty
                      </span>
                    )}

                    {quest.focusStonesRequired && (
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-high border border-blue-400/30 text-cyan-300 font-label-sm text-label-sm flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-[12px] text-cyan-400">token</span> {quest.focusStonesRequired} Focus Stones
                      </span>
                    )}

                    {quest.isStreakAtRisk && (
                      <span className="font-label-sm text-label-sm text-rose-300 bg-rose-950/80 border border-rose-500/40 px-2 py-0.5 rounded-md font-bold">
                        Streak at Risk!
                      </span>
                    )}
                  </div>

                  {/* Deadline or Streak Tag */}
                  {quest.dueLabel && (
                    <div className="flex items-center gap-1 text-rose-400 bg-rose-950/40 border border-rose-500/30 px-2 py-0.5 rounded-md">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      <span className="font-label-sm text-label-sm font-semibold">{quest.dueLabel}</span>
                    </div>
                  )}
                </div>

                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1 font-extrabold">
                  {quest.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-3 line-clamp-2">
                  {quest.description}
                </p>

                {/* Rewards HUD Bar */}
                <div className="flex items-center justify-between pt-1 bg-surface-dim border border-outline-variant/60 rounded-control p-2 mb-3 shadow-inset-well">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-emerald-400 fill-1 font-bold">
                        bolt
                      </span>
                      <span className="font-label-md text-label-lg text-emerald-300 font-extrabold">
                        +{quest.xpReward} XP
                      </span>
                    </div>

                    {quest.coinReward > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-amber-400 fill-1">
                          monetization_on
                        </span>
                        <span className="font-label-md text-label-lg text-amber-300 font-extrabold">
                          +{quest.coinReward} Coins
                        </span>
                      </div>
                    )}

                    {quest.streakShieldReward && (
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-cyan-400">
                          verified_user
                        </span>
                        <span className="font-label-md text-label-lg text-cyan-300 font-bold">
                          +{quest.streakShieldReward} Streak Shield
                        </span>
                      </div>
                    )}
                  </div>

                  {quest.phaseLabel && (
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase">
                      {quest.phaseLabel}
                    </span>
                  )}
                </div>

                {/* Action Footer */}
                <div className="flex items-center gap-2">
                  {/* Mark Completed Checkbox */}
                  <button
                    onClick={() => completeQuest(quest.id)}
                    aria-label="Mark completed"
                    className="w-12 h-11 rounded-control bg-surface-container-highest border border-outline-variant text-on-surface-variant hover:text-amber-400 hover:border-amber-400/50 flex items-center justify-center transition-all active:scale-90 shadow-card focus:outline-none"
                    title="Mark mission complete"
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      check_box_outline_blank
                    </span>
                  </button>

                  {/* Contextual Action Button */}
                  <button
                    onClick={() => startFocusSession(25, quest.id, quest.title)}
                    className={`flex-1 h-11 btn uppercase tracking-wider font-black ${
                      isUrgent
                        ? 'btn-emerald font-label-lg text-label-lg border-t border-emerald-300'
                        : isCyan
                        ? 'btn-ghost font-label-lg text-label-lg'
                        : 'btn-gold font-label-lg text-label-lg border-t border-yellow-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[19px] fill-1">
                      {isUrgent ? 'bolt' : isCyan ? 'terminal' : 'swords'}
                    </span>
                    <span>{isUrgent ? 'Quick Clear' : isCyan ? 'Engage Focus' : 'Engage Focus'}</span>
                  </button>
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* QUICK MISSION CREATION DOCK / MISSION FORGE */}
      <section className="sticky bottom-20 z-20 w-full rounded-card bg-surface-container border border-amber-400/40 p-3 shadow-card-raised backdrop-blur-md">
        <form onSubmit={handleDeploy} className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-amber-400 text-[18px]">hardware</span>
              <span className="font-label-md text-label-lg text-amber-300 uppercase tracking-wider font-extrabold">
                Mission Forge
              </span>
            </div>

            {/* Auto Reward Display Indicator */}
            <div className="flex items-center gap-2 bg-surface-dim border border-outline-variant px-2.5 py-1 rounded-md shadow-inset-well">
              <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Yield:</span>
              <span className="font-label-md text-label-lg text-emerald-300 font-extrabold">
                +{currentYield.xp} XP
              </span>
              <span className="font-label-md text-label-lg text-amber-300 font-extrabold">
                +{currentYield.coins} G
              </span>
            </div>
          </div>

          {/* Title Input Well */}
          <div className="relative flex items-center">
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Enter tactical bounty title..."
              className="w-full h-11 pl-3 pr-10 rounded-control bg-surface-dim border border-outline-variant text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:border-amber-400 transition-all shadow-inset-well"
            />
            <button
              type="button"
              className="absolute right-2 text-on-surface-variant hover:text-amber-400 transition-colors"
              title="Voice Input Rune"
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>
          </div>

          {/* Meta Selectors: Difficulty + Deadline + Submit */}
          <div className="flex items-center justify-between gap-2">
            {/* Difficulty selector chips */}
            <div className="flex items-center gap-1 bg-surface-dim border border-outline-variant p-1 rounded-control">
              {(['Tier I', 'Tier II', 'Tier III'] as const).map(tier => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setSelectedTier(tier)}
                  className={`px-2 py-1 rounded font-label-sm text-label-sm transition-all ${
                    selectedTier === tier
                      ? 'bg-navy-hi text-amber-300 border border-amber-400/40 font-black shadow-card'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>

            {/* Deadline rune selector */}
            <button
              type="button"
              onClick={() => {
                setSelectedDeadline(prev => (prev === 'Today' ? 'Tonight' : prev === 'Tonight' ? 'Tomorrow' : 'Today'));
              }}
              className="h-9 px-2.5 rounded-control bg-surface-container-high border border-outline-variant text-on-surface flex items-center gap-1 hover:bg-surface-bright transition-colors"
              title="Set Deadline Rune"
            >
              <span className="material-symbols-outlined text-[16px] text-amber-400">hourglass_top</span>
              <span className="font-label-sm text-label-sm font-bold">{selectedDeadline}</span>
            </button>

            {/* Deploy mission button */}
            <button
              type="submit"
              className="flex-1 h-9 btn btn-gold font-label-md text-label-lg uppercase tracking-wider font-black border-t border-yellow-200"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Forge</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};