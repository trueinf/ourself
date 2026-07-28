import type { Kpi } from '@/types';
import { SourceChip } from './SourceChip';
import { Sparkline } from './Sparkline';

/**
 * §6 KpiCard. Label → value (26px tabular) → delta → benchmark note →
 * sparkline → footer divider + SourceChip. Colour restraint: saturated pink
 * is reserved for a genuine concern (a `warn` metric that is down); routine
 * declines read in calm --muted so the row does not look alarmist. Every KPI
 * carries its source and freshness (§2.2) — no figure without it.
 */
function deltaClass(kpi: Kpi): string {
  if (kpi.direction === 'up') return 'up';
  if (kpi.direction === 'flat') return 'fl';
  return kpi.warn ? 'dn' : 'dn-quiet';
}

export function KpiCard({ kpi, aligned = false }: { kpi: Kpi; aligned?: boolean }) {
  return (
    <div className={`kpi${aligned ? ' aligned' : ''}`}>
      <div className="lab">{kpi.label}</div>
      <div className="val num">{kpi.value}</div>
      <div className={`dlt ${deltaClass(kpi)}`}>{kpi.delta}</div>
      <div className="kpi-note">{kpi.note}</div>
      <Sparkline spark={kpi.spark} warn={kpi.warn} />
      <div className="foot">
        <SourceChip source={kpi.source} freshness={kpi.freshness} />
      </div>
    </div>
  );
}
