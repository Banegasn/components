# @banegasn/m3-search-bar

Material Design 3 Search Bar web component with support for leading and trailing content projection.

## Installation

```bash
npm install @banegasn/m3-search-bar
```

## Material Icons Setup

To use Material Icons in your project, include the Material Symbols font in your HTML:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
```

Or via npm:

```bash
npm install material-symbols
```

## Usage

### Basic Example

```html
<m3-search-bar placeholder="Search..."></m3-search-bar>
```

### With Leading Icon

```html
<m3-search-bar placeholder="Search...">
  <span slot="leading" class="material-symbols-outlined">search</span>
</m3-search-bar>
```

### With Leading and Trailing Content

```html
<m3-search-bar placeholder="Search...">
  <!-- Leading: Menu button -->
  <m3-button icon-only slot="leading" variant="text" size="small" aria-label="Menu">
    <span slot="icon" class="material-symbols-outlined">menu</span>
  </m3-button>
  
  <!-- Trailing: Clear button (shown conditionally) -->
  <m3-button icon-only slot="trailing" variant="text" aria-label="Clear" @click="${() => searchBar.clear()}">
    <span slot="icon" class="material-symbols-outlined">close</span>
  </m3-button>
</m3-search-bar>
```

Or with Material Icons directly:

```html
<m3-search-bar placeholder="Search...">
  <span slot="leading" class="material-symbols-outlined">search</span>
  <span slot="trailing" class="material-symbols-outlined">close</span>
</m3-search-bar>
```

### With Avatar in Trailing Slot

```html
<m3-search-bar placeholder="Search users...">
  <span slot="leading" class="material-symbols-outlined">search</span>
  <img slot="trailing" src="avatar.jpg" alt="User" style="width: 24px; height: 24px; border-radius: 50%;" />
</m3-search-bar>
```

### With Multiple Trailing Actions

```html
<m3-search-bar placeholder="Search...">
  <span slot="leading" class="material-symbols-outlined">search</span>
  <m3-button icon-only slot="trailing" variant="text" aria-label="Filter">
    <span slot="icon" class="material-symbols-outlined">tune</span>
  </m3-button>
  <m3-button icon-only slot="trailing" variant="text" aria-label="More options">
    <span slot="icon" class="material-symbols-outlined">more_vert</span>
  </m3-button>
</m3-search-bar>
```

### With Event Listeners

```javascript
const searchBar = document.querySelector('m3-search-bar');

searchBar.addEventListener('search-input', (e) => {
  console.log('Search value:', e.detail.value);
});

searchBar.addEventListener('search-submit', (e) => {
  console.log('Search submitted:', e.detail.value);
});

searchBar.addEventListener('search-clear', () => {
  console.log('Search cleared');
});
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `placeholder` | `string` | `'Search'` | Placeholder text for the input |
| `value` | `string` | `''` | Current value of the input |
| `disabled` | `boolean` | `false` | Disables the search bar |
| `name` | `string \| null` | `null` | Name attribute for form submission |
| `form` | `string \| null` | `null` | Form attribute to associate with a form |
| `aria-label` | `string \| null` | `null` | ARIA label for accessibility |
| `aria-labelledby` | `string \| null` | `null` | ARIA labelled by for accessibility |
| `maxLength` | `number \| null` | `null` | Maximum length of input |
| `minLength` | `number \| null` | `null` | Minimum length of input |
| `pattern` | `string \| null` | `null` | Pattern for input validation |
| `required` | `boolean` | `false` | Whether the input is required |
| `autocomplete` | `string \| null` | `null` | Autocomplete attribute |

## Slots

| Slot | Description |
|------|-------------|
| `leading` | Content to display before the input (e.g., search icon, menu button) |
| `trailing` | Content to display after the input (e.g., clear button, avatar) |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `search-input` | `{ value: string, name: string \| null }` | Fired when the input value changes |
| `search-submit` | `{ value: string, name: string \| null }` | Fired when Enter is pressed |
| `search-clear` | `{ name: string \| null }` | Fired when the search is cleared (Escape key) |

## Methods

| Method | Description |
|-------|-------------|
| `focus()` | Focuses the search input |
| `blur()` | Removes focus from the search input |
| `clear()` | Clears the search input |
| `getValue()` | Returns the current value |
| `setValue(value: string)` | Sets the value programmatically |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--md-search-bar-container-height` | `64px` | Height of the container |
| `--md-search-bar-container-padding` | `16px` | Padding of the container |
| `--md-search-bar-height` | `56px` | Height of the search bar |
| `--md-search-bar-shape` | `28px` | Border radius of the search bar |
| `--md-search-bar-padding-horizontal` | `16px` | Horizontal padding |
| `--md-search-bar-padding-vertical` | `12px` | Vertical padding |
| `--md-search-bar-input-font-size` | `16px` | Font size of input |
| `--md-search-bar-input-line-height` | `24px` | Line height of input |
| `--md-search-bar-icon-size` | `24px` | Size of icons in slots |

## Accessibility

The component follows Material Design 3 accessibility guidelines:
- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader compatibility

## License

MIT

