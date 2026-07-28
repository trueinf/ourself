import type { Persona } from '@/types';
import { useApp } from '@/store/app';
import { ContextRow } from '@/components/ContextRow';
import { PageFootnote } from '@/components/PageFootnote';
import { FocusRow } from '@/components/FocusRow';
import { DecisionRow } from '@/components/DecisionRow';

/** §7.2 Focus — the decision queue, plus the required decision track record. */
export function Focus({ persona }: { persona: Persona }) {
  const openDetail = useApp((s) => s.openDetail);

  return (
    <>
      <ContextRow persona={persona} tab="focus" />

      {persona.focusRead ? (
        <div className="synth">
          <div className="synth-eyebrow">The queue</div>
          <p>{persona.focusRead}</p>
        </div>
      ) : null}

      <div className="sec-h">
        <h2>Needs a decision from you</h2>
        <span className="sub">Ordered by what closes soonest</span>
      </div>
      <div className="fq">
        {persona.focus.map((f) => (
          <FocusRow key={f.id} item={f} onOpen={() => openDetail('focus', f.id)} />
        ))}
      </div>

      <div className="sec">
        <div className="sec-h">
          <h2>Already decided</h2>
          <span className="sub">What the call was, and how it landed</span>
        </div>
        <div className="grid">
          {persona.closedDecisions.map((d, i) => (
            <DecisionRow key={i} decision={d} />
          ))}
        </div>
      </div>

      <PageFootnote />
    </>
  );
}
