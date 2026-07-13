const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const repositoryRoot = path.resolve(__dirname, '..');
const packagesRoot = path.join(repositoryRoot, 'packages');
const canonicalLicense = fs.readFileSync(path.join(repositoryRoot, 'LICENSE'), 'utf8');
const packageDirectories = fs.readdirSync(packagesRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(packagesRoot, entry.name))
  .filter((directory) => fs.existsSync(path.join(directory, 'package.json')))
  .sort();

const failures = [];
let checked = 0;

for (const directory of packageDirectories) {
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'));
  if (manifest.private) continue;
  checked += 1;

  try {
    const output = execFileSync(
      'npm',
      ['pack', '--dry-run', '--json', '--ignore-scripts=false'],
      { cwd: directory, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
    );
    const result = JSON.parse(output);
    const files = result[0]?.files?.map((file) => file.path) ?? [];

    if (!files.includes('LICENSE')) {
      failures.push(`${manifest.name}: packed archive does not include LICENSE`);
    }
  } catch (error) {
    const detail = error.stderr?.trim() || error.message;
    failures.push(`${manifest.name}: npm pack failed: ${detail}`);
  } finally {
    const generatedLicense = path.join(directory, 'LICENSE');
    if (fs.existsSync(generatedLicense)) {
      if (fs.readFileSync(generatedLicense, 'utf8') === canonicalLicense) {
        fs.unlinkSync(generatedLicense);
        failures.push(`${manifest.name}: generated LICENSE required verifier cleanup after packing`);
      } else {
        failures.push(`${manifest.name}: unexpected package-specific LICENSE was left in place`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Verified LICENSE in ${checked} public package archives.`);
