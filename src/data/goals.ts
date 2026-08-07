import type { GoalPreset } from '@/types';

/**
 * Alternative objective functions per persona. Each stays within that office's
 * remit (its governed facts), and its keywords are chosen to match the office's
 * own KPIs and insights so applying it visibly re-ranks the surface. Changing
 * the goal changes what leads — never the numbers themselves.
 */
export const GOAL_PRESETS: Record<string, GoalPreset[]> = {
  fields: [
    {
      label: 'Protect guidance',
      objective: 'Hold FY2027 guidance and the marketing budget through the tariff pressure.',
      keywords: ['guidance', 'budget', 'marketing', 'tariff', 'ebitda', 'assumption', 'restatement'],
    },
    {
      label: 'Recover the top line',
      objective: 'Get back to growth. Defend velocity and extend the price reversal.',
      keywords: ['units', 'price', 'reversal', 'organic', 'growth', 'net sales', 'elasticity', 'rhode'],
    },
  ],
  franks: [
    {
      label: 'Cut landed cost',
      objective: 'Bring landed cost down and recover tariff and freight exposure.',
      keywords: ['landed', 'cost', 'tariff', 'freight', 'china', 'concession', 'offset'],
    },
    {
      label: 'Protect service',
      objective: 'Hold fill rate and shelf service through the origin transition.',
      keywords: ['fill', 'rate', 'service', 'supply', 'capacity', 'lip', 'weeks'],
    },
  ],
  savur: [
    {
      label: 'Defend the spend',
      objective: 'Protect the marketing budget until the awareness gain converts.',
      keywords: ['marketing', 'budget', 'awareness', 'spend', 'convert'],
    },
    {
      label: 'Win discovery',
      objective: 'Get ahead in AI-answer discovery.',
      keywords: ['geo', 'ai answer', 'visibility', 'discovery', 'engines', 'compounding'],
    },
    {
      label: 'Lower CAC',
      objective: 'Bring the cost of acquisition down.',
      keywords: ['cac', 'prospecting', 'social', 'roas', 'retail media'],
    },
  ],
  chopra: [
    {
      label: 'Prove the return',
      objective: 'Fund only the pilots that clear their cost of capital.',
      keywords: ['value', 'attributed', 'cost', 'workflow', 'budget', 'return', 'pilots'],
    },
    {
      label: 'Build the substrate',
      objective: 'Ship the shared semantic layer so pilots build on it.',
      keywords: ['semantic', 'layer', 'entity', 'coverage', 'definition', 'launch', 'market', 'data model'],
    },
    {
      label: 'Scale adoption',
      objective: 'Get the whole company using the AI hub every day.',
      keywords: ['adoption', 'employee', 'hub', 'production', 'pilots'],
    },
  ],
  amin: [
    {
      label: 'Protect the streak',
      objective: 'Keep the growth streak alive through the base transition.',
      keywords: ['growth', 'streak', 'organic', 'net sales', 'comp', 'rhode', 'quarters'],
    },
    {
      label: 'Widen the lead',
      objective: 'Widen the operational lead with international reach and multi-country supply.',
      keywords: ['international', 'capacity', 'china', 'operational', 'awareness'],
    },
    {
      label: 'Make the call',
      objective: 'Resolve the cross-team trades only I can settle.',
      keywords: ['offices', 'reserve', 'lip', 'tariff', 'refund', 'price', 'reversal'],
    },
  ],
  laar: [
    {
      label: 'Win the shelf',
      objective: 'Take more shelf where our share of sales already leads.',
      keywords: ['share', 'shelf', 'target', 'lip', 'units', 'foot', 'productivity'],
    },
    {
      label: 'Plug the leakage',
      objective: 'Stop the gross-to-net leakage at the top accounts.',
      keywords: ['deduction', 'leakage', 'account', 'gross', 'claim'],
    },
    {
      label: 'Protect supply',
      objective: 'Only sell in what operations can actually ship.',
      keywords: ['fill', 'supply', 'lip', 'capacity', 'ship', 'august'],
    },
  ],
  marchisotto: [
    {
      label: 'Fix the funnel',
      objective: 'Restore the innovation hit rate across the slate.',
      keywords: ['innovation', 'hit rate', 'slate', 'launches', 'spring', 'sku'],
    },
    {
      label: 'Grow the second core',
      objective: 'Scale skincare into a full second core category.',
      keywords: ['skincare', 'category', 'naturium', 'consumption', 'core'],
    },
  ],
  milsten: [
    {
      label: 'Keep speed legal',
      objective: 'Clear every launch on time as the mix gets heavier.',
      keywords: ['clearance', 'launches', 'cleared', 'substantiation', 'skincare', 'claims'],
    },
    {
      label: 'Govern the agents',
      objective: 'Classify the deployed AI agents before the enforcement date.',
      keywords: ['ai act', 'agents', 'classification', 'review', 'enforcement'],
    },
    {
      label: 'Keep the people',
      objective: 'Keep engagement up as the pace stays high.',
      keywords: ['engagement', 'people', 'benchmark', 'participation'],
    },
  ],
};
