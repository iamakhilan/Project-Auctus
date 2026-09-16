import React from 'react';

interface Props { children: React.ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[Auctus ErrorBoundary]', error, info);
  }

  handleReset = () => {
    // Only reset Auctus-owned storage. Never clear unrelated sites' localStorage.
    const auctusKeys = [
      'auctus_duo_profile',
      'auctus_duo_quests',
      'auctus_duo_habits',
      'auctus_duo_chests',
      'auctus_duo_rewards',
      'auctus_duo_achievements',
      'auctus_duo_transactions',
      'auctus_duo_focus',
    ];
    try {
      auctusKeys.forEach((key) => localStorage.removeItem(key));
    } finally {
      location.reload();
    }
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#f7f7f7]">
        <div className="max-w-lg w-full bg-white rounded-3xl border-4 border-[#e5e5e5] p-8 text-center shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#ffeef0] border-b-4 border-[#ffccd2] flex items-center justify-center text-3xl mb-4">💥</div>
          <h1 className="font-['Feather_Bold'] text-2xl text-[var(--dark-blue)]">Something went sideways</h1>
          <p className="text-sm font-bold text-[var(--gray-light)] mt-2">Auctus hit an unexpected error. Your saved game data is stored locally in this browser.</p>
          {this.state.error && <pre className="mt-4 text-xs text-left bg-[#f7f7f7] border-2 border-[#e5e5e5] rounded-2xl p-3 overflow-auto max-h-32">{this.state.error.message}</pre>}
          <div className="flex gap-3 mt-6">
            <button onClick={() => this.setState({ hasError: false })} className="flex-1 h-11 rounded-2xl bg-white border-2 border-[#e5e5e5] font-black text-sm cursor-pointer">Try again</button>
            <button onClick={this.handleReset} className="flex-1 h-11 rounded-2xl bg-[var(--red)] text-white border-b-4 border-[#c0392b] font-black text-sm cursor-pointer">Reset Auctus data</button>
          </div>
        </div>
      </div>
    );
  }
}
