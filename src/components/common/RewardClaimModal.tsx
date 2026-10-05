import React, { useEffect } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { ClaimModalData } from '../../types';
import { soundEngine } from '../../utils/audioSynthesizer';
import { triggerConfetti } from '../../utils/confetti';

interface RewardClaimModalProps {
  data: ClaimModalData;
  onClose: () => void;
}

export const RewardClaimModal: React.FC<RewardClaimModalProps> = ({ data, onClose }) => {
  const panelRef = useFocusTrap<HTMLDivElement>(data.isOpen, onClose);
  useEffect(() => {
    if (data.isOpen) {
      soundEngine.playLevelUp();
      triggerConfetti();
    }
  }, [data.isOpen]);

  if (!data.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn" role="presentation" onClick={onClose}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Reward Claimed" className="relative w-full max-w-md bg-white rounded-3xl border-4 border-[#e5e5e5] shadow-2xl p-6 sm:p-8 text-center transform transition-all animate-scaleUp" onClick={(e) => e.stopPropagation()}>
        
        {/* Glow effect & Icon */}
        <div className="relative mx-auto w-24 h-24 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[var(--golden)]/30 blur-xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-3xl bg-[var(--golden)] border-b-6 border-[#d48806] flex items-center justify-center text-4xl shadow-md">
            {data.icon || '🎁'}
          </div>
        </div>

        {/* Title & Subtitle */}
        <h2 className="font-['Feather_Bold'] text-2xl sm:text-3xl text-[var(--dark-blue)] tracking-wide mb-1">
          {data.title || 'Victory Achieved!'}
        </h2>
        {data.subtitle && (
          <p className="text-sm sm:text-base font-extrabold text-[var(--gray-light)] mb-4">
            {data.subtitle}
          </p>
        )}

        {data.description && (
          <p className="text-xs sm:text-sm font-semibold text-[var(--gray-text)] bg-[#f7f7f7] p-3 rounded-2xl border-2 border-[#e5e5e5] mb-6">
            {data.description}
          </p>
        )}

        {/* Reward Pills Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
          {/* XP */}
          <div className="p-3 bg-[#eef8ff] border-2 border-[#b9e5fb] rounded-2xl text-center">
            <span className="text-xl sm:text-2xl block mb-1">⚡</span>
            <span className="font-['Feather_Bold'] text-base sm:text-lg font-black text-[var(--blue)] block">
              +{data.xp ?? 0}
            </span>
            <span className="text-[10px] font-extrabold uppercase text-[var(--gray-light)]">XP</span>
          </div>

          {/* Coins */}
          <div className="p-3 bg-[#fffbe6] border-2 border-[#ffe58f] rounded-2xl text-center">
            <span className="text-xl sm:text-2xl block mb-1">🟡</span>
            <span className="font-['Feather_Bold'] text-base sm:text-lg font-black text-[#d48806] block">
              +{data.coins ?? 0}
            </span>
            <span className="text-[10px] font-extrabold uppercase text-[var(--gray-light)]">Coins</span>
          </div>

          {/* Gems */}
          <div className="p-3 bg-[#fdf2f8] border-2 border-[#fbcfe8] rounded-2xl text-center">
            <span className="text-xl sm:text-2xl block mb-1">💎</span>
            <span className="font-['Feather_Bold'] text-base sm:text-lg font-black text-[#db2777] block">
              +{data.gems ?? 0}
            </span>
            <span className="text-[10px] font-extrabold uppercase text-[var(--gray-light)]">Gems</span>
          </div>
        </div>

        {/* Claim Button */}
        <button
              type="button"
          onClick={() => {
            soundEngine.playCoinCollect();
            onClose();
          }}
          className="w-full h-14 bg-[var(--green)] hover:bg-[var(--green-hover)] text-white font-['Feather_Bold'] text-lg font-black tracking-wider uppercase rounded-2xl border-b-6 border-[var(--green-shadow)] active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-lg"
        >
          AWESOME!
        </button>

      </div>
    </div>
  );
};