import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { customElement, property, state, query } from 'lit/decorators.js';
import {
  FormAssociatedElement,
  validityFlags,
} from '@banegasn/m3-form-associated';
import { m3SearchBarStyles } from './m3-search-bar.styles.js';

/** Material Design 3 search bar with native form participation. */
@customElement('m3-search-bar')
export class M3SearchBar extends FormAssociatedElement {
  static styles = m3SearchBarStyles;
  static readonly formAssociated = true;

  @property({ type: String }) placeholder = 'Search';
  @property({ type: String, reflect: true }) value = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String, reflect: true }) name: string | null = null;
  @property({ type: String, attribute: 'aria-label' }) ariaLabel:
    string | null = null;
  @property({ type: String, attribute: 'aria-labelledby' }) ariaLabelledBy:
    string | null = null;
  @property({ type: Number, attribute: 'maxlength' }) maxLength: number | null =
    null;
  @property({ type: Number, attribute: 'minlength' }) minLength: number | null =
    null;
  @property({ type: String }) pattern: string | null = null;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: String }) autocomplete: string | null = null;

  @state() private _focused = false;
  @query('.input-field') private _input!: HTMLInputElement;
  private _defaultValue = '';

  render() {
    return html`
      <div class="search-container">
        <div
          class="search-bar"
          ?disabled=${this.isFormDisabled}
          @focusin=${this._handleFocusIn}
          @focusout=${this._handleFocusOut}
        >
          <div class="leading-slot"><slot name="leading"></slot></div>
          <div class="input-wrapper">
            <input
              type="search"
              role="searchbox"
              class="input-field"
              .value=${this.value}
              placeholder=${this.placeholder}
              ?disabled=${this.isFormDisabled}
              ?required=${this.required}
              aria-label=${this.ariaLabel || nothing}
              aria-labelledby=${this.ariaLabelledBy || nothing}
              maxlength=${ifDefined(this.maxLength ?? undefined)}
              minlength=${ifDefined(this.minLength ?? undefined)}
              pattern=${ifDefined(this.pattern ?? undefined)}
              autocomplete=${ifDefined(this.autocomplete ?? undefined)}
              @input=${this._handleInput}
              @keydown=${this._handleKeyDown}
              @change=${this._handleChange}
            />
          </div>
          <div class="trailing-slot"><slot name="trailing"></slot></div>
        </div>
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

  private _handleInput(event: Event): void {
    event.stopPropagation();
    this.value = (event.target as HTMLInputElement).value;
    this.emitInput();
  }

  private _handleKeyDown(event: KeyboardEvent): void {
    if (this.isFormDisabled) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      this.form?.requestSubmit();
    } else if (event.key === 'Escape' && this.value) {
      this._clear();
    }
  }

  private _handleChange(event: Event): void {
    event.stopPropagation();
    this.value = (event.target as HTMLInputElement).value;
    this.emitChange();
  }

  private _handleFocusIn(): void {
    this._focused = true;
  }

  private _handleFocusOut(): void {
    this._focused = false;
  }

  private _clear(): void {
    if (this.value === '') return;
    this.value = '';
    this.emitInput();
    this.emitChange();
  }

  private _syncFormState(): void {
    const flags =
      !this.isFormDisabled && this._input
        ? validityFlags(this._input.validity)
        : {};
    if (this.value) delete flags.valueMissing;
    else if (this.required && !this.isFormDisabled) flags.valueMissing = true;
    const invalid = Object.keys(flags).length > 0;
    this.setFormValue(this.isFormDisabled ? null : this.value, this.value);
    this.setFormValidity(
      flags,
      invalid ? this._input.validationMessage : '',
      this._input,
    );
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

  clear(): void {
    this._clear();
  }

  getValue(): string {
    return this.value;
  }

  setValue(value: string): void {
    this.value = value;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-search-bar': M3SearchBar;
  }
}
