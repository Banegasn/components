# Multi-Framework Component Library Monorepo

A production-ready monorepo demonstrating how to build and manage a multi-framework component library using **Turborepo** and **PNPM Workspaces**.

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
│       ├── src/
│       ├── angular.json
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── lit-components/       # Lit-based web components
│   │   ├── src/
│   │   │   ├── lit-button.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── svelte-components/    # Svelte components
│       ├── src/
│       │   ├── SvelteButton.svelte
│       │   └── index.js
│       ├── package.json
│       └── svelte.config.js
├── package.json              # Root package.json
├── pnpm-workspace.yaml       # PNPM workspace configuration
├── turbo.json                # Turborepo configuration
└── tsconfig.json             # Shared TypeScript config
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **PNPM** >= 9.0.0

Install PNPM if you haven't already:
```bash
npm install -g pnpm@9.12.1
```

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd components
```

2. Install dependencies:
```bash
pnpm install
```

This will install dependencies for all packages and apps in the workspace.

## 🛠️ Development

### Build all packages and apps
```bash
pnpm build
```

### Run development servers
```bash
pnpm dev
```

This will start all development servers in parallel using Turborepo.

### Build specific package
```bash
cd packages/lit-components
pnpm build
```

### Run Angular app
```bash
cd apps/angular-app
pnpm dev
```

The Angular app will be available at `http://localhost:4200`

## 📦 Packages

### @components/lit-components

Web components built with Lit Element.

**Features:**
- TypeScript support
- Decorator-based syntax
- Shadow DOM encapsulation
- Framework-agnostic (works everywhere)

**Usage:**
```typescript
import '@components/lit-components';

// In HTML
<lit-button label="Click me"></lit-button>
```

See [packages/lit-components/README.md](packages/lit-components/README.md) for details.

### @components/svelte-components

Svelte components for modern web applications.

**Features:**
- Reactive by default
- Minimal bundle size
- Scoped CSS
- TypeScript support

**Usage:**
```svelte
<script>
  import { SvelteButton } from '@components/svelte-components';
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
  "name": "@components/my-components",
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
    "@components/lit-components": "workspace:*"
  }
}
```

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

Build all packages and apps:
```bash
pnpm build
```

Turborepo will:
1. Build packages in dependency order
2. Cache successful builds
3. Only rebuild what changed

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
rm -rf node_modules
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