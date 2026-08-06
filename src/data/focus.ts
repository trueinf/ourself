/**
 * Focus (decision-queue) content. FOCUS_READ is the one-line triage verdict
 * shown before the queue — the shape of what's open, cross-office, and only
 * this office can settle. STAKES is a short "what is at risk" phrase per
 * decision, so the queue scans by importance, not just by due date.
 */
export const FOCUS_READ: Record<string, string> = {
  fields:
    'Two calls close this week, and both cross more than one office. The $22.4M refund split and the marketing budget are the ones only you can settle.',
  franks:
    'Two things land this week. The $2.1M air-freight call protects the tariff assumption. Separately, lip volume is already over-committed in the Q2 plan.',
  savur:
    'The envelope decision goes to the CFO on Tuesday. Get the conversion case in front of Finance before then.',
  chopra:
    'Both open calls run through Finance. First, whether to build the semantic layer now. Second, how to get the $4.1M request past a return test when only four of twelve are measured.',
  amin:
    'One call only you can make. Three offices each have a defensible answer on the same $22.4M, and someone has to choose between them. The Q2 guidance language also needs settling before the pre-close window.',
  laar:
    'The lip plan is the live one. Retailer commitments are being made now against volume Operations cannot ship until August.',
  marchisotto:
    'The spring-slate call cannot wait on a clean read. Eleven under-performing SKUs, with the autumn gate stacked behind them.',
  milsten:
    'The EU AI Act classification is the one deadline that will not move. Everything else can flex around the 13-week cycle.',
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
  tq2: '$4.1M, four measured returns of twelve',
  tq3: 'Three deployed agents’ EU AI Act exposure',
  // Amin
  cq1: '$22.4M · a quarter of lip share against the guide',
  cq2: 'The Q2 organic-growth guidance language',
  // Laar
  lq1: 'The lip shelf you just won against unshippable supply',
  lq2: '30 bps of gross-to-net leakage',
  // Marchisotto
  bq1: 'Eleven spring SKUs to cut or re-support',
  bq2: '34 autumn concepts against capacity for 22',
  // Milsten
  gq1: 'Three deployed agents before the enforcement date',
  gq2: 'Substantiation capacity as the skincare mix grows',
};
