import React, { useMemo, useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { soundEngine } from '../../utils/audioSynthesizer';
import { DailyCommandCenter } from '../command/DailyCommandCenter';
import { WeeklyReviewModal } from '../command/WeeklyReviewModal';

export const RealmView: React.FC = () => {
  const { profile, quests, habits, chests, campaigns, dailyObjectives, productivitySnapshot, insights, setActiveTab, startFocusSession } = useGameState();
  const [showWeekly, setShowWeekly] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const dailyQuests = useMemo(() => quests.filter((q) => q.category === 'daily'), [quests]);
  const completedDailyCount = dailyQuests.filter((q) => q.isCompleted).length;
  const habitsCheckedToday = useMemo(() => habits.filter((h) => h.lastCompletedDate === today).length, [habits, today]);
  const chestReadyCount = useMemo(() => chests.filter((c) => c.status === 'ready').length, [chests]);
  const citadelPowerPct = profile.citadelMaxPower > 0 ? profile.citadelPower / profile.citadelMaxPower : 0;

  const overdueCount = useMemo(()=> quests.filter(q=> !q.isCompleted && q.dueDate && q.dueDate < today).length, [quests, today]);
  const activeCampaigns = useMemo(()=> campaigns.filter(c=> c.status==='active'), [campaigns]);

  const handleStartQuickFocus = () => {
    soundEngine.playClick();
    const top = dailyObjectives[0] ? quests.find(q=> q.id===dailyObjectives[0].questId) : undefined;
    if (top) startFocusSession(top.estimatedMinutes ?? 25, top.id, top.title);
    else startFocusSession(25, undefined, 'Realm Quick Focus Sprint');
    setActiveTab('focus');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn select-none container-responsive">
      {/* Top Banner: Daily Momentum */}
      <div className="bg-gradient-to-br from-[#7c3aed] via-[#4c1d95] to-[#1e1b4b] rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border border-white/10 backdrop-blur">
        <div className="absolute -right-6 -bottom-6 text-9xl opacity-10 pointer-events-none select-none blur-[1px]">⚡</div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-white/25 backdrop-blur-sm text-xs font-black uppercase tracking-wider mb-3 shadow-xs flex-wrap">
              <span>🔥 {profile.streakDays} Day Streak</span>
              <span className="hidden sm:inline">•</span>
              <span>Sem V Active</span>
              <span className="hidden sm:inline">•</span>
              <span>1.2x XP Boost</span>
              {overdueCount>0 && <><span className="hidden sm:inline">•</span><span className="bg-white/20 px-2 py-0.5 rounded-full">{overdueCount} overdue</span></>}
            </div>
            <h1 className="font-['Feather_Bold'] text-2xl sm:text-3xl md:text-4xl tracking-wide text-white drop-shadow-sm">REALM EXPEDITION</h1>
            <p className="text-white/95 font-bold text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
              Campaigns {activeCampaigns.length} active • Today's objectives {dailyObjectives.length} ranked • Completion {productivitySnapshot.completionRate}% • Velocity {productivitySnapshot.velocityPerDay}/day
            </p>
          </div>
          <div className="bg-white text-[var(--dark-blue)] p-4 sm:p-5 rounded-2xl border-b-4 border-[#e5e5e5] shadow-lg min-w-[200px] sm:min-w-[240px] text-center flex-shrink-0">
            <div className="text-xs font-black uppercase text-[var(--gray-light)] mb-1 tracking-wider">Today's Schedule Progress</div>
            <div className="font-['Feather_Bold'] text-2xl sm:text-3xl font-black">{completedDailyCount} / {Math.max(1, dailyQuests.length)}</div>
            <div className="w-full h-3 bg-[#f0f0f0] rounded-full overflow-hidden mt-2 p-0.5 border border-[#e5e5e5]">
              <div className="h-full bg-[var(--green)] rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (completedDailyCount / Math.max(1, dailyQuests.length)) * 100)}%` }} />
            </div>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-extrabold text-[var(--gray-light)] flex-wrap">
              <span>📚 Campaigns: {activeCampaigns.length}</span><span>•</span><span>🎯 Objectives: {dailyObjectives.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* DAILY COMMAND CENTER — core engine */}
      <DailyCommandCenter />

      {/* Today's Quests — glass accordion (Realm-only B) */}
      <details open className="bg-white/90 backdrop-blur rounded-3xl border-2 border-[#e5e5e5] shadow-xs overflow-hidden group">
        <summary className="list-none px-5 sm:px-6 py-4 flex items-center justify-between cursor-pointer select-none">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#4c1d95] text-white flex items-center justify-center font-black text-sm">✓</span>
            <div>
              <div className="font-['Feather_Bold'] text-sm text-[var(--dark-blue)]">Today's Quests</div>
              <div className="text-[11px] font-bold text-[var(--gray-light)]">{completedDailyCount} / {Math.max(1, dailyQuests.length)} completed • tap to toggle</div>
            </div>
          </div>
          <span className="text-[var(--gray-light)] group-open:rotate-180 transition-transform">▾</span>
        </summary>
        <div className="px-4 sm:px-6 pb-4 space-y-2 border-t border-[#f0f0f0] pt-3">
          {dailyQuests.length === 0 ? (
            <p className="text-xs font-bold text-[var(--gray-light)] py-3 text-center">No daily quests — forge one from Campaigns or Quests.</p>
          ) : (
            dailyQuests.slice(0, 6).map((q) => (
              <div key={q.id} className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-2xl border ${q.isCompleted ? 'bg-[#f0fdf4] border-[#bbf7d0] opacity-70' : 'bg-white border-[#e5e5e5] hover:border-[#ddd6fe]'}`}>
                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-black truncate ${q.isCompleted ? 'line-through text-[var(--gray-light)]' : 'text-[var(--dark-blue)]'}`}>{q.title}</div>
                  <div className="text-[11px] font-bold text-[var(--gray-light)] truncate">{q.tag} • {q.estimatedMinutes ?? 25}m {q.dueLabel ? `• ${q.dueLabel}` : ''}{q.isCompleted ? ' • done' : ''}</div>
                </div>
                <span className={`shrink-0 w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${q.isCompleted ? 'bg-[var(--green)] text-white' : 'bg-[#f5f3ff] text-[#7c3aed] border border-[#ddd6fe]'}`}>{q.isCompleted ? '✓' : '○'}</span>
              </div>
            ))
          )}
          {dailyQuests.length > 6 && (
            <button type="button" onClick={() => setActiveTab('quests')} className="w-full py-2 rounded-xl bg-[#f5f3ff] border border-[#ddd6fe] text-xs font-black text-[#7c3aed]">View all {dailyQuests.length} →</button>
          )}
        </div>
      </details>

      {/* Productivity Intelligence strip */}
      {insights.length>0 && (
        <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-['Feather_Bold'] text-sm text-[var(--dark-blue)] flex items-center gap-2">📊 Productivity Intelligence <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-[#f7f7f7] border border-[#e5e5e5] text-[var(--gray-light)]">real history • deterministic</span></h3>
            <button type="button" onClick={()=>setShowWeekly(true)} className="px-3 py-1.5 rounded-xl bg-[var(--dark-blue)] text-white font-black text-xs touch-target">Weekly Review</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-center">
            <div className="rounded-2xl bg-[#f7f7f7] border border-[#e5e5e5] p-3"><div className="text-[11px] font-black uppercase text-[var(--gray-light)]">Est. vs Actual</div><div className="font-black text-sm text-[var(--dark-blue)]">{productivitySnapshot.avgEstimatedMinutes}m → {productivitySnapshot.avgActualMinutes}m</div><div className={`text-[11px] font-bold ${productivitySnapshot.estimationBias>10?'text-[var(--red)]':productivitySnapshot.estimationBias<-10?'text-[var(--green)]':'text-[var(--gray-light)]'}`}>{productivitySnapshot.estimationBias>0?`+${productivitySnapshot.estimationBias}% longer`:`${productivitySnapshot.estimationBias}% bias`}</div></div>
            <div className="rounded-2xl bg-[#f7f7f7] border border-[#e5e5e5] p-3"><div className="text-[11px] font-black uppercase text-[var(--gray-light)]">Velocity</div><div className="font-black text-sm text-[var(--dark-blue)]">{productivitySnapshot.velocityPerDay}/day</div><div className="text-[11px] font-bold text-[var(--gray-light)]">{productivitySnapshot.completedQuests} done / {productivitySnapshot.totalQuests}</div></div>
            <div className="rounded-2xl bg-[#f7f7f7] border border-[#e5e5e5] p-3"><div className="text-[11px] font-black uppercase text-[var(--gray-light)]">Focus</div><div className="font-black text-sm text-[var(--dark-blue)]">{productivitySnapshot.focusSessions} sessions</div><div className="text-[11px] font-bold text-[var(--gray-light)]">{productivitySnapshot.focusCompletionRate}% complete</div></div>
            <div className="rounded-2xl bg-[#f7f7f7] border border-[#e5e5e5] p-3"><div className="text-[11px] font-black uppercase text-[var(--gray-light)]">Postponed</div><div className={`font-black text-sm ${productivitySnapshot.postponedCount>3?'text-[var(--red)]':'text-[var(--dark-blue)]'}`}>{productivitySnapshot.postponedCount}×</div><div className="text-[11px] font-bold text-[var(--gray-light)]">{productivitySnapshot.overdueCount} overdue</div></div>
          </div>
          <ul className="space-y-1.5">
            {insights.slice(0,4).map((ins,i)=><li key={i} className="text-xs font-semibold text-[var(--gray-text)] px-3 py-2 rounded-xl bg-[#fafafa] border border-[#e5e5e5]">• {ins}</li>)}
          </ul>
        </div>
      )}

      {/* Campaigns quick strip */}
      {activeCampaigns.length>0 && (
        <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-['Feather_Bold'] text-sm text-[var(--dark-blue)]">Active Campaigns → Next Milestones</h3>
            <button type="button" onClick={()=>setActiveTab('campaigns')} className="px-3 py-1.5 rounded-xl bg-[#f0f0f0] border-2 border-[#e5e5e5] font-black text-xs touch-target">Open Campaigns</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeCampaigns.slice(0,4).map(c=>{
              const nextMs = c.milestones.find(m=> m.status==='active') ?? c.milestones.find(m=> m.status==='locked');
              const total = c.milestones.flatMap(m=>m.questIds).length;
              const done = c.milestones.flatMap(m=>m.questIds).filter(id=> quests.find(q=>q.id===id)?.isCompleted).length;
              const progress = total ? Math.round(done/total*100) : 0;
              return (
                <div key={c.id} className="rounded-2xl border-2 border-[#e5e5e5] p-3 flex flex-col gap-2 bg-[#fafafa]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-[var(--dark-blue)] truncate">{c.title}</span>
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-white border border-[#e5e5e5]">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-[#e5e5e5]"><div className="h-full bg-[var(--blue)]" style={{width: `${progress}%`}} /></div>
                  <div className="text-[11px] font-bold text-[var(--gray-light)]">{nextMs ? `Next: ${nextMs.title}` : 'All milestones complete'} • Due {c.targetDate}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-gradient-to-br from-[#fff5ea] to-[#fff9f2] rounded-3xl border-2 border-[#ffd6a5] p-5 sm:p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-[var(--orange)] text-white tracking-wider shadow-xs">⚔️ Chronos Battle Arena</span>
            <span className="text-2xl">⏳</span>
          </div>
          <h3 className="font-['Feather_Bold'] text-lg sm:text-xl text-[var(--dark-blue)] mb-1">Deep Work Focus Sprint</h3>
          <p className="text-xs sm:text-sm text-[var(--gray-text)] font-semibold mb-5 leading-relaxed">Launch focus on your top objective — effort logged, quest auto-completed, campaign updated, analytics refreshed.</p>
          <button type="button" onClick={handleStartQuickFocus} className="w-full sm:w-auto h-13 bg-[var(--orange)] hover:bg-[#e08500] text-white font-['Feather_Bold'] text-sm font-black tracking-wider uppercase rounded-2xl border-b-4 border-[#c77700] active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 touch-target">
            <span>⚡ LAUNCH FOCUS ON TOP OBJECTIVE</span>
          </button>
        </div>

        <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-[#e5e5e5] p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-[#f0f0f0]">
            <h3 className="font-['Feather_Bold'] text-lg text-[var(--dark-blue)]">Citadel Pulse</h3>
            <span className="text-xs font-extrabold text-[var(--blue)] uppercase bg-[#eef8ff] px-2 py-0.5 rounded-lg">Tier {profile.citadelTier}</span>
          </div>
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl border-2 border-[#eef2f7] bg-[#fafbfc] flex items-center justify-between gap-3">
              <div><div className="font-bold text-sm text-[var(--dark-blue)]">Citadel Power</div><div className="text-[11px] font-bold text-[var(--gray-light)]">{profile.citadelPower} / {profile.citadelMaxPower}</div></div>
              <div className="w-20 h-2 bg-[#f0f0f0] rounded-full overflow-hidden border border-[#e5e5e5]"><div className="h-full bg-[var(--green)]" style={{width: `${Math.round(citadelPowerPct*100)}%`}} /></div>
            </div>
            <div className="p-3.5 rounded-2xl border-2 border-[#eef2f7] bg-[#fafbfc]">
              <div className="font-bold text-sm text-[var(--dark-blue)] flex items-center justify-between">Today's Momentum <span className="text-[11px] font-black text-[var(--green)]">{habitsCheckedToday} habits • {chestReadyCount} chests ready</span></div>
              <div className="text-[11px] font-bold text-[var(--gray-light)] mt-1">Focus completion {productivitySnapshot.focusCompletionRate}% • Overdue {overdueCount}</div>
            </div>
          </div>
        </div>
      </div>

      <WeeklyReviewModal isOpen={showWeekly} onClose={()=>setShowWeekly(false)} />
    </div>
  );
};
