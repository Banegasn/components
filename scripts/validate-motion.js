const fs = require('node:fs');
const path = require('node:path');
const { readJson, repositoryRoot, tokenSourcePath } = require('./token-utils.js');

const requiredTokens = [
  ...['short1', 'short2', 'short3', 'short4'].map((name) => `--md-sys-motion-duration-${name}`),
  ...['medium1', 'medium2', 'medium3', 'medium4'].map((name) => `--md-sys-motion-duration-${name}`),
  ...['long1', 'long2', 'long3', 'long4'].map((name) => `--md-sys-motion-duration-${name}`),
  ...['extra-long1', 'extra-long2', 'extra-long3', 'extra-long4'].map((name) => `--md-sys-motion-duration-${name}`),
  '--md-sys-motion-easing-standard',
  '--md-sys-motion-easing-standard-accelerate',
  '--md-sys-motion-easing-standard-decelerate',
  '--md-sys-motion-easing-emphasized',
  '--md-sys-motion-easing-emphasized-accelerate',
  '--md-sys-motion-easing-emphasized-decelerate',
  '--md-sys-motion-easing-linear',
  '--md-sys-motion-spring-fast',
  '--md-sys-motion-spring-bouncy',
];

const continuousAlternatives = [
  'packages/m3-button/src/m3-button.styles.ts',
  'packages/m3-divider/src/m3-divider.styles.ts',
  'packages/m3-list/src/m3-list.styles.ts',
  'packages/m3-loading-indicator/src/m3-loading-indicator.styles.ts',
  'packages/m3-progress/src/m3-progress.styles.ts',
  'packages/m3-radio-button/src/m3-radio-button.styles.ts',
];

const source = readJson(tokenSourcePath);
const tokenNames = new Set(source.tokens.map((token) => token.name));
const failures = requiredTokens.filter((name) => !tokenNames.has(name)).map((name) => `Missing public motion token: ${name}`);

for (const relativeFile of continuousAlternatives) {
  const content = fs.readFileSync(path.join(repositoryRoot, relativeFile), 'utf8');
  if (!content.includes('prefers-reduced-motion: reduce')) {
    failures.push(`${relativeFile}: continuous animation has no reduced-motion alternative`);
  }
}

for (const theme of Object.keys(source.themes)) {
  const file = path.join(repositoryRoot, 'tokens', 'generated', `${theme}.css`);
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('@media (prefers-reduced-motion: reduce)') || !content.includes('--md-sys-motion-duration-short4: 1ms;')) {
    failures.push(`${path.relative(repositoryRoot, file)}: missing generated reduced-motion duration contract`);
  }
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`Validated ${requiredTokens.length} public motion tokens and ${continuousAlternatives.length} static reduced-motion alternatives.`);
