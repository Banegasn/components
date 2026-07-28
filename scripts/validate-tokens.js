const fs = require('node:fs');
const path = require('node:path');
const {
  classifyToken,
  inventoryPath,
  readJson,
  repositoryRoot,
  scanTokenUsage,
  tokenSourcePath,
} = require('./token-utils.js');

const source = readJson(tokenSourcePath);
const inventory = readJson(inventoryPath);
const failures = [];
const allowedTiers = new Set(['reference', 'system', 'component']);
const allowedCategories = new Set(['color', 'typography', 'shape', 'elevation', 'state', 'motion']);
const names = new Set();
const componentAliases = new Map();

for (const token of source.tokens) {
  if (names.has(token.name)) failures.push(`Duplicate canonical token: ${token.name}`);
  names.add(token.name);

  if (!allowedTiers.has(token.tier)) failures.push(`${token.name}: invalid tier ${token.tier}`);
  if (classifyToken(token.name) !== token.tier) {
    failures.push(`${token.name}: name does not match declared ${token.tier} tier`);
  }
  if (!allowedCategories.has(token.category)) {
    failures.push(`${token.name}: invalid category ${token.category}`);
  }
  if (!token.description) failures.push(`${token.name}: missing description`);
  if (token.emit === false) {
    if (token.tier !== 'component') {
      failures.push(`${token.name}: only component tokens may opt out of generated CSS`);
    }
    if (!token.legacy) {
      failures.push(`${token.name}: un-emitted component aliases must declare their legacy property`);
    } else if (!token.legacy.startsWith('--md-') || token.legacy.startsWith('--md-comp-')) {
      failures.push(`${token.name}: invalid legacy property ${token.legacy}`);
    } else if (componentAliases.has(token.legacy)) {
      failures.push(`${token.name}: duplicates legacy mapping for ${token.legacy}`);
    } else {
      componentAliases.set(token.legacy, token.name);
    }
    if (token.value !== undefined || token.values !== undefined) {
      failures.push(`${token.name}: un-emitted component aliases must not set a root value`);
    }
  } else if (token.value === undefined) {
    for (const themeName of Object.keys(source.themes)) {
      if (token.values?.[themeName] === undefined) {
        failures.push(`${token.name}: missing ${themeName} value`);
      }
    }
  }
}

for (const [canonical, legacy] of Object.entries(source.componentAliases ?? {})) {
  if (names.has(canonical)) failures.push(`Duplicate canonical token: ${canonical}`);
  names.add(canonical);
  if (classifyToken(canonical) !== 'component') {
    failures.push(`${canonical}: component aliases must use the --md-comp-* namespace`);
  }
  if (!legacy.startsWith('--md-') || legacy.startsWith('--md-comp-')) {
    failures.push(`${canonical}: invalid legacy property ${legacy}`);
  } else if (componentAliases.has(legacy)) {
    failures.push(`${canonical}: duplicates legacy mapping for ${legacy}`);
  } else {
    componentAliases.set(legacy, canonical);
  }
}

const inventoryNames = new Set(inventory.tokens.map((token) => token.name));
const currentUsage = scanTokenUsage();
for (const token of currentUsage) {
  if (!names.has(token.name) && !inventoryNames.has(token.name)) {
    failures.push(
      `Unknown token ${token.name} in ${token.locations.join(', ')}. ` +
      'Define it canonically or run pnpm tokens:inventory and review the compatibility change.'
    );
  }
}

function escapeForRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function countMatches(content, expression) {
  return [...content.matchAll(expression)].length;
}

for (const legacy of inventory.tokens.filter((token) => token.tier === 'legacy-component')) {
  const canonical = componentAliases.get(legacy.name);
  if (!canonical) {
    failures.push(`${legacy.name}: missing canonical --md-comp-* migration mapping`);
    continue;
  }

  for (const location of legacy.locations.filter((item) => item.endsWith('.styles.ts'))) {
    const content = fs.readFileSync(path.join(repositoryRoot, location), 'utf8');
    const legacyCalls = countMatches(
      content,
      new RegExp(`var\\(\\s*${escapeForRegex(legacy.name)}\\s*,`, 'g')
    );
    const canonicalFirstChains = countMatches(
      content,
      new RegExp(
        `var\\(\\s*${escapeForRegex(canonical)}\\s*,\\s*var\\(\\s*${escapeForRegex(legacy.name)}\\s*,`,
        'g'
      )
    );
    if (legacyCalls !== canonicalFirstChains) {
      failures.push(
        `${legacy.name}: ${location} must use ${canonical} → ${legacy.name} → literal fallback ` +
        `for every legacy var() call (${canonicalFirstChains}/${legacyCalls} valid chains).`
      );
    }
  }
}

for (const themeName of Object.keys(source.themes)) {
  const cssFile = `tokens/generated/${themeName}.css`;
  if (!fs.existsSync(cssFile)) failures.push(`Missing generated theme: ${cssFile}`);
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log(
  `Validated ${source.tokens.length} canonical tokens, ` +
  `${inventory.tokens.length} compatibility names, ${componentAliases.size} component migrations, ` +
  `and ${currentUsage.length} used names.`
);
