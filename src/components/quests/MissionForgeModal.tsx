import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { QuestTier, QuestCategory, QuestTag } from '../../types';
import { getTierRewards } from '../../domain/quests';
import { CoinIcon } from '../common/GameIcons';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      {/* Backdrop touch area */}
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-game-card border-2 border-game-borderHi p-5 sm:p-6 shadow-game-card-raised z-10 animate-scaleUp flex flex-col gap-4 custom-scrollbar"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Plate */}
        <div className="flex items-center justify-between pb-3 border-b border-game-border">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/50 flex items-center justify-center text-amber-300 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">hardware</span>
            </div>
            <div>
              <h2 className="font-game text-base sm:text-lg text-game-text font-black uppercase tracking-tight">
                Mission Forge
              </h2>
              <span className="font-game text-[11px] text-amber-300 uppercase font-black tracking-wider">
                Deploy Tactical Bounty
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-game-dark border border-game-border text-game-muted hover:text-game-text flex items-center justify-center active:scale-95 cursor-pointer"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Mission Category Selector */}
          <div>
            <label className="font-game text-xs text-game-muted uppercase font-black tracking-wider block mb-1.5">
              Mission Protocol
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'bounty', label: 'Bounty', icon: 'military_tech' },
                { id: 'epic', label: 'Epic Raid', icon: 'fort' },
                { id: 'habit', label: 'Habit Forge', icon: 'auto_fix' },
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as QuestCategory)}
                  className={`h-11 rounded-xl font-game text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    category === cat.id
                      ? 'bg-gold text-game-darkest font-black shadow-game-btn-gold border border-yellow-200'
                      : 'bg-game-darkest border border-game-border text-game-muted hover:text-game-text'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="font-game text-xs text-game-muted uppercase font-black tracking-wider block mb-1.5">
              Objective Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Complete System Architecture Refactor..."
              className="w-full h-12 px-3.5 rounded-xl bg-game-darkest border border-game-border text-game-text text-sm placeholder:text-game-dim focus:outline-none focus:border-blue shadow-inner font-body transition-all"
            />
          </div>

          {/* Optional Notes */}
          <div>
            <label className="font-game text-xs text-game-muted uppercase font-black tracking-wider block mb-1.5">
              Tactical Notes / Checklist (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g., Run sanity checks, commit diffs, verify logs..."
              className="w-full h-10 px-3.5 rounded-xl bg-game-darkest border border-game-border text-game-text text-sm placeholder:text-game-dim focus:outline-none focus:border-blue shadow-inner font-body transition-all"
            />
          </div>

          {/* Tier Selector & Yield Calculator */}
          {category !== 'habit' && (
            <div>
              <div className="flex items-center justify-between mb-1.5 font-game">
                <label className="text-xs text-game-muted uppercase font-black tracking-wider">
                  Bounty Tier & Difficulty
                </label>
                <div className="flex items-center gap-2 text-xs font-black">
                  <span className="text-blue-light">+{yields.xpReward} XP</span>
                  <span className="text-game-dim">•</span>
                  <span className="text-amber-300 flex items-center gap-0.5">
                    <CoinIcon size={12} />
                    +{yields.coinReward}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {tiers.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTier(t)}
                    className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                      tier === t
                        ? 'bg-blue text-white font-black shadow-game-btn-blue border border-blue-light'
                        : 'bg-game-darkest border border-game-border text-game-muted hover:text-game-text'
                    }`}
                  >
                    <span className="text-xs font-game font-black">{t}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tag Selector Chips */}
          <div>
            <label className="font-game text-xs text-game-muted uppercase font-black tracking-wider block mb-1.5">
              Domain Tag
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {tags.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`px-3 py-1.5 rounded-full font-game text-xs font-black transition-all cursor-pointer ${
                    tag === t
                      ? 'bg-gold text-game-darkest shadow-game-btn-gold border border-yellow-200'
                      : 'bg-game-darkest hover:bg-game-card border border-game-border text-game-muted'
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
                <label className="font-game text-xs text-game-muted uppercase font-black tracking-wider block mb-1.5">
                  Due Target
                </label>
                <select
                  value={deadline}
                  onChange={e => setDeadline(e.target.value as 'Today' | 'Tonight' | 'Tomorrow' | 'This Week')}
                  className="w-full h-11 px-3 rounded-xl bg-game-darkest border border-game-border text-game-text text-sm font-game font-bold focus:outline-none focus:border-blue cursor-pointer"
                >
                  <option value="Today">Today</option>
                  <option value="Tonight">Tonight</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="This Week">This Week</option>
                </select>
              </div>

              <div>
                <label className="font-game text-xs text-game-muted uppercase font-black tracking-wider block mb-1.5">
                  Target Duration
                </label>
                <select
                  value={estimatedMinutes}
                  onChange={e => setEstimatedMinutes(Number(e.target.value))}
                  className="w-full h-11 px-3 rounded-xl bg-game-darkest border border-game-border text-game-text text-sm font-game font-bold focus:outline-none focus:border-blue cursor-pointer"
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
              className="w-28 h-12 btn-game btn-game-dark text-xs font-bold uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-12 btn-game btn-game-green font-game text-sm uppercase tracking-wider font-black shadow-game-btn-green"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>Deploy Bounty</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

