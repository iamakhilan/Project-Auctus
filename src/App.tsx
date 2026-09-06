import React, { useState } from 'react';
import { GameStateProvider, useGameState } from './context/GameStateContext';
import { HeaderHUD } from './components/layout/HeaderHUD';
import { BottomDockNav } from './components/layout/BottomDockNav';
import { RealmView } from './components/realm/RealmView';
import { QuestsView } from './components/quests/QuestsView';
import { FocusArenaView } from './components/focus/FocusArenaView';
import { VaultView } from './components/vault/VaultView';
import { CitadelView } from './components/citadel/CitadelView';
import { RewardModal } from './components/common/RewardModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useCapacitorNative } from './hooks/useCapacitorNative';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, toggleSound, claimModal, closeClaimModal } = useGameState();
  const [showTutorial, setShowTutorial] = useState(false);

  // Register Android Native back button, dark status bar, and lifecycle sync
  useCapacitorNative({
    activeTab,
    setActiveTab,
    isModalOpen: claimModal.isOpen || showTutorial,
    onCloseModal: () => {
      if (claimModal.isOpen) closeClaimModal();
      if (showTutorial) setShowTutorial(false);
    },
  });

  // Register global shortcuts: 1-5 for screens, M for sound, ? for tutorial
  useKeyboardShortcuts({
    onTabChange: setActiveTab,
    onOpenHelp: () => setShowTutorial(true),
    onToggleSound: toggleSound,
    onEscape: () => {
      if (claimModal.isOpen) closeClaimModal();
      setShowTutorial(false);
    },
  });

  const renderCurrentView = () => {
    switch (activeTab) {
      case 'realm':
        return <RealmView />;
      case 'quests':
        return <QuestsView />;
      case 'focus-arena':
        return <FocusArenaView />;
      case 'vault':
        return <VaultView />;
      case 'citadel':
        return <CitadelView />;
      default:
        return <RealmView />;
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col antialiased selection:bg-accent selection:text-light">
      {/* Top Fixed Header HUD */}
      <HeaderHUD
        onOpenProfile={() => setActiveTab('citadel')}
        onOpenSettings={() => setShowTutorial(true)}
      />

      {/* Main Screen Container with Top & Bottom Safe Space */}
      <main className="flex-1 w-full pt-16 pb-20">
        {renderCurrentView()}
      </main>

      {/* Bottom Fixed Docking Navigation */}
      <BottomDockNav />

      {/* Victory / Loot Claim Celebration Modal */}
      <RewardModal />

      {/* First-Run Onboarding Tutorial Modal */}
      <OnboardingModal
        forceOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
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
