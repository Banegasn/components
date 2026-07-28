const fs = require('node:fs');
const path = require('node:path');
const {
  generatedDirectory,
  readJson,
  repositoryRoot,
  tokenSourcePath,
} = require('./token-utils.js');

const check = process.argv.includes('--check');
const source = readJson(tokenSourcePath);
const themes = Object.entries(source.themes);

function tokenValue(token, themeName) {
  return token.value ?? token.values?.[themeName];
}

function renderTheme(themeName, theme) {
  const declarations = source.tokens
    // Component tokens with component-local defaults are declared and consumed
    // by their owning styles. Only tokens with an explicit shared value belong
    // in the generated application theme.
    .filter((token) => token.emit !== false)
    .map((token) => [token.name, tokenValue(token, themeName)])
    .filter(([, value]) => value !== undefined)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');

  const reducedMotionDeclarations = source.tokens
    .filter((token) => token.category === 'motion' && token.name.includes('-duration-'))
    .map((token) => `  ${token.name}: 1ms;`)
    .join('\n');
  const reducedMotion = reducedMotionDeclarations
    ? `\n/* Motion is optional: state changes remain visible without movement. */\n@media (prefers-reduced-motion: reduce) {\n  ${theme.selector} {\n${reducedMotionDeclarations}\n  }\n}\n`
    : '';

  return `/* This file is generated from tokens/tokens.json. Do not edit. */\n${theme.selector} {\n${declarations}\n}\n${reducedMotion}`;
}

function writeOrCheck(file, content, failures) {
  if (check) {
    if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content) {
      failures.push(path.relative(repositoryRoot, file));
    }
    return;
  }

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

fs.mkdirSync(generatedDirectory, { recursive: true });
const failures = [];

for (const [themeName, theme] of themes) {
  writeOrCheck(
    path.join(generatedDirectory, `${themeName}.css`),
    renderTheme(themeName, theme),
    failures
  );
}

if (failures.length > 0) {
  console.error(`Generated token artifacts are stale:\n${failures.map((file) => `- ${file}`).join('\n')}`);
  console.error('Run pnpm tokens:generate and commit the result.');
  process.exit(1);
}

if (!check) {
  console.log(`Generated ${themes.length} themes.`);
}
