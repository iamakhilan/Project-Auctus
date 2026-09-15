import React from 'react';

export const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[var(--border-color)] h-[64px] shadow-sm">
      <div className="max-w-[1440px] mx-auto h-full px-6 flex items-center justify-between">
        {/* Left: Duolingo Logo + Divider + Style Guide Label */}
        <div className="flex items-center gap-3.5">
          <a href="#" className="flex items-center" aria-label="Duolingo Logo">
            <img
              src="https://d35aaqx5ub95lt.cloudfront.net/images/splash/f92d5f2f7d56636846861c458c0d0b6c.svg"
              alt="Duolingo"
              className="w-[140px] h-[33px] object-contain"
            />
          </a>
          <div className="w-[1px] h-[24px] bg-[var(--border-color)]" />
          <span className="text-[11px] font-extrabold uppercase tracking-[1.5px] text-[var(--nav-text)] select-none">
            STYLE GUIDE
          </span>
        </div>

        {/* Right: Horizontal Nav Links (Hidden <= 900px) */}
        <nav className="hidden min-[901px]:flex items-center gap-1">
          {[
            { label: 'Colors', href: '#colors' },
            { label: 'Type', href: '#type' },
            { label: 'Buttons', href: '#buttons' },
            { label: 'Cards', href: '#cards' },
            { label: 'Components', href: '#components' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3.5 py-2 rounded-lg text-[13px] font-bold uppercase tracking-[0.5px] text-[var(--gray-light)] hover:text-[var(--green)] hover:bg-[rgba(88,204,2,0.08)] transition-all duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};
