import { describe, it, expect } from 'vitest';
import { scoreFuzzyMatch, fuzzyFilter } from '../fuzzySearch';

describe('fuzzySearch', () => {
  describe('scoreFuzzyMatch', () => {
    it('scores exact matches highest', () => {
      const exact = scoreFuzzyMatch('quests', 'quests');
      const prefix = scoreFuzzyMatch('quests view', 'quests');
      const partial = scoreFuzzyMatch('my quests list', 'quests');

      expect(exact).toBeGreaterThan(prefix);
      expect(prefix).toBeGreaterThan(partial);
    });

    it('returns -1 for non-matches', () => {
      expect(scoreFuzzyMatch('focus arena', 'xyz')).toBe(-1);
    });
  });

  describe('fuzzyFilter', () => {
    it('filters and ranks candidate items by relevance', () => {
      const candidates = [
        { id: 1, title: 'Citadel Ascension' },
        { id: 2, title: 'Focus Timer' },
        { id: 3, title: 'Quick Focus Sprint' },
      ];

      const results = fuzzyFilter(candidates, 'focus', (c) => c.title);
      expect(results).toHaveLength(2);
      expect(results[0].title).toBe('Focus Timer');
      expect(results[1].title).toBe('Quick Focus Sprint');
    });
  });
});
