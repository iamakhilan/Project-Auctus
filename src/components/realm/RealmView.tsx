import React from 'react';
import { useGameState } from '../../context/GameStateContext';
import { soundEngine } from '../../utils/audioSynthesizer';

export const RealmView: React.FC = () => {
  const {
    profile,
    quests,
    habits,
    completeQuest,
    setActiveTab,
    startFocusSession,
  } = useGameState();

  const dailyQuests = quests.filter((q) => q.category === 'daily');
  const completedDailyCount = dailyQuests.filter((q) => q.isCompleted).length;
  const pendingQuests = quests.filter((q) => !q.isCompleted).slice(0, 3);

  // Duolingo Journey Stages
  const stages = [
    {
      id: 1,
      name: 'Dawn Patrol',
      icon: '🌅',
      status: 'completed',
      xp: 50,
      desc: 'Morning routine & planning',
    },
    {
      id: 2,
      name: 'Focus Blitz',
      icon: '⚡',
      status: 'active',
      xp: 120,
      desc: '25-minute deep work sprint',
    },
    {
      id: 3,
      name: 'Tactical Bounty',
      icon: '🎯',
      status: 'locked',
      xp: 80,
      desc: 'High-priority task execution',
    },
    {
      id: 4,
      name: 'Habit Forge',
      icon: '🔥',
      status: 'locked',
      xp: 100,
      desc: 'Daily habit check-in milestone',
    },
    {
      id: 5,
      name: 'Chronos Boss Trial',
      icon: '👑',
      status: 'locked',
      xp: 250,
      desc: 'Epic deep work boss victory',
    },
  ];

  const handleStartQuickFocus = () => {
    soundEngine.playClick();
    startFocusSession(25, undefined, 'Realm Quick Focus Sprint');
    setActiveTab('focus');
  };

  const handleCompleteQuickQuest = (id: string) => {
    completeQuest(id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-fadeIn select-none">
      
      {/* Top Banner: Daily Momentum & Multiplier */}
      <div className="bg-gradient-to-r from-[#1cb0f6] to-[#0095de] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden border-b-6 border-[#0b80ba]">
        <div className="absolute -right-8 -bottom-8 text-9xl opacity-15 pointer-events-none">
          🏰
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider mb-2">
              <span>🔥 {profile.streakDays} Day Streak</span>
              <span>•</span>
              <span>1.2x XP Boost Active</span>
            </div>
            <h1 className="font-['Feather_Bold'] text-2xl sm:text-4xl tracking-wide text-white drop-shadow-xs">
              REALM EXPEDITION
            </h1>
            <p className="text-white/90 font-bold text-sm sm:text-base mt-1 max-w-xl">
              Conquer today's milestones, power up your Citadel, and defeat procrastination!
            </p>
          </div>

          {/* Daily Progress Gauge */}
          <div className="bg-white text-[var(--dark-blue)] p-4 sm:p-5 rounded-2xl border-b-4 border-[#e5e5e5] shadow-md min-w-[220px] text-center">
            <div className="text-xs font-black uppercase text-[var(--gray-light)] mb-1">
              Daily Quests Progress
            </div>
            <div className="font-['Feather_Bold'] text-2xl font-black text-[var(--dark-blue)]">
              {completedDailyCount} / {dailyQuests.length}
            </div>
            <div className="w-full h-3 bg-[#e5e5e5] rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-[var(--green)] rounded-full transition-all duration-500"
                style={{
                  width: `${dailyQuests.length > 0 ? (completedDailyCount / dailyQuests.length) * 100 : 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Journey Roadmap + Quick Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Duolingo Progression Road (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-[#e5e5e5] p-6 shadow-xs flex flex-col items-center">
          <div className="w-full flex items-center justify-between border-b-2 border-[#f0f0f0] pb-4 mb-6">
            <div>
              <h2 className="font-['Feather_Bold'] text-xl text-[var(--dark-blue)]">
                Today's Progression Path
              </h2>
              <p className="text-xs font-bold text-[var(--gray-light)]">
                Complete milestones in order to unlock the Crown Chest!
              </p>
            </div>
            <span className="text-2xl">🗺️</span>
          </div>

          {/* Stepping Stones Path */}
          <div className="relative flex flex-col items-center gap-6 py-4 w-full">
            {stages.map((st, idx) => {
              const offsets = ['translate-x-0', 'translate-x-8', '-translate-x-8', 'translate-x-4', 'translate-x-0'];
              const offsetClass = offsets[idx % offsets.length];

              const isCompleted = st.status === 'completed';
              const isActive = st.status === 'active';

              return (
                <div key={st.id} className={`flex flex-col items-center transition-transform ${offsetClass}`}>
                  <button
                    onClick={() => {
                      if (isActive) {
                        handleStartQuickFocus();
                      } else {
                        soundEngine.playClick();
                      }
                    }}
                    className={`relative w-20 h-20 rounded-3xl border-b-6 flex flex-col items-center justify-center transition-all cursor-pointer group ${
                      isCompleted
                        ? 'bg-[var(--green)] border-[var(--green-shadow)] text-white shadow-md'
                        : isActive
                        ? 'bg-[var(--golden)] border-[#d48806] text-white shadow-xl scale-110 animate-bounce'
                        : 'bg-[#f0f0f0] border-[#d9d9d9] text-[var(--gray-light)] opacity-70 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-2xl">{isCompleted ? '✅' : st.icon}</span>
                    <span className="text-[10px] font-black uppercase mt-0.5">
                      {isCompleted ? 'DONE' : `+${st.xp} XP`}
                    </span>

                    {/* Active Pulsing Indicator */}
                    {isActive && (
                      <span className="absolute -top-3 -right-2 px-2 py-0.5 rounded-full bg-[var(--red)] text-white text-[9px] font-black uppercase animate-pulse shadow-xs">
                        CURRENT
                      </span>
                    )}
                  </button>

                  <div className="mt-2 text-center max-w-[150px]">
                    <div className="font-['Feather_Bold'] text-xs font-black text-[var(--dark-blue)]">
                      {st.name}
                    </div>
                    <div className="text-[11px] font-semibold text-[var(--gray-light)]">
                      {st.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Quick Launch & Active Quests (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Focus Battle Launcher Card */}
          <div className="bg-[#fff5ea] rounded-3xl border-2 border-[#ffd6a5] p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase px-2.5 py-1 rounded-full bg-[var(--orange)] text-white">
                ⚔️ Boss Encounter
              </span>
              <span className="text-2xl">⏳</span>
            </div>
            <h3 className="font-['Feather_Bold'] text-xl text-[var(--dark-blue)] mb-1">
              Chronos Battle Arena
            </h3>
            <p className="text-xs text-[var(--gray-text)] font-semibold mb-4 leading-relaxed">
              Launch a 25-minute Pomodoro Deep Work battle. Deplete the boss HP to earn double Gold & Chest loot!
            </p>

            <button
              onClick={handleStartQuickFocus}
              className="w-full h-12 bg-[var(--orange)] hover:bg-[#e08500] text-white font-['Feather_Bold'] text-base font-black tracking-wider uppercase rounded-2xl border-b-4 border-[#c77700] active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <span>⚡ ENTER BATTLE ARENA (25m)</span>
            </button>
          </div>

          {/* Quick Quests Card */}
          <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-[#f0f0f0]">
              <h3 className="font-['Feather_Bold'] text-lg text-[var(--dark-blue)]">
                Priority Missions
              </h3>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('quests');
                }}
                className="text-xs font-extrabold text-[var(--blue)] hover:underline uppercase"
              >
                View All →
              </button>
            </div>

            {pendingQuests.length === 0 ? (
              <div className="text-center py-6 text-[var(--gray-light)]">
                <span className="text-3xl block mb-2">🎉</span>
                <p className="font-bold text-sm">All primary missions cleared today!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingQuests.map((q) => (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-2xl border-2 border-[#f0f0f0] hover:border-[#b9e5fb] bg-[#fafafa] flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded-md bg-[#eef8ff] text-[var(--blue)]">
                          {q.tag}
                        </span>
                        <span className="text-xs font-bold text-[#d48806]">
                          +{q.xpReward} XP
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-[var(--dark-blue)] truncate">
                        {q.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleCompleteQuickQuest(q.id)}
                      className="px-3 py-1.5 rounded-xl bg-[var(--green)] hover:bg-[var(--green-hover)] text-white text-xs font-black uppercase border-b-3 border-[var(--green-shadow)] active:translate-y-0.5 active:border-b-0 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      Complete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Habits Widget */}
          <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-[#f0f0f0]">
              <h3 className="font-['Feather_Bold'] text-lg text-[var(--dark-blue)]">
                Active Habit Streaks
              </h3>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('quests');
                }}
                className="text-xs font-extrabold text-[var(--blue)] hover:underline uppercase"
              >
                Manage →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {habits.slice(0, 4).map((h) => (
                <div
                  key={h.id}
                  className="p-3 rounded-2xl bg-[#fffaf5] border-2 border-[#ffedd5] flex items-center gap-2.5"
                >
                  <span className="text-xl">{h.icon || '🔥'}</span>
                  <div className="min-w-0">
                    <div className="font-black text-xs text-[var(--dark-blue)] truncate">
                      {h.title}
                    </div>
                    <div className="text-[11px] font-extrabold text-[var(--orange)]">
                      {h.streakCount} days 🔥
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};