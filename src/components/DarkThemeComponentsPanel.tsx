import React, { useState } from 'react';

export const DarkThemeComponentsPanel: React.FC = () => {
  const [activeLanguage, setActiveLanguage] = useState<'es' | 'fr' | 'de' | 'ja'>('es');

  return (
    <section className="duo-panel duo-panel-even bg-[var(--dark-blue)]">
      <div className="section-label-dark">08 / Dark Theme Components</div>

      <div className="flex flex-col gap-5">
        {/* Group 1: Language Pills */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[1px] text-white/30">
            Language Pills
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              {
                id: 'es',
                name: 'Spanish',
                flag: 'https://d35aaqx5ub95lt.cloudfront.net/vendor/59a90a2cedd48b751a8fd22014768fd7.svg',
              },
              {
                id: 'fr',
                name: 'French',
                flag: 'https://d35aaqx5ub95lt.cloudfront.net/vendor/482fda142ee4abd728ebf4ccce5d3307.svg',
              },
              {
                id: 'de',
                name: 'German',
                flag: 'https://d35aaqx5ub95lt.cloudfront.net/vendor/c71db846ffab7e0a74bc6971e34ad82e.svg',
              },
              {
                id: 'ja',
                name: 'Japanese',
                flag: 'https://d35aaqx5ub95lt.cloudfront.net/vendor/edea4fa18ff3e7d8c0282de3f102aaed.svg',
              },
            ].map((lang) => {
              const isActive = activeLanguage === lang.id;
              return (
                <button
                  key={lang.id}
                  onClick={() => setActiveLanguage(lang.id as any)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] border-2 cursor-pointer transition-all duration-150 ${
                    isActive
                      ? 'border-[var(--green)] bg-[rgba(88,204,2,0.08)] text-white shadow-sm'
                      : 'border-white/12 text-white/70 hover:border-[var(--green)] hover:bg-[rgba(88,204,2,0.08)] hover:text-white'
                  }`}
                >
                  <img src={lang.flag} alt={lang.name} className="w-[24px] h-[18px] object-contain" />
                  <span className="text-[13px] font-bold">{lang.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Group 2: Avatar Group */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[1px] text-white/30">
            Learners Community
          </span>
          <div className="flex items-center">
            <div className="flex items-center">
              <img
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
                alt="Learner 1"
                className="w-[36px] h-[36px] rounded-full border-2 border-white object-cover shadow-sm"
              />
              <img
                src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
                alt="Learner 2"
                className="w-[36px] h-[36px] rounded-full border-2 border-white object-cover -ml-2 shadow-sm"
              />
              <img
                src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
                alt="Learner 3"
                className="w-[36px] h-[36px] rounded-full border-2 border-white object-cover -ml-2 shadow-sm"
              />
              <div className="w-[36px] h-[36px] rounded-full bg-[#f0f0f0] text-[var(--gray-light)] text-[11px] font-extrabold border-2 border-white -ml-2 flex items-center justify-center shadow-sm">
                +5
              </div>
            </div>
            <span className="text-[13px] font-semibold text-white/50 ml-3">
              8 learners active
            </span>
          </div>
        </div>

        {/* Group 3: Progress (Dark) */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[1px] text-white/30">
            Progress (Dark)
          </span>
          <div className="flex flex-col gap-2.5">
            {/* 72% Golden */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[12px] bg-white/[0.08] rounded-[6px] overflow-hidden">
                <div
                  className="h-full bg-[#FFC800] rounded-[6px] transition-all duration-700 ease-out"
                  style={{ width: '72%' }}
                />
              </div>
              <span className="text-[12px] font-bold text-white/60 w-[32px] text-right">
                72%
              </span>
            </div>

            {/* 45% Green */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[12px] bg-white/[0.08] rounded-[6px] overflow-hidden">
                <div
                  className="h-full bg-[var(--green)] rounded-[6px] transition-all duration-700 ease-out"
                  style={{ width: '45%' }}
                />
              </div>
              <span className="text-[12px] font-bold text-white/60 w-[32px] text-right">
                45%
              </span>
            </div>
          </div>
        </div>

        {/* Group 4: Badges (Dark) */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[1px] text-white/30">
            Badges (Dark)
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-[20px] text-[12px] font-bold uppercase text-[#7ADB2E] bg-[rgba(88,204,2,0.15)]">
              MASTERED
            </span>
            <span className="px-2.5 py-1 rounded-[20px] text-[12px] font-bold uppercase text-[#4DC4F8] bg-[rgba(28,176,246,0.15)]">
              REVIEW
            </span>
            <span className="px-2.5 py-1 rounded-[20px] text-[12px] font-bold uppercase text-[#FFC800] bg-[rgba(255,200,0,0.15)]">
              CROWN
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
