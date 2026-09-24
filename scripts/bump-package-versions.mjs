import { spawnSync } from 'node:child_process';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const [versionType, packageName = ''] = process.argv.slice(2);
if (!['patch', 'minor', 'major'].includes(versionType) || process.argv.length > 4) {
  console.error('Usage: node scripts/bump-package-versions.mjs <patch|minor|major> [package-name]');
  process.exit(1);
}

async function readManifest(file) {
  return { file, value: JSON.parse(await readFile(file, 'utf8')) };
}

async function manifestsIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => readManifest(path.join(directory, entry.name, 'package.json'))),
  );
}

function bump(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) throw new Error(`Unsupported version: ${version}`);
  const [, major, minor, patch] = match.map(Number);
  switch (versionType) {
    case 'major': return `${major + 1}.0.0`;
    case 'minor': return `${major}.${minor + 1}.0`;
    default: return `${major}.${minor}.${patch + 1}`;
  }
}

const packages = await manifestsIn('packages');
const selected = packages.filter(
  ({ value }) => !value.private && (!packageName || value.name === packageName),
);
if (selected.length === 0) {
  console.error(`No publishable package found${packageName ? `: ${packageName}` : ''}`);
  process.exit(1);
}

const bumped = new Map();
const previousVersions = new Map();
for (const { value } of selected) {
  previousVersions.set(value.name, value.version);
  bumped.set(value.name, bump(value.version));
}

const manifests = [await readManifest('package.json'), ...(await manifestsIn('apps')), ...packages];
for (const { file, value } of manifests) {
  let changed = false;
  if (bumped.has(value.name)) {
    value.version = bumped.get(value.name);
    changed = true;
  }

  for (const key of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
    const dependencies = value[key];
    if (!dependencies) continue;
    for (const [name, spec] of Object.entries(dependencies)) {
      if (!bumped.has(name)) continue;
      const match = /^workspace:([~^]?)(\d+\.\d+\.\d+)$/.exec(spec);
      if (!match) continue;
      dependencies[name] = `workspace:${match[1]}${bumped.get(name)}`;
      changed = true;
    }
  }

  if (changed) await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

const install = spawnSync('pnpm', ['install', '--lockfile-only'], { stdio: 'inherit' });
if (install.error) throw install.error;
if (install.status !== 0) process.exit(install.status ?? 1);

for (const { value } of selected) {
  console.log(`${value.name}: ${previousVersions.get(value.name)} → ${bumped.get(value.name)}`);
}
