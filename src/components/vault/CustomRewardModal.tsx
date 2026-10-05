import React, { useEffect, useState } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useGameState } from '../../context/GameStateContext';
import { soundEngine } from '../../utils/audioSynthesizer';
import { sanitize } from '../../utils/validators';

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

  const panelRef = useFocusTrap<HTMLDivElement>(isOpen, onClose);
  const [titleError, setTitleError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) setTitleError(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setTitleError('Please enter a reward title.'); return; }
    setTitleError(null);

    soundEngine.playSuccess();
    createCustomReward(
      sanitize(title.trim()),
      cost,
      category,
      icon,
      sanitize(description.trim() || 'Custom personal reward')
    );

    setTitle('');
    setDescription('');
    onClose();
  };

  const icons = ['🎮', '🍕', '☕', '🍿', '🛍️', '📚', '🏖️', '🎬', '🍦', '🚴'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn" role="presentation" onClick={onClose}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Forge Reward" className="relative w-full max-w-md max-h-[90vh] bg-white rounded-3xl border-4 border-[#e5e5e5] shadow-2xl overflow-y-auto animate-scaleUp modal-mobile-full" onClick={(e) => e.stopPropagation()}>
       
        {/* Header */}
        <div className="flex items-center justify-between mb-4 p-4 sm:p-5 border-b-2 border-[#f0f0f0] sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            <h2 className="font-['Feather_Bold'] text-xl sm:text-2xl text-[var(--dark-blue)]">
              FORGE REWARD
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 rounded-xl bg-[#f0f0f0] text-[var(--gray-text)] hover:bg-[#e0e0e0] font-black text-sm flex items-center justify-center cursor-pointer touch-target shrink-0"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          <div>
            <label htmlFor="custom-reward-title" className="block text-xs font-black uppercase text-[var(--gray-light)] mb-1">
              Reward Title
            </label>
            <input
              type="text"
              id="custom-reward-title"
              maxLength={60}
              required
              value={title}
              onChange={(e) => { setTitle(e.target.value); if (titleError) setTitleError(null); }}
              placeholder="e.g. 1 Hour Video Games, Boba Tea"
              aria-invalid={!!titleError}
              aria-describedby={titleError ? "custom-reward-title-error" : undefined}
              className={`w-full px-4 py-2.5 rounded-2xl border-2 focus:outline-hidden font-bold text-sm text-[var(--dark-blue)] touch-target ${titleError ? 'border-[var(--red)] bg-[#ffeef0]' : 'border-[#e5e5e5] focus:border-[#d48806]'}`}
            />
            {titleError && <p id="custom-reward-title-error" className="text-xs font-bold text-[var(--red)] mt-1" role="alert">{titleError}</p>}
            <div className="text-[11px] font-bold text-[var(--gray-light)] text-right mt-1">{title.length}/60</div>
          </div>

          <div>
            <label htmlFor="custom-reward-cost" className="block text-xs font-black uppercase text-[var(--gray-light)] mb-1">
              Cost in Gold Coins (🟡)
            </label>
            <input
              id="custom-reward-cost"
              type="number"
              min="10"
              max="5000"
              step="10"
              required
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#e5e5e5] focus:border-[#d48806] focus:outline-hidden font-bold text-sm text-[var(--dark-blue)] touch-target"
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
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                  className={`py-2 px-1 rounded-xl border-2 text-[11px] font-['Feather_Bold'] font-bold transition-all touch-target ${
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
                  aria-pressed={icon === ic}
                  onClick={() => setIcon(ic)}
                  className={`w-10 h-10 rounded-xl border-2 text-lg flex items-center justify-center transition-all touch-target ${
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
            <label htmlFor="custom-reward-desc" className="block text-xs font-black uppercase text-[var(--gray-light)] mb-1">
              Description
            </label>
            <input
              type="text"
              id="custom-reward-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Unwind without guilt after 2 hours of focus"
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#e5e5e5] focus:border-[#d48806] focus:outline-hidden font-medium text-xs text-[var(--gray-text)] touch-target"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-[#d48806] hover:bg-[#b57404] text-white font-['Feather_Bold'] text-base font-black tracking-wider uppercase rounded-2xl border-b-4 border-[#8c5900] active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-md touch-target"
          >
            FORGE REWARD 🎁
          </button>
        </form>

      </div>
    </div>
  );
};