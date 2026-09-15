import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ColorPalettePanel } from './components/ColorPalettePanel';
import { TypographyPanel } from './components/TypographyPanel';
import { ButtonVariantsPanel } from './components/ButtonVariantsPanel';
import { DarkThemeButtonsPanel } from './components/DarkThemeButtonsPanel';
import { CardsPanel } from './components/CardsPanel';
import { DarkThemeCardsPanel } from './components/DarkThemeCardsPanel';
import { ComponentsPanel } from './components/ComponentsPanel';
import { DarkThemeComponentsPanel } from './components/DarkThemeComponentsPanel';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-[var(--gray-text)] font-body flex flex-col antialiased">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Main 2-Column Grid */}
      <main className="duo-main-grid w-full">
        {/* Panel 1: Color Palette (Light) */}
        <ColorPalettePanel />

        {/* Panel 2: Typography (Light) */}
        <TypographyPanel />

        {/* Panel 3: Button Variants (Light) */}
        <ButtonVariantsPanel />

        {/* Panel 4: Dark Theme Buttons */}
        <DarkThemeButtonsPanel />

        {/* Panel 5: Cards (Light) */}
        <CardsPanel />

        {/* Panel 6: Dark Theme Cards */}
        <DarkThemeCardsPanel />

        {/* Panel 7: Components (Light) */}
        <ComponentsPanel />

        {/* Panel 8: Dark Theme Components */}
        <DarkThemeComponentsPanel />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
