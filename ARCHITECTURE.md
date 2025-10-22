# Architecture Documentation

## Monorepo Architecture Overview

This document describes the architecture and design decisions for the multi-framework component library monorepo.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Turborepo Manager                        │
│  (Build orchestration, caching, task scheduling)            │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼────────┐       ┌───────▼────────┐
│   Packages     │       │      Apps      │
│   (Libraries)  │       │ (Applications) │
└───────┬────────┘       └───────┬────────┘
        │                        │
   ┌────┴─────┐            ┌─────┴──────┐
   │          │            │            │
┌──▼──┐   ┌──▼──┐      ┌──▼──┐     ┌───▼───┐
│ Lit │   │Svelt│      │Angul│     │React/ │
│Comp │   │ Comp│      │ App │     │Vue App│
└─────┘   └─────┘      └─────┘     └───────┘
```

## Directory Structure

```
components/                          # Monorepo root
│
├── apps/                            # Application layer
│   └── angular-app/                 # Angular demo application
│       ├── src/
│       │   ├── app/                 # Angular components
│       │   │   ├── app.component.ts
│       │   │   ├── app.component.html
│       │   │   └── app.config.ts
│       │   ├── index.html           # HTML entry
│       │   ├── main.ts              # Bootstrap
│       │   └── styles.css           # Global styles
│       ├── angular.json             # Angular CLI config
│       ├── package.json             # App dependencies
│       └── tsconfig.json            # App TS config
│
├── packages/                        # Package layer
│   ├── lit-components/              # Lit web components
│   │   ├── src/
│   │   │   ├── lit-button.ts        # Component implementation
│   │   │   └── index.ts             # Package exports
│   │   ├── dist/                    # Build output (gitignored)
│   │   ├── package.json             # Package config
│   │   ├── tsconfig.json            # Package TS config
│   │   └── README.md                # Package docs
│   │
│   └── svelte-components/           # Svelte components
│       ├── src/
│       │   ├── SvelteButton.svelte  # Component implementation
│       │   └── index.js             # Package exports
│       ├── dist/                    # Build output (gitignored)
│       ├── package.json             # Package config
│       ├── tsconfig.json            # Package TS config
│       └── README.md                # Package docs
│
├── package.json                     # Root package config
├── pnpm-workspace.yaml              # Workspace definition
├── turbo.json                       # Turborepo config
├── tsconfig.json                    # Base TS config
├── .gitignore                       # Git ignore rules
├── README.md                        # Project overview
├── SETUP_GUIDE.md                   # Setup instructions
└── ARCHITECTURE.md                  # This file
```

## Technology Stack

### Build Tools
- **Turborepo**: Task orchestration and caching
- **PNPM**: Fast, efficient package manager with workspace support
- **TypeScript**: Type safety across all packages

### Component Frameworks
- **Lit**: Lightweight web components using native Custom Elements
- **Svelte**: Compiled components with minimal runtime
- **Angular**: Full-featured framework (in apps)

### Build Outputs
- **Lit**: Compiled to ES modules with TypeScript declarations
- **Svelte**: Packaged using @sveltejs/package
- **Angular**: Built with Angular CLI

## Dependency Graph

```
┌─────────────────────┐
│  @apps/angular-app  │
└──────────┬──────────┘
           │
           ├─────────────────────┐
           │                     │
┌──────────▼──────────┐  ┌───────▼────────────┐
│@components/         │  │@components/        │
│  lit-components     │  │ svelte-components  │
└─────────────────────┘  └────────────────────┘
```

## Build Pipeline

### Turborepo Task Pipeline

```
┌─────────────────────────────────────────────┐
│              turbo run build                │
└──────────────────┬──────────────────────────┘
                   │
    ┌──────────────┴──────────────┐
    │                             │
┌───▼───────────────┐  ┌──────────▼──────────┐
│ Build Lit Package │  │ Build Svelte Package│
└───────────────────┘  └─────────────────────┘
    │                             │
    └──────────────┬──────────────┘
                   │
         ┌─────────▼─────────┐
         │ Build Angular App │
         └───────────────────┘
```

**Key Features:**
- **Dependency awareness**: Packages build before apps
- **Parallel execution**: Independent tasks run simultaneously
- **Caching**: Successful builds are cached
- **Incremental builds**: Only changed packages rebuild

## Package Design Patterns

### Lit Components (Web Components)

**Pattern**: Custom Elements v1
**Build**: TypeScript → ES Modules
**Distribution**: NPM package

```typescript
// Definition
@customElement('lit-button')
export class LitButton extends LitElement {
  @property() label = 'Click';
  render() {
    return html`<button>${this.label}</button>`;
  }
}

// Usage (framework-agnostic)
<lit-button label="Hello"></lit-button>
```

**Advantages:**
- Framework agnostic
- Native browser support
- Shadow DOM encapsulation
- No runtime required

### Svelte Components

**Pattern**: Single-file components
**Build**: Svelte compiler → Optimized JS
**Distribution**: NPM package with .svelte files

```svelte
<!-- Definition -->
<script lang="ts">
  export let label = 'Click';
</script>
<button>{label}</button>

<!-- Usage (in Svelte apps) -->
<SvelteButton label="Hello" />
```

**Advantages:**
- No virtual DOM
- Minimal runtime
- Reactive by default
- Scoped CSS

## Workspace Configuration

### PNPM Workspace Strategy

```yaml
packages:
  - 'packages/*'  # All component libraries
  - 'apps/*'      # All applications
```

**Benefits:**
- Single lock file for entire monorepo
- Shared dependencies hoisted to root
- Symlinked workspace packages
- Fast, efficient installs

### Dependency Management

**Workspace Dependencies:**
```json
{
  "dependencies": {
    "@components/lit-components": "workspace:*"
  }
}
```

The `workspace:*` protocol ensures:
- Always uses local version
- No version conflicts
- Fast development iteration

## Build Optimization

### Turborepo Caching Strategy

**Cache Keys:**
- Source files hash
- Dependencies hash
- Environment variables
- Build script

**Cache Outputs:**
- `dist/` directories
- `build/` directories
- Type declarations

**Cache Behavior:**
```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    }
  }
}
```

### Development vs Production

**Development:**
- Watch mode enabled
- No caching for dev servers
- Fast rebuilds
- Source maps enabled

**Production:**
- Optimized builds
- Minification
- Tree shaking
- Cache everything

## TypeScript Configuration

### Configuration Hierarchy

```
tsconfig.json (root)
    ├── packages/lit-components/tsconfig.json
    ├── packages/svelte-components/tsconfig.json
    └── apps/angular-app/tsconfig.json
```

**Root config** provides:
- Shared compiler options
- Common paths
- Base strictness settings

**Package configs** extend and customize:
- Output directories
- Module resolution
- Framework-specific options

## Integration Patterns

### Lit Components in Angular

```typescript
// 1. Import component package
import '@components/lit-components';

// 2. Enable custom elements
@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

// 3. Use in template
template: '<lit-button label="Click"></lit-button>'
```

### Svelte Components in Svelte Apps

```svelte
<script>
  // Direct import from workspace package
  import { SvelteButton } from '@components/svelte-components';
</script>

<SvelteButton label="Click" />
```

### Potential: React Integration

```typescript
// Lit components work as-is
import '@components/lit-components';
<lit-button label="Click" />

// Svelte via wrapper or web component build
```

## Scalability Considerations

### Adding New Frameworks

**Steps:**
1. Create package directory in `packages/`
2. Add `package.json` with build scripts
3. Implement components
4. Export via index file

**Supported frameworks:**
- ✅ Lit (implemented)
- ✅ Svelte (implemented)
- 🔄 React (add as needed)
- 🔄 Vue (add as needed)
- 🔄 Web Components (vanilla)

### Adding New Apps

**Steps:**
1. Create app directory in `apps/`
2. Use framework CLI (Angular, Next.js, etc.)
3. Add workspace dependencies
4. Configure build in `turbo.json`

## Performance Characteristics

### Build Times (Initial)

- **Lit components**: ~1-2 seconds
- **Svelte components**: ~1-2 seconds
- **Angular app**: ~7-8 seconds
- **Total (clean)**: ~10-12 seconds

### Build Times (Cached)

- **No changes**: ~100ms (cache hit)
- **Single package change**: ~1-2 seconds
- **App change only**: ~7-8 seconds

### Bundle Sizes

- **Lit button component**: ~2KB (gzipped)
- **Svelte button component**: ~1KB (gzipped)
- **Angular app**: ~70KB (initial bundle, gzipped)

## Security Considerations

### Dependency Management
- Use exact versions in lock file
- Regular dependency updates
- Automated vulnerability scanning

### Build Artifacts
- Exclude from version control
- Clean builds in CI/CD
- No secrets in source code

### Package Publishing
- Scope packages to organization
- Use provenance
- Sign releases

## Future Enhancements

### Planned
- [ ] Shared ESLint configuration
- [ ] Shared testing setup (Vitest)
- [ ] Storybook for component documentation
- [ ] Changesets for versioning
- [ ] GitHub Actions CI/CD
- [ ] Automated dependency updates (Renovate)

### Under Consideration
- [ ] React component library
- [ ] Vue component library
- [ ] Shared design tokens
- [ ] Visual regression testing
- [ ] Performance monitoring

## References

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [PNPM Workspaces Guide](https://pnpm.io/workspaces)
- [Lit Framework Docs](https://lit.dev/)
- [Svelte Documentation](https://svelte.dev/)
- [Angular Best Practices](https://angular.dev/best-practices)

## Maintenance

**Last Updated**: 2025-10-22
**Maintainer**: Development Team
**Review Schedule**: Quarterly
