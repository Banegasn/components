# @banegasn/m3-button

Material Design 3 button web component built with Lit, featuring expressive styling and full accessibility support.

## Features

- ✅ **5 Button Variants**: Filled, Elevated, Tonal, Outlined, and Text
- ♿ **Fully Accessible**: WCAG 2.1 compliant with ARIA support and keyboard navigation
- 🎨 **Material Design 3**: Follows official M3 specifications and design tokens
- 🔄 **Loading State**: Built-in loading spinner with proper ARIA attributes
- 📱 **Touch-friendly**: 48x48px minimum touch target
- 🎯 **Icon Support**: Optional leading icons with proper spacing
- 🌐 **Framework-agnostic**: Works with React, Angular, Vue, or vanilla JavaScript
- 🎭 **Customizable**: CSS custom properties for theming

## Installation

```bash
npm install @banegasn/m3-button
```

## Quick Start

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import '@banegasn/m3-button';
  </script>
</head>
<body>
  <m3-button>Click me</m3-button>
</body>
</html>
```

## Button Variants

Material Design 3 provides five button types for different emphasis levels:

### Filled Button (Default)

The highest emphasis button for primary actions.

```html
<m3-button variant="filled">Filled Button</m3-button>
<!-- or simply -->
<m3-button>Filled Button</m3-button>
```

### Elevated Button

Medium-high emphasis with subtle elevation shadow.

```html
<m3-button variant="elevated">Elevated Button</m3-button>
```

### Tonal Button

Medium emphasis with tinted background.

```html
<m3-button variant="tonal">Tonal Button</m3-button>
```

### Outlined Button

Medium emphasis with border outline.

```html
<m3-button variant="outlined">Outlined Button</m3-button>
```

### Text Button

Low emphasis for less important actions.

```html
<m3-button variant="text">Text Button</m3-button>
```

## Usage Examples

### With Icon

Add an icon using the `icon` slot:

```html
<m3-button>
  <svg slot="icon" viewBox="0 0 24 24" width="18" height="18">
    <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
  Add Item
</m3-button>
```

### Icon-Only Button

For buttons with only an icon (requires `aria-label` for accessibility):

```html
<m3-button icon-only aria-label="Add item">
  <svg slot="icon" viewBox="0 0 24 24" width="18" height="18">
    <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
</m3-button>
```

### Loading State

Show loading spinner while processing:

```html
<m3-button id="submit-btn">Submit</m3-button>

<script>
  const btn = document.getElementById('submit-btn');
  btn.addEventListener('button-click', async () => {
    btn.loading = true;
    try {
      await submitForm();
    } finally {
      btn.loading = false;
    }
  });
</script>
```

### Disabled State

```html
<m3-button disabled>Disabled Button</m3-button>
```

### Full Width

```html
<m3-button full-width>Full Width Button</m3-button>
```

### Form Integration

```html
<form id="my-form">
  <input type="text" name="username" required />
  <m3-button type="submit" form="my-form">Submit</m3-button>
  <m3-button type="reset" variant="text">Reset</m3-button>
</form>
```

## API Reference

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `'filled' \| 'elevated' \| 'tonal' \| 'outlined' \| 'text'` | `'filled'` | Button style variant |
| `disabled` | `boolean` | `false` | Disables the button |
| `loading` | `boolean` | `false` | Shows loading spinner and disables interaction |
| `full-width` | `boolean` | `false` | Makes button full width |
| `icon-only` | `boolean` | `false` | Button contains only an icon (hides label) |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Button type for form handling |
| `aria-label` | `string` | `undefined` | Accessible label (required for icon-only) |
| `name` | `string` | `undefined` | Name for form submission |
| `value` | `string` | `undefined` | Value for form submission |
| `form` | `string` | `undefined` | Associates button with a form by ID |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `button-click` | `{ variant: string, name?: string, value?: string }` | Fired when button is clicked (not fired when disabled or loading) |

### Slots

| Slot | Description |
|------|-------------|
| (default) | Button label text |
| `icon` | Optional icon (18x18px recommended) |

### Methods

| Method | Description |
|--------|-------------|
| `focus()` | Programmatically focus the button |
| `blur()` | Remove focus from the button |

### CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--md-button-container-height` | `40px` | Height of the button |
| `--md-button-container-shape` | `20px` | Border radius |
| `--md-button-label-text-size` | `14px` | Font size of label |
| `--md-button-label-text-weight` | `500` | Font weight of label |
| `--md-button-icon-size` | `18px` | Size of the icon |
| `--md-button-spacing` | `24px` | Horizontal padding |
| `--md-sys-color-primary` | `#6750a4` | Primary color |
| `--md-sys-color-on-primary` | `#ffffff` | Text color on primary |
| `--md-sys-color-secondary-container` | `#e8def8` | Secondary container color |
| `--md-sys-color-on-secondary-container` | `#1d192b` | Text on secondary container |
| `--md-sys-color-surface-container-low` | `#f7f2fa` | Surface color for elevated |
| `--md-sys-color-outline` | `#79747e` | Border color for outlined |

## Accessibility

This component follows WCAG 2.1 Level AA guidelines and Material Design 3 accessibility standards:

### Keyboard Support

- **Enter/Space**: Activates the button
- **Tab**: Moves focus to/from the button
- Focus indicator visible via `:focus-visible`

### Screen Reader Support

- Proper button role and label
- Loading state announced via `aria-busy`
- Disabled state properly conveyed
- Icon-only buttons require `aria-label`

### Touch Targets

- Minimum 48x48px touch target (includes invisible padding)
- Visual feedback on hover and press states
- No pointer events when disabled

### Best Practices

```html
<!-- ✅ Good: Icon-only with aria-label -->
<m3-button icon-only aria-label="Close dialog">
  <svg slot="icon">...</svg>
</m3-button>

<!-- ❌ Bad: Icon-only without aria-label -->
<m3-button icon-only>
  <svg slot="icon">...</svg>
</m3-button>

<!-- ✅ Good: Descriptive text -->
<m3-button>Delete item</m3-button>

<!-- ❌ Bad: Ambiguous text -->
<m3-button>Click here</m3-button>
```

## Theming

Customize the button appearance with CSS custom properties:

```css
/* Global theme */
:root {
  --md-sys-color-primary: #0066cc;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-secondary-container: #d6e3ff;
  --md-sys-color-on-secondary-container: #001a41;
}

/* Per-component customization */
m3-button {
  --md-button-container-height: 48px;
  --md-button-container-shape: 24px;
  --md-button-label-text-size: 16px;
}

/* Specific instance */
m3-button.large {
  --md-button-container-height: 56px;
  --md-button-spacing: 32px;
}
```

## Examples by Framework

### Vanilla JavaScript

```html
<m3-button id="my-btn">Click me</m3-button>

<script type="module">
  import '@banegasn/m3-button';
  
  const btn = document.getElementById('my-btn');
  btn.addEventListener('button-click', (e) => {
    console.log('Button clicked!', e.detail);
  });
</script>
```

### React

```jsx
import '@banegasn/m3-button';

function App() {
  const handleClick = (e) => {
    console.log('Clicked!', e.detail);
  };

  return (
    <m3-button 
      variant="filled"
      onbutton-click={handleClick}
    >
      Click me
    </m3-button>
  );
}
```

### Angular

```typescript
// app.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@banegasn/m3-button';

@Component({
  selector: 'app-root',
  template: `
    <m3-button 
      variant="filled"
      (button-click)="handleClick($event)"
    >
      Click me
    </m3-button>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  handleClick(event: CustomEvent) {
    console.log('Clicked!', event.detail);
  }
}
```

### Vue

```vue
<template>
  <m3-button 
    variant="filled"
    @button-click="handleClick"
  >
    Click me
  </m3-button>
</template>

<script setup>
import '@banegasn/m3-button';

const handleClick = (event) => {
  console.log('Clicked!', event.detail);
};
</script>
```

### Svelte

```svelte
<script>
  import '@banegasn/m3-button';
  
  function handleClick(event) {
    console.log('Clicked!', event.detail);
  }
</script>

<m3-button 
  variant="filled"
  on:button-click={handleClick}
>
  Click me
</m3-button>
```

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>M3 Button Demo</title>
  <style>
    body {
      font-family: Roboto, system-ui, sans-serif;
      padding: 24px;
      background: #fef7ff;
    }
    
    .demo-section {
      margin-bottom: 32px;
    }
    
    .button-group {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      align-items: center;
    }
    
    h2 {
      margin-bottom: 16px;
      color: #1d1b20;
    }
  </style>
  <script type="module">
    import '@banegasn/m3-button';
  </script>
</head>
<body>
  <h1>Material Design 3 Button Demo</h1>

  <div class="demo-section">
    <h2>Button Variants</h2>
    <div class="button-group">
      <m3-button variant="filled">Filled</m3-button>
      <m3-button variant="elevated">Elevated</m3-button>
      <m3-button variant="tonal">Tonal</m3-button>
      <m3-button variant="outlined">Outlined</m3-button>
      <m3-button variant="text">Text</m3-button>
    </div>
  </div>

  <div class="demo-section">
    <h2>With Icons</h2>
    <div class="button-group">
      <m3-button variant="filled">
        <svg slot="icon" viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        Add Item
      </m3-button>
      
      <m3-button variant="elevated">
        <svg slot="icon" viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
        </svg>
        Confirm
      </m3-button>
    </div>
  </div>

  <div class="demo-section">
    <h2>Icon-Only Buttons</h2>
    <div class="button-group">
      <m3-button icon-only aria-label="Add" variant="filled">
        <svg slot="icon" viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
      </m3-button>
      
      <m3-button icon-only aria-label="Edit" variant="tonal">
        <svg slot="icon" viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
      </m3-button>
    </div>
  </div>

  <div class="demo-section">
    <h2>States</h2>
    <div class="button-group">
      <m3-button disabled>Disabled</m3-button>
      <m3-button id="loading-btn">Loading Demo</m3-button>
    </div>
  </div>

  <div class="demo-section">
    <h2>Full Width</h2>
    <m3-button full-width variant="filled">Full Width Button</m3-button>
  </div>

  <script>
    // Add click handlers
    document.querySelectorAll('m3-button').forEach(btn => {
      btn.addEventListener('button-click', (e) => {
        console.log('Button clicked:', e.detail);
      });
    });

    // Loading demo
    const loadingBtn = document.getElementById('loading-btn');
    loadingBtn.addEventListener('button-click', async () => {
      loadingBtn.loading = true;
      await new Promise(resolve => setTimeout(resolve, 2000));
      loadingBtn.loading = false;
    });
  </script>
</body>
</html>
```

## Browser Support

Works in all modern browsers that support:
- Web Components (Custom Elements v1)
- Shadow DOM v1
- ES Modules

## Design Resources

- [Material Design 3 Button Guidelines](https://m3.material.io/components/buttons/overview)
- [Button Specifications](https://m3.material.io/components/buttons/specs)
- [Accessibility Guidelines](https://m3.material.io/components/buttons/accessibility)

## Related Components

- [@banegasn/m3-navigation-rail](https://www.npmjs.com/package/@banegasn/m3-navigation-rail) - Material Design 3 Navigation Rail

## License

MIT

## Repository

[https://github.com/banegasn/components](https://github.com/banegasn/components)

