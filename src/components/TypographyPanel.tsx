import React from 'react';

export const TypographyPanel: React.FC = () => {
  return (
    <section id="type" className="duo-panel duo-panel-even bg-white">
      <div className="section-label-light">02 / Typography</div>

      <div className="flex flex-col gap-5">
        {/* Row 1: 48px / Feather Bold */}
        <div className="flex items-baseline gap-5">
          <div className="w-[80px] text-right shrink-0 max-[600px]:hidden flex flex-col">
            <span className="text-[11px] font-bold text-[var(--blue)]">48px</span>
            <span className="text-[10px] font-bold text-[var(--nav-text)]">Feather</span>
          </div>
          <div
            className="text-[48px] max-[600px]:text-[32px] text-[var(--green)] font-feather leading-none"
            style={{ fontFamily: '"Feather Bold", Nunito, sans-serif' }}
          >
            Display
          </div>
        </div>

        {/* Row 2: 32px / Bold 700 */}
        <div className="flex items-baseline gap-5">
          <div className="w-[80px] text-right shrink-0 max-[600px]:hidden flex flex-col">
            <span className="text-[11px] font-bold text-[var(--blue)]">32px</span>
            <span className="text-[10px] font-bold text-[var(--nav-text)]">Bold 700</span>
          </div>
          <div className="text-[32px] font-bold text-[var(--gray-text)] leading-tight">
            Heading One
          </div>
        </div>

        {/* Row 3: 28px / Feather Bold */}
        <div className="flex items-baseline gap-5">
          <div className="w-[80px] text-right shrink-0 max-[600px]:hidden flex flex-col">
            <span className="text-[11px] font-bold text-[var(--blue)]">28px</span>
            <span className="text-[10px] font-bold text-[var(--nav-text)]">Feather</span>
          </div>
          <div
            className="text-[28px] text-[var(--green)] font-feather lowercase leading-tight"
            style={{ fontFamily: '"Feather Bold", Nunito, sans-serif' }}
          >
            heading two
          </div>
        </div>

        {/* Row 4: 18px / Medium 500 */}
        <div className="flex items-baseline gap-5">
          <div className="w-[80px] text-right shrink-0 max-[600px]:hidden flex flex-col">
            <span className="text-[11px] font-bold text-[var(--blue)]">18px</span>
            <span className="text-[10px] font-bold text-[var(--nav-text)]">Med 500</span>
          </div>
          <div className="text-[18px] font-medium text-[var(--gray-light)] leading-[1.6]">
            Body text for paragraphs and descriptions with comfortable reading line-height.
          </div>
        </div>

        {/* Row 5: 14px / Bold 700 */}
        <div className="flex items-baseline gap-5">
          <div className="w-[80px] text-right shrink-0 max-[600px]:hidden flex flex-col">
            <span className="text-[11px] font-bold text-[var(--blue)]">14px</span>
            <span className="text-[10px] font-bold text-[var(--nav-text)]">Bold 700</span>
          </div>
          <div className="text-[14px] font-bold uppercase text-[var(--nav-text)] tracking-[0.5px]">
            CAPTION LABEL
          </div>
        </div>

        {/* Row 6: 12px / Semi 600 */}
        <div className="flex items-baseline gap-5">
          <div className="w-[80px] text-right shrink-0 max-[600px]:hidden flex flex-col">
            <span className="text-[11px] font-bold text-[var(--blue)]">12px</span>
            <span className="text-[10px] font-bold text-[var(--nav-text)]">Semi 600</span>
          </div>
          <div className="text-[12px] font-semibold text-[var(--gray-light)]">
            Small utility text for metadata and hints
          </div>
        </div>
      </div>
    </section>
  );
};
