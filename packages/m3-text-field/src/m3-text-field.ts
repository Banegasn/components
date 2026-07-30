import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { customElement, property, query, state } from 'lit/decorators.js';
import {
  FormAssociatedElement,
  validityFlags,
} from '@banegasn/m3-form-associated';
import { m3TextFieldStyles } from './m3-text-field.styles.js';

type TextFieldVariant = 'filled' | 'outlined';

/**
 * A form-associated Material 3 single-line text field.
 *
 * User edits emit one native-like `input` event; committed edits emit one
 * native-like `change` event. Setting `value` programmatically is silent,
 * matching a native input.
 */
@customElement('m3-text-field')
export class M3TextField extends FormAssociatedElement {
  static styles = m3TextFieldStyles;
  static readonly formAssociated = true;
  private static _nextId = 0;

  @property({ type: String }) type = 'text';
  @property({ type: String }) label = '';
  @property({ type: String, reflect: true }) value = '';
  @property({ type: String }) placeholder = '';
  @property({ type: String, reflect: true }) variant: TextFieldVariant =
    'filled';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String, reflect: true }) name: string | null = null;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Number, attribute: 'maxlength' }) maxLength: number | null =
    null;
  @property({ type: Number, attribute: 'minlength' }) minLength: number | null =
    null;
  @property({ type: String }) pattern: string | null = null;
  @property({ type: String, attribute: 'autocomplete' }) autocomplete:
    string | null = null;
  @property({ type: String, attribute: 'helper-text' }) helperText = '';
  @property({ type: Boolean, reflect: true }) error = false;
  @property({ type: String, attribute: 'error-text' }) errorText = '';
  @property({ type: Boolean, attribute: 'show-counter' }) showCounter = false;
  @property({ type: String, attribute: 'aria-label' }) ariaLabel:
    string | null = null;
  @property({ type: String, attribute: 'aria-labelledby' }) ariaLabelledBy:
    string | null = null;
  @property({ type: String, attribute: 'aria-describedby' }) ariaDescribedBy:
    string | null = null;

  @state() private _focused = false;
  @state() private _hasLeadingIcon = false;
  @state() private _hasTrailingIcon = false;
  @state() private _invalid = false;
  @state() private _validationMessage = '';
  @query('input') private _input!: HTMLInputElement;

  private readonly _id = `m3-text-field-${(M3TextField._nextId += 1)}`;
  private _defaultValue = '';

  render() {
    const invalid = this._invalid;
    const supportingText = invalid ? this._validationMessage : this.helperText;
    const describedBy = [
      this.ariaDescribedBy,
      supportingText ? `${this._id}-supporting` : null,
    ]
      .filter((id): id is string => Boolean(id))
      .join(' ');

    return html`
      <div
        class="field-container ${this.variant}"
        ?focused=${this._focused}
        ?has-value=${!!this.value}
        ?invalid=${invalid}
        ?has-leading-icon=${this._hasLeadingIcon}
        ?has-trailing-icon=${this._hasTrailingIcon}
      >
        <div class="state-layer"></div>
        <div class="leading-icon">
          <slot
            name="leading-icon"
            @slotchange=${this._handleSlotChange}
          ></slot>
        </div>
        <div class="input-area">
          ${this.label ? html`<label class="label" for="${this._id}-input">${this.label}</label>` : nothing}
          <input
            id="${this._id}-input"
            class="input"
            type=${this.type}
            .value=${this.value}
            ?disabled=${this.isFormDisabled}
            ?required=${this.required}
            placeholder=${this.placeholder}
            aria-label=${this.ariaLabel || nothing}
            aria-labelledby=${this.ariaLabelledBy || nothing}
            aria-describedby=${describedBy || nothing}
            aria-errormessage=${invalid ? `${this._id}-supporting` : nothing}
            aria-invalid=${invalid ? 'true' : nothing}
            maxlength=${ifDefined(this.maxLength ?? undefined)}
            minlength=${ifDefined(this.minLength ?? undefined)}
            pattern=${ifDefined(this.pattern ?? undefined)}
            autocomplete=${ifDefined(this.autocomplete ?? undefined)}
            @focus=${this._handleFocus}
            @blur=${this._handleBlur}
            @input=${this._handleInput}
            @change=${this._handleChange}
          />
        </div>
        <div class="trailing-icon">
          <slot
            name="trailing-icon"
            @slotchange=${this._handleSlotChange}
          ></slot>
        </div>
        <div class="indicator"></div>
      </div>
      ${
        supportingText || this._showsCounter()
          ? html`
              <div
                class="supporting-row"
                id="${this._id}-supporting"
                ?error=${invalid}
              >
                <span class="supporting-text">${supportingText}</span>
                ${
                  this._showsCounter()
                    ? html`<span class="counter"
                        >${this.value.length}/${this.maxLength}</span
                      >`
                    : nothing
                }
              </div>
            `
          : nothing
      }
    `;
  }

  firstUpdated(): void {
    this._defaultValue = this.value;
    this._syncFormState();
  }

  updated(): void {
    this._syncFormState();
  }

  private _handleFocus(): void {
    this._focused = true;
  }

  private _handleBlur(): void {
    this._focused = false;
  }

  private _handleSlotChange(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    const hasContent = slot.assignedElements({ flatten: true }).length > 0;
    if (slot.name === 'leading-icon') this._hasLeadingIcon = hasContent;
    else this._hasTrailingIcon = hasContent;
  }

  private _handleInput(event: Event): void {
    event.stopPropagation();
    this.value = (event.target as HTMLInputElement).value;
    this.emitInput();
  }

  private _handleChange(event: Event): void {
    event.stopPropagation();
    this.value = (event.target as HTMLInputElement).value;
    this.emitChange();
  }

  private _showsCounter(): boolean {
    return this.showCounter && this.maxLength !== null && this.maxLength >= 0;
  }

  private _errorMessage(): string {
    if (this.error) return this.errorText || 'Invalid value.';
    return this._input?.validationMessage || 'Invalid value.';
  }

  private _syncFormState(): void {
    const input = this._input;
    const disabled = this.isFormDisabled;
    const flags = !disabled && input ? validityFlags(input.validity) : {};
    if (this.error && !disabled) flags.customError = true;
    const invalid = Object.keys(flags).length > 0;
    const message = invalid ? this._errorMessage() : '';
    this.setFormValue(disabled ? null : this.value, this.value);
    this.setFormValidity(flags, message, input);
    if (this._invalid !== invalid) this._invalid = invalid;
    if (this._validationMessage !== message) this._validationMessage = message;
  }

  protected resetFormControl(): void {
    this.value = this._defaultValue;
  }

  protected restoreFormControlState(
    state: string | File | FormData | null,
  ): void {
    if (typeof state === 'string') this.value = state;
  }

  focus(): void {
    this._input?.focus();
  }

  blur(): void {
    this._input?.blur();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-text-field': M3TextField;
  }
}
