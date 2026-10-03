import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { Campaign } from '../../types';
import { soundEngine } from '../../utils/audioSynthesizer';

export const CampaignDetailView: React.FC<{ campaign: Campaign; onBack: () => void; onChainForge: (campaignId: string, milestoneId: string) => void }> = ({ campaign, onBack, onChainForge }) => {
  const { quests, createMilestone, updateMilestone, deleteMilestone, updateCampaign, getCampaignProgress, setActiveTab, startFocusSession, completeQuest } = useGameState();
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [editTargetDate, setEditTargetDate] = useState(campaign.targetDate);
  const progress = getCampaignProgress(campaign.id);

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    createMilestone(campaign.id, { title: newMilestoneTitle.trim(), order: campaign.milestones.length });
    setNewMilestoneTitle('');
  };

  const toggleMilestoneStatus = (milestoneId: string, current: string) => {
    const next = current === 'completed' ? 'active' : 'completed';
    updateMilestone(campaign.id, milestoneId, { status: next as Campaign['milestones'][number]['status'] });
    soundEngine.playClick();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn select-none">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#f0f0f0] border-2 border-[#e5e5e5] font-black text-xs uppercase touch-target">← Back to campaigns</button>

      <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-['Feather_Bold'] text-xl sm:text-2xl text-[var(--dark-blue)] truncate">{campaign.title}</h1>
            {campaign.description && <p className="text-sm font-semibold text-[var(--gray-text)] mt-1">{campaign.description}</p>}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${campaign.status==='active'?'bg-[#e8f8d8] text-[var(--green)] border-[#bde8a8]':campaign.status==='completed'?'bg-[#eef8ff] text-[var(--blue)] border-[#b9e5fb]':'bg-[#f0f0f0] text-[var(--gray-light)]'}`}>{campaign.status} • {progress}%</span>
              <span className="text-xs font-bold text-[var(--gray-light)]">Target: {campaign.targetDate}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <input type="date" value={editTargetDate} onChange={e=>setEditTargetDate(e.target.value)} className="px-3 py-2 rounded-xl border-2 border-[#e5e5e5] text-xs font-bold" />
              <button type="button" onClick={()=>updateCampaign(campaign.id, { targetDate: editTargetDate })} className="px-3 py-2 rounded-xl bg-[var(--blue)] text-white font-black text-xs touch-target">Save date</button>
            </div>
            <select value={campaign.status} onChange={e=>updateCampaign(campaign.id, { status: e.target.value as Campaign['status'] })} className="px-3 py-2 rounded-xl border-2 border-[#e5e5e5] text-xs font-bold bg-white">
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
        <div className="mt-4 w-full h-3 bg-[#f0f0f0] rounded-full overflow-hidden border border-[#e5e5e5]">
          <div className="h-full bg-[var(--green)] rounded-full transition-all" style={{width: `${progress}%`}} />
        </div>
      </div>

      <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-5 sm:p-6 shadow-xs">
        <h2 className="font-['Feather_Bold'] text-base text-[var(--dark-blue)] mb-3">Milestones → Quest Chains</h2>
        <p className="text-xs font-bold text-[var(--gray-light)] mb-4">Example flow: Exam → Topics (milestones) → Quests → Revision → Mock Test. Each milestone owns a chain of dependent quests.</p>

        <div className="flex items-center gap-2 mb-5">
          <input value={newMilestoneTitle} onChange={e=>setNewMilestoneTitle(e.target.value)} placeholder="New milestone e.g. 'Chapter 4 — Probability Distributions'" className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-[#e5e5e5] focus:border-[var(--blue)] text-sm font-bold touch-target" />
          <button type="button" onClick={handleAddMilestone} className="px-4 py-2.5 rounded-2xl bg-[var(--green)] text-white font-black text-xs uppercase border-b-3 border-[var(--green-shadow)] touch-target">+ Add</button>
        </div>

        {campaign.milestones.length===0 ? (
          <div className="rounded-2xl bg-[#fafafa] border-2 border-dashed border-[#e5e5e5] p-6 text-center text-sm font-bold text-[var(--gray-light)]">No milestones yet — add one to start chaining quests.</div>
        ) : (
          <div className="space-y-4">
            {campaign.milestones.slice().sort((a,b)=>a.order-b.order).map(m=>{
              const mQuests = quests.filter(q=> q.milestoneId===m.id);
              const done = mQuests.filter(q=>q.isCompleted).length;
              return (
                <div key={m.id} className={`rounded-2xl border-2 p-4 ${m.status==='completed'?'bg-[#f0f8e8] border-[#bde8a8]':m.status==='active'?'bg-[#eef8ff] border-[#b9e5fb]':'bg-white border-[#e5e5e5] opacity-80'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0 ${m.status==='completed' ? 'bg-[var(--green)]' : m.status==='active' ? 'bg-[var(--blue)]' : 'bg-[#d9d9d9]'}`}>{m.order+1}</span>
                        <span className="font-['Feather_Bold'] text-sm text-[var(--dark-blue)]">{m.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${m.status==='completed'?'bg-white text-[var(--green)]':m.status==='active'?'bg-white text-[var(--blue)]':'bg-[#f0f0f0] text-[var(--gray-light)]'}`}>{m.status}</span>
                        <span className="text-[11px] font-bold text-[var(--gray-light)]">{done}/{mQuests.length} quests</span>
                      </div>
                      {mQuests.length>0 && <div className="mt-2 w-full h-2 bg-black/5 rounded-full overflow-hidden"><div className="h-full bg-[var(--green)]" style={{width: `${mQuests.length? Math.round(done/mQuests.length*100):0}%`}} /></div>}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button type="button" onClick={()=>onChainForge(campaign.id, m.id)} className="px-3 py-1.5 rounded-xl bg-[var(--dark-blue)] text-white font-black text-xs touch-target">+ Quest Chain</button>
                      <button type="button" onClick={()=>toggleMilestoneStatus(m.id, m.status)} className="px-2 py-1.5 rounded-xl bg-white border-2 border-[#e5e5e5] font-black text-xs touch-target">{m.status==='completed'?'Reopen':'Complete'}</button>
                      <button type="button" onClick={()=>{ if(confirm(`Delete milestone "${m.title}"?`)) deleteMilestone(campaign.id, m.id);}} className="px-2 py-1.5 rounded-xl bg-[#fff2f2] border border-[#ffcccc] text-[var(--red)] font-black text-xs touch-target">✕</button>
                    </div>
                  </div>

                  {mQuests.length>0 ? (
                    <div className="mt-3 space-y-2">
                      {mQuests.map(q=>{
                        const isBlocked = q.dependsOn && q.dependsOn.some(dep=> !quests.find(x=>x.id===dep)?.isCompleted);
                        return (
                          <div key={q.id} className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border ${q.isCompleted?'bg-[#f0f8e8] border-[#bde8a8]':isBlocked?'bg-[#fff7e6] border-[#ffd6a5]':'bg-white border-[#e5e5e5]'}`}>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-sm text-[var(--dark-blue)] truncate">{q.title}</span>
                                {q.priority && <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black uppercase ${q.priority==='critical'?'bg-[var(--red)] text-white':q.priority==='high'?'bg-[#ffe9e9] text-[var(--red)] border border-[#ffcccc]':q.priority==='medium'?'bg-[#fff7e6] text-[#a66a00]':'bg-[#f0f0f0] text-[var(--gray-light)]'}`}>{q.priority}</span>}
                                {q.dueDate && <span className="text-[11px] font-bold text-[var(--gray-light)]">Due {q.dueDate}</span>}
                                {q.estimatedMinutes && <span className="text-[11px] font-bold text-[var(--blue)]">{q.estimatedMinutes}m</span>}
                              </div>
                              {isBlocked && <div className="text-[11px] font-bold text-[#a66a00]">Blocked by: {q.dependsOn!.filter(dep=> !quests.find(x=>x.id===dep)?.isCompleted).join(', ')}</div>}
                              {q.dependsOn && q.dependsOn.length>0 && !isBlocked && <div className="text-[11px] font-bold text-[var(--gray-light)]">Depends on: {q.dependsOn.join(', ')}</div>}
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {!q.isCompleted && !isBlocked && <button type="button" onClick={()=>completeQuest(q.id)} className="px-3 py-1.5 rounded-xl bg-[var(--green)] text-white font-black text-xs touch-target">Complete</button>}
                              {!q.isCompleted && !isBlocked && <button type="button" onClick={()=>{ startFocusSession(q.estimatedMinutes ?? 25, q.id, q.title); setActiveTab('focus');}} className="px-3 py-1.5 rounded-xl bg-[var(--blue)] text-white font-black text-xs touch-target">Focus</button>}
                              {!q.isCompleted && isBlocked && <span className="px-2 py-1 rounded-xl bg-[#fff2f2] border border-[#ffcccc] text-[11px] font-black text-[var(--red)]">Blocked</span>}
                              {q.isCompleted && <span className="px-2 py-1 rounded-xl bg-[var(--green)] text-white font-black text-xs">Done</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mt-3 text-xs font-bold text-[var(--gray-light)]">No quests in this milestone yet — forge a chain.</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
