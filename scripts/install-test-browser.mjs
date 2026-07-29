import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium, firefox, webkit } from 'playwright';

if (process.env.VITEST_BROWSER_CHANNEL) {
  console.log(
    `[test] Using installed Playwright channel: ${process.env.VITEST_BROWSER_CHANNEL}`,
  );
  process.exit(0);
}

const browserEngines = [
  ['Chromium', chromium],
  ['Firefox', firefox],
  ['WebKit', webkit],
];

const missingBrowsers = browserEngines.filter(([, browser]) => !existsSync(browser.executablePath()));

if (missingBrowsers.length === 0) {
  console.log(`[test] Using installed Playwright browsers: ${browserEngines.map(([name]) => name).join(', ')}`);
  process.exit(0);
}

const result = spawnSync(
  'pnpm',
  ['exec', 'playwright', 'install', ...missingBrowsers.map(([name]) => name.toLowerCase())],
  {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    timeout: 120_000,
    killSignal: 'SIGTERM',
  },
);

if (result.error?.code === 'ETIMEDOUT') {
  console.error(
    '[test] Timed out installing Playwright browsers after two minutes. Retry once the browser cache is available.',
  );
}

process.exit(result.status ?? 1);
