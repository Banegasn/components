import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { customElement, property, state, query } from 'lit/decorators.js';
import { FormAssociatedElement, validityFlags } from '@banegasn/m3-form-associated';
import { m3TextFieldStyles } from './m3-text-field.styles.js';

@customElement('m3-text-field')
export class M3TextField extends FormAssociatedElement {
  static styles = m3TextFieldStyles;
  static readonly formAssociated = true;

  @property({ type: String }) type = 'text';
  @property({ type: String }) label = '';
  @property({ type: String, reflect: true }) value = '';
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String, reflect: true }) name: string | null = null;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Number, attribute: 'maxlength' }) maxLength: number | null = null;
  @property({ type: Number, attribute: 'minlength' }) minLength: number | null = null;
  @property({ type: String }) pattern: string | null = null;
  
  @state() private _focused = false;
  @query('input') inputEl!: HTMLInputElement;
  private _defaultValue = '';

  render() {
    return html`
      <div class="field-container" ?focused=${this._focused} ?has-value=${!!this.value}>
        <div class="state-layer"></div>
        <div class="label-wrapper">
          ${this.label ? html`<label class="label">${this.label}</label>` : ''}
        </div>
        <input
          class="input"
          type=${this.type}
          .value=${this.value}
          ?disabled=${this.isFormDisabled}
          ?required=${this.required}
          placeholder=${this.placeholder}
          maxlength=${ifDefined(this.maxLength ?? undefined)}
          minlength=${ifDefined(this.minLength ?? undefined)}
          pattern=${ifDefined(this.pattern ?? undefined)}
          @focus=${this._handleFocus}
          @blur=${this._handleBlur}
          @input=${this._handleInput}
          @change=${this._handleChange}
        />
        <div class="indicator"></div>
      </div>
    `;
  }

  firstUpdated(): void {
    this._defaultValue = this.value;
    this._syncFormState();
  }

  updated(): void {
    this._syncFormState();
  }

  private _handleFocus() {
    this._focused = true;
  }

  private _handleBlur() {
    this._focused = false;
  }

  private _handleInput(e: Event) {
    e.stopPropagation();
    const target = e.target as HTMLInputElement;
    this.value = target.value;
    this.emitInput();
  }

  private _handleChange(e: Event) {
    e.stopPropagation();
    const target = e.target as HTMLInputElement;
    this.value = target.value;
    this.emitChange();
  }

  private _syncFormState(): void {
    const input = this.inputEl;
    const flags = !this.isFormDisabled && input ? validityFlags(input.validity) : {};
    if (this.value) delete flags.valueMissing;
    else if (this.required && !this.isFormDisabled) flags.valueMissing = true;
    const invalid = Object.keys(flags).length > 0;
    this.setFormValue(this.isFormDisabled ? null : this.value, this.value);
    this.setFormValidity(
      flags,
      invalid ? input.validationMessage : '',
      input,
    );
  }

  protected resetFormControl(): void {
    this.value = this._defaultValue;
  }

  protected restoreFormControlState(state: string | File | FormData | null): void {
    if (typeof state === 'string') this.value = state;
  }

  focus() {
    this.inputEl?.focus();
  }
}


declare global {
  interface HTMLElementTagNameMap {
    'm3-text-field': M3TextField;
  }
}
