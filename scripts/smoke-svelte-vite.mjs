import { execFile, spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { chromium } from 'playwright';

const run = promisify(execFile);
const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const sveltePackageDirectory = join(
  repositoryRoot,
  'packages',
  'svelte-components',
);

async function availablePort() {
  const server = createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Unable to allocate a local port for the Vite smoke test.');
  }
  const { port } = address;
  server.close();
  await once(server, 'close');
  return port;
}

async function packPackage(archiveDirectory) {
  const { stdout } = await run(
    'npm',
    [
      'pack',
      sveltePackageDirectory,
      '--json',
      '--pack-destination',
      archiveDirectory,
    ],
    { cwd: repositoryRoot, maxBuffer: 10 * 1024 * 1024 },
  );
  const result = JSON.parse(stdout);
  const filename = result[0]?.filename;
  if (!filename)
    throw new Error('npm pack did not produce a Svelte package archive.');
  return join(archiveDirectory, filename);
}

async function writeConsumerFiles(fixture, archive) {
  await writeFile(
    join(fixture, 'package.json'),
    `${JSON.stringify(
      {
        private: true,
        type: 'module',
        dependencies: {
          '@banegasn/svelte-components': `file:${archive}`,
          '@sveltejs/vite-plugin-svelte': '7.2.0',
          svelte: '5.56.8',
          vite: '8.1.5',
        },
      },
      null,
      2,
    )}\n`,
  );
  await writeFile(
    join(fixture, 'index.html'),
    '<div id="app"></div>\n<script type="module" src="/src/main.js"></script>\n',
  );
  await mkdir(join(fixture, 'src'));
  await writeFile(
    join(fixture, 'src', 'main.js'),
    `import { mount } from 'svelte';
import { SvelteButton as RootButton } from '@banegasn/svelte-components';
import SubpathButton from '@banegasn/svelte-components/SvelteButton.svelte';

const app = document.querySelector('#app');
mount(RootButton, { target: app, props: { label: 'Root export' } });
mount(SubpathButton, { target: app, props: { label: 'Subpath export' } });
`,
  );
  await writeFile(
    join(fixture, 'vite.config.js'),
    `import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({ plugins: [svelte()] });
`,
  );
}

async function waitForServer(server, url) {
  let output = '';
  server.stdout.on('data', (chunk) => {
    output += chunk;
  });
  server.stderr.on('data', (chunk) => {
    output += chunk;
  });

  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Vite dev server exited early:\n${output}`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out waiting for Vite dev server:\n${output}`);
}

async function stopServer(server) {
  if (server.exitCode !== null) return;
  server.kill('SIGTERM');
  await Promise.race([
    once(server, 'exit'),
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]);
}

async function main() {
  const temporaryRoot = await mkdtemp(
    join(tmpdir(), 'components-svelte-vite-smoke-'),
  );
  const archiveDirectory = join(temporaryRoot, 'archives');
  const fixture = join(temporaryRoot, 'consumer');
  let server;
  let browser;

  try {
    await mkdir(archiveDirectory);
    await mkdir(fixture);
    const archive = await packPackage(archiveDirectory);
    await writeConsumerFiles(fixture, archive);
    await run(
      'npm',
      [
        'install',
        '--ignore-scripts',
        '--no-audit',
        '--no-fund',
        '--package-lock=false',
      ],
      { cwd: fixture, maxBuffer: 10 * 1024 * 1024 },
    );

    await run('npm', ['exec', '--', 'vite', 'build'], {
      cwd: fixture,
      maxBuffer: 10 * 1024 * 1024,
    });

    const port = await availablePort();
    const url = `http://127.0.0.1:${port}`;
    server = spawn(
      'npm',
      [
        'exec',
        '--',
        'vite',
        '--host',
        '127.0.0.1',
        '--port',
        String(port),
        '--strictPort',
      ],
      {
        cwd: fixture,
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    await waitForServer(server, url);

    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    const labels = await page.locator('button').allTextContents();
    if (!labels.includes('Root export') || !labels.includes('Subpath export')) {
      throw new Error(
        `Expected both packed Svelte exports to render; received: ${labels.join(', ')}`,
      );
    }

    console.log(
      'Svelte Vite smoke test passed for package-root and .svelte subpath exports.',
    );
  } finally {
    await browser?.close();
    if (server) await stopServer(server);
    await rm(temporaryRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
