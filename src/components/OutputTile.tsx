import type { ScenarioOutput } from '@/types';
import { formatOutputDelta } from '@/lib/format';

/**
 * §6 OutputTile — scenario result. Label → value (20px tabular) → delta vs
 * baseline. Every number here comes from the deterministic engine (§9); the
 * delta colour reflects good/bad given the output's direction (invert).
 */
export function OutputTile({ output, baselineLabel }: { output: ScenarioOutput; baselineLabel?: string }) {
  const delta = formatOutputDelta(output, baselineLabel);
  return (
    <div className="out">
      <div className="l">{output.label}</div>
      <div className="v num">{output.value}</div>
      <div className={`d ${delta.className}`}>{delta.text}</div>
    </div>
  );
}
