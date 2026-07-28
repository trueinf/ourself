import type { ScenarioOutput } from '@/types';

/**
 * §6 / §7.4 output delta vs baseline. Ported verbatim from the prototype's
 * d(o) helper so the "vs baseline" readouts match exactly. `invert` marks
 * outputs where lower is better (landed cost, tariff, CAC, cost/workflow…).
 */
export interface DeltaDisplay {
  /** 'up' (good), 'dn' (bad), or 'fl' (at baseline) */
  className: 'up' | 'dn' | 'fl';
  text: string;
}

export function formatOutputDelta(
  output: Pick<ScenarioOutput, 'current' | 'baseline' | 'invert'>,
  baselineLabel = 'baseline',
): DeltaDisplay {
  const diff = output.current - output.baseline;
  const pct = output.baseline ? (diff / Math.abs(output.baseline)) * 100 : 0;
  const good = output.invert ? diff < 0 : diff > 0;
  const atBaseline = Math.abs(pct) < 0.05;
  const className: DeltaDisplay['className'] = atBaseline ? 'fl' : good ? 'up' : 'dn';
  const sign = diff > 0 ? '+' : '';
  const text = atBaseline ? `At ${baselineLabel}` : `${sign}${pct.toFixed(1)}% vs ${baselineLabel}`;
  return { className, text };
}

/** Format a range lever's current value for its <output> readout. */
export function formatLeverValue(value: number, step: number, unit: string): string {
  return `${value.toFixed(step < 1 ? 1 : 0)}${unit}`;
}

/** Coerce a lever value to number (range levers) with a safe fallback. */
export function asNumber(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** Coerce a lever value to string (segment levers). */
export function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}
