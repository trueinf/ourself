/**
 * Focus (decision-queue) content. FOCUS_READ is the one-line triage verdict
 * shown before the queue — the shape of what's open, cross-office, and only
 * this office can settle. STAKES is a short "what is at risk" phrase per
 * decision, so the queue scans by importance, not just by due date.
 */
export const FOCUS_READ: Record<string, string> = {
  fields:
    'Two calls close this week, both crossing more than one office — the $22.4M refund split and the marketing envelope are the two only you can settle.',
  franks:
    'Two land this week: the $2.1M air-freight call that protects the tariff assumption, and lip volume the Q2 plan has already over-committed.',
  savur:
    'The envelope decision goes to the CFO on Tuesday — get the conversion case in front of Finance before it, not after.',
  chopra:
    'Two both run through Finance: whether to build the semantic layer now, and how to get the $4.1M request past a return test with four of twelve measured.',
  amin:
    'One arbitration only you can make — three offices, three correct answers, the same $22.4M — plus the Q2 guidance language before the pre-close window.',
  laar:
    'The lip plan is the live one: retailer commitments are being made now against volume Operations cannot ship until August.',
  marchisotto:
    'The spring-slate call cannot wait on a clean read — eleven under-performing SKUs, with the autumn gate stacked behind them.',
  milsten:
    'The EU AI Act classification is the clock that does not move; everything else can flex around the 13-week cycle.',
};

export const STAKES: Record<string, string> = {
  // Fields
  q1: '$22.4M · Q2 share in lip against the tariff cushion',
  q2: 'Adjusted EBITDA against the guided range',
  q3: 'The Q2 organic-growth guidance language',
  q4: '$4.1M of AI production budget',
  // Franks
  oq1: '$2.1M freight against a public tariff assumption',
  oq2: '~1.4M lip units the plan cannot supply',
  oq3: 'The working-capital ceiling at 10.5 weeks',
  // Savur
  mq1: 'The marketing envelope for the full year',
  mq2: '$3.2M reallocated out of prospecting',
  mq3: '40% of creator spend on six creators',
  // Chopra
  tq1: 'Two quarters and four paused pilots against the reconciliation debt',
  tq2: '$4.1M — four measured returns of twelve',
  tq3: 'Three deployed agents’ EU AI Act exposure',
  // Amin
  cq1: '$22.4M · a quarter of lip share against the guide',
  cq2: 'The Q2 organic-growth guidance language',
  // Laar
  lq1: 'The lip shelf you just won against unshippable supply',
  lq2: '30 bps of gross-to-net leakage',
  // Marchisotto
  bq1: 'Eleven spring SKUs — cut or re-support',
  bq2: '34 autumn concepts against capacity for 22',
  // Milsten
  gq1: 'Three deployed agents before the enforcement date',
  gq2: 'Substantiation capacity as the skincare mix grows',
};
