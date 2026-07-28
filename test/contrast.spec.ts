import { test, expect, type Page } from '@playwright/test';

/* =============================================================
   §18.5 Harness C — contrast, and it fails the build. Walk every element
   carrying a text node, resolve its effective background by climbing
   ancestors until a non-transparent fill, compute the WCAG ratio, and assert
   AA (4.5:1 normal, 3:1 for ≥24px or ≥18.66px bold). Run across every persona
   × tab so conditional colours (deltas, stances, severities, trends) are all
   sampled. This found 28 violations in the prototype — which is why §4 has
   three pink tokens, and why they must not be "corrected" (§18.6).
   ============================================================= */

const TABS = ['insights', 'focus', 'ask', 'scenarios', 'pinboard'];
const PERSONA_COUNT = 8;

interface Violation {
  selector: string;
  text: string;
  fg: string;
  bg: string;
  size: number;
  weight: number;
  ratio: number;
  need: number;
}

async function contrastViolations(page: Page): Promise<Violation[]> {
  return page.evaluate(() => {
    const parse = (c: string): [number, number, number, number] => {
      const m = c.match(/rgba?\(([^)]+)\)/);
      const group = m ? m[1] : undefined;
      if (!group) return [255, 255, 255, 1];
      const parts = group.split(',').map((x) => parseFloat(x.trim()));
      return [parts[0] ?? 255, parts[1] ?? 255, parts[2] ?? 255, parts[3] ?? 1];
    };
    const blend = (
      fg: [number, number, number, number],
      bg: [number, number, number, number],
    ): [number, number, number] => {
      const a = fg[3];
      return [fg[0] * a + bg[0] * (1 - a), fg[1] * a + bg[1] * (1 - a), fg[2] * a + bg[2] * (1 - a)];
    };
    const lum = ([r, g, b]: [number, number, number]) => {
      const f = (v: number) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const ratio = (a: [number, number, number], b: [number, number, number]) => {
      const la = lum(a);
      const lb = lum(b);
      const hi = Math.max(la, lb);
      const lo = Math.min(la, lb);
      return (hi + 0.05) / (lo + 0.05);
    };
    // large text = >=24px, or >=18.66px at weight >=700
    const need = (size: number, weight: number) => (size >= 24 || (size >= 18.66 && weight >= 700) ? 3.0 : 4.5);

    const resolveBg = (el: Element): [number, number, number, number] => {
      let node: Element | null = el;
      while (node) {
        const bg = parse(getComputedStyle(node).backgroundColor);
        if (bg[3] > 0) return bg;
        node = node.parentElement;
      }
      return [255, 255, 255, 1];
    };

    const hasDirectText = (el: Element) =>
      Array.from(el.childNodes).some((n) => n.nodeType === Node.TEXT_NODE && (n.textContent || '').trim().length > 0);

    const violations: Violation[] = [];
    document.querySelectorAll('body *').forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return;
      if (!hasDirectText(el)) return;
      const rect = el.getBoundingClientRect();
      if (!rect.width && !rect.height) return;

      const size = parseFloat(cs.fontSize);
      const weight = parseInt(cs.fontWeight, 10) || 400;
      const bg = resolveBg(el);
      const fgRaw = parse(cs.color);
      const fg = blend(fgRaw, bg);
      const bgRgb: [number, number, number] = [bg[0], bg[1], bg[2]];
      const r = ratio(fg, bgRgb);
      const req = need(size, weight);
      if (r < req - 0.01) {
        violations.push({
          selector: `${el.tagName.toLowerCase()}.${(el.className || '').toString().trim().split(/\s+/).join('.')}`,
          text: (el.textContent || '').trim().slice(0, 40),
          fg: cs.color,
          bg: `rgb(${Math.round(bg[0])}, ${Math.round(bg[1])}, ${Math.round(bg[2])})`,
          size,
          weight,
          ratio: Math.round(r * 100) / 100,
          need: req,
        });
      }
    });
    return violations;
  });
}

for (let pi = 0; pi < PERSONA_COUNT; pi++) {
  for (const tab of TABS) {
    test(`contrast AA · persona ${pi} · ${tab}`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto('/');
      await page.waitForFunction(() => '__setView' in window);
      await page.evaluate(
        ([p, t]) =>
          (window as unknown as { __setView: (p: number, t: string) => void }).__setView(p as number, t as string),
        [pi, tab] as const,
      );
      await page.waitForTimeout(40);
      const violations = await contrastViolations(page);
      expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
    });
  }
}

// Also sample the two detail page types and the answered Ask state, where the
// stance pills, "Recommended" pill and dark "Pinned" pill introduce colours
// not present on the list screens.
test('contrast AA · detail pages and answered Ask', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  await page.waitForFunction(() => '__setView' in window);

  // Fields insight detail (has a full cross-office dissent set).
  await page.evaluate(() =>
    (window as unknown as { __setView: (p: number, t: string, d: unknown) => void }).__setView(0, 'insights', {
      kind: 'insight',
      id: 'f1',
    }),
  );
  await page.waitForTimeout(40);
  expect(await contrastViolations(page)).toEqual([]);

  // Fields focus detail (recommended option, due pill).
  await page.evaluate(() =>
    (window as unknown as { __setView: (p: number, t: string, d: unknown) => void }).__setView(0, 'focus', {
      kind: 'focus',
      id: 'q1',
    }),
  );
  await page.waitForTimeout(40);
  expect(await contrastViolations(page)).toEqual([]);
});

// The answered Ask state introduces the composed dashboard (metric tiles +
// chart) and the "Pin to PinBoard" pill. Reduced motion makes the staged
// reasoning resolve instantly, so the assertion is deterministic.
test('contrast AA · answered Ask with composed dashboard', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  await page.waitForFunction(() => '__setView' in window);
  await page.evaluate(() =>
    (window as unknown as { __setView: (p: number, t: string) => void }).__setView(0, 'ask'),
  );
  await page.waitForTimeout(40);
  await page.locator('#main .sugg .sg').first().click();
  await page.waitForSelector('#main .ansdash');
  await page.waitForTimeout(60);
  const violations = await contrastViolations(page);
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
