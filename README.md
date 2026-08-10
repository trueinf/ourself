# yourse.l.f.

> One company. Many selves.

A cross-functional executive intelligence surface for **e.l.f. Beauty**, where each
persona sees the same business reality optimised for their own objective function —
and can see how the other offices read the same fact. Built to the locked design in
`BUILD_SPEC_ourself.md` (v0.2), with the HTML prototype as the content source of record.

This is a **demo build**: the top two architecture layers (experience + persona/objective
function) are real, the scenario engine is genuinely deterministic arithmetic, and
everything else behind the glass is labelled demo data. Nothing in this build acts —
effect buttons (`Approve recommended`, `Request specialist analysis`) are inert by design.

## Stack

React 18 + TypeScript (strict) · Vite · Tailwind (tokens mapped from `tokens.css`) ·
Zustand · Recharts (sparklines only). No component library, no router — routing is three
fields of state (§11).

## Run

```bash
npm install
npm run dev          # http://localhost:5199
npm run build        # tsc -b (app) + vite build
npm run preview      # serve the production build on :4173
```

Deployed (Netlify, `trueinf` team): **https://ourself.netlify.app** — the site builds
from this repo, so pushing to `main` publishes it. No manual deploy step.

### Sign in

The demo opens on a sign-in gate — **`manoj` / `til`** (`src/data/auth.ts`). It is
presentation only, not security: the credentials are in the client bundle and nothing
behind the gate is protected. The session is held in `sessionStorage`, so a fresh tab
asks again; `Sign out` sits at the top right of the content column. The Playwright harnesses' `__setView`
hook and the Vitest `renderAt` helper both start signed in, so the gate never gates a test.

## Tests — the three harnesses (§18)

```bash
npm test             # Harness A — functional (Vitest + jsdom)
npm run test:layout  # Harness B — layout at 6 viewports (Playwright)
npm run test:contrast# Harness C — contrast, fails the build on any AA miss (Playwright)
npm run test:all     # all three
```

Playwright needs a browser once: `npx playwright install chromium`.

Current results:

| Harness | What it proves | Result |
|---|---|---|
| A — functional | Every persona × tab renders clean; every insight/focus detail; **189 lever combinations** across the 4 scenario engines; pin/nav interaction rules | **99 tests pass** |
| B — layout | 1440 / 1180 / 1040 / 834 / 390 / 360px × every screen — 0 horizontal scroll, 0 clipped text, 0 overflow, 0 off-screen | **240 checks pass** |
| C — contrast | WCAG AA on every text node across every persona × tab, plus detail pages and the answered Ask with its composed dashboard | **42 tests pass** |

## Structure

```
src/
  styles/tokens.css   §4 — SINGLE SOURCE OF TRUTH for colour (contrast-audited)
  styles/app.css      component CSS ported verbatim from the locked prototype
  types.ts            §8 data model
  data/               personas, decisions, sources, agents — EXTRACTED, not regenerated
  scenarios/          cfo · coo · cmo · ctaio — pure functions, §9 formulas verbatim
  components/         the §6 inventory (SourceChip, Pill, KpiCard, CrossOfficeStrip, …)
  surfaces/           Insights · Focus · Ask · Scenarios · PinBoard + detail/ full pages
  shell/              Rail · PersonaSwitcher · MobileTopBar
  store/app.ts        Zustand: personaIndex, tab, detail, askedQuestion, pins, scenarioInputs
```

## Notes for the next phase

- **`tokens.css` is the only place a colour is defined.** No hex literals in components,
  no Tailwind arbitrary colours. Do **not** "correct" `--pink-text` (#C42A61) back to the
  brand pink #E8417F — it reintroduces a WCAG failure on every badge, avatar, delta and
  stance label. Harness C will fail the build (§18.6). Same for `--faint`, `--muted`, `--rail-txt-2`, amber.
- **Savur's title is MEDIUM confidence** (§8.1) — flagged in `data/personas.ts`. Re-verify
  before any live demo.
- **Bundle size:** Recharts (per §3, "for the sparklines only") is ~400kB of the bundle.
  If a lighter footprint matters more than the mandated library, the sparkline is 7 CSS
  bars and `Sparkline.tsx` can be swapped without touching anything else.
- The four scenario models are pure functions with no React import — the arithmetic is
  testable without a DOM, and every figure is hand-checkable against `CalcPanel`.
- **Ask assembles its answer step by step** (`surfaces/Ask.tsx`): the orchestrator plans,
  dispatches three specialists in parallel, each reads its source systems, then a
  judgement node reconciles — a ~6s staged trace with a live timer, then the answer is
  revealed. The answer composes a dashboard (`components/AnswerDashboard.tsx`): an
  "At a glance" metric strip and a Recharts chart of realised tariff vs the 35% assumption,
  each carrying provenance. `prefers-reduced-motion` collapses the staging to an instant
  reveal (§12.3).
