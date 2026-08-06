import type { ScenarioModel, LeverValues, ScenarioResult } from '@/types';
import { asNumber, asString } from '@/lib/format';

/** §9.2 COO — origin transition, landed cost and service. Pure arithmetic. */
function compute(values: LeverValues): ScenarioResult {
  const air = asString(values.air, 'none');
  const exChina = asNumber(values.exChina, 46);
  const weeksOfSupply = asNumber(values.weeksOfSupply, 9.8);

  const pull = ({ none: 0, part: 2.4, full: 3.5 } as Record<string, number>)[air] ?? 0; // tariff points recovered
  const cost = ({ none: 0, part: 1.3, full: 2.1 } as Record<string, number>)[air] ?? 0; // $M
  const tariff = Math.max(28, 44 - (exChina - 40) * 0.28 - pull);
  const landedCost = 1.62 + (tariff - 28) * 0.02 + cost * 0.008;
  const fillRate = Math.min(99.2, 92.5 + (weeksOfSupply - 8) * 1.05);
  const workingCapital = (weeksOfSupply - 8) * 41; // $M above floor

  return {
    derivationRows: [
      ['Baseline landed cost per unit', '$1.62'],
      ['Realised tariff rate', tariff.toFixed(1) + '%'],
      ['Tariff component per unit', '+$' + ((tariff - 28) * 0.02).toFixed(3)],
      ['Air freight amortised per unit', '+$' + (cost * 0.008).toFixed(3)],
      ['Landed cost per unit', '$' + landedCost.toFixed(3)],
      ['Working capital tied to inventory', '$' + workingCapital.toFixed(0) + 'M above floor'],
    ],
    outputs: [
      { label: 'Landed cost / unit', value: '$' + landedCost.toFixed(2), baseline: 1.94, current: landedCost, invert: true },
      { label: 'Realised tariff rate', value: tariff.toFixed(1) + '%', baseline: 38.5, current: tariff, invert: true },
      { label: 'Fill rate', value: fillRate.toFixed(1) + '%', baseline: 96.4, current: fillRate },
      { label: 'Working capital', value: '$' + workingCapital.toFixed(0) + 'M', baseline: 74, current: workingCapital, invert: true },
    ],
    judgements: [
      {
        agent: 'sup',
        heading: 'Supply — qualification reality',
        text:
          exChina > 55
            ? 'Above 55% assumes two plants beyond the current qualification pipeline. That build takes two quarters. It is not available this year.'
            : 'The existing qualification pipeline can reach this level.',
      },
      {
        agent: 'fin',
        heading: 'Finance — working-capital ceiling',
        text:
          weeksOfSupply > 10.5
            ? 'Above 10.5 weeks breaks the working-capital ceiling. Inventory funding would need Finance approval.'
            : 'Inventory stays within the agreed working-capital ceiling.',
      },
      {
        agent: 'com',
        heading: 'Commercial — service impact',
        text:
          fillRate < 96
            ? 'Below 96% fill, the two largest accounts start applying service penalties. Shelf position is at risk.'
            : 'Service levels hold at both major accounts.',
      },
    ],
  };
}

export const cooModel: ScenarioModel = {
  id: 'coo',
  title: 'Origin transition, landed cost and service',
  read: 'You’re modelling origin transition, landed cost, and service against today’s plan. Every move trades cost against capacity and fill.',
  baselineLabel: 'today’s plan',
  lede: 'Computes landed cost and fill rate from qualification pace and freight mode. Supply and Finance weigh the trade on their own.',
  levers: [
    {
      id: 'air',
      kind: 'segments',
      label: 'Air freight authorisation',
      options: [['none', 'None'], ['part', 'Partial $1.3M'], ['full', 'Full $2.1M']],
      default: 'none',
    },
    { id: 'exChina', kind: 'range', label: 'Capacity outside China', min: 40, max: 65, default: 46, step: 1, unit: '%', loCaption: '40%', hiCaption: '65%' },
    { id: 'weeksOfSupply', kind: 'range', label: 'Weeks of supply target', min: 8, max: 12, default: 9.8, step: 0.1, unit: ' wks', loCaption: '8.0', hiCaption: '12.0' },
  ],
  compute,
};
