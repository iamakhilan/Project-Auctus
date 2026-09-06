import React from 'react';
import { useGameState } from '../../context/GameStateContext';

export const RewardModal: React.FC = () => {
  const { claimModal, closeClaimModal } = useGameState();

  if (!claimModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={closeClaimModal} />
      <div className="relative w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-surface-container border border-accent/70 p-6 shadow-crown flex flex-col items-center text-center z-10 animate-slideUp overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="w-40 h-40 rounded-full bg-accent/25 blur-3xl absolute -top-10 pointer-events-none" />

        {/* Celebratory Icon Box */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary via-accent to-primary text-light flex items-center justify-center shadow-[0_0_20px_rgba(87,99,232,0.5)] mb-2 relative z-10">
          <span className="material-symbols-outlined text-[32px] fill-1">
            {claimModal.icon || 'celebration'}
          </span>
        </div>

        <span className="font-label-sm text-[11px] text-secondary uppercase font-black tracking-widest">
          {claimModal.subtitle || 'LOOT SECURED!'}
        </span>
        <h3 className="font-headline-sm text-base sm:text-lg font-extrabold text-light mt-0.5">
          {claimModal.title}
        </h3>
        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
          {claimModal.description}
        </p>

        {/* Reward Stat Strip */}
        {(claimModal.coins !== undefined || claimModal.xp !== undefined || claimModal.shards !== undefined) && (
          <div className="w-full mt-3 p-2.5 rounded-xl bg-surface-dim border border-outline-variant flex items-center justify-around">
            {claimModal.coins !== undefined && (
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-secondary text-[18px] fill-1">
                  monetization_on
                </span>
                <span className="font-headline-sm text-xs font-black text-light">
                  {claimModal.coins >= 0 ? `+${claimModal.coins}` : claimModal.coins} Coins
                </span>
              </div>
            )}

            {claimModal.xp !== undefined && (
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-accent text-[18px] fill-1">
                  bolt
                </span>
                <span className="font-headline-sm text-xs font-black text-secondary">
                  +{claimModal.xp} XP
                </span>
              </div>
            )}

            {claimModal.shards !== undefined && claimModal.shards > 0 && (
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-secondary text-[18px] fill-1">
                  diamond
                </span>
                <span className="font-headline-sm text-xs font-black text-secondary-light">
                  +{claimModal.shards} Shards
                </span>
              </div>
            )}
          </div>
        )}

        <button
          onClick={closeClaimModal}
          className="btn btn-primary w-full mt-4 h-12 font-headline-sm text-xs uppercase tracking-wider font-black shadow-md"
        >
          Equip & Continue
        </button>
      </div>
    </div>
  );
};