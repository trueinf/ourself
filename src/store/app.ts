import { create } from 'zustand';
import type { Pin, LeverValue, LeverValues, ScenarioModelId } from '@/types';
import { PERSONAS } from '@/data/personas';
import { SCENARIO_MODELS, defaultLeverValues } from '@/scenarios';

export type TabId = 'insights' | 'focus' | 'ask' | 'scenarios' | 'pinboard';

export const TABS: Array<[TabId, string]> = [
  ['insights', 'Insights'],
  ['focus', 'Focus'],
  ['ask', 'Ask'],
  ['scenarios', 'Scenarios'],
  ['pinboard', 'PinBoard'],
];

export interface DetailRef {
  kind: 'insight' | 'focus';
  id: string;
}

export interface AppState {
  personaIndex: number;
  tab: TabId;
  detail: DetailRef | null;
  askedQuestion: string | null;
  pins: Record<string, Pin[]>;
  scenarioInputs: Record<string, LeverValues>;
  personaMenuOpen: boolean;
  /** monotonic counter bumped on every navigation, so the shell can scroll to top */
  navSeq: number;

  setPersona: (index: number) => void;
  setTab: (tab: TabId) => void;
  openDetail: (kind: DetailRef['kind'], id: string) => void;
  closeDetail: () => void;
  ask: (question: string) => void;
  clearAsk: () => void;
  pinQuestion: (question: string) => void;
  unpin: (index: number) => void;
  setLever: (modelId: ScenarioModelId, leverId: string, value: LeverValue) => void;
  resetScenario: (modelId: ScenarioModelId) => void;
  togglePersonaMenu: () => void;
  closePersonaMenu: () => void;
}

function initialPins(): Record<string, Pin[]> {
  const pins: Record<string, Pin[]> = {};
  for (const p of PERSONAS) pins[p.id] = p.pins.map((x) => ({ ...x }));
  return pins;
}

function initialScenarioInputs(): Record<string, LeverValues> {
  const inputs: Record<string, LeverValues> = {};
  for (const id of Object.keys(SCENARIO_MODELS) as ScenarioModelId[]) {
    inputs[id] = defaultLeverValues(SCENARIO_MODELS[id]);
  }
  return inputs;
}

export const currentPersona = (personaIndex: number) => PERSONAS[personaIndex] ?? PERSONAS[0]!;

export const useApp = create<AppState>((set, get) => ({
  personaIndex: 0,
  tab: 'insights',
  detail: null,
  askedQuestion: null,
  pins: initialPins(),
  scenarioInputs: initialScenarioInputs(),
  personaMenuOpen: false,
  navSeq: 0,

  // §11: switching persona clears detail and askedQuestion; pins and scenario
  // inputs persist per persona/model.
  setPersona: (index) =>
    set((s) => ({
      personaIndex: index,
      detail: null,
      askedQuestion: null,
      personaMenuOpen: false,
      navSeq: s.navSeq + 1,
    })),

  // §11: switching tab clears detail.
  setTab: (tab) => set((s) => ({ tab, detail: null, navSeq: s.navSeq + 1 })),

  openDetail: (kind, id) => set((s) => ({ detail: { kind, id }, navSeq: s.navSeq + 1 })),

  closeDetail: () => set((s) => ({ detail: null, askedQuestion: null, navSeq: s.navSeq + 1 })),

  ask: (question) => {
    const q = question.trim();
    if (!q) return;
    set((s) => ({ askedQuestion: q, navSeq: s.navSeq + 1 }));
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
        'Just pinned. ourse.l.f. will re-answer this as the underlying data moves and show what changed.',
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

  togglePersonaMenu: () => set((s) => ({ personaMenuOpen: !s.personaMenuOpen })),
  closePersonaMenu: () => set({ personaMenuOpen: false }),
}));
