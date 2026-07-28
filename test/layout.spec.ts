import { test, expect, type Page } from '@playwright/test';

/* =============================================================
   §18.4 Harness B — layout. Six viewports × every screen in harness A's
   matrix (every persona × every tab). Asserts: no horizontal scroll, no
   clipped text, nothing overflowing its parent, nothing off-screen. This
   is the harness that caught the mobile top-bar overflow and the .foot
   collision in the prototype.
   ============================================================= */

const VIEWPORTS = [1440, 1180, 1040, 834, 390, 360];
const TABS = ['insights', 'focus', 'discussions', 'ask', 'scenarios', 'pinboard'];
const PERSONA_COUNT = 8;

async function setView(page: Page, personaIndex: number, tab: string) {
  await page.evaluate(
    ([p, t]) => (window as unknown as { __setView: (p: number, t: string) => void }).__setView(p as number, t as string),
    [personaIndex, tab] as const,
  );
  await page.waitForTimeout(30);
}

async function measure(page: Page) {
  return page.evaluate(() => {
    const describe = (el: Element) =>
      `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ').filter(Boolean).join('.')}`;
    const out = {
      hscroll: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
      clipped: [] as string[],
      overflowsParent: [] as string[],
      offscreen: [] as string[],
    };
    document.querySelectorAll('#main *, .rail *').forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      const rect = el.getBoundingClientRect();
      if (!rect.width && !rect.height) return;
      if ((cs.overflow === 'hidden' || cs.overflowY === 'hidden') && el.scrollHeight - el.clientHeight > 2)
        out.clipped.push(describe(el));
      const par = el.parentElement;
      if (par && getComputedStyle(par).overflow === 'visible' && rect.width - par.getBoundingClientRect().width > 2)
        out.overflowsParent.push(describe(el));
      if (rect.left < -2 || rect.right > window.innerWidth + 2) out.offscreen.push(describe(el));
    });
    return out;
  });
}

// Insight-detail ids that exercise the heaviest detail layout (proof chart,
// feeds-a-decision banner, dressed positions, richer provenance sidebar).
const DETAIL_INSIGHTS: Array<[persona: number, id: string]> = [
  [0, 'f1'], // Fields — full: proof + feeds + 3 positions
  [3, 't1'], // Chopra — feeds + 2 positions, no proof
];

for (const width of VIEWPORTS) {
  test.describe(`viewport ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (let pi = 0; pi < PERSONA_COUNT; pi++) {
      for (const tab of TABS) {
        test(`persona ${pi} · ${tab}`, async ({ page }) => {
          await page.goto('/');
          await page.waitForFunction(() => '__setView' in window);
          await setView(page, pi, tab);
          const r = await measure(page);
          expect(r.hscroll, `horizontal scroll at ${width}px`).toBeLessThanOrEqual(1);
          expect(r.clipped, 'clipped text').toEqual([]);
          expect(r.overflowsParent, 'elements overflowing parent').toEqual([]);
          expect(r.offscreen, 'off-screen elements').toEqual([]);
        });
      }
    }

    for (const [pi, id] of DETAIL_INSIGHTS) {
      test(`insight detail ${id}`, async ({ page }) => {
        await page.goto('/');
        await page.waitForFunction(() => '__setView' in window);
        await page.evaluate(
          ([p, i]) =>
            (window as unknown as { __setView: (p: number, t: string, d: unknown) => void }).__setView(
              p as number,
              'insights',
              { kind: 'insight', id: i },
            ),
          [pi, id] as const,
        );
        await page.waitForTimeout(40);
        const r = await measure(page);
        expect(r.hscroll, `horizontal scroll at ${width}px`).toBeLessThanOrEqual(1);
        expect(r.clipped, 'clipped text').toEqual([]);
        expect(r.overflowsParent, 'elements overflowing parent').toEqual([]);
        expect(r.offscreen, 'off-screen elements').toEqual([]);
      });
    }
  });
}
