import React from 'react';
import { useGameState } from '../../context/GameStateContext';
import { CoinIcon, GemIcon } from './GameIcons';

export const RewardModal: React.FC = () => {
  const { claimModal, closeClaimModal } = useGameState();

  if (!claimModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="absolute inset-0" onClick={closeClaimModal} />
      
      <div className="relative w-full max-w-sm rounded-3xl bg-game-card border-2 border-gold shadow-game-card-raised p-5 flex flex-col items-center text-center z-10 animate-scaleUp overflow-hidden">
        {/* Top Gold Halo Glow */}
        <div className="w-48 h-48 rounded-full bg-gold/20 blur-3xl absolute -top-16 pointer-events-none" />

        {/* Ribbon Header Plate */}
        <div className="relative -mt-8 mb-2 px-6 py-1.5 rounded-xl bg-gradient-to-b from-gold-light via-gold to-gold-dark text-game-darkest font-game text-xs font-black uppercase tracking-widest border-2 border-yellow-200 shadow-game-btn-gold">
          {claimModal.subtitle || 'VICTORY REWARD'}
        </div>

        {/* Celebratory Icon Box */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-blue-light via-blue to-blue-dark text-white flex items-center justify-center shadow-blue-glow mb-2 relative z-10 border-2 border-blue-light">
          <span className="material-symbols-outlined text-[34px] fill-1 drop-shadow">
            {claimModal.icon || 'military_tech'}
          </span>
        </div>

        <h3 className="font-game text-base sm:text-lg font-black text-game-text mt-1 uppercase tracking-tight">
          {claimModal.title}
        </h3>
        <p className="font-body text-xs text-game-muted mt-1 leading-relaxed px-2">
          {claimModal.description}
        </p>

        {/* Reward Items Box */}
        {(claimModal.coins !== undefined || claimModal.xp !== undefined || claimModal.shards !== undefined) && (
          <div className="w-full mt-3 p-3 rounded-2xl bg-game-darkest border border-game-border flex items-center justify-around gap-2 shadow-inner">
            {claimModal.coins !== undefined && (
              <div className="flex flex-col items-center gap-1">
                <CoinIcon size={24} />
                <span className="font-game text-xs font-black text-amber-300">
                  {claimModal.coins >= 0 ? `+${claimModal.coins}` : claimModal.coins}
                </span>
                <span className="text-[10px] text-game-dim font-bold uppercase">Coins</span>
              </div>
            )}

            {claimModal.xp !== undefined && (
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-blue/30 border border-blue flex items-center justify-center text-blue-light">
                  <span className="material-symbols-outlined text-[16px] fill-1">bolt</span>
                </div>
                <span className="font-game text-xs font-black text-blue-light">
                  +{claimModal.xp}
                </span>
                <span className="text-[10px] text-game-dim font-bold uppercase">XP</span>
              </div>
            )}

            {claimModal.shards !== undefined && claimModal.shards > 0 && (
              <div className="flex flex-col items-center gap-1">
                <GemIcon size={24} />
                <span className="font-game text-xs font-black text-cyan-300">
                  +{claimModal.shards}
                </span>
                <span className="text-[10px] text-game-dim font-bold uppercase">Gems</span>
              </div>
            )}
          </div>
        )}

        <button
          onClick={closeClaimModal}
          className="btn-game btn-game-green w-full mt-4 h-12 font-game text-sm uppercase tracking-wider font-black"
        >
          CLAIM REWARD
        </button>
      </div>
    </div>
  );
};