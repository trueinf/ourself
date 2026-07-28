import type { FocusItem } from '@/types';
import { nameOf } from '@/data/agents';

/**
 * §6 FocusRow — severity square / body / due date. Body = eyebrow verb →
 * headline → summary → waiting-on row with overlapping avatars. Whole row
 * links to the focus detail page.
 */
const SEV_CLASS: Record<FocusItem['severity'], string> = { high: 'hi', medium: 'md', low: 'lo' };
const SEV_MARK: Record<FocusItem['severity'], string> = { high: '!', medium: '~', low: '·' };

const lastName = (initials: string): string => nameOf(initials).split(' ')[1] ?? nameOf(initials);

export function FocusRow({ item, onOpen }: { item: FocusItem; onOpen: () => void }) {
  // A decision "crosses offices" when two or more executives are waiting on it —
  // the multi-party arbitrations only the CxO can settle (the product's premise).
  const crossOffice = item.waitingOn.length >= 2;
  return (
    <button type="button" className="card tap" onClick={onOpen}>
      <div className="fitem">
        <span className={`sev ${SEV_CLASS[item.severity]}`}>{SEV_MARK[item.severity]}</span>
        <div>
          <div className="eyebrow" style={{ marginBottom: 4 }}>
            {item.verb}
          </div>
          <h3>{item.headline}</h3>
          <div className="sl">{item.summary}</div>
          {item.stakes ? (
            <div className="stake">
              <span>At stake</span>
              {item.stakes}
            </div>
          ) : null}
          <div className="wait">
            {item.waitingOn.length ? (
              <>
                <span className="avs">
                  {item.waitingOn.map((w) => (
                    <span className="av" key={w} title={nameOf(w)}>
                      {w}
                    </span>
                  ))}
                </span>
                <span>{item.waitingOn.map(lastName).join(', ')} waiting on you</span>
              </>
            ) : (
              <span>No one blocked</span>
            )}
            {crossOffice ? <span className="pill p">Cross-office · {item.waitingOn.length + 1} offices</span> : null}
            <span className="pill">
              {item.options.length ? `${item.options.length} options modelled` : 'Not yet modelled'}
            </span>
          </div>
        </div>
        <div className={`due ${item.dueUrgency}`}>{item.due}</div>
      </div>
    </button>
  );
}
