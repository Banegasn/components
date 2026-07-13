import { spawnSync } from 'node:child_process';

if (process.env.WTR_BROWSER_CHANNEL) {
  console.log(
    `[test] Using installed Playwright channel: ${process.env.WTR_BROWSER_CHANNEL}`,
  );
  process.exit(0);
}

const result = spawnSync('pnpm', ['exec', 'playwright', 'install', 'chromium'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

process.exit(result.status ?? 1);
