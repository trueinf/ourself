import type { Pin, SourceSystem } from '@/types';
import { SourceChip } from './SourceChip';
import { DEFAULT_FRESHNESS } from '@/data/sources';

/**
 * §6 PinCard — a live watchlist entry, not a saved string. The question is a
 * link that re-asks it (§7.3), the movement carries the source it is watched
 * from (§2.2), and Remove unpins it. Pins persist for the session.
 */
const TREND_CLASS: Record<Pin['trend'], string> = { up: 'up', down: 'dn', flat: 'fl' };

export function PinCard({
  pin,
  source,
  onAsk,
  onRemove,
}: {
  pin: Pin;
  source?: SourceSystem;
  onAsk: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="card pin">
      <button type="button" className="pin-q" onClick={onAsk}>
        {pin.question}
      </button>
      <div className="mv">{pin.whatMoved || 'No movement since it was pinned.'}</div>
      {source ? (
        <div className="pin-src">
          Watched from <SourceChip source={source} freshness={DEFAULT_FRESHNESS[source]} />
        </div>
      ) : null}
      <div className="since">
        <span className={`trend ${TREND_CLASS[pin.trend]}`}>{pin.trendLabel || 'Unchanged'}</span>
        <span>·</span>
        <span>{pin.pinnedAt}</span>
        <span className="since-actions">
          <button type="button" className="linklike" onClick={onAsk}>
            View the answer →
          </button>
          <button type="button" className="pill" onClick={onRemove}>
            Remove
          </button>
        </span>
      </div>
    </div>
  );
}
