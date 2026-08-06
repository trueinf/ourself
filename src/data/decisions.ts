import type { ClosedDecision } from '@/types';

/**
 * §7.2 Closed-decision history — required, not optional. An enterprise
 * decision tool that never shows its own track record is not credible.
 * At least one entry per persona is marked "backfired" (e.g. Chopra's
 * "Let each pilot define its own data contracts → now the root of the
 * reconciliation debt"). Ported from the prototype DECIDED map; the
 * result codes ok/mixed/bad are renamed to worked/mixed/backfired.
 */
export const DECISIONS: Record<string, ClosedDecision[]> = {
  fields: [
    {
      title: 'Reinvest refund tranche 1 into the face price reversal',
      outcome: 'Units +2.1 pts against a modelled +1.4',
      when: '11 days ago',
      result: 'worked',
    },
    {
      title: 'Hold Q1 opex flat to absorb the SAP transition',
      outcome: 'Delivered, $2.1M under',
      when: '3 weeks ago',
      result: 'worked',
    },
    {
      title: 'Defer the Naturium media step-up to Q2',
      outcome: 'Share slipped 0.3 pts in the gap',
      when: '5 weeks ago',
      result: 'mixed',
    },
  ],
  franks: [
    {
      title: 'Dual-source the top 20 SKUs by tariff exposure',
      outcome: 'Ex-China capacity +1.2 pts this quarter',
      when: '2 weeks ago',
      result: 'worked',
    },
    {
      title: 'Hold weeks of supply at 9.5 through the transition',
      outcome: 'Drifted to 9.8. Fill rate held',
      when: '4 weeks ago',
      result: 'mixed',
    },
  ],
  savur: [
    {
      title: 'Fund the spring awareness campaign at 28% of net sales',
      outcome: 'Awareness +2 pts. Conversion not yet proven',
      when: '8 weeks ago',
      result: 'mixed',
    },
    {
      title: 'Move creator budget from macro to mid-tier',
      outcome: 'Engagement +18%, CAC flat',
      when: '6 weeks ago',
      result: 'worked',
    },
  ],
  chopra: [
    {
      title: 'Standardise agent orchestration on one framework',
      outcome: 'Cost per workflow −22%',
      when: '7 weeks ago',
      result: 'worked',
    },
    {
      title: 'Let each pilot define its own data contracts',
      outcome: 'Now the root of the reconciliation debt',
      when: '6 months ago',
      result: 'backfired',
    },
  ],
  amin: [
    {
      title: 'Take the $1 price increase across the range',
      outcome: 'Margin held at 73%. Cost ~5 pts of units',
      when: 'Last year',
      result: 'mixed',
    },
    {
      title: 'Acquire rhode',
      outcome: '~$390M at ~80% growth. Drives most of FY27',
      when: 'Aug 2025',
      result: 'worked',
    },
    {
      title: 'Commit to 24–26% marketing envelope publicly',
      outcome: 'Now the constraint in three open decisions',
      when: 'At FY27 guide',
      result: 'mixed',
    },
  ],
  laar: [
    {
      title: 'Trade promotional depth for linear footage at Walmart',
      outcome: '+20% footage. Deductions +30 bps',
      when: '9 weeks ago',
      result: 'mixed',
    },
    {
      title: 'Prioritise face over lip in the spring reset',
      outcome: 'Face share +0.6 pts. Lip gap widened',
      when: '12 weeks ago',
      result: 'mixed',
    },
  ],
  marchisotto: [
    {
      title: 'Run 29 launches in the spring slate',
      outcome: 'Hit rate 31% against a 40% norm',
      when: 'This quarter',
      result: 'backfired',
    },
    {
      title: 'Push skincare to a quarter of the portfolio',
      outcome: '24.1% and compounding',
      when: 'Over 3 years',
      result: 'worked',
    },
  ],
  milsten: [
    {
      title: 'File UK SCPN separately rather than wait for EU alignment',
      outcome: 'Cleared 42 of 42 launches',
      when: 'Ongoing',
      result: 'worked',
    },
    {
      title: 'Combine the People and Legal functions under one office',
      outcome: 'Engagement 88%, 18 pts above benchmark',
      when: '2016',
      result: 'worked',
    },
  ],
};
