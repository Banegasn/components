import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const workspaceDirectory = process.cwd();
const workspaceName = path.basename(workspaceDirectory);
const browserChannel = process.env.VITEST_BROWSER_CHANNEL;
const configDirectory = path.dirname(fileURLToPath(import.meta.url));

/**
 * Vitest's browser API is also the Vite server that delivers the tests. These
 * explicit package ports make the five Turbo test tasks collision-free.
 */
const browserPorts: Record<string, number> = {
  'm3-divider': 63_320,
  'm3-card': 63_325,
  'm3-icon-button': 63_321,
  'm3-list': 63_322,
  'm3-snackbar': 63_323,
  'm3-top-app-bar': 63_324,
  'm3-progress': 63_326,
  'm3-checkbox': 63_327,
  'm3-menu': 63_328,
  'm3-fab-menu': 63_329,
  'm3-split-button': 63_330,
  'm3-dialog': 63_331,
};

const port = browserPorts[workspaceName];

const browserInstances = browserChannel
  ? [{ browser: 'chromium' as const }]
  : [
      { browser: 'chromium' as const },
      { browser: 'firefox' as const },
      { browser: 'webkit' as const },
    ];

if (port === undefined) {
  throw new Error(`No Vitest browser port is assigned to ${workspaceName}.`);
}

export default defineConfig({
  root: workspaceDirectory,
  test: {
    include: ['src/**/*.test.ts'],
    globals: false,
    passWithNoTests: false,
    setupFiles: [path.join(configDirectory, 'test/vitest-browser-setup.ts')],
    browser: {
      enabled: true,
      headless: true,
      api: {
        port,
        strictPort: true,
      },
      provider: playwright({
        launchOptions: browserChannel ? { channel: browserChannel } : undefined,
      }),
      // This is the supported-browser matrix for browser tests. A channel is
      // intentionally Chromium-only because Playwright channels are Chromium
      // distributions rather than cross-browser engines.
      instances: browserInstances,
    },
  },
  resolve: {
    alias: [
      {
        find: /^@open-wc\/testing$/,
        replacement: path.join(configDirectory, 'test/open-wc-vitest.ts'),
      },
    ],
  },
});
