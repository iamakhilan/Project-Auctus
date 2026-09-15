import React from 'react';

export const DarkThemeButtonsPanel: React.FC = () => {
  return (
    <section className="duo-panel duo-panel-even bg-[var(--dark-blue)]">
      <div className="section-label-dark">04 / Dark Theme Buttons</div>

      <div className="flex flex-col gap-4">
        {/* Row 1: Regular Size */}
        <div className="flex items-center gap-3 flex-wrap">
          <button className="duo-btn h-[48px] px-6 text-[15px] text-white bg-[var(--green)] hover:bg-[var(--green-hover)] shadow-[0_4px_0_var(--green-shadow)]">
            GET STARTED
          </button>
          <button className="duo-btn h-[48px] px-6 text-[15px] text-[var(--dark-blue)] bg-white hover:bg-[#c8f040] shadow-[0_4px_0_#88879F]">
            TRY 1 WEEK FREE
          </button>
        </div>

        {/* Row 2: Small Variants */}
        <div className="flex items-center gap-3 flex-wrap">
          <button className="duo-btn duo-btn-sm text-white bg-[var(--green)] hover:bg-[var(--green-hover)] shadow-[0_3px_0_var(--green-shadow)]">
            GET STARTED
          </button>
          <button className="duo-btn duo-btn-sm text-[var(--dark-blue)] bg-white hover:bg-[#c8f040] shadow-[0_3px_0_#88879F]">
            TRY 1 WEEK FREE
          </button>
        </div>
      </div>
    </section>
  );
};
