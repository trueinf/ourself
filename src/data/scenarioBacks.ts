/**
 * What each persona's scenario model backs — the open decisions (Focus) and
 * findings (Insights) it lets you model the trade-offs behind. This grounds the
 * abstract levers in the real questions on the desk, and closes the loop back
 * into Focus and the insight detail.
 */
export interface ScenarioBacks {
  focus: string[];
  insights: string[];
}

export const SCENARIO_BACKS: Record<string, ScenarioBacks> = {
  fields: { focus: ['q1', 'q2'], insights: ['f1', 'f2'] },
  franks: { focus: ['oq1', 'oq2'], insights: ['o1', 'o2'] },
  savur: { focus: ['mq1', 'mq2'], insights: ['m1', 'm2'] },
  chopra: { focus: ['tq1', 'tq2'], insights: ['t1', 't2'] },
  amin: { focus: ['cq1', 'cq2'], insights: ['c1', 'c2'] },
  laar: { focus: ['lq1'], insights: ['l1', 'l3'] },
  marchisotto: { focus: ['bq1'], insights: ['b1'] },
  milsten: { focus: ['gq1'], insights: ['g2'] },
};
