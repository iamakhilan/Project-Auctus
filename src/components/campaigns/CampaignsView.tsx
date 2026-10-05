import React, { useMemo, useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { Campaign, CampaignGoalType } from '../../types';
import { sanitize } from '../../utils/validators';
import { soundEngine } from '../../utils/audioSynthesizer';
import { CampaignDetailView } from './CampaignDetailView';
import { QuestChainForgeModal } from './QuestChainForgeModal';

const GOAL_ICON: Record<CampaignGoalType, string> = { exam: '📚', project: '🚀', skill: '🧠', custom: '🎯' };
const GOAL_LABEL: Record<CampaignGoalType, string> = { exam: 'Exam', project: 'Project', skill: 'Skill', custom: 'Custom' };

export const CampaignsView: React.FC = () => {
  const { campaigns, quests, createCampaign, deleteCampaign, archiveCampaign, getCampaignProgress } = useGameState();
  const [filter, setFilter] = useState<'all'|'active'|'completed'|'archived'>('all');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [showForge, setShowForge] = useState(false);
  const [showChainFor, setShowChainFor] = useState<{ campaignId: string; milestoneId: string } | null>(null);

  // Forge campaign form
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [goalType, setGoalType] = useState<CampaignGoalType>('exam');
  const [targetDate, setTargetDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return campaigns;
    return campaigns.filter(c => c.status === filter);
  }, [campaigns, filter]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Campaign title required.'); return; }
    if (!targetDate) { setError('Target date required.'); return; }
    const clean = sanitize(title.trim());
    const today = new Date().toISOString().split('T')[0];
    if (targetDate < today) { setError('Target date cannot be in the past.'); return; }
    setError(null);
    createCampaign({
      title: clean,
      description: desc.trim() ? sanitize(desc.trim()) : undefined,
      goalType,
      targetDate,
    });
    setTitle(''); setDesc(''); setTargetDate('');
    setShowForge(false);
    soundEngine.playSuccess();
  };

  const detailCampaign = detailId ? campaigns.find(c=> c.id===detailId) ?? null : null;

  if (detailCampaign) {
    return (
      <CampaignDetailView
        campaign={detailCampaign}
        onBack={() => setDetailId(null)}
        onChainForge={(campaignId, milestoneId) => setShowChainFor({ campaignId, milestoneId })}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Feather_Bold'] text-2xl sm:text-3xl text-[var(--dark-blue)] tracking-wide">CAMPAIGNS</h1>
          <p className="text-sm font-bold text-[var(--gray-light)]">Turn real goals into structured campaigns with milestone chains.</p>
        </div>
        <button type="button" onClick={() => setShowForge(v=>!v)} className="h-11 px-5 bg-[var(--green)] hover:bg-[var(--green-hover)] text-white font-['Feather_Bold'] text-sm font-black uppercase rounded-2xl border-b-4 border-[var(--green-shadow)] active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-md flex items-center gap-2 touch-target">
          <span>{showForge ? '✕ CLOSE' : '+ NEW CAMPAIGN'}</span>
        </button>
      </div>

      {/* Forge campaign form */}
      {showForge && (
        <form onSubmit={handleCreate} className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-5 sm:p-6 shadow-xs space-y-4 animate-scaleUp">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-black uppercase text-[var(--gray-light)]">Campaign Title *</label>
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. End-Sem Exams — DBMS & OS" className="mt-1 w-full px-4 py-3 rounded-2xl border-2 border-[#e5e5e5] focus:border-[var(--blue)] focus:outline-none text-sm font-bold touch-target" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-black uppercase text-[var(--gray-light)]">Description</label>
              <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Goal breakdown, success criteria…" rows={2} className="mt-1 w-full px-4 py-3 rounded-2xl border-2 border-[#e5e5e5] focus:border-[var(--blue)] focus:outline-none text-sm font-bold resize-none" />
            </div>
            <div>
              <label className="text-xs font-black uppercase text-[var(--gray-light)]">Goal Type</label>
              <select value={goalType} onChange={e=>setGoalType(e.target.value as CampaignGoalType)} className="mt-1 w-full px-4 py-3 rounded-2xl border-2 border-[#e5e5e5] focus:border-[var(--blue)] bg-white text-sm font-bold touch-target">
                <option value="exam">📚 Exam</option>
                <option value="project">🚀 Project</option>
                <option value="skill">🧠 Skill</option>
                <option value="custom">🎯 Custom</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-black uppercase text-[var(--gray-light)]">Target Date *</label>
              <input type="date" value={targetDate} onChange={e=>setTargetDate(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-2xl border-2 border-[#e5e5e5] focus:border-[var(--blue)] bg-white text-sm font-bold touch-target" />
            </div>
          </div>
          {error && <div className="px-4 py-2 rounded-xl bg-[#fff2f2] border border-[#ffcccc] text-xs font-bold text-[#d32f2f]">{error}</div>}
          <div className="flex items-center gap-3">
            <button type="submit" className="flex-1 py-3 rounded-2xl bg-[var(--green)] text-white font-['Feather_Bold'] font-black uppercase border-b-4 border-[var(--green-shadow)] active:translate-y-0.5 active:border-b-0 touch-target">Create Campaign</button>
            <button type="button" onClick={()=>setShowForge(false)} className="px-5 py-3 rounded-2xl bg-[#f0f0f0] border-2 border-[#e5e5e5] font-bold text-sm touch-target">Cancel</button>
          </div>
        </form>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {(['all','active','completed','archived'] as const).map(f=>(
          <button key={f} type="button" onClick={()=>setFilter(f)} className={`px-4 py-2 rounded-2xl font-black text-xs uppercase touch-target whitespace-nowrap ${filter===f ? 'bg-[var(--dark-blue)] text-white' : 'bg-[#f0f0f0] text-[var(--gray-text)]'}`}>{f}</button>
        ))}
      </div>

      {/* Campaign grid */}
      {filtered.length===0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-[#d9d9d9] p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-3xl bg-[#f7f7f7] border-2 border-[#e5e5e5] flex items-center justify-center text-3xl mb-4">🗺️</div>
          <h3 className="font-['Feather_Bold'] text-lg text-[var(--dark-blue)]">No campaigns yet</h3>
          <p className="text-xs font-bold text-[var(--gray-light)] mt-1 max-w-md mx-auto">Create a campaign to turn a goal like an exam or project into milestones → quest chains → daily objectives.</p>
          <p className="text-[11px] font-bold text-[var(--blue)] mt-2">Example: Exam → Topics (milestones) → Quests → Revision → Mock Test</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((c: Campaign)=>{
            const progress = getCampaignProgress(c.id);
            const questCount = c.milestones.flatMap(m=>m.questIds).length;
            const completedCount = c.milestones.flatMap(m=>m.questIds).filter(id=> quests.find(q=>q.id===id)?.isCompleted).length;
            const daysLeft = Math.round((new Date(c.targetDate).getTime() - new Date().setHours(0,0,0,0))/86400000);
            const isOverdue = daysLeft < 0 && c.status==='active';
            return (
              <div key={c.id} className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-5 shadow-xs hover:border-[#b9e5fb] transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-10 h-10 rounded-2xl bg-[#eef8ff] border-2 border-[#b9e5fb] flex items-center justify-center text-lg shrink-0">{GOAL_ICON[c.goalType]}</span>
                    <div className="min-w-0">
                      <div className="font-['Feather_Bold'] text-sm text-[var(--dark-blue)] truncate">{c.title}</div>
                      <div className="text-[11px] font-bold text-[var(--gray-light)] flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${c.status==='active'?'bg-[#e8f8d8] text-[var(--green)] border border-[#bde8a8]':c.status==='completed'?'bg-[#eef8ff] text-[var(--blue)] border border-[#b9e5fb]':'bg-[#f0f0f0] text-[var(--gray-light)]'}`}>{c.status}</span>
                        <span>{GOAL_LABEL[c.goalType]}</span>
                        {isOverdue ? <span className="text-[var(--red)]">Overdue {Math.abs(daysLeft)}d</span> : <span>Due {c.targetDate}</span>}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-black px-2 py-1 rounded-xl bg-[#f7f7f7] border border-[#e5e5e5] shrink-0">{progress}%</span>
                </div>
                <div className="mt-3 w-full h-2.5 bg-[#f0f0f0] rounded-full overflow-hidden border border-[#e5e5e5]">
                  <div className={`h-full rounded-full transition-all duration-700 ${isOverdue?'bg-[var(--red)]':progress>=100?'bg-[var(--green)]':'bg-[var(--blue)]'}`} style={{width: `${progress}%`}} />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-[var(--gray-light)]">
                  <span>{completedCount}/{questCount} quests • {c.milestones.length} milestones</span>
                  <span className="text-[var(--blue)]">{c.targetDate}</span>
                </div>
                {c.description && <p className="mt-2 text-xs font-semibold text-[var(--gray-text)] line-clamp-2">{c.description}</p>}
                <div className="mt-4 flex items-center gap-2">
                  <button type="button" onClick={()=>setDetailId(c.id)} className="flex-1 py-2.5 rounded-2xl bg-[var(--dark-blue)] text-white font-black text-xs uppercase touch-target">Open</button>
                  {c.status==='completed' && <button type="button" onClick={()=>archiveCampaign(c.id)} className="px-4 py-2.5 rounded-2xl bg-[#f0f0f0] border-2 border-[#e5e5e5] font-black text-xs uppercase touch-target">Archive</button>}
                  <button type="button" onClick={()=>{
                    if(confirm(`Delete campaign "${c.title}"? Quests become standalone.`)) deleteCampaign(c.id);
                  }} className="px-3 py-2.5 rounded-xl bg-[#fff2f2] border border-[#ffcccc] text-[var(--red)] font-black text-xs touch-target">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showChainFor && <QuestChainForgeModal campaignId={showChainFor.campaignId} milestoneId={showChainFor.milestoneId} onClose={()=>setShowChainFor(null)} />}
    </div>
  );
};
