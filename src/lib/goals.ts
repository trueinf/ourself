import type { Kpi, Insight } from '@/types';

/**
 * Goal-relevance ranking. An objective function is a weighting over the same
 * governed facts (§8.1a): changing the goal re-ranks which KPIs and insights
 * lead, but never changes a figure. Scoring is a pure, deterministic keyword
 * overlap — no LLM, no fabricated numbers.
 */
const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'your', 'our', 'are', 'was',
  'will', 'not', 'but', 'out', 'its', 'their', 'have', 'has', 'only', 'more', 'than', 'what',
  'when', 'where', 'which', 'while', 'keep', 'make', 'get', 'every', 'all', 'can', 'whatever',
  'them', 'then', 'over', 'onto', 'top', 'off',
]);

/** Turn a free-text goal into scoring keywords (drops stopwords and short words). */
export function tokenizeGoal(text: string): string[] {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((w) => w.length >= 4 && !STOPWORDS.has(w)),
    ),
  );
}

/** Count how many of the goal's keywords appear in an item's text. */
export function scoreText(text: string, keywords: string[]): number {
  const t = text.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    if (kw && t.includes(kw.toLowerCase())) score += 1;
  }
  return score;
}

export const kpiText = (k: Kpi): string => `${k.label} ${k.note} ${k.delta}`;
export const insightText = (i: Insight): string =>
  `${i.headline} ${i.why} ${i.pills.map((p) => p.text).join(' ')}`;

export interface Ranked<T> {
  item: T;
  score: number;
}

/**
 * Stable, relevance-descending ranking. Ties keep the incoming order, so a
 * pre-sort (e.g. insights by severity) is preserved within equal scores. With
 * no keywords, everything scores 0 and the original order is returned.
 */
export function rankByGoal<T>(items: T[], keywords: string[], textOf: (t: T) => string): Ranked<T>[] {
  const scored = items.map((item, index) => ({
    item,
    score: keywords.length ? scoreText(textOf(item), keywords) : 0,
    index,
  }));
  scored.sort((a, b) => b.score - a.score || a.index - b.index);
  return scored.map(({ item, score }) => ({ item, score }));
}
