import { LitElement, type PropertyValues } from 'lit';

/** A value that ElementInternals can contribute to FormData. */
export type FormAssociatedValue = File | FormData | string | null;

/** The standard validity flags accepted by ElementInternals.setValidity(). */
export type FormValidityFlags = ValidityStateFlags;

/** Copy the failing standard flags from a native input into ElementInternals. */
export function validityFlags(validity: ValidityState): FormValidityFlags {
  const flags: FormValidityFlags = {};
  const names = [
    'badInput', 'customError', 'patternMismatch', 'rangeOverflow', 'rangeUnderflow',
    'stepMismatch', 'tooLong', 'tooShort', 'typeMismatch', 'valueMissing',
  ] as const;
  for (const name of names) {
    if (validity[name]) flags[name] = true;
  }
  return flags;
}

/**
 * Shared native-form contract for the library's controls.
 *
 * Subclasses own their public value and default-value semantics; this class
 * owns the browser integration points supplied by ElementInternals. It is
 * deliberately not a hidden-input fallback: browsers without form-associated
 * custom elements keep an interactive component, but cannot emulate native
 * form participation correctly.
 */
export abstract class FormAssociatedElement extends LitElement {
  static readonly formAssociated = true;

  /** Direct disabled state owned by each concrete form control. */
  abstract disabled: boolean;

  private readonly _internals = typeof this.attachInternals === 'function'
    ? this.attachInternals()
    : undefined;

  private _formDisabled = false;

  /** The form owner, including an owner selected with the host `form` attribute. */
  get form(): HTMLFormElement | null {
    return this._internals && 'form' in this._internals ? this._internals.form : null;
  }

  get labels(): NodeList | null {
    return this._internals && 'labels' in this._internals ? this._internals.labels : null;
  }

  get validity(): ValidityState {
    return this._internals && 'validity' in this._internals
      ? this._internals.validity
      : ({ valid: true } as ValidityState);
  }

  get validationMessage(): string {
    return this._internals && 'validationMessage' in this._internals
      ? this._internals.validationMessage
      : '';
  }

  get willValidate(): boolean {
    return this._internals && 'willValidate' in this._internals
      ? this._internals.willValidate
      : false;
  }

  /** True when this control is disabled directly or through a disabled fieldset. */
  protected get formDisabled(): boolean {
    return this._formDisabled;
  }

  protected get isFormDisabled(): boolean {
    return this._formDisabled || this.disabled;
  }

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('disabled')) {
      // Lit normally reflects after render. Form-associated controls need the
      // browser disabled callback before render so their internal control and
      // visual state cannot lag one update behind a property binding.
      this.toggleAttribute('disabled', this.disabled);
    }
  }

  checkValidity(): boolean {
    return typeof this._internals?.checkValidity === 'function'
      ? this._internals.checkValidity()
      : true;
  }

  reportValidity(): boolean {
    return typeof this._internals?.reportValidity === 'function'
      ? this._internals.reportValidity()
      : true;
  }

  /** Set the value submitted with this control and the state restored by the browser. */
  protected setFormValue(value: FormAssociatedValue, state: FormAssociatedValue = value): void {
    if (typeof this._internals?.setFormValue === 'function') {
      this._internals.setFormValue(value, state);
    }
  }

  /** Set native constraint-validation state. */
  protected setFormValidity(
    flags: FormValidityFlags = {},
    message = '',
    anchor?: HTMLElement,
  ): void {
    if (!this._internals || typeof this._internals.setValidity !== 'function') return;
    if (Object.keys(flags).length === 0) {
      this._internals.setValidity({});
      return;
    }
    this._internals.setValidity(flags, message, anchor);
  }

  protected emitInput(): void {
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  }

  protected emitChange(): void {
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  formAssociatedCallback(_form: HTMLFormElement | null): void {
    // The `form` getter always reads the current owner from ElementInternals.
  }

  formDisabledCallback(disabled: boolean): void {
    if (this._formDisabled !== disabled) {
      this._formDisabled = disabled;
      this.requestUpdate();
    }
  }

  formResetCallback(): void {
    this.resetFormControl();
  }

  formStateRestoreCallback(state: string | File | FormData | null): void {
    this.restoreFormControlState(state);
  }

  /** Restore the markup/default state without emitting interaction events. */
  protected abstract resetFormControl(): void;

  /** Restore browser navigation/autofill state without emitting interaction events. */
  protected abstract restoreFormControlState(state: string | File | FormData | null): void;
}
