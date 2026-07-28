import { AreaChart, Area, YAxis, ResponsiveContainer } from 'recharts';

/**
 * §6 KpiCard sparkline — a quiet trend, not a chunky bar row. A thin area line
 * (Recharts, §3 "for the sparklines only") in a calm ink tone, or the brand
 * --pink when the series is a warning, with only the final point emphasized.
 * Sparklines are decorative (aria-hidden); the value and delta are always text
 * (§12.8). Under jsdom (harness A), ResponsiveContainer renders empty — no NaN.
 */
interface DotProps {
  cx?: number;
  cy?: number;
  index?: number;
  key?: string | number;
}

export function Sparkline({ spark, warn = false }: { spark: number[]; warn?: boolean }) {
  const data = spark.map((v, i) => ({ i, v }));
  const stroke = warn ? 'var(--pink)' : 'var(--ink-2)';
  const fill = warn ? 'var(--pink)' : 'var(--ink-2)';
  const lastIndex = spark.length - 1;
  const lo = Math.min(...spark) - 1;
  const hi = Math.max(...spark) + 1;

  const renderDot = (props: DotProps) => {
    const { cx, cy, index, key } = props;
    return (
      <circle
        key={key ?? index}
        cx={cx}
        cy={cy}
        r={index === lastIndex ? 2.6 : 0}
        fill={stroke}
        stroke="var(--paper)"
        strokeWidth={index === lastIndex ? 1 : 0}
      />
    );
  };

  return (
    <div className="spark" aria-hidden="true">
      <ResponsiveContainer width="100%" height={26}>
        <AreaChart data={data} margin={{ top: 3, right: 3, bottom: 0, left: 3 }}>
          <YAxis hide domain={[lo, hi]} />
          <Area
            type="monotone"
            dataKey="v"
            stroke={stroke}
            strokeWidth={1.6}
            fill={fill}
            fillOpacity={warn ? 0.12 : 0.07}
            isAnimationActive={false}
            dot={renderDot}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
