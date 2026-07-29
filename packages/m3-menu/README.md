# @banegasn/m3-menu

An accessible Material 3 menu with a public, observable visibility contract.

```sh
pnpm add @banegasn/m3-menu
```

```html
<button id="options">Options</button>
<m3-menu id="options-menu" placement="bottom-end">
  <m3-menu-item value="edit">Edit</m3-menu-item>
  <m3-menu-item value="delete" disabled>Delete</m3-menu-item>
</m3-menu>
<script>
  const trigger = document.querySelector('#options');
  const menu = document.querySelector('#options-menu');
  trigger.addEventListener('click', () => menu.show('trigger'));
  menu.addEventListener('menu-open-change', (event) => console.log(event.detail));
</script>
```

## State and events

`open` is the source of truth for rendered visibility. A menu is self-managing when opened with
`show()` and closed with `dismiss()`, and can be framework-controlled by binding `open` and writing
the value reported by `menu-open-change` back to application state.

| Property | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | `false` | Rendered visibility |
| `placement` | `M3MenuPlacement` | `'bottom-end'` | Position relative to its containing anchor |
| `offset` | `number` | `8` | Anchor separation in pixels |

| Event | Detail |
|---|---|
| `menu-item-select` | `{ value: string; text: string }` |
| `menu-open-change` | `{ open: boolean; reason: 'trigger' \| 'programmatic' \| 'escape' \| 'outside' \| 'selection' \| 'tab' }` |
| `menu-dismiss` | `{ reason: 'escape' \| 'outside' \| 'selection' \| 'tab' }` |

When opened, focus enters the first enabled item. Arrow keys, Home, and End navigate enabled items;
Escape, outside press, selection, and Tab close the menu. Escape/outside return focus to the opener;
Tab retains its normal forward focus movement.

## License

MIT
