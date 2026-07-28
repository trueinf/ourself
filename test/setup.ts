/**
 * jsdom polyfills for harness A. Recharts' ResponsiveContainer installs a
 * ResizeObserver on mount; jsdom has none. A no-op observer is enough — the
 * container then reports a zero size and renders no chart, which is exactly
 * the behaviour the Sparkline relies on (§ Sparkline.tsx). The KPI value and
 * delta are plain text, so the sparkline being absent under jsdom is fine.
 */
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!('ResizeObserver' in globalThis)) {
  (globalThis as unknown as { ResizeObserver: typeof ResizeObserverStub }).ResizeObserver = ResizeObserverStub;
}

// jsdom has no scrollTo; the shell calls it on every navigation (§11).
if (typeof window !== 'undefined') {
  window.scrollTo = () => {};
}
