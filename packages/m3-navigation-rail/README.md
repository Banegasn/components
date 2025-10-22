# @banegasn/m3-navigation-rail

Material Design 3 (M3) Navigation Rail web components built with Lit.

A navigation rail is a compact, vertical navigation component that provides quick access to top-level destinations in an app. It can expand to show labels alongside icons for better clarity.

## Installation

```bash
npm install @banegasn/m3-navigation-rail
```

## Components

This package includes three components:

- `m3-navigation-rail` - The main container for navigation items
- `m3-navigation-rail-item` - Individual navigation items with icons and labels
- `m3-navigation-rail-toggle` - A toggle button to expand/collapse the rail

## Usage

### Basic Example

```html
<m3-navigation-rail>
  <m3-navigation-rail-toggle></m3-navigation-rail-toggle>
  
  <m3-navigation-rail-item label="Home" active>
    <svg slot="icon" viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  </m3-navigation-rail-item>
  
  <m3-navigation-rail-item label="Search">
    <svg slot="icon" viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
  </m3-navigation-rail-item>
  
  <m3-navigation-rail-item label="Library">
    <svg slot="icon" viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
    </svg>
  </m3-navigation-rail-item>
</m3-navigation-rail>
```

### With Badges

Navigation items can display badges to show notifications or counts:

```html
<m3-navigation-rail-item label="Messages" badge="3">
  <svg slot="icon" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
  </svg>
</m3-navigation-rail-item>

<!-- Empty badge shows a dot indicator -->
<m3-navigation-rail-item label="Notifications" badge="">
  <svg slot="icon" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
  </svg>
</m3-navigation-rail-item>
```

### Bottom Slot

You can add items to the bottom of the rail using the `bottom` slot:

```html
<m3-navigation-rail>
  <m3-navigation-rail-toggle></m3-navigation-rail-toggle>
  
  <m3-navigation-rail-item label="Home" active>
    <!-- icon -->
  </m3-navigation-rail-item>
  
  <!-- Bottom items -->
  <m3-navigation-rail-item slot="bottom" label="Settings">
    <svg slot="icon" viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
    </svg>
  </m3-navigation-rail-item>
</m3-navigation-rail>
```

## API Reference

### m3-navigation-rail

The main container component for the navigation rail.

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `expanded` | `boolean` | `false` | Whether the rail is expanded to show labels |

#### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `menu-toggle` | - | Fired when the menu button is clicked (future feature) |

#### Slots

| Slot | Description |
|------|-------------|
| (default) | Navigation rail items and toggle |
| `bottom` | Items anchored to the bottom of the rail |

#### CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--md-sys-color-surface` | `#fef7ff` | Background color of the rail |
| `--md-sys-color-outline-variant` | `#cac4d0` | Border color |

---

### m3-navigation-rail-item

Individual navigation item with icon and label.

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `active` | `boolean` | `false` | Whether the item is currently active/selected |
| `label` | `string` | `''` | Text label for the navigation item |
| `badge` | `string` | `''` | Badge text to display (empty string shows a dot) |
| `expanded` | `boolean` | `false` | Automatically set by parent rail |

#### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `item-click` | `{ label: string }` | Fired when the item is clicked |

#### Slots

| Slot | Description |
|------|-------------|
| `icon` | SVG or icon element (24x24px recommended) |

#### CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--md-sys-color-secondary-container` | `#6750a4` | Active item background |
| `--md-sys-color-on-secondary-container` | `#1d192b` | Active item text/icon color |
| `--md-sys-color-surface-variant` | `#e7e0ec` | Hover state background |
| `--md-sys-color-on-surface-variant` | `#49454f` | Inactive item text/icon color |
| `--md-sys-color-error` | `#ba1a1a` | Badge background color |
| `--md-sys-color-on-error` | `#ffffff` | Badge text color |

---

### m3-navigation-rail-toggle

Toggle button to expand/collapse the navigation rail.

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `expanded` | `boolean` | `false` | Whether the rail is expanded |

#### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `toggle-click` | `{ expanded: boolean }` | Fired when toggle is clicked |

#### CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--md-sys-color-surface-variant` | `#e7e0ec` | Hover state background |
| `--md-sys-color-secondary-container` | `#e8def8` | Active state background |
| `--md-sys-color-on-surface-variant` | `#49454f` | Icon color |

## Styling

The components follow Material Design 3 design tokens. You can customize the appearance by setting CSS custom properties:

```css
m3-navigation-rail {
  --md-sys-color-surface: #f5f5f5;
  --md-sys-color-outline-variant: #e0e0e0;
  --md-sys-color-secondary-container: #6750a4;
  --md-sys-color-on-secondary-container: #ffffff;
}
```

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Navigation Rail Demo</title>
  <style>
    body {
      margin: 0;
      font-family: Roboto, sans-serif;
      display: flex;
      height: 100vh;
    }
    
    main {
      flex: 1;
      padding: 24px;
    }
  </style>
  <script type="module">
    import '@banegasn/m3-navigation-rail';
  </script>
</head>
<body>
  <m3-navigation-rail id="nav">
    <m3-navigation-rail-toggle></m3-navigation-rail-toggle>
    
    <m3-navigation-rail-item label="Home" active>
      <svg slot="icon" viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    </m3-navigation-rail-item>
    
    <m3-navigation-rail-item label="Messages" badge="5">
      <svg slot="icon" viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
    </m3-navigation-rail-item>
    
    <m3-navigation-rail-item label="Favorites">
      <svg slot="icon" viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </m3-navigation-rail-item>
    
    <m3-navigation-rail-item slot="bottom" label="Settings">
      <svg slot="icon" viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
      </svg>
    </m3-navigation-rail-item>
  </m3-navigation-rail>
  
  <main>
    <h1>Main Content Area</h1>
    <p>Click on navigation items or toggle the rail to see it expand.</p>
  </main>

  <script>
    const nav = document.getElementById('nav');
    
    nav.addEventListener('item-click', (e) => {
      // Remove active state from all items
      const items = nav.querySelectorAll('m3-navigation-rail-item');
      items.forEach(item => item.active = false);
      
      // Set clicked item as active
      e.target.active = true;
      
      console.log('Navigating to:', e.detail.label);
    });
  </script>
</body>
</html>
```

## Browser Support

This component works in all modern browsers that support:
- Web Components
- ES Modules
- Custom Elements v1
- Shadow DOM v1

## Framework Integration

### React

```jsx
import '@banegasn/m3-navigation-rail';

function App() {
  const handleItemClick = (e) => {
    console.log('Clicked:', e.detail.label);
  };

  return (
    <m3-navigation-rail>
      <m3-navigation-rail-toggle />
      <m3-navigation-rail-item 
        label="Home" 
        active
        onitem-click={handleItemClick}
      >
        <svg slot="icon" viewBox="0 0 24 24" width="24" height="24">
          {/* icon path */}
        </svg>
      </m3-navigation-rail-item>
    </m3-navigation-rail>
  );
}
```

### Angular

```typescript
// app.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@banegasn/m3-navigation-rail';

@Component({
  selector: 'app-root',
  template: `
    <m3-navigation-rail>
      <m3-navigation-rail-toggle></m3-navigation-rail-toggle>
      <m3-navigation-rail-item 
        label="Home" 
        [active]="true"
        (item-click)="onItemClick($event)"
      >
        <svg slot="icon" viewBox="0 0 24 24" width="24" height="24">
          <!-- icon path -->
        </svg>
      </m3-navigation-rail-item>
    </m3-navigation-rail>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  onItemClick(event: CustomEvent) {
    console.log('Clicked:', event.detail.label);
  }
}
```

### Vue

```vue
<template>
  <m3-navigation-rail>
    <m3-navigation-rail-toggle />
    <m3-navigation-rail-item 
      label="Home" 
      :active="true"
      @item-click="handleItemClick"
    >
      <svg slot="icon" viewBox="0 0 24 24" width="24" height="24">
        <!-- icon path -->
      </svg>
    </m3-navigation-rail-item>
  </m3-navigation-rail>
</template>

<script setup>
import '@banegasn/m3-navigation-rail';

const handleItemClick = (event) => {
  console.log('Clicked:', event.detail.label);
};
</script>
```

## License

MIT

## Repository

[https://github.com/banegasn/components](https://github.com/banegasn/components)
