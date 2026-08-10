import { describe, it, expect, afterEach } from 'vitest';
import { act, cleanup, render } from '@testing-library/react';
import { createElement } from 'react';
import App from '@/App';
import { useApp, TABS, type TabId, type DetailRef } from '@/store/app';
import { PERSONAS } from '@/data/personas';
import { SCENARIO_MODELS } from '@/scenarios';
import { rankByGoal, tokenizeGoal, scoreText, kpiText, insightText } from '@/lib/goals';
import { resolveQuestion, isScenarioQuestion } from '@/data/askAnswers';
import { SCENARIO_BACKS } from '@/data/scenarioBacks';
import { SEEDED_DISCUSSIONS, discussionFromFocus, discussionFromInsight } from '@/data/discussions';
import { checkCredentials } from '@/data/auth';
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
    authed: true, // past the demo sign-in gate — covered separately below
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
  it('every model names its baseline and carries a grounding read line', () => {
    for (const id of Object.keys(SCENARIO_MODELS) as ScenarioModelId[]) {
      const m = SCENARIO_MODELS[id];
      expect(m.read.length).toBeGreaterThan(20);
      expect(m.baselineLabel.length).toBeGreaterThan(0);
    }
  });

  it('every "what this model backs" id resolves to a real decision/insight in that persona', () => {
    for (const p of PERSONAS) {
      const backs = SCENARIO_BACKS[p.id];
      expect(backs, `${p.id} has no scenario backs`).toBeTruthy();
      for (const fid of backs!.focus) expect(p.focus.some((f) => f.id === fid), `${p.id} focus ${fid}`).toBe(true);
      for (const iid of backs!.insights) expect(p.insights.some((i) => i.id === iid), `${p.id} insight ${iid}`).toBe(true);
    }
  });

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

  it('openAsk jumps to the Ask surface already answering the question (PinBoard → Ask)', () => {
    useApp.setState({ personaIndex: 0, tab: 'pinboard', askedQuestion: null });
    useApp.getState().openAsk('Will the 35% tariff assumption hold through Q2 earnings?');
    expect(useApp.getState().tab).toBe('ask');
    expect(useApp.getState().askedQuestion).toBe('Will the 35% tariff assumption hold through Q2 earnings?');
  });

  it('every seeded pin resolves to a governed finding, so its movement carries a source', () => {
    for (const p of PERSONAS) {
      for (const pin of p.pins) {
        const insight = resolveQuestion(pin.question);
        expect(insight, `pin "${pin.question}" resolved to null`).toBeTruthy();
        expect(insight!.sources.length).toBeGreaterThan(0);
      }
    }
  });

  it('switching tab clears detail', () => {
    useApp.setState({ personaIndex: 0, tab: 'insights', detail: { kind: 'insight', id: 'f1' } });
    useApp.getState().setTab('focus');
    expect(useApp.getState().detail).toBeNull();
    expect(useApp.getState().tab).toBe('focus');
  });

  it('modelInScenarios carries context to Scenarios; manual tab nav clears it', () => {
    useApp.setState({ personaIndex: 0, scenarioContext: null });
    useApp.getState().modelInScenarios({ kind: 'insight', id: 'f1', headline: 'the marketing envelope' });
    expect(useApp.getState().tab).toBe('scenarios');
    expect(useApp.getState().scenarioContext?.id).toBe('f1');
    useApp.getState().setTab('insights');
    expect(useApp.getState().scenarioContext).toBeNull();
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

describe('Ask resolves each question to a governed finding (§7.3)', () => {
  it('every suggested question resolves to an insight, and they are not all the same', () => {
    const resolved = new Set<string>();
    for (const p of PERSONAS) {
      for (const sq of p.suggestedQuestions) {
        const insight = resolveQuestion(sq.question);
        expect(insight, `"${sq.question}" resolved to null`).toBeTruthy();
        resolved.add(insight!.id);
      }
    }
    // the 32 suggested questions hit a spread of distinct findings, not one canned answer
    expect(resolved.size).toBeGreaterThan(10);
  });

  it('the tariff question resolves to the tariff finding, the pilots question to the pilots finding', () => {
    expect(resolveQuestion('Why is the realised tariff rate above our 35% assumption?')?.id).toBe('f2');
    expect(resolveQuestion('Which of the 85 AI pilots are in production, and what did they return?')?.id).toBe('t2');
  });

  it('a free-typed question keyword-matches a relevant finding', () => {
    expect(resolveQuestion('what is happening with our deductions at the top accounts?')?.id).toBe('l2');
  });

  it('gibberish resolves to no finding (graceful no-match)', () => {
    expect(resolveQuestion('zzzz qqqq wxyz')).toBeNull();
  });

  it('what-if phrasing is detected for routing to Scenarios', () => {
    expect(isScenarioQuestion('If we extend the price reversal to lip, what happens?')).toBe(true);
    expect(isScenarioQuestion('What would it cost to pull qualification forward?')).toBe(true);
    expect(isScenarioQuestion('Why is the realised tariff rate above our 35% assumption?')).toBe(false);
  });
});

describe('Discussions — the per-persona agenda', () => {
  it('every persona is seeded with discussion items, each source resolving to a real decision/finding', () => {
    for (const p of PERSONAS) {
      const items = SEEDED_DISCUSSIONS[p.id] ?? [];
      expect(items.length, `${p.id} has no seeded discussions`).toBeGreaterThan(0);
      for (const d of items) {
        expect(d.title.length).toBeGreaterThan(5);
        if (d.source) {
          const found =
            d.source.kind === 'focus'
              ? p.focus.some((f) => f.id === d.source!.id)
              : p.insights.some((i) => i.id === d.source!.id);
          expect(found, `${p.id} discussion ${d.id} → ${d.source.kind}:${d.source.id}`).toBe(true);
        }
      }
    }
  });

  it('builders derive a valid item from a focus decision and an insight', () => {
    const fields = PERSONAS.find((p) => p.id === 'fields')!;
    const fromFocus = discussionFromFocus(fields.focus[0]!);
    expect(fromFocus.id).toBe(`disc-focus-${fields.focus[0]!.id}`);
    expect(fromFocus.participants).toEqual(fields.focus[0]!.waitingOn);

    const fromInsight = discussionFromInsight(fields.insights[0]!);
    expect(fromInsight.id).toBe(`disc-insight-${fields.insights[0]!.id}`);
    // f1's cross-office positions include Savur and Laar → derived participants
    expect(fromInsight.participants.length).toBeGreaterThan(0);
  });

  it('queueDiscussion is idempotent per id; removeDiscussion removes it', () => {
    useApp.setState({ personaIndex: 0 });
    const id = PERSONAS[0]!.id;
    const before = useApp.getState().discussions[id]!.length;
    const item = discussionFromInsight(PERSONAS[0]!.insights[0]!);
    useApp.getState().queueDiscussion(item);
    useApp.getState().queueDiscussion(item);
    expect(useApp.getState().discussions[id]!.length).toBe(before + 1);
    useApp.getState().removeDiscussion(item.id);
    expect(useApp.getState().discussions[id]!.length).toBe(before);
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

  it('every insight has a specific finding for each of its agents (no boilerplate)', () => {
    const seen = new Set<string>();
    for (const p of PERSONAS) {
      for (const i of p.insights) {
        const findings = i.findings ?? [];
        // one finding per contributing agent
        expect(findings.map((f) => f.agent).sort()).toEqual([...i.agents].sort());
        for (const f of findings) {
          expect(f.text.length).toBeGreaterThan(20);
          seen.add(f.text);
        }
      }
    }
    // findings are distinct — not the same templated sentence repeated
    const total = PERSONAS.flatMap((p) => p.insights).flatMap((i) => i.findings ?? []).length;
    expect(seen.size).toBe(total);
  });

  it('every feedsDecision points to a real Focus item in the same persona', () => {
    for (const p of PERSONAS) {
      for (const i of p.insights) {
        if (i.feedsDecision) {
          expect(p.focus.some((f) => f.id === i.feedsDecision), `${i.id} → ${i.feedsDecision}`).toBe(true);
        }
      }
    }
  });

  it('every proof chart has 7 points inside its domain', () => {
    for (const p of PERSONAS) {
      for (const i of p.insights) {
        if (i.proof) {
          expect(i.proof.series.length).toBe(7);
          const [lo, hi] = i.proof.domain;
          for (const v of i.proof.series) expect(v >= lo && v <= hi).toBe(true);
        }
      }
    }
  });

  it('every persona has a triage read and every focus item an at-stake phrase', () => {
    for (const p of PERSONAS) {
      expect(p.focusRead.length).toBeGreaterThan(20);
      for (const f of p.focus) {
        expect(f.stakes && f.stakes.length).toBeGreaterThan(8);
      }
    }
  });

  it('at least one cross-office decision exists, and each maps back to its raising insight where linked', () => {
    // Fields' $22.4M refund crosses three waiting offices.
    const fields = PERSONAS.find((p) => p.id === 'fields')!;
    expect(fields.focus.some((f) => f.waitingOn.length >= 2)).toBe(true);
    // Every insight.feedsDecision resolves to a focus item in the same persona (reverse loop).
    for (const p of PERSONAS) {
      for (const i of p.insights) {
        if (i.feedsDecision) {
          const target = p.focus.find((f) => f.id === i.feedsDecision);
          expect(target, `${i.id} → ${i.feedsDecision}`).toBeTruthy();
        }
      }
    }
  });
});

/* =============================================================
   Demo sign-in gate (shell/Login.tsx). Presentation only — it proves the
   shell does not mount unsigned-in, and that the credentials gate works.
   ============================================================= */
describe('demo sign-in gate', () => {
  it('renders the login card and no shell when signed out', () => {
    useApp.setState({ authed: false, authError: null });
    render(createElement(App));
    expect(document.querySelector('.login-card')).toBeTruthy();
    expect(document.getElementById('main')).toBeNull();
  });

  it('rejects wrong credentials and keeps the shell closed', () => {
    useApp.setState({ authed: false, authError: null });
    render(createElement(App));
    expect(useApp.getState().signIn('manoj', 'wrong')).toBe(false);
    expect(useApp.getState().authed).toBe(false);
    expect(useApp.getState().authError).toBeTruthy();
    expect(document.getElementById('main')).toBeNull();
  });

  it('accepts the demo credentials and mounts the shell', () => {
    useApp.setState({ authed: false, authError: null });
    render(createElement(App));
    let ok = false;
    act(() => {
      ok = useApp.getState().signIn('superhero', 'yourself');
    });
    expect(ok).toBe(true);
    expect(useApp.getState().authed).toBe(true);
    expect(useApp.getState().authError).toBeNull();
    const main = document.getElementById('main');
    expect(main).toBeTruthy();
    expect(main!.innerHTML).not.toMatch(BAD);
  });

  it('username is case-insensitive and trimmed; password is exact', () => {
    expect(checkCredentials('  SUPERHERO ', 'yourself')).toBe(true);
    expect(checkCredentials('superhero', 'YOURSELF')).toBe(false);
    expect(checkCredentials('', '')).toBe(false);
  });

  it('signing out closes the shell again', () => {
    useApp.setState({ authed: true });
    render(createElement(App));
    expect(document.getElementById('main')).toBeTruthy();
    act(() => useApp.getState().signOut());
    expect(useApp.getState().authed).toBe(false);
    expect(document.getElementById('main')).toBeNull();
  });
});
