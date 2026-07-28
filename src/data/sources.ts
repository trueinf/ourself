import type { SourceSystem, Freshness } from '@/types';

/**
 * §10 Provenance model. The systems e.l.f. has publicly confirmed — the
 * realistic surface for a semantic layer. In this build these are static
 * labels; the architecture must make them real join keys later over the
 * six shared entities (launch, market, sku, door, campaign, account).
 */
export const SYS = {
  circana: 'Circana',
  pol: 'Target POL',
  rl: 'Walmart Retail Link',
  sap: 'SAP',
  fpa: 'FP&A model',
  sfmc: 'Salesforce MC',
  braze: 'Braze',
  geo: 'GEO monitor',
  aws: 'AWS LLM telemetry',
  cust: 'Customs & broker',
  ns: 'NetSuite',
  hris: 'HRIS',
  reg: 'Regulatory tracker',
  ir: 'IR / consensus',
} as const satisfies Record<string, SourceSystem>;

/** Domain freshness defaults (§10). Individual KPIs may override. */
export const DEFAULT_FRESHNESS: Record<SourceSystem, Freshness> = {
  Circana: 'live',
  'Target POL': 'live',
  'Walmart Retail Link': 'live',
  SAP: 'live',
  NetSuite: 'live',
  'Salesforce MC': 'live',
  Braze: 'live',
  'GEO monitor': 'live',
  'AWS LLM telemetry': 'live',
  'Customs & broker': 'lagging',
  'FP&A model': 'periodic',
  HRIS: 'periodic',
  'Regulatory tracker': 'periodic',
  'IR / consensus': 'periodic',
};
