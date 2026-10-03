import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { WeeklyReview } from '../../types';

export const WeeklyReviewModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { weeklyReviews, generateWeeklyReview, carryOverOverdue, dismissWeeklyReview } = useGameState();
  const panelRef = useFocusTrap<HTMLDivElement>(isOpen, onClose);
  const [review, setReview] = useState<WeeklyReview | null>(null);

  const activeReview = review ?? weeklyReviews.find(r=> !r.archived) ?? null;
  const handleGenerate = () => {
    const r = generateWeeklyReview();
    setReview(r);
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn" role="presentation" onClick={onClose}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Weekly Review" className="relative w-full max-w-xl max-h-[90vh] bg-white rounded-3xl border-2 border-[#e5e5e5] shadow-2xl overflow-hidden animate-scaleUp flex flex-col" onClick={e=>e.stopPropagation()}>
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[var(--dark-blue)] to-[#1a237e] text-white relative">
          <h2 className="font-['Feather_Bold'] text-xl tracking-wide">WEEKLY REVIEW</h2>
          <p className="text-xs font-bold text-white/80">Plan → Execute → Review → Adapt — real performance, deterministic insights.</p>
          <button type="button" onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/15 text-white flex items-center justify-center font-black">✕</button>
        </div>
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {!activeReview ? (
            <div className="text-center py-6">
              <p className="text-sm font-bold text-[var(--gray-light)]">No review yet for this week.</p>
              <button type="button" onClick={handleGenerate} className="mt-4 px-5 py-3 rounded-2xl bg-[var(--blue)] text-white font-black uppercase text-sm border-b-4 border-[#0b80ba] touch-target">Generate Weekly Review</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-[#f7f7f7] border-2 border-[#e5e5e5] p-3 text-center">
                  <div className="text-[11px] font-black uppercase text-[var(--gray-light)]">Completion</div>
                  <div className="font-['Feather_Bold'] text-xl text-[var(--dark-blue)]">{activeReview.stats.completionRate}%</div>
                  <div className="text-[11px] font-bold text-[var(--gray-light)]">{activeReview.stats.completed}/{activeReview.stats.planned}</div>
                </div>
                <div className="rounded-2xl bg-[#f7f7f7] border-2 border-[#e5e5e5] p-3 text-center">
                  <div className="text-[11px] font-black uppercase text-[var(--gray-light)]">Focus</div>
                  <div className="font-['Feather_Bold'] text-xl text-[var(--dark-blue)]">{activeReview.stats.totalFocusMinutes}m</div>
                  <div className="text-[11px] font-bold text-[var(--gray-light)]">total</div>
                </div>
                <div className="rounded-2xl bg-[#f7f7f7] border-2 border-[#e5e5e5] p-3 text-center">
                  <div className="text-[11px] font-black uppercase text-[var(--gray-light)]">Overdue</div>
                  <div className={`font-['Feather_Bold'] text-xl ${activeReview.stats.overdueCarried>0?'text-[var(--red)]':'text-[var(--green)]'}`}>{activeReview.stats.overdueCarried}</div>
                  <div className="text-[11px] font-bold text-[var(--gray-light)]">carried</div>
                </div>
              </div>

              {activeReview.stats.campaignsProgress.length>0 && (
                <div className="space-y-2">
                  <div className="text-xs font-black uppercase text-[var(--gray-light)]">Campaigns</div>
                  {activeReview.stats.campaignsProgress.map(cp=>(
                    <div key={cp.campaignId} className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#fafafa] border border-[#e5e5e5]">
                      <span className="text-sm font-bold text-[var(--dark-blue)] truncate">{cp.title}</span>
                      <span className="text-xs font-black px-2 py-1 rounded-full bg-white border border-[#e5e5e5]">{cp.progress}%</span>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <div className="text-xs font-black uppercase text-[var(--gray-light)] mb-2">Insights (from your history)</div>
                <ul className="space-y-1.5">
                  {activeReview.insights.map((ins, i)=> <li key={i} className="text-sm font-semibold text-[var(--gray-text)] px-3 py-2 rounded-xl bg-[#fafafa] border border-[#e5e5e5]">• {ins}</li>)}
                </ul>
              </div>

              {activeReview.suggestedActions.length>0 && (
                <div>
                  <div className="text-xs font-black uppercase text-[var(--gray-light)] mb-2">Suggested next actions</div>
                  <div className="space-y-2">
                    {activeReview.suggestedActions.map((a,i)=>(
                      <div key={i} className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-[#eef8ff] border-2 border-[#b9e5fb]">
                        <span className="text-sm font-bold text-[var(--dark-blue)]">{a.label}</span>
                        {a.questIds && a.questIds.length>0 && (
                          <button type="button" onClick={()=>{
                            const nd = prompt('New due date YYYY-MM-DD for carried quests', new Date(Date.now()+7*86400000).toISOString().split('T')[0]);
                            if (nd && /^\d{4}-\d{2}-\d{2}$/.test(nd)) carryOverOverdue(a.questIds!, nd);
                          }} className="px-3 py-1.5 rounded-xl bg-[var(--blue)] text-white font-black text-xs shrink-0 touch-target">Carry over</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button type="button" onClick={handleGenerate} className="flex-1 py-2.5 rounded-xl bg-[#f0f0f0] border-2 border-[#e5e5e5] font-black text-xs uppercase touch-target">Regenerate</button>
                <button type="button" onClick={()=>{ dismissWeeklyReview(); onClose(); }} className="flex-1 py-2.5 rounded-xl bg-[var(--dark-blue)] text-white font-black text-xs uppercase touch-target">Dismiss until next week</button>
              </div>
              <div className="text-[11px] font-bold text-[var(--gray-light)] text-center">Week {activeReview.weekStart} → {activeReview.weekEnd}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
