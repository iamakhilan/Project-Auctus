import React, { Suspense, lazy, useState } from 'react';
import { useGameState } from './context/GameStateContext';
import { HeaderHUD } from './components/layout/HeaderHUD';
import { NavTabs } from './components/layout/NavTabs';
import { RealmView } from './components/realm/RealmView';
import { QuestsView } from './components/quests/QuestsView';
import { FocusArenaView } from './components/focus/FocusArenaView';
import { VaultView } from './components/vault/VaultView';
import { RewardClaimModal } from './components/common/RewardClaimModal';
import { OnboardingModal } from './components/common/OnboardingModal';
import { CommandPalette } from './components/common/CommandPalette';
import { HelpOverlay } from './components/common/HelpOverlay';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

const CitadelView = lazy(() => import('./components/citadel/CitadelView').then((m) => ({ default: m.CitadelView })));
const AnalyticsDashboard = lazy(() => import('./components/analytics/AnalyticsDashboard').then((m) => ({ default: m.AnalyticsDashboard })));

const LazyFallback: React.FC = () => (
  <div className="max-w-5xl mx-auto px-4 py-10">
    <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-8 shadow-xs animate-pulse">
      <div className="h-6 w-32 bg-[#f0f0f0] rounded-xl mb-4" />
      <div className="h-4 w-full bg-[#f7f7f7] rounded-xl mb-2" />
      <div className="h-4 w-3/4 bg-[#f7f7f7] rounded-xl" />
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, claimModal, closeClaimModal } = useGameState();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useKeyboardShortcuts({
    onHelp: () => setShowHelp(true),
    onPalette: () => setShowPalette(true),
    onEscape: () => {
      if (showPalette) setShowPalette(false);
      else if (showHelp) setShowHelp(false);
      else if (showOnboarding) setShowOnboarding(false);
    },
  });

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[var(--gray-text)] font-body flex flex-col antialiased">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-[var(--dark-blue)] focus:rounded-xl focus:border-2 focus:border-[var(--blue)] focus:font-black text-xs">
        Skip to content
      </a>
      {/* Top Fixed HUD */}
      <HeaderHUD
        onOpenHelp={() => setShowOnboarding(true)}
        onOpenProfile={() => setActiveTab('citadel')}
      />

      {/* Navigation Tabs */}
      <NavTabs activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Realm Content Area */}
      <main id="main-content" className="flex-1 w-full pb-16">
        {activeTab === 'realm' && <RealmView />}
        {activeTab === 'quests' && <QuestsView />}
        {activeTab === 'focus' && <FocusArenaView />}
        {activeTab === 'vault' && <VaultView />}
        {activeTab === 'citadel' && (
          <Suspense fallback={<LazyFallback />}>
            <CitadelView />
          </Suspense>
        )}
        {activeTab === 'analytics' && (
          <Suspense fallback={<LazyFallback />}>
            <AnalyticsDashboard />
          </Suspense>
        )}
      </main>

      {/* Global Modals */}
      <RewardClaimModal data={claimModal} onClose={closeClaimModal} />
      <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
      <CommandPalette isOpen={showPalette} onClose={() => setShowPalette(false)} />
      <HelpOverlay isOpen={showHelp} onClose={() => setShowHelp(false)} />

      {/* Duolingo-styled Gaming Footer */}
      <footer className="w-full bg-white border-t-2 border-[#e5e5e5] py-8 text-center select-none">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[var(--green)] border-b-3 border-[var(--green-shadow)] flex items-center justify-center text-white font-black text-sm">
              ⚡
            </span>
            <span className="font-['Feather_Bold'] text-lg text-[var(--dark-blue)] tracking-wide">
              AUCTUS PRODUCTIVITY RPG
            </span>
          </div>
          <p className="text-xs font-bold text-[var(--gray-light)] max-w-md">
            Built with Duolingo Design System • Feather Bold Typography • 3D Tactile Buttons • Web Audio Soundscapes
          </p>
          <div className="text-[11px] font-extrabold text-[var(--gray-light)]">
            © 2026 AUCTUS • Level Up Your Real-World Productivity
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;