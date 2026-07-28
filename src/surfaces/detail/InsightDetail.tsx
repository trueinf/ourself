import type { Persona, Insight } from '@/types';
import { useApp } from '@/store/app';
import { AGENTS } from '@/data/agents';
import { DEFAULT_FRESHNESS } from '@/data/sources';
import { BackLink } from '@/components/BackLink';
import { Pill } from '@/components/Pill';
import { SideCard } from '@/components/SideCard';
import { SourceChip } from '@/components/SourceChip';
import { CrossOfficeCards } from '@/components/CrossOfficeStrip';
import { InsightProofChart } from '@/components/InsightProofChart';
import { AddToDiscussion } from '@/components/AddToDiscussion';
import { discussionFromInsight } from '@/data/discussions';
import { ChevronRight } from '@/components/Icons';

/**
 * §7.6 Insight detail — a full page with back navigation (§2.4). It embodies
 * the reasoning/compute contract: specialists return FACTS (each with a
 * source), and offices take POSITIONS (each with a stance, preserved not
 * averaged). A proof chart substantiates quantitative claims, and a link ties
 * the insight to the decision it feeds.
 */
const FRESHNESS_LABEL = { live: 'Live', lagging: 'Lagging', periodic: 'Periodic' } as const;

export function InsightDetail({ persona, insight }: { persona: Persona; insight: Insight }) {
  const closeDetail = useApp((s) => s.closeDetail);
  const modelInScenarios = useApp((s) => s.modelInScenarios);
  const openDetail = useApp((s) => s.openDetail);
  const pinQuestion = useApp((s) => s.pinQuestion);

  const dissentCount = insight.crossOffice.length;
  const findings = insight.findings ?? [];
  const feedsItem = insight.feedsDecision ? persona.focus.find((f) => f.id === insight.feedsDecision) : undefined;
  const lagging = insight.sources.filter((s) => DEFAULT_FRESHNESS[s] === 'lagging').length;

  return (
    <>
      <BackLink label="Back to insights" onClick={closeDetail} />

      <div className="dt-h">
        <h1>{insight.headline}</h1>
        <p className="lede">{insight.why}</p>
        <div className="meta">
          {insight.pills.map((p, i) => (
            <Pill key={`p${i}`} variant={p.variant}>
              {p.text}
            </Pill>
          ))}
          {insight.agents.map((a) => (
            <Pill key={a}>{AGENTS[a].label}</Pill>
          ))}
        </div>
      </div>

      {feedsItem ? (
        <button type="button" className="feeds" onClick={() => openDetail('focus', feedsItem.id)}>
          <span className="feeds-eyebrow">Feeds a decision</span>
          <span className="feeds-body">
            {feedsItem.verb} · {feedsItem.headline}
          </span>
          <span className="feeds-due">
            Due {feedsItem.due}
            <ChevronRight size={14} className="feeds-chev" />
          </span>
        </button>
      ) : null}

      <div className="two">
        <div>
          <div className="blk">
            <h3>What the specialists found</h3>
            <div className="blk-sub">Facts — each reconciled against its source before it renders</div>
            {findings.map((f) => (
              <div className="agent" key={f.agent}>
                <span className="ic">{AGENTS[f.agent].monogram}</span>
                <div>
                  <h4>{AGENTS[f.agent].label}</h4>
                  <p>{f.text}</p>
                  {f.source ? (
                    <div className="agent-src">
                      <SourceChip source={f.source} freshness={DEFAULT_FRESHNESS[f.source]} />
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {insight.proof ? (
            <div className="blk">
              <h3>The evidence</h3>
              <div className="blk-sub">The number behind the headline, over the quarter</div>
              <InsightProofChart proof={insight.proof} />
            </div>
          ) : null}

          {dissentCount ? (
            <div className="blk">
              <h3>Where the offices stand</h3>
              <div className="blk-sub">Positions — judgement, preserved rather than averaged into a house view</div>
              <CrossOfficeCards views={insight.crossOffice} />
              <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: 12, maxWidth: '74ch' }}>
                Each position is correct against the metric that office is accountable for. They are preserved, not
                reconciled into a single recommendation.
              </p>
            </div>
          ) : null}

          <div className="blk">
            <h3>How this was assembled</h3>
            <div className="trace">
              <div className="tr done">
                <h5>Orchestrator dispatched {insight.agents.length} specialists in parallel</h5>
                <p>Deterministic dispatch — the same specialists are consulted for this class of finding every time.</p>
              </div>
              {insight.sources.map((s) => (
                <div className="tr done" key={s}>
                  <h5>Read from {s}</h5>
                  <p>
                    <code>entity: launch, market, sku</code> · reconciled against shared definitions
                  </p>
                </div>
              ))}
              <div className="tr done">
                <h5>Judgement node reconciled the findings</h5>
                <p>Produced one recommendation and preserved {dissentCount} dissenting positions.</p>
              </div>
            </div>
          </div>

          <div className="btnrow">
            {feedsItem ? (
              <button type="button" className="btn" onClick={() => openDetail('focus', feedsItem.id)}>
                Go to the decision
              </button>
            ) : null}
            <button
              type="button"
              className="btn ghost"
              onClick={() => modelInScenarios({ kind: 'insight', id: insight.id, headline: insight.headline })}
            >
              Model this in Scenarios
            </button>
            <AddToDiscussion item={discussionFromInsight(insight)} />
            <button type="button" className="btn ghost" onClick={() => pinQuestion(insight.headline)}>
              Pin to PinBoard
            </button>
          </div>
        </div>

        <SideCard
          title="Provenance"
          rows={[
            ...insight.sources.map((s) => [s, FRESHNESS_LABEL[DEFAULT_FRESHNESS[s]]] as [string, string]),
            ['Entities queried', <code key="ent">launch, market, sku</code>],
            ['Specialists', String(insight.agents.length)],
            ['Dissent preserved', String(dissentCount)],
            ['Confidence', 'High'],
            ['Basis', `${insight.sources.length} sources${lagging ? `, ${lagging} lagging` : ', all current'}`],
          ]}
        />
      </div>
    </>
  );
}
