# @banegasn/m3-snackbar

Material Design 3 Snackbar web component with expressive entrance/exit animations.

## Features

- **Auto-dismiss**: Configurable duration with `duration` property (default: 4000ms)
- **Action slot**: Optional action button with click handling
- **Entrance/exit animations**: Smooth slide-up and scale transitions
- **Two-line support**: For longer messages
- **Programmatic API**: `show()` and `dismiss()` methods
- **Accessible**: ARIA live regions and proper roles

## Installation

```bash
npm install @banegasn/m3-snackbar
```

## Usage

```html
<script type="module">
  import '@banegasn/m3-snackbar';
</script>

<!-- Basic snackbar -->
<m3-snackbar open>Settings saved</m3-snackbar>

<!-- With action -->
<m3-snackbar open>
  Message deleted
  <button slot="action">Undo</button>
</m3-snackbar>

<!-- Two-line -->
<m3-snackbar open lines="2">
  This is a longer message that might wrap to two lines on smaller screens.
  <button slot="action">Action</button>
</m3-snackbar>

<!-- Programmatic control -->
<m3-snackbar id="snack" duration="3000">Hello!</m3-snackbar>
<script>
  document.getElementById('snack').show();
</script>
```

## Events

- `snackbar-dismiss` - Fired when the snackbar is dismissed
- `snackbar-action` - Fired when the action button is clicked

## License

MIT
