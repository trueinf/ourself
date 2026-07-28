import type { ScenarioModel, LeverValues, ScenarioResult } from '@/types';
import { asNumber, asString } from '@/lib/format';

/**
 * §9.1 CFO — margin, price and the tariff assumption.
 * Pure function, no LLM involvement in any number. This is the
 * deterministic side of the reasoning/compute contract (§2.1): the
 * agents below reason about feasibility only; every figure here is
 * hand-checkable arithmetic. A CFO will test it in under a minute.
 */
function compute(values: LeverValues): ScenarioResult {
  const scope = asString(values.scope, 'face');
  const tariffInput = asNumber(values.tariff, 38.5);
  const marketing = asNumber(values.marketing, 26);
  const pace = asString(values.pace, 'slow');

  const base = 1850; // FY27 guide midpoint, $M
  const gmBase = 73.0;
  const unitLift = ({ none: 0, face: 1.4, facelip: 3.0, all: 4.1 } as Record<string, number>)[scope] ?? 0;
  const aspChange = ({ none: 0, face: -0.6, facelip: -1.3, all: -1.9 } as Record<string, number>)[scope] ?? 0;
  const paceAdj = ({ slow: 1.5, plan: 0, fast: -2.0 } as Record<string, number>)[pace] ?? 0;

  const tariff = Math.max(28, tariffInput + paceAdj);
  const netSales = base * (1 + unitLift / 100) * (1 + aspChange / 100);
  const grossMargin = gmBase - (tariff - 35) * 0.18 + aspChange * 0.55; // 18 bps per 100 bps tariff
  const grossProfit = (netSales * grossMargin) / 100;
  const marketingCost = (netSales * marketing) / 100;
  const adjEbitda = grossProfit - marketingCost - 380;
  const adjEps = ((adjEbitda - 45 - 58) * 0.79) / 57;

  return {
    derivationRows: [
      ['Net sales base (FY27 guide, mid)', '$1,850.0M'],
      ['Unit lift from reversal scope', '+' + unitLift.toFixed(1) + '%'],
      ['Average selling price effect', aspChange.toFixed(1) + '%'],
      ['Net sales', '$' + netSales.toFixed(1) + 'M'],
      [
        'Gross margin (' + tariff.toFixed(1) + '% tariff, ' + ((tariff - 35) * 0.18).toFixed(0) + ' bps drag)',
        grossMargin.toFixed(2) + '%',
      ],
      ['Gross profit', '$' + grossProfit.toFixed(1) + 'M'],
      ['Marketing at ' + marketing.toFixed(1) + '%', '−$' + marketingCost.toFixed(1) + 'M'],
      ['Other operating expense', '−$380.0M'],
      ['Adjusted EBITDA', '$' + adjEbitda.toFixed(1) + 'M'],
    ],
    outputs: [
      { label: 'Net sales', value: '$' + (netSales / 1000).toFixed(3) + 'B', baseline: base, current: netSales },
      { label: 'Gross margin', value: grossMargin.toFixed(1) + '%', baseline: 73.0, current: grossMargin },
      { label: 'Adjusted EBITDA', value: '$' + adjEbitda.toFixed(0) + 'M', baseline: 382, current: adjEbitda },
      { label: 'Adjusted EPS', value: '$' + adjEps.toFixed(2), baseline: 3.3, current: adjEps },
    ],
    judgements: [
      {
        agent: 'sup',
        heading: 'Supply — feasibility',
        text:
          scope === 'facelip' || scope === 'all'
            ? 'Lip capacity is committed until August. Any lip volume before then requires premium capacity that is not in this calculation.'
            : 'Face volume is servable from qualified lines. No supply constraint at this scope.',
      },
      {
        agent: 'fin',
        heading: 'Finance — guidance exposure',
        text:
          tariff > 36
            ? 'A realised rate above 36% puts the published 35% assumption at risk of restatement at the Q2 print.'
            : 'The realised rate sits within the published assumption. No restatement exposure.',
      },
      {
        agent: 'mkt',
        heading: 'Marketing — conversion lag',
        text:
          marketing < 26
            ? 'Below 26% the brand tranche is cut before the 11–14 week awareness-to-unit lag completes. Unit lift in this model may be optimistic.'
            : 'Spend supports the awareness programme through the conversion window.',
      },
    ],
  };
}

export const cfoModel: ScenarioModel = {
  id: 'cfo',
  title: 'Margin, price and the tariff assumption',
  read: 'You’re modelling margin, price and the tariff assumption against the FY2027 guide — every move is a deviation from where the company sits today.',
  baselineLabel: 'FY27 guide',
  lede: 'Levers compute over FY2027 guidance and Q1 actuals. Specialists reason about feasibility separately — no agent produces a number it did not get from a tool.',
  levers: [
    {
      id: 'scope',
      kind: 'segments',
      label: 'Price reversal scope',
      options: [['none', 'None'], ['face', 'Face only'], ['facelip', 'Face + lip'], ['all', 'Full range']],
      default: 'face',
    },
    { id: 'tariff', kind: 'range', label: 'Realised tariff rate', min: 30, max: 48, default: 38.5, step: 0.5, unit: '%', loCaption: '30%', hiCaption: '48%' },
    { id: 'marketing', kind: 'range', label: 'Marketing % of net sales', min: 24, max: 31, default: 26, step: 0.1, unit: '%', loCaption: '24%', hiCaption: '31%' },
    {
      id: 'pace',
      kind: 'segments',
      label: 'Origin transition pace',
      options: [['slow', 'Behind'], ['plan', 'On plan'], ['fast', 'Accelerated']],
      default: 'slow',
    },
  ],
  compute,
};
