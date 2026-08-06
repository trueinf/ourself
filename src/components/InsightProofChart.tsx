import { AreaChart, Area, XAxis, YAxis, ReferenceLine, ReferenceArea, ResponsiveContainer } from 'recharts';
import type { InsightProof } from '@/types';
import { SourceChip } from './SourceChip';

/**
 * The one chart that substantiates a quantitative insight — a metric trend
 * against the threshold or band it is measured on. Colours from tokens only;
 * the line tone reflects whether the trend is a concern (warn), favourable
 * (good) or neutral. Provenance rides on the chart via a SourceChip.
 */
const WEEKS = ['−6w', '−5w', '−4w', '−3w', '−2w', '−1w', 'Now'];
const TONE_STROKE: Record<InsightProof['tone'], string> = {
  warn: 'var(--pink)',
  good: 'var(--teal)',
  neutral: 'var(--ink-2)',
};

export function InsightProofChart({ proof }: { proof: InsightProof }) {
  const data = proof.series.map((v, i) => ({ w: WEEKS[i] ?? String(i), v }));
  const stroke = TONE_STROKE[proof.tone];

  return (
    <div className="chartcard">
      <div className="ch-h">
        <b>{proof.metricLabel}</b>
        <SourceChip source={proof.source} freshness={proof.freshness} />
      </div>
      <div style={{ height: 168 }}>
        <ResponsiveContainer width="100%" height={168}>
          <AreaChart data={data} margin={{ top: 8, right: 14, bottom: 0, left: 0 }}>
            {proof.band ? (
              <ReferenceArea
                y1={proof.band[0]}
                y2={proof.band[1]}
                fill="var(--teal)"
                fillOpacity={0.08}
                stroke="none"
                label={{ value: proof.bandLabel, position: 'insideTopLeft', fontSize: 11.5, fill: 'var(--muted)' }}
              />
            ) : null}
            {proof.threshold != null ? (
              <ReferenceLine
                y={proof.threshold}
                stroke="var(--faint)"
                strokeDasharray="4 3"
                label={{ value: proof.thresholdLabel, position: 'insideBottomRight', fontSize: 11.5, fill: 'var(--muted)' }}
              />
            ) : null}
            <XAxis dataKey="w" tick={{ fontSize: 11.5, fill: 'var(--muted)' }} tickLine={false} axisLine={{ stroke: 'var(--line)' }} />
            <YAxis
              domain={proof.domain}
              tick={{ fontSize: 11.5, fill: 'var(--muted)' }}
              tickLine={false}
              axisLine={false}
              width={40}
              tickFormatter={(v: number) => `${v}${proof.unit}`}
            />
            <Area type="monotone" dataKey="v" stroke={stroke} strokeWidth={2} fill={stroke} fillOpacity={0.08} isAnimationActive={false} dot={{ r: 2, fill: stroke, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="ch-cap">{proof.caption}</p>
    </div>
  );
}
