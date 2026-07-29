import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { FormAssociatedElement } from '@banegasn/m3-form-associated';
import { m3SwitchStyles } from './m3-switch.styles.js';

/**
 * Material Design 3 Switch Component
 * 
 * A switch component following Material Design 3 specifications that allows
 * users to toggle between on and off states.
 * 
 * Emits native `input` and `change` events when the checked state changes.
 * 
 * @cssprop --md-comp-switch-track-width - Width of the switch track (default: 52px)
 * @cssprop --md-comp-switch-track-height - Height of the switch track (default: 32px)
 * @cssprop --md-comp-switch-thumb-size - Size of the switch thumb (default: 24px)
 * @cssprop --md-sys-color-primary - Primary color for the switch when on
 * @cssprop --md-sys-color-on-surface - Color for the switch track when off
 * @cssprop --md-sys-color-outline - Outline color for disabled state
 * @cssprop --md-sys-color-surface-container-highest - Surface color for disabled state
 */
@customElement('m3-switch')
export class M3Switch extends FormAssociatedElement {
  static styles = m3SwitchStyles;
  static readonly formAssociated = true;

  /**
   * Whether the switch is checked (on)
   */
  @property({ type: Boolean, reflect: true })
  checked = false;

  /**
   * Disables the switch
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Name attribute for form submission
   */
  @property({ type: String, reflect: true })
  name: string | null = null;

  /**
   * Value attribute for form submission
   */
  @property({ type: String, reflect: true })
  value: string | null = null;

  @property({ type: Boolean, reflect: true })
  required = false;

  /**
   * ARIA label for accessibility
   */
  @property({ type: String, attribute: 'aria-label' })
  ariaLabel: string | null = null;

  /**
   * ARIA labelled by for accessibility
   */
  @property({ type: String, attribute: 'aria-labelledby' })
  ariaLabelledBy: string | null = null;

  /**
   * Internal state for pressed/active visual feedback
   */
  @state()
  private _pressed = false;

  /**
   * Internal state for hover visual feedback
   */
  @state()
  private _hovered = false;
  private _defaultChecked = false;

  render() {
    return html`
      <div
        class="switch-container"
        role="switch"
        aria-checked=${this.checked}
        aria-disabled=${this.isFormDisabled}
        aria-label=${this.ariaLabel || ''}
        aria-labelledby=${this.ariaLabelledBy || ''}
        tabindex=${this.isFormDisabled ? -1 : 0}
        @click=${this._handleClick}
        @keydown=${this._handleKeyDown}
        @keyup=${this._handleKeyUp}
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
        @mousedown=${this._handleMouseDown}
        @mouseup=${this._handleMouseUp}
      >
        <div class="track" ?checked=${this.checked} ?disabled=${this.isFormDisabled}>
          <div class="thumb" ?checked=${this.checked} ?disabled=${this.isFormDisabled} ?pressed=${this._pressed}>
            ${this.checked ? html`
              <svg class="checkmark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
              </svg>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  firstUpdated(): void {
    this._defaultChecked = this.checked;
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
    if (this.isFormDisabled) {
      return;
    }

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this._pressed = true;
    }
  }

  private _handleKeyUp(e: KeyboardEvent) {
    if (this.isFormDisabled) {
      return;
    }

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this._pressed = false;
      this._toggle();
    }
  }

  private _handleMouseEnter() {
    if (!this.isFormDisabled) {
      this._hovered = true;
    }
  }

  private _handleMouseLeave() {
    this._hovered = false;
    this._pressed = false;
  }

  private _handleMouseDown() {
    if (!this.isFormDisabled) {
      this._pressed = true;
    }
  }

  private _handleMouseUp() {
    this._pressed = false;
  }

  private _toggle() {
    this.checked = !this.checked;
    this.emitInput();
    this.emitChange();
  }

  private _syncFormState(): void {
    const disabled = this.isFormDisabled;
    this.setFormValue(!disabled && this.checked ? this.value ?? 'on' : null, this.checked ? 'checked' : 'unchecked');
    this.setFormValidity(
      !disabled && this.required && !this.checked ? { valueMissing: true } : {},
      !disabled && this.required && !this.checked ? 'Please turn this switch on.' : '',
      this.shadowRoot?.querySelector<HTMLElement>('.switch-container') ?? undefined,
    );
  }

  protected resetFormControl(): void {
    this.checked = this._defaultChecked;
  }

  protected restoreFormControlState(state: string | File | FormData | null): void {
    if (typeof state === 'string') {
      this.checked = state === 'checked';
    }
  }

  /**
   * Focuses the switch
   */
  focus() {
    (this.shadowRoot?.querySelector('.switch-container') as HTMLElement)?.focus();
  }

  /**
   * Removes focus from the switch
   */
  blur() {
    (this.shadowRoot?.querySelector('.switch-container') as HTMLElement)?.blur();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-switch': M3Switch;
  }
}
