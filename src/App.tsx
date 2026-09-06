import React from 'react';
import { GameStateProvider, useGameState } from './context/GameStateContext';
import { HeaderHUD } from './components/layout/HeaderHUD';
import { BottomDockNav } from './components/layout/BottomDockNav';
import { RealmView } from './components/realm/RealmView';
import { QuestsView } from './components/quests/QuestsView';
import { FocusArenaView } from './components/focus/FocusArenaView';
import { VaultView } from './components/vault/VaultView';
import { CitadelView } from './components/citadel/CitadelView';
import { RewardModal } from './components/common/RewardModal';

const AppContent: React.FC = () => {
  const { activeTab } = useGameState();

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
    <div className="min-h-screen bg-surface text-on-surface flex flex-col antialiased selection:bg-amber-400 selection:text-amber-950">
      {/* Top Fixed Header HUD */}
      <HeaderHUD />

      {/* Main Screen Container with Top & Bottom Safe Space */}
      <main className="flex-1 w-full pt-20">
        {renderCurrentView()}
      </main>

      {/* Bottom Fixed Docking Navigation */}
      <BottomDockNav />

      {/* Victory / Loot Claim Celebration Modal */}
      <RewardModal />
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
