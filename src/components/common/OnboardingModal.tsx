import React from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { soundEngine } from '../../utils/audioSynthesizer';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const panelRef = useFocusTrap<HTMLDivElement>(isOpen, onClose);
  if (!isOpen) return null;

  const features = [
    {
      icon: '⚔️',
      title: 'Tactical Missions & Habits',
      desc: 'Complete Daily Quests, Bounties, and Epic Missions. Maintain daily streaks for exponential multipliers.',
      badge: 'Progression',
      bg: 'bg-[#eef8ff]',
      border: 'border-[#b9e5fb]',
    },
    {
      icon: '⏱️',
      title: 'Focus Combat Arena',
      desc: 'Fight procrastination bosses with Pomodoro Deep Work sessions. Overcharge mana for +50% loot boosts.',
      badge: 'Deep Work',
      bg: 'bg-[#fff5ea]',
      border: 'border-[#ffd6a5]',
    },
    {
      icon: '📦',
      title: 'Vault Loot & Real Rewards',
      desc: 'Unlock 4-slot timed chests (Bronze to Mythic) and redeem Gold Coins in the Bazaar for custom real-life rewards.',
      badge: 'Economy',
      bg: 'bg-[#fffbe6]',
      border: 'border-[#ffe58f]',
    },
    {
      icon: '🏰',
      title: 'Citadel Ascension & Trophies',
      desc: 'Upgrade your citadel tier, earn 15+ achievement trophies, and enjoy permanent productivity perks.',
      badge: 'Prestige',
      bg: 'bg-[#f5f3ff]',
      border: 'border-[#ddd6fe]',
    },
  ];

  const handleStart = () => {
    soundEngine.playSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" role="presentation" onClick={onClose}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Welcome to Auctus" className="relative w-full max-w-2xl bg-white rounded-3xl border-4 border-[#e5e5e5] shadow-2xl p-6 sm:p-8 text-center max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-[var(--green)] border-b-4 border-[var(--green-shadow)] flex items-center justify-center text-3xl shadow-sm">
          ⚡
        </div>
        <h2 className="font-['Feather_Bold'] text-2xl sm:text-3xl text-[var(--dark-blue)] tracking-wide mb-1">
          WELCOME TO AUCTUS
        </h2>
        <p className="text-sm sm:text-base font-extrabold text-[var(--gray-light)] mb-6">
          Level up your real-life productivity with RPG game mechanics!
        </p>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 text-left">
          {features.map((f, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl border-2 ${f.bg} ${f.border} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{f.icon}</span>
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-white/80 text-[var(--dark-blue)] border border-black/5">
                    {f.badge}
                  </span>
                </div>
                <h3 className="font-['Feather_Bold'] text-base text-[var(--dark-blue)] mb-1">
                  {f.title}
                </h3>
                <p className="text-xs text-[var(--gray-text)] font-semibold leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
              type="button"
          onClick={handleStart}
          className="w-full h-14 bg-[var(--green)] hover:bg-[var(--green-hover)] text-white font-['Feather_Bold'] text-lg font-black tracking-wider uppercase rounded-2xl border-b-6 border-[var(--green-shadow)] active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-lg"
        >
          LET'S CRUSH TODAY! 🚀
        </button>

      </div>
    </div>
  );
};