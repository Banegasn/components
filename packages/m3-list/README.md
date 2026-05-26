# @banegasn/m3-list

Material Design 3 List and List Item web components with expressive interactions.

## Features

- **List container**: `m3-list` with optional staggered entrance animations
- **List items**: `m3-list-item` supporting one, two, or three lines of text
- **Slots**: `leading` (icon/avatar), `trailing` (action/icon), `supporting-text`, `tertiary-text`
- **Selection state**: Visual feedback with smooth transitions
- **Keyboard navigation**: Full Enter/Space key support
- **Shape variants**: `default`, `rounded`, `full`
- **Accessibility**: Proper ARIA roles and attributes

## Installation

```bash
npm install @banegasn/m3-list
```

## Usage

```html
<script type="module">
  import '@banegasn/m3-list';
</script>

<!-- Simple list -->
<m3-list>
  <m3-list-item>Item One</m3-list-item>
  <m3-list-item>Item Two</m3-list-item>
  <m3-list-item>Item Three</m3-list-item>
</m3-list>

<!-- Staggered entrance animation -->
<m3-list staggered>
  <m3-list-item>Animated 1</m3-list-item>
  <m3-list-item>Animated 2</m3-list-item>
  <m3-list-item>Animated 3</m3-list-item>
</m3-list>

<!-- Two-line with leading icon -->
<m3-list-item lines="2">
  <span slot="leading" class="material-symbols-outlined">person</span>
  Headline Text
  <span slot="supporting-text">Supporting text goes here</span>
</m3-list-item>

<!-- Selected item -->
<m3-list-item selected>Selected Item</m3-list-item>

<!-- Rounded shape -->
<m3-list-item shape="rounded">Rounded Item</m3-list-item>
```

## Events

- `item-click` - Fired when a list item is clicked
- `item-select` - Fired when a list item's selected state changes

## License

MIT
