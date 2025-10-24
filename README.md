# Web Components Repository

A growing collection of reusable, framework-agnostic web components built with modern technologies. This monorepo leverages **Turborepo** and **PNPM Workspaces** to efficiently manage multiple web component packages.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PNPM](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)
[![Turborepo](https://img.shields.io/badge/built%20with-Turborepo-ef4444.svg)](https://turbo.build/repo)

## 🎨 Web Components

This repository contains a collection of web components that can be used in any JavaScript framework or vanilla JavaScript. Currently available:

- **[@banegasn/m3-navigation-rail](packages/m3-navigation-rail)** - Material Design 3 Navigation Rail component with collapsible functionality

> 🚀 **More components coming soon!** This repository will grow to include various web components for different use cases, not limited to Material Design 3.

## 📚 Documentation

- **[Setup Guide](SETUP_GUIDE.md)** - Complete step-by-step guide for building this monorepo from scratch
- **[Architecture](ARCHITECTURE.md)** - Detailed architecture documentation and design decisions
- **[Publishing Guide](PUBLISHING.md)** - How to publish web component packages
- **[Web Components](#-web-components)** - List of available components
- **[Component Packages](#-demo-applications)** - Individual package documentation

## 🌐 Live Demo

The Angular demo app is automatically deployed to GitHub Pages:
**[https://banegasn.github.io/components/](https://banegasn.github.io/components/)**

Every push to the `main` branch triggers an automatic deployment.

## 🏗️ Architecture

This monorepo is designed for building and distributing web components:
- **Framework-agnostic components**: Built with Lit, Svelte, and other modern web component technologies
- **Universal compatibility**: Components work in any JavaScript framework (Angular, React, Vue, etc.) or vanilla JavaScript
- **Efficient builds**: Turborepo for intelligent build caching and parallelization
- **Workspace management**: PNPM for fast, disk-efficient dependency management
- **Demo applications**: Example apps showcasing component usage in different frameworks

## 📁 Project Structure

```
.
├── apps/                     # Demo applications
│   └── angular-app/          # Angular demo showcasing web components
├── packages/                 # Web component packages
│   └─ m3-navigation-rail/    # Material Design 3 Navigation Rail
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

## 🎯 Demo Applications

### angular-app

A demonstration Angular application showcasing how to use the web components in a real-world application.

**Features:**
- Angular 18 with standalone components
- Live examples of all available web components
- Integration patterns and best practices
- Deployed to GitHub Pages for live preview

**Run:**
```bash
cd apps/angular-app
pnpm dev
```

> 💡 **Note:** More demo apps (React, Vue, vanilla JS) may be added in the future to demonstrate cross-framework compatibility.

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

## 📝 Adding New Web Components

### Add a new component package:

1. Create package directory:
```bash
mkdir -p packages/my-web-component/src
```

2. Create `package.json`:
```json
{
  "name": "@banegasn/my-web-component",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

3. Create your web component using Lit, Svelte, or vanilla JavaScript

4. Install dependencies from root:
```bash
pnpm install
```

### Add a new demo app:

1. Create app directory:
```bash
mkdir -p apps/my-demo-app
```

2. Set up your framework (React, Vue, etc.)

3. Add workspace dependencies in `package.json`:
```json
{
  "dependencies": {
    "@banegasn/lit-components": "workspace:*",
    "@banegasn/m3-navigation-rail": "workspace:*"
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

## 📤 Publishing Web Components

To publish web component packages to GitHub Packages (or npm):

```bash
# Bump version
pnpm version:patch  # or version:minor, version:major

# Publish all packages
pnpm publish:packages
```

All web components are published as individual npm packages that can be installed and used in any project.

See [PUBLISHING.md](PUBLISHING.md) for detailed publishing instructions and GitHub Actions setup.

## 📚 Best Practices for Web Components

1. **Framework-agnostic**: Design components to work in any framework or vanilla JavaScript
2. **Use workspace protocol**: Reference workspace packages with `workspace:*`
3. **Shared configs**: Extend root `tsconfig.json` for consistency
4. **Custom elements**: Follow web component standards and naming conventions (kebab-case)
5. **Semantic versioning**: Version packages independently
6. **Documentation**: Keep README files updated in each package with usage examples
7. **Accessibility**: Ensure components follow WCAG guidelines and support keyboard navigation

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

### Web Components
- [Web Components Standards](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Lit Documentation](https://lit.dev/)
- [Svelte Documentation](https://svelte.dev/)
- [Material Design 3](https://m3.material.io/)

### Monorepo Tools
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [PNPM Workspaces](https://pnpm.io/workspaces)

### Framework Integration
- [Angular Documentation](https://angular.dev/)
- [Using Web Components in React](https://react.dev/reference/react-dom/components#custom-html-elements)
- [Using Web Components in Vue](https://vuejs.org/guide/extras/web-components.html)

## 🤝 Contributing

1. Create a new branch
2. Make your changes
3. Run `pnpm build` and `pnpm test`
4. Submit a pull request

## 📄 License

MIT
