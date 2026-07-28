import type { Insight } from '@/types';
import { PERSONAS } from './personas';
import { tokenizeGoal, scoreText, insightText } from '@/lib/goals';

/**
 * Ask is the natural-language lens over the same governed facts the rest of the
 * app shows. A question resolves to a specific insight, and the answer is
 * assembled from THAT insight's findings, positions, proof and sources — not a
 * canned string. Suggested questions map explicitly; typed questions fall back
 * to a best keyword match (the same scoring the goal editor uses).
 */
export const ALL_INSIGHTS: Insight[] = PERSONAS.flatMap((p) => p.insights);
export const INSIGHT_BY_ID: Record<string, Insight> = Object.fromEntries(
  ALL_INSIGHTS.map((i) => [i.id, i] as const),
);

/** Suggested-question text → insight id. Cross-office questions map across
 *  personas on purpose (Ask crosses every office). */
export const QUESTION_TO_INSIGHT: Record<string, string> = {
  // Fields
  'Why is the realised tariff rate above our 35% assumption?': 'f2',
  'If we extend the price reversal to lip, what happens to margin, units and supply?': 'f3',
  'Which of the 85 AI pilots are in production, and what did they return?': 't2',
  'What does the rhode base transition do to reported organic growth in Q2?': 'f4',
  // Franks
  'What would it cost to pull the lip line qualification forward to July?': 'o1',
  'Which SKUs carry the worst landed cost against plan, and why?': 'o2',
  'If we hold inventory at 9.8 weeks, what breaks first — fill rate or working capital?': 'o1',
  'How much of the tariff increase have supplier concessions actually absorbed?': 'o3',
  // Savur
  'How long does an awareness gain take to convert to units at e.l.f.?': 'm1',
  'What is driving our GEO visibility — product pages or campaigns?': 't3',
  'If marketing holds at 26%, which line should absorb the cut?': 'm1',
  'Where is prospecting CAC deteriorating fastest?': 'm3',
  // Chopra
  'How many pilots define the same entity differently, and what does it cost us?': 't1',
  'Which pilots clear cost of capital, and which need a measurement plan?': 't2',
  'What actually drives our GEO visibility?': 't3',
  'If we build the semantic layer now, what slips?': 't1',
  // Amin
  'Where are my executives optimising against each other right now?': 'c1',
  'Is the organic slowdown an air pocket or structural deceleration?': 'c2',
  'What happens to reported growth when rhode enters the base?': 'c2',
  'What would it take to protect the growth streak this quarter?': 'c2',
  // Laar
  'Where is our share of shelf furthest ahead of our share of sales?': 'l3',
  'When can lip volume actually ship?': 'l1',
  'Which accounts are driving the deduction increase?': 'l2',
  'What does the face reversal do to units per linear foot?': 'l3',
  // Marchisotto
  'Were the spring misses product or distribution?': 'b1',
  'Which categories carry the widest white space right now?': 'b2',
  'What is the real hit rate once under-supported launches are excluded?': 'b1',
  // Milsten
  'Which launches are at risk of missing their clearance window?': 'g2',
  'What does the skincare mix shift do to our substantiation load?': 'g2',
  'Which AI deployments need classification before the enforcement date?': 'g1',
};

/** Resolve a question to the governed insight it is asking about. */
export function resolveQuestion(question: string): Insight | null {
  const key = question.trim();
  const mapped = QUESTION_TO_INSIGHT[key];
  if (mapped && INSIGHT_BY_ID[mapped]) return INSIGHT_BY_ID[mapped]!;

  const keywords = tokenizeGoal(question);
  let best: Insight | null = null;
  let bestScore = 0;
  for (const insight of ALL_INSIGHTS) {
    const s = scoreText(insightText(insight), keywords);
    if (s > bestScore) {
      bestScore = s;
      best = insight;
    }
  }
  return bestScore > 0 ? best : null;
}

const SCENARIO_RE = /^if\b|what would it|what happens if|what would it take|if we|if marketing/i;

/** Is the question a what-if the user should be routed to Scenarios to model? */
export function isScenarioQuestion(question: string): boolean {
  return SCENARIO_RE.test(question.trim());
}
