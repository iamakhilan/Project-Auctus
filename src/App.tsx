import React, { useState } from 'react';
import { GameStateProvider, useGameState } from './context/GameStateContext';
import { HeaderHUD } from './components/layout/HeaderHUD';
import { NavTabs } from './components/layout/NavTabs';
import { RealmView } from './components/realm/RealmView';
import { QuestsView } from './components/quests/QuestsView';
import { FocusArenaView } from './components/focus/FocusArenaView';
import { VaultView } from './components/vault/VaultView';
import { CitadelView } from './components/citadel/CitadelView';
import { RewardClaimModal } from './components/common/RewardClaimModal';
import { OnboardingModal } from './components/common/OnboardingModal';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, claimModal, closeClaimModal } = useGameState();
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[var(--gray-text)] font-body flex flex-col antialiased">
      {/* Top Fixed HUD */}
      <HeaderHUD
        onOpenHelp={() => setShowOnboarding(true)}
        onOpenProfile={() => setActiveTab('citadel')}
      />

      {/* Navigation Tabs */}
      <NavTabs activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Realm Content Area */}
      <main className="flex-1 w-full pb-16">
        {activeTab === 'realm' && <RealmView />}
        {activeTab === 'quests' && <QuestsView />}
        {activeTab === 'focus' && <FocusArenaView />}
        {activeTab === 'vault' && <VaultView />}
        {activeTab === 'citadel' && <CitadelView />}
      </main>

      {/* Global Modals */}
      <RewardClaimModal data={claimModal} onClose={closeClaimModal} />
      <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />

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
  return (
    <GameStateProvider>
      <AppContent />
    </GameStateProvider>
  );
};

export default App;