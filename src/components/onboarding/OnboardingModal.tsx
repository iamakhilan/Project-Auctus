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
      badge: 'SYSTEM DIRECTIVE',
      title: 'Welcome to AUCTUS',
      subtitle: 'The Personal RPG Productivity Citadel',
      icon: 'military_tech',
      accentColor: 'from-primary to-accent',
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
      accentColor: 'from-secondary to-accent',
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
      accentColor: 'from-accent to-primary',
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
      accentColor: 'from-primary to-secondary',
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-surface-container border border-outline-variant shadow-crown flex flex-col custom-scrollbar animate-slideUp">
        {/* Top Header Glow Bar */}
        <div className={`h-2 w-full bg-gradient-to-r ${step.accentColor}`} />

        {/* Content Container */}
        <div className="p-5 sm:p-7 flex flex-col gap-4 sm:gap-6">
          {/* Top Bar with Step Indicators */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-primary/30 border border-secondary/40 text-light font-label-sm text-xs font-extrabold tracking-wider uppercase">
                {step.badge}
              </span>
              <span className="text-on-surface-variant font-label-sm text-label-sm">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>

            <button
              onClick={handleFinish}
              className="text-on-surface-variant hover:text-on-surface text-sm font-medium transition-colors"
            >
              Skip Intro
            </button>
          </div>

          {/* Title & Subtitle */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.accentColor} flex items-center justify-center text-light shadow-md`}>
                <span className="material-symbols-outlined text-[24px] font-bold">
                  {step.icon}
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md font-black text-on-surface">
                {step.title}
              </h2>
            </div>
            <p className="font-title-sm text-secondary font-semibold pl-1">
              {step.subtitle}
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2 pl-1 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {step.highlights.map((h, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-surface-container border border-outline-variant flex flex-col gap-1.5 shadow-sm hover:border-accent/40 transition-colors"
              >
                <div className="flex items-center gap-2 text-secondary">
                  <span className="material-symbols-outlined text-[20px]">
                    {h.icon}
                  </span>
                  <span className="font-label-md text-label-md font-bold text-on-surface">
                    {h.title}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                  {h.text}
                </p>
              </div>
            ))}
          </div>

          {/* Step 3 or 4 Optional Permission Banner */}
          {currentStep === 2 && isNotificationSupported()}
          {currentStep === 2 && isNotificationSupported() && (
            <div className="p-3.5 rounded-xl bg-navy-hi border border-accent/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  notifications_active
                </span>
                <div className="text-xs">
                  <p className="text-light font-bold">Enable Session Notifications</p>
                  <p className="text-secondary">Get alerted when your focus timer finishes.</p>
                </div>
              </div>
              <button
                onClick={handleEnableNotifications}
                disabled={notificationsEnabled}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  notificationsEnabled
                    ? 'bg-primary/40 text-light border border-secondary/40'
                    : 'btn-primary'
                }`}
              >
                {notificationsEnabled ? 'Enabled ✓' : 'Enable Alerts'}
              </button>
            </div>
          )}

          {/* Step Progression Dots & Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-outline-variant">
            {/* Step Indicators */}
            <div className="flex items-center gap-1.5">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentStep ? 'w-8 bg-accent shadow-accent-aura' : 'w-2 bg-outline-variant hover:bg-on-surface-variant'
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
                  className="px-4 py-2 rounded-xl bg-surface-container border border-outline-variant text-on-surface hover:text-light text-sm font-bold transition-all"
                >
                  Back
                </button>
              )}

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="btn btn-primary px-5 py-2.5 rounded-xl text-light font-bold text-sm shadow-md transition-all flex items-center gap-1.5"
                >
                  Next
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  className="btn btn-primary px-6 py-2.5 rounded-xl text-light font-black text-sm shadow-md transition-all flex items-center gap-2"
                >
                  Enter AUCTUS
                  <span className="material-symbols-outlined text-[18px]">
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
