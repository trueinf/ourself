import { defineConfig } from '@playwright/test';

// Harnesses B (layout) and C (contrast). Both boot the Vite preview server
// and drive a real browser, which is the only way to resolve computed styles
// and measure geometry the way §18.4 / §18.5 require.
export default defineConfig({
  testDir: './test',
  testMatch: /(layout|contrast)\.spec\.ts/,
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
