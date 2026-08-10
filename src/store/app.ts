import { create } from 'zustand';
import type { Pin, DiscussionItem, LeverValue, LeverValues, ScenarioModelId } from '@/types';
import { PERSONAS } from '@/data/personas';
import { checkCredentials } from '@/data/auth';
import { SEEDED_DISCUSSIONS } from '@/data/discussions';
import { SCENARIO_MODELS, defaultLeverValues } from '@/scenarios';

export type TabId = 'insights' | 'focus' | 'discussions' | 'ask' | 'scenarios' | 'pinboard';

export const TABS: Array<[TabId, string]> = [
  ['insights', 'Insights'],
  ['focus', 'Actions'],
  ['discussions', 'Discussions'],
  ['ask', 'Ask'],
  ['scenarios', 'Scenarios'],
  ['pinboard', 'PinBoard'],
];

export interface DetailRef {
  kind: 'insight' | 'focus';
  id: string;
}

/** What the Scenarios surface is modelling for, when arrived at via a
 *  "Model this in Scenarios" link — grounds the levers in a real question. */
export interface ScenarioContext {
  kind: 'insight' | 'focus';
  id: string;
  headline: string;
}

export interface AppState {
  /** demo sign-in gate (§ not in spec — demo shell only). See data/auth.ts. */
  authed: boolean;
  authError: string | null;
  personaIndex: number;
  tab: TabId;
  detail: DetailRef | null;
  askedQuestion: string | null;
  pins: Record<string, Pin[]>;
  discussions: Record<string, DiscussionItem[]>;
  scenarioInputs: Record<string, LeverValues>;
  /** per-persona objective override + its scoring keywords (goal editing) */
  goals: Record<string, { objective: string; keywords: string[] }>;
  goalEditorOpen: boolean;
  scenarioContext: ScenarioContext | null;
  personaMenuOpen: boolean;
  /** monotonic counter bumped on every navigation, so the shell can scroll to top */
  navSeq: number;

  signIn: (username: string, password: string) => boolean;
  signOut: () => void;
  setPersona: (index: number) => void;
  setTab: (tab: TabId) => void;
  openDetail: (kind: DetailRef['kind'], id: string) => void;
  closeDetail: () => void;
  ask: (question: string) => void;
  openAsk: (question: string) => void;
  clearAsk: () => void;
  pinQuestion: (question: string) => void;
  unpin: (index: number) => void;
  queueDiscussion: (item: DiscussionItem) => void;
  removeDiscussion: (id: string) => void;
  setLever: (modelId: ScenarioModelId, leverId: string, value: LeverValue) => void;
  resetScenario: (modelId: ScenarioModelId) => void;
  modelInScenarios: (context: ScenarioContext) => void;
  togglePersonaMenu: () => void;
  closePersonaMenu: () => void;
  toggleGoalEditor: () => void;
  closeGoalEditor: () => void;
  applyGoal: (objective: string, keywords: string[]) => void;
  resetGoal: () => void;
}

function initialPins(): Record<string, Pin[]> {
  const pins: Record<string, Pin[]> = {};
  for (const p of PERSONAS) pins[p.id] = p.pins.map((x) => ({ ...x }));
  return pins;
}

function initialDiscussions(): Record<string, DiscussionItem[]> {
  const discussions: Record<string, DiscussionItem[]> = {};
  for (const p of PERSONAS) {
    // Normalise seeded ids to the same source-derived scheme the builders use,
    // so "Add to discussion" on a source already on the agenda reads as queued
    // rather than duplicating it.
    discussions[p.id] = (SEEDED_DISCUSSIONS[p.id] ?? []).map((x) => ({
      ...x,
      id: x.source ? `disc-${x.source.kind}-${x.source.id}` : x.id,
    }));
  }
  return discussions;
}

function initialScenarioInputs(): Record<string, LeverValues> {
  const inputs: Record<string, LeverValues> = {};
  for (const id of Object.keys(SCENARIO_MODELS) as ScenarioModelId[]) {
    inputs[id] = defaultLeverValues(SCENARIO_MODELS[id]);
  }
  return inputs;
}

export const currentPersona = (personaIndex: number) => PERSONAS[personaIndex] ?? PERSONAS[0]!;

/* Session-scoped so the gate reappears in a fresh tab — sessionStorage, not
   localStorage. Wrapped because it throws in privacy modes and under some
   test runners. */
const AUTH_KEY = 'yourself.authed';

function readAuth(): boolean {
  try {
    return sessionStorage.getItem(AUTH_KEY) === '1';
  } catch {
    return false;
  }
}

function writeAuth(value: boolean): void {
  try {
    if (value) sessionStorage.setItem(AUTH_KEY, '1');
    else sessionStorage.removeItem(AUTH_KEY);
  } catch {
    /* non-fatal — the gate simply re-asks on reload */
  }
}

export const useApp = create<AppState>((set, get) => ({
  authed: readAuth(),
  authError: null,
  personaIndex: 0,
  tab: 'insights',
  detail: null,
  askedQuestion: null,
  pins: initialPins(),
  discussions: initialDiscussions(),
  scenarioInputs: initialScenarioInputs(),
  goals: {},
  goalEditorOpen: false,
  scenarioContext: null,
  personaMenuOpen: false,
  navSeq: 0,

  signIn: (username, password) => {
    if (!checkCredentials(username, password)) {
      set({ authError: 'That username and password do not match.' });
      return false;
    }
    writeAuth(true);
    set({ authed: true, authError: null });
    return true;
  },

  // Signing out returns to the gate and drops the view back to the default
  // surface — session state (pins, levers, goals) is left as it was.
  signOut: () => {
    writeAuth(false);
    set((s) => ({
      authed: false,
      authError: null,
      tab: 'insights',
      detail: null,
      askedQuestion: null,
      personaMenuOpen: false,
      goalEditorOpen: false,
      navSeq: s.navSeq + 1,
    }));
  },

  // §11: switching persona clears detail and askedQuestion; pins, scenario
  // inputs and goal overrides persist per persona.
  setPersona: (index) =>
    set((s) => ({
      personaIndex: index,
      detail: null,
      askedQuestion: null,
      personaMenuOpen: false,
      goalEditorOpen: false,
      scenarioContext: null,
      navSeq: s.navSeq + 1,
    })),

  // §11: switching tab clears detail. Manual tab nav also drops any carried
  // scenario context (it only survives a "Model this in Scenarios" jump).
  setTab: (tab) =>
    set((s) => ({ tab, detail: null, goalEditorOpen: false, scenarioContext: null, navSeq: s.navSeq + 1 })),

  openDetail: (kind, id) => set((s) => ({ detail: { kind, id }, navSeq: s.navSeq + 1 })),

  closeDetail: () => set((s) => ({ detail: null, askedQuestion: null, navSeq: s.navSeq + 1 })),

  ask: (question) => {
    const q = question.trim();
    if (!q) return;
    set((s) => ({ askedQuestion: q, navSeq: s.navSeq + 1 }));
  },

  // Open the Ask surface already answering a question — used from PinBoard so a
  // tracked question can be re-answered in one click ("re-answered as the data
  // moves").
  openAsk: (question) => {
    const q = question.trim();
    if (!q) return;
    set((s) => ({
      tab: 'ask',
      askedQuestion: q,
      detail: null,
      goalEditorOpen: false,
      scenarioContext: null,
      navSeq: s.navSeq + 1,
    }));
  },

  clearAsk: () => set((s) => ({ askedQuestion: null, navSeq: s.navSeq + 1 })),

  // Pinning is idempotent — pinning the same question twice does not duplicate it (§11).
  pinQuestion: (question) => {
    const q = question.trim();
    if (!q) return;
    const { personaIndex, pins } = get();
    const persona = currentPersona(personaIndex);
    const list = pins[persona.id] ?? [];
    if (list.some((x) => x.question === q)) return;
    const newPin: Pin = {
      question: q,
      whatMoved:
        'Just pinned. yourse.l.f. will re-answer this as the underlying data moves and show what changed.',
      pinnedAt: 'Pinned just now',
      trend: 'flat',
      trendLabel: 'New',
    };
    set({ pins: { ...pins, [persona.id]: [newPin, ...list] } });
  },

  unpin: (index) => {
    const { personaIndex, pins } = get();
    const persona = currentPersona(personaIndex);
    const list = pins[persona.id] ?? [];
    const next = list.filter((_, i) => i !== index);
    set({ pins: { ...pins, [persona.id]: next } });
  },

  // Queueing a discussion is idempotent by id — adding the same source twice
  // does not duplicate it (mirrors pinning, §11).
  queueDiscussion: (item) => {
    const { personaIndex, discussions } = get();
    const persona = currentPersona(personaIndex);
    const list = discussions[persona.id] ?? [];
    if (list.some((d) => d.id === item.id)) return;
    set({ discussions: { ...discussions, [persona.id]: [item, ...list] } });
  },

  removeDiscussion: (id) => {
    const { personaIndex, discussions } = get();
    const persona = currentPersona(personaIndex);
    const list = discussions[persona.id] ?? [];
    set({ discussions: { ...discussions, [persona.id]: list.filter((d) => d.id !== id) } });
  },

  setLever: (modelId, leverId, value) =>
    set((s) => ({
      scenarioInputs: {
        ...s.scenarioInputs,
        [modelId]: { ...(s.scenarioInputs[modelId] ?? {}), [leverId]: value },
      },
    })),

  resetScenario: (modelId) =>
    set((s) => ({
      scenarioInputs: {
        ...s.scenarioInputs,
        [modelId]: defaultLeverValues(SCENARIO_MODELS[modelId]),
      },
    })),

  // Jump to Scenarios carrying the question being modelled, so the levers land
  // grounded in a real insight or decision rather than at a bare default.
  modelInScenarios: (context) =>
    set((s) => ({ tab: 'scenarios', detail: null, scenarioContext: context, navSeq: s.navSeq + 1 })),

  togglePersonaMenu: () => set((s) => ({ personaMenuOpen: !s.personaMenuOpen })),
  closePersonaMenu: () => set({ personaMenuOpen: false }),

  toggleGoalEditor: () => set((s) => ({ goalEditorOpen: !s.goalEditorOpen })),
  closeGoalEditor: () => set({ goalEditorOpen: false }),

  // Applying a goal re-ranks the same governed facts — it never authors a
  // number (§2.1). The override persists per persona.
  applyGoal: (objective, keywords) => {
    const trimmed = objective.trim();
    if (!trimmed) return;
    const { personaIndex, goals } = get();
    const persona = currentPersona(personaIndex);
    set((s) => ({
      goals: { ...goals, [persona.id]: { objective: trimmed, keywords } },
      goalEditorOpen: false,
      navSeq: s.navSeq + 1,
    }));
  },

  resetGoal: () => {
    const { personaIndex, goals } = get();
    const persona = currentPersona(personaIndex);
    const next = { ...goals };
    delete next[persona.id];
    set((s) => ({ goals: next, goalEditorOpen: false, navSeq: s.navSeq + 1 }));
  },
}));
