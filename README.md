# Multi-Framework Component Library Monorepo

A production-ready monorepo demonstrating how to build and manage a multi-framework component library using **Turborepo** and **PNPM Workspaces**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PNPM](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)
[![Turborepo](https://img.shields.io/badge/built%20with-Turborepo-ef4444.svg)](https://turbo.build/repo)

## 📚 Documentation

- **[Setup Guide](SETUP_GUIDE.md)** - Complete step-by-step guide for building this monorepo from scratch
- **[Architecture](ARCHITECTURE.md)** - Detailed architecture documentation and design decisions
- **[Publishing Guide](PUBLISHING.md)** - How to publish packages to GitHub Packages
- **[GitHub Pages Setup](GITHUB_PAGES_SETUP.md)** - How to deploy the Angular app to GitHub Pages
- **[API Documentation](#packages)** - Component library API references

## 🌐 Live Demo

The Angular demo app is automatically deployed to GitHub Pages:
**[https://banegasn.github.io/components/](https://banegasn.github.io/components/)**

Every push to the `main` branch triggers an automatic deployment.

## 🏗️ Architecture

This monorepo supports:
- **Multiple component frameworks**: Lit (web components) and Svelte
- **Multiple application frameworks**: Angular (with support for React, Vue, etc.)
- **Efficient builds**: Turborepo for intelligent build caching and parallelization
- **Workspace management**: PNPM for fast, disk-efficient dependency management

## 📁 Project Structure

```
.
├── apps/
│   └── angular-app/          # Angular application example
├── packages/
│   ├── lit-components/       # Lit-based web components
│   └── svelte-components/    # Svelte components
├── package.json              # Root package.json
├── pnpm-workspace.yaml       # PNPM workspace configuration
├── turbo.json                # Turborepo configuration
└── tsconfig.json             # Shared TypeScript config
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **PNPM** >= 9.0.0

Install PNPM if you haven't already:
```bash
npm install -g pnpm@9.12.1
```

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd components

# Install dependencies
pnpm install

# Build all packages and apps
pnpm build

# Run development servers
pnpm dev
```

## 🛠️ Development

### Build Commands

```bash
# Build all packages and apps
pnpm build

# Build specific package
pnpm --filter @banegasn/lit-components build

# Build specific app
pnpm --filter angular-app build
```

### Development Commands

```bash
# Run all dev servers
pnpm dev

# Run specific package in dev mode
cd packages/lit-components
pnpm dev

# Run specific app
cd apps/angular-app
pnpm dev
```

The Angular app will be available at `http://localhost:4200`

### Other Commands

```bash
# Run linters
pnpm lint

# Run tests
pnpm test

# Clean all build artifacts
pnpm clean
```

## 📦 Packages

### @banegasn/lit-components

Web components built with Lit Element.

**Features:**
- TypeScript support
- Decorator-based syntax
- Shadow DOM encapsulation
- Framework-agnostic (works everywhere)

**Installation:**
```bash
npm install @banegasn/lit-components
```

**Usage:**
```typescript
import '@banegasn/lit-components';

// In HTML
<lit-button label="Click me"></lit-button>
```

See [packages/lit-components/README.md](packages/lit-components/README.md) for details.

### @banegasn/svelte-components

Svelte components for modern web applications.

**Features:**
- Reactive by default
- Minimal bundle size
- Scoped CSS
- TypeScript support

**Installation:**
```bash
npm install @banegasn/svelte-components
```

**Usage:**
```svelte
<script>
  import { SvelteButton } from '@banegasn/svelte-components';
</script>

<SvelteButton label="Click me" on:svelte-button-click={handleClick} />
```

See [packages/svelte-components/README.md](packages/svelte-components/README.md) for details.

## 🎯 Apps

### angular-app

A demonstration Angular application that consumes the component libraries.

**Features:**
- Angular 18
- Standalone components
- Integration with Lit web components
- Modern build configuration

**Run:**
```bash
cd apps/angular-app
pnpm dev
```

## 🔧 Turborepo Configuration

The `turbo.json` file defines the build pipeline:

- **build**: Builds all packages with dependency awareness
- **dev**: Runs all development servers
- **lint**: Runs linters across the monorepo
- **test**: Runs tests with proper dependencies
- **clean**: Cleans build artifacts

### Key Features:
- **Caching**: Turborepo caches build outputs for faster rebuilds
- **Parallelization**: Runs independent tasks in parallel
- **Dependency graph**: Ensures packages build in the correct order

## 📝 Adding New Packages

### Add a new component library:

1. Create package directory:
```bash
mkdir -p packages/my-components/src
```

2. Create `package.json`:
```json
{
  "name": "@banegasn/my-components",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

3. Install dependencies from root:
```bash
pnpm install
```

### Add a new app:

1. Create app directory:
```bash
mkdir -p apps/my-app
```

2. Set up your framework (React, Vue, etc.)

3. Add workspace dependencies in `package.json`:
```json
{
  "dependencies": {
    "@banegasn/lit-components": "workspace:*"
  }
}
```

See the [Setup Guide](SETUP_GUIDE.md) for detailed instructions.

## 🧪 Testing

Add test scripts to individual packages:

```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

Run all tests:
```bash
pnpm test
```

## 🚢 Building for Production

### Build all packages and apps:
```bash
pnpm build
```

Turborepo will:
1. Build packages in dependency order
2. Cache successful builds
3. Only rebuild what changed

### Build for GitHub Pages:
```bash
pnpm build:gh-pages
```

This builds all packages and the Angular app optimized for GitHub Pages deployment with the correct base href (`/components/`).

See [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md) for deployment details.

## 📤 Publishing Packages

To publish packages to GitHub Packages:

```bash
# Bump version
pnpm version:patch  # or version:minor, version:major

# Publish all packages
pnpm publish:packages
```

See [PUBLISHING.md](PUBLISHING.md) for detailed publishing instructions and GitHub Actions setup.

## 📚 Best Practices

1. **Use workspace protocol**: Reference workspace packages with `workspace:*`
2. **Shared configs**: Extend root `tsconfig.json` for consistency
3. **Atomic commits**: Keep packages and apps loosely coupled
4. **Semantic versioning**: Version packages independently
5. **Documentation**: Keep README files updated in each package

## 🔍 Troubleshooting

### Clear all caches:
```bash
pnpm clean
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Clear Turborepo cache:
```bash
rm -rf .turbo
```

### Reinstall dependencies:
```bash
pnpm install --force
```

See [SETUP_GUIDE.md](SETUP_GUIDE.md#troubleshooting) for more troubleshooting tips.

## 📖 Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [PNPM Workspaces](https://pnpm.io/workspaces)
- [Lit Documentation](https://lit.dev/)
- [Svelte Documentation](https://svelte.dev/)
- [Angular Documentation](https://angular.dev/)

## 🤝 Contributing

1. Create a new branch
2. Make your changes
3. Run `pnpm build` and `pnpm test`
4. Submit a pull request

## 📄 License

MIT

---

**Built with ❤️ using Turborepo and PNPM**