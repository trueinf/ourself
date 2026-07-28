import type { DiscussionItem } from '@/types';
import { nameOf } from '@/data/agents';

/**
 * A Discussions agenda item — topic, with whom (participants), when (proposed
 * time), the agenda (tension to resolve), and a link home to its source.
 * Effect buttons are inert by design (§2.8) — this marks where the calendar /
 * Outlook integration lands next.
 */
const WHEN_CLASS: Record<DiscussionItem['whenUrgency'], string> = { now: 'now', soon: 'soon', ok: 'ok' };
const lastName = (initials: string): string => nameOf(initials).split(' ')[1] ?? nameOf(initials);

export function DiscussionCard({
  item,
  onOpenSource,
  onRemove,
}: {
  item: DiscussionItem;
  onOpenSource?: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="card disc">
      <div className="disc-head">
        <div className="disc-headmain">
          <div className={`disc-when ${WHEN_CLASS[item.whenUrgency]}`}>{item.when}</div>
          <h3>{item.title}</h3>
        </div>
        <span className={`disc-status ${item.status}`}>{item.status === 'scheduled' ? 'Scheduled' : 'Queued'}</span>
      </div>

      <p className="disc-agenda">{item.agenda}</p>

      <div className="disc-foot">
        <span className="disc-with">
          {item.participants.length ? (
            <>
              <span className="avs">
                {item.participants.map((w) => (
                  <span className="av" key={w} title={nameOf(w)}>
                    {w}
                  </span>
                ))}
              </span>
              <span>with {item.participants.map(lastName).join(', ')}</span>
            </>
          ) : (
            <span>Just you for now</span>
          )}
        </span>
        {item.source && onOpenSource ? (
          <button type="button" className="linklike" onClick={onOpenSource}>
            ← from {item.sourceLabel}
          </button>
        ) : (
          <span className="disc-src-none">from {item.sourceLabel}</span>
        )}
      </div>

      <div className="btnrow">
        {/* Inert by design (§2.8) — where the Outlook / calendar integration lands. */}
        <button type="button" className="btn">
          {item.status === 'scheduled' ? 'View the invite' : 'Propose a time'}
        </button>
        <button type="button" className="btn ghost">
          Open in Outlook
        </button>
        <button type="button" className="pill" onClick={onRemove}>
          Remove
        </button>
      </div>
    </div>
  );
}
