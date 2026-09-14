import React, { useState } from 'react';
import { requestNotificationPermission, isNotificationSupported } from '../../services/notifications';

interface OnboardingModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

const ONBOARDING_STORAGE_KEY = 'auctus_onboarded_v2';

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ forceOpen = false, onClose }) => {
  const [hasDismissed, setHasDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(localStorage.getItem(ONBOARDING_STORAGE_KEY));
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const isOpen = forceOpen || !hasDismissed;

  const handleFinish = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    setHasDismissed(true);
    setCurrentStep(0);
    if (onClose) onClose();
  };

  const handleEnableNotifications = async () => {
    const perm = await requestNotificationPermission();
    if (perm === 'granted') {
      setNotificationsEnabled(true);
    }
  };

  if (!isOpen) return null;

  const steps = [
    {
      stepNumber: 1,
      badge: 'COMMANDER DIRECTIVE',
      title: 'Welcome to AUCTUS',
      subtitle: 'The Personal RPG Productivity Citadel',
      icon: 'military_tech',
      description:
        'Transform your daily grind into an epic personal progression campaign. Level up your commander, earn Auctus Coins, forge legendary streaks, and unlock new Citadel tiers.',
      highlights: [
        { icon: 'bolt', title: 'XP & Progression', text: 'Earn experience from every task and focus block to level up.' },
        { icon: 'local_fire_department', title: 'Streak Flame', text: 'Stay consistent to build powerful multipliers and unlock rewards.' },
        { icon: 'shield', title: 'Local-First Safety', text: 'All your data stays private and safe directly in your browser.' },
      ],
    },
    {
      stepNumber: 2,
      badge: 'MISSION PROTOCOL',
      title: 'Quests & Habit Forge',
      subtitle: 'Forge Daily Habits and Conquer Strategic Bounties',
      icon: 'assignment',
      description:
        'Manage urgent objectives with priority sorting and categorize your habits. Claim milestone rewards at 3, 7, 14, 21, and 30 consecutive days.',
      highlights: [
        { icon: 'flag', title: 'Mission Categories', text: 'Organize by Daily, Main Campaign, Bounties, and Urgent tasks.' },
        { icon: 'repeat', title: 'Habit Milestones', text: 'Build iron-clad habits with progressive streak yields.' },
        { icon: 'category', title: 'Custom Tags', text: 'Filter effortlessly by Coding, Fitness, Learning, and Deep Work.' },
      ],
    },
    {
      stepNumber: 3,
      badge: 'WARP ENGINE',
      title: 'Focus Arena & Soundscapes',
      subtitle: 'Resilient Timers & Immersive Audio Fields',
      icon: 'timer',
      description:
        'Execute deep work sessions with timestamp-backed timers that never lose track of time even if you refresh or switch tabs. Layer procedural audio to block external noise.',
      highlights: [
        { icon: 'hourglass_top', title: 'Timestamp Engine', text: 'Precision wall-clock time tracking across page reloads.' },
        { icon: 'headphones', title: 'Procedural Soundscapes', text: 'Cyber Rain, Deep Space, and Ancient Forest white-noise generators.' },
        { icon: 'lock_reset', title: 'Break Cycles', text: 'Built-in Pomodoro cycles with short and long rest recovery phases.' },
      ],
    },
    {
      stepNumber: 4,
      badge: 'CITADEL ASCENSION',
      title: 'Treasury, Chests & Ascension',
      subtitle: 'Loot Deck Probabilities & 15+ Achievements',
      icon: 'castle',
      description:
        'Unlock time-locked loot chests with drop rates, spend gold in the Treasury, unlock rare achievements, and ascend the 5 Citadel Tiers to earn legendary titles.',
      highlights: [
        { icon: 'inventory_2', title: 'Chest Loot System', text: 'Open Bronze, Silver, Gold, and Mythic chests for gold and shards.' },
        { icon: 'storefront', title: 'Treasury Vault', text: 'Redeem real-world custom rewards and productivity buffs.' },
        { icon: 'workspace_premium', title: 'Citadel Tiers', text: 'Ascend from Genesis Outpost to Celestial Apex with passive XP perks.' },
      ],
    },
  ];

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn text-white">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-game-panel border-2 border-gold-dark shadow-game-modal flex flex-col custom-scrollbar animate-slideUp">
        {/* Top Gold Highlight Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-gold-dark via-gold-accent to-gold-dark" />

        {/* Content Container */}
        <div className="p-5 sm:p-6 flex flex-col gap-4 sm:gap-5">
          {/* Top Bar with Step Indicators */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-gold-dark/30 border border-gold-dark/50 text-gold-light text-[10px] font-black tracking-widest uppercase">
                {step.badge}
              </span>
              <span className="text-gray-400 text-xs font-bold">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>

            <button
              onClick={handleFinish}
              className="text-gray-400 hover:text-white text-xs font-black uppercase tracking-wider transition-colors px-2 py-1 rounded-lg hover:bg-game-darker"
            >
              Skip Intro
            </button>
          </div>

          {/* Title & Subtitle */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-11 h-11 rounded-xl bg-game-darker border-2 border-gold-dark flex items-center justify-center text-gold-accent shadow-game-sm">
                <span className="material-symbols-outlined text-[24px]">
                  {step.icon}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-wide">
                {step.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gold-accent font-bold pl-1">
              {step.subtitle}
            </p>
            <p className="text-xs sm:text-sm text-gray-300 font-medium mt-2 pl-1 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {step.highlights.map((h, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-game-darker border-2 border-game-border flex flex-col gap-1.5 shadow-game-card hover:border-gold-accent/50 transition-colors"
              >
                <div className="flex items-center gap-2 text-gold-accent">
                  <span className="material-symbols-outlined text-[20px]">
                    {h.icon}
                  </span>
                  <span className="text-xs font-black text-white">
                    {h.title}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-medium leading-snug">
                  {h.text}
                </p>
              </div>
            ))}
          </div>

          {/* Optional Permission Banner */}
          {currentStep === 2 && isNotificationSupported() && (
            <div className="p-3.5 rounded-2xl bg-game-darker border-2 border-blue-500/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-blue-400 text-[22px]">
                  notifications_active
                </span>
                <div className="text-xs">
                  <p className="text-white font-black">Enable Session Notifications</p>
                  <p className="text-gray-400">Get alerted when your focus timer finishes.</p>
                </div>
              </div>
              <button
                onClick={handleEnableNotifications}
                disabled={notificationsEnabled}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  notificationsEnabled
                    ? 'btn-game-dark text-gray-400'
                    : 'btn-game-blue text-white'
                }`}
              >
                {notificationsEnabled ? 'Enabled ✓' : 'Enable Alerts'}
              </button>
            </div>
          )}

          {/* Step Progression Dots & Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t-2 border-game-border">
            {/* Step Indicators */}
            <div className="flex items-center gap-1.5">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === currentStep
                      ? 'w-7 bg-gold-accent shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                      : 'w-2.5 bg-game-darker border border-game-border hover:bg-gray-600'
                  }`}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2.5">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="btn-game-dark px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-gray-300 hover:text-white"
                >
                  Back
                </button>
              )}

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="btn-game-green px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-game-btn active:scale-95 text-white"
                >
                  Next
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  className="btn-game-gold px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-game-btn active:scale-95 text-game-darker"
                >
                  Enter AUCTUS
                  <span className="material-symbols-outlined text-[16px]">
                    rocket_launch
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
