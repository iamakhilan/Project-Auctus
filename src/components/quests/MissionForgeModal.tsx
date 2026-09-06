import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { QuestTier, QuestCategory, QuestTag } from '../../types';
import { getTierRewards } from '../../domain/quests';

interface MissionForgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MissionForgeModal: React.FC<MissionForgeModalProps> = ({ isOpen, onClose }) => {
  const { createQuest, createHabit } = useGameState();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<QuestCategory>('bounty');
  const [tier, setTier] = useState<QuestTier>('Tier II');
  const [tag, setTag] = useState<QuestTag>('Coding');
  const [deadline, setDeadline] = useState<'Today' | 'Tonight' | 'Tomorrow' | 'This Week'>('Today');
  const [estimatedMinutes, setEstimatedMinutes] = useState(25);

  if (!isOpen) return null;

  const tags: QuestTag[] = ['Study', 'Coding', 'Health', 'Personal', 'College', 'Project', 'Creative', 'Work'];
  const tiers: QuestTier[] = ['Tier I', 'Tier II', 'Tier III', 'Epic', 'Urgent'];
  const yields = getTierRewards(tier);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (category === 'habit') {
      createHabit(title.trim(), 'focus', description.trim() || undefined, yields.xpReward, yields.coinReward);
    } else {
      createQuest({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        tier,
        tag,
        dueLabel: deadline,
        estimatedMinutes,
      });
    }

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop touch area */}
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-surface-container border border-outline-variant/70 p-5 sm:p-6 shadow-crown z-10 animate-slideUp flex flex-col gap-4 custom-scrollbar"
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator / Sheet Header */}
        <div className="w-12 h-1.5 rounded-full bg-outline-variant mx-auto mb-1 sm:hidden opacity-60" />

        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-sm">
              <span className="material-symbols-outlined text-[22px]">hardware</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-base sm:text-lg text-white font-extrabold tracking-tight">
                Mission Forge
              </h2>
              <span className="font-label-sm text-[11px] text-amber-300/90 uppercase font-bold tracking-wider">
                Deploy Tactical Bounty
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Mission Category Selector */}
          <div>
            <label className="font-label-sm text-xs text-on-surface-variant uppercase font-bold tracking-wider block mb-1.5">
              Mission Protocol
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'bounty', label: 'Bounty', icon: 'swords' },
                { id: 'epic', label: 'Epic Raid', icon: 'fort' },
                { id: 'habit', label: 'Habit Forge', icon: 'auto_fix' },
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as QuestCategory)}
                  className={`h-11 rounded-xl font-label-md text-xs flex items-center justify-center gap-1.5 transition-all ${
                    category === cat.id
                      ? 'bg-navy-hi border border-amber-400/60 text-amber-300 font-extrabold shadow-card'
                      : 'bg-surface-dim border border-outline-variant/60 text-on-surface-variant hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="font-label-sm text-xs text-on-surface-variant uppercase font-bold tracking-wider block mb-1.5">
              Objective Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Complete System Architecture Refactor..."
              className="w-full h-12 px-3.5 rounded-xl bg-surface-dim border border-outline-variant text-on-surface text-sm placeholder:text-outline focus:outline-none focus:border-amber-400 shadow-inset-well transition-all"
            />
          </div>

          {/* Optional Notes */}
          <div>
            <label className="font-label-sm text-xs text-on-surface-variant uppercase font-bold tracking-wider block mb-1.5">
              Tactical Notes / Checklist (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g., Run sanity checks, commit diffs, verify logs..."
              className="w-full h-10 px-3.5 rounded-xl bg-surface-dim border border-outline-variant text-on-surface text-sm placeholder:text-outline focus:outline-none focus:border-amber-400 shadow-inset-well transition-all"
            />
          </div>

          {/* Tier Selector & Yield Calculator */}
          {category !== 'habit' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-label-sm text-xs text-on-surface-variant uppercase font-bold tracking-wider">
                  Bounty Tier & Difficulty
                </label>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <span>+{yields.xpReward} XP</span>
                  <span>•</span>
                  <span className="text-amber-300">+{yields.coinReward} Coins</span>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {tiers.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTier(t)}
                    className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center transition-all ${
                      tier === t
                        ? 'bg-amber-400 text-amber-950 font-black shadow-card border border-yellow-200'
                        : 'bg-surface-dim border border-outline-variant/60 text-sky-200/80 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-extrabold">{t}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tag Selector Chips */}
          <div>
            <label className="font-label-sm text-xs text-on-surface-variant uppercase font-bold tracking-wider block mb-1.5">
              Domain Tag
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {tags.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`px-3 py-1.5 rounded-full font-label-sm text-xs font-bold transition-all ${
                    tag === t
                      ? 'bg-cyan-400 text-slate-950 font-black shadow-sm'
                      : 'bg-surface-dim hover:bg-surface-container border border-outline-variant text-sky-200/80'
                  }`}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>

          {/* Deadline & Focus Target */}
          {category !== 'habit' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-label-sm text-xs text-on-surface-variant uppercase font-bold tracking-wider block mb-1.5">
                  Due Target
                </label>
                <select
                  value={deadline}
                  onChange={e => setDeadline(e.target.value as 'Today' | 'Tonight' | 'Tomorrow' | 'This Week')}
                  className="w-full h-11 px-3 rounded-xl bg-surface-dim border border-outline-variant text-on-surface text-sm font-semibold focus:outline-none focus:border-amber-400"
                >
                  <option value="Today">Today</option>
                  <option value="Tonight">Tonight</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="This Week">This Week</option>
                </select>
              </div>

              <div>
                <label className="font-label-sm text-xs text-on-surface-variant uppercase font-bold tracking-wider block mb-1.5">
                  Target Duration
                </label>
                <select
                  value={estimatedMinutes}
                  onChange={e => setEstimatedMinutes(Number(e.target.value))}
                  className="w-full h-11 px-3 rounded-xl bg-surface-dim border border-outline-variant text-emerald-300 text-sm font-semibold focus:outline-none focus:border-amber-400"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={25}>25 Minutes (Standard)</option>
                  <option value={45}>45 Minutes (Deep)</option>
                  <option value={60}>60 Minutes (Titan)</option>
                  <option value={90}>90 Minutes (Apex)</option>
                </select>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-28 h-12 rounded-xl bg-surface-dim border border-outline-variant text-on-surface-variant font-headline-sm text-sm font-bold hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-12 btn btn-gold font-headline-sm text-sm uppercase tracking-wider font-black shadow-md"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>Deploy to Command</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
