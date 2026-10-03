import React, { useState, useMemo } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { QuestTag, QuestCategory, QuestPriority } from '../../types';
import { sanitize } from '../../utils/validators';
import { useFocusTrap } from '../../hooks/useFocusTrap';

export const QuestChainForgeModal: React.FC<{ campaignId: string; milestoneId: string; onClose: () => void }> = ({ campaignId, milestoneId, onClose }) => {
  const { quests, createQuestChain } = useGameState();
  const panelRef = useFocusTrap<HTMLDivElement>(true, onClose);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<QuestPriority>('medium');
  const [tag, setTag] = useState<QuestTag>('Study');
  const [category, setCategory] = useState<QuestCategory>('bounty');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [dependsOn, setDependsOn] = useState<string[]>([]);
  const [chainItems, setChainItems] = useState<Array<{ title: string; dueDate?: string; priority: QuestPriority; estimatedMinutes: number }>>([]);
  const [error, setError] = useState<string | null>(null);

  const milestoneQuests = useMemo(()=> quests.filter(q=> q.milestoneId===milestoneId), [quests, milestoneId]);

  const addToChain = () => {
    if (!title.trim()) { setError('Title required.'); return; }
    setError(null);
    setChainItems(prev=> [...prev, { title: sanitize(title.trim()), dueDate: dueDate || undefined, priority, estimatedMinutes }]);
    setTitle(''); setDueDate('');
  };

  const handleCreateChain = () => {
    if (chainItems.length===0) { setError('Add at least one quest to the chain.'); return; }
    const drafts: Parameters<typeof createQuestChain>[2] = chainItems.map(item=> ({
      title: item.title,
      category,
      tag,
      xpReward: category==='daily'?60:category==='bounty'?120:250,
      coinsReward: category==='daily'?30:category==='bounty'?60:150,
      estimatedMinutes: item.estimatedMinutes,
      dueDate: item.dueDate,
      priority: item.priority,
      dependsOn: undefined, // linear wiring handled by GameState.createQuestChain
    }));
    if (dependsOn.length) {
      (drafts[0] as Record<string, unknown>).dependsOn = [...dependsOn];
    }
    const created = createQuestChain(campaignId, milestoneId, drafts);
    if (created.length === 0) setError('Could not create chain — would create a cycle.');
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn" role="presentation" onClick={onClose}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Forge Quest Chain" className="relative w-full max-w-lg max-h-[90vh] bg-white rounded-3xl border-2 border-[#e5e5e5] shadow-2xl overflow-hidden animate-scaleUp flex flex-col" onClick={e=>e.stopPropagation()}>
        <div className="p-5 sm:p-6 border-b-2 border-[#f0f0f0] flex items-center justify-between">
          <h2 className="font-['Feather_Bold'] text-lg text-[var(--dark-blue)]">FORGE QUEST CHAIN</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-xl bg-[#f0f0f0] flex items-center justify-center font-black">✕</button>
        </div>
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <select value={category} onChange={e=>setCategory(e.target.value as QuestCategory)} className="px-3 py-2.5 rounded-xl border-2 border-[#e5e5e5] text-sm font-bold bg-white">
              <option value="daily">Daily</option><option value="bounty">Bounty</option><option value="epic">Epic</option>
            </select>
            <select value={tag} onChange={e=>setTag(e.target.value as QuestTag)} className="px-3 py-2.5 rounded-xl border-2 border-[#e5e5e5] text-sm font-bold bg-white">
              {(['Study','Coding','Fitness','Work','Personal','Creative','Deep Work'] as QuestTag[]).map(t=><option key={t} value={t}>{t}</option>)}
            </select>
            <select value={priority} onChange={e=>setPriority(e.target.value as QuestPriority)} className="px-3 py-2.5 rounded-xl border-2 border-[#e5e5e5] text-sm font-bold bg-white">
              <option value="low">Low priority</option><option value="medium">Medium priority</option><option value="high">High priority</option><option value="critical">Critical</option>
            </select>
            <input type="number" min={5} max={180} value={estimatedMinutes} onChange={e=>setEstimatedMinutes(parseInt(e.target.value)||25)} className="px-3 py-2.5 rounded-xl border-2 border-[#e5e5e5] text-sm font-bold" placeholder="Minutes" />
          </div>
          <div>
            <label className="text-xs font-black uppercase text-[var(--gray-light)]">Depends on (optional gate)</label>
            <select multiple value={dependsOn} onChange={e=>setDependsOn(Array.from(e.target.selectedOptions, o=>o.value))} className="mt-1 w-full px-3 py-2 rounded-xl border-2 border-[#e5e5e5] text-xs font-bold h-20 bg-white">
              {milestoneQuests.map(q=> <option key={q.id} value={q.id}>{q.title} {q.isCompleted?'(done)':''}</option>)}
            </select>
            <div className="text-[11px] font-bold text-[var(--gray-light)] mt-1">Hold Cmd/Ctrl to select multiple blockers.</div>
          </div>
          <div className="rounded-2xl bg-[#fafafa] border-2 border-[#e5e5e5] p-3 space-y-3">
            <div className="text-xs font-black uppercase text-[var(--gray-light)]">Chain builder (quests execute in order)</div>
            <div className="flex gap-2">
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Quest title e.g. Read Ch.4 notes" className="flex-1 px-3 py-2.5 rounded-xl border-2 border-[#e5e5e5] text-sm font-bold" />
              <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} className="px-3 py-2.5 rounded-xl border-2 border-[#e5e5e5] text-sm font-bold" />
              <button type="button" onClick={addToChain} className="px-4 py-2.5 rounded-xl bg-[var(--dark-blue)] text-white font-black text-xs touch-target">Add</button>
            </div>
            {chainItems.length>0 ? (
              <div className="space-y-2">
                {chainItems.map((it, idx)=>(
                  <div key={idx} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border-2 border-[#e5e5e5]">
                    <span className="text-sm font-bold text-[var(--dark-blue)]">{idx+1}. {it.title} {it.dueDate?`• ${it.dueDate}`:''} • {it.estimatedMinutes}m • {it.priority}</span>
                    <button type="button" onClick={()=>setChainItems(prev=>prev.filter((_,i)=>i!==idx))} className="px-2 py-1 rounded-lg bg-[#fff2f2] border border-[#ffcccc] text-[var(--red)] font-black text-xs">Remove</button>
                  </div>
                ))}
              </div>
            ) : <div className="text-xs font-bold text-[var(--gray-light)]">No items yet — add quests above. They will be created as a linear chain under this milestone.</div>}
          </div>
          {error && <div className="px-3 py-2 rounded-xl bg-[#fff2f2] border border-[#ffcccc] text-xs font-bold text-[#d32f2f]">{error}</div>}
        </div>
        <div className="p-4 sm:p-5 border-t-2 border-[#f0f0f0] flex gap-3">
          <button type="button" onClick={handleCreateChain} className="flex-1 py-3 rounded-2xl bg-[var(--green)] text-white font-black uppercase border-b-4 border-[var(--green-shadow)] touch-target">Create Chain ({chainItems.length})</button>
          <button type="button" onClick={onClose} className="px-5 py-3 rounded-2xl bg-[#f0f0f0] border-2 border-[#e5e5e5] font-bold touch-target">Cancel</button>
        </div>
      </div>
    </div>
  );
};
