import React from 'react';

export const CardsPanel: React.FC = () => {
  return (
    <section id="cards" className="duo-panel duo-panel-odd bg-white">
      <div className="section-label-light">05 / Cards</div>

      <div className="grid grid-cols-2 max-[900px]:grid-cols-1 gap-4">
        {/* Card 1: Spanish for Beginners */}
        <div className="bg-white border-2 border-[var(--border-color)] rounded-[16px] overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] cursor-pointer group">
          <div>
            <img
              src="https://images.pexels.com/photos/4145354/pexels-photo-4145354.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop"
              alt="Spanish Course"
              className="w-full h-[120px] object-cover"
            />
            <div className="p-4 flex flex-col gap-2">
              <span className="inline-block w-max text-[11px] font-extrabold uppercase text-[var(--green)] bg-[rgba(88,204,2,0.1)] rounded-[6px] px-2 py-0.5 tracking-wider">
                NEW
              </span>
              <h3 className="text-[16px] font-bold text-[var(--gray-text)] group-hover:text-[var(--green)] transition-colors leading-tight">
                Spanish for Beginners
              </h3>
              <p className="text-[13px] text-[var(--gray-light)] leading-[1.5] font-normal">
                Start your language journey with interactive lessons designed to build fluency.
              </p>
            </div>
          </div>
          <div className="border-t border-[var(--border-color)] px-4 py-3 flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase text-[var(--nav-text)]">
              12 UNITS
            </span>
            <span className="text-[12px] font-bold uppercase text-[var(--blue)] group-hover:opacity-70 transition-opacity">
              START
            </span>
          </div>
        </div>

        {/* Card 2: French Conversations */}
        <div className="bg-white border-2 border-[var(--border-color)] rounded-[16px] overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] cursor-pointer group">
          <div>
            <img
              src="https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop"
              alt="French Conversations"
              className="w-full h-[120px] object-cover"
            />
            <div className="p-4 flex flex-col gap-2">
              <span className="inline-block w-max text-[11px] font-extrabold uppercase text-[var(--blue)] bg-[rgba(28,176,246,0.1)] rounded-[6px] px-2 py-0.5 tracking-wider">
                POPULAR
              </span>
              <h3 className="text-[16px] font-bold text-[var(--gray-text)] group-hover:text-[var(--blue)] transition-colors leading-tight">
                French Conversations
              </h3>
              <p className="text-[13px] text-[var(--gray-light)] leading-[1.5] font-normal">
                Practice real-world dialogue and improve pronunciation with native speakers.
              </p>
            </div>
          </div>
          <div className="border-t border-[var(--border-color)] px-4 py-3 flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase text-[var(--nav-text)]">
              8 UNITS
            </span>
            <span className="text-[12px] font-bold uppercase text-[var(--blue)] group-hover:opacity-70 transition-opacity">
              CONTINUE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
