import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { generateDailySummary, formatDailyDebriefText } from '../../domain/analytics';

interface DailySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailySummaryModal: React.FC<DailySummaryModalProps> = ({ isOpen, onClose }) => {
  const { profile, quests, habits, transactions } = useGameState();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const summary = generateDailySummary(
    undefined,
    profile,
    quests,
    habits,
    transactions
  );

  const handleCopy = () => {
    const text = formatDailyDebriefText(summary, profile.name);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-surface-container-high to-surface-container-low border border-amber-400/70 p-5 shadow-crown flex flex-col relative animate-scaleUp">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-control bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-gold-aura">
              <span className="material-symbols-outlined text-[22px]">analytics</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-white font-extrabold flex items-center gap-2">
                Daily Run Debrief
              </h3>
              <span className="font-label-sm text-label-sm text-amber-300 font-semibold">
                {summary.date} • {profile.name}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-control flex items-center justify-center text-on-surface-variant hover:text-white hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Discipline Rating Hero Card */}
        <div className="my-3 p-3.5 rounded-card bg-gradient-to-r from-amber-950/60 via-surface-container to-surface-container-high border border-amber-400/40 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-amber-300 font-black uppercase tracking-wider">
              Discipline Score
            </span>
            <span className="font-headline-lg text-headline-xl text-white font-black drop-shadow">
              {summary.disciplineScore} <span className="text-label-md text-amber-300/80 font-bold">/ 100</span>
            </span>
            <span className="font-label-sm text-label-sm text-emerald-400 font-extrabold mt-0.5">
              {summary.ratingTitle}
            </span>
          </div>

          <div className="w-16 h-16 rounded-full border-4 border-amber-400 flex items-center justify-center bg-amber-500/10 shadow-[0_0_18px_rgba(245,158,11,0.3)]">
            <span className="material-symbols-outlined text-amber-400 text-[32px] fill-1 animate-pulse">
              military_tech
            </span>
          </div>
        </div>

        {/* Key Triad Metrics */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="p-2 rounded-control bg-surface-container border border-outline-variant/70 flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-cyan-400 text-[18px]">timer</span>
            <span className="font-headline-sm text-headline-sm text-white font-black mt-0.5">
              {summary.focusMinutes}m
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Focus Logged</span>
          </div>

          <div className="p-2 rounded-control bg-surface-container border border-outline-variant/70 flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-amber-400 text-[18px]">task_alt</span>
            <span className="font-headline-sm text-headline-sm text-white font-black mt-0.5">
              {summary.questsCompletedCount}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Missions</span>
          </div>

          <div className="p-2 rounded-control bg-surface-container border border-outline-variant/70 flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-rose-400 text-[18px]">local_fire_department</span>
            <span className="font-headline-sm text-headline-sm text-white font-black mt-0.5">
              {summary.habitsCheckedInCount}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Habits</span>
          </div>
        </div>

        {/* Treasury Flows */}
        <div className="p-2.5 rounded-control bg-surface-dim border border-outline-variant/60 flex items-center justify-between text-body-sm mb-3">
          <div className="flex items-center gap-1 text-emerald-400 font-bold">
            <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
            <span>+{summary.coinsEarned} Coins</span>
          </div>
          <div className="flex items-center gap-1 text-rose-400 font-bold">
            <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
            <span>-{summary.coinsSpent} Coins</span>
          </div>
          <div className="flex items-center gap-1 text-cyan-300 font-bold">
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>+{summary.xpEarned} XP</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-outline-variant/60 flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="btn btn-gold flex-1 h-10 font-label-md text-label-md uppercase font-black flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied to Clipboard!' : 'Share Debrief'}</span>
          </button>
          <button
            onClick={onClose}
            className="btn btn-navy h-10 px-4 font-label-md text-label-md uppercase font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
