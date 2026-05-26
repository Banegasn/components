# @banegasn/m3-icon-button

Material Design 3 Icon Button web component with expressive press animations.

## Features

- **Variants**: `standard`, `filled`, `tonal`, `outlined`
- **Sizes**: `small` (32px), `medium` (40px), `large` (48px)
- **Toggle mode**: Click to toggle selected state with smooth color transitions
- **Press animation**: Subtle scale-down on press for tactile feedback
- **State layer**: Hover and focus feedback following M3 specs
- **Accessibility**: Proper ARIA labels and keyboard support

## Installation

```bash
npm install @banegasn/m3-icon-button
```

## Usage

```html
<script type="module">
  import '@banegasn/m3-icon-button';
</script>

<!-- Standard -->
<m3-icon-button aria-label="Settings">
  <span class="material-symbols-outlined">settings</span>
</m3-icon-button>

<!-- Filled -->
<m3-icon-button variant="filled" aria-label="Add">
  <span class="material-symbols-outlined">add</span>
</m3-icon-button>

<!-- Tonal -->
<m3-icon-button variant="tonal" aria-label="Favorite">
  <span class="material-symbols-outlined">favorite</span>
</m3-icon-button>

<!-- Outlined -->
<m3-icon-button variant="outlined" aria-label="Menu">
  <span class="material-symbols-outlined">menu</span>
</m3-icon-button>

<!-- Toggle -->
<m3-icon-button toggle aria-label="Bookmark">
  <span class="material-symbols-outlined">bookmark</span>
</m3-icon-button>

<!-- Small size -->
<m3-icon-button size="small" aria-label="Close">
  <span class="material-symbols-outlined">close</span>
</m3-icon-button>
```

## Events

- `icon-button-click` - Fired when the button is clicked
- `icon-button-toggle` - Fired when toggle mode changes selected state

## License

MIT
