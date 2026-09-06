import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { QuestTier, QuestCategory, QuestTag } from '../../types';
import { getTierRewards, sortQuestsByPriority } from '../../domain/quests';
import { isHabitCompletedOnDate, formatDateKey } from '../../domain/habits';

export const QuestsView: React.FC = () => {
  const {
    quests,
    habits,
    completeQuest,
    createQuest,
    updateQuest: _updateQuest,
    deleteQuest,
    completeHabit,
    createHabit,
    deleteHabit,
    startFocusSession,
  } = useGameState();

  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'bounty' | 'epic' | 'habit' | 'completed'>('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('All');
  const [newTitle, setNewTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<QuestCategory>('bounty');
  const [selectedTier, setSelectedTier] = useState<QuestTier>('Tier II');
  const [selectedTag, setSelectedTag] = useState<QuestTag>('Coding');
  const [selectedDeadline, setSelectedDeadline] = useState<'Today' | 'Tonight' | 'Tomorrow' | 'This Week'>('Today');
  const [estimatedMinutes, setEstimatedMinutes] = useState(25);

  const tags: QuestTag[] = ['Study', 'Coding', 'Health', 'Personal', 'College', 'Project', 'Creative', 'Work'];
  const todayStr = formatDateKey();

  const filteredQuests = sortQuestsByPriority(
    quests.filter(q => {
      // Category filter
      if (activeCategoryTab === 'completed') {
        if (!q.isCompleted) return false;
      } else if (activeCategoryTab === 'all') {
        if (q.isCompleted) return false;
      } else {
        if (q.isCompleted || q.category !== activeCategoryTab) return false;
      }

      // Tag filter
      if (selectedTagFilter !== 'All' && q.tag !== selectedTagFilter) {
        return false;
      }

      return true;
    })
  );

  const totalActive = quests.filter(q => !q.isCompleted).length;
  const totalCompleted = quests.filter(q => q.isCompleted).length;
  const totalQuests = quests.length;
  const clearancePercent = totalQuests > 0 ? Math.round((totalCompleted / totalQuests) * 100) : 0;

  const currentYield = getTierRewards(selectedTier);

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (selectedCategory === 'habit') {
      createHabit(newTitle.trim(), 'focus', undefined, currentYield.xpReward, currentYield.coinReward);
    } else {
      createQuest({
        title: newTitle.trim(),
        category: selectedCategory,
        tier: selectedTier,
        tag: selectedTag,
        dueLabel: selectedDeadline,
        estimatedMinutes,
      });
    }

    setNewTitle('');
  };

  return (
    <div className="flex flex-col w-full max-w-screen mx-auto px-4 pb-32 pt-3 space-y-4">
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
                Mission Command Deck
              </span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                Bounty Progress: {totalCompleted}/{totalQuests} Completed
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
            <span className="font-body-sm text-body-sm text-on-surface-variant">Active Queue:</span>
            <span className="font-label-md text-label-lg text-amber-300 font-bold">
              {totalActive} pending bounties
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-label-sm text-label-sm text-emerald-300 uppercase tracking-wider font-extrabold">
              +25 Trophies / Bounty
            </span>
          </div>
        </div>
      </section>

      {/* CATEGORY & STATUS TABS */}
      <nav className="flex items-center justify-between gap-1 bg-surface-dim p-1.5 rounded-control border border-outline-variant/60 shadow-inset-well overflow-x-auto">
        {(
          [
            { id: 'all', label: 'All Active', icon: 'list_alt', count: quests.filter(q => !q.isCompleted).length },
            { id: 'bounty', label: 'Bounties', icon: 'swords', count: quests.filter(q => q.category === 'bounty' && !q.isCompleted).length },
            { id: 'epic', label: 'Epic', icon: 'fort', count: quests.filter(q => q.category === 'epic' && !q.isCompleted).length },
            { id: 'habit', label: 'Habits', icon: 'auto_fix', count: habits.length },
            { id: 'completed', label: 'Archive', icon: 'inventory_2', count: totalCompleted },
          ] as const
        ).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveCategoryTab(tab.id)}
            className={`flex-1 py-1.5 px-2 rounded-control font-label-sm text-label-sm flex items-center justify-center gap-1 transition-all whitespace-nowrap ${
              activeCategoryTab === tab.id
                ? 'bg-navy-hi text-amber-300 border border-amber-400/40 font-black shadow-card'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
            <span>{tab.label}</span>
            <span className="ml-0.5 px-1.5 py-px rounded-full bg-surface-dim text-amber-300 text-[11px] font-bold border border-amber-400/20">
              {tab.count}
            </span>
          </button>
        ))}
      </nav>

      {/* TAG FILTER CHIPS */}
      {activeCategoryTab !== 'habit' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedTagFilter('All')}
            className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold transition-all whitespace-nowrap ${
              selectedTagFilter === 'All'
                ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                : 'bg-surface-container hover:bg-surface-bright text-sky-200/80 border border-outline-variant'
            }`}
          >
            All Tags
          </button>
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTagFilter(tag)}
              className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold transition-all whitespace-nowrap ${
                selectedTagFilter === tag
                  ? 'bg-cyan-400 text-slate-950 font-black shadow-sm'
                  : 'bg-surface-container hover:bg-surface-bright text-sky-200/80 border border-outline-variant'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* HABIT STREAK CARDS STREAM */}
      {activeCategoryTab === 'habit' ? (
        <section className="flex flex-col space-y-3" id="habit-list">
          {habits.map(habit => {
            const isDoneToday = isHabitCompletedOnDate(habit, todayStr);
            const nextMilestone = [7, 14, 21, 30, 60, 100, 365].find(m => m > habit.streakCount) || 365;
            const milestoneProgress = Math.min(100, Math.round((habit.streakCount / nextMilestone) * 100));

            return (
              <article
                key={habit.id}
                className={`relative rounded-card bg-surface-container border p-4 shadow-card overflow-hidden transition-all duration-200 hover:-translate-y-0.5 card-hover ${
                  isDoneToday ? 'border-emerald-500/50 bg-surface-container-low/90' : 'border-amber-400/40'
                }`}
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    isDoneToday ? 'bg-emerald-400' : 'bg-gradient-to-b from-amber-400 to-rose-500'
                  }`}
                />

                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-label-sm text-label-sm uppercase font-bold">
                      {habit.category}
                    </span>
                    <span className="flex items-center gap-0.5 text-rose-400 font-extrabold text-label-sm bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-[14px] fill-1">local_fire_department</span>
                      {habit.streakCount} Day Streak
                    </span>
                  </div>

                  <span className="text-on-surface-variant font-label-sm text-label-sm">
                    Best: {habit.bestStreak}d
                  </span>
                </div>

                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1 font-extrabold">
                  {habit.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-2.5">
                  {habit.description}
                </p>

                {/* Milestone Progress Bar */}
                <div className="flex flex-col gap-1 mb-3 bg-surface-dim p-2 rounded-control border border-outline-variant/60">
                  <div className="flex items-center justify-between text-label-sm font-semibold">
                    <span className="text-amber-300">Next Milestone: Day {nextMilestone}</span>
                    <span className="text-sky-200/80">{habit.streakCount} / {nextMilestone} days</span>
                  </div>
                  <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden border border-outline-variant/40">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                      style={{ width: `${milestoneProgress}%` }}
                    />
                  </div>
                </div>

                {/* Action Footer */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => completeHabit(habit.id)}
                    disabled={isDoneToday}
                    className={`flex-1 h-11 btn font-label-lg text-label-lg uppercase tracking-wider font-black ${
                      isDoneToday
                        ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 cursor-default'
                        : 'btn-emerald border-t border-emerald-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isDoneToday ? 'check_circle' : 'verified'}
                    </span>
                    <span>{isDoneToday ? 'Completed Today (+XP Claimed)' : `Check In Today (+${habit.xpYield} XP)`}</span>
                  </button>

                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="w-10 h-11 rounded-control bg-surface-dim hover:bg-rose-950/60 border border-outline-variant hover:border-rose-500/40 text-on-surface-variant hover:text-rose-300 flex items-center justify-center transition-all"
                    title="Delete Habit"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        /* MISSION CARDS STREAM */
        <section className="flex flex-col space-y-3" id="quest-list">
          {filteredQuests.length === 0 ? (
            <div className="min-h-[160px] flex flex-col items-center justify-center gap-2 rounded-card bg-surface-container-low/40 border border-dashed border-outline-variant px-6 py-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-surface-dim border border-amber-400/30 flex items-center justify-center text-amber-400/80 shadow-inset-well">
                <span className="material-symbols-outlined text-[28px]">military_tech</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                No Missions In This Filter
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[240px]">
                Deploy a bounty below with the Mission Forge to conquer new milestones.
              </p>
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

                    {/* Victory Stamp */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 rotate-[-10deg] pointer-events-none flex flex-col items-center justify-center px-3 py-1 rounded-control bg-emerald-950/90 border-2 border-emerald-400 text-emerald-300 shadow-emerald-aura">
                      <span className="font-headline-sm text-headline-sm tracking-widest font-black uppercase text-emerald-300">
                        VICTORY
                      </span>
                      <span className="font-label-sm text-label-sm tracking-tight text-emerald-200 leading-none font-bold">
                        +{quest.xpReward} XP
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm tracking-wider uppercase font-bold">
                          {quest.tier}
                        </span>
                        {quest.tag && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 text-label-sm font-semibold border border-cyan-500/20">
                            #{quest.tag}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-headline-sm text-headline-sm text-on-surface line-through opacity-75 mb-1 font-extrabold">
                      {quest.title}
                    </h3>

                    <div className="flex items-center justify-between gap-3 py-1">
                      <div className="flex items-center gap-3">
                        <span className="font-label-md text-label-md text-emerald-300 font-bold">
                          +{quest.xpReward} XP
                        </span>
                        {quest.coinReward > 0 && (
                          <span className="font-label-md text-label-md text-amber-300 font-bold">
                            +{quest.coinReward} Coins
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => deleteQuest(quest.id)}
                        className="text-rose-400/80 hover:text-rose-300 text-body-sm font-semibold p-1"
                        title="Delete from archive"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </article>
                );
              }

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

                      {!isEpic && !isUrgent && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 font-label-sm text-label-sm tracking-wider uppercase font-bold">
                          {quest.tier}
                        </span>
                      )}

                      {quest.tag && (
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high border border-outline-variant text-sky-200 text-label-sm font-semibold">
                          #{quest.tag}
                        </span>
                      )}

                      {quest.isStreakAtRisk && (
                        <span className="font-label-sm text-label-sm text-rose-300 bg-rose-950/80 border border-rose-500/40 px-2 py-0.5 rounded-md font-bold">
                          Streak Risk
                        </span>
                      )}
                    </div>

                    {/* Deadline Tag */}
                    <div className="flex items-center gap-1 text-sky-200/90 bg-surface-dim border border-outline-variant px-2 py-0.5 rounded-md text-label-sm font-semibold">
                      <span className="material-symbols-outlined text-[14px] text-amber-400">schedule</span>
                      <span>{quest.dueLabel || 'Today'}</span>
                    </div>
                  </div>

                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1 font-extrabold">
                    {quest.title}
                  </h3>
                  {quest.description && (
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-2.5 line-clamp-2">
                      {quest.description}
                    </p>
                  )}

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
                            +{quest.coinReward} G
                          </span>
                        </div>
                      )}

                      {quest.streakShieldReward && (
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-cyan-400">
                            verified_user
                          </span>
                          <span className="font-label-md text-label-lg text-cyan-300 font-bold">
                            +1 Shield
                          </span>
                        </div>
                      )}
                    </div>

                    <span className="text-body-sm text-sky-200/70 font-medium">
                      ~{quest.estimatedMinutes || 25}m
                    </span>
                  </div>

                  {/* Action Footer */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => completeQuest(quest.id)}
                      aria-label="Mark completed"
                      className="w-12 h-11 rounded-control bg-surface-container-highest border border-outline-variant text-on-surface-variant hover:text-emerald-400 hover:border-emerald-400/50 flex items-center justify-center transition-all active:scale-90 shadow-card focus:outline-none"
                      title="Conquer Bounty"
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        check_box_outline_blank
                      </span>
                    </button>

                    <button
                      onClick={() => startFocusSession(quest.estimatedMinutes || 25, quest.id, quest.title)}
                      className={`flex-1 h-11 btn uppercase tracking-wider font-black ${
                        isUrgent
                          ? 'btn-emerald font-label-lg text-label-lg border-t border-emerald-300'
                          : 'btn-gold font-label-lg text-label-lg border-t border-yellow-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[19px] fill-1">swords</span>
                      <span>Engage Focus</span>
                    </button>

                    <button
                      onClick={() => deleteQuest(quest.id)}
                      className="w-10 h-11 rounded-control bg-surface-dim hover:bg-rose-950/60 border border-outline-variant hover:border-rose-500/40 text-on-surface-variant hover:text-rose-300 flex items-center justify-center transition-all"
                      title="Dismiss Bounty"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </section>
      )}

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
                +{currentYield.xpReward} XP
              </span>
              <span className="font-label-md text-label-lg text-amber-300 font-extrabold">
                +{currentYield.coinReward} G
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
          </div>

          {/* Meta Selectors: Category + Tier + Tag + Deadline + Submit */}
          <div className="flex items-center justify-between gap-1.5 flex-wrap">
            {/* Category */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as QuestCategory)}
              className="h-9 px-2 rounded-control bg-surface-dim border border-outline-variant text-amber-300 font-label-sm text-label-sm font-bold focus:outline-none"
            >
              <option value="bounty">Bounty</option>
              <option value="epic">Epic</option>
              <option value="habit">Habit</option>
            </select>

            {/* Tier */}
            <select
              value={selectedTier}
              onChange={e => setSelectedTier(e.target.value as QuestTier)}
              className="h-9 px-2 rounded-control bg-surface-dim border border-outline-variant text-cyan-300 font-label-sm text-label-sm font-bold focus:outline-none"
            >
              <option value="Tier I">Tier I (Common)</option>
              <option value="Tier II">Tier II (Rare)</option>
              <option value="Tier III">Tier III (Heroic)</option>
              <option value="Epic">Epic</option>
              <option value="Urgent">Urgent</option>
            </select>

            {/* Tag */}
            <select
              value={selectedTag}
              onChange={e => setSelectedTag(e.target.value as QuestTag)}
              className="h-9 px-2 rounded-control bg-surface-dim border border-outline-variant text-sky-200 font-label-sm text-label-sm font-bold focus:outline-none"
            >
              {tags.map(t => (
                <option key={t} value={t}>#{t}</option>
              ))}
            </select>

            {/* Deadline */}
            <select
              value={selectedDeadline}
              onChange={e => setSelectedDeadline(e.target.value as any)}
              className="h-9 px-2 rounded-control bg-surface-dim border border-outline-variant text-rose-300 font-label-sm text-label-sm font-bold focus:outline-none"
            >
              <option value="Today">Today</option>
              <option value="Tonight">Tonight</option>
              <option value="Tomorrow">Tomorrow</option>
              <option value="This Week">This Week</option>
            </select>

            {/* Duration */}
            <select
              value={estimatedMinutes}
              onChange={e => setEstimatedMinutes(Number(e.target.value))}
              className="h-9 px-2 rounded-control bg-surface-dim border border-outline-variant text-emerald-300 font-label-sm text-label-sm font-bold focus:outline-none"
              title="Estimated Duration"
            >
              <option value={15}>15m</option>
              <option value={25}>25m</option>
              <option value={45}>45m</option>
              <option value={60}>60m</option>
            </select>

            {/* Forge Button */}
            <button
              type="submit"
              className="flex-1 min-w-[90px] h-9 btn btn-gold font-label-md text-label-lg uppercase tracking-wider font-black border-t border-yellow-200"
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