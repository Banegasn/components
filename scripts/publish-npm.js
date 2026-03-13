const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const packagesDir = path.join(process.cwd(), 'packages');
let packages = [];

try {
  packages = fs.readdirSync(packagesDir);
} catch (e) {
  console.error('Could not read packages directory');
  process.exit(1);
}

// 1. Update registry to npmjs
console.log('Switching publish registry to npmjs.org...');
packages.forEach(pkg => {
  const pkgPath = path.join(packagesDir, pkg, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const content = fs.readFileSync(pkgPath, 'utf8');
    fs.writeFileSync(pkgPath, content.replace(/https:\/\/npm\.pkg\.github\.com/g, 'https://registry.npmjs.org'));
  }
});

try {
  // 2. Build and Publish
  console.log('\n--- Building packages ---');
  execSync('pnpm build', { stdio: 'inherit' });
  
  console.log('\n--- Publishing to npm ---');
  // We use the --registry flag here as well just to be explicit
  execSync('pnpm publish -r --filter="./packages/*" --no-git-checks --registry https://registry.npmjs.org/', { stdio: 'inherit' });
  
} catch (error) {
  console.error('\nPublishing failed. Rolling back registry changes...');
  process.exitCode = 1;
} finally {
  // 3. Rollback registry to GitHub Packages
  console.log('\nRolling back publish registry to npm.pkg.github.com...');
  packages.forEach(pkg => {
    const pkgPath = path.join(packagesDir, pkg, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const content = fs.readFileSync(pkgPath, 'utf8');
      fs.writeFileSync(pkgPath, content.replace(/https:\/\/registry\.npmjs\.org/g, 'https://npm.pkg.github.com'));
    }
  });
  console.log('Rollback complete.');
}
