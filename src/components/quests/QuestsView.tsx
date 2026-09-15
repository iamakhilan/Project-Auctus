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
    updateQuest,
    checkInHabit,
    deleteHabit,
    updateHabit,
    setActiveTab,
    startFocusSession,
  } = useGameState();

  const [activeFilter, setActiveFilter] = useState<'all' | 'daily' | 'bounty' | 'epic' | 'habits'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultTab, setModalDefaultTab] = useState<'quest' | 'habit'>('quest');

  // inline edit states
  const [editingQuestId, setEditingQuestId] = useState<string | null>(null);
  const [editQuestTitle, setEditQuestTitle] = useState('');
  const [editQuestDesc, setEditQuestDesc] = useState('');
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editHabitTitle, setEditHabitTitle] = useState('');

  // confirm delete
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteType, setConfirmDeleteType] = useState<'quest' | 'habit' | null>(null);

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

  const startEditQuest = (id: string, title: string, desc?: string) => {
    setEditingQuestId(id);
    setEditQuestTitle(title);
    setEditQuestDesc(desc || '');
  };
  const saveEditQuest = () => {
    if (!editingQuestId || !editQuestTitle.trim()) return;
    updateQuest(editingQuestId, { title: editQuestTitle.trim(), description: editQuestDesc.trim() || undefined });
    setEditingQuestId(null);
  };
  const startEditHabit = (id: string, title: string) => {
    setEditingHabitId(id);
    setEditHabitTitle(title);
  };
  const saveEditHabit = () => {
    if (!editingHabitId || !editHabitTitle.trim()) return;
    updateHabit(editingHabitId, { title: editHabitTitle.trim() });
    setEditingHabitId(null);
  };

  const handleDelete = (id: string, type: 'quest' | 'habit') => {
    if (confirmDeleteId === id && confirmDeleteType === type) {
      soundEngine.playClick();
      if (type === 'quest') deleteQuest(id);
      else deleteHabit(id);
      setConfirmDeleteId(null);
      setConfirmDeleteType(null);
    } else {
      setConfirmDeleteId(id);
      setConfirmDeleteType(type);
      setTimeout(() => {
        setConfirmDeleteId((prev) => (prev === id ? null : prev));
      }, 2500);
    }
  };

  // habit streak steps helper
  const getStreakSteps = (streak: number) => {
    const milestones = [3, 7, 14, 21, 30];
    return milestones.map((m) => ({
      milestone: m,
      reached: streak >= m,
      current: streak < m && streak >= (milestones[milestones.indexOf(m) - 1] || 0),
    }));
  };

  const EmptyIllustration: React.FC<{ filter: string }> = ({ filter }) => (
    <div className="bg-white rounded-3xl border-2 border-dashed border-[#d9d9d9] p-8 sm:p-10 text-center">
      <div className="mx-auto w-20 h-20 rounded-3xl bg-[#f7f7f7] border-2 border-[#e5e5e5] flex items-center justify-center text-4xl mb-4">
        {filter === 'habits' ? '🌱' : filter === 'daily' ? '📅' : filter === 'bounty' ? '🎯' : filter === 'epic' ? '👑' : '🗺️'}
      </div>
      <h3 className="font-['Feather_Bold'] text-base text-[var(--dark-blue)]">No missions in this sector</h3>
      <p className="text-xs font-bold text-[var(--gray-light)] mt-1 max-w-sm mx-auto">
        {filter === 'habits'
          ? 'Forge your first daily habit and start building an unbreakable streak.'
          : 'No missions match current filters. Try clearing search or forge a new one!'}
      </p>
      <div className="flex items-center justify-center gap-2 mt-4">
        <button
          onClick={() => {
            setSearchQuery('');
            setSelectedTag('all');
            if (filter === 'habits') setActiveFilter('all');
          }}
          className="px-4 py-2 rounded-2xl bg-[#f7f7f7] border-2 border-[#e5e5e5] text-xs font-black uppercase text-[var(--gray-text)] hover:bg-[#ececec] transition-colors cursor-pointer"
        >
          Clear Filters
        </button>
        <button
          onClick={() => {
            soundEngine.playClick();
            setModalDefaultTab(filter === 'habits' ? 'habit' : 'quest');
            setIsModalOpen(true);
          }}
          className="px-4 py-2 rounded-2xl bg-[var(--green)] text-white font-black text-xs uppercase border-b-4 border-[var(--green-shadow)] active:translate-y-0.5 active:border-b-0 shadow-xs cursor-pointer"
        >
          + Forge {filter === 'habits' ? 'Habit' : 'Mission'}
        </button>
      </div>
    </div>
  );

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
              className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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
                className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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
            <EmptyIllustration filter={activeFilter} />
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredQuests.map((quest) => {
                const isDone = quest.isCompleted;
                const isEditing = editingQuestId === quest.id;
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
                        onClick={() => {
                          soundEngine.playClick();
                          completeQuest(quest.id);
                        }}
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

                        {isEditing ? (
                          <div className="space-y-2 mt-1">
                            <input
                              value={editQuestTitle}
                              onChange={(e) => setEditQuestTitle(e.target.value)}
                              className="w-full px-3 py-2 rounded-2xl border-2 border-[#e5e5e5] focus:border-[var(--blue)] focus:outline-hidden font-bold text-sm text-[var(--dark-blue)]"
                              placeholder="Mission title"
                              autoFocus
                            />
                            <input
                              value={editQuestDesc}
                              onChange={(e) => setEditQuestDesc(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-2xl border-2 border-[#e5e5e5] focus:border-[var(--blue)] focus:outline-hidden font-semibold text-xs text-[var(--gray-text)]"
                              placeholder="Description (optional)"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={saveEditQuest}
                                className="px-3 py-1 rounded-xl bg-[var(--green)] text-white text-xs font-black uppercase border-b-2 border-[var(--green-shadow)] cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingQuestId(null)}
                                className="px-3 py-1 rounded-xl bg-[#f0f0f0] text-[var(--gray-text)] text-xs font-bold cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
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
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right: Rewards & Actions */}
                    <div className="flex items-center gap-2 sm:gap-2 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0f0f0]">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-xl bg-[#eef8ff] text-[var(--blue)] text-xs font-black">
                          +{quest.xpReward} XP
                        </span>
                        <span className="px-2 py-1 rounded-xl bg-[#fffbe6] text-[#d48806] text-xs font-black">
                          +{quest.coinsReward} 🟡
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {!isDone && !isEditing && (
                          <button
                            onClick={() => handleLaunchFocus(quest.id, quest.title, quest.estimatedMinutes || 25)}
                            className="px-3 py-1.5 rounded-xl bg-[var(--orange)] hover:bg-[#e08500] text-white text-xs font-black uppercase border-b-3 border-[#c77700] active:translate-y-0.5 active:border-b-0 transition-all cursor-pointer shadow-xs whitespace-nowrap flex items-center gap-1"
                            title="Fight Procrastination Boss with this Quest"
                          >
                            <span>⚔️ FOCUS</span>
                          </button>
                        )}
                        {!isEditing && (
                          <button
                            onClick={() => startEditQuest(quest.id, quest.title, quest.description)}
                            className="w-8 h-8 rounded-xl bg-[#f7f7f7] border-2 border-[#e5e5e5] text-[var(--gray-text)] hover:border-[var(--blue)] hover:text-[var(--blue)] flex items-center justify-center text-xs transition-colors cursor-pointer"
                            title="Edit Quest"
                          >
                            ✎
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(quest.id, 'quest')}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-colors cursor-pointer border-2 ${
                            confirmDeleteId === quest.id && confirmDeleteType === 'quest'
                              ? 'bg-[var(--red)] border-[var(--red)] text-white animate-pulse'
                              : 'bg-white border-[#e5e5e5] text-[var(--gray-light)] hover:text-[var(--red)] hover:bg-[#ffeef0] hover:border-[#ffc9cc]'
                          }`}
                          title={confirmDeleteId === quest.id ? 'Click again to confirm' : 'Delete Quest'}
                        >
                          {confirmDeleteId === quest.id && confirmDeleteType === 'quest' ? '!' : '🗑️'}
                        </button>
                      </div>
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
              <p className="text-xs font-bold text-[var(--gray-light)]">Streak milestones unlock bonus XP and coin yields!</p>
            </div>
            <span className="text-xs font-black uppercase px-2.5 py-1 rounded-full bg-[#fff5ea] text-[var(--orange)] border border-[#ffd6a5]">
              {habits.length} Active Habits
            </span>
          </div>

          {habits.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-dashed border-[#d9d9d9] p-8 text-center">
              <div className="mx-auto w-20 h-20 rounded-3xl bg-[#fff5ea] border-2 border-[#ffd6a5] flex items-center justify-center text-4xl mb-3">🌱</div>
              <h3 className="font-['Feather_Bold'] text-base text-[var(--dark-blue)]">No habits forged yet</h3>
              <p className="text-xs font-bold text-[var(--gray-light)] mt-1">Forge daily rituals to build unbreakable streaks and earn multipliers.</p>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setModalDefaultTab('habit');
                  setIsModalOpen(true);
                }}
                className="mt-4 px-4 py-2 rounded-2xl bg-[var(--orange)] text-white font-black text-xs uppercase border-b-4 border-[#c77700] active:translate-y-0.5 active:border-b-0 cursor-pointer"
              >
                + Forge First Habit
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {habits.map((habit) => {
                const isCheckedInToday = habit.lastCompletedDate === todayStr;
                const nextMilestone =
                  habit.streakCount < 3 ? 3 : habit.streakCount < 7 ? 7 : habit.streakCount < 14 ? 14 : habit.streakCount < 21 ? 21 : 30;
                const milestonePercent = Math.min(100, Math.round((habit.streakCount / nextMilestone) * 100));
                const steps = getStreakSteps(habit.streakCount);
                const isEditingHabit = editingHabitId === habit.id;

                return (
                  <div
                    key={habit.id}
                    className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#ffd6a5] transition-colors"
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
                            {isEditingHabit ? (
                              <div className="flex items-center gap-1 mt-1">
                                <input
                                  value={editHabitTitle}
                                  onChange={(e) => setEditHabitTitle(e.target.value)}
                                  className="px-2 py-1 rounded-xl border-2 border-[#e5e5e5] focus:border-[var(--orange)] focus:outline-hidden font-bold text-sm text-[var(--dark-blue)] w-36"
                                  autoFocus
                                />
                                <button onClick={saveEditHabit} className="px-2 py-1 rounded-lg bg-[var(--green)] text-white text-[11px] font-black cursor-pointer">
                                  Save
                                </button>
                                <button onClick={() => setEditingHabitId(null)} className="px-2 py-1 rounded-lg bg-[#f0f0f0] text-xs cursor-pointer">
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <h3 className="font-['Feather_Bold'] text-base text-[var(--dark-blue)] mt-0.5 leading-tight">{habit.title}</h3>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!isEditingHabit && (
                            <button
                              onClick={() => startEditHabit(habit.id, habit.title)}
                              className="w-7 h-7 rounded-lg bg-[#f7f7f7] border-2 border-[#e5e5e5] text-[var(--gray-text)] hover:border-[var(--orange)] hover:text-[var(--orange)] flex items-center justify-center text-xs transition-colors cursor-pointer"
                              title="Edit Habit"
                            >
                              ✎
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(habit.id, 'habit')}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors cursor-pointer border-2 ${
                              confirmDeleteId === habit.id && confirmDeleteType === 'habit'
                                ? 'bg-[var(--red)] border-[var(--red)] text-white'
                                : 'bg-white border-[#e5e5e5] text-[var(--gray-light)] hover:text-[var(--red)] hover:bg-[#ffeef0]'
                            }`}
                            title={confirmDeleteId === habit.id ? 'Confirm delete' : 'Delete Habit'}
                          >
                            {confirmDeleteId === habit.id && confirmDeleteType === 'habit' ? '!' : '✕'}
                          </button>
                        </div>
                      </div>

                      {/* Inline habit streak steps */}
                      <div className="flex items-center gap-1.5 mt-3">
                        {steps.map((s) => (
                          <div key={s.milestone} className="flex-1 flex flex-col items-center gap-1">
                            <div
                              className={`w-full h-2.5 rounded-full border-2 transition-all ${
                                s.reached
                                  ? 'bg-[var(--orange)] border-[#c77700]'
                                  : s.current
                                  ? 'bg-[#fff5ea] border-[var(--orange)] border-dashed animate-pulse'
                                  : 'bg-[#f0f0f0] border-[#e5e5e5]'
                              }`}
                              title={`${s.milestone}d milestone`}
                            />
                            <span
                              className={`text-[9px] font-black ${
                                s.reached ? 'text-[var(--orange)]' : s.current ? 'text-[var(--orange)]' : 'text-[var(--gray-light)]'
                              }`}
                            >
                              {s.milestone}d {s.reached ? '✓' : ''}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* 7-day dot strip */}
                      <div className="flex items-center gap-1 mt-2">
                        {Array.from({ length: 7 }).map((_, i) => {
                          const filled = i < Math.min(7, habit.streakCount % 7 === 0 && habit.streakCount > 0 ? 7 : habit.streakCount % 7);
                          const isToday = i === 0 && isCheckedInToday;
                          return (
                            <div
                              key={i}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all ${
                                filled || isToday
                                  ? 'bg-[var(--orange)] border-[#c77700] text-white shadow-xs'
                                  : 'bg-white border-[#e5e5e5] text-transparent'
                              }`}
                              title={filled ? `Day ${i + 1} completed` : `Day ${i + 1}`}
                            >
                              {filled ? '✓' : '·'}
                            </div>
                          );
                        })}
                        <span className="ml-2 text-[11px] font-bold text-[var(--gray-light)]">{habit.streakCount} total</span>
                      </div>

                      {/* Streak stats & Milestone Bar */}
                      <div className="bg-[#fafafa] p-3 rounded-2xl border border-[#f0f0f0] space-y-2 mt-3">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 font-black text-[var(--orange)]">
                            <span className="text-base animate-pulse">🔥</span>
                            <span>{habit.streakCount} Day Streak</span>
                          </div>
                          <span className="font-bold text-[var(--gray-light)] text-[11px]">Best: {habit.bestStreak}d • Next: {nextMilestone}d</span>
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
                        onClick={() => {
                          soundEngine.playClick();
                          checkInHabit(habit.id);
                        }}
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
          )}
        </div>
      )}

      <MissionForgeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultTab={modalDefaultTab} />
    </div>
  );
};
