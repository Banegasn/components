# @banegasn/m3-card

Material Design 3 Card web component with elevated, filled, and outlined variants.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)
[![npm version](https://img.shields.io/npm/v/@banegasn/m3-card.svg)](https://www.npmjs.com/package/@banegasn/m3-card)

## 🎯 Features

- ✅ **3 Card Variants**: Elevated, Filled, and Outlined
- ✅ **Fully Interactive**: Clickable cards with hover, focus, pressed, and dragged states
- ✅ **Accessible**: WCAG compliant with keyboard navigation support
- ✅ **Framework Agnostic**: Works with Angular, React, Vue, Svelte, or vanilla JavaScript
- ✅ **Flexible Layout**: Supports media, header, content, and action slots
- ✅ **Customizable**: CSS custom properties for theming
- ✅ **TypeScript Support**: Full type definitions included
- ✅ **Material Design 3 Compliant**: Follows official [Material 3 card specifications](https://m3.material.io/components/cards/guidelines)

## 📦 Installation

```bash
npm install @banegasn/m3-card
```

```bash
pnpm add @banegasn/m3-card
```

```bash
yarn add @banegasn/m3-card
```

## 🚀 Usage

### Basic Usage

```typescript
import '@banegasn/m3-card';
```

```html
<!-- Simple elevated card (default) -->
<m3-card>
  <h2 slot="header">Card Title</h2>
  <p>This is a simple card with some content.</p>
</m3-card>

<!-- Filled card -->
<m3-card variant="filled">
  <p>Filled card with solid background</p>
</m3-card>

<!-- Outlined card -->
<m3-card variant="outlined">
  <p>Outlined card with border</p>
</m3-card>
```

### Card with Media

```html
<m3-card>
  <img slot="media" src="image.jpg" alt="Description" />
  <h2 slot="header">Beautiful Image</h2>
  <p>Card with an image at the top</p>
</m3-card>
```

### Card with Actions

```html
<m3-card>
  <h2 slot="header">Action Card</h2>
  <p>Card with action buttons at the bottom</p>
  <div slot="actions">
    <m3-button variant="text">Cancel</m3-button>
    <m3-button variant="filled">Confirm</m3-button>
  </div>
</m3-card>
```

### Clickable Card

```html
<m3-card 
  clickable 
  aria-label="Navigate to details"
  @card-click="${handleClick}"
>
  <h2 slot="header">Interactive Card</h2>
  <p>Click anywhere on this card to trigger an action</p>
</m3-card>
```

### Complete Card Example

```html
<m3-card variant="elevated" clickable width="fixed">
  <img slot="media" src="product.jpg" alt="Product" />
  <div slot="header">
    <h3 style="margin: 0; font-size: 22px;">Product Title</h3>
    <p style="margin: 4px 0 0; color: #666; font-size: 14px;">$99.99</p>
  </div>
  <p>
    This is a detailed description of the product with all the 
    important information you need to know.
  </p>
  <div slot="actions">
    <m3-button variant="text" icon="favorite">
      <svg slot="icon" width="18" height="18" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
      </svg>
    </m3-button>
    <m3-button variant="text">Share</m3-button>
    <m3-button variant="filled">Buy Now</m3-button>
  </div>
</m3-card>
```

## 📚 API

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `'elevated' \| 'filled' \| 'outlined'` | `'elevated'` | Card visual style variant |
| `clickable` | `boolean` | `false` | Makes the card interactive and clickable |
| `disabled` | `boolean` | `false` | Disables card interaction |
| `dragged` | `boolean` | `false` | Shows the card in dragged state |
| `width` | `'auto' \| 'full' \| 'fixed'` | `'auto'` | Controls card width behavior |
| `aria-label` | `string \| null` | `null` | Accessibility label (required if clickable) |
| `role` | `string \| null` | `null` | ARIA role (auto-set to 'button' if clickable) |

### Slots

| Slot | Description |
|------|-------------|
| (default) | Main content area of the card |
| `media` | Media content (images, videos) at the top |
| `header` | Header content (title, subtitle) |
| `actions` | Action buttons at the bottom |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `card-click` | `{ variant, width }` | Fired when clickable card is clicked |

### Methods

| Method | Description |
|--------|-------------|
| `focus()` | Focuses the card (if clickable) |
| `blur()` | Removes focus from the card |

### CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--md-card-container-shape` | `12px` | Border radius of the card |
| `--md-card-container-color` | varies | Background color (overrides default) |
| `--md-card-elevation` | varies | Box shadow elevation |
| `--md-card-width` | `320px` | Fixed width (when width="fixed") |
| `--md-sys-color-surface-container-low` | `#f7f2fa` | Elevated card background |
| `--md-sys-color-surface-container-highest` | `#e6e0e9` | Filled card background |
| `--md-sys-color-surface` | `#fef7ff` | Outlined card background |
| `--md-sys-color-outline-variant` | `#c9c5d0` | Outlined card border |
| `--md-sys-color-on-surface` | `#1d1b20` | State layer overlay color |

## 🎨 Card Variants

### Elevated Card

**Use when:** You want subtle elevation with a shadow effect.

```html
<m3-card variant="elevated">
  <p>Elevated card with shadow</p>
</m3-card>
```

- Background: Surface container low
- Elevation: Level 1 shadow
- Best for: Default cards, product cards

### Filled Card

**Use when:** You want a solid background with more visual weight.

```html
<m3-card variant="filled">
  <p>Filled card with solid background</p>
</m3-card>
```

- Background: Surface container highest
- Elevation: None
- Best for: Dense UIs, secondary content

### Outlined Card

**Use when:** You want a lightweight card with clear boundaries.

```html
<m3-card variant="outlined">
  <p>Outlined card with border</p>
</m3-card>
```

- Background: Surface
- Border: Outline variant
- Best for: Lists, grouped content

## ♿ Accessibility

### Clickable Cards

When using `clickable`, always provide an `aria-label`:

```html
<m3-card 
  clickable 
  aria-label="View product details for Wireless Headphones"
>
  <!-- Card content -->
</m3-card>
```

### Keyboard Navigation

- **Tab**: Focus on clickable cards
- **Enter** or **Space**: Activate clickable cards
- **Escape**: Remove focus (standard browser behavior)

### Screen Reader Support

- Non-clickable cards: Regular div structure
- Clickable cards: Automatically assigned `role="button"`
- Disabled cards: `aria-disabled="true"`

## 🎯 Best Practices

1. **Use appropriate variants:**
   - Elevated: Default choice, good for most use cases
   - Filled: Dense layouts, grouped content
   - Outlined: Lists, minimal designs

2. **Keep content organized:**
   - Use `header` slot for titles
   - Use `media` slot for images/videos
   - Use `actions` slot for buttons
   - Keep main content in default slot

3. **Make clickable cards accessible:**
   - Always provide `aria-label` for clickable cards
   - Describe the action, not just the content

4. **Responsive design:**
   - Use `width="full"` for mobile layouts
   - Use `width="fixed"` for desktop grids
   - Test on different screen sizes

5. **Action buttons:**
   - Limit to 1-3 actions per card
   - Use text buttons for secondary actions
   - Use filled button for primary action

## 🌐 Framework Integration

### Angular

```typescript
import '@banegasn/m3-card';

@Component({
  selector: 'app-card-demo',
  template: `
    <m3-card [clickable]="true" (card-click)="handleClick($event)">
      <h2 slot="header">{{ title }}</h2>
      <p>{{ description }}</p>
    </m3-card>
  `
})
export class CardDemoComponent {
  title = 'Card Title';
  description = 'Card description';
  
  handleClick(event: CustomEvent) {
    console.log('Card clicked:', event.detail);
  }
}
```

### React

```tsx
import '@banegasn/m3-card';

function CardDemo() {
  const handleClick = (event: any) => {
    console.log('Card clicked:', event.detail);
  };

  return (
    <m3-card clickable onCard-click={handleClick}>
      <h2 slot="header">Card Title</h2>
      <p>Card description</p>
    </m3-card>
  );
}
```

### Vue

```vue
<template>
  <m3-card clickable @card-click="handleClick">
    <h2 slot="header">{{ title }}</h2>
    <p>{{ description }}</p>
  </m3-card>
</template>

<script setup>
import '@banegasn/m3-card';

const title = 'Card Title';
const description = 'Card description';

const handleClick = (event) => {
  console.log('Card clicked:', event.detail);
};
</script>
```

## 📖 Resources

- [Material Design 3 Cards Guidelines](https://m3.material.io/components/cards/guidelines)
- [Material Design 3 Cards Specs](https://m3.material.io/components/cards/specs)
- [Web Components Documentation](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Lit Documentation](https://lit.dev/)

## 🤝 Contributing

Contributions are welcome! Please see the [main repository](https://github.com/banegasn/components) for contribution guidelines.

## 📄 License

MIT © [banegasn](https://github.com/banegasn)

