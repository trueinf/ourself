import type { Persona, FocusItem } from '@/types';
import { useApp } from '@/store/app';
import { nameOf } from '@/data/agents';
import { BackLink } from '@/components/BackLink';
import { Pill } from '@/components/Pill';
import { SideCard } from '@/components/SideCard';
import { AddToDiscussion } from '@/components/AddToDiscussion';
import { discussionFromFocus } from '@/data/discussions';
import { ChevronRight } from '@/components/Icons';

/**
 * §7.7 Focus detail — a full page. Effect buttons (Approve recommended,
 * Request specialist analysis) are inert by design (§2.8, non-negotiable 8):
 * this build is the decision surface, it never acts. A "Raised by" backlink
 * closes the loop with the insight that fed this decision (§7.6).
 */
const DUE_PILL: Record<FocusItem['dueUrgency'], string> = { now: 'pink', soon: 'amber', ok: 'neutral' };

export function FocusDetail({ persona, item }: { persona: Persona; item: FocusItem }) {
  const closeDetail = useApp((s) => s.closeDetail);
  const modelInScenarios = useApp((s) => s.modelInScenarios);
  const openDetail = useApp((s) => s.openDetail);
  const hasOptions = item.options.length > 0;
  const modelThis = () => modelInScenarios({ kind: 'focus', id: item.id, headline: item.headline });
  const raisedBy = persona.insights.find((i) => i.feedsDecision === item.id);

  const blockedSentence = item.waitingOn.length
    ? `${item.waitingOn.map(nameOf).join(' and ')} ${item.waitingOn.length > 1 ? 'are' : 'is'} blocked pending the call.`
    : 'No one is blocked, but the window closes on the date shown.';

  return (
    <>
      <BackLink label="Back to focus" onClick={closeDetail} />

      <div className="dt-h">
        <div className="eyebrow" style={{ marginBottom: 6 }}>
          {item.verb}
        </div>
        <h1>{item.headline}</h1>
        <p className="lede">{item.summary}</p>
        <div className="meta">
          <Pill variant={DUE_PILL[item.dueUrgency]}>Due {item.due}</Pill>
          {item.waitingOn.length >= 2 ? <Pill variant="pink">Cross-team · {item.waitingOn.length + 1} teams</Pill> : null}
          {item.waitingOn.map((w) => (
            <Pill key={w}>{nameOf(w)} waiting</Pill>
          ))}
        </div>
      </div>

      {raisedBy ? (
        <button type="button" className="feeds" onClick={() => openDetail('insight', raisedBy.id)}>
          <span className="feeds-eyebrow">Raised by</span>
          <span className="feeds-body">{raisedBy.headline}</span>
          <span className="feeds-due">
            View insight
            <ChevronRight size={14} className="feeds-chev" />
          </span>
        </button>
      ) : null}

      <div className="two">
        <div>
          {hasOptions ? (
            <div className="blk">
              <h3>Options modelled</h3>
              {item.options.map((o, i) => (
                <div className={`opt${o.recommended ? ' rec' : ''}`} key={i}>
                  <h4>
                    {o.heading} {o.recommended ? <Pill variant="pink">Recommended</Pill> : null}
                  </h4>
                  <p>{o.rationale}</p>
                  <div className="imp">
                    {o.impacts.map(([label, value], j) => (
                      <span key={j}>
                        {label} <b>{value}</b>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <div className="btnrow">
                {/* Inert by design (§2.8) — demonstrates the decision, not the action. */}
                <button type="button" className="btn">
                  Approve recommended
                </button>
                <button type="button" className="btn ghost" onClick={modelThis}>
                  Model an alternative
                </button>
                <AddToDiscussion item={discussionFromFocus(item)} />
                <button type="button" className="btn ghost">
                  Send back for detail
                </button>
              </div>
            </div>
          ) : (
            <div className="blk">
              <h3>Next steps</h3>
              <p>
                No options modelled yet. Ask the teams to lay out the trade-offs, or take this into Scenarios and model
                it directly.
              </p>
              <div className="btnrow">
                <button type="button" className="btn" onClick={modelThis}>
                  Model this in Scenarios
                </button>
                <AddToDiscussion item={discussionFromFocus(item)} />
                <button type="button" className="btn ghost">
                  Ask the teams to analyse it
                </button>
              </div>
            </div>
          )}

          <div className="blk">
            <h3>Why this reached you</h3>
            <p>
              This decision crosses more than one team and cannot be settled inside any single one of them.{' '}
              {blockedSentence}
            </p>
          </div>
        </div>

        <SideCard
          title="Decision record"
          rows={[
            ['Raised', '4 days ago'],
            ['Closes', item.due],
            ['Teams involved', String(item.waitingOn.length + 1)],
            ['Options modelled', String(item.options.length)],
            ['Reversible', item.severity === 'high' ? 'Partly' : 'Yes'],
          ]}
        />
      </div>
    </>
  );
}
