import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { sortQuestsByPriority } from '../../domain/quests';
import { isHabitCompletedOnDate, formatDateKey } from '../../domain/habits';
import { MissionForgeModal } from './MissionForgeModal';
import { CoinIcon, SwordsIcon, StarIcon, FireStreakIcon } from '../common/GameIcons';

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

  const getDifficultyStars = (tier: string) => {
    switch (tier) {
      case 'Tier I': return 1;
      case 'Tier II': return 2;
      case 'Tier III': return 3;
      case 'Epic': return 3;
      case 'Urgent': return 3;
      default: return 2;
    }
  };

  return (
    <div className="flex flex-col w-full max-w-screen mx-auto px-3 sm:px-4 pt-3 pb-8 space-y-4">
      {/* 1. TOP BOUNTY CLEARANCE HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-game-card border-2 border-game-border shadow-game-card p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gold/20 border border-gold/50 flex items-center justify-center text-amber-300 shadow-sm">
              <span className="material-symbols-outlined text-[22px] fill-1">military_tech</span>
            </div>
            <div>
              <span className="font-game text-[10px] text-amber-300 uppercase tracking-wider font-black block">
                Mission Command
              </span>
              <h2 className="font-game text-sm sm:text-base text-game-text font-black uppercase tracking-tight">
                {totalCompleted}/{totalQuests} Missions Cleared
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsForgeOpen(true)}
            className="btn-game btn-game-gold h-10 px-3.5 font-game text-xs uppercase tracking-wider font-black shadow-game-btn-gold"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Forge</span>
          </button>
        </div>

        {/* Clearance Progress Bar */}
        <div className="w-full h-2.5 bg-game-darkest rounded-full overflow-hidden border border-game-border p-0.5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-gold via-amber-300 to-green rounded-full shadow-green-glow transition-all duration-500"
            style={{ width: `${clearancePercent}%` }}
          />
        </div>

        {/* Status Strip */}
        <div className="flex items-center justify-between text-xs text-game-muted font-body font-bold pt-1 border-t border-game-border">
          <span className="flex items-center gap-1">
            <strong className="text-game-text font-game">{totalActive}</strong> active bounties in queue
          </span>
          <span className="text-amber-300 font-game font-black">
            {clearancePercent}% Clearance
          </span>
        </div>
      </section>

      {/* 2. CATEGORY TABS */}
      <nav className="flex items-center gap-1 bg-game-darkest p-1 rounded-2xl border border-game-border overflow-x-auto custom-scrollbar">
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
            className={`flex-1 py-2 px-2 rounded-xl font-game text-xs flex items-center justify-center gap-1 transition-all whitespace-nowrap cursor-pointer ${
              activeCategoryTab === tab.id
                ? 'bg-game-card border-2 border-gold text-amber-300 font-black shadow-game-card'
                : 'text-game-muted hover:text-game-text border border-transparent'
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-game-dark text-game-text text-[10px] font-black border border-game-border">
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
            className={`px-3 py-1 rounded-full font-game text-[11px] font-black transition-all whitespace-nowrap cursor-pointer ${
              selectedTagFilter === 'All'
                ? 'bg-blue text-white shadow-game-btn-blue border border-blue-light'
                : 'bg-game-card hover:bg-game-cardHi text-game-muted border border-game-border'
            }`}
          >
            All Tags
          </button>
          {tags.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTagFilter(t)}
              className={`px-3 py-1 rounded-full font-game text-[11px] font-black transition-all whitespace-nowrap cursor-pointer ${
                selectedTagFilter === t
                  ? 'bg-blue text-white shadow-game-btn-blue border border-blue-light'
                  : 'bg-game-card hover:bg-game-cardHi text-game-muted border border-game-border'
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
            <div className="p-8 rounded-3xl bg-game-card/60 border-2 border-dashed border-game-border text-center flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[36px] text-amber-300">auto_fix</span>
              <h3 className="font-game text-sm text-game-text font-black uppercase">No Habits Active</h3>
              <p className="font-body text-xs text-game-muted max-w-xs">
                Forge a daily ritual to build streak multipliers and unlock milestone chest loot.
              </p>
              <button
                onClick={() => setIsForgeOpen(true)}
                className="mt-2 btn-game btn-game-gold h-10 px-4 text-xs uppercase font-black"
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
                  className={`relative rounded-3xl bg-game-card border-2 p-4 shadow-game-card flex flex-col gap-3 transition-all ${
                    isDoneToday
                      ? 'border-green/40 bg-game-card/80'
                      : 'border-game-border hover:border-blue'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-game-text font-game font-black text-xs bg-game-darkest border border-orange-500/40 px-2.5 py-0.5 rounded-full shadow-inner">
                        <FireStreakIcon size={14} className="animate-pulse" />
                        {habit.streakCount}d Streak
                      </span>
                      <span className="font-body text-[11px] text-game-dim font-bold">
                        Best: {habit.bestStreak}d
                      </span>
                    </div>

                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="text-game-dim hover:text-red p-1 cursor-pointer"
                      title="Delete Habit"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>

                  <div>
                    <h3 className="font-game text-sm sm:text-base text-game-text font-black">
                      {habit.title}
                    </h3>
                    {habit.description && (
                      <p className="font-body text-xs text-game-muted mt-0.5 line-clamp-2">
                        {habit.description}
                      </p>
                    )}
                  </div>

                  {/* Streak Progress Track */}
                  <div className="flex flex-col gap-1 bg-game-darkest p-2.5 rounded-2xl border border-game-border shadow-inner">
                    <div className="flex items-center justify-between text-[11px] font-game">
                      <span className="text-amber-300 font-bold">Milestone: Day {nextMilestone}</span>
                      <span className="text-game-muted font-bold">{habit.streakCount}/{nextMilestone} days</span>
                    </div>
                    <div className="w-full bg-game-card h-2 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-300 rounded-full transition-all duration-500"
                        style={{ width: `${milestonePercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Check-In Action Button */}
                  <button
                    onClick={() => completeHabit(habit.id)}
                    disabled={isDoneToday}
                    className={`h-11 btn-game font-game text-xs uppercase tracking-wider font-black w-full ${
                      isDoneToday
                        ? 'btn-game-dark text-green-light border-green/40 cursor-default'
                        : 'btn-game-green'
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
            <div className="p-8 rounded-3xl bg-game-card/60 border-2 border-dashed border-game-border text-center flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[36px] text-amber-300">military_tech</span>
              <h3 className="font-game text-sm text-game-text font-black uppercase">No Missions in Queue</h3>
              <p className="font-body text-xs text-game-muted max-w-xs">
                Deploy a new tactical bounty to conquer goals and earn coins.
              </p>
              <button
                onClick={() => setIsForgeOpen(true)}
                className="mt-2 btn-game btn-game-gold h-10 px-4 text-xs uppercase font-black"
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
                    className="relative rounded-2xl bg-game-card/60 border border-game-border p-3.5 shadow-game-card flex items-center justify-between gap-3 opacity-70"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-game-darkest border border-game-border flex items-center justify-center text-green-light flex-shrink-0">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h3 className="font-game text-sm text-game-text line-through opacity-70 truncate font-bold">
                          {quest.title}
                        </h3>
                        <span className="font-game text-[11px] text-amber-300 font-bold">
                          +{quest.xpReward} XP • +{quest.coinReward} Coins
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteQuest(quest.id)}
                      className="text-game-dim hover:text-red p-1 flex-shrink-0 cursor-pointer"
                      title="Delete from archive"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </article>
                );
              }

              const isEpic = quest.tier === 'Epic' || quest.category === 'epic';
              const stars = getDifficultyStars(quest.tier);

              return (
                <article
                  key={quest.id}
                  className={`relative rounded-3xl bg-game-card border-2 p-4 shadow-game-card flex flex-col gap-3 transition-all ${
                    isEpic
                      ? 'border-gold shadow-gold-glow'
                      : 'border-game-border hover:border-blue'
                  }`}
                >
                  {/* Card Header: Tier Badge & Difficulty Stars */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-lg font-game text-[10px] font-black uppercase border ${
                        isEpic
                          ? 'bg-gold/20 text-amber-300 border-gold/60'
                          : 'bg-blue/20 text-blue-light border-blue/40'
                      }`}>
                        {quest.tier}
                      </span>
                      {quest.tag && (
                        <span className="px-2 py-0.5 rounded-lg bg-game-darkest border border-game-border text-game-muted text-[10px] font-bold font-game">
                          #{quest.tag}
                        </span>
                      )}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map(s => (
                          <StarIcon key={s} size={12} filled={s <= stars} />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-game-muted font-body font-bold">
                      <span className="material-symbols-outlined text-[14px] text-amber-300">schedule</span>
                      <span>{quest.dueLabel || 'Today'}</span>
                    </div>
                  </div>

                  {/* Title & Notes */}
                  <div>
                    <h3 className="font-game text-sm sm:text-base text-game-text font-black">
                      {quest.title}
                    </h3>
                    {quest.description && (
                      <p className="font-body text-xs text-game-muted mt-0.5 line-clamp-2">
                        {quest.description}
                      </p>
                    )}
                  </div>

                  {/* Reward Strip */}
                  <div className="flex items-center justify-between py-1.5 px-3 rounded-2xl bg-game-darkest border border-game-border text-xs font-game shadow-inner">
                    <div className="flex items-center gap-3">
                      <span className="text-blue-light font-black">+{quest.xpReward} XP</span>
                      {quest.coinReward > 0 && (
                        <span className="text-amber-300 font-black flex items-center gap-1">
                          <CoinIcon size={14} />
                          +{quest.coinReward} Coins
                        </span>
                      )}
                    </div>
                    <span className="text-game-muted font-body font-bold text-[11px]">
                      ~{quest.estimatedMinutes || 25}m target
                    </span>
                  </div>

                  {/* Action Row */}
                  <div className="flex items-center gap-2 pt-0.5">
                    {/* Mark Complete Button */}
                    <button
                      onClick={() => completeQuest(quest.id)}
                      className="w-11 h-11 rounded-2xl btn-game btn-game-green flex items-center justify-center cursor-pointer"
                      title="Conquer Bounty"
                      aria-label="Complete Quest"
                    >
                      <span className="material-symbols-outlined text-[22px] font-black">
                        check
                      </span>
                    </button>

                    {/* Start Focus Battle Button */}
                    <button
                      onClick={() => startFocusSession(quest.estimatedMinutes || 25, quest.id, quest.title)}
                      className="flex-1 h-11 btn-game btn-game-gold font-game text-xs uppercase tracking-wider font-black"
                    >
                      <SwordsIcon size={18} />
                      <span>Engage Focus</span>
                    </button>

                    {/* Delete Option */}
                    <button
                      onClick={() => deleteQuest(quest.id)}
                      className="w-10 h-11 rounded-2xl btn-game btn-game-dark text-game-dim hover:text-red flex items-center justify-center cursor-pointer"
                      title="Dismiss Bounty"
                    >
                      <span className="material-symbols-outlined text-[17px]">delete</span>
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