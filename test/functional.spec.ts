import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { createElement } from 'react';
import App from '@/App';
import { useApp, TABS, type TabId, type DetailRef } from '@/store/app';
import { PERSONAS } from '@/data/personas';
import { SCENARIO_MODELS } from '@/scenarios';
import { rankByGoal, tokenizeGoal, scoreText, kpiText, insightText } from '@/lib/goals';
import type { ScenarioModel, LeverValues, ScenarioModelId } from '@/types';

/* =============================================================
   §18.3 Harness A — functional. Vitest + jsdom. Iterates every persona ×
   every tab, then every insight/focus detail, then sweeps the scenario
   engines exhaustively, then checks the pin/nav interaction rules.
   Baseline from the prototype: 363 assertions, 189 lever combinations.
   ============================================================= */

afterEach(() => cleanup());

const TAB_IDS: TabId[] = TABS.map(([id]) => id);

function renderAt(state: { personaIndex: number; tab: TabId; detail?: DetailRef | null }) {
  useApp.setState({
    personaIndex: state.personaIndex,
    tab: state.tab,
    detail: state.detail ?? null,
    askedQuestion: null,
    personaMenuOpen: false,
  });
  render(createElement(App));
  const main = document.getElementById('main');
  if (!main) throw new Error('#main not found');
  return main;
}

const BAD = /undefined|NaN|\[object Object\]/;

describe('every persona × every tab renders clean', () => {
  for (const [pi, persona] of PERSONAS.entries()) {
    for (const tab of TAB_IDS) {
      it(`${persona.name} · ${tab}`, () => {
        const main = renderAt({ personaIndex: pi, tab });
        expect(main.innerHTML.length).toBeGreaterThan(200);
        expect(main.innerHTML).not.toMatch(BAD);
      });
    }
  }
});

describe('every insight and focus detail is a full page with back nav', () => {
  for (const [pi, persona] of PERSONAS.entries()) {
    for (const insight of persona.insights) {
      it(`${persona.name} · insight ${insight.id}`, () => {
        const main = renderAt({ personaIndex: pi, tab: 'insights', detail: { kind: 'insight', id: insight.id } });
        expect(main.textContent).toContain('Back to insights');
        expect(main.innerHTML).not.toMatch(/undefined|NaN/);
      });
    }
    for (const item of persona.focus) {
      it(`${persona.name} · focus ${item.id}`, () => {
        const main = renderAt({ personaIndex: pi, tab: 'focus', detail: { kind: 'focus', id: item.id } });
        expect(main.textContent).toContain('Back to focus');
        expect(main.innerHTML).not.toMatch(/undefined|NaN/);
      });
    }
  }
});

/** Segment option values × {min, midpoint, max} of every range lever. */
function allLeverCombinations(model: ScenarioModel): LeverValues[] {
  let combos: LeverValues[] = [{}];
  for (const lever of model.levers) {
    const values: Array<string | number> =
      lever.kind === 'segments'
        ? lever.options.map(([v]) => v)
        : [lever.min, (lever.min + lever.max) / 2, lever.max];
    const next: LeverValues[] = [];
    for (const combo of combos) {
      for (const v of values) next.push({ ...combo, [lever.id]: v });
    }
    combos = next;
  }
  return combos;
}

describe('scenario engines sweep exhaustively (189 combinations)', () => {
  let totalCombos = 0;
  for (const id of Object.keys(SCENARIO_MODELS) as ScenarioModelId[]) {
    const model = SCENARIO_MODELS[id];
    const combos = allLeverCombinations(model);
    it(`${id}: ${combos.length} combinations produce finite, clean output`, () => {
      for (const combo of combos) {
        const r = model.compute(combo);
        expect(JSON.stringify(r)).not.toMatch(/null|NaN|Infinity/);
        for (const o of r.outputs) expect(Number.isFinite(o.current)).toBe(true);
        expect(r.judgements.length).toBe(3);
        expect(r.outputs.length).toBe(4);
      }
      totalCombos += combos.length;
    });
  }
  it('the four models sweep exactly 189 combinations in total', () => {
    const n = (Object.keys(SCENARIO_MODELS) as ScenarioModelId[]).reduce(
      (sum, id) => sum + allLeverCombinations(SCENARIO_MODELS[id]).length,
      0,
    );
    expect(n).toBe(189);
  });
});

describe('scenario judgements are conditional on lever values (§14 #7)', () => {
  it('CFO Finance flips on the tariff assumption at the 36% threshold', () => {
    const cfo = SCENARIO_MODELS.cfo;
    // pace "plan" → realised tariff equals the lever value.
    const high = cfo.compute({ scope: 'face', tariff: 40, marketing: 26, pace: 'plan' });
    const low = cfo.compute({ scope: 'face', tariff: 32, marketing: 26, pace: 'plan' });
    expect(high.judgements.find((j) => j.agent === 'fin')?.text).toMatch(/risk of restatement/);
    expect(low.judgements.find((j) => j.agent === 'fin')?.text).toMatch(/within the published assumption/);
  });
  it('CFO Supply flips when the reversal scope includes lip', () => {
    const cfo = SCENARIO_MODELS.cfo;
    const face = cfo.compute({ scope: 'face', tariff: 38.5, marketing: 26, pace: 'plan' });
    const lip = cfo.compute({ scope: 'facelip', tariff: 38.5, marketing: 26, pace: 'plan' });
    expect(face.judgements.find((j) => j.agent === 'sup')?.text).toMatch(/No supply constraint/);
    expect(lip.judgements.find((j) => j.agent === 'sup')?.text).toMatch(/committed until August/);
  });
});

describe('interaction rules (§11)', () => {
  it('pinning from an answer adds exactly one; pinning twice adds nothing', () => {
    useApp.setState({ personaIndex: 0 });
    const id = PERSONAS[0]!.id;
    const before = useApp.getState().pins[id]!.length;
    useApp.getState().pinQuestion('A brand new tracked question?');
    expect(useApp.getState().pins[id]!.length).toBe(before + 1);
    useApp.getState().pinQuestion('A brand new tracked question?');
    expect(useApp.getState().pins[id]!.length).toBe(before + 1);
  });

  it('pinning from a PinBoard suggestion works', () => {
    useApp.setState({ personaIndex: 2 });
    const persona = PERSONAS[2]!;
    const before = useApp.getState().pins[persona.id]!.length;
    useApp.getState().pinQuestion(persona.suggestedQuestions[0]!.question);
    expect(useApp.getState().pins[persona.id]!.length).toBe(before + 1);
  });

  it('removing a pin decrements the count', () => {
    useApp.setState({ personaIndex: 1 });
    const id = PERSONAS[1]!.id;
    const before = useApp.getState().pins[id]!.length;
    useApp.getState().unpin(0);
    expect(useApp.getState().pins[id]!.length).toBe(before - 1);
  });

  it('switching persona clears detail and askedQuestion', () => {
    useApp.setState({ personaIndex: 0, detail: { kind: 'insight', id: 'f1' }, askedQuestion: 'why?' });
    useApp.getState().setPersona(3);
    expect(useApp.getState().detail).toBeNull();
    expect(useApp.getState().askedQuestion).toBeNull();
    expect(useApp.getState().personaIndex).toBe(3);
  });

  it('switching tab clears detail', () => {
    useApp.setState({ personaIndex: 0, tab: 'insights', detail: { kind: 'insight', id: 'f1' } });
    useApp.getState().setTab('focus');
    expect(useApp.getState().detail).toBeNull();
    expect(useApp.getState().tab).toBe('focus');
  });
});

describe('goal editing re-ranks the same governed facts (§8.1a)', () => {
  it('rankByGoal is stable and orders by relevance descending, no keywords → original order', () => {
    const items = ['alpha tariff', 'beta margin', 'gamma tariff margin'];
    const ranked = rankByGoal(items, ['tariff'], (t) => t).map((r) => r.item);
    expect(ranked[0]).toBe('alpha tariff'); // first tariff hit keeps its lead on a tie
    expect(ranked[2]).toBe('beta margin'); // no hit sinks to the bottom
    const untouched = rankByGoal(items, [], (t) => t).map((r) => r.item);
    expect(untouched).toEqual(items);
  });

  it('tokenizeGoal drops stopwords and short words', () => {
    expect(tokenizeGoal('Protect the marketing envelope and units')).toEqual(['protect', 'marketing', 'envelope', 'units']);
  });

  it('every persona has ≥2 goal presets, and each preset re-ranks at least one KPI or insight', () => {
    for (const p of PERSONAS) {
      expect(p.goalPresets.length).toBeGreaterThanOrEqual(2);
      for (const preset of p.goalPresets) {
        const hitsKpi = p.kpis.some((k) => scoreText(kpiText(k), preset.keywords) > 0);
        const hitsInsight = p.insights.some((i) => scoreText(insightText(i), preset.keywords) > 0);
        expect(hitsKpi || hitsInsight, `${p.id} preset "${preset.label}" matches nothing`).toBe(true);
      }
    }
  });

  it('applying a goal persists per persona and re-orders insights; reset restores', () => {
    useApp.setState({ personaIndex: 0, goals: {} });
    const preset = PERSONAS[0]!.goalPresets[0]!;
    const before = [...PERSONAS[0]!.insights]; // baseline order untouched (data is immutable)
    useApp.getState().applyGoal(preset.objective, preset.keywords);
    expect(useApp.getState().goals['fields']!.objective).toBe(preset.objective);

    const ranked = rankByGoal(PERSONAS[0]!.insights, preset.keywords, insightText);
    expect(ranked[0]!.score).toBeGreaterThan(0); // the top item is goal-relevant
    expect(PERSONAS[0]!.insights).toEqual(before); // ranking never mutates the source data

    useApp.getState().resetGoal();
    expect(useApp.getState().goals['fields']).toBeUndefined();
  });

  it('renders Insights cleanly with a goal applied', () => {
    useApp.setState({
      personaIndex: 0,
      goals: { fields: { objective: 'Recover the top line', keywords: ['units', 'price', 'reversal'] } },
    });
    const main = renderAt({ personaIndex: 0, tab: 'insights' });
    expect(main.textContent).toContain('Re-prioritised for your goal');
    expect(main.innerHTML).not.toMatch(BAD);
    useApp.setState({ goals: {} });
  });
});

describe('data-model invariants (§8)', () => {
  it('there are exactly eight personas, none of the forbidden roles (§8.1)', () => {
    expect(PERSONAS.length).toBe(8);
    const forbidden = /sustainability|impact officer|chief strategy|corporate development|chief supply chain|^chro$/i;
    for (const p of PERSONAS) {
      expect(p.title).not.toMatch(forbidden);
      expect(p.kpis.length).toBe(5);
      expect(p.closedDecisions.length).toBeGreaterThan(0);
    }
  });

  it('every persona has at least one Backfired decision somewhere in the set (§7.2)', () => {
    const anyBackfired = PERSONAS.some((p) => p.closedDecisions.some((d) => d.result === 'backfired'));
    expect(anyBackfired).toBe(true);
    // Chopra specifically carries the data-contracts backfire.
    const chopra = PERSONAS.find((p) => p.id === 'chopra')!;
    expect(chopra.closedDecisions.some((d) => d.result === 'backfired')).toBe(true);
  });

  it('every KPI carries a source, a benchmark note, and exactly 7 sparkline values (§2.2)', () => {
    for (const p of PERSONAS) {
      for (const k of p.kpis) {
        expect(k.source.length).toBeGreaterThan(0);
        expect(k.note.length).toBeGreaterThan(0);
        expect(k.spark.length).toBe(7);
      }
    }
  });

  it('every persona carries a one-line synthesis "read"', () => {
    for (const p of PERSONAS) {
      expect(p.synthesis.length).toBeGreaterThan(20);
    }
  });
});
