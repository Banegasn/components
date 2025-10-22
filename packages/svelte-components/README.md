# @components/svelte-components

Svelte-based component library.

## Components

### SvelteButton

A customizable button component built with Svelte.

#### Usage

```svelte
<script>
  import { SvelteButton } from '@components/svelte-components';
</script>

<SvelteButton label="Click me" on:svelte-button-click={handleClick} />
```

#### Props

- `label` (string): Button text (default: 'Click me')
- `disabled` (boolean): Disable the button (default: false)

#### Events

- `svelte-button-click`: Fired when button is clicked
