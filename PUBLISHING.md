# Publishing to GitHub Packages

This guide explains how to publish the component packages from this monorepo to GitHub Packages.

## Prerequisites

1. **GitHub Personal Access Token (PAT)**
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate a new token with the following scopes:
     - `write:packages` - Upload packages to GitHub Package Registry
     - `read:packages` - Download packages from GitHub Package Registry
     - `delete:packages` - Delete packages from GitHub Package Registry (optional)
   - Save your token securely

2. **Authentication Setup**
   
   Set your GitHub token as an environment variable:
   
   ```bash
   # Linux/macOS
   export NODE_AUTH_TOKEN=your_github_token_here
   
   # Windows (Command Prompt)
   set NODE_AUTH_TOKEN=your_github_token_here
   
   # Windows (PowerShell)
   $env:NODE_AUTH_TOKEN="your_github_token_here"
   ```

   Alternatively, create a `.npmrc` file in your home directory:
   ```
   //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
   ```

## Package Configuration

All packages are configured to publish to GitHub Packages with the following settings:

- **Scope**: `@banegasn`
- **Registry**: `https://npm.pkg.github.com`
- **Access**: `public`

## Publishing Workflow

### 1. Build the Packages

Ensure all packages are built before publishing:

```bash
pnpm build
```

### 2. Update Version

Use the provided version scripts to bump versions across all packages:

```bash
# Patch version (1.0.0 → 1.0.1)
pnpm version:patch

# Minor version (1.0.0 → 1.1.0)
pnpm version:minor

# Major version (1.0.0 → 2.0.0)
pnpm version:major
```

Or update versions manually in each package's `package.json`.

### 3. Publish All Packages

```bash
pnpm publish:packages
```

This command will:
- Build all packages using Turbo
- Publish all packages in the `packages/` directory
- Skip git checks (useful for CI/CD)

### 4. Publish Individual Package

To publish a specific package:

```bash
# From the root directory
pnpm --filter @banegasn/example-component publish

# Or navigate to the package directory
cd packages/example-component
pnpm publish
```

## Installing Published Packages

Users can install your packages by first configuring their `.npmrc`:

```
@banegasn:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=GITHUB_TOKEN
```

Then install with:

```bash
npm install @banegasn/example-component
# or
pnpm add @banegasn/example-component
# or
yarn add @banegasn/example-component
```

## GitHub Actions CI/CD (Optional)

You can automate publishing with GitHub Actions. Create `.github/workflows/publish.yml`:

```yaml
name: Publish Packages

on:
  release:
    types: [created]
  workflow_dispatch:

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 9.12.1
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@banegasn'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Build packages
        run: pnpm build
      
      - name: Publish packages
        run: pnpm publish -r --filter './packages/*' --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Troubleshooting

### Authentication Issues

If you get `401 Unauthorized` or `403 Forbidden` errors:
1. Verify your token has the correct scopes
2. Check that `NODE_AUTH_TOKEN` environment variable is set
3. Ensure the package name scope matches your GitHub username/org (`@banegasn`)

### Package Already Exists

GitHub Packages doesn't allow overwriting existing package versions. You must:
1. Bump the version number
2. Or delete the existing version from GitHub (requires `delete:packages` scope)

### Registry Issues

If packages aren't publishing to the correct registry:
1. Check `publishConfig.registry` in each package's `package.json`
2. Verify the `.npmrc` configuration
3. Ensure you're authenticated with the correct registry

## Package Visibility

Published packages are set to `public` access. To view them:
- Go to your GitHub profile
- Click on "Packages" tab
- You should see `@banegasn/example-component` and `@banegasn/svelte-components`

## Best Practices

1. **Semantic Versioning**: Follow semver (major.minor.patch)
2. **Changelog**: Keep a CHANGELOG.md for each package
3. **Git Tags**: Tag releases in git: `git tag v1.0.0 && git push --tags`
4. **Test Before Publishing**: Always build and test before publishing
5. **README Updates**: Keep package READMEs up to date with usage examples

## Quick Reference

```bash
# Build all packages
pnpm build

# Bump versions
pnpm version:patch    # 1.0.0 → 1.0.1
pnpm version:minor    # 1.0.0 → 1.1.0
pnpm version:major    # 1.0.0 → 2.0.0

# Publish all packages
pnpm publish:packages

# Publish single package
pnpm --filter @banegasn/example-component publish
```

