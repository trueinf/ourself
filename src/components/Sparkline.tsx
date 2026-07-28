import { BarChart, Bar, Cell, YAxis, ResponsiveContainer } from 'recharts';

/**
 * §6 KpiCard sparkline — 7 bars, 22px tall. Recharts is the sanctioned
 * charting library (§3, "for the sparklines only"). Bars are decorative
 * marks (§4): --mist-2 default, --ink when prominent (v ≥ 5), and the brand
 * --pink when the series is a warning (v ≥ 6). The value and delta are always
 * present as text, so the sparkline carries no meaning on its own (§12.8).
 *
 * ResponsiveContainer renders nothing until it has measured a positive size,
 * so under jsdom (harness A) it emits an empty wrapper — never NaN geometry.
 */
function barFill(v: number, warn: boolean): string {
  if (warn && v >= 6) return 'var(--pink)';
  if (v >= 5) return 'var(--ink)';
  return 'var(--mist-2)';
}

export function Sparkline({ spark, warn = false }: { spark: number[]; warn?: boolean }) {
  const data = spark.map((v, i) => ({ i, v }));
  return (
    <div className="spark" aria-hidden="true">
      <ResponsiveContainer width="100%" height={22}>
        <BarChart data={data} barCategoryGap={2} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <YAxis hide domain={[0, 7.7]} />
          <Bar dataKey="v" radius={1} isAnimationActive={false}>
            {data.map((d) => (
              <Cell key={d.i} fill={barFill(d.v, warn)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
