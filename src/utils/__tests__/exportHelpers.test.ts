import { describe, it, expect } from 'vitest';
import {
  escapeCSVField,
  exportTransactionsToCSV,
  exportQuestsToCSV,
  exportHabitsToCSV,
} from '../exportHelpers';
import { EconomyTransaction, Quest, Habit } from '../../types';

describe('exportHelpers', () => {
  describe('escapeCSVField', () => {
    it('wraps fields with quotes if they contain commas or quotes', () => {
      expect(escapeCSVField('hello, world')).toBe('"hello, world"');
      expect(escapeCSVField('say "hi"')).toBe('"say ""hi"""');
      expect(escapeCSVField(123)).toBe('"123"');
      expect(escapeCSVField(null)).toBe('""');
    });
  });

  describe('exportTransactionsToCSV', () => {
    it('produces valid CSV string with headers and escaped fields', () => {
      const txs: EconomyTransaction[] = [
        {
          id: 'tx1',
          timestamp: 1727250000000,
          amount: 50,
          currency: 'coins',
          type: 'earn',
          reason: 'Completed quest, boss battle',
        },
      ];

      const csv = exportTransactionsToCSV(txs);
      const lines = csv.split('\n');
      expect(lines[0]).toBe('ID,Date,Type,Amount,Currency,Reason');
      expect(lines[1]).toContain('"tx1"');
      expect(lines[1]).toContain('"earn"');
      expect(lines[1]).toContain('"50"');
      expect(lines[1]).toContain('"Completed quest, boss battle"');
    });
  });

  describe('exportQuestsToCSV', () => {
    it('formats quests to CSV correctly', () => {
      const quests: Quest[] = [
        {
          id: 'q1',
          title: 'Deep Work Session',
          category: 'daily',
          tag: 'Coding',
          difficulty: 'elite',
          xpReward: 150,
          coinsReward: 60,
          isCompleted: true,
          completedAt: '2026-09-25T14:00:00Z',
        },
      ];

      const csv = exportQuestsToCSV(quests);
      const lines = csv.split('\n');
      expect(lines[0]).toBe('ID,Title,Category,Tag,Difficulty,XP Reward,Coins Reward,Completed,Completed At');
      expect(lines[1]).toContain('"Deep Work Session"');
      expect(lines[1]).toContain('"elite"');
    });
  });

  describe('exportHabitsToCSV', () => {
    it('formats habits to CSV correctly', () => {
      const habits: Habit[] = [
        {
          id: 'h1',
          title: 'Morning Meditation',
          category: 'mind',
          frequency: 'daily',
          streakCount: 14,
          bestStreak: 21,
          xpYield: 30,
          coinYield: 15,
          completedDates: ['2026-09-24', '2026-09-25'],
        },
      ];

      const csv = exportHabitsToCSV(habits);
      const lines = csv.split('\n');
      expect(lines[0]).toBe('ID,Title,Category,Frequency,Current Streak,Best Streak,XP Yield,Coin Yield,Total Check-ins');
      expect(lines[1]).toContain('"Morning Meditation"');
      expect(lines[1]).toContain('"14"');
      expect(lines[1]).toContain('"2"');
    });
  });
});
