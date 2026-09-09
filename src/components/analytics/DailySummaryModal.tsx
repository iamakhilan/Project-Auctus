import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { generateDailySummary, formatDailyDebriefText } from '../../domain/analytics';
import { TrophyIcon, StarIcon } from '../common/GameIcons';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-game-card border-2 border-game-borderHi p-5 shadow-game-card-raised z-10 animate-scaleUp flex flex-col gap-3.5 overflow-hidden">
        {/* Top Header Plate */}
        <div className="flex items-center justify-between pb-2 border-b border-game-border">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue/20 border border-blue flex items-center justify-center text-blue-light">
              <span className="material-symbols-outlined text-[20px]">analytics</span>
            </div>
            <div>
              <h3 className="font-game text-sm sm:text-base text-game-text font-black uppercase tracking-tight">
                Daily Run Debrief
              </h3>
              <span className="font-body text-[11px] text-game-muted font-bold">
                {summary.date} • {profile.name}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-game-dark border border-game-border text-game-muted hover:text-game-text flex items-center justify-center active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Discipline Rating Hero Card */}
        <div className="p-4 rounded-2xl bg-game-darkest border-2 border-gold/60 flex items-center justify-between shadow-inner">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 mb-1">
              {[1, 2, 3].map((star) => (
                <StarIcon key={star} size={14} filled={summary.disciplineScore >= star * 30} />
              ))}
            </div>
            <span className="text-[10px] text-amber-300 font-game font-black uppercase tracking-wider">
              Discipline Rating
            </span>
            <span className="font-game text-2xl text-game-text font-black">
              {summary.disciplineScore} <span className="text-xs text-game-muted font-bold">/ 100</span>
            </span>
            <span className="font-body text-xs text-game-muted font-bold mt-0.5">
              {summary.ratingTitle}
            </span>
          </div>

          <div className="w-14 h-14 rounded-2xl border-2 border-gold flex items-center justify-center bg-gold/15 shadow-gold-glow">
            <TrophyIcon size={28} />
          </div>
        </div>

        {/* Key Triad Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-game-darkest border border-game-border flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-blue-light text-[18px]">timer</span>
            <span className="font-game text-sm text-game-text font-black mt-0.5">
              {summary.focusMinutes}m
            </span>
            <span className="text-[10px] text-game-dim font-bold">Focus</span>
          </div>

          <div className="p-2.5 rounded-xl bg-game-darkest border border-game-border flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-green-light text-[18px]">military_tech</span>
            <span className="font-game text-sm text-game-text font-black mt-0.5">
              {summary.questsCompletedCount}
            </span>
            <span className="text-[10px] text-game-dim font-bold">Missions</span>
          </div>

          <div className="p-2.5 rounded-xl bg-game-darkest border border-game-border flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-orange-400 text-[18px]">local_fire_department</span>
            <span className="font-game text-sm text-game-text font-black mt-0.5">
              {summary.habitsCheckedInCount}
            </span>
            <span className="text-[10px] text-game-dim font-bold">Habits</span>
          </div>
        </div>

        {/* Treasury Flows */}
        <div className="p-3 rounded-xl bg-game-darkest border border-game-border flex items-center justify-between text-xs font-game">
          <span className="text-amber-300 font-extrabold">+{summary.coinsEarned} Coins</span>
          <span className="text-red-400 font-bold">-{summary.coinsSpent} Spent</span>
          <span className="text-blue-light font-extrabold">+{summary.xpEarned} XP</span>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="btn-game btn-game-gold flex-1 h-11 text-xs uppercase tracking-wider font-black flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied!' : 'Share Debrief'}</span>
          </button>
          <button
            onClick={onClose}
            className="btn-game btn-game-dark h-11 px-4 text-xs font-bold uppercase"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

