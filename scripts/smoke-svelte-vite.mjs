import { execFile, spawn } from 'node:child_process';
import { once } from 'node:events';
import {
  access,
  mkdtemp,
  mkdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
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

async function assertFile(path, description) {
  try {
    await access(path);
  } catch {
    throw new Error(`Packed Svelte package is missing ${description}: ${path}`);
  }
}

async function assertPackedPackage(archive, archiveDirectory) {
  const unpackDirectory = join(archiveDirectory, 'unpacked');
  await mkdir(unpackDirectory);
  await run('tar', ['-xzf', archive, '-C', unpackDirectory]);

  const packageDirectory = join(unpackDirectory, 'package');
  const manifest = JSON.parse(
    await readFile(join(packageDirectory, 'package.json'), 'utf8'),
  );
  const expectedExports = {
    '.': {
      types: './dist/index.d.ts',
      svelte: './dist/index.js',
      default: './dist/index.js',
    },
    './SvelteButton.svelte': {
      types: './dist/SvelteButton.svelte.d.ts',
      svelte: './dist/SvelteButton.svelte',
      default: './dist/SvelteButton.svelte',
    },
  };

  if (
    manifest.svelte !== './dist/index.js' ||
    manifest.types !== './dist/index.d.ts' ||
    JSON.stringify(manifest.exports) !== JSON.stringify(expectedExports)
  ) {
    throw new Error(
      `Packed Svelte package export metadata changed unexpectedly:\n${JSON.stringify(
        {
          svelte: manifest.svelte,
          types: manifest.types,
          exports: manifest.exports,
        },
        null,
        2,
      )}`,
    );
  }

  await Promise.all([
    assertFile(
      join(packageDirectory, 'dist', 'index.js'),
      'root runtime export',
    ),
    assertFile(
      join(packageDirectory, 'dist', 'index.d.ts'),
      'root declaration export',
    ),
    assertFile(
      join(packageDirectory, 'dist', 'SvelteButton.svelte'),
      'copied Svelte subpath source',
    ),
    assertFile(
      join(packageDirectory, 'dist', 'SvelteButton.svelte.d.ts'),
      'Svelte subpath declaration export',
    ),
  ]);
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
        devDependencies: {
          typescript: '6.0.3',
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
  await writeFile(
    join(fixture, 'src', 'package-api.ts'),
    `import { SvelteButton as RootButton } from '@banegasn/svelte-components';
import SubpathButton from '@banegasn/svelte-components/SvelteButton.svelte';

const rootExport: typeof RootButton = RootButton;
const subpathExport: typeof SubpathButton = SubpathButton;

void rootExport;
void subpathExport;
`,
  );
  await writeFile(
    join(fixture, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          module: 'ESNext',
          moduleResolution: 'bundler',
          noEmit: true,
          strict: true,
        },
        include: ['src/package-api.ts'],
      },
      null,
      2,
    )}\n`,
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

  const waitForExit = (timeoutMs) => {
    if (server.exitCode !== null) return Promise.resolve(true);
    return new Promise((resolve) => {
      const onExit = () => {
        clearTimeout(timeout);
        resolve(true);
      };
      const timeout = setTimeout(() => {
        server.off('exit', onExit);
        resolve(false);
      }, timeoutMs);
      server.once('exit', onExit);
    });
  };

  server.kill('SIGTERM');
  const exitedAfterTerm = await waitForExit(5_000);
  if (exitedAfterTerm || server.exitCode !== null) return;

  server.kill('SIGKILL');
  if (!(await waitForExit(5_000))) {
    throw new Error('Timed out stopping the Vite smoke-test server.');
  }
}

async function closeBrowser(browser) {
  let timeout;
  const closed = await Promise.race([
    browser.close().then(() => true),
    new Promise((resolve) => {
      timeout = setTimeout(() => resolve(false), 10_000);
    }),
  ]).finally(() => clearTimeout(timeout));

  if (!closed) {
    throw new Error('Timed out closing the Vite smoke-test browser.');
  }
}

async function startServer(fixture) {
  let lastPortError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const port = await availablePort();
    const url = `http://127.0.0.1:${port}`;
    const server = spawn(
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

    try {
      await waitForServer(server, url);
      return { server, url };
    } catch (error) {
      await stopServer(server);
      if (!String(error).includes('EADDRINUSE') || attempt === 3) throw error;
      lastPortError = error;
    }
  }

  throw lastPortError;
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
    await assertPackedPackage(archive, archiveDirectory);
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

    await run('npm', ['exec', '--', 'tsc', '--project', 'tsconfig.json'], {
      cwd: fixture,
      maxBuffer: 10 * 1024 * 1024,
    });

    await run('npm', ['exec', '--', 'vite', 'build'], {
      cwd: fixture,
      maxBuffer: 10 * 1024 * 1024,
    });

    const startedServer = await startServer(fixture);
    server = startedServer.server;

    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(startedServer.url, { waitUntil: 'networkidle' });
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
    let cleanupFailure;
    if (browser) {
      try {
        await closeBrowser(browser);
      } catch (error) {
        cleanupFailure = error;
      }
    }
    if (server) {
      try {
        await stopServer(server);
      } catch (error) {
        cleanupFailure ??= error;
      }
    }
    try {
      await rm(temporaryRoot, { recursive: true, force: true });
    } catch (error) {
      cleanupFailure ??= error;
    }
    if (cleanupFailure) throw cleanupFailure;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
