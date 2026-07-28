const fs = require('node:fs');
const path = require('node:path');
const { readJson, repositoryRoot, tokenSourcePath } = require('./token-utils.js');

const requiredTokens = [
  ...['short1', 'short2', 'short3', 'short4'].map((name) => `--md-sys-motion-duration-${name}`),
  ...['medium1', 'medium2', 'medium3', 'medium4'].map((name) => `--md-sys-motion-duration-${name}`),
  ...['long1', 'long2', 'long3', 'long4'].map((name) => `--md-sys-motion-duration-${name}`),
  ...['extra-long1', 'extra-long2', 'extra-long3', 'extra-long4'].map((name) => `--md-sys-motion-duration-${name}`),
  '--md-sys-motion-continuous-play-state',
  '--md-sys-motion-progress-start',
  '--md-sys-motion-ripple-visibility',
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

const source = readJson(tokenSourcePath);
const tokenNames = new Set(source.tokens.map((token) => token.name));
const failures = requiredTokens.filter((name) => !tokenNames.has(name)).map((name) => `Missing public motion token: ${name}`);
const extensions = new Set(['.css', '.ts', '.js', '.svelte']);

function walk(entry, files = []) {
  const stat = fs.statSync(entry);
  if (stat.isFile()) {
    if (extensions.has(path.extname(entry)) && !entry.endsWith('.test.ts')) files.push(entry);
    return files;
  }
  for (const child of fs.readdirSync(entry, { withFileTypes: true })) {
    if (['dist', 'node_modules', '.angular', '.turbo', '.svelte-kit'].includes(child.name)) continue;
    walk(path.join(entry, child.name), files);
  }
  return files;
}

function hasRecentExemption(lines, index) {
  return lines.slice(Math.max(0, index - 10), index + 1).some((line) => line.includes('motion-literal-exempt'));
}

const motionFiles = [
  ...walk(path.join(repositoryRoot, 'packages')),
  ...walk(path.join(repositoryRoot, 'apps')),
];
let checkedSources = 0;

for (const file of motionFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const relativeFile = path.relative(repositoryRoot, file);
  const hasMotion = /\b(?:transition|animation)\s*:/.test(content);
  const hasTimer = /\bsetTimeout\s*\(/.test(content);
  if (!hasMotion && !hasTimer) continue;
  checkedSources += 1;

  const lines = content.split('\n');
  for (const [index, line] of lines.entries()) {
    const isComment = /^\s*(?:\/\/|\/\*|\*)/.test(line);
    const literalTime = !isComment && /(?<![-\w])(?:\d+(?:\.\d+)?|\.\d+)(?:ms|s)\b/.test(line);
    if (literalTime && !hasRecentExemption(lines, index)) {
      failures.push(`${relativeFile}:${index + 1}: literal timing must use a motion token or carry a motion-literal-exempt explanation`);
    }
    if (/\bsetTimeout\s*\([^,]+,\s*\d/.test(line) && !hasRecentExemption(lines, index)) {
      failures.push(`${relativeFile}:${index + 1}: runtime timeout must derive from a computed motion token or be documented as non-motion`);
    }
  }

  if (hasMotion && !content.includes('--md-sys-motion-')) {
    failures.push(`${relativeFile}: motion declaration does not consume the canonical motion vocabulary`);
  }
  if (/animation:[^;]*\binfinite\b/.test(content)) {
    if (!content.includes('prefers-reduced-motion: reduce') || !content.includes('--md-sys-motion-continuous-play-state')) {
      failures.push(`${relativeFile}: continuous animation requires static reduced-motion behavior and a verification-mode play state`);
    }
  }
}

for (const theme of Object.keys(source.themes)) {
  const file = path.join(repositoryRoot, 'tokens', 'generated', `${theme}.css`);
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes(':root[data-motion="reduced"]') || !content.includes('@media (prefers-reduced-motion: reduce)') || !content.includes('--md-sys-motion-duration-short4: 1ms;') || !content.includes('--md-sys-motion-continuous-play-state: paused;')) {
    failures.push(`${path.relative(repositoryRoot, file)}: missing media-query or demo verification-mode reduced-motion contract`);
  }
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`Validated ${requiredTokens.length} public motion tokens and ${checkedSources} package/demo motion sources.`);
