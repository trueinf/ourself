import type { DiscussionItem, Insight, FocusItem, ScenarioModel } from '@/types';
import { EXECUTIVES } from './agents';

/* =============================================================
   Discussions — the per-persona agenda of what needs a room, not a
   dashboard. Seeded with real cross-office items pulled from each
   persona's own decisions and findings; more can be queued from any
   surface via the builders below. Nothing acts (§2.8).
   ============================================================= */

export const SEEDED_DISCUSSIONS: Record<string, DiscussionItem[]> = {
  fields: [
    {
      id: 'fd1',
      title: 'Split the $22.4M refund — lip vs the tariff cushion',
      agenda:
        'Commercial wants tranche 2 on lip; Operations can only supply from August; the tariff cushion is 350 bps adrift. The trade has to be made across the table, not inside any one office.',
      participants: ['TA', 'JL', 'JF'],
      when: 'Thursday 2:00pm',
      whenUrgency: 'now',
      status: 'scheduled',
      source: { kind: 'focus', id: 'q1' },
      sourceLabel: 'the $22.4M refund decision',
    },
    {
      id: 'fd2',
      title: 'Marketing envelope — accept Q1 or hold the year at 26%',
      agenda:
        'Savur wants the 27.3% run-rate for the year; that puts EBITDA below the guide unless offset. Align the conversion case before Tuesday.',
      participants: ['OS', 'TA'],
      when: 'Monday 9:30am',
      whenUrgency: 'soon',
      status: 'queued',
      source: { kind: 'focus', id: 'q2' },
      sourceLabel: 'the marketing-envelope decision',
    },
  ],
  franks: [
    {
      id: 'od1',
      title: 'Air freight $2.1M — protect the tariff assumption before the Q2 print',
      agenda:
        'Closing the qualification gap needs freight that lands on gross margin. Decide the spend with Finance before the print.',
      participants: ['MF'],
      when: 'Wednesday',
      whenUrgency: 'now',
      status: 'scheduled',
      source: { kind: 'focus', id: 'oq1' },
      sourceLabel: 'the air-freight decision',
    },
    {
      id: 'od2',
      title: 'Lip volume in the Q2 plan exceeds qualified capacity',
      agenda:
        'Commercial has planned ~1.4M lip units against lines committed until August. Move the plan or fund premium capacity.',
      participants: ['JL', 'MF'],
      when: 'Friday',
      whenUrgency: 'now',
      status: 'queued',
      source: { kind: 'focus', id: 'oq2' },
      sourceLabel: 'the lip-capacity conflict',
    },
  ],
  savur: [
    {
      id: 'sd1',
      title: 'Take the conversion case to the CFO before Tuesday',
      agenda:
        'Concede the brand tranche, protect retail media and GEO. Get in front of Finance before the envelope decision, not after.',
      participants: ['MF', 'TA'],
      when: 'Monday',
      whenUrgency: 'now',
      status: 'scheduled',
      source: { kind: 'focus', id: 'mq1' },
      sourceLabel: 'the envelope defence',
    },
    {
      id: 'sd2',
      title: 'Move $3.2M from prospecting to retail media and GEO',
      agenda:
        'Prospecting CAC is 9.5% over plan; retail media returns 3.8×. Needs Commercial to agree the retail-media calendar.',
      participants: ['JL'],
      when: 'Next week',
      whenUrgency: 'soon',
      status: 'queued',
      source: { kind: 'focus', id: 'mq2' },
      sourceLabel: 'the reallocation',
    },
  ],
  chopra: [
    {
      id: 'cd1',
      title: 'Semantic layer — build the top six entities now',
      agenda:
        'A shared definition layer cuts ~40% of each pilot build but pauses in-flight work. Finance wants it as cost per pilot.',
      participants: ['MF'],
      when: 'Thursday',
      whenUrgency: 'now',
      status: 'scheduled',
      source: { kind: 'focus', id: 'tq1' },
      sourceLabel: 'the semantic-layer decision',
    },
    {
      id: 'cd2',
      title: 'Prep the $4.1M production request for the CFO review',
      agenda:
        'Four of twelve pilots clear cost of capital; the other eight need a measurement plan or removal before it reaches Fields.',
      participants: ['MF'],
      when: 'End of month',
      whenUrgency: 'soon',
      status: 'queued',
      source: { kind: 'focus', id: 'tq2' },
      sourceLabel: 'the production-budget review',
    },
  ],
  amin: [
    {
      id: 'ad1',
      title: 'Arbitrate the $22.4M — three offices, three correct answers',
      agenda:
        'Finance holds a reserve, Commercial wants lip, Operations cannot supply. Only this table settles the trade.',
      participants: ['MF', 'JL', 'JF'],
      when: 'Friday 3:00pm',
      whenUrgency: 'now',
      status: 'scheduled',
      source: { kind: 'focus', id: 'cq1' },
      sourceLabel: 'the $22.4M arbitration',
    },
    {
      id: 'ad2',
      title: 'Q2 guidance language before the pre-close window',
      agenda: 'The organic figure depends on the rhode base transition landing as modelled. Agree the IR wording.',
      participants: ['MF'],
      when: 'Next week',
      whenUrgency: 'soon',
      status: 'queued',
      source: { kind: 'focus', id: 'cq2' },
      sourceLabel: 'the Q2 guidance sign-off',
    },
  ],
  laar: [
    {
      id: 'ld1',
      title: 'Lip plan vs supply — resolve before retailer commitments',
      agenda:
        "The Q2 plan carries volume Operations can't ship until August. Move the plan or get premium capacity funded.",
      participants: ['JF', 'MF'],
      when: 'Friday',
      whenUrgency: 'now',
      status: 'scheduled',
      source: { kind: 'focus', id: 'lq1' },
      sourceLabel: 'the lip-supply conflict',
    },
    {
      id: 'ld2',
      title: 'Deduction validation backlog at two accounts',
      agenda: 'Claims are filed faster than validated; the backlog is 30 bps of gross. Agree the validation push.',
      participants: [],
      when: 'Backlog',
      whenUrgency: 'ok',
      status: 'queued',
      source: { kind: 'focus', id: 'lq2' },
      sourceLabel: 'the deductions issue',
    },
  ],
  marchisotto: [
    {
      id: 'bd1',
      title: 'Cut or re-support the eleven spring SKUs',
      agenda:
        'Marketing says under-supported; Commercial says three never got their doors. Settle the read before the autumn gate.',
      participants: ['OS', 'JL'],
      when: 'Next week',
      whenUrgency: 'soon',
      status: 'queued',
      source: { kind: 'focus', id: 'bq1' },
      sourceLabel: 'the spring-slate decision',
    },
    {
      id: 'bd2',
      title: 'Skincare as a second core — resourcing and governance',
      agenda:
        'Skincare is 24% of consumption with different substantiation and retail dynamics. Align the operating model.',
      participants: ['SM'],
      when: 'Backlog',
      whenUrgency: 'ok',
      status: 'queued',
      source: { kind: 'insight', id: 'b2' },
      sourceLabel: 'the skincare finding',
    },
  ],
  milsten: [
    {
      id: 'gd1',
      title: 'EU AI Act classification for three deployed agents',
      agenda:
        'Enforcement dates are fixed; Technology holds the documentation. Close the classification with Chopra.',
      participants: ['EC'],
      when: 'This week',
      whenUrgency: 'now',
      status: 'scheduled',
      source: { kind: 'focus', id: 'gq1' },
      sourceLabel: 'the AI Act classification',
    },
    {
      id: 'gd2',
      title: 'Substantiation capacity as the skincare mix grows',
      agenda:
        'Skincare carries heavier substantiation; current team capacity assumes the old mix. Plan the resourcing.',
      participants: [],
      when: 'Backlog',
      whenUrgency: 'ok',
      status: 'queued',
      source: { kind: 'focus', id: 'gq2' },
      sourceLabel: 'the substantiation review',
    },
  ],
};

/* ---- builders: queue a discussion from any surface ---- */

const SURNAME_TO_INITIALS: Record<string, string> = Object.fromEntries(
  Object.entries(EXECUTIVES).map(([initials, name]) => [name.split(' ').pop()!.toLowerCase(), initials]),
);

function participantsFromCrossOffice(insight: Insight): string[] {
  const seen = new Set<string>();
  for (const v of insight.crossOffice) {
    const surname = v.office.split('·').pop()?.trim().toLowerCase() ?? '';
    const initials = SURNAME_TO_INITIALS[surname];
    if (initials) seen.add(initials);
  }
  return [...seen];
}

const truncate = (s: string, n = 180) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

const SEV_WHEN: Record<Insight['severity'], { when: string; whenUrgency: DiscussionItem['whenUrgency'] }> = {
  pink: { when: 'This week', whenUrgency: 'now' },
  amber: { when: 'Next week', whenUrgency: 'soon' },
  teal: { when: 'Backlog', whenUrgency: 'ok' },
  neutral: { when: 'Backlog', whenUrgency: 'ok' },
};

export function discussionFromFocus(item: FocusItem): DiscussionItem {
  return {
    id: `disc-focus-${item.id}`,
    title: item.headline,
    agenda: truncate(item.summary),
    participants: item.waitingOn,
    when: item.due,
    whenUrgency: item.dueUrgency,
    status: 'queued',
    source: { kind: 'focus', id: item.id },
    sourceLabel: `the ${item.verb.toLowerCase()} decision`,
  };
}

export function discussionFromInsight(insight: Insight): DiscussionItem {
  const w = SEV_WHEN[insight.severity];
  return {
    id: `disc-insight-${insight.id}`,
    title: insight.headline,
    agenda: truncate(insight.why),
    participants: participantsFromCrossOffice(insight),
    when: w.when,
    whenUrgency: w.whenUrgency,
    status: 'queued',
    source: { kind: 'insight', id: insight.id },
    sourceLabel: 'this finding',
  };
}

export function discussionFromQuestion(question: string, insight: Insight | null): DiscussionItem {
  if (insight) {
    return { ...discussionFromInsight(insight), id: `disc-insight-${insight.id}`, title: question, sourceLabel: 'this question' };
  }
  return {
    id: `disc-q-${question.slice(0, 24)}`,
    title: question,
    agenda: 'Take this question into a working session — it does not yet resolve to a settled finding.',
    participants: [],
    when: 'Backlog',
    whenUrgency: 'ok',
    status: 'queued',
    sourceLabel: 'this question',
  };
}

export function discussionFromScenario(
  model: ScenarioModel,
  backedFocus: FocusItem | undefined,
): DiscussionItem {
  return {
    id: `disc-scn-${model.id}`,
    title: `Walk the ${model.title.toLowerCase()} model`,
    agenda: 'Take the modelled trade-offs to the table — the levers move the guide, the specialists speak to feasibility.',
    participants: backedFocus?.waitingOn ?? [],
    when: 'Next week',
    whenUrgency: 'soon',
    status: 'queued',
    source: backedFocus ? { kind: 'focus', id: backedFocus.id } : undefined,
    sourceLabel: backedFocus ? `the ${backedFocus.verb.toLowerCase()} decision` : 'this model',
  };
}
