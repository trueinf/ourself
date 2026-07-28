import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Harness A (functional) runs here. Harnesses B (layout) and C (contrast)
// run under Playwright — see playwright.config.ts.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['test/functional.spec.ts'],
    setupFiles: ['test/setup.ts'],
    css: true,
  },
});
