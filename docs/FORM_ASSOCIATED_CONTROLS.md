# Form-associated controls

`m3-button`, `m3-checkbox`, `m3-radio-button`, `m3-switch`, `m3-slider`,
`m3-text-field`, and `m3-search-bar` now use the browser's
[form-associated custom element](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example)
contract. They participate in the owner form directly through
`ElementInternals`; they do not render hidden `<input>` mirrors.

## Native behaviour

- Checkbox, radio, switch, slider, text-field, and search-bar `name`/`value`
  properties contribute to `FormData` as native successful controls. Unchecked
  checkboxes, switches, and radios do not contribute a value.
- The host's native `form` attribute selects an external form. The `form`
  property returns the current owner form.
- Disabled fieldsets disable descendants, remove their values from `FormData`,
  and prevent interaction.
- `required` is supported by checkbox, switch, radio groups, text field, and
  search bar. `checkValidity()` and `reportValidity()` delegate to the native
  form-validation lifecycle.
- Form reset restores the initial component value/state. Browser history and
  autofill restoration use `formStateRestoreCallback` without synthetic input
  or change events.
- A submit button calls its owner form exactly once and a reset button calls
  its owner form once. The platform has no custom-element submitter API:
  `requestSubmit()` therefore exposes `SubmitEvent.submitter` as `null`, and
  button `name`/`value` are not added to `FormData`. The library does not fake
  submitter data with a `formdata` listener.

## Radio group scope and labels

`m3-radio-button` groups are local: controls must share a non-empty `name`,
the same owner form, and the same document or shadow root. Matching names in
different forms or shadow roots do not interact. The checked radio is the
single tab stop; arrow keys move focus and selection through enabled peers.

For an external label, use the platform `for`/`id` association and point the
radio's `aria-labelledby` at that label (or supply `aria-label`). This is the
supported label contract. It observes only labels explicitly associated through
`for`/`id`, removes those listeners when the radio disconnects, and never
mutates surrounding DOM.

## Clean-break migration

The component-specific `button-click`, `checkbox-change`, `radio-change`,
`switch-change`, `slider-input`, `slider-change`, `textfield-input`,
`textfield-change`, `search-input`, `search-submit`, and `search-clear`
events are removed for these controls. Listen to the host's native events and
read its public properties instead:

```js
control.addEventListener('input', () => {
  console.log(control.value, control.checked);
});
control.addEventListener('change', () => {
  save(control.value);
});
```

Use a real `<form>` and the platform APIs for submission rather than custom
submit events:

```js
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
});
```

The `form` **attribute** remains native HTML. The former string-valued
component `form` property is gone: `control.form` is now the owner
`HTMLFormElement | null`, matching native controls.

## Browser support and fallback

Form-associated custom elements require Chromium 77+, Firefox 98+, or Safari
16.4+. The browser integration suite runs on Playwright Chromium, Firefox,
and WebKit. In an older browser the controls still render and remain interactive,
but the browser cannot supply equivalent `FormData`, validation, reset, or
state-restoration semantics. There is deliberately no hidden-input fallback:
it would produce different ownership, disabled-fieldset, validation, and
submitter behaviour. Use a supported browser for forms that contain these
components.
