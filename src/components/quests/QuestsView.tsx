import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { sortQuestsByPriority } from '../../domain/quests';
import { isHabitCompletedOnDate, formatDateKey } from '../../domain/habits';
import { MissionForgeModal } from './MissionForgeModal';

export const QuestsView: React.FC = () => {
  const {
    quests,
    habits,
    completeQuest,
    deleteQuest,
    completeHabit,
    deleteHabit,
    startFocusSession,
  } = useGameState();

  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'bounty' | 'epic' | 'habit' | 'completed'>('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('All');
  const [isForgeOpen, setIsForgeOpen] = useState(false);

  const tags = ['Study', 'Coding', 'Health', 'Personal', 'College', 'Project', 'Creative', 'Work'];
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

  return (
    <div className="flex flex-col w-full max-w-screen mx-auto px-3.5 sm:px-4 pt-3 pb-8 space-y-4">
      {/* 1. TOP BOUNTY CLEARANCE HERO BANNER */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-surface-container via-surface-container to-surface-container-low border border-outline-variant/60 shadow-card p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
              <span className="material-symbols-outlined text-[20px] fill-1">military_tech</span>
            </div>
            <div>
              <span className="font-label-sm text-[11px] text-amber-400 uppercase tracking-wider font-extrabold block">
                Mission Command
              </span>
              <h2 className="font-headline-sm text-sm sm:text-base text-on-surface font-black">
                {totalCompleted}/{totalQuests} Bounties Conquered
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsForgeOpen(true)}
            className="btn btn-gold h-9 px-3 font-headline-sm text-xs uppercase tracking-wider font-black shadow-sm"
          >
            <span className="material-symbols-outlined text-[17px]">add</span>
            <span>Forge</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-surface-dim rounded-full overflow-hidden border border-outline-variant/60 p-px">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-emerald-aura transition-all duration-500"
            style={{ width: `${clearancePercent}%` }}
          />
        </div>

        {/* Status Strip */}
        <div className="flex items-center justify-between text-xs text-on-surface-variant font-medium pt-1 border-t border-outline-variant/40">
          <span className="flex items-center gap-1">
            <strong className="text-amber-300">{totalActive}</strong> active bounties in queue
          </span>
          <span className="text-emerald-400 font-bold">
            {clearancePercent}% Clearance
          </span>
        </div>
      </section>

      {/* 2. CATEGORY TABS */}
      <nav className="flex items-center gap-1 bg-surface-dim p-1 rounded-xl border border-outline-variant/60 overflow-x-auto custom-scrollbar">
        {(
          [
            { id: 'all', label: 'All Active', count: quests.filter(q => !q.isCompleted).length },
            { id: 'bounty', label: 'Bounties', count: quests.filter(q => q.category === 'bounty' && !q.isCompleted).length },
            { id: 'epic', label: 'Epic', count: quests.filter(q => q.category === 'epic' && !q.isCompleted).length },
            { id: 'habit', label: 'Habits', count: habits.length },
            { id: 'completed', label: 'Archive', count: totalCompleted },
          ] as const
        ).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveCategoryTab(tab.id)}
            className={`flex-1 py-1.5 px-2 rounded-lg font-label-sm text-xs flex items-center justify-center gap-1 transition-all whitespace-nowrap ${
              activeCategoryTab === tab.id
                ? 'bg-navy-hi text-amber-300 border border-amber-400/40 font-black shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-surface-dim text-amber-300 text-[10px] font-bold border border-amber-400/20">
              {tab.count}
            </span>
          </button>
        ))}
      </nav>

      {/* 3. TAG FILTER CHIPS */}
      {activeCategoryTab !== 'habit' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 custom-scrollbar">
          <button
            onClick={() => setSelectedTagFilter('All')}
            className={`px-3 py-1 rounded-full font-label-sm text-xs font-bold transition-all whitespace-nowrap ${
              selectedTagFilter === 'All'
                ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                : 'bg-surface-container hover:bg-surface-bright text-sky-200/80 border border-outline-variant/60'
            }`}
          >
            All Tags
          </button>
          {tags.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTagFilter(t)}
              className={`px-3 py-1 rounded-full font-label-sm text-xs font-bold transition-all whitespace-nowrap ${
                selectedTagFilter === t
                  ? 'bg-cyan-400 text-slate-950 font-black shadow-sm'
                  : 'bg-surface-container hover:bg-surface-bright text-sky-200/80 border border-outline-variant/60'
              }`}
            >
              #{t}
            </button>
          ))}
        </div>
      )}

      {/* 4. MAIN STREAM (HABITS OR MISSIONS) */}
      {activeCategoryTab === 'habit' ? (
        <section className="flex flex-col space-y-3" id="habit-list">
          {habits.length === 0 ? (
            <div className="p-8 rounded-2xl bg-surface-container/60 border border-dashed border-outline-variant text-center flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[36px] text-amber-400/60">auto_fix</span>
              <h3 className="font-headline-sm text-sm text-white font-bold">No Habits Active</h3>
              <p className="text-xs text-on-surface-variant max-w-xs">
                Forge a daily habit to build streak multipliers and unlock milestone chest rewards.
              </p>
              <button
                onClick={() => setIsForgeOpen(true)}
                className="mt-2 btn btn-gold h-9 px-4 text-xs uppercase font-black"
              >
                + Forge Habit
              </button>
            </div>
          ) : (
            habits.map(habit => {
              const isDoneToday = isHabitCompletedOnDate(habit, todayStr);
              const nextMilestone = [3, 7, 14, 21, 30, 60, 100].find(m => m > habit.streakCount) || 100;
              const milestonePercent = Math.min(100, Math.round((habit.streakCount / nextMilestone) * 100));

              return (
                <article
                  key={habit.id}
                  className={`relative rounded-2xl bg-surface-container border p-4 shadow-card flex flex-col gap-2.5 transition-all ${
                    isDoneToday
                      ? 'border-emerald-500/40 bg-surface-container/70'
                      : 'border-outline-variant/70 hover:border-amber-400/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-rose-400 font-extrabold text-xs bg-rose-950/60 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-[14px] fill-1">local_fire_department</span>
                        {habit.streakCount}d Streak
                      </span>
                      <span className="text-[11px] text-on-surface-variant font-medium">
                        Best: {habit.bestStreak}d
                      </span>
                    </div>

                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="text-on-surface-variant hover:text-rose-400 p-1"
                      title="Delete Habit"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>

                  <div>
                    <h3 className="font-headline-sm text-sm sm:text-base text-white font-extrabold">
                      {habit.title}
                    </h3>
                    {habit.description && (
                      <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">
                        {habit.description}
                      </p>
                    )}
                  </div>

                  {/* Streak Progress Track */}
                  <div className="flex flex-col gap-1 bg-surface-dim p-2 rounded-xl border border-outline-variant/40">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-amber-300">Milestone: Day {nextMilestone}</span>
                      <span className="text-on-surface-variant">{habit.streakCount}/{nextMilestone} days</span>
                    </div>
                    <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                        style={{ width: `${milestonePercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Check-In Action Button */}
                  <button
                    onClick={() => completeHabit(habit.id)}
                    disabled={isDoneToday}
                    className={`h-11 btn font-headline-sm text-xs uppercase tracking-wider font-black w-full ${
                      isDoneToday
                        ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 cursor-default'
                        : 'btn-emerald'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isDoneToday ? 'check_circle' : 'verified'}
                    </span>
                    <span>
                      {isDoneToday ? 'Claimed Today (+XP)' : `Check In Today (+${habit.xpYield} XP)`}
                    </span>
                  </button>
                </article>
              );
            })
          )}
        </section>
      ) : (
        <section className="flex flex-col space-y-3" id="quest-list">
          {filteredQuests.length === 0 ? (
            <div className="p-8 rounded-2xl bg-surface-container/60 border border-dashed border-outline-variant text-center flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[36px] text-amber-400/60">military_tech</span>
              <h3 className="font-headline-sm text-sm text-white font-bold">No Missions In This Filter</h3>
              <p className="text-xs text-on-surface-variant max-w-xs">
                Deploy a bounty with the Mission Forge to conquer new milestones.
              </p>
              <button
                onClick={() => setIsForgeOpen(true)}
                className="mt-2 btn btn-gold h-9 px-4 text-xs uppercase font-black"
              >
                + Forge Bounty
              </button>
            </div>
          ) : (
            filteredQuests.map(quest => {
              if (quest.isCompleted) {
                return (
                  <article
                    key={quest.id}
                    className="relative rounded-2xl bg-surface-container/60 border border-emerald-500/30 p-3.5 shadow-card flex items-center justify-between gap-3 opacity-80"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 flex-shrink-0">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h3 className="font-headline-sm text-sm text-white line-through opacity-80 truncate font-bold">
                          {quest.title}
                        </h3>
                        <span className="text-[11px] text-emerald-400 font-bold">
                          +{quest.xpReward} XP • +{quest.coinReward} Coins
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteQuest(quest.id)}
                      className="text-on-surface-variant hover:text-rose-400 p-1 flex-shrink-0"
                      title="Delete from archive"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </article>
                );
              }

              const isEpic = quest.tier === 'Epic' || quest.category === 'epic';
              const isUrgent = quest.tier === 'Urgent' || quest.isUrgent;

              return (
                <article
                  key={quest.id}
                  className={`relative rounded-2xl bg-surface-container border p-4 shadow-card flex flex-col gap-2.5 transition-all ${
                    isEpic
                      ? 'border-indigo-500/50 shadow-[0_4px_16px_rgba(99,102,241,0.15)]'
                      : isUrgent
                      ? 'border-rose-500/50 shadow-[0_4px_16px_rgba(225,29,72,0.15)]'
                      : 'border-outline-variant/70 hover:border-amber-400/40'
                  }`}
                >
                  {/* Card Header Tags */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-md font-label-sm text-[10px] font-extrabold uppercase ${
                        isEpic
                          ? 'bg-purple-950 text-purple-300 border border-purple-400/40'
                          : isUrgent
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                      }`}>
                        {quest.tier}
                      </span>
                      {quest.tag && (
                        <span className="px-2 py-0.5 rounded-md bg-surface-dim border border-outline-variant/60 text-sky-200 text-[10px] font-semibold">
                          #{quest.tag}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-on-surface-variant font-medium">
                      <span className="material-symbols-outlined text-[13px] text-amber-400">schedule</span>
                      <span>{quest.dueLabel || 'Today'}</span>
                    </div>
                  </div>

                  {/* Title & Notes */}
                  <div>
                    <h3 className="font-headline-sm text-sm sm:text-base text-white font-extrabold">
                      {quest.title}
                    </h3>
                    {quest.description && (
                      <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">
                        {quest.description}
                      </p>
                    )}
                  </div>

                  {/* Reward Strip */}
                  <div className="flex items-center justify-between py-1 px-2.5 rounded-xl bg-surface-dim border border-outline-variant/40 text-xs font-bold">
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-300">+{quest.xpReward} XP</span>
                      {quest.coinReward > 0 && <span className="text-amber-300">+{quest.coinReward} Coins</span>}
                    </div>
                    <span className="text-on-surface-variant font-medium text-[11px]">
                      ~{quest.estimatedMinutes || 25}m
                    </span>
                  </div>

                  {/* Action Row */}
                  <div className="flex items-center gap-2 pt-0.5">
                    {/* Mark Complete Checkbox */}
                    <button
                      onClick={() => completeQuest(quest.id)}
                      className="w-11 h-11 rounded-xl bg-surface-dim border border-outline-variant text-on-surface-variant hover:text-emerald-400 hover:border-emerald-400 flex items-center justify-center active:scale-95 transition-all shadow-sm"
                      title="Conquer Bounty"
                      aria-label="Complete Quest"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        check_box_outline_blank
                      </span>
                    </button>

                    {/* Start Focus Button */}
                    <button
                      onClick={() => startFocusSession(quest.estimatedMinutes || 25, quest.id, quest.title)}
                      className="flex-1 h-11 btn btn-gold font-headline-sm text-xs uppercase tracking-wider font-black shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[17px] fill-1">swords</span>
                      <span>Engage Focus</span>
                    </button>

                    {/* Delete Option */}
                    <button
                      onClick={() => deleteQuest(quest.id)}
                      className="w-9 h-11 rounded-xl bg-surface-dim hover:bg-rose-950/60 border border-outline-variant hover:border-rose-500/40 text-on-surface-variant hover:text-rose-300 flex items-center justify-center transition-all"
                      title="Dismiss Bounty"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </section>
      )}

      {/* MISSION FORGE BOTTOM SHEET MODAL */}
      <MissionForgeModal
        isOpen={isForgeOpen}
        onClose={() => setIsForgeOpen(false)}
      />
    </div>
  );
};