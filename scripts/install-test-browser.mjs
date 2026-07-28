import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

if (process.env.VITEST_BROWSER_CHANNEL) {
  console.log(
    `[test] Using installed Playwright channel: ${process.env.VITEST_BROWSER_CHANNEL}`,
  );
  process.exit(0);
}

const executablePath = chromium.executablePath();

if (existsSync(executablePath)) {
  console.log(`[test] Using installed Playwright Chromium: ${executablePath}`);
  process.exit(0);
}

const result = spawnSync(
  'pnpm',
  ['exec', 'playwright', 'install', 'chromium'],
  {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    timeout: 120_000,
    killSignal: 'SIGTERM',
  },
);

if (result.error?.code === 'ETIMEDOUT') {
  console.error(
    '[test] Timed out installing Chromium after two minutes. Retry once the Playwright browser cache is available.',
  );
}

process.exit(result.status ?? 1);
