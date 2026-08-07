import type { AgentFinding, InsightProof } from '@/types';
import { SYS } from './sources';

/* =============================================================
   Insight-detail content. Specialist findings are the deterministic side of
   the reasoning/compute contract (§2.1): each is a specific fact grounded in
   figures already in the insight, attributed to the office that owns the data
   and carrying its source. Nothing here invents a number.
   ============================================================= */

export const FINDINGS: Record<string, AgentFinding[]> = {
  // Fields — CFO
  f1: [
    { agent: 'fin', text: 'The overage is $8.4M, about 70 bps of EBITDA. It sits in three campaigns that have already run, so it cannot be recovered inside the year.', source: SYS.fpa },
    { agent: 'mkt', text: 'Unaided awareness rose 2 points in eight weeks. The historical awareness-to-unit lag is 11–14 weeks, which lands after the proposed Q2 cut.', source: SYS.sfmc },
    { agent: 'com', text: 'Split the overage. The retail-media tranche shows measurable sell-through lift. The brand tranche shows none yet.', source: SYS.sfmc },
  ],
  f2: [
    { agent: 'fin', text: 'Realised tariff is 38.5% against the 35% guidance assumes, roughly 63 bps of gross margin. It is restatable at Q2 earnings if it holds.', source: SYS.cust },
    { agent: 'sup', text: 'Two contract manufacturers are about six weeks behind qualification, so more volume than modelled is still clearing at the China rate.', source: SYS.sap },
  ],
  f3: [
    { agent: 'fin', text: 'Units are +2.1 pts since the reversal at a 40 bps margin cost, against a modelled 65 bps. Elasticity is running ahead of plan.', source: SYS.circana },
    { agent: 'com', text: 'The lift concentrates in face. Lip carries the widest remaining share gap against the category leader.', source: SYS.circana },
  ],
  f4: [
    { agent: 'fin', text: 'From August rhode enters the organic base. On current run-rate, reported growth converges below the mid-teens guided for Q2.', source: SYS.fpa },
  ],
  // Franks — COO
  o1: [
    { agent: 'sup', text: 'No qualified lip line has capacity before August. The Q2 plan currently assumes about 1.4M units that cannot be produced.', source: SYS.sap },
    { agent: 'com', text: 'The lip share gap is the largest single opportunity in the portfolio. Delay hands it to the category leader.', source: SYS.rl },
    { agent: 'fin', text: 'If lip cannot ship until August, tranche 2 of the refund reinvestment needs re-scoping this week.', source: SYS.fpa },
  ],
  o2: [
    { agent: 'sup', text: 'Plant A cleared line trials this week. Plant B slipped five days on documentation. Both are in qualification, not production.', source: SYS.sap },
    { agent: 'fin', text: 'The gap is the direct cause of the 350 bps tariff overage. If it is not closed by Q2 earnings, the 35% assumption is restated.', source: SYS.cust },
    { agent: 'reg', text: 'Neither site has a registration barrier. What is slowing things down is throughput in qualification, and nothing on the compliance side.', source: SYS.reg },
  ],
  o3: [
    { agent: 'sup', text: 'Negotiated concessions now cover 41% of the tariff increase against a 35% target, from two renegotiated China contracts.', source: SYS.sap },
    { agent: 'fin', text: 'It is real margin recovery, but it traded volume commitment for unit price. Watch it if demand softens.', source: SYS.sap },
  ],
  // Savur — CMO
  m1: [
    { agent: 'mkt', text: 'Awareness is +2 pts in eight weeks. Cutting before the 11–14 week conversion window wastes the spend before it works.', source: SYS.sfmc },
    { agent: 'fin', text: 'Spend is 130 bps over the committed range. The budget is a public commitment, and breaching it in Q1 removes the lever for the year.', source: SYS.fpa },
    { agent: 'com', text: 'Retail media is earning its place at 3.8× ROAS. The brand tranche has no measurable sell-through yet.', source: SYS.rl },
  ],
  m2: [
    { agent: 'mkt', text: 'Presence in AI answers rose 4.1 points across five engines this quarter. Blended CAC rose 9.5% over the same period.', source: SYS.geo },
    { agent: 'tec', text: 'Citations track product-page structure (r=0.71) far more than media spend (r=0.12). That makes it an engineering lever.', source: SYS.aws },
  ],
  m3: [
    { agent: 'mkt', text: 'Blended CAC is $18.40 against a $16.80 plan. The deterioration is entirely in prospecting. Loyalty and retained cohorts are on plan.', source: SYS.braze },
  ],
  // Chopra — CTAIO
  t1: [
    { agent: 'tec', text: 'Nine pilots have independently defined “launch” and seven “market”. Reconciling them consumes about 40% of each new build.', source: SYS.aws },
    { agent: 'fin', text: 'Put it in cost-per-pilot terms and the case makes itself: a 40% cut in build time. Pitch the number, and leave the architecture out of it.', source: SYS.fpa },
  ],
  t2: [
    { agent: 'tec', text: 'Four of the twelve have attributed value totalling $6.2M annually. The other eight are asking on qualitative grounds.', source: SYS.aws },
    { agent: 'fin', text: 'Fund the four that clear cost of capital. The remaining eight need a measurement plan before any money moves.', source: SYS.fpa },
  ],
  t3: [
    { agent: 'tec', text: 'Answer-engine citations correlate with structured product attributes at r=0.71 and with spend at r=0.12.', source: SYS.geo },
    { agent: 'mkt', text: 'If discovery is won on product-page structure, resource it as engineering rather than defending it as media.', source: SYS.aws },
  ],
  // Amin — CEO
  c1: [
    { agent: 'fin', text: 'The tariff assumption is 350 bps adrift. Spending the reserve now removes the only cushion against a Q2 restatement.', source: SYS.fpa },
    { agent: 'com', text: 'Lip is the widest share gap in the portfolio. Every quarter of delay lets the leader consolidate.', source: SYS.circana },
    { agent: 'sup', text: 'Lip lines are committed until August. Funding demand that cannot be served damages the retailer relationship.', source: SYS.sap },
  ],
  c2: [
    { agent: 'fin', text: 'rhode enters the base in three weeks. Reported growth then converges on organic, which sits below the mid-teens guidance.', source: SYS.fpa },
  ],
  c3: [
    { agent: 'fin', text: 'Units are +2.1 pts against a modelled 1.4. The value promise is out-performing its elasticity assumption.', source: SYS.circana },
    { agent: 'com', text: 'The open question is whether to fund it further while margin is under tariff pressure.', source: SYS.circana },
  ],
  // Laar — CCO
  l1: [
    { agent: 'com', text: 'The Q2 plan carries about 1.4M lip units. Building retailer expectation against supply we do not have risks the space we just won.', source: SYS.rl },
    { agent: 'sup', text: 'Lip lines are committed through Q2. Premium capacity exists, but at a cost Finance has not approved.', source: SYS.sap },
    { agent: 'fin', text: 'If lip cannot ship until August, the refund reinvestment tranche needs re-scoping this week.', source: SYS.fpa },
  ],
  l2: [
    { agent: 'com', text: 'Deductions are +30 bps over two quarters, concentrated in two accounts filing claims faster than they are validated.', source: SYS.sap },
    { agent: 'fin', text: 'It is gross-to-net leakage, real margin, and it compounds until the validation backlog is cleared.', source: SYS.sap },
  ],
  l3: [
    { agent: 'com', text: 'Units per linear foot on the reversed face range are +5.4%. That is the argument for the next Walmart space negotiation.', source: SYS.rl },
  ],
  // Marchisotto — President, Brands
  b1: [
    { agent: 'brd', text: 'Nine of 29 spring launches are hitting criteria, 31% against a 40% norm. That gap compounds across a 100-plus launch year.', source: SYS.circana },
    { agent: 'com', text: 'Three of the misses are distribution, not product. They never got the doors they were planned against.', source: SYS.pol },
    { agent: 'mkt', text: 'The slate launched into a spend pause. Judging product quality on an under-supported launch is the wrong read.', source: SYS.sfmc },
  ],
  b2: [
    { agent: 'brd', text: 'Skincare has moved from 9% to 24.1% of consumption in three years. Treat it as a second core.', source: SYS.circana },
    { agent: 'reg', text: 'It carries heavier substantiation and different formulation and registration dynamics than colour.', source: SYS.reg },
  ],
  // Milsten — GC & CPO
  g1: [
    { agent: 'reg', text: 'Three deployed customer-facing agents may fall inside the high-risk class. Enforcement dates are fixed regardless of internal review.', source: SYS.reg },
    { agent: 'tec', text: 'Technical documentation is in preparation. Two of the three read as limited-risk on current interpretation.', source: SYS.aws },
  ],
  g2: [
    { agent: 'reg', text: 'Median clearance is 19 days against 16 last year, driven by the separate UK SCPN route and heavier skincare substantiation.', source: SYS.reg },
    { agent: 'brd', text: 'Three extra days is tolerable now. At 25 it starts costing launch windows.', source: SYS.reg },
  ],
};

/** insight id → Focus item id it feeds (same persona). */
export const FEEDS_DECISION: Record<string, string> = {
  f1: 'q2',
  f3: 'q1',
  o1: 'oq2',
  o2: 'oq1',
  m1: 'mq1',
  t1: 'tq1',
  t2: 'tq2',
  c1: 'cq1',
  l1: 'lq1',
  g1: 'gq1',
};

/** Optional evidence charts for the most quantitative insights. */
export const PROOFS: Record<string, InsightProof> = {
  f1: {
    metricLabel: 'Marketing % of net sales',
    source: SYS.fpa,
    freshness: 'periodic',
    series: [25.8, 26.1, 26.4, 26.8, 27.0, 27.2, 27.3],
    domain: [23, 29],
    unit: '%',
    band: [24, 26],
    bandLabel: '24–26% range',
    tone: 'warn',
    caption: 'Spend has climbed out of the committed range over the quarter and stayed there, so this is not going to correct on its own.',
  },
  f2: {
    metricLabel: 'Realised tariff rate',
    source: SYS.cust,
    freshness: 'lagging',
    series: [37.6, 37.9, 38.1, 38.3, 38.4, 38.5, 38.5],
    domain: [34, 40],
    unit: '%',
    threshold: 35,
    thresholdLabel: '35% assumed',
    tone: 'warn',
    caption: 'The realised rate has sat above the 35% guidance assumption all quarter.',
  },
  f3: {
    metricLabel: 'Units recovered since the reversal',
    source: SYS.circana,
    freshness: 'live',
    series: [0.3, 0.7, 1.1, 1.5, 1.8, 2.0, 2.1],
    domain: [0, 2.6],
    unit: ' pts',
    threshold: 1.4,
    thresholdLabel: '1.4 pt model',
    tone: 'good',
    caption: 'Unit recovery is running ahead of the planning model. Elasticity is better than assumed.',
  },
  m1: {
    metricLabel: 'Marketing % of net sales',
    source: SYS.fpa,
    freshness: 'periodic',
    series: [25.8, 26.1, 26.4, 26.8, 27.0, 27.2, 27.3],
    domain: [23, 29],
    unit: '%',
    band: [24, 26],
    bandLabel: '24–26% range',
    tone: 'warn',
    caption: 'Spend is over the committed budget. The question is whether it converts before the proposed cut.',
  },
  b1: {
    metricLabel: 'Innovation hit rate',
    source: SYS.circana,
    freshness: 'live',
    series: [40, 39, 37, 35, 33, 32, 31],
    domain: [28, 44],
    unit: '%',
    threshold: 40,
    thresholdLabel: '40% norm',
    tone: 'warn',
    caption: 'The spring slate has slid nine points below the historical hit-rate norm.',
  },
  g2: {
    metricLabel: 'Median clearance time',
    source: SYS.reg,
    freshness: 'periodic',
    series: [16, 16, 17, 17, 18, 18, 19],
    domain: [14, 26],
    unit: ' days',
    threshold: 25,
    thresholdLabel: '25-day window risk',
    tone: 'warn',
    caption: 'Clearance is drifting toward the point where launch windows begin to slip.',
  },
};
