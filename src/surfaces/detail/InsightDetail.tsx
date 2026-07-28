import type { Insight, Stance } from '@/types';
import { useApp } from '@/store/app';
import { AGENTS } from '@/data/agents';
import { DEFAULT_FRESHNESS } from '@/data/sources';
import { BackLink } from '@/components/BackLink';
import { AgentRow } from '@/components/AgentRow';
import { Pill } from '@/components/Pill';
import { SideCard } from '@/components/SideCard';

/** §7.6 Insight detail — a full page with back navigation (§2.4). */
const STANCE_PILL: Record<Stance, string> = { agrees: 'teal', disagrees: 'pink', partly: 'amber' };
const FRESHNESS_LABEL = { live: 'Live', lagging: 'Lagging', periodic: 'Periodic' } as const;

export function InsightDetail({ insight }: { insight: Insight }) {
  const closeDetail = useApp((s) => s.closeDetail);
  const setTab = useApp((s) => s.setTab);
  const pinQuestion = useApp((s) => s.pinQuestion);
  const dissentCount = insight.crossOffice.length;

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

      <div className="two">
        <div>
          <div className="blk">
            <h3>What the specialists found</h3>
            {insight.agents.map((a) => (
              <AgentRow key={a} monogram={AGENTS[a].monogram} heading={AGENTS[a].label}>
                Queried {insight.sources.join(' and ')} for the entities in scope, reconciled against the shared
                definitions, and returned a typed finding with its confidence and freshness attached.
              </AgentRow>
            ))}
          </div>

          {dissentCount ? (
            <div className="blk">
              <h3>Where the offices disagree</h3>
              {insight.crossOffice.map((o, i) => (
                <div className="opt" key={i}>
                  <h4>
                    {o.office} <Pill variant={STANCE_PILL[o.stance]}>{o.label}</Pill>
                  </h4>
                  <p>{o.position}</p>
                </div>
              ))}
              <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: 10 }}>
                These positions are preserved rather than reconciled into a single recommendation. Each is correct
                against the metric that office is accountable for.
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
            <button type="button" className="btn" onClick={() => pinQuestion(insight.headline)}>
              Pin to PinBoard
            </button>
            <button type="button" className="btn ghost" onClick={() => setTab('scenarios')}>
              Model this in Scenarios
            </button>
          </div>
        </div>

        <SideCard
          title="Provenance"
          rows={[
            ...insight.sources.map((s) => [s, FRESHNESS_LABEL[DEFAULT_FRESHNESS[s]]] as [string, string]),
            ['Specialists', String(insight.agents.length)],
            ['Dissent preserved', String(dissentCount)],
            ['Confidence', 'High'],
          ]}
        />
      </div>
    </>
  );
}
