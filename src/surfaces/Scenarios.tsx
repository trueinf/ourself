import type { Persona } from '@/types';
import { useApp } from '@/store/app';
import { SCENARIO_MODELS, defaultLeverValues } from '@/scenarios';
import { AGENTS } from '@/data/agents';
import { ContextRow } from '@/components/ContextRow';
import { LeverGroup } from '@/components/LeverGroup';
import { OutputTile } from '@/components/OutputTile';
import { CalcPanel } from '@/components/CalcPanel';
import { AgentRow } from '@/components/AgentRow';

/**
 * §7.4 Scenarios — what-if. The numbers are deterministic arithmetic (§9);
 * the specialists speak only to feasibility, and their text is conditional on
 * the lever values. That third block is the whole point (§7.4).
 */
export function Scenarios({ persona }: { persona: Persona }) {
  const modelId = persona.scenarioModel;
  const model = SCENARIO_MODELS[modelId];
  const scenarioInputs = useApp((s) => s.scenarioInputs);
  const setLever = useApp((s) => s.setLever);
  const resetScenario = useApp((s) => s.resetScenario);

  const values = scenarioInputs[modelId] ?? defaultLeverValues(model);
  const result = model.compute(values);

  return (
    <>
      <ContextRow persona={persona} tab="scenarios" />
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
          <div className="outs">
            {result.outputs.map((o, i) => (
              <OutputTile key={i} output={o} />
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

          <div className="pagefoot">{model.lede}</div>
        </div>
      </div>
    </>
  );
}
