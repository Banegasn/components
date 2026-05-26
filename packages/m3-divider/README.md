# @banegasn/m3-divider

Material Design 3 Divider web component with expressive entrance animations.

## Features

- **Variants**: `full-width`, `inset`, `middle`
- **Orientations**: `horizontal`, `vertical`
- **Thickness**: `1`, `2`, `4` pixels
- **Expressive animations**: Smooth scale entrance animation with customizable easing
- **Pulsing mode**: Subtle pulse animation for loading/placeholder states
- **Accessible**: Proper ARIA `separator` role and `aria-orientation`

## Installation

```bash
npm install @banegasn/m3-divider
```

## Usage

```html
<script type="module">
  import '@banegasn/m3-divider';
</script>

<!-- Full-width divider (default) -->
<m3-divider></m3-divider>

<!-- Inset divider (useful in lists) -->
<m3-divider variant="inset"></m3-divider>

<!-- Middle divider (indented both sides) -->
<m3-divider variant="middle"></m3-divider>

<!-- Vertical divider -->
<m3-divider orientation="vertical"></m3-divider>

<!-- Thicker divider -->
<m3-divider thickness="2"></m3-divider>

<!-- Disable animation -->
<m3-divider no-animation></m3-divider>

<!-- Pulsing for loading states -->
<m3-divider pulsing></m3-divider>
```

## Customization

```css
m3-divider {
  --md-sys-color-outline-variant: #e0e0e0;
  --_animation-duration: 0.3s;
  --_inset-start: 24px;
}
```

## License

MIT
