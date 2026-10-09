import React, { useMemo, useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { soundEngine } from '../../utils/audioSynthesizer';

export const DailyCommandCenter: React.FC = () => {
  const { quests, campaigns, dailyObjectives, getDailyObjectives, startFocusSession, setActiveTab, completeQuest, postponeQuest } = useGameState();
  const [availableMinutes, setAvailableMinutes] = useState<number>(90);
  const [showBudget, setShowBudget] = useState(false);
  const questById = useMemo(()=> new Map(quests.map(q=>[q.id,q] as const)), [quests]);
  const objectives = getDailyObjectives({ max: 5, availableMinutes: showBudget ? availableMinutes : undefined });

  if (dailyObjectives.length===0 && quests.filter(q=>!q.isCompleted).length===0) {
    return (
      <div className="bg-white rounded-3xl border-2 border-dashed border-[#d9d9d9] p-6 text-center">
        <div className="text-3xl mb-2">✅</div>
        <h3 className="font-['Feather_Bold'] text-base text-[var(--dark-blue)]">All clear — no active objectives</h3>
        <p className="text-xs font-bold text-[var(--gray-light)] mt-1">Create a campaign or forge quests to generate your daily command center.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="font-['Feather_Bold'] text-base sm:text-lg text-[var(--dark-blue)] flex items-center gap-2">
          <span>🎯</span> TODAY&apos;S COMMAND CENTER
          <span className="hidden sm:inline text-xs font-black px-2 py-1 rounded-full bg-[#eef8ff] border border-[#b9e5fb] text-[var(--blue)]">What should I work on right now?</span>
        </h2>
        <button type="button" onClick={()=>setShowBudget(v=>!v)} className="px-3 py-1.5 rounded-xl bg-[#f0f0f0] border-2 border-[#e5e5e5] font-black text-xs touch-target">{showBudget?'Hide budget':'Time budget'}</button>
      </div>
      <p className="text-xs font-bold text-[var(--gray-light)] mb-4">Ranked by deadlines, campaign milestones, dependencies, priority & overdue — real data, no fake recommendations.</p>

      {showBudget && (
        <div className="mb-4 p-3 rounded-2xl bg-[#fafafa] border-2 border-[#e5e5e5] flex items-center gap-3">
          <span className="text-xs font-black uppercase text-[var(--gray-light)]">Available today</span>
          <input type="range" min={30} max={240} step={15} value={availableMinutes} onChange={e=>setAvailableMinutes(parseInt(e.target.value))} className="flex-1" />
          <span className="font-black text-sm text-[var(--dark-blue)]">{availableMinutes}m</span>
        </div>
      )}

      <div className="space-y-3">
        {objectives.map((obj, idx)=>{
          const q = questById.get(obj.questId);
          if (!q) return null;
          const camp = obj.campaignId ? campaigns.find(c=>c.id===obj.campaignId) : undefined;
          return (
            <div key={obj.questId} className={`rounded-2xl border-2 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${obj.isBlocked ? 'bg-[#fff7e6] border-[#ffd6a5] opacity-90' : idx===0 ? 'bg-[#eef8ff] border-[#b9e5fb] shadow-xs' : 'bg-white border-[#e5e5e5]'}`}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0 ${idx===0 ? 'bg-[var(--blue)]' : 'bg-[#d9d9d9] text-[var(--dark-blue)]'}`}>{idx+1}</span>
                  <span className="font-bold text-sm text-[var(--dark-blue)] truncate">{q.title}</span>
                  {obj.isBlocked && <span className="px-2 py-0.5 rounded-full bg-[var(--red)] text-white text-[10px] font-black uppercase">Blocked</span>}
                  {q.priority && <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black uppercase ${q.priority==='critical'?'bg-[var(--red)] text-white':q.priority==='high'?'bg-[#ffe9e9] text-[var(--red)]':q.priority==='medium'?'bg-[#fff7e6] text-[#a66a00]':'bg-[#f0f0f0] text-[var(--gray-light)]'}`}>{q.priority}</span>}
                  {q.dueDate && <span className={`text-[11px] font-bold ${q.dueDate < new Date().toISOString().split('T')[0] ? 'text-[var(--red)]' : 'text-[var(--gray-light)]'}`}>Due {q.dueDate}</span>}
                  {q.estimatedMinutes && <span className="text-[11px] font-bold text-[var(--blue)]">{q.estimatedMinutes}m</span>}
                </div>
                <div className="mt-1 flex items-center gap-2 flex-wrap text-[11px] font-bold text-[var(--gray-light)]">
                  <span>Urgency {obj.urgencyScore}</span>
                  {camp && <span className="px-1.5 py-0.5 rounded-full bg-[#eef8ff] border border-[#b9e5fb] text-[var(--blue)]">Campaign: {camp.title}</span>}
                  {obj.reasons.slice(0,3).map(r=><span key={r} className="px-1.5 py-0.5 rounded-full bg-[#f7f7f7] border border-[#e5e5e5]">{r}</span>)}
                </div>
                {obj.isBlocked && obj.blockedBy && <div className="text-[11px] font-bold text-[#a66a00] mt-1">Blocked by {obj.blockedBy.join(', ')}</div>}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {!obj.isBlocked ? (
                  <>
                    <button type="button" onClick={()=>{ soundEngine.playClick(); startFocusSession(q.estimatedMinutes ?? 25, q.id, q.title); setActiveTab('focus'); }} className="px-4 py-2 rounded-xl bg-[var(--blue)] text-white font-black text-xs touch-target">Focus →</button>
                    <button type="button" onClick={()=>completeQuest(q.id)} className="px-3 py-2 rounded-xl bg-[var(--green)] text-white font-black text-xs touch-target">Done</button>
                  </>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <input type="date" defaultValue={new Date(Date.now()+86400000).toISOString().split('T')[0]} onChange={(e)=>{ const nd=e.target.value; if(/^\d{4}-\d{2}-\d{2}$/.test(nd)) postponeQuest(q.id, nd); }} className="px-2 py-1.5 rounded-xl border-2 border-[#e5e5e5] text-xs font-bold touch-target" aria-label="New due date" />
                    <span className="text-[11px] font-bold text-[var(--gray-light)]">↩</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-[11px] font-bold text-[var(--gray-light)] text-center">Top {objectives.length} objectives packed {showBudget?`for ${availableMinutes}m`:'by urgency'} — blocked items excluded.</div>
    </div>
  );
};
