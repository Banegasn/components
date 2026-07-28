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
  'm3-icon-button': 63_321,
  'm3-list': 63_322,
  'm3-snackbar': 63_323,
  'm3-top-app-bar': 63_324,
};

const port = browserPorts[workspaceName];

if (port === undefined) {
  throw new Error(`No Vitest browser port is assigned to ${workspaceName}.`);
}

export default defineConfig({
  root: workspaceDirectory,
  test: {
    include: ['src/**/*.test.ts'],
    globals: true,
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
      instances: [
        {
          browser: 'chromium',
        },
      ],
    },
  },
  resolve: {
    alias: {
      '@open-wc/testing': path.join(configDirectory, 'test/open-wc-vitest.ts'),
    },
  },
});
