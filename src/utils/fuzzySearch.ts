export function scoreFuzzyMatch(text: string, query: string): number {
  const target = text.toLowerCase();
  const pattern = query.toLowerCase().trim();

  if (!pattern) return 100;
  if (target === pattern) return 1000;
  if (target.startsWith(pattern)) return 500 + (100 - pattern.length);
  if (target.includes(pattern)) return 200 + (100 - target.indexOf(pattern));

  // Subsequence character matching
  let tIdx = 0;
  let pIdx = 0;
  let score = 0;
  let consecutive = 0;

  while (tIdx < target.length && pIdx < pattern.length) {
    if (target[tIdx] === pattern[pIdx]) {
      pIdx += 1;
      consecutive += 1;
      score += 10 + consecutive * 5;
    } else {
      consecutive = 0;
    }
    tIdx += 1;
  }

  return pIdx === pattern.length ? score : -1;
}

export function fuzzyFilter<T>(
  items: T[],
  query: string,
  getText: (item: T) => string
): T[] {
  if (!query.trim()) return items;

  const scored = items
    .map((item) => ({
      item,
      score: scoreFuzzyMatch(getText(item), query),
    }))
    .filter((entry) => entry.score >= 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.map((entry) => entry.item);
}
