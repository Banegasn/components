# Complete Setup Guide: Multi-Framework Monorepo

This guide walks you through setting up a production-ready monorepo from scratch using **Turborepo** and **PNPM Workspaces**.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Initial Setup](#initial-setup)
4. [Project Structure](#project-structure)
5. [Creating Component Packages](#creating-component-packages)
6. [Creating Applications](#creating-applications)
7. [Development Workflow](#development-workflow)
8. [Production Build](#production-build)
9. [Adding New Packages](#adding-new-packages)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)

## Overview

This monorepo architecture enables:
- **Multi-framework support**: Build components in Lit, Svelte, React, Vue, etc.
- **Shared dependencies**: Efficiently manage dependencies across packages
- **Build optimization**: Turborepo's intelligent caching and parallelization
- **Type safety**: Shared TypeScript configurations
- **Consistent tooling**: Unified scripts across all packages

## Prerequisites

Before starting, ensure you have:

- **Node.js** v18.0.0 or higher
- **PNPM** v9.0.0 or higher

Install PNPM globally:
```bash
npm install -g pnpm@9.12.1
```

Verify installation:
```bash
node --version  # Should be >= 18.0.0
pnpm --version  # Should be >= 9.0.0
```

## Initial Setup

### Step 1: Create Root Package Configuration

Create `package.json` in your project root:

```json
{
  "name": "@components/monorepo",
  "version": "1.0.0",
  "private": true,
  "description": "Multi-framework component library monorepo",
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "clean": "turbo run clean && rm -rf node_modules .turbo"
  },
  "devDependencies": {
    "turbo": "^2.1.3"
  },
  "packageManager": "pnpm@9.12.1",
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=9.0.0"
  }
}
```

### Step 2: Configure PNPM Workspace

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

This tells PNPM where to find workspace packages.

### Step 3: Configure Turborepo

Create `turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

**Key concepts:**
- `dependsOn: ["^build"]`: Build dependencies first
- `outputs`: Directories to cache
- `cache: false`: Disable caching for dev servers
- `persistent: true`: Keep process running

### Step 4: Shared TypeScript Configuration

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

### Step 5: Create .gitignore

```
# Dependencies
node_modules/

# Build outputs
dist/
build/
.turbo/
.svelte-kit/

# Environment
.env*.local

# IDE
.vscode/
.idea/
```

## Project Structure

```
monorepo/
├── apps/                    # Applications
│   └── angular-app/
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── packages/                # Shared packages
│   ├── lit-components/
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── svelte-components/
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── package.json             # Root config
├── pnpm-workspace.yaml      # Workspace definition
├── turbo.json               # Build pipeline
└── tsconfig.json            # Shared TS config
```

## Creating Component Packages

### Example: Lit Component Package

**1. Create directory structure:**
```bash
mkdir -p packages/lit-components/src
```

**2. Create `packages/lit-components/package.json`:**
```json
{
  "name": "@components/lit-components",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "lit": "^3.2.0"
  },
  "devDependencies": {
    "typescript": "^5.6.3"
  }
}
```

**3. Create `packages/lit-components/tsconfig.json`:**
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "experimentalDecorators": true,
    "useDefineForClassFields": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**4. Create component `packages/lit-components/src/my-button.ts`:**
```typescript
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-button')
export class MyButton extends LitElement {
  static styles = css`
    button { padding: 0.75rem 1.5rem; }
  `;

  @property({ type: String })
  label = 'Click me';

  render() {
    return html`<button>${this.label}</button>`;
  }
}
```

**5. Create index file `packages/lit-components/src/index.ts`:**
```typescript
export { MyButton } from './my-button.js';
```

### Example: Svelte Component Package

**1. Create directory:**
```bash
mkdir -p packages/svelte-components/src
```

**2. Create `packages/svelte-components/package.json`:**
```json
{
  "name": "@components/svelte-components",
  "version": "1.0.0",
  "type": "module",
  "svelte": "./dist/index.js",
  "exports": {
    ".": {
      "svelte": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "svelte-package -i src",
    "dev": "svelte-package -i src --watch",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "svelte": "^4.2.19"
  },
  "devDependencies": {
    "@sveltejs/package": "^2.3.5",
    "typescript": "^5.6.3"
  }
}
```

**3. Create component `packages/svelte-components/src/Button.svelte`:**
```svelte
<script lang="ts">
  export let label = 'Click me';
</script>

<button>{label}</button>

<style>
  button { padding: 0.75rem 1.5rem; }
</style>
```

## Creating Applications

### Example: Angular Application

**1. Create app using Angular CLI:**
```bash
cd apps
npx @angular/cli@latest new angular-app
```

**2. Update `apps/angular-app/package.json` to use workspace packages:**
```json
{
  "dependencies": {
    "@components/lit-components": "workspace:*",
    "@components/svelte-components": "workspace:*"
  }
}
```

**3. Use components in your app:**

For Lit (web components):
```typescript
// app.component.ts
import '@components/lit-components';

@Component({
  template: '<my-button label="Hello"></my-button>',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {}
```

## Development Workflow

### Install all dependencies
```bash
pnpm install
```

This installs dependencies for the root and all packages/apps.

### Build everything
```bash
pnpm build
```

Turborepo will:
1. Determine dependency graph
2. Build packages in correct order
3. Cache successful builds
4. Run builds in parallel when possible

### Run development servers
```bash
pnpm dev
```

This starts all dev servers simultaneously.

### Work on specific package
```bash
cd packages/lit-components
pnpm build
pnpm dev
```

### Run specific app
```bash
cd apps/angular-app
pnpm dev
```

## Production Build

### Build for production
```bash
pnpm build
```

### Build specific package
```bash
pnpm --filter @components/lit-components build
```

### Build specific app
```bash
pnpm --filter @apps/angular-app build
```

## Adding New Packages

### Add a new component library

**1. Create package directory:**
```bash
mkdir -p packages/react-components/src
```

**2. Create `package.json`:**
```json
{
  "name": "@components/react-components",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "react": "^18.0.0"
  }
}
```

**3. Install dependencies:**
```bash
pnpm install
```

PNPM automatically discovers the new package.

### Add a dependency to a package

From the root:
```bash
pnpm --filter @components/lit-components add lit-html
```

Or from the package directory:
```bash
cd packages/lit-components
pnpm add lit-html
```

### Link workspace packages

Use `workspace:*` protocol:
```json
{
  "dependencies": {
    "@components/lit-components": "workspace:*"
  }
}
```

## Best Practices

### 1. Use workspace protocol
Always reference workspace packages with `workspace:*`:
```json
"@components/my-package": "workspace:*"
```

### 2. Extend shared configs
Packages should extend root configs:
```json
{
  "extends": "../../tsconfig.json"
}
```

### 3. Keep packages focused
Each package should have a single responsibility.

### 4. Version independently
Don't couple package versions unless necessary.

### 5. Use consistent naming
- Packages: `@scope/package-name`
- Apps: `@apps/app-name`

### 6. Document packages
Each package should have a README with:
- Installation instructions
- Usage examples
- API documentation

### 7. Add build scripts
All packages should have:
- `build`: Production build
- `dev`: Development watch mode
- `clean`: Remove build artifacts

### 8. Cache strategically
Configure Turborepo outputs correctly:
```json
{
  "outputs": ["dist/**", "build/**"]
}
```

## Troubleshooting

### Clear all caches
```bash
pnpm clean
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Clear Turborepo cache only
```bash
rm -rf .turbo
```

### Reinstall specific package
```bash
pnpm --filter @components/lit-components install --force
```

### Check workspace structure
```bash
pnpm list --depth 0
```

### Debug Turborepo
```bash
pnpm build --dry-run  # Show what would run
pnpm build --graph    # Show dependency graph
```

### Common Issues

**Issue**: Package not found
```
Solution: Run `pnpm install` from root
```

**Issue**: Build fails with dependency errors
```
Solution: Check that dependencies built first
Add to turbo.json: "dependsOn": ["^build"]
```

**Issue**: Changes not picked up
```
Solution: Clear cache with `rm -rf .turbo`
```

## Next Steps

1. **Add linting**: Set up ESLint with shared configs
2. **Add testing**: Configure Vitest or Jest
3. **Add CI/CD**: Set up GitHub Actions with Turborepo
4. **Add versioning**: Use Changesets for releases
5. **Add documentation**: Set up Storybook or similar

## Resources

- [Turborepo Docs](https://turbo.build/repo/docs)
- [PNPM Workspaces](https://pnpm.io/workspaces)
- [Lit Documentation](https://lit.dev/)
- [Svelte Documentation](https://svelte.dev/)
- [Angular Documentation](https://angular.dev/)

## Summary

You now have a production-ready monorepo that:
- ✅ Supports multiple frameworks (Lit, Svelte, Angular, etc.)
- ✅ Uses PNPM for efficient dependency management
- ✅ Uses Turborepo for intelligent build caching
- ✅ Has proper TypeScript configuration
- ✅ Follows best practices for monorepo architecture

Happy coding! 🚀
