import type { Pin } from '@/types';

/**
 * §6 PinCard — question → what moved since pinning → divider → trend label +
 * pinned-at + Remove. Pins persist for the session (Memory layer, partial).
 */
const TREND_CLASS: Record<Pin['trend'], string> = { up: 'up', down: 'dn', flat: 'fl' };

export function PinCard({ pin, onRemove }: { pin: Pin; onRemove: () => void }) {
  return (
    <div className="card pin">
      <div className="q">{pin.question}</div>
      <div className="mv">{pin.whatMoved || 'No movement since it was pinned.'}</div>
      <div className="since">
        <span className={`trend ${TREND_CLASS[pin.trend]}`}>{pin.trendLabel || 'Unchanged'}</span>
        <span>·</span>
        <span>{pin.pinnedAt}</span>
        <span style={{ marginLeft: 'auto' }}>
          <button type="button" className="pill" onClick={onRemove}>
            Remove
          </button>
        </span>
      </div>
    </div>
  );
}
