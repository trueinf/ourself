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

/** A specific fact returned by one specialist — the deterministic side of the
 *  contract (§2.1). Grounded in the insight's own figures, with its source. */
export interface AgentFinding {
  agent: AgentKey;
  text: string;
  source?: SourceSystem;
}

/** Optional evidence chart substantiating a quantitative insight. */
export interface InsightProof {
  metricLabel: string;
  source: SourceSystem;
  freshness: Freshness;
  /** 7 weekly points, oldest → now */
  series: number[];
  domain: [number, number];
  unit: string;
  /** acceptable range, shaded */
  band?: [number, number];
  bandLabel?: string;
  /** single reference line */
  threshold?: number;
  thresholdLabel?: string;
  tone: 'warn' | 'good' | 'neutral';
  caption: string;
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
  /** specific specialist findings (facts) — attached from data/insightDetail */
  findings?: AgentFinding[];
  /** id of the Focus item this insight feeds, if any */
  feedsDecision?: string;
  /** optional evidence chart */
  proof?: InsightProof;
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
  /** short "what is at risk" phrase for triage */
  stakes?: string;
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

/**
 * An alternative objective function the persona can switch to. The objective
 * is a weighting over the same governed facts (§8.1a), so applying a preset
 * re-ranks and re-emphasises the office's KPIs and insights by relevance —
 * it never authors a new number. `keywords` drive that relevance scoring.
 */
export interface GoalPreset {
  label: string;
  objective: string;
  keywords: string[];
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
  /** alternative objective functions this office can switch to (2–3) */
  goalPresets: GoalPreset[];
  /** one-sentence "read" of the quarter — the verdict shown before the KPIs */
  synthesis: string;
  /** one-sentence triage "read" of the decision queue (Focus) */
  focusRead: string;
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
  /** one-line framing: what you're modelling and against what baseline */
  read: string;
  /** short name of the baseline the deltas are measured against */
  baselineLabel: string;
  levers: Lever[];
  compute: (values: LeverValues) => ScenarioResult;
}
