import React from 'react';
import { useGameState } from '../../context/GameStateContext';

export const RewardModal: React.FC = () => {
  const { claimModal, closeClaimModal } = useGameState();

  if (!claimModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#040a16]/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#173264] to-[#0c1c38] border-2 border-amber-400/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(245,158,11,0.35)] flex flex-col items-center text-center relative overflow-hidden transform animate-scaleUp">
        {/* Glow Ray Background Flare */}
        <div className="w-48 h-48 rounded-full bg-amber-400/25 blur-3xl absolute -top-12 pointer-events-none" />

        {/* Celebratory Icon Box */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-500 border border-yellow-200 text-[#3d1a00] flex items-center justify-center shadow-[0_0_25px_rgba(251,191,36,0.6)] mb-3 relative z-10">
          <span className="material-symbols-outlined text-[36px] fill-1">
            {claimModal.icon || 'celebration'}
          </span>
        </div>

        {/* Subtitle & Title */}
        <span className="font-label-sm text-[11px] text-amber-300 uppercase font-black tracking-widest">
          {claimModal.subtitle || 'LOOT SECURED!'}
        </span>
        <h3 className="font-headline-md font-extrabold text-[22px] text-white mt-1 drop-shadow">
          {claimModal.title}
        </h3>
        <p className="font-body-md text-on-surface-variant mt-2 text-[14px] leading-relaxed">
          {claimModal.description}
        </p>

        {/* Reward Stat Cards */}
        {(claimModal.coins !== undefined || claimModal.xp !== undefined || claimModal.shards !== undefined) && (
          <div className="w-full mt-4 p-2.5 rounded-xl bg-[#08152c] border border-[#1e3c73] flex items-center justify-around shadow-inner">
            {claimModal.coins !== undefined && (
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-400 text-[20px] fill-1">
                  monetization_on
                </span>
                <span className="font-label-md font-extrabold text-amber-300 text-[14px]">
                  {claimModal.coins >= 0 ? `+${claimModal.coins}` : claimModal.coins} Coins
                </span>
              </div>
            )}

            {claimModal.xp !== undefined && (
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-400 text-[20px] fill-1">
                  bolt
                </span>
                <span className="font-label-md font-extrabold text-emerald-300 text-[14px]">
                  +{claimModal.xp} XP
                </span>
              </div>
            )}

            {claimModal.shards !== undefined && claimModal.shards > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sky-400 text-[20px] fill-1">
                  diamond
                </span>
                <span className="font-label-md font-extrabold text-sky-300 text-[14px]">
                  +{claimModal.shards} Shards
                </span>
              </div>
            )}
          </div>
        )}

        {/* 3D Action Button */}
        <button
          onClick={closeClaimModal}
          className="w-full mt-5 py-3.5 rounded-xl bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-500 text-[#3d1a00] font-headline-sm font-black text-[15px] uppercase tracking-wider border-t border-yellow-100 shadow-[0_4px_0_#9a6200,0_8px_18px_rgba(245,158,11,0.5)] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
        >
          EQUIP & CONTINUE
        </button>
      </div>
    </div>
  );
};
