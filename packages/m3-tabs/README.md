# @banegasn/m3-tabs

Accessible Material 3 tabs with a complete ARIA tab/tabpanel contract.

## Installation

```bash
pnpm add @banegasn/m3-tabs
```

```js
import '@banegasn/m3-tabs';
```

## Usage

Every `m3-tab` has a required `panel` property identifying its unique panel. `m3-tabs` applies `role="tab"`, `aria-controls`, `aria-selected`, and roving `tabindex` to the tab. It applies `role="tabpanel"`, `aria-labelledby`, and `hidden` to the associated panel.

```html
<m3-tabs active-tab="0">
  <m3-tab panel="overview-panel" value="overview">Overview</m3-tab>
  <m3-tab panel="activity-panel" value="activity">Activity</m3-tab>
</m3-tabs>

<section id="overview-panel">Overview content</section>
<section id="activity-panel" hidden>Activity content</section>
```

## Keyboard policy

`orientation="horizontal"` (the default) uses Left/Right; `orientation="vertical"` uses Up/Down. Home and End always move to the first and last enabled tab. Navigation wraps and skips disabled tabs.

`activation="automatic"` (the default) selects the focused destination tab. With `activation="manual"`, arrows only move focus; Space or Enter selects that focused tab. Click always selects its enabled tab.

The roving `tabindex="0"` always follows the focused tab. In manual mode that means the selected tab can remain `aria-selected="true"` while a different enabled tab is the sole tab stop.

`active-tab` is zero-based. Invalid values are clamped and then recover to the first enabled tab at or after that index, wrapping as needed. If no tabs are enabled, it becomes `-1`.

## API

### `m3-tabs`

| Property                   | Type                         | Default        | Meaning                     |
| -------------------------- | ---------------------------- | -------------- | --------------------------- |
| `activeTab` / `active-tab` | `number`                     | `0`            | Selected enabled tab index  |
| `orientation`              | `'horizontal' \| 'vertical'` | `'horizontal'` | Tab-list keyboard axis      |
| `activation`               | `'automatic' \| 'manual'`    | `'automatic'`  | Arrow-key activation policy |

### `m3-tab`

| Property   | Type      | Default | Meaning                                   |
| ---------- | --------- | ------- | ----------------------------------------- |
| `panel`    | `string`  | `''`    | Required ID of the associated tabpanel    |
| `value`    | `string`  | `''`    | Application value reported by the event   |
| `disabled` | `boolean` | `false` | Excludes the tab from selection and focus |

### `tab-change`

This is the sole selection event. It bubbles and is composed. It fires only when a click or keyboard activation changes the selection.

```ts
type TabChangeDetail = {
  activeTab: number;
  value: string;
  reason: 'click' | 'keyboard';
};
```

## Responsive indicator

The indicator is measured again after tab-list or tab resize, window resize, font loading, and light-DOM content changes. No imperative indicator API is required.
