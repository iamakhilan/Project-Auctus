import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="mt-[64px] pt-[56px] px-10 pb-[40px] max-[600px]:pt-[40px] max-[600px]:px-5 max-[600px]:pb-[32px] flex flex-col items-center text-center bg-gradient-to-b from-[rgba(88,204,2,0.12)] via-[rgba(88,204,2,0.04)] to-white border-b border-[var(--border-color)]">
      <h1
        className="font-feather text-[52px] max-[900px]:text-[36px] max-[600px]:text-[28px] text-[var(--green)] lowercase leading-none tracking-tight select-none"
        style={{ fontFamily: '"Feather Bold", Nunito, sans-serif' }}
      >
        duolingo design
      </h1>
      <p className="mt-3.5 text-[17px] text-[var(--gray-light)] max-w-[520px] leading-[1.5] font-medium">
        A comprehensive visual reference for the Duolingo design system covering colors, typography, button variants, cards, and UI components.
      </p>

      {/* Hero 3D Buttons */}
      <div className="mt-8 flex flex-row max-[900px]:flex-col items-center justify-center gap-4 w-full">
        <button
          className="duo-btn h-[48px] px-6 text-[15px] text-white bg-[var(--green)] hover:bg-[var(--green-hover)] shadow-[0_4px_0_var(--green-shadow)] max-[900px]:w-full max-[900px]:max-w-[280px]"
        >
          GET STARTED
        </button>
        <button
          className="duo-btn h-[48px] px-6 text-[15px] text-[var(--blue)] bg-transparent border-2 border-[#CFCFCF] shadow-[0_4px_0_#CFCFCF] hover:bg-[rgba(28,176,246,0.04)] max-[900px]:w-full max-[900px]:max-w-[280px]"
        >
          I ALREADY HAVE AN ACCOUNT
        </button>
      </div>
    </section>
  );
};
