import type { Lever, LeverValue } from '@/types';
import { asNumber, asString, formatLeverValue } from '@/lib/format';

/**
 * §6 LeverGroup — segmented control (aria-pressed) or range slider
 * (accent-color: --pink) with a --pink-text value readout and min/max
 * captions. These drive the deterministic scenario engine (§9); the levers
 * change the arithmetic, never the agent judgements' truthfulness.
 */
export function LeverGroup({
  lever,
  value,
  onChange,
}: {
  lever: Lever;
  value: LeverValue;
  onChange: (value: LeverValue) => void;
}) {
  if (lever.kind === 'segments') {
    const current = asString(value, lever.default);
    return (
      <div className="lev">
        <div className="lev-h">
          <label>{lever.label}</label>
        </div>
        <div className="seg">
          {lever.options.map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={current === key}
              onClick={() => onChange(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const current = asNumber(value, lever.default);
  return (
    <div className="lev">
      <div className="lev-h">
        <label htmlFor={`lever-${lever.id}`}>{lever.label}</label>
        <output className="num" htmlFor={`lever-${lever.id}`}>
          {formatLeverValue(current, lever.step, lever.unit)}
        </output>
      </div>
      <input
        id={`lever-${lever.id}`}
        type="range"
        min={lever.min}
        max={lever.max}
        step={lever.step}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="rlab">
        <span>{lever.loCaption}</span>
        <span>{lever.hiCaption}</span>
      </div>
    </div>
  );
}
