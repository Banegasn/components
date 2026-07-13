import { execFile } from 'node:child_process';
import {
  access,
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const workspaceRoots = ['packages', 'apps'];

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function publicWorkspacePackages() {
  const packages = [];

  for (const workspaceRoot of workspaceRoots) {
    const root = join(repositoryRoot, workspaceRoot);
    const entries = await readdir(root, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const directory = join(root, entry.name);
      const manifestPath = join(directory, 'package.json');
      let manifest;

      try {
        manifest = await readJson(manifestPath);
      } catch (error) {
        if (error.code === 'ENOENT') continue;
        throw error;
      }

      if (!manifest.private) {
        if (!manifest.name) {
          throw new Error(`${relative(repositoryRoot, manifestPath)} has no package name`);
        }
        packages.push({ directory, manifest });
      }
    }
  }

  return packages.sort((a, b) => a.manifest.name.localeCompare(b.manifest.name));
}

function installedPackageDirectory(fixture, packageName) {
  return join(fixture, 'node_modules', ...packageName.split('/'));
}

function exportedTargets(exportsField) {
  if (typeof exportsField === 'string') return [exportsField];
  if (Array.isArray(exportsField)) return exportsField.flatMap(exportedTargets);
  if (!exportsField || typeof exportsField !== 'object') return [];
  return Object.values(exportsField).flatMap(exportedTargets);
}

async function assertFile(packageDirectory, target, description) {
  if (typeof target !== 'string' || !target.startsWith('./')) {
    throw new Error(`${description} must be a relative package target; received ${target}`);
  }

  const path = join(packageDirectory, target);
  try {
    await access(path);
  } catch {
    throw new Error(`${description} points to missing file ${target}`);
  }
}

async function validateInstalledPackage(fixture, expectedManifest) {
  const packageDirectory = installedPackageDirectory(fixture, expectedManifest.name);
  const manifest = await readJson(join(packageDirectory, 'package.json'));

  if (manifest.name !== expectedManifest.name || manifest.version !== expectedManifest.version) {
    throw new Error(
      `Installed archive mismatch for ${expectedManifest.name}: ` +
      `expected ${expectedManifest.version}, received ${manifest.name}@${manifest.version}`,
    );
  }

  if (!manifest.exports) {
    throw new Error(`${manifest.name} does not declare package exports`);
  }

  const targets = [...new Set(exportedTargets(manifest.exports))];
  if (targets.length === 0) {
    throw new Error(`${manifest.name} does not expose any package export targets`);
  }

  await Promise.all(
    targets.map((target) => assertFile(packageDirectory, target, `${manifest.name} export`)),
  );

  if (!manifest.types) {
    throw new Error(`${manifest.name} does not declare a top-level types entry`);
  }
  await assertFile(packageDirectory, manifest.types, `${manifest.name} types entry`);

  const rootExport = manifest.exports['.'] ?? manifest.exports;
  if (rootExport && typeof rootExport === 'object' && !Array.isArray(rootExport)) {
    if (!rootExport.types) {
      throw new Error(`${manifest.name} root export does not declare a types condition`);
    }
    await assertFile(packageDirectory, rootExport.types, `${manifest.name} root types export`);
  }
}

async function packPackage(packageInfo, archiveDirectory) {
  const { stdout } = await run(
    'npm',
    ['pack', packageInfo.directory, '--json', '--pack-destination', archiveDirectory],
    { cwd: repositoryRoot, maxBuffer: 10 * 1024 * 1024 },
  );
  const result = JSON.parse(stdout);
  const filename = result[0]?.filename;

  if (!filename) {
    throw new Error(`npm pack did not return an archive for ${packageInfo.manifest.name}`);
  }

  return join(archiveDirectory, filename);
}

async function importPackagesFromFixture(fixture, packageNames) {
  const imports = packageNames
    .map((packageName) => `await import(${JSON.stringify(packageName)});`)
    .join('\n');

  await run(process.execPath, ['--input-type=module', '--eval', imports], {
    cwd: fixture,
    maxBuffer: 10 * 1024 * 1024,
  });
}

async function main() {
  const packageInfos = await publicWorkspacePackages();
  if (packageInfos.length === 0) throw new Error('No public workspace packages found');

  const temporaryRoot = await mkdtemp(join(tmpdir(), 'components-package-smoke-'));
  const archiveDirectory = join(temporaryRoot, 'archives');
  const fixture = join(temporaryRoot, 'fixture');

  try {
    await mkdir(archiveDirectory);
    await mkdir(fixture);
    await writeFile(
      join(fixture, 'package.json'),
      `${JSON.stringify({ private: true, type: 'module' }, null, 2)}\n`,
    );

    console.log(`Packing ${packageInfos.length} public workspace packages...`);
    const archives = [];
    for (const packageInfo of packageInfos) {
      archives.push(await packPackage(packageInfo, archiveDirectory));
    }

    await run(
      'npm',
      [
        'install',
        '--ignore-scripts',
        '--no-audit',
        '--no-fund',
        '--package-lock=false',
        ...archives,
      ],
      { cwd: fixture, maxBuffer: 10 * 1024 * 1024 },
    );

    for (const packageInfo of packageInfos) {
      await validateInstalledPackage(fixture, packageInfo.manifest);
    }

    await importPackagesFromFixture(
      fixture,
      packageInfos.map(({ manifest }) => manifest.name),
    );

    console.log(
      `Package smoke test passed for ${packageInfos.length} archives:\n` +
      packageInfos.map(({ manifest }) => `  - ${manifest.name}@${manifest.version}`).join('\n'),
    );
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
