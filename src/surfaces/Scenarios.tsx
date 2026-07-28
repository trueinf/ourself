import type { Persona } from '@/types';
import { useApp } from '@/store/app';
import { SCENARIO_MODELS, defaultLeverValues } from '@/scenarios';
import { AGENTS } from '@/data/agents';
import { SCENARIO_BACKS } from '@/data/scenarioBacks';
import { ContextRow } from '@/components/ContextRow';
import { LeverGroup } from '@/components/LeverGroup';
import { OutputTile } from '@/components/OutputTile';
import { CalcPanel } from '@/components/CalcPanel';
import { AgentRow } from '@/components/AgentRow';
import { ChevronLeft, ChevronRight } from '@/components/Icons';

/**
 * §7.4 Scenarios — what-if, grounded. The numbers are deterministic arithmetic
 * (§9); the specialists speak only to feasibility. The surface is anchored: to
 * the baseline (named, with "now" markers on the levers), to the decisions and
 * findings it backs, and to whatever "Model this in Scenarios" jump brought
 * you here.
 */
export function Scenarios({ persona }: { persona: Persona }) {
  const modelId = persona.scenarioModel;
  const model = SCENARIO_MODELS[modelId];
  const scenarioInputs = useApp((s) => s.scenarioInputs);
  const setLever = useApp((s) => s.setLever);
  const resetScenario = useApp((s) => s.resetScenario);
  const openDetail = useApp((s) => s.openDetail);
  const context = useApp((s) => s.scenarioContext);

  const values = scenarioInputs[modelId] ?? defaultLeverValues(model);
  const result = model.compute(values);

  const backs = SCENARIO_BACKS[persona.id] ?? { focus: [], insights: [] };
  const backedDecisions = backs.focus
    .map((id) => persona.focus.find((f) => f.id === id))
    .filter((f): f is NonNullable<typeof f> => Boolean(f));
  const backedInsights = backs.insights
    .map((id) => persona.insights.find((i) => i.id === id))
    .filter((i): i is NonNullable<typeof i> => Boolean(i));

  return (
    <>
      <ContextRow persona={persona} tab="scenarios" />

      {context ? (
        <button type="button" className="feeds" onClick={() => openDetail(context.kind, context.id)}>
          <span className="feeds-eyebrow">Modelling for</span>
          <span className="feeds-body">{context.headline}</span>
          <span className="feeds-due">
            <ChevronLeft size={14} />
            Back to {context.kind === 'focus' ? 'the decision' : 'the finding'}
          </span>
        </button>
      ) : (
        <div className="synth">
          <div className="synth-eyebrow">The bench</div>
          <p>{model.read}</p>
        </div>
      )}

      <div className="scn">
        <div className="card">
          <div className="eyebrow" style={{ marginBottom: 3 }}>
            Levers
          </div>
          <div style={{ fontSize: '13.5px', fontWeight: 650, marginBottom: 14 }}>{model.title}</div>
          {model.levers.map((lever) => (
            <LeverGroup
              key={lever.id}
              lever={lever}
              value={values[lever.id] ?? lever.default}
              onChange={(v) => setLever(modelId, lever.id, v)}
            />
          ))}
          <div className="btnrow">
            <button type="button" className="btn ghost" onClick={() => resetScenario(modelId)}>
              Reset to current
            </button>
          </div>
        </div>

        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Outputs · vs {model.baselineLabel}
          </div>
          <div className="outs">
            {result.outputs.map((o, i) => (
              <OutputTile key={i} output={o} baselineLabel={model.baselineLabel} />
            ))}
          </div>

          <CalcPanel rows={result.derivationRows} />

          <div className="sec">
            <div className="sec-h">
              <h2>What the specialists say about it</h2>
              <span className="sub">Judgement, not arithmetic</span>
            </div>
            <div className="card">
              {result.judgements.map((j, i) => (
                <AgentRow key={i} monogram={AGENTS[j.agent].monogram} heading={j.heading}>
                  {j.text}
                </AgentRow>
              ))}
            </div>
          </div>

          {backedDecisions.length || backedInsights.length ? (
            <div className="sec">
              <div className="sec-h">
                <h2>What this model backs</h2>
                <span className="sub">The decisions and findings these levers sit under</span>
              </div>
              <div className="backs">
                {backedDecisions.map((f) => (
                  <button type="button" className="back-item" key={f.id} onClick={() => openDetail('focus', f.id)}>
                    <span className="back-kind decision">Decision</span>
                    <span className="back-title">{f.headline}</span>
                    <ChevronRight size={14} className="back-chev" />
                  </button>
                ))}
                {backedInsights.map((i) => (
                  <button type="button" className="back-item" key={i.id} onClick={() => openDetail('insight', i.id)}>
                    <span className="back-kind finding">Finding</span>
                    <span className="back-title">{i.headline}</span>
                    <ChevronRight size={14} className="back-chev" />
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="pagefoot">{model.lede}</div>
        </div>
      </div>
    </>
  );
}
