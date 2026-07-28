import type { Kpi } from '@/types';
import { SourceChip } from './SourceChip';
import { Sparkline } from './Sparkline';

/**
 * §6 KpiCard. Label → value (26px tabular) → delta (teal up / --pink-text
 * down / --muted flat) → 7-bar sparkline → footer divider + SourceChip.
 * Every KPI carries its source and freshness (§2.2) — no figure without it.
 */
const DELTA_CLASS: Record<Kpi['direction'], string> = { up: 'up', down: 'dn', flat: 'fl' };

export function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <div className="kpi">
      <div className="lab">{kpi.label}</div>
      <div className="val num">{kpi.value}</div>
      <div className={`dlt ${DELTA_CLASS[kpi.direction]}`}>{kpi.delta}</div>
      <Sparkline spark={kpi.spark} warn={kpi.warn} />
      <div className="foot">
        <SourceChip source={kpi.source} freshness={kpi.freshness} />
      </div>
    </div>
  );
}
