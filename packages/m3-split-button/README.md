# @banegasn/m3-split-button

An accessible primary action paired with an `m3-menu` dropdown.

```sh
pnpm add @banegasn/m3-split-button @banegasn/m3-menu
```

```html
<m3-split-button variant="filled" menu-label="More send options">
  Send
  <m3-menu slot="menu" placement="bottom-end">
    <m3-menu-item value="schedule">Schedule send</m3-menu-item>
    <m3-menu-item value="draft">Save draft</m3-menu-item>
  </m3-menu>
</m3-split-button>
```

The default slot labels the primary action. The `menu` slot must contain one `m3-menu`; its ID is
used by `aria-controls`, generated only when necessary. No empty ARIA relationship is emitted.

## State and events

`open` is the public source of truth and controls the slotted menu. It changes for direct use and
is observable through `split-button-open-change`; controlled framework consumers bind `open` and
write `event.detail.open` to their own state.

| Property | Type | Default | Description |
|---|---|---|---|
| `variant` | `'filled' \| 'outlined' \| 'tonal' \| 'elevated'` | `'filled'` | Button style |
| `open` | `boolean` | `false` | Rendered menu visibility |
| `disabled` | `boolean` | `false` | Disables both actions |
| `menuLabel` | `string` | `'More options'` | Accessible dropdown-trigger label |

| Event | Detail |
|---|---|
| `split-button-click` | `{ action: 'main' }` |
| `split-button-open-change` | `{ open: boolean; reason: string }` |
| `split-button-dismiss` | `{ reason: 'escape' \| 'outside' \| 'selection' \| 'tab' }` |

The menu trigger has `aria-haspopup="menu"`, accurate `aria-expanded`, keyboard opening with
ArrowDown/ArrowUp/Home/End, and an Escape close path. The slotted menu owns item navigation,
outside-click handling, and predictable focus return.

## License

MIT
