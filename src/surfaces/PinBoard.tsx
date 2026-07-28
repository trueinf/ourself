import type { Persona } from '@/types';
import { useApp } from '@/store/app';
import { ContextRow } from '@/components/ContextRow';
import { PageFootnote } from '@/components/PageFootnote';
import { PinCard } from '@/components/PinCard';

/** §7.5 PinBoard — tracked questions, and the "Worth tracking" open questions. */
export function PinBoard({ persona }: { persona: Persona }) {
  const pins = useApp((s) => s.pins);
  const unpin = useApp((s) => s.unpin);
  const pinQuestion = useApp((s) => s.pinQuestion);

  const list = pins[persona.id] ?? [];
  const open = persona.suggestedQuestions.filter((s) => !list.some((x) => x.question === s.question));

  return (
    <>
      <ContextRow persona={persona} tab="pinboard" />

      {list.length ? (
        <>
          <div className="sec-h">
            <h2>Questions you are tracking</h2>
            <span className="sub">Re-answered as the underlying data moves</span>
          </div>
          <div className="pin-g">
            {list.map((pin, i) => (
              <PinCard key={pin.question} pin={pin} onRemove={() => unpin(i)} />
            ))}
          </div>
        </>
      ) : (
        <div className="card" style={{ padding: 30, textAlign: 'center' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 650 }}>Nothing pinned yet</h3>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: 6 }}>
            Pin a question and ourse.l.f. keeps re-answering it as the data moves.
          </p>
        </div>
      )}

      {open.length ? (
        <div className="sec">
          <div className="sec-h">
            <h2>Worth tracking</h2>
            <span className="sub">Open questions in your portfolio with no settled answer</span>
          </div>
          <div className="sugg">
            {open.map((s, i) => (
              <button key={i} type="button" className="sg" onClick={() => pinQuestion(s.question)}>
                <span>{s.question}</span>
                <span className="tg">Pin&nbsp;+</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <PageFootnote />
    </>
  );
}
