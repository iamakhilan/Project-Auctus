import React, { useMemo } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { soundEngine } from '../../utils/audioSynthesizer';

export const RealmView: React.FC = () => {
  const {
    profile,
    quests,
    habits,
    chests,
    setActiveTab,
    startFocusSession,
  } = useGameState();

  const today = new Date().toISOString().split('T')[0];

  const dailyQuests = useMemo(() => quests.filter((q) => q.category === 'daily'), [quests]);
  const completedDailyCount = dailyQuests.filter((q) => q.isCompleted).length;

  const habitsCheckedToday = useMemo(() => habits.filter((h) => h.lastCompletedDate === today).length, [habits, today]);
  const chestReadyCount = useMemo(() => chests.filter((c) => c.status === 'ready').length, [chests]);
  const citadelPowerPct = profile.citadelMaxPower > 0 ? profile.citadelPower / profile.citadelMaxPower : 0;

  // Dynamic stages derived from live game state and calendar
  const stages = useMemo(() => {

    const raw: Array<{ id: number; name: string; icon: string; xp: number; desc: string; isCompleted: boolean }> = [
      {
        id: 1,
        name: 'Academic Sprint',
        icon: '📚',
        xp: 60,
        desc: 'FLA, Probability & Deep Learning modules',
        isCompleted: completedDailyCount > 0,
      },
      {
        id: 2,
        name: 'Focus Blitz',
        icon: '⚡',
        xp: 120,
        desc: habitsCheckedToday > 0 ? `${habitsCheckedToday} habit milestones achieved` : 'Ignite focus via Pomodoro / habit streak',
        isCompleted: habitsCheckedToday >= 1,
      },
      {
        id: 3,
        name: 'Init Club Meeting',
        icon: '🤝',
        xp: 90,
        desc: '16:30 • AB4 (LH6) Offline Meet',
        isCompleted: false,
      },
      {
        id: 4,
        name: 'Evening Grind',
        icon: '💻',
        xp: 150,
        desc: '19:00 • Py: Functions II, DSA, SQL Window',
        isCompleted: false,
      },
      {
        id: 5,
        name: 'Chronos Crown Chest',
        icon: '👑',
        xp: 300,
        desc: chestReadyCount > 0 ? `${chestReadyCount} chest(s) ready to claim` : `Citadel power at ${Math.round(citadelPowerPct * 100)}%`,
        isCompleted: chestReadyCount > 0 && citadelPowerPct >= 0.5,
      },
    ];

    let foundActive = false;
    return raw.map((s) => {
      if (s.isCompleted) return { ...s, status: 'completed' as const };
      if (!foundActive) {
        foundActive = true;
        return { ...s, status: 'active' as const };
      }
      return { ...s, status: 'locked' as const };
    });
  }, [completedDailyCount, habitsCheckedToday, chestReadyCount, citadelPowerPct]);

  const handleStartQuickFocus = () => {
    soundEngine.playClick();
    startFocusSession(25, undefined, 'Realm Quick Focus Sprint');
    setActiveTab('focus');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn select-none container-responsive">
      {/* Top Banner: Daily Momentum & Multiplier */}
      <div className="bg-gradient-to-r from-[#1cb0f6] via-[#2bd9fe] to-[#0095de] rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border-b-6 border-[#0b80ba]">
        <div className="absolute -right-6 -bottom-6 text-9xl opacity-15 pointer-events-none select-none">
          ⚡
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-white/25 backdrop-blur-sm text-xs font-black uppercase tracking-wider mb-3 shadow-xs flex-wrap">
              <span>🔥 {profile.streakDays} Day Streak</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Sem V Active</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">1.2x XP Boost</span>
            </div>
            <h1 className="font-['Feather_Bold'] text-2xl sm:text-3xl md:text-4xl tracking-wide text-white drop-shadow-sm">
              REALM EXPEDITION
            </h1>
            <p className="text-white/95 font-bold text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
              Today: Completing FLA, Probability, Deep Learning, Init Club at 16:30, and Py/DSA/SQL at 19:00. Let's conquer it!
            </p>
          </div>

          {/* Daily Progress Gauge */}
          <div className="bg-white text-[var(--dark-blue)] p-4 sm:p-5 rounded-2xl border-b-4 border-[#e5e5e5] shadow-lg min-w-[200px] sm:min-w-[240px] text-center flex-shrink-0">
            <div className="text-xs font-black uppercase text-[var(--gray-light)] mb-1 tracking-wider">
              Today's Schedule Progress
            </div>
            <div className="font-['Feather_Bold'] text-2xl sm:text-3xl font-black text-[var(--dark-blue)]">
              {completedDailyCount} / 4
            </div>
            <div className="w-full h-3 bg-[#f0f0f0] rounded-full overflow-hidden mt-2 p-0.5 border border-[#e5e5e5]">
              <div
                className="h-full bg-[var(--green)] rounded-full transition-all duration-700 shadow-xs"
                style={{
                  width: `${Math.min(100, (completedDailyCount / 4) * 100)}%`,
                }}
              />
            </div>
            <div className="mt-3 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-extrabold text-[var(--gray-light)] flex-wrap">
              <span>📚 3 Subjects</span>
              <span className="hidden sm:inline">•</span>
              <span>🤝 Club Meet</span>
              <span className="hidden sm:inline">•</span>
              <span>💻 19:00 Grind</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Journey Roadmap + Quick Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Duolingo Progression Road (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-[#e5e5e5] p-5 sm:p-7 shadow-xs flex flex-col items-center">
          <div className="w-full flex items-center justify-between border-b-2 border-[#f0f0f0] pb-4 mb-6">
            <div>
              <h2 className="font-['Feather_Bold'] text-lg sm:text-xl text-[var(--dark-blue)]">
                Today's Progression Path
              </h2>
              <p className="text-xs font-bold text-[var(--gray-light)]">
                Follow your calendar milestones sequentially to unlock the Crown Chest!
              </p>
            </div>
            <span className="text-2xl">🗺️</span>
          </div>

          {/* Stepping Stones Path — derived from live calendar schedule */}
          <div className="relative flex flex-col items-center gap-6 py-4 w-full">
            {stages.map((st, idx) => {
              const offsets = ['translate-x-0', 'translate-x-10', '-translate-x-10', 'translate-x-6', 'translate-x-0'];
              const offsetClass = offsets[idx % offsets.length];

              const isCompleted = st.status === 'completed';
              const isActive = st.status === 'active';

              return (
                <div key={st.id} className={`flex flex-col items-center transition-transform ${offsetClass}`}>
                  <button
                    type="button"
                    onClick={() => {
                      if (isActive) {
                        handleStartQuickFocus();
                      } else {
                        soundEngine.playClick();
                      }
                    }}
                    className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-3xl border-b-6 flex flex-col items-center justify-center transition-all cursor-pointer group touch-target ${
                      isCompleted
                        ? 'bg-[var(--green)] border-[var(--green-shadow)] text-white shadow-md'
                        : isActive
                        ? 'bg-[var(--golden)] border-[#d48806] text-white shadow-xl scale-110 animate-bounce'
                        : 'bg-[#f0f0f0] border-[#d9d9d9] text-[var(--gray-light)] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <span className="text-xl sm:text-2xl">{isCompleted ? '✅' : st.icon}</span>
                    <span className="text-[10px] font-black uppercase mt-0.5">
                      {isCompleted ? 'DONE' : `+${st.xp} XP`}
                    </span>

                    {/* Active Pulsing Indicator */}
                    {isActive && (
                      <span className="absolute -top-2 -right-1 px-1.5 py-0.5 rounded-full bg-[var(--red)] text-white text-[9px] font-black uppercase animate-pulse shadow-md">
                        CURRENT
                      </span>
                    )}
                  </button>

                  <div className="mt-2 text-center max-w-[150px] sm:max-w-[180px]">
                    <div className="font-['Feather_Bold'] text-xs text-[var(--dark-blue)]">
                      {st.name}
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-semibold text-[var(--gray-light)]">
                      {st.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Quick Launch & Active Quests (5 cols) */}
        <div className="lg:col-span-5 space-y-5 sm:space-y-6">
          {/* Quick Focus Battle Launcher Card */}
          <div className="bg-gradient-to-br from-[#fff5ea] to-[#fff9f2] rounded-3xl border-2 border-[#ffd6a5] p-5 sm:p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-[var(--orange)] text-white tracking-wider shadow-xs">
                ⚔️ Chronos Battle Arena
              </span>
              <span className="text-2xl">⏳</span>
            </div>
            <h3 className="font-['Feather_Bold'] text-lg sm:text-xl text-[var(--dark-blue)] mb-1">
              Deep Work Focus Sprint
            </h3>
            <p className="text-xs sm:text-sm text-[var(--gray-text)] font-semibold mb-5 leading-relaxed">
              Launch a 25-minute Pomodoro session for FLA / Python / SQL. Deplete the boss HP to earn double Gold & Chest loot!
            </p>

            <button
              type="button"
              onClick={handleStartQuickFocus}
              className="w-full sm:w-auto h-13 bg-[var(--orange)] hover:bg-[#e08500] text-white font-['Feather_Bold'] text-sm font-black tracking-wider uppercase rounded-2xl border-b-4 border-[#c77700] active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 touch-target btn-full-mobile sm:btn-full-mobile-false"
            >
              <span>⚡ LAUNCH 25M SPRINT</span>
            </button>
          </div>

          {/* Today's Schedule Card */}
          <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-[#f0f0f0] flex-wrap gap-2">
              <h3 className="font-['Feather_Bold'] text-lg text-[var(--dark-blue)]">
                Today's Key Events
              </h3>
              <span className="text-xs font-extrabold text-[var(--blue)] uppercase bg-[#eef8ff] px-2 py-0.5 rounded-lg">
                Sep 17
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl border-2 border-[#eef2f7] bg-[#fafbfc] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded-md bg-[#e1f5fe] text-[#0288d1] shrink-0">
                      16:30 • AB4 LH6
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-[var(--dark-blue)] truncate">
                    Init Club Offline Meet
                  </h4>
                </div>
                <span className="text-xl shrink-0">🤝</span>
              </div>

              <div className="p-3.5 rounded-2xl border-2 border-[#fff3e0] bg-[#fffbf5] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded-md bg-[#ffe0b2] text-[#f57c00] shrink-0">
                      19:00 • Daily 1h Block
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-[var(--dark-blue)] truncate">
                    Py: Functions II | DSA | SQL
                  </h4>
                </div>
                <span className="text-xl shrink-0">💻</span>
              </div>
            </div>
          </div>

          {/* Quick Habits Widget */}
          <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 pb-2 border-b-2 border-[#f0f0f0] gap-2">
              <h3 className="font-['Feather_Bold'] text-lg text-[var(--dark-blue)]">
                Active Habit Streaks
              </h3>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('quests');
                }}
                className="text-xs font-extrabold text-[var(--blue)] hover:underline uppercase touch-target-sm"
              >
                Manage →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {habits.slice(0, 4).map((h) => (
                <div
                  key={h.id}
                  className="p-3 rounded-2xl bg-[#fffaf5] border-2 border-[#ffedd5] flex items-center gap-2.5 touch-target-sm"
                >
                  <span className="text-xl shrink-0">{h.icon || '🔥'}</span>
                  <div className="min-w-0">
                    <div className="font-black text-xs text-[var(--dark-blue)] truncate" title={h.title}>
                      {h.title}
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-extrabold text-[var(--orange)]">
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