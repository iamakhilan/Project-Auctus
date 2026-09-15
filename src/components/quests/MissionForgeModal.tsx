import React, { useState } from 'react';
import { QuestCategory, QuestTag } from '../../types';
import { useGameState } from '../../context/GameStateContext';
import { soundEngine } from '../../utils/audioSynthesizer';

interface MissionForgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'quest' | 'habit';
}

export const MissionForgeModal: React.FC<MissionForgeModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'quest',
}) => {
  const { createQuest, createHabit } = useGameState();

  const [mode, setMode] = useState<'quest' | 'habit'>(defaultTab);

  // Quest state
  const [questTitle, setQuestTitle] = useState('');
  const [questDesc, setQuestDesc] = useState('');
  const [category, setCategory] = useState<QuestCategory>('daily');
  const [tag, setTag] = useState<QuestTag>('Coding');
  const [duration, setDuration] = useState(25);
  const [xpReward, setXpReward] = useState(80);
  const [coinsReward, setCoinsReward] = useState(40);

  // Habit state
  const [habitTitle, setHabitTitle] = useState('');
  const [habitCategory, setHabitCategory] = useState<'focus' | 'vitality' | 'mind' | 'routine'>('focus');
  const [habitIcon, setHabitIcon] = useState('⚡');
  const [habitXpYield, setHabitXpYield] = useState(50);
  const [habitCoinYield, setHabitCoinYield] = useState(25);

  if (!isOpen) return null;

  const handleCategoryChange = (cat: QuestCategory) => {
    setCategory(cat);
    if (cat === 'daily') {
      setXpReward(60);
      setCoinsReward(30);
    } else if (cat === 'bounty') {
      setXpReward(120);
      setCoinsReward(60);
    } else {
      setXpReward(250);
      setCoinsReward(120);
    }
  };

  const handleDurationChange = (m: number) => {
    setDuration(m);
    const multiplier = m / 25;
    const baseXP = category === 'daily' ? 60 : category === 'bounty' ? 120 : 250;
    setXpReward(Math.round(baseXP * multiplier));
    setCoinsReward(Math.round(baseXP * 0.5 * multiplier));
  };

  const handleCreateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questTitle.trim()) return;

    soundEngine.playSuccess();
    createQuest({
      title: questTitle.trim(),
      description: questDesc.trim() || undefined,
      category,
      tag,
      xpReward,
      coinsReward,
      estimatedMinutes: duration,
      dueLabel: category === 'daily' ? 'Today' : category === 'bounty' ? 'Soon' : 'Epic Goal',
    });

    setQuestTitle('');
    setQuestDesc('');
    onClose();
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitTitle.trim()) return;

    soundEngine.playSuccess();
    createHabit({
      title: habitTitle.trim(),
      category: habitCategory,
      icon: habitIcon,
      xpYield: habitXpYield,
      coinYield: habitCoinYield,
    });

    setHabitTitle('');
    onClose();
  };

  const handleHabitCategoryChange = (c: 'focus' | 'vitality' | 'mind' | 'routine') => {
    setHabitCategory(c);
    if (c === 'focus') {
      setHabitXpYield(60);
      setHabitCoinYield(30);
    } else if (c === 'vitality') {
      setHabitXpYield(50);
      setHabitCoinYield(25);
    } else if (c === 'mind') {
      setHabitXpYield(45);
      setHabitCoinYield(20);
    } else {
      setHabitXpYield(40);
      setHabitCoinYield(20);
    }
  };

  const tags: QuestTag[] = ['Coding', 'Study', 'Fitness', 'Work', 'Personal', 'Creative', 'Deep Work'];
  const habitIcons = ['⚡', '🔥', '💧', '🏃', '📚', '🧘', '💻', '🎨', '🥗', '🌙'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border-4 border-[#e5e5e5] shadow-2xl p-6 sm:p-8 transform animate-scaleUp max-h-[90vh] overflow-y-auto">
        
        {/* Header & Mode Switch */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{mode === 'quest' ? '⚔️' : '🔥'}</span>
            <h2 className="font-['Feather_Bold'] text-2xl text-[var(--dark-blue)]">
              {mode === 'quest' ? 'FORGE MISSION' : 'FORGE HABIT'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#f0f0f0] text-[var(--gray-text)] hover:bg-[#e0e0e0] font-black text-sm flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-[#f7f7f7] p-1 rounded-2xl border-2 border-[#e5e5e5] mb-6">
          <button
            type="button"
            onClick={() => setMode('quest')}
            className={`flex-1 py-2 rounded-xl font-['Feather_Bold'] text-sm font-extrabold transition-all ${
              mode === 'quest'
                ? 'bg-white text-[var(--blue)] shadow-xs border border-[#b9e5fb]'
                : 'text-[var(--gray-light)] hover:text-[var(--gray-text)]'
            }`}
          >
            ⚔️ Tactical Quest
          </button>
          <button
            type="button"
            onClick={() => setMode('habit')}
            className={`flex-1 py-2 rounded-xl font-['Feather_Bold'] text-sm font-extrabold transition-all ${
              mode === 'habit'
                ? 'bg-white text-[var(--orange)] shadow-xs border border-[#ffd6a5]'
                : 'text-[var(--gray-light)] hover:text-[var(--gray-text)]'
            }`}
          >
            🔥 Daily Habit
          </button>
        </div>

        {/* Quest Form */}
        {mode === 'quest' ? (
          <form onSubmit={handleCreateQuest} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-[var(--gray-light)] mb-1">
                Mission Title
              </label>
              <input
                type="text"
                required
                value={questTitle}
                onChange={(e) => setQuestTitle(e.target.value)}
                placeholder="e.g. Build Auth Microservice, Complete 30m Run"
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#e5e5e5] focus:border-[var(--blue)] focus:outline-hidden font-bold text-sm text-[var(--dark-blue)]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[var(--gray-light)] mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                value={questDesc}
                onChange={(e) => setQuestDesc(e.target.value)}
                placeholder="Brief summary or tactical objectives"
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#e5e5e5] focus:border-[var(--blue)] focus:outline-hidden font-medium text-xs text-[var(--gray-text)]"
              />
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-black uppercase text-[var(--gray-light)] mb-1">
                Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['daily', 'bounty', 'epic'] as QuestCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
                    className={`py-2 px-3 rounded-xl border-2 text-xs font-['Feather_Bold'] capitalize font-bold transition-all ${
                      category === cat
                        ? 'border-[var(--blue)] bg-[#eef8ff] text-[var(--blue)]'
                        : 'border-[#e5e5e5] bg-white text-[var(--gray-text)] hover:bg-[#fafafa]'
                    }`}
                  >
                    {cat === 'daily' ? '📅 Daily' : cat === 'bounty' ? '🎯 Bounty' : '👑 Epic'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tag Selection */}
            <div>
              <label className="block text-xs font-black uppercase text-[var(--gray-light)] mb-1">
                Tag / Domain
              </label>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTag(t)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      tag === t
                        ? 'bg-[var(--dark-blue)] text-white'
                        : 'bg-[#f0f0f0] text-[var(--gray-text)] hover:bg-[#e5e5e5]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimated Duration */}
            <div>
              <label className="block text-xs font-black uppercase text-[var(--gray-light)] mb-1">
                Estimated Focus Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 25, 45, 60].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleDurationChange(m)}
                    className={`py-1.5 rounded-xl border-2 text-xs font-black transition-all ${
                      duration === m
                        ? 'border-[var(--orange)] bg-[#fff5ea] text-[var(--orange)]'
                        : 'border-[#e5e5e5] bg-white text-[var(--gray-text)]'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>

            {/* Reward yield preview */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f7f7f7] border-2 border-[#e5e5e5]">
              <span className="text-xs font-black uppercase text-[var(--gray-light)]">
                Bounty Reward:
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-[var(--blue)]">+{xpReward} XP</span>
                <span className="text-xs font-black text-[#d48806]">+{coinsReward} 🟡</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-12 bg-[var(--green)] hover:bg-[var(--green-hover)] text-white font-['Feather_Bold'] text-base font-black tracking-wider uppercase rounded-2xl border-b-4 border-[var(--green-shadow)] active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-md"
            >
              FORGE MISSION ⚔️
            </button>
          </form>
        ) : (
          /* Habit Form */
          <form onSubmit={handleCreateHabit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-[var(--gray-light)] mb-1">
                Habit Title
              </label>
              <input
                type="text"
                required
                value={habitTitle}
                onChange={(e) => setHabitTitle(e.target.value)}
                placeholder="e.g. Morning 20m Meditation, Drink 2L Water"
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#e5e5e5] focus:border-[var(--orange)] focus:outline-hidden font-bold text-sm text-[var(--dark-blue)]"
              />
            </div>

            {/* Habit Category */}
            <div>
              <label className="block text-xs font-black uppercase text-[var(--gray-light)] mb-1">
                Category
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['focus', 'vitality', 'mind', 'routine'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleHabitCategoryChange(c)}
                    className={`py-2 px-1 rounded-xl border-2 text-[11px] font-['Feather_Bold'] capitalize font-bold transition-all ${
                      habitCategory === c
                        ? 'border-[var(--orange)] bg-[#fff5ea] text-[var(--orange)]'
                        : 'border-[#e5e5e5] bg-white text-[var(--gray-text)]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-xs font-black uppercase text-[var(--gray-light)] mb-1">
                Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {habitIcons.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setHabitIcon(ic)}
                    className={`w-10 h-10 rounded-xl border-2 text-xl flex items-center justify-center transition-all ${
                      habitIcon === ic
                        ? 'border-[var(--orange)] bg-[#fff5ea] scale-110'
                        : 'border-[#e5e5e5] bg-white hover:bg-[#fafafa]'
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            {/* Yield preview */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f7f7f7] border-2 border-[#e5e5e5]">
              <span className="text-xs font-black uppercase text-[var(--gray-light)]">
                Daily Check-in Yield:
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-[var(--blue)]">+{habitXpYield} XP</span>
                <span className="text-xs font-black text-[#d48806]">+{habitCoinYield} 🟡</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-12 bg-[var(--orange)] hover:bg-[#e08500] text-white font-['Feather_Bold'] text-base font-black tracking-wider uppercase rounded-2xl border-b-4 border-[#c77700] active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-md"
            >
              FORGE HABIT 🔥
            </button>
          </form>
        )}

      </div>
    </div>
  );
};