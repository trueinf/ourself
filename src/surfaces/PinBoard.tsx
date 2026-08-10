import type { Persona } from '@/types';
import { useApp } from '@/store/app';
import { resolveQuestion } from '@/data/askAnswers';
import { ContextRow } from '@/components/ContextRow';
import { PageFootnote } from '@/components/PageFootnote';
import { PinCard } from '@/components/PinCard';

/** §7.5 PinBoard — a live watchlist. Tracked questions re-answer against the
 *  same governed findings as Ask; "Worth tracking" questions can be asked or
 *  pinned. */
export function PinBoard({ persona }: { persona: Persona }) {
  const pins = useApp((s) => s.pins);
  const unpin = useApp((s) => s.unpin);
  const pinQuestion = useApp((s) => s.pinQuestion);
  const openAsk = useApp((s) => s.openAsk);

  const list = pins[persona.id] ?? [];
  const open = persona.suggestedQuestions.filter((s) => !list.some((x) => x.question === s.question));

  const counts = list.reduce(
    (acc, p) => {
      acc[p.trend] += 1;
      return acc;
    },
    { up: 0, down: 0, flat: 0 } as Record<'up' | 'down' | 'flat', number>,
  );

  return (
    <>
      <ContextRow persona={persona} tab="pinboard" />

      {list.length ? (
        <div className="synth">
          <div className="synth-eyebrow">The watchlist</div>
          <p>
            You’re tracking {list.length} question{list.length === 1 ? '' : 's'}. {counts.down} worsening,{' '}
            {counts.up} improving, {counts.flat} holding. Each one updates as its finding moves. Last checked this week.
          </p>
        </div>
      ) : null}

      {list.length ? (
        <>
          <div className="sec-h">
            <h2>Questions you are tracking</h2>
            <span className="sub">Re-answered as the underlying data moves</span>
          </div>
          <div className="pin-g">
            {list.map((pin, i) => (
              <PinCard
                key={pin.question}
                pin={pin}
                source={resolveQuestion(pin.question)?.sources[0]}
                onAsk={() => openAsk(pin.question)}
                onRemove={() => unpin(i)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="card" style={{ padding: 30, textAlign: 'center' }}>
          <h3 style={{ fontSize: 'calc(15px * var(--fs))', fontWeight: 650 }}>Nothing pinned yet</h3>
          <p style={{ fontSize: 'calc(13px * var(--fs))', color: 'var(--muted)', marginTop: 6 }}>
            Pin a question and yourse.l.f. keeps re-answering it as the data moves.
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
              <div className="sg" key={i}>
                <button type="button" className="sg-q" onClick={() => openAsk(s.question)}>
                  {s.question}
                </button>
                <button type="button" className="sg-pin" onClick={() => pinQuestion(s.question)}>
                  Pin&nbsp;+
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <PageFootnote />
    </>
  );
}
