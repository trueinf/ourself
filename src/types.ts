/* =============================================================
   §8 Data model. These interfaces are the contract every data file
   and component is typed against. The prototype's terse keys (t, d,
   sl, mv, st, …) are renamed to these fields on the way in (§18.2).
   ============================================================= */

export type SourceSystem =
  | 'Circana'
  | 'Target POL'
  | 'Walmart Retail Link'
  | 'SAP'
  | 'FP&A model'
  | 'Salesforce MC'
  | 'Braze'
  | 'GEO monitor'
  | 'AWS LLM telemetry'
  | 'Customs & broker'
  | 'NetSuite'
  | 'HRIS'
  | 'Regulatory tracker'
  | 'IR / consensus';

export type AgentKey = 'fin' | 'sup' | 'com' | 'mkt' | 'reg' | 'tec' | 'brd' | 'ppl';
export type Severity = 'pink' | 'amber' | 'teal' | 'neutral';
export type Stance = 'agrees' | 'disagrees' | 'partly';
export type Freshness = 'live' | 'lagging' | 'periodic';
export type ScenarioModelId = 'cfo' | 'coo' | 'cmo' | 'ctaio';

export interface Kpi {
  label: string;
  value: string;
  delta: string;
  direction: 'up' | 'down' | 'flat';
  note: string;
  source: SourceSystem;
  freshness: Freshness;
  /** exactly 7 values, each 1–7 */
  spark: number[];
  /** renders prominent bars in the warning colour */
  warn?: boolean;
}

export interface CrossOfficeView {
  /** "Marketing · Savur" */
  office: string;
  stance: Stance;
  /** "Disagrees" | "Your position" | "Flags a constraint" — free text */
  label: string;
  position: string;
}

export interface InsightPill {
  variant: string;
  text: string;
}

export interface Insight {
  id: string;
  severity: Severity;
  headline: string;
  why: string;
  pills: InsightPill[];
  agents: AgentKey[];
  sources: SourceSystem[];
  /** may be empty */
  crossOffice: CrossOfficeView[];
}

export interface DecisionOption {
  recommended?: boolean;
  heading: string;
  rationale: string;
  /** 2–3 [label, value] impacts */
  impacts: Array<[label: string, value: string]>;
}

export interface FocusItem {
  id: string;
  severity: 'high' | 'medium' | 'low';
  /** DECIDE | RESOLVE | SIGN OFF | REVIEW | ARBITRATE | DEFEND | PREPARE | ACT */
  verb: string;
  headline: string;
  summary: string;
  /** executive initials */
  waitingOn: string[];
  due: string;
  dueUrgency: 'now' | 'soon' | 'ok';
  options: DecisionOption[];
}

export interface ClosedDecision {
  title: string;
  outcome: string;
  when: string;
  result: 'worked' | 'mixed' | 'backfired';
}

export interface Pin {
  question: string;
  whatMoved: string;
  pinnedAt: string;
  trend: 'up' | 'down' | 'flat';
  trendLabel: string;
}

export interface SuggestedQuestion {
  question: string;
  tag: string;
}

export interface Persona {
  id: string;
  initials: string;
  name: string;
  role: string;
  title: string;
  /** the objective function, one sentence */
  objective: string;
  /** exactly 5 */
  kpis: Kpi[];
  /** 2–4 */
  insights: Insight[];
  /** 2–4 */
  focus: FocusItem[];
  /** 3–4 */
  suggestedQuestions: SuggestedQuestion[];
  scenarioModel: ScenarioModelId;
  pins: Pin[];
  closedDecisions: ClosedDecision[];
}

/* ---- scenario engine contract (§9) ---- */

export interface ScenarioOutput {
  label: string;
  /** preformatted display string */
  value: string;
  baseline: number;
  current: number;
  /** true when lower is better (landed cost, tariff, CAC, cost/workflow, …) */
  invert?: boolean;
}

export interface ScenarioJudgement {
  agent: AgentKey;
  heading: string;
  /** conditional on the lever values */
  text: string;
}

export interface ScenarioResult {
  /** every line of the derivation: [label, value] */
  derivationRows: Array<[label: string, value: string]>;
  outputs: ScenarioOutput[];
  judgements: ScenarioJudgement[];
}

export type LeverValue = string | number;
export type LeverValues = Record<string, LeverValue>;

export interface SegmentLever {
  id: string;
  kind: 'segments';
  label: string;
  options: Array<[value: string, label: string]>;
  default: string;
}

export interface RangeLever {
  id: string;
  kind: 'range';
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  unit: string;
  loCaption: string;
  hiCaption: string;
}

export type Lever = SegmentLever | RangeLever;

export interface ScenarioModel {
  id: ScenarioModelId;
  title: string;
  lede: string;
  levers: Lever[];
  compute: (values: LeverValues) => ScenarioResult;
}
