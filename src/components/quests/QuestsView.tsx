import React, { useState } from 'react';
import { QuestTag } from '../../types';
import { useGameState } from '../../context/GameStateContext';
import { MissionForgeModal } from './MissionForgeModal';
import { soundEngine } from '../../utils/audioSynthesizer';

export const QuestsView: React.FC = () => {
  const {
    quests,
    habits,
    completeQuest,
    deleteQuest,
    checkInHabit,
    deleteHabit,
    setActiveTab,
    startFocusSession,
  } = useGameState();

  const [activeFilter, setActiveFilter] = useState<'all' | 'daily' | 'bounty' | 'epic' | 'habits'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultTab, setModalDefaultTab] = useState<'quest' | 'habit'>('quest');

  // Filter Quests
  const filteredQuests = quests.filter((q) => {
    const matchesCat =
      activeFilter === 'all'
        ? true
        : activeFilter === 'habits'
        ? false
        : q.category === activeFilter;
    const matchesTag = selectedTag === 'all' || q.tag === selectedTag;
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.description && q.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesTag && matchesSearch;
  });

  const handleLaunchFocus = (questId: string, questTitle: string, minutes: number = 25) => {
    soundEngine.playClick();
    startFocusSession(minutes, questId, questTitle);
    setActiveTab('focus');
  };

  const tags: QuestTag[] = ['Coding', 'Study', 'Fitness', 'Work', 'Personal', 'Creative', 'Deep Work'];

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-fadeIn select-none">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Feather_Bold'] text-2xl sm:text-3xl text-[var(--dark-blue)] tracking-wide">
            MISSION BOARD & HABIT FORGE
          </h1>
          <p className="text-sm font-bold text-[var(--gray-light)]">
            Execute tactical directives, forge daily disciplines, and collect gold bounties!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEngine.playClick();
              setModalDefaultTab('quest');
              setIsModalOpen(true);
            }}
            className="h-11 px-4 bg-[var(--green)] hover:bg-[var(--green-hover)] text-white font-['Feather_Bold'] text-sm font-black uppercase rounded-2xl border-b-4 border-[var(--green-shadow)] active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-md flex items-center gap-1.5"
          >
            <span>+ FORGE QUEST</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              setModalDefaultTab('habit');
              setIsModalOpen(true);
            }}
            className="h-11 px-4 bg-[var(--orange)] hover:bg-[#e08500] text-white font-['Feather_Bold'] text-sm font-black uppercase rounded-2xl border-b-4 border-[#c77700] active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-md flex items-center gap-1.5"
          >
            <span>+ FORGE HABIT</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-[#e5e5e5] pb-3">
        {[
          { id: 'all', label: 'All Operations', icon: '⚡' },
          { id: 'daily', label: 'Daily Tasks', icon: '📅' },
          { id: 'bounty', label: 'Bounties', icon: '🎯' },
          { id: 'epic', label: 'Epic Quests', icon: '👑' },
          { id: 'habits', label: 'Habits Forge', icon: '🔥' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => {
              soundEngine.playClick();
              setActiveFilter(f.id as typeof activeFilter);
            }}
            className={`px-3.5 py-2 rounded-2xl font-['Feather_Bold'] text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeFilter === f.id
                ? 'bg-[var(--dark-blue)] text-white shadow-xs'
                : 'bg-[#f7f7f7] text-[var(--gray-text)] hover:bg-[#ececec]'
            }`}
          >
            <span>{f.icon}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      {/* Search & Tag Filter Bar */}
      {activeFilter !== 'habits' && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search missions by keyword..."
            className="w-full sm:w-72 px-4 py-2 rounded-2xl border-2 border-[#e5e5e5] focus:border-[var(--blue)] focus:outline-hidden font-bold text-xs text-[var(--dark-blue)]"
          />

          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedTag === 'all'
                  ? 'bg-[var(--blue)] text-white'
                  : 'bg-[#f0f0f0] text-[var(--gray-text)] hover:bg-[#e5e5e5]'
              }`}
            >
              All Tags
            </button>
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(t)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedTag === t
                    ? 'bg-[var(--blue)] text-white'
                    : 'bg-[#f0f0f0] text-[var(--gray-text)] hover:bg-[#e5e5e5]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quests Section */}
      {activeFilter !== 'habits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-['Feather_Bold'] text-lg text-[var(--dark-blue)]">
              ACTIVE MISSIONS ({filteredQuests.filter((q) => !q.isCompleted).length})
            </h2>
            <span className="text-xs font-bold text-[var(--gray-light)]">
              {filteredQuests.filter((q) => q.isCompleted).length} Completed
            </span>
          </div>

          {filteredQuests.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-dashed border-[#d9d9d9] p-8 text-center text-[var(--gray-light)]">
              <span className="text-4xl block mb-2">🎯</span>
              <p className="font-bold text-sm">No missions found matching current filter.</p>
              <button
                onClick={() => {
                  setModalDefaultTab('quest');
                  setIsModalOpen(true);
                }}
                className="mt-3 px-4 py-2 rounded-xl bg-[#eef8ff] text-[var(--blue)] font-black text-xs uppercase hover:bg-[#b9e5fb]"
              >
                + Forge a Mission
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredQuests.map((quest) => {
                const isDone = quest.isCompleted;

                return (
                  <div
                    key={quest.id}
                    className={`p-4 sm:p-5 rounded-3xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isDone
                        ? 'bg-[#f9f9f9] border-[#e5e5e5] opacity-60'
                        : 'bg-white border-[#e5e5e5] hover:border-[#b9e5fb] shadow-xs'
                    }`}
                  >
                    {/* Left: Checkbox + Quest info */}
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <button
                        onClick={() => completeQuest(quest.id)}
                        className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center font-black text-sm transition-all cursor-pointer shrink-0 mt-0.5 ${
                          isDone
                            ? 'bg-[var(--green)] border-[var(--green-shadow)] text-white shadow-xs'
                            : 'bg-white border-[#d9d9d9] hover:border-[var(--green)] text-transparent'
                        }`}
                        title={isDone ? 'Completed' : 'Click to Complete Quest'}
                      >
                        ✓
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md ${
                              quest.category === 'daily'
                                ? 'bg-[#eef8ff] text-[var(--blue)]'
                                : quest.category === 'bounty'
                                ? 'bg-[#fff5ea] text-[var(--orange)]'
                                : 'bg-[#f5f3ff] text-[#a855f7]'
                            }`}
                          >
                            {quest.category}
                          </span>

                          <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-[#f0f0f0] text-[var(--gray-text)]">
                            {quest.tag}
                          </span>

                          {quest.estimatedMinutes && (
                            <span className="text-[11px] font-bold text-[var(--gray-light)]">
                              ⏱️ {quest.estimatedMinutes}m
                            </span>
                          )}
                        </div>

                        <h3
                          className={`font-['Feather_Bold'] text-base text-[var(--dark-blue)] leading-snug ${
                            isDone ? 'line-through text-[var(--gray-light)]' : ''
                          }`}
                        >
                          {quest.title}
                        </h3>

                        {quest.description && (
                          <p className="text-xs text-[var(--gray-text)] font-semibold mt-0.5 line-clamp-2">
                            {quest.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Rewards & Quick Focus */}
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0f0f0]">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-xl bg-[#eef8ff] text-[var(--blue)] text-xs font-black">
                          +{quest.xpReward} XP
                        </span>
                        <span className="px-2 py-1 rounded-xl bg-[#fffbe6] text-[#d48806] text-xs font-black">
                          +{quest.coinsReward} 🟡
                        </span>
                      </div>

                      {!isDone && (
                        <button
                          onClick={() =>
                            handleLaunchFocus(quest.id, quest.title, quest.estimatedMinutes || 25)
                          }
                          className="px-3 py-1.5 rounded-xl bg-[var(--orange)] hover:bg-[#e08500] text-white text-xs font-black uppercase border-b-3 border-[#c77700] active:translate-y-0.5 active:border-b-0 transition-all cursor-pointer shadow-xs whitespace-nowrap flex items-center gap-1"
                          title="Fight Procrastination Boss with this Quest"
                        >
                          <span>⚔️ FOCUS</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          deleteQuest(quest.id);
                        }}
                        className="w-8 h-8 rounded-xl text-[var(--gray-light)] hover:text-[var(--red)] hover:bg-[#ffeef0] flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                        title="Delete Quest"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Habit Forge Section */}
      {(activeFilter === 'all' || activeFilter === 'habits') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-t-2 border-[#e5e5e5] pt-6">
            <div>
              <h2 className="font-['Feather_Bold'] text-xl text-[var(--dark-blue)] flex items-center gap-2">
                <span>🔥</span> HABIT FORGE STREAKS
              </h2>
              <p className="text-xs font-bold text-[var(--gray-light)]">
                Streak milestones unlock bonus XP and coin yields!
              </p>
            </div>
            <span className="text-xs font-black uppercase px-2.5 py-1 rounded-full bg-[#fff5ea] text-[var(--orange)] border border-[#ffd6a5]">
              {habits.length} Active Habits
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.map((habit) => {
              const isCheckedInToday = habit.lastCompletedDate === todayStr;

              // Streak milestones: 3d (1.1x), 7d (1.25x), 14d (1.5x), 21d (1.75x), 30d (2.0x)
              const nextMilestone =
                habit.streakCount < 3
                  ? 3
                  : habit.streakCount < 7
                  ? 7
                  : habit.streakCount < 14
                  ? 14
                  : habit.streakCount < 21
                  ? 21
                  : 30;
              const milestonePercent = Math.min(100, Math.round((habit.streakCount / nextMilestone) * 100));

              return (
                <div
                  key={habit.id}
                  className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-5 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Top: Icon & Category */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">{habit.icon || '🔥'}</span>
                        <div>
                          <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-[#fff5ea] text-[var(--orange)]">
                            {habit.category}
                          </span>
                          <h3 className="font-['Feather_Bold'] text-base text-[var(--dark-blue)] mt-0.5">
                            {habit.title}
                          </h3>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          deleteHabit(habit.id);
                        }}
                        className="w-7 h-7 rounded-lg text-[var(--gray-light)] hover:text-[var(--red)] hover:bg-[#ffeef0] flex items-center justify-center text-xs transition-colors cursor-pointer"
                        title="Delete Habit"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Streak stats & Milestone Bar */}
                    <div className="bg-[#fafafa] p-3 rounded-2xl border border-[#f0f0f0] space-y-2 mt-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 font-black text-[var(--orange)]">
                          <span className="text-base animate-pulse">🔥</span>
                          <span>{habit.streakCount} Day Streak</span>
                        </div>
                        <span className="font-bold text-[var(--gray-light)] text-[11px]">
                          Best: {habit.bestStreak}d • Next: {nextMilestone}d
                        </span>
                      </div>

                      <div className="w-full h-2 bg-[#e5e5e5] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--orange)] rounded-full transition-all duration-500"
                          style={{ width: `${milestonePercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Yields & Check-in Button */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-[var(--blue)]">+{habit.xpYield} XP</span>
                      <span className="text-[#d48806]">+{habit.coinYield} 🟡</span>
                    </div>

                    <button
                      onClick={() => checkInHabit(habit.id)}
                      disabled={isCheckedInToday}
                      className={`px-4 py-2 rounded-2xl font-['Feather_Bold'] text-xs font-black uppercase transition-all cursor-pointer ${
                        isCheckedInToday
                          ? 'bg-[#f0f0f0] text-[var(--gray-light)] cursor-not-allowed border-2 border-transparent'
                          : 'bg-[var(--green)] hover:bg-[var(--green-hover)] text-white border-b-3 border-[var(--green-shadow)] active:translate-y-0.5 active:border-b-0 shadow-xs'
                      }`}
                    >
                      {isCheckedInToday ? 'CHECKED IN ✅' : 'CHECK IN TODAY ⚡'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal */}
      <MissionForgeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultTab={modalDefaultTab}
      />

    </div>
  );
};