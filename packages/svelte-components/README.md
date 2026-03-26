# @banegasn/svelte-components

> Svelte component library — part of the Material Web Components monorepo.

[![npm version](https://img.shields.io/npm/v/@banegasn/svelte-components.svg)](https://www.npmjs.com/package/@banegasn/svelte-components)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

A collection of reusable **Svelte components** built as part of the [banegasn/components](https://github.com/banegasn/components) monorepo. Designed to complement the Material Design 3 web component packages with native Svelte implementations.

## Installation

```bash
npm install @banegasn/svelte-components
# or
pnpm add @banegasn/svelte-components
# or
yarn add @banegasn/svelte-components
```

> Requires Svelte 4+.

## Components

### SvelteButton

A customizable button component built natively with Svelte.

```svelte
<script>
  import { SvelteButton } from '@banegasn/svelte-components';

  function handleClick(event) {
    console.log('Button clicked!', event.detail);
  }
</script>

<SvelteButton label="Click me" on:svelte-button-click={handleClick} />
<SvelteButton label="Disabled" disabled />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `'Click me'` | Button label text |
| `disabled` | `boolean` | `false` | Disables the button |

#### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `svelte-button-click` | `{}` | Fired when the button is clicked |

## Usage in SvelteKit

```svelte
<!-- src/routes/+page.svelte -->
<script>
  import { SvelteButton } from '@banegasn/svelte-components';

  let count = 0;
</script>

<SvelteButton label="Clicked {count} times" on:svelte-button-click={() => count++} />
```

## Related Packages

The monorepo also includes framework-agnostic Material Design 3 web components:

- [@banegasn/m3-button](https://www.npmjs.com/package/@banegasn/m3-button)
- [@banegasn/m3-card](https://www.npmjs.com/package/@banegasn/m3-card)
- [@banegasn/m3-navigation-rail](https://www.npmjs.com/package/@banegasn/m3-navigation-rail)

## Resources

- [Svelte Documentation](https://svelte.dev/)
- [GitHub Repository](https://github.com/banegasn/components)

## License

MIT
