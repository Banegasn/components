# @banegasn/m3-text-field

Material Design 3 single-line text field, built with Lit. It is a
form-associated custom element: its host participates in native `FormData`,
constraint validation, reset, and browser state restoration.

## Installation

```bash
pnpm add @banegasn/m3-text-field
```

```js
import '@banegasn/m3-text-field';
```

## Usage

```html
<form>
  <m3-text-field
    name="email"
    type="email"
    label="Email address"
    autocomplete="email"
    helper-text="We only use this for account messages."
    required
  ></m3-text-field>
</form>
```

Use the host's native events. `input` fires once for every user edit and
`change` fires once when the input value is committed. Programmatic `value`
updates do not emit either event.

```js
const field = document.querySelector('m3-text-field');
field.addEventListener('input', () => {
  console.log(field.value);
});
field.addEventListener('change', () => {
  save(field.value);
});
```

## API

### Properties and attributes

Every property below has the named HTML attribute. Camel-case properties use
the corresponding lower-case attribute shown in the table.

| Property          | Attribute          | Type                     | Default    | Description                                                            |
| ----------------- | ------------------ | ------------------------ | ---------- | ---------------------------------------------------------------------- |
| `variant`         | `variant`          | `'filled' \| 'outlined'` | `'filled'` | Visual style.                                                          |
| `label`           | `label`            | `string`                 | `''`       | Visible label. It is associated with the internal input.               |
| `value`           | `value`            | `string`                 | `''`       | Current value and submitted form value.                                |
| `type`            | `type`             | `string`                 | `'text'`   | Native input type, such as `email`, `password`, or `tel`.              |
| `placeholder`     | `placeholder`      | `string`                 | `''`       | Native input placeholder.                                              |
| `name`            | `name`             | `string \| null`         | `null`     | Name contributed to `FormData`.                                        |
| `disabled`        | `disabled`         | `boolean`                | `false`    | Disables interaction and form participation.                           |
| `required`        | `required`         | `boolean`                | `false`    | Enables required-value validation.                                     |
| `maxLength`       | `maxlength`        | `number \| null`         | `null`     | Native maximum length constraint.                                      |
| `minLength`       | `minlength`        | `number \| null`         | `null`     | Native minimum length constraint.                                      |
| `pattern`         | `pattern`          | `string \| null`         | `null`     | Native pattern constraint.                                             |
| `autocomplete`    | `autocomplete`     | `string \| null`         | `null`     | Native autocomplete hint.                                              |
| `helperText`      | `helper-text`      | `string`                 | `''`       | Supporting guidance announced with the input.                          |
| `error`           | `error`            | `boolean`                | `false`    | Applies a custom form-validation error.                                |
| `errorText`       | `error-text`       | `string`                 | `''`       | Message for the custom error; defaults to `Invalid value.` when empty. |
| `showCounter`     | `show-counter`     | `boolean`                | `false`    | Displays `value.length/maxLength` when `maxLength` is set.             |
| `ariaLabel`       | `aria-label`       | `string \| null`         | `null`     | Accessible name override, usually for an unlabeled field.              |
| `ariaLabelledBy`  | `aria-labelledby`  | `string \| null`         | `null`     | External accessible-name ID reference.                                 |
| `ariaDescribedBy` | `aria-describedby` | `string \| null`         | `null`     | Additional external description ID reference.                          |

The native host `form` attribute can associate the control with an external
form. The read-only `form` property returns that owner form. `validity`,
`validationMessage`, `willValidate`, `checkValidity()`, and `reportValidity()`
follow the form-associated custom-element platform contract.

### Slots

| Slot            | Description                                               |
| --------------- | --------------------------------------------------------- |
| `leading-icon`  | Decorative or interactive content shown before the input. |
| `trailing-icon` | Decorative or interactive content shown after the input.  |

```html
<m3-text-field label="Search" placeholder="Find a project">
  <svg slot="leading-icon" aria-hidden="true" viewBox="0 0 24 24">...</svg>
</m3-text-field>
```

### Events

| Event    | When it fires                             |
| -------- | ----------------------------------------- |
| `input`  | Once for each user edit.                  |
| `change` | Once when a user commits an edited value. |

### Methods

| Method    | Description                                   |
| --------- | --------------------------------------------- |
| `focus()` | Focuses the internal native input.            |
| `blur()`  | Removes focus from the internal native input. |

## Validation and accessible supporting text

`required`, `minLength`, `maxLength`, `pattern`, and the selected native
`type` participate in the owner form's validation APIs. `error` adds a custom
error, using `errorText` as its validation message. Disabled fields are omitted
from `FormData` and validation, including when disabled by a fieldset.

The visible `label` uses a generated `for`/`id` relationship, so activating it
focuses the input. Helper text and validation errors have a generated stable ID
and are referenced with `aria-describedby`; an active error also uses
`aria-errormessage` and `aria-invalid`. Optional ARIA attributes are omitted
when not supplied.

## Migration from pre-1.1 documentation

This is a clean API correction. The previous README mentioned
`textfield-input`/`textfield-change` and `text-field-input` events, but those
aliases are not part of the component contract and are removed. Listen for the
native host `input` and `change` events instead, then read `field.value`.

`variant`, `helper-text`, `error`, `error-text`, `show-counter`, and the
`leading-icon`/`trailing-icon` slots are now the only documented presentation
API. Do not use unlisted aliases. See the repository's
[form-associated controls guide](../../docs/FORM_ASSOCIATED_CONTROLS.md) for
browser support and platform fallback behavior.
