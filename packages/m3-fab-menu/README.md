# @banegasn/m3-fab-menu

An accessible floating-action-button trigger for an `m3-menu`.

```sh
pnpm add @banegasn/m3-fab-menu @banegasn/m3-menu
```

```html
<m3-fab-menu label="Create">
  <m3-menu slot="menu" placement="top-end">
    <m3-menu-item value="document">New document</m3-menu-item>
    <m3-menu-item value="upload">Upload file</m3-menu-item>
  </m3-menu>
</m3-fab-menu>
```

The `menu` slot must contain one `m3-menu`. Its ID becomes `aria-controls` on the FAB trigger; an
ID is generated only when the supplied menu has none, so the component never emits an empty ARIA
relationship.

## State and events

`open` is both the direct-use state and controlled input. User interaction updates it and mirrors
it to the slotted menu. Framework consumers bind `open` and write the value from
`fab-menu-open-change` to their own state.

| Property | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | `false` | Rendered menu visibility |
| `disabled` | `boolean` | `false` | Makes the trigger inert |
| `label` | `string` | `'Menu'` | Accessible trigger label |

| Event | Detail |
|---|---|
| `fab-menu-open-change` | `{ open: boolean; reason: string }` |
| `fab-menu-dismiss` | `{ reason: 'escape' \| 'outside' \| 'selection' \| 'tab' }` |

The trigger uses `aria-haspopup="menu"`, accurate `aria-expanded`, and keyboard opening with
ArrowDown/ArrowUp/Home/End. Escape, outside press, item selection, and Tab delegate to the slotted
menu’s focus and dismissal behavior.

## License

MIT
