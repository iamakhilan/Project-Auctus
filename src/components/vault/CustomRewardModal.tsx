import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { soundEngine } from '../../utils/audioSynthesizer';

interface CustomRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomRewardModal: React.FC<CustomRewardModalProps> = ({ isOpen, onClose }) => {
  const { createCustomReward } = useGameState();

  const [title, setTitle] = useState('');
  const [cost, setCost] = useState(200);
  const [category, setCategory] = useState('Leisure');
  const [icon, setIcon] = useState('🎮');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    soundEngine.playSuccess();
    createCustomReward(
      title.trim(),
      cost,
      category,
      icon,
      description.trim() || 'Custom personal reward'
    );

    setTitle('');
    setDescription('');
    onClose();
  };

  const icons = ['🎮', '🍕', '☕', '🍿', '🛍️', '📚', '🏖️', '🎬', '🍦', '🚴'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl border-4 border-[#e5e5e5] shadow-2xl p-6 sm:p-8 transform animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            <h2 className="font-['Feather_Bold'] text-2xl text-[var(--dark-blue)]">
              FORGE REWARD
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#f0f0f0] text-[var(--gray-text)] hover:bg-[#e0e0e0] font-black text-sm flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-[var(--gray-light)] mb-1">
              Reward Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 1 Hour Video Games, Boba Tea"
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#e5e5e5] focus:border-[#d48806] focus:outline-hidden font-bold text-sm text-[var(--dark-blue)]"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[var(--gray-light)] mb-1">
              Cost in Gold Coins (🟡)
            </label>
            <input
              type="number"
              min="10"
              max="10000"
              step="10"
              required
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#e5e5e5] focus:border-[#d48806] focus:outline-hidden font-bold text-sm text-[var(--dark-blue)]"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[var(--gray-light)] mb-1">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Leisure', 'Food & Treat', 'Entertainment'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`py-2 px-1 rounded-xl border-2 text-[11px] font-['Feather_Bold'] font-bold transition-all ${
                    category === c
                      ? 'border-[#d48806] bg-[#fffbe6] text-[#d48806]'
                      : 'border-[#e5e5e5] bg-white text-[var(--gray-text)]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[var(--gray-light)] mb-1">
              Emoji Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {icons.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`w-9 h-9 rounded-xl border-2 text-lg flex items-center justify-center transition-all ${
                    icon === ic
                      ? 'border-[#d48806] bg-[#fffbe6] scale-110'
                      : 'border-[#e5e5e5] bg-white hover:bg-[#fafafa]'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[var(--gray-light)] mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Unwind without guilt after 2 hours of focus"
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#e5e5e5] focus:border-[#d48806] focus:outline-hidden font-medium text-xs text-[var(--gray-text)]"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-[#d48806] hover:bg-[#b57404] text-white font-['Feather_Bold'] text-base font-black tracking-wider uppercase rounded-2xl border-b-4 border-[#8c5900] active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-md"
          >
            FORGE REWARD 🎁
          </button>
        </form>

      </div>
    </div>
  );
};