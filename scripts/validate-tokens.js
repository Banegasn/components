const fs = require('node:fs');
const {
  classifyToken,
  readJson,
  scanComponentStyleUsage,
  scanTokenUsage,
  tokenSourcePath,
} = require('./token-utils.js');

const source = readJson(tokenSourcePath);
const failures = [];
const allowedTiers = new Set(['reference', 'system', 'component']);
const allowedCategories = new Set(['color', 'typography', 'shape', 'elevation', 'state', 'motion']);
const names = new Set();

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
  if (token.value === undefined && token.tier !== 'component') {
    for (const themeName of Object.keys(source.themes)) {
      if (token.values?.[themeName] === undefined) {
        failures.push(`${token.name}: missing ${themeName} value`);
      }
    }
  }
}

const currentUsage = scanTokenUsage();
for (const token of currentUsage) {
  if (!names.has(token.name)) {
    failures.push(
      `Unknown token ${token.name} in ${token.locations.join(', ')}. ` +
      'Define it in tokens/tokens.json before using it.'
    );
  }
}

for (const component of source.tokens.filter((token) => token.tier === 'component')) {
  if (scanComponentStyleUsage(component.name).length === 0) {
    failures.push(
      `${component.name}: public component tokens must be used through var() in an owning executable stylesheet`
    );
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
  `${source.tokens.filter((token) => token.tier === 'component').length} live component tokens, ` +
  `and ${currentUsage.length} used names.`
);
