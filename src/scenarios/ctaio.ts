import type { ScenarioModel, LeverValues, ScenarioResult } from '@/types';
import { asNumber, asString } from '@/lib/format';

/** §9.4 CTAIO — semantic layer, pilot throughput and cost. Pure arithmetic. */
function compute(values: LeverValues): ScenarioResult {
  const entityCoverage = asNumber(values.entityCoverage, 38);
  const approach = asString(values.approach, 'defer');
  const funding = asNumber(values.funding, 4.1);

  const coverage =
    approach === 'full'
      ? Math.max(entityCoverage, 82)
      : approach === 'top6'
        ? Math.max(entityCoverage, 61)
        : entityCoverage;
  const buildTimeIndex = 100 - coverage * 0.44; // 100 = today
  const paused = ({ defer: 0, top6: 1, full: 4 } as Record<string, number>)[approach] ?? 0;
  const pilotsInProduction = 14 + (coverage - 38) * 0.3 + funding * 2.1 - paused * 1.4;
  const costPerWorkflow = 0.31 * (1 - coverage * 0.0031);

  return {
    derivationRows: [
      ['Current shared entity coverage', '38%'],
      ['Coverage after build approach', coverage.toFixed(0) + '%'],
      ['Relative build time per pilot', buildTimeIndex.toFixed(0) + ' index (100 = today)'],
      ['Pilots paused during build', paused.toString()],
      ['Production funding', '$' + funding.toFixed(1) + 'M'],
      ['Projected pilots in production', pilotsInProduction.toFixed(0) + ' of 85'],
    ],
    outputs: [
      { label: 'Entity coverage', value: coverage.toFixed(0) + '%', baseline: 38, current: coverage },
      { label: 'Build time index', value: buildTimeIndex.toFixed(0), baseline: 100, current: buildTimeIndex, invert: true },
      { label: 'Pilots in production', value: pilotsInProduction.toFixed(0) + ' / 85', baseline: 14, current: pilotsInProduction },
      { label: 'Cost per workflow', value: '$' + costPerWorkflow.toFixed(3), baseline: 0.31, current: costPerWorkflow, invert: true },
    ],
    judgements: [
      {
        agent: 'fin',
        heading: 'Finance — return test',
        text:
          funding > 5
            ? 'Above $5M the request runs past the value attributed to measured pilots. It will get cut back to the four that clear cost of capital.'
            : 'Funding stays within the range that measured pilots can defend.',
      },
      {
        agent: 'tec',
        heading: 'Technology — build reality',
        text:
          approach === 'full'
            ? 'A full layer takes two quarters and pauses four in-flight pilots. Throughput drops before it recovers.'
            : approach === 'top6'
              ? 'Top six entities cover more than half of pilot usage in one quarter and pause one pilot.'
              : 'Deferring keeps velocity. Every new pilot adds reconciliation debt.',
      },
      {
        agent: 'com',
        heading: 'Commercial — trust',
        text:
          coverage < 50
            ? 'Below 50% coverage, pilots keep reporting different numbers for the same account. Business trust stays low no matter how many pilots run.'
            : 'Coverage is high enough that pilots reconcile on the entities the business argues about.',
      },
    ],
  };
}

export const ctaioModel: ScenarioModel = {
  id: 'ctaio',
  title: 'Semantic layer, pilot throughput and cost',
  read: 'You’re modelling the semantic layer, throughput, and cost against today’s 38% coverage. Every move trades build time against pilot velocity.',
  baselineLabel: 'today',
  lede: 'Computes pilot build time and production throughput from semantic coverage. Finance weighs the return on its own.',
  levers: [
    { id: 'entityCoverage', kind: 'range', label: 'Shared entity coverage', min: 0, max: 100, default: 38, step: 1, unit: '%', loCaption: '0%', hiCaption: '100%' },
    {
      id: 'approach',
      kind: 'segments',
      label: 'Build approach',
      options: [['defer', 'Defer'], ['top6', 'Top 6 entities'], ['full', 'Full layer']],
      default: 'defer',
    },
    { id: 'funding', kind: 'range', label: 'Production funding', min: 0, max: 8, default: 4.1, step: 0.1, unit: 'M', loCaption: '$0M', hiCaption: '$8M' },
  ],
  compute,
};
