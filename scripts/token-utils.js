const fs = require('node:fs');
const path = require('node:path');

const repositoryRoot = path.resolve(__dirname, '..');
const tokenSourcePath = path.join(repositoryRoot, 'tokens', 'tokens.json');
const inventoryPath = path.join(repositoryRoot, 'tokens', 'generated', 'legacy-token-inventory.json');
const generatedDirectory = path.join(repositoryRoot, 'tokens', 'generated');

const SOURCE_EXTENSIONS = new Set(['.css', '.html', '.md', '.ts']);
const SCAN_ROOTS = [
  path.join(repositoryRoot, 'packages'),
  path.join(repositoryRoot, 'apps'),
  path.join(repositoryRoot, 'README.md'),
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function walk(entry, files = []) {
  const stat = fs.statSync(entry);
  if (stat.isFile()) {
    if (SOURCE_EXTENSIONS.has(path.extname(entry))) files.push(entry);
    return files;
  }

  for (const child of fs.readdirSync(entry, { withFileTypes: true })) {
    if (['dist', 'node_modules', '.angular', '.turbo'].includes(child.name)) continue;
    walk(path.join(entry, child.name), files);
  }
  return files;
}

function classifyToken(name) {
  if (name.startsWith('--md-ref-')) return 'reference';
  if (name.startsWith('--md-sys-')) return 'system';
  if (name.startsWith('--md-comp-')) return 'component';
  return 'legacy-component';
}

function scanTokenUsage() {
  const usage = new Map();
  const files = SCAN_ROOTS.flatMap((entry) => walk(entry));

  for (const file of files) {
    const relativeFile = path.relative(repositoryRoot, file).split(path.sep).join('/');
    const matches = fs.readFileSync(file, 'utf8').match(/--md-[a-z0-9_-]+/g) ?? [];

    for (const name of matches) {
      if (name.endsWith('-')) continue;
      if (!usage.has(name)) usage.set(name, new Set());
      usage.get(name).add(relativeFile);
    }
  }

  return [...usage.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, locations]) => ({
      name,
      tier: classifyToken(name),
      locations: [...locations].sort(),
    }));
}

function formatJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

module.exports = {
  classifyToken,
  formatJson,
  generatedDirectory,
  inventoryPath,
  readJson,
  repositoryRoot,
  scanTokenUsage,
  tokenSourcePath,
};
