import { LineChart, Line, XAxis, YAxis, ReferenceLine, ResponsiveContainer } from 'recharts';
import { SourceChip } from './SourceChip';
import { SYS } from '@/data/sources';

/**
 * Dashboard-like evidence composed into an Ask answer — the quantified backing
 * for the prose, with provenance. Consistent with the product ethos: every
 * number carries the system it came from (§2.2). Colours come from tokens only.
 */
const METRICS: Array<{ label: string; value: string; delta: string; cls: 'up' | 'dn' | 'fl' }> = [
  { label: 'Realised tariff rate', value: '38.5%', delta: '+350 bps vs 35% assumed', cls: 'dn' },
  { label: 'Gross-margin impact, quarter', value: '−63 bps', delta: '≈18 bps per 100 bps', cls: 'dn' },
  { label: 'IEEPA refunds reinvested', value: '$58.5M', delta: 'Funding the mitigation', cls: 'up' },
  { label: 'Origin transition', value: '~6 wks', delta: 'Behind on 2 plants', cls: 'fl' },
];

const TARIFF_SERIES = [
  { w: '−6w', v: 37.6 },
  { w: '−5w', v: 37.9 },
  { w: '−4w', v: 38.1 },
  { w: '−3w', v: 38.3 },
  { w: '−2w', v: 38.4 },
  { w: '−1w', v: 38.5 },
  { w: 'Now', v: 38.5 },
];

const AXIS_TICK = { fontSize: 10, fill: 'var(--muted)' } as const;

export function AnswerDashboard() {
  return (
    <div className="ansdash">
      <div className="eyebrow" style={{ marginBottom: 8 }}>
        At a glance
      </div>
      <div className="outs">
        {METRICS.map((m) => (
          <div className="out" key={m.label}>
            <div className="l">{m.label}</div>
            <div className="v num">{m.value}</div>
            <div className={`d ${m.cls}`}>{m.delta}</div>
          </div>
        ))}
      </div>

      <div className="chartcard">
        <div className="ch-h">
          <b>Realised tariff vs the 35% guide assumption</b>
          <SourceChip source={SYS.cust} freshness="lagging" />
        </div>
        <div style={{ height: 150 }}>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={TARIFF_SERIES} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
              <XAxis dataKey="w" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: 'var(--line)' }} />
              <YAxis
                domain={[34, 40]}
                ticks={[34, 36, 38, 40]}
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={false}
                width={38}
                tickFormatter={(v: number) => `${v}%`}
              />
              <ReferenceLine
                y={35}
                stroke="var(--faint)"
                strokeDasharray="4 3"
                label={{ value: '35% assumed', position: 'insideBottomRight', fontSize: 10, fill: 'var(--muted)' }}
              />
              <Line
                type="monotone"
                dataKey="v"
                stroke="var(--pink)"
                strokeWidth={2}
                dot={{ r: 2, fill: 'var(--pink)', strokeWidth: 0 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
