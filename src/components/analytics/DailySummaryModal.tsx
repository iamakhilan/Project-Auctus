import React, { useMemo } from 'react';
import { useGameState } from '../../context/GameStateContext';

interface DailySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function toISODateLocal(d: Date): string {
  return d.toISOString().split('T')[0];
}

export const DailySummaryModal: React.FC<DailySummaryModalProps> = ({ isOpen, onClose }) => {
  const { quests, habits, transactions, profile } = useGameState();

  const todayStr = toISODateLocal(new Date());

  const stats = useMemo(() => {
    const completedToday = quests.filter((q) => {
      if (!q.isCompleted || !q.completedAt) return false;
      return q.completedAt.split('T')[0] === todayStr;
    });
    const xpEarnedToday = completedToday.reduce((acc, q) => acc + q.xpReward, 0);
    const coinsEarnedToday = completedToday.reduce((acc, q) => acc + q.coinsReward, 0);

    const habitsDoneToday = habits.filter((h) => h.lastCompletedDate === todayStr).length;

    const txToday = transactions.filter((t) => {
      const d = new Date(t.timestamp);
      return toISODateLocal(d) === todayStr;
    });
    const coinsDeltaToday = txToday
      .filter((t) => t.currency === 'coins')
      .reduce((a, t) => a + (t.type === 'earn' ? t.amount : -Math.abs(t.amount)), 0);
    const gemsDeltaToday = txToday
      .filter((t) => t.currency === 'gems')
      .reduce((a, t) => a + (t.type === 'earn' ? t.amount : -Math.abs(t.amount)), 0);

    return {
      completedToday,
      completedCount: completedToday.length,
      xpEarnedToday,
      coinsEarnedToday,
      habitsDoneToday,
      habitsTotal: habits.length,
      txToday: txToday.slice(0, 8),
      coinsDeltaToday,
      gemsDeltaToday,
    };
  }, [quests, habits, transactions, todayStr]);

  if (!isOpen) return null;

  const completionPct =
    quests.length > 0 ? Math.round((stats.completedCount / Math.max(1, quests.filter((q) => q.category === 'daily').length)) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border-2 border-[#e5e5e5] shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--dark-blue)] to-[#1a237e] p-6 text-white relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-7xl opacity-10 pointer-events-none">📊</div>
          <div className="relative z-10">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/60 mb-1">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <h2 className="font-['Feather_Bold'] text-2xl tracking-wide">DAILY SUMMARY</h2>
            <p className="text-sm font-bold text-white/80 mt-1">Today&apos;s progress at a glance</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center font-black transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* Hero stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-[#eef8ff] border-2 border-[#b9e5fb] p-3 text-center">
              <span className="text-xl block">✅</span>
              <span className="font-['Feather_Bold'] text-xl font-black text-[var(--blue)] block">{stats.completedCount}</span>
              <span className="text-[11px] font-extrabold uppercase text-[var(--gray-light)]">Quests done</span>
            </div>
            <div className="rounded-2xl bg-[#fffbe6] border-2 border-[#ffe58f] p-3 text-center">
              <span className="text-xl block">⚡</span>
              <span className="font-['Feather_Bold'] text-xl font-black text-[#d48806] block">+{stats.xpEarnedToday}</span>
              <span className="text-[11px] font-extrabold uppercase text-[var(--gray-light)]">XP earned</span>
            </div>
            <div className="rounded-2xl bg-[#fff5ea] border-2 border-[#ffd6a5] p-3 text-center">
              <span className="text-xl block">🔥</span>
              <span className="font-['Feather_Bold'] text-xl font-black text-[var(--orange)] block">
                {stats.habitsDoneToday}/{stats.habitsTotal}
              </span>
              <span className="text-[11px] font-extrabold uppercase text-[var(--gray-light)]">Habits</span>
            </div>
          </div>

          {/* XP + coins rows */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#fafafa] border-2 border-[#e5e5e5] p-3.5 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-black uppercase tracking-widest text-[var(--gray-light)]">Coins</div>
                <div className="font-['Feather_Bold'] text-lg font-black text-[#d48806]">{stats.coinsDeltaToday >= 0 ? '+' : ''}{stats.coinsDeltaToday} 🟡</div>
              </div>
              <span className="text-2xl opacity-60">🪙</span>
            </div>
            <div className="rounded-2xl bg-[#fafafa] border-2 border-[#e5e5e5] p-3.5 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-black uppercase tracking-widest text-[var(--gray-light)]">Gems</div>
                <div className="font-['Feather_Bold'] text-lg font-black text-[#db2777]">{stats.gemsDeltaToday >= 0 ? '+' : ''}{stats.gemsDeltaToday} 💎</div>
              </div>
              <span className="text-2xl opacity-60">💎</span>
            </div>
          </div>

          {/* Progress + streak */}
          <div className="rounded-2xl border-2 border-[#e5e5e5] p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-[var(--gray-light)]">Daily quest momentum</span>
              <span className="text-xs font-black text-[var(--dark-blue)]">{completionPct}%</span>
            </div>
            <div className="h-3 bg-[#e5e5e5] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--green)] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, completionPct))}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-3 text-xs font-bold">
              <span className="text-[var(--gray-light)]">Level {profile.level} • {profile.xp}/{profile.xpToNextLevel} XP</span>
              <span className="px-2.5 py-1 rounded-full bg-[#fff5ea] border border-[#ffd6a5] text-[var(--orange)] font-black">
                🔥 {profile.streakDays} day streak
              </span>
            </div>
          </div>

          {/* Completed quests list */}
          <div>
            <div className="section-label-light">Completed today</div>
            {stats.completedToday.length === 0 ? (
              <div className="rounded-2xl bg-[#fafafa] border-2 border-dashed border-[#e5e5e5] p-5 text-center">
                <p className="text-sm font-bold text-[var(--gray-light)]">No quests completed yet today</p>
                <p className="text-xs font-semibold text-[var(--gray-light)] mt-1">Complete a quest to see it here. Momentum builds with each win.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {stats.completedToday.map((q) => (
                  <div key={q.id} className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#f0fdf4] border-2 border-[#bbf7d0]">
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-[var(--dark-blue)] truncate">{q.title}</div>
                      <div className="text-[11px] font-bold text-[var(--gray-light)]">
                        {q.tag} • +{q.xpReward} XP • +{q.coinsReward} 🟡
                      </div>
                    </div>
                    <span className="w-7 h-7 rounded-full bg-[var(--green)] text-white flex items-center justify-center text-xs font-black shrink-0">✓</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent transactions */}
          <div>
            <div className="section-label-light">Today&apos;s ledger (latest)</div>
            {stats.txToday.length === 0 ? (
              <p className="text-xs font-semibold text-[var(--gray-light)] rounded-2xl bg-[#fafafa] border-2 border-[#e5e5e5] p-4 text-center">
                No transactions today. Earn or spend to populate your ledger.
              </p>
            ) : (
              <div className="divide-y-2 divide-[#f0f0f0] rounded-2xl border-2 border-[#e5e5e5] overflow-hidden">
                {stats.txToday.map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-3 p-3 bg-white">
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[var(--dark-blue)] truncate">{t.reason}</div>
                      <div className="text-[11px] font-semibold text-[var(--gray-light)]">
                        {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {t.currency} • {t.type}
                      </div>
                    </div>
                    <span className={`text-sm font-black ${t.type === 'earn' ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                      {t.type === 'earn' ? '+' : '-'}{t.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-5 border-t-2 border-[#e5e5e5] bg-[#fafafa] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-12 bg-white border-2 border-[#e5e5e5] hover:border-[#d9d9d9] text-[var(--dark-blue)] font-['Feather_Bold'] text-sm font-black uppercase rounded-2xl transition-colors"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-12 bg-[var(--green)] hover:bg-[var(--green-hover)] text-white font-['Feather_Bold'] text-sm font-black uppercase rounded-2xl border-b-4 border-[var(--green-shadow)] active:translate-y-0.5 active:border-b-0 transition-all shadow-md"
          >
            Keep pushing →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailySummaryModal;
