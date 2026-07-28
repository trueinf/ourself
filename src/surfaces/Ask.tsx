import { useEffect, useRef, useState } from 'react';
import type { Persona } from '@/types';
import { useApp } from '@/store/app';
import { SYS } from '@/data/sources';
import { ContextRow } from '@/components/ContextRow';
import { AgentRow } from '@/components/AgentRow';
import { DissentPanel } from '@/components/DissentPanel';
import { SourceChip } from '@/components/SourceChip';
import { AnswerDashboard } from '@/components/AnswerDashboard';
import { pillClass } from '@/components/Pill';
import { ChevronLeft, SendIcon } from '@/components/Icons';

/**
 * The answer is assembled step by step, not returned instantly: the
 * orchestrator plans, dispatches three specialists in parallel, each reads its
 * source systems, and a judgement node reconciles — matching the trace the
 * product claims (§7.3 footer). Under prefers-reduced-motion the steps resolve
 * immediately (§12.3).
 */
const STEP_MS = 850;
const STEPS: Array<{ title: string; detail: string }> = [
  { title: 'Planning the question', detail: 'Decomposing it into sub-questions across Finance, Supply and Regulatory.' },
  {
    title: 'Dispatched 3 specialists in parallel',
    detail: 'Deterministic dispatch — the same specialists are consulted for this class of finding every time.',
  },
  { title: 'Supply · read Customs & broker', detail: 'entity: sku, origin — qualification status on two contract manufacturers.' },
  { title: 'Finance · read SAP and the FP&A model', detail: 'entity: margin, tariff — realised rate against the published 35% assumption.' },
  { title: 'Regulatory · read the compliance tracker', detail: 'entity: site — registration status at both sites.' },
  {
    title: 'Judgement node reconciled the findings',
    detail: 'One recommendation produced; the Supply-vs-Finance dissent preserved, not averaged.',
  },
];
const DONE_MS = STEP_MS * STEPS.length + 700;

/** §7.3 Ask — natural language, cross-domain. Empty state and answered state. */
export function Ask({ persona }: { persona: Persona }) {
  const askedQuestion = useApp((s) => s.askedQuestion);
  if (askedQuestion) return <AskAnswer persona={persona} question={askedQuestion} />;
  return <AskEmpty persona={persona} />;
}

function AskEmpty({ persona }: { persona: Persona }) {
  const ask = useApp((s) => s.ask);
  const [value, setValue] = useState('');
  const taRef = useRef<HTMLTextAreaElement>(null);
  const trimmed = value.trim();

  const grow = () => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 150) + 'px';
  };

  const submit = () => {
    if (trimmed) ask(trimmed);
  };

  return (
    <>
      <ContextRow persona={persona} tab="ask" />
      <div className="askwrap">
        <div className="askhero">
          <h2>Ask across every office</h2>
          <p>Questions are answered by the specialists that hold the data — and they are allowed to disagree.</p>
        </div>
        <div className="askbox">
          <textarea
            ref={taRef}
            rows={1}
            placeholder="Ask anything about the business…"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              grow();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
          <button type="button" className="send" onClick={submit} disabled={!trimmed} aria-label="Ask">
            <SendIcon />
          </button>
        </div>
        <div className="sugg">
          {persona.suggestedQuestions.map((s, i) => (
            <button key={i} type="button" className="sg" onClick={() => ask(s.question)}>
              <span>{s.question}</span>
              <span className="tg">{s.tag}</span>
            </button>
          ))}
        </div>
        <div className="pagefoot" style={{ marginTop: 26 }}>
          Answers are produced by dispatching specialist agents in parallel over the systems named on each finding.
          Agents never return a number they did not obtain from a tool.
        </div>
      </div>
    </>
  );
}

function AskAnswer({ persona, question }: { persona: Persona; question: string }) {
  const clearAsk = useApp((s) => s.clearAsk);
  const pinQuestion = useApp((s) => s.pinQuestion);
  const pins = useApp((s) => s.pins);
  const pinned = (pins[persona.id] ?? []).some((x) => x.question === question);

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setStep(STEPS.length);
      setElapsed(6200);
      setDone(true);
      return;
    }
    setStep(0);
    setDone(false);
    setElapsed(0);
    const start = Date.now();
    const stepTimers = STEPS.map((_, i) => window.setTimeout(() => setStep(i + 1), STEP_MS * (i + 1)));
    const ticker = window.setInterval(() => setElapsed(Date.now() - start), 100);
    const doneTimer = window.setTimeout(() => {
      window.clearInterval(ticker);
      setElapsed(Date.now() - start);
      setDone(true);
    }, DONE_MS);
    return () => {
      stepTimers.forEach((t) => window.clearTimeout(t));
      window.clearInterval(ticker);
      window.clearTimeout(doneTimer);
    };
  }, [question]);

  const seconds = (elapsed / 1000).toFixed(1);

  if (!done) {
    return (
      <>
        <ContextRow persona={persona} tab="ask" />
        <div className="askwrap">
          <button type="button" className="back" onClick={clearAsk}>
            <ChevronLeft /> New question
          </button>
          <div className="ans">
            <div className="ans-q">
              <span>{question}</span>
              <span className="working">
                <span className="dots">
                  <i />
                  <i />
                  <i />
                </span>
                Working · {seconds}s
              </span>
            </div>
            <div className="ans-b">
              <div className="eyebrow" style={{ marginBottom: 10 }}>
                Assembling the answer from the specialists that hold the data
              </div>
              <div className="trace">
                {STEPS.map((s, i) => {
                  const cls = i < step ? 'done' : i === step ? 'active' : 'pending';
                  return (
                    <div className={`tr ${cls}`} key={i}>
                      <h5>{s.title}</h5>
                      <p>{s.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="pagefoot">
            Reasoning and computation are peer layers bound by a contract — agents narrate and interpret figures, but
            never author them. Every number is reconciled against its source before it renders.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ContextRow persona={persona} tab="ask" />
      <div className="askwrap ans-reveal">
        <button type="button" className="back" onClick={clearAsk}>
          <ChevronLeft /> New question
        </button>
        <div className="ans">
          <div className="ans-q">
            <span>{question}</span>
            <button
              type="button"
              className={pillClass(pinned ? 'dark' : 'pink')}
              onClick={() => pinQuestion(question)}
            >
              {pinned ? 'Pinned' : 'Pin to PinBoard'}
            </button>
          </div>
          <div className="ans-b">
            <p>
              <b>Short answer.</b> Three specialists agree on the mechanism and disagree on the response. The finding
              below reconciles them; the dissent is preserved rather than averaged out.
            </p>

            <AnswerDashboard />

            <p style={{ marginTop: 16 }}>
              The driver is the origin transition running about six weeks behind on two contract manufacturers, which
              leaves more volume than modelled landing at the higher China rate. At roughly 18 basis points of gross
              margin per 100 basis points of tariff, the 350 basis point gap is worth about 63 basis points of margin
              this quarter.
            </p>
            <div style={{ marginTop: 16 }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                Specialists consulted
              </div>
              <AgentRow monogram="SUP" heading="Supply">
                Both plants are in qualification, not production. Line trials cleared at one site this week; the second
                slipped five days on documentation. Air freight would recover about four weeks.
              </AgentRow>
              <AgentRow monogram="FIN" heading="Finance">
                The published FY2027 guide assumes 35%. Realised is 38.5%. If the gap has not closed by the Q2 print, the
                assumption is restated publicly.
              </AgentRow>
              <AgentRow monogram="REG" heading="Regulatory">
                No registration barrier at either site. The delay is qualification throughput, not compliance — so it is
                a resourcing decision, not a legal one.
              </AgentRow>
            </div>
            <DissentPanel heading="Preserved dissent — Supply against Finance">
              Supply holds that the gap closes naturally in Q2 and air freight is an avoidable cost. Finance holds that
              the public assumption cannot depend on a qualification schedule that has already slipped twice. Both
              readings are consistent with the same data; the disagreement is about risk tolerance, not fact.
            </DissentPanel>
            <div className="srcs" style={{ marginTop: 16 }}>
              <SourceChip source={SYS.cust} freshness="lagging" />
              <SourceChip source={SYS.sap} freshness="live" />
              <SourceChip source={SYS.fpa} freshness="periodic" />
              <SourceChip source={SYS.reg} freshness="periodic" />
            </div>
          </div>
        </div>
        <div className="pagefoot">
          Answered in {seconds}s · 3 specialists dispatched in parallel · 11 tool calls · full trace available
        </div>
      </div>
    </>
  );
}
