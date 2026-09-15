import React, { useState } from 'react';

interface ColorSwatch {
  name: string;
  rgb: string;
  hex: string;
  color: string;
  border?: string;
}

const colorSwatches: ColorSwatch[] = [
  { name: 'Green', rgb: 'rgb(88, 204, 2)', hex: '#58CC02', color: '#58CC02' },
  { name: 'Green Hover', rgb: 'rgb(75, 178, 0)', hex: '#4BB200', color: '#4BB200' },
  { name: 'Blue', rgb: 'rgb(28, 176, 246)', hex: '#1CB0F6', color: '#1CB0F6' },
  { name: 'Dark Blue', rgb: 'rgb(16, 15, 62)', hex: '#100F3E', color: '#100F3E' },
  { name: 'Red', rgb: 'rgb(255, 75, 75)', hex: '#FF4B4B', color: '#FF4B4B' },
  { name: 'Orange', rgb: 'rgb(255, 150, 0)', hex: '#FF9600', color: '#FF9600' },
  { name: 'Golden', rgb: 'rgb(255, 200, 0)', hex: '#FFC800', color: '#FFC800' },
  { name: 'Footer Green', rgb: 'rgb(78, 198, 4)', hex: '#4EC604', color: '#4EC604' },
  { name: 'Gray Text', rgb: 'rgb(75, 75, 75)', hex: '#4B4B4B', color: '#4B4B4B' },
  { name: 'Gray Light', rgb: 'rgb(119, 119, 119)', hex: '#777777', color: '#777777' },
  { name: 'Nav Text', rgb: 'rgb(175, 175, 175)', hex: '#AFAFAF', color: '#AFAFAF' },
  { name: 'Border', rgb: 'rgb(229, 229, 229)', hex: '#E5E5E5', color: '#E5E5E5', border: 'rgba(0,0,0,0.1)' },
];

export const ColorPalettePanel: React.FC = () => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex).then(() => {
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 1800);
    });
  };

  return (
    <section id="colors" className="duo-panel duo-panel-odd bg-white">
      <div className="section-label-light">01 / Color Palette</div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] max-[600px]:grid-cols-3 gap-3">
        {colorSwatches.map((c) => (
          <div
            key={c.name}
            onClick={() => handleCopy(c.hex)}
            className="group flex flex-col cursor-pointer"
            title={`Click to copy ${c.hex}`}
          >
            <div
              className="w-full aspect-square rounded-[12px] transition-all duration-200 group-hover:scale-105 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] relative overflow-hidden flex items-center justify-center"
              style={{
                backgroundColor: c.color,
                border: c.border ? `1px solid ${c.border}` : '1px solid rgba(0,0,0,0.06)',
              }}
            >
              {copiedHex === c.hex && (
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded bg-black/80 text-white shadow">
                  Copied!
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-col">
              <span className="text-[12px] font-bold text-[var(--gray-text)] leading-tight truncate">
                {c.name}
              </span>
              <span className="text-[10px] font-semibold text-[var(--gray-light)] uppercase tracking-wider">
                {c.hex}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
