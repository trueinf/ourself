import type { SourceSystem, Freshness } from '@/types';

/**
 * §6 SourceChip — the provenance marker. 10.5px --faint text preceded by a
 * 5×5px square: --faint default, --teal when live, --amber when lagging.
 * Used on every KPI and every insight — this is the defensibility signal
 * and the visual signature of the product (§2.2).
 */
const FRESHNESS_CLASS: Record<Freshness, string> = {
  live: 'live',
  lagging: 'lag',
  periodic: '',
};

export function SourceChip({ source, freshness = 'periodic' }: { source: SourceSystem; freshness?: Freshness }) {
  const cls = FRESHNESS_CLASS[freshness];
  return <span className={`src${cls ? ' ' + cls : ''}`}>{source}</span>;
}
