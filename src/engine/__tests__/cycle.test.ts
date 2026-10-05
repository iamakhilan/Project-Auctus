import { describe, it, expect } from 'vitest';
import type { Quest } from '../../types';

// duplicate of GameState hasDependencyCycle for unit test coverage — keep logic synced
function hasDependencyCycle(quests: Quest[]): boolean {
  const adj = new Map<string, string[]>();
  for (const q of quests) adj.set(q.id, q.dependsOn ?? []);
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const dfs = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    for (const dep of adj.get(id) ?? []) if (dfs(dep)) return true;
    visiting.delete(id); visited.add(id); return false;
  };
  for (const q of quests) if (dfs(q.id)) return true;
  return false;
}

describe('dependency cycle', () => {
  it('detects cycle', () => {
    const a: Quest = { id: 'a', title: 'A', category: 'bounty', tag: 'Study', xpReward: 10, coinsReward: 5, isCompleted: false, dependsOn: ['b'] } as Quest;
    const b: Quest = { id: 'b', title: 'B', category: 'bounty', tag: 'Study', xpReward: 10, coinsReward: 5, isCompleted: false, dependsOn: ['a'] } as Quest;
    expect(hasDependencyCycle([a,b])).toBe(true);
  });
  it('allows DAG', () => {
    const a: Quest = { id: 'a', title: 'A', category: 'bounty', tag: 'Study', xpReward: 10, coinsReward: 5, isCompleted: false } as Quest;
    const b: Quest = { id: 'b', title: 'B', category: 'bounty', tag: 'Study', xpReward: 10, coinsReward: 5, isCompleted: false, dependsOn: ['a'] } as Quest;
    expect(hasDependencyCycle([a,b])).toBe(false);
  });
  it('tolerates missing dep id (not a cycle)', () => {
    const q: Quest = { id: 'q', title: 'Q', category: 'bounty', tag: 'Study', xpReward: 10, coinsReward: 5, isCompleted: false, dependsOn: ['missing'] } as Quest;
    expect(hasDependencyCycle([q])).toBe(false);
  });
});
