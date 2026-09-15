import React from 'react';

export const ButtonVariantsPanel: React.FC = () => {
  return (
    <section id="buttons" className="duo-panel duo-panel-odd bg-white">
      <div className="section-label-light">03 / Button Variants</div>

      <div className="flex flex-col gap-4">
        {/* Primary Row */}
        <div className="flex items-center gap-3">
          <span className="w-[80px] text-[10px] font-bold uppercase tracking-[1px] text-[var(--nav-text)] shrink-0 max-[600px]:hidden">
            Primary
          </span>
          <div className="flex items-center gap-3 flex-wrap">
            <button className="duo-btn h-[48px] px-6 text-[15px] text-white bg-[var(--green)] hover:bg-[var(--green-hover)] shadow-[0_4px_0_var(--green-shadow)]">
              GET STARTED
            </button>
            <button className="duo-btn duo-btn-sm text-white bg-[var(--green)] hover:bg-[var(--green-hover)] shadow-[0_3px_0_var(--green-shadow)]">
              SMALL
            </button>
            <button
              disabled
              className="duo-btn h-[48px] px-6 text-[15px] text-white bg-[var(--green)] shadow-[0_4px_0_var(--green-shadow)] opacity-45 pointer-events-none"
            >
              DISABLED
            </button>
          </div>
        </div>

        {/* Secondary Row */}
        <div className="flex items-center gap-3">
          <span className="w-[80px] text-[10px] font-bold uppercase tracking-[1px] text-[var(--nav-text)] shrink-0 max-[600px]:hidden">
            Secondary
          </span>
          <div className="flex items-center gap-3 flex-wrap">
            <button className="duo-btn h-[48px] px-6 text-[15px] text-[var(--blue)] bg-transparent border-2 border-[#CFCFCF] shadow-[0_4px_0_#CFCFCF] hover:bg-[rgba(28,176,246,0.04)]">
              LEARN MORE
            </button>
            <button className="duo-btn duo-btn-sm text-[var(--blue)] bg-transparent border-2 border-[#CFCFCF] shadow-[0_3px_0_#CFCFCF] hover:bg-[rgba(28,176,246,0.04)]">
              SMALL
            </button>
            <button
              disabled
              className="duo-btn h-[48px] px-6 text-[15px] text-[var(--blue)] bg-transparent border-2 border-[#CFCFCF] shadow-[0_4px_0_#CFCFCF] opacity-45 pointer-events-none"
            >
              DISABLED
            </button>
          </div>
        </div>

        {/* Danger Row */}
        <div className="flex items-center gap-3">
          <span className="w-[80px] text-[10px] font-bold uppercase tracking-[1px] text-[var(--nav-text)] shrink-0 max-[600px]:hidden">
            Danger
          </span>
          <div className="flex items-center gap-3 flex-wrap">
            <button className="duo-btn h-[48px] px-6 text-[15px] text-white bg-[#FF4B4B] hover:bg-[#e03d3d] shadow-[0_4px_0_#CC3C3C]">
              DELETE
            </button>
            <button className="duo-btn duo-btn-sm text-white bg-[#FF4B4B] hover:bg-[#e03d3d] shadow-[0_3px_0_#CC3C3C]">
              REMOVE
            </button>
          </div>
        </div>

        {/* Ghost Row */}
        <div className="flex items-center gap-3">
          <span className="w-[80px] text-[10px] font-bold uppercase tracking-[1px] text-[var(--nav-text)] shrink-0 max-[600px]:hidden">
            Ghost
          </span>
          <div className="flex items-center gap-3 flex-wrap">
            <button className="px-4 py-2.5 rounded-lg text-[14px] font-bold text-[var(--green)] hover:bg-[rgba(88,204,2,0.08)] transition-colors uppercase tracking-[0.5px]">
              VIEW ALL
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
