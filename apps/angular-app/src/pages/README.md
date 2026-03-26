# Component Page Guidelines

All documentation pages follow a unified structure and design system. Use these patterns to keep the app consistent.

---

## Design tokens

Colors, spacing, and typography are driven by CSS custom properties defined in `styles.css`. Never hardcode colors — always use tokens.

```css
/* Primary brand */
--md-sys-color-primary: #5b5bd6;          /* light */
--md-sys-color-primary: #818cf8;          /* dark */

/* Surfaces */
--md-sys-color-surface
--md-sys-color-surface-container-low
--md-sys-color-surface-container

/* Text */
--md-sys-color-on-surface           /* primary text */
--md-sys-color-on-surface-variant   /* secondary / muted text */

/* Borders */
--md-sys-color-outline-variant      /* subtle dividers */
--md-sys-color-outline              /* stronger borders */
```

---

## Typography

Font: **Inter** (loaded via Google Fonts with `display=swap`).  
Monospace: `var(--font-mono)` — JetBrains Mono / Fira Code / Cascadia Code.

| Element | Size | Weight | Notes |
|---|---|---|---|
| Page `h1` | `clamp(1.375rem, 4vw, 2.25rem)` | 700 | Set globally via `.docs-page .page-header h1` |
| Page subtitle | `clamp(0.875rem, 1.5vw, 0.9375rem)` | 400 | `.docs-page .subtitle` |
| Section title `h2` | `0.75rem` | 600 | Uppercase, `letter-spacing: 0.07em`, `on-surface-variant` |
| Body / descriptions | `0.9375rem` | 400 | `on-surface-variant`, `line-height: 1.7` |
| Code names | `0.8125rem` | 600 | `var(--font-mono)` |

**Do not** override `page-header h1` or `.subtitle` font sizes in page-level CSS — the global `clamp` handles all viewports.

---

## Page layout

```html
<div class="page-container docs-page">

  <!-- Header — always first -->
  <header class="page-header">
    <h1>Component Name</h1>
    <p class="subtitle">One-line description of what this component does.</p>
  </header>

  <!-- Demo sections -->
  <section class="demo-section">
    <h2>Variants</h2>
    <p>Brief explanation.</p>

    <div class="variant-card">
      <div class="variant-header">
        <h3>Filled</h3>
      </div>
      <div class="demo-row">
        <m3-button variant="filled">Button</m3-button>
      </div>
      <app-code-block language="html" variant="sample"
        code="<m3-button variant='filled'>Button</m3-button>">
      </app-code-block>
    </div>
  </section>

  <!-- Accessibility (recommended) -->
  <section class="demo-section accessibility">
    <h2>Accessibility</h2>
    <ul class="feature-list">
      <li><strong>Keyboard:</strong> Describe navigation</li>
      <li><strong>ARIA:</strong> Roles and attributes used</li>
    </ul>
  </section>

</div>
```

---

## Global CSS classes

### Page structure
| Class | Purpose |
|---|---|
| `.page-container.docs-page` | Root wrapper — applies max-width and spacing |
| `.page-header` | Top header block with bottom border and margin |
| `.subtitle` | Muted description below `h1` |

### Sections
| Class | Purpose |
|---|---|
| `.demo-section` | Major feature group — has background, border, border-radius |
| `.section` | Alias for `.demo-section` |
| `.doc-section` | Alias for `.demo-section` |
| `.page-section` | Borderless section with `24px` top/bottom padding and a bottom divider — used on content pages (quick-start, contact) |

### Section titles (`h2`)
All `h2` inside `.page-section`, `.comp-section`, and similar wrappers share:
```css
font-size: 0.75rem;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.07em;
color: var(--md-sys-color-on-surface-variant);
```

### Cards & demos
| Class | Purpose |
|---|---|
| `.variant-card` | Inner card for a single example — white bg, border, `10px` radius |
| `.pattern-card` | Alias for `.variant-card` |
| `.variant-header` | Flex row with title and optional badge |
| `.demo-row` | Flex row for component previews, `gap: 12px` |
| `.demo-buttons` | Alias for `.demo-row` |
| `.button-group` | Alias for `.demo-row` |
| `.interactive-demo` | Same as `.variant-card` — for interactive examples |

### Code
| Class | Purpose |
|---|---|
| `.code-sample` | Wraps `app-code-block`, adds `margin-top` and `border-radius` |

---

## Icons

Material Symbols Outlined — loaded via Google Fonts with variable font range.

```html
<span class="material-symbols-outlined">home</span>
```

Icons start at `opacity: 0` and fade in once `document.fonts.ready` resolves (FOUT prevention). The `fonts-loaded` class is added to `<html>` by a script in `index.html`.

Default variation settings (set globally):
```css
font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20;
font-size: 20px;
```

---

## Theming

Light and dark themes are toggled via `[theme="dark"]` on `<html>`. All token values are defined in `:root` and `:root[theme="dark"]` in `styles.css`.

```css
/* Target dark mode in component CSS */
:root[theme="dark"] .my-element {
  background: var(--md-sys-color-surface-container);
}
```

---

## Do / Don't

| Do | Don't |
|---|---|
| Use `var(--md-sys-color-*)` tokens | Hardcode hex colors |
| Use `var(--font-mono)` for code | Use `'Roboto Mono'` directly |
| Let global `clamp()` handle heading sizes | Override `page-header h1` font-size in page CSS |
| Use `.page-section` for content page sections | Create one-off section patterns per page |
| Use `word-break: break-word` on mono names | Use `white-space: nowrap` on variable-length strings |
