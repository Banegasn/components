# @banegasn/m3-menu

Material Design 3 Menu web component. Includes `m3-menu` and `m3-menu-item`.

## Installation

```bash
npm install @banegasn/m3-menu
```

### Via CDN (No build step)

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@banegasn/m3-menu/+esm"></script>
```

## Usage

```html
<m3-menu open placement="bottom-end">
  <m3-menu-item value="1">Item 1</m3-menu-item>
  <m3-menu-item value="2" disabled>Item 2</m3-menu-item>
</m3-menu>
```

## Properties

### `m3-menu`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `open` | `boolean` | `false` | Whether the menu is open |
| `placement` | `string` | `'bottom-end'` | Menu placement |
| `offset` | `number` | `8` | Offset distance |

### `m3-menu-item`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `''` | Item value |
| `disabled` | `boolean` | `false` | Disabled state |

## License

MIT