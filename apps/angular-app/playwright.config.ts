import { defineConfig } from 'playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:4301',
    browserName: 'chromium',
    headless: true,
    viewport: { width: 1280, height: 900 },
  },
  webServer: {
    command: 'pnpm exec ng serve --host 127.0.0.1 --port 4301',
    url: 'http://127.0.0.1:4301/home',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
