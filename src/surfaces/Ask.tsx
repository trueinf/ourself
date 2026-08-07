import { useEffect, useMemo, useRef, useState } from 'react';
import type { Persona, Insight, AgentFinding } from '@/types';
import { useApp } from '@/store/app';
import { AGENTS } from '@/data/agents';
import { DEFAULT_FRESHNESS } from '@/data/sources';
import { resolveQuestion, isScenarioQuestion } from '@/data/askAnswers';
import { discussionFromQuestion } from '@/data/discussions';
import { ContextRow } from '@/components/ContextRow';
import { AddToDiscussion } from '@/components/AddToDiscussion';
import { SourceChip } from '@/components/SourceChip';
import { InsightProofChart } from '@/components/InsightProofChart';
import { CrossOfficeCards } from '@/components/CrossOfficeStrip';
import { Pill, pillClass } from '@/components/Pill';
import { ChevronLeft, ChevronRight, SearchIcon, SendIcon } from '@/components/Icons';

/** §7.3 Ask — natural language over the same governed facts as the rest of the
 *  app. A question resolves to an insight and the answer is assembled from it. */
export function Ask({ persona }: { persona: Persona }) {
  const askedQuestion = useApp((s) => s.askedQuestion);
  if (askedQuestion) return <AskAnswer key={askedQuestion} persona={persona} question={askedQuestion} />;
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
          <div className="ask-eyebrow">Company intelligence</div>
          <h2>Ask across the company</h2>
          <p>Each question goes to the teams that own the data, and they are free to disagree.</p>
        </div>
        <div className="askbox">
          <span className="askbox-ic" aria-hidden="true">
            <SearchIcon size={18} />
          </span>
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
        <div className="sugg-head">
          <b>Suggested questions</b>
          <span>Tap one to see how the teams answer</span>
        </div>
        <div className="sugg">
          {persona.suggestedQuestions.map((s, i) => (
            <button key={i} type="button" className="sg" onClick={() => ask(s.question)}>
              <span className="sg-chip">{s.tag}</span>
              <span className="sg-text">{s.question}</span>
              <span className="sg-go" aria-hidden="true">
                <ChevronRight size={16} />
              </span>
            </button>
          ))}
        </div>
        <div className="pagefoot" style={{ marginTop: 30 }}>
          Answers come from the teams that read the systems named on each finding. No team reports a number it did
          not pull from a source.
        </div>
      </div>
    </>
  );
}

/* ---- staged reasoning derived from the resolved finding ---- */
const STEP_MS = 820;
const truncate = (s: string, n = 104) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

function officeList(insight: Insight): string {
  const labels = insight.agents.map((a) => AGENTS[a].label);
  if (labels.length <= 1) return labels[0] ?? 'the teams';
  return labels.slice(0, -1).join(', ') + ' and ' + labels[labels.length - 1];
}

function buildSteps(insight: Insight | null): Array<{ title: string; detail: string }> {
  if (!insight) {
    return [
      { title: 'Reading the question', detail: 'Working out which teams it touches.' },
      { title: 'Searching the findings', detail: 'Matching it against what each team is seeing right now.' },
    ];
  }
  const findings = insight.findings ?? [];
  const dissent = insight.crossOffice.length;
  return [
    { title: 'Reading the question', detail: `Working out how it splits across ${officeList(insight)}.` },
    {
      title: `Asked ${insight.agents.length} teams`,
      detail: 'The same teams get asked for this kind of question every time, so the answer stays consistent.',
    },
    ...findings.map((f) => ({
      title: `${AGENTS[f.agent].label} · read ${f.source ?? 'the source systems'}`,
      detail: truncate(f.text),
    })),
    {
      title: 'Pulled the findings together',
      detail: dissent
        ? `One answer, with the ${dissent} team${dissent === 1 ? '' : 's'} that see it differently kept separate rather than blended in.`
        : 'The teams agreed. One answer, with its sources.',
    },
  ];
}

function AskAnswer({ persona, question }: { persona: Persona; question: string }) {
  const clearAsk = useApp((s) => s.clearAsk);
  const setTab = useApp((s) => s.setTab);
  const modelInScenarios = useApp((s) => s.modelInScenarios);
  const openDetail = useApp((s) => s.openDetail);
  const pinQuestion = useApp((s) => s.pinQuestion);
  const pins = useApp((s) => s.pins);
  const pinned = (pins[persona.id] ?? []).some((x) => x.question === question);

  const insight = useMemo(() => resolveQuestion(question), [question]);
  const scenario = isScenarioQuestion(question);
  const steps = useMemo(() => buildSteps(insight), [insight]);

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const doneMs = STEP_MS * steps.length + 600;

  useEffect(() => {
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setStep(steps.length);
      setElapsed(doneMs);
      setDone(true);
      return;
    }
    setStep(0);
    setDone(false);
    setElapsed(0);
    const start = Date.now();
    const stepTimers = steps.map((_, i) => window.setTimeout(() => setStep(i + 1), STEP_MS * (i + 1)));
    const ticker = window.setInterval(() => setElapsed(Date.now() - start), 100);
    const doneTimer = window.setTimeout(() => {
      window.clearInterval(ticker);
      setElapsed(Date.now() - start);
      setDone(true);
    }, doneMs);
    return () => {
      stepTimers.forEach((t) => window.clearTimeout(t));
      window.clearInterval(ticker);
      window.clearTimeout(doneTimer);
    };
  }, [question, steps, doneMs]);

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
                Building the answer from the teams that own the data
              </div>
              <div className="trace">
                {steps.map((s, i) => {
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
            The teams read and explain the numbers, but they never make them up. Every figure is checked against its
            source before it shows up here.
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
            {insight ? (
              <Answer
                insight={insight}
                question={question}
                scenario={scenario}
                onScenario={() => modelInScenarios({ kind: 'insight', id: insight.id, headline: insight.headline })}
                onOpenInsight={() => openDetail('insight', insight.id)}
                elapsed={seconds}
              />
            ) : (
              <NoMatch onScenario={() => setTab('scenarios')} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function FindingRow({ finding }: { finding: AgentFinding }) {
  return (
    <div className="agent">
      <span className="ic">{AGENTS[finding.agent].monogram}</span>
      <div>
        <h4>{AGENTS[finding.agent].label}</h4>
        <p>{finding.text}</p>
        {finding.source ? (
          <div className="agent-src">
            <SourceChip source={finding.source} freshness={DEFAULT_FRESHNESS[finding.source]} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Answer({
  insight,
  question,
  scenario,
  onScenario,
  onOpenInsight,
  elapsed,
}: {
  insight: Insight;
  question: string;
  scenario: boolean;
  onScenario: () => void;
  onOpenInsight: () => void;
  elapsed: string;
}) {
  const findings = insight.findings ?? [];
  const positions = insight.crossOffice;
  const toolCalls = insight.sources.length * 3 + insight.agents.length * 2 + 1;

  return (
    <>
      <p>
        <b>Short answer.</b>{' '}
        {positions.length
          ? 'The teams agree on what is happening but not on what to do about it. The disagreement is kept below rather than smoothed over.'
          : 'The teams agree here. The finding and its sources are below.'}
      </p>
      <p>{insight.why}</p>

      <div className="ansdash">
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          Key facts
        </div>
        <div className="meta">
          {insight.pills.map((p, i) => (
            <Pill key={i} variant={p.variant}>
              {p.text}
            </Pill>
          ))}
        </div>
        {insight.proof ? <InsightProofChart proof={insight.proof} /> : null}
      </div>

      {scenario ? (
        <button type="button" className="feeds" onClick={onScenario}>
          <span className="feeds-eyebrow">This is a what-if</span>
          <span className="feeds-body">Model it to see the levers move the numbers together</span>
          <span className="feeds-due">
            Open Scenarios
            <ChevronRight size={14} className="feeds-chev" />
          </span>
        </button>
      ) : null}

      <div style={{ marginTop: 16 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          Teams consulted
        </div>
        {findings.map((f) => (
          <FindingRow key={f.agent} finding={f} />
        ))}
      </div>

      {positions.length ? (
        <div style={{ marginTop: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Where each team stands
          </div>
          <CrossOfficeCards views={positions} />
        </div>
      ) : null}

      <div className="srcs" style={{ marginTop: 16 }}>
        {insight.sources.map((s) => (
          <SourceChip key={s} source={s} freshness={DEFAULT_FRESHNESS[s]} />
        ))}
      </div>

      <div className="btnrow">
        <AddToDiscussion item={discussionFromQuestion(question, insight)} />
      </div>

      <div className="pagefoot" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <span>
          Answered in {elapsed}s · {insight.agents.length} teams asked · {toolCalls} tool calls · full trace available
        </span>
        <button type="button" className="linklike" onClick={onOpenInsight}>
          Open the full finding →
        </button>
      </div>
    </>
  );
}

function NoMatch({ onScenario }: { onScenario: () => void }) {
  return (
    <>
      <p>
        <b>Nothing settled on this yet.</b> I could not match this question to a finding the teams are currently
        holding. Try one of the suggested questions, or take it into Scenarios to model it directly.
      </p>
      <div className="btnrow">
        <button type="button" className="btn" onClick={onScenario}>
          Model this in Scenarios
        </button>
      </div>
    </>
  );
}
