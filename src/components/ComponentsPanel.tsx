import React, { useState } from 'react';

export const ComponentsPanel: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animEnabled, setAnimEnabled] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmailInput('');
      setSubscribed(false);
    }, 2500);
  };

  return (
    <section id="components" className="duo-panel duo-panel-odd bg-white">
      <div className="section-label-light">07 / Components</div>

      <div className="flex flex-col gap-5">
        {/* Group 1: Badges */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--nav-text)]">
            Badges
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-[20px] text-[12px] font-bold uppercase text-[var(--green)] bg-[rgba(88,204,2,0.12)]">
              COMPLETED
            </span>
            <span className="px-2.5 py-1 rounded-[20px] text-[12px] font-bold uppercase text-[var(--blue)] bg-[rgba(28,176,246,0.12)]">
              IN PROGRESS
            </span>
            <span className="px-2.5 py-1 rounded-[20px] text-[12px] font-bold uppercase text-[var(--red)] bg-[rgba(255,75,75,0.12)]">
              FAILED
            </span>
            <span className="px-2.5 py-1 rounded-[20px] text-[12px] font-bold uppercase text-[var(--orange)] bg-[rgba(255,150,0,0.12)]">
              STREAK
            </span>
            <span className="px-2.5 py-1 rounded-[20px] text-[12px] font-bold uppercase text-[#b8920f] bg-[rgba(255,200,0,0.15)]">
              PREMIUM
            </span>
          </div>
        </div>

        {/* Group 2: Input + Button */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--nav-text)]">
            Input + Action
          </span>
          <form onSubmit={handleSubscribe} className="flex max-[600px]:flex-col items-center gap-3">
            <input
              type="email"
              required
              placeholder="Enter your email..."
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="flex-1 max-[600px]:w-full h-[48px] px-4 rounded-[12px] border-2 border-[var(--border-color)] text-[15px] font-semibold text-[var(--gray-text)] placeholder:text-[var(--nav-text)] placeholder:font-medium focus:outline-none focus:border-[var(--blue)] transition-colors"
            />
            <button
              type="submit"
              className="duo-btn h-[48px] px-6 text-[15px] text-white bg-[var(--green)] hover:bg-[var(--green-hover)] shadow-[0_4px_0_var(--green-shadow)] max-[600px]:w-full"
            >
              {subscribed ? 'SUBSCRIBED ✓' : 'SUBSCRIBE'}
            </button>
          </form>
        </div>

        {/* Group 3: Toggle Switches */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--nav-text)]">
            Toggles
          </span>
          <div className="flex items-center gap-6 flex-wrap">
            {/* Toggle 1: Sound effects */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-[48px] h-[28px] rounded-[14px] transition-colors duration-200 relative p-[3px] ${
                  soundEnabled ? 'bg-[var(--green)]' : 'bg-[var(--border-color)]'
                }`}
              >
                <div
                  className={`w-[22px] h-[22px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-transform duration-200 ${
                    soundEnabled ? 'translate-x-[20px]' : 'translate-x-0'
                  }`}
                />
              </div>
              <span className="text-[14px] font-semibold text-[var(--gray-text)]">
                Sound effects
              </span>
            </label>

            {/* Toggle 2: Animations */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => setAnimEnabled(!animEnabled)}
                className={`w-[48px] h-[28px] rounded-[14px] transition-colors duration-200 relative p-[3px] ${
                  animEnabled ? 'bg-[var(--green)]' : 'bg-[var(--border-color)]'
                }`}
              >
                <div
                  className={`w-[22px] h-[22px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-transform duration-200 ${
                    animEnabled ? 'translate-x-[20px]' : 'translate-x-0'
                  }`}
                />
              </div>
              <span className="text-[14px] font-semibold text-[var(--gray-text)]">
                Animations
              </span>
            </label>
          </div>
        </div>

        {/* Group 4: Progress Bars */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--nav-text)]">
            Progress
          </span>
          <div className="flex flex-col gap-2.5">
            {/* 85% Green */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[12px] bg-[var(--border-color)] rounded-[6px] overflow-hidden">
                <div
                  className="h-full bg-[var(--green)] rounded-[6px] transition-all duration-700 ease-out"
                  style={{ width: '85%' }}
                />
              </div>
              <span className="text-[12px] font-bold text-[var(--gray-text)] w-[32px] text-right">
                85%
              </span>
            </div>

            {/* 60% Blue */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[12px] bg-[var(--border-color)] rounded-[6px] overflow-hidden">
                <div
                  className="h-full bg-[var(--blue)] rounded-[6px] transition-all duration-700 ease-out"
                  style={{ width: '60%' }}
                />
              </div>
              <span className="text-[12px] font-bold text-[var(--gray-text)] w-[32px] text-right">
                60%
              </span>
            </div>

            {/* 35% Orange */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[12px] bg-[var(--border-color)] rounded-[6px] overflow-hidden">
                <div
                  className="h-full bg-[var(--orange)] rounded-[6px] transition-all duration-700 ease-out"
                  style={{ width: '35%' }}
                />
              </div>
              <span className="text-[12px] font-bold text-[var(--gray-text)] w-[32px] text-right">
                35%
              </span>
            </div>
          </div>
        </div>

        {/* Group 5: Tooltips & Streak */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--nav-text)]">
            Tooltips & Streak
          </span>
          <div className="flex items-center gap-4 flex-wrap">
            {/* Tooltip trigger */}
            <div
              className="relative inline-block"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <button className="px-4 py-2 rounded-[8px] text-[13px] font-bold text-[var(--green)] bg-[rgba(88,204,2,0.08)] hover:bg-[rgba(88,204,2,0.15)] transition-colors select-none">
                Hover me
              </button>
              {showTooltip && (
                <div className="tooltip-bubble">
                  Level 12 Explorer!
                </div>
              )}
            </div>

            {/* Streak counter */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[20px] bg-[rgba(255,150,0,0.1)] select-none">
              <span className="text-[18px] leading-none">🔥</span>
              <span className="text-[16px] font-extrabold text-[var(--orange)]">42</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
