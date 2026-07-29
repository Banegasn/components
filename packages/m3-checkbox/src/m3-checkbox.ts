import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { FormAssociatedElement } from '@banegasn/m3-form-associated';
import { m3CheckboxStyles } from './m3-checkbox.styles.js';

/**
 * Material Design 3 Checkbox Component
 * 
 * A checkbox component following Material Design 3 specifications.
 * 
 * Emits native `input` and `change` events when the checked state changes.
 */
@customElement('m3-checkbox')
export class M3Checkbox extends FormAssociatedElement {
  static styles = m3CheckboxStyles;
  static readonly formAssociated = true;

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) indeterminate = false;
  @property({ type: String, reflect: true }) name: string | null = null;
  @property({ type: String, reflect: true }) value: string | null = null;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: String, attribute: 'aria-label' }) ariaLabel: string | null = null;

  @state() private _pressed = false;
  @state() private _hovered = false;
  private _defaultChecked = false;
  private _defaultIndeterminate = false;

  render() {
    return html`
      <div
        class="checkbox-container"
        role="checkbox"
        aria-checked=${this.indeterminate ? 'mixed' : this.checked}
        aria-disabled=${this.isFormDisabled}
        aria-label=${this.ariaLabel || ''}
        tabindex=${this.isFormDisabled ? -1 : 0}
        @click=${this._handleClick}
        @keydown=${this._handleKeyDown}
        @keyup=${this._handleKeyUp}
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
        @mousedown=${this._handleMouseDown}
        @mouseup=${this._handleMouseUp}
      >
        <div class="state-layer"></div>
        <div class="outline" ?checked=${this.checked} ?disabled=${this.isFormDisabled} ?indeterminate=${this.indeterminate}>
          <div class="background" ?checked=${this.checked} ?disabled=${this.isFormDisabled} ?indeterminate=${this.indeterminate}>
            ${this.indeterminate
              ? html`<svg class="icon" viewBox="0 0 18 18"><rect x="4" y="8" width="10" height="2" fill="currentColor"/></svg>`
              : this.checked
                ? html`<svg class="icon" viewBox="0 0 18 18"><path d="M7 13.5L3 9.5l1.4-1.4L7 10.7l7.6-7.6L16 4.5l-9 9z" fill="currentColor"/></svg>`
                : ''}
          </div>
        </div>
      </div>
    `;
  }

  firstUpdated(): void {
    this._defaultChecked = this.checked;
    this._defaultIndeterminate = this.indeterminate;
    this._syncFormState();
  }

  updated(): void {
    this._syncFormState();
  }

  private _handleClick(e: MouseEvent) {
    if (this.isFormDisabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    this._toggle();
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (this.isFormDisabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this._pressed = true;
    }
  }

  private _handleKeyUp(e: KeyboardEvent) {
    if (this.isFormDisabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this._pressed = false;
      this._toggle();
    }
  }

  private _handleMouseEnter() {
    if (!this.isFormDisabled) this._hovered = true;
  }

  private _handleMouseLeave() {
    this._hovered = false;
    this._pressed = false;
  }

  private _handleMouseDown() {
    if (!this.isFormDisabled) this._pressed = true;
  }

  private _handleMouseUp() {
    this._pressed = false;
  }

  private _toggle() {
    if (this.indeterminate) {
      this.indeterminate = false;
      this.checked = true;
    } else {
      this.checked = !this.checked;
    }
    
    this.emitInput();
    this.emitChange();
  }

  private _syncFormState(): void {
    const disabled = this.isFormDisabled;
    this.setFormValue(!disabled && this.checked ? this.value ?? 'on' : null, this.checked ? 'checked' : 'unchecked');
    this.setFormValidity(
      !disabled && this.required && !this.checked ? { valueMissing: true } : {},
      !disabled && this.required && !this.checked ? 'Please check this box.' : '',
      this.shadowRoot?.querySelector<HTMLElement>('.checkbox-container') ?? undefined,
    );
  }

  protected resetFormControl(): void {
    this.checked = this._defaultChecked;
    this.indeterminate = this._defaultIndeterminate;
  }

  protected restoreFormControlState(state: string | File | FormData | null): void {
    if (typeof state === 'string') {
      this.checked = state === 'checked';
      this.indeterminate = false;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-checkbox': M3Checkbox;
  }
}
