import type { ScenarioModel, LeverValues, ScenarioResult } from '@/types';
import { asNumber, asString } from '@/lib/format';

/** §9.3 CMO — media mix, awareness and discovery. Pure arithmetic. */
function compute(values: LeverValues): ScenarioResult {
  const pct = asNumber(values.pct, 26);
  const mix = asString(values.mix, 'balanced');
  const geo = asNumber(values.geo, 3);

  const spend = (1850 * pct) / 100;
  const mixAwareness = ({ brand: 1.35, balanced: 1.0, performance: 0.62 } as Record<string, number>)[mix] ?? 1.0;
  const mixCac = ({ brand: 1.22, balanced: 1.0, performance: 0.81 } as Record<string, number>)[mix] ?? 1.0;
  const awareness = 45 + (pct - 24) * 0.62 * mixAwareness + geo * 0.14;
  const cac = 18.4 * mixCac * (1 - (pct - 24) * 0.012) * (1 - geo * 0.011);
  const geoVisibility = 31.4 + geo * 1.35;

  return {
    derivationRows: [
      ['Net sales base', '$1,850.0M'],
      ['Marketing spend at ' + pct.toFixed(1) + '%', '$' + spend.toFixed(1) + 'M'],
      ['Weighting multiplier, awareness', '×' + mixAwareness.toFixed(2)],
      ['GEO engineering allocation', '$' + ((spend * geo) / 100).toFixed(1) + 'M'],
      ['Modelled unaided awareness', awareness.toFixed(1) + '%'],
      ['Modelled blended CAC', '$' + cac.toFixed(2)],
    ],
    outputs: [
      { label: 'Marketing spend', value: '$' + spend.toFixed(0) + 'M', baseline: 481, current: spend, invert: true },
      { label: 'Unaided awareness', value: awareness.toFixed(1) + '%', baseline: 47, current: awareness },
      { label: 'Blended CAC', value: '$' + cac.toFixed(2), baseline: 18.4, current: cac, invert: true },
      { label: 'GEO visibility', value: geoVisibility.toFixed(1) + '%', baseline: 31.4, current: geoVisibility },
    ],
    judgements: [
      {
        agent: 'fin',
        heading: 'Finance — budget commitment',
        text:
          pct > 26
            ? 'Above 26% breaks the range committed to investors. Holding it there means an EBITDA restatement or an offset somewhere else.'
            : 'Spend stays inside the committed 24–26% budget.',
      },
      {
        agent: 'tec',
        heading: 'Technology — GEO ownership',
        text:
          geo > 6
            ? 'At this allocation GEO work runs as an engineering programme. Fund and govern it like one, and keep it out of the media plan.'
            : 'GEO allocation is small enough to sit inside the media plan.',
      },
      {
        agent: 'com',
        heading: 'Commercial — measurability',
        text:
          mix === 'brand'
            ? 'A brand-led mix shows no measurable sell-through inside the quarter. Finance will challenge it first when cuts come.'
            : 'The mix keeps enough performance weight to show sell-through within the quarter.',
      },
    ],
  };
}

export const cmoModel: ScenarioModel = {
  id: 'cmo',
  title: 'Media mix, awareness and discovery',
  read: 'You’re modelling media mix, awareness, and discovery against the committed plan. Every move trades spend against reach and CAC.',
  baselineLabel: 'the plan',
  lede: 'Computes awareness, CAC, and conversion from spend and mix. Finance and Technology weigh the constraints on their own.',
  levers: [
    { id: 'pct', kind: 'range', label: 'Marketing % of net sales', min: 22, max: 31, default: 26, step: 0.1, unit: '%', loCaption: '22%', hiCaption: '31%' },
    {
      id: 'mix',
      kind: 'segments',
      label: 'Weighting',
      options: [['brand', 'Brand-led'], ['balanced', 'Balanced'], ['performance', 'Performance-led']],
      default: 'balanced',
    },
    { id: 'geo', kind: 'range', label: 'GEO engineering share of spend', min: 0, max: 12, default: 3, step: 0.5, unit: '%', loCaption: '0%', hiCaption: '12%' },
  ],
  compute,
};
