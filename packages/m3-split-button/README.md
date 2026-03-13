# @banegasn/m3-split-button

Material Design 3 Split Button web component. Features shape morphing and rotation animations.

## Installation

```bash
npm install @banegasn/m3-split-button
```

### Via CDN (No build step)

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@banegasn/m3-split-button/+esm"></script>
```

## Usage

```html
<m3-split-button variant="filled">
  Main Action
</m3-split-button>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `'filled' \| 'outlined' \| 'tonal' \| 'elevated'` | `'filled'` | Button variant |
| `menuOpen`| `boolean` | `false` | Whether the associated menu is open |
| `menuId` | `string \| null` | `null` | ID of the controlled menu |

## License

MIT