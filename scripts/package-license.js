const fs = require('node:fs');
const path = require('node:path');

const action = process.argv[2];
const repositoryRoot = path.resolve(__dirname, '..');
const source = path.join(repositoryRoot, 'LICENSE');
const target = path.join(process.cwd(), 'LICENSE');
const manifestPath = path.join(process.cwd(), 'package.json');

if (!['prepare', 'clean'].includes(action)) {
  throw new Error('Usage: node scripts/package-license.js <prepare|clean>');
}
if (path.resolve(target) === path.resolve(source) || !fs.existsSync(manifestPath)) {
  throw new Error('Package license lifecycle must run from a package directory');
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (manifest.private) {
  throw new Error(`Refusing to prepare a license archive for private package ${manifest.name}`);
}

const license = fs.readFileSync(source, 'utf8');

if (action === 'prepare') {
  if (fs.existsSync(target) && fs.readFileSync(target, 'utf8') !== license) {
    throw new Error(`Refusing to overwrite a different license at ${target}`);
  }
  fs.writeFileSync(target, license);
} else if (fs.existsSync(target)) {
  if (fs.readFileSync(target, 'utf8') !== license) {
    throw new Error(`Refusing to remove a different license at ${target}`);
  }
  fs.unlinkSync(target);
}
