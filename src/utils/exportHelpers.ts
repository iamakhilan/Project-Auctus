import { EconomyTransaction, Quest, Habit } from '../types';

export function escapeCSVField(val: string | number | boolean | undefined | null): string {
  if (val === undefined || val === null) return '""';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

export function exportTransactionsToCSV(transactions: EconomyTransaction[]): string {
  const headers = ['ID', 'Date', 'Type', 'Amount', 'Currency', 'Reason'];
  const rows = transactions.map((t) => [
    escapeCSVField(t.id),
    escapeCSVField(new Date(t.timestamp).toISOString()),
    escapeCSVField(t.type),
    escapeCSVField(t.amount),
    escapeCSVField(t.currency),
    escapeCSVField(t.reason),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function exportQuestsToCSV(quests: Quest[]): string {
  const headers = [
    'ID',
    'Title',
    'Category',
    'Tag',
    'Difficulty',
    'XP Reward',
    'Coins Reward',
    'Completed',
    'Completed At',
  ];

  const rows = quests.map((q) => [
    escapeCSVField(q.id),
    escapeCSVField(q.title),
    escapeCSVField(q.category),
    escapeCSVField(q.tag),
    escapeCSVField(q.difficulty || 'normal'),
    escapeCSVField(q.xpReward),
    escapeCSVField(q.coinsReward),
    escapeCSVField(q.isCompleted),
    escapeCSVField(q.completedAt || ''),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function exportHabitsToCSV(habits: Habit[]): string {
  const headers = [
    'ID',
    'Title',
    'Category',
    'Frequency',
    'Current Streak',
    'Best Streak',
    'XP Yield',
    'Coin Yield',
    'Total Check-ins',
  ];

  const rows = habits.map((h) => [
    escapeCSVField(h.id),
    escapeCSVField(h.title),
    escapeCSVField(h.category),
    escapeCSVField(h.frequency || 'daily'),
    escapeCSVField(h.streakCount),
    escapeCSVField(h.bestStreak),
    escapeCSVField(h.xpYield),
    escapeCSVField(h.coinYield),
    escapeCSVField(h.completedDates?.length || 0),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
