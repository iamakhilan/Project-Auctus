import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[var(--border-color)] py-8 px-6 mt-auto">
      <div className="max-w-[1440px] mx-auto flex max-[600px]:flex-col items-center justify-between gap-4 text-[13px] font-semibold text-[var(--gray-light)]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--footer-green)]" />
          <span>Duolingo Design System Reference Guide</span>
        </div>
        <div className="flex items-center gap-4 text-[12px]">
          <a href="#colors" className="hover:text-[var(--green)] transition-colors">Colors</a>
          <a href="#type" className="hover:text-[var(--green)] transition-colors">Typography</a>
          <a href="#buttons" className="hover:text-[var(--green)] transition-colors">Buttons</a>
          <a href="#cards" className="hover:text-[var(--green)] transition-colors">Cards</a>
          <a href="#components" className="hover:text-[var(--green)] transition-colors">Components</a>
        </div>
      </div>
    </footer>
  );
};
