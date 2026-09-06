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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-surface-container border border-amber-400/60 p-5 shadow-crown z-10 animate-slideUp flex flex-col gap-3">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <span className="material-symbols-outlined text-[18px]">analytics</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-base text-white font-extrabold">
                Daily Run Debrief
              </h3>
              <span className="text-[11px] text-amber-300/90 font-medium">
                {summary.date} • {profile.name}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Discipline Rating Hero Card */}
        <div className="p-3.5 rounded-2xl bg-surface-dim border border-amber-400/40 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider">
              Discipline Rating
            </span>
            <span className="font-headline-lg text-2xl text-white font-black">
              {summary.disciplineScore} <span className="text-xs text-amber-300/80 font-bold">/ 100</span>
            </span>
            <span className="text-xs text-emerald-400 font-bold mt-0.5">
              {summary.ratingTitle}
            </span>
          </div>

          <div className="w-12 h-12 rounded-full border-2 border-amber-400 flex items-center justify-center bg-amber-400/10 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
            <span className="material-symbols-outlined text-amber-400 text-[24px] fill-1">
              military_tech
            </span>
          </div>
        </div>

        {/* Key Triad Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded-xl bg-surface-dim border border-outline-variant/40 flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-cyan-400 text-[16px]">timer</span>
            <span className="font-headline-sm text-sm text-white font-black mt-0.5">
              {summary.focusMinutes}m
            </span>
            <span className="text-[10px] text-on-surface-variant">Focus Logged</span>
          </div>

          <div className="p-2 rounded-xl bg-surface-dim border border-outline-variant/40 flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-amber-400 text-[16px]">task_alt</span>
            <span className="font-headline-sm text-sm text-white font-black mt-0.5">
              {summary.questsCompletedCount}
            </span>
            <span className="text-[10px] text-on-surface-variant">Missions</span>
          </div>

          <div className="p-2 rounded-xl bg-surface-dim border border-outline-variant/40 flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-rose-400 text-[16px]">local_fire_department</span>
            <span className="font-headline-sm text-sm text-white font-black mt-0.5">
              {summary.habitsCheckedInCount}
            </span>
            <span className="text-[10px] text-on-surface-variant">Habits</span>
          </div>
        </div>

        {/* Treasury Flows */}
        <div className="p-2.5 rounded-xl bg-surface-dim border border-outline-variant/40 flex items-center justify-between text-xs">
          <span className="text-emerald-400 font-bold">+{summary.coinsEarned} Coins</span>
          <span className="text-rose-400 font-bold">-{summary.coinsSpent} Coins</span>
          <span className="text-cyan-300 font-bold">+{summary.xpEarned} XP</span>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="btn btn-gold flex-1 h-11 text-xs uppercase tracking-wider font-black flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied to Clipboard!' : 'Share Debrief'}</span>
          </button>
          <button
            onClick={onClose}
            className="btn btn-navy h-11 px-4 text-xs font-bold uppercase"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
