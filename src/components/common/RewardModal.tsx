import React from 'react';
import { useGameState } from '../../context/GameStateContext';

export const RewardModal: React.FC = () => {
  const { claimModal, closeClaimModal } = useGameState();

  if (!claimModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-surface-container-high to-surface-container-low border-2 border-amber-400/80 p-6 shadow-crown flex flex-col items-center text-center relative overflow-hidden animate-scaleUp">
        {/* Glow Ray Background Flare */}
        <div className="w-48 h-48 rounded-full bg-amber-400/25 blur-3xl absolute -top-12 pointer-events-none" />

        {/* Celebratory Icon Box */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-500 border border-yellow-200 text-[#3d1a00] flex items-center justify-center shadow-[0_0_25px_rgba(251,191,36,0.6)] mb-3 relative z-10">
          <span className="material-symbols-outlined text-[36px] fill-1">
            {claimModal.icon || 'celebration'}
          </span>
        </div>

        {/* Subtitle & Title */}
        <span className="font-label-sm text-label-sm text-amber-300 uppercase font-black tracking-widest">
          {claimModal.subtitle || 'LOOT SECURED!'}
        </span>
        <h3 className="font-headline-md text-headline-md font-extrabold text-white mt-1 drop-shadow">
          {claimModal.title}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2 leading-relaxed">
          {claimModal.description}
        </p>

        {/* Reward Stat Cards */}
        {(claimModal.coins !== undefined || claimModal.xp !== undefined || claimModal.shards !== undefined) && (
          <div className="w-full mt-4 p-2.5 rounded-control bg-surface-dim border border-outline-variant flex items-center justify-around shadow-inset-well">
            {claimModal.coins !== undefined && (
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-400 text-[20px] fill-1">
                  monetization_on
                </span>
                <span className="font-label-md text-body-sm font-extrabold text-amber-300">
                  {claimModal.coins >= 0 ? `+${claimModal.coins}` : claimModal.coins} Coins
                </span>
              </div>
            )}

            {claimModal.xp !== undefined && (
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-400 text-[20px] fill-1">
                  bolt
                </span>
                <span className="font-label-md text-body-sm font-extrabold text-emerald-300">
                  +{claimModal.xp} XP
                </span>
              </div>
            )}

            {claimModal.shards !== undefined && claimModal.shards > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sky-400 text-[20px] fill-1">
                  diamond
                </span>
                <span className="font-label-md text-body-sm font-extrabold text-sky-300">
                  +{claimModal.shards} Shards
                </span>
              </div>
            )}
          </div>
        )}

        {/* 3D Action Button */}
        <button
          onClick={closeClaimModal}
          className="btn btn-gold w-full mt-5 h-12 font-headline-sm text-headline-sm uppercase tracking-wider"
        >
          EQUIP & CONTINUE
        </button>
      </div>
    </div>
  );
};