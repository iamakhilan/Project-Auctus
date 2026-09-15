import React from 'react';

export const DarkThemeCardsPanel: React.FC = () => {
  return (
    <section className="duo-panel duo-panel-even bg-[var(--dark-blue)]">
      <div className="section-label-dark">06 / Dark Theme Cards</div>

      <div className="grid grid-cols-2 max-[900px]:grid-cols-1 gap-4">
        {/* Dark Card 1: Unlimited Hearts */}
        <div className="bg-white/[0.06] border-2 border-white/[0.08] rounded-[16px] overflow-hidden flex flex-col justify-between p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.3)] cursor-pointer group">
          <div className="flex flex-col gap-2">
            <span className="inline-block w-max text-[11px] font-extrabold uppercase text-[#FFC800] bg-[rgba(255,200,0,0.15)] rounded-[6px] px-2 py-0.5 tracking-wider">
              SUPER
            </span>
            <h3 className="text-[16px] font-bold text-white leading-tight">
              Unlimited Hearts
            </h3>
            <p className="text-[13px] text-white/50 leading-[1.5] font-normal">
              Keep learning without interruption with Super Duolingo benefits.
            </p>
          </div>
          <div className="border-t border-white/[0.08] pt-3 mt-4 flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase text-white/30">
              PREMIUM
            </span>
            <span className="text-[12px] font-bold uppercase text-[#FFC800] group-hover:opacity-75 transition-opacity">
              UPGRADE
            </span>
          </div>
        </div>

        {/* Dark Card 2: Mastery Quizzes */}
        <div className="bg-white/[0.06] border-2 border-white/[0.08] rounded-[16px] overflow-hidden flex flex-col justify-between p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.3)] cursor-pointer group">
          <div className="flex flex-col gap-2">
            <span className="inline-block w-max text-[11px] font-extrabold uppercase text-[#FF9600] bg-[rgba(255,150,0,0.15)] rounded-[6px] px-2 py-0.5 tracking-wider">
              PRO
            </span>
            <h3 className="text-[16px] font-bold text-white leading-tight">
              Mastery Quizzes
            </h3>
            <p className="text-[13px] text-white/50 leading-[1.5] font-normal">
              Challenge yourself with advanced assessments to test your skill level.
            </p>
          </div>
          <div className="border-t border-white/[0.08] pt-3 mt-4 flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase text-white/30">
              ADVANCED
            </span>
            <span className="text-[12px] font-bold uppercase text-[#FF9600] group-hover:opacity-75 transition-opacity">
              TRY NOW
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
