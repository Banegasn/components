import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { m3SwitchStyles } from './m3-switch.styles.js';

/**
 * Material Design 3 Switch Component
 * 
 * A switch component following Material Design 3 specifications that allows
 * users to toggle between on and off states.
 * 
 * @fires switch-change - Fired when the switch state changes
 * 
 * @cssprop --md-switch-track-width - Width of the switch track (default: 52px)
 * @cssprop --md-switch-track-height - Height of the switch track (default: 32px)
 * @cssprop --md-switch-thumb-size - Size of the switch thumb (default: 24px)
 * @cssprop --md-sys-color-primary - Primary color for the switch when on
 * @cssprop --md-sys-color-on-surface - Color for the switch track when off
 * @cssprop --md-sys-color-outline - Outline color for disabled state
 * @cssprop --md-sys-color-surface-container-highest - Surface color for disabled state
 */
@customElement('m3-switch')
export class M3Switch extends LitElement {
  static styles = m3SwitchStyles;

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
  @property({ type: String })
  name: string | null = null;

  /**
   * Value attribute for form submission
   */
  @property({ type: String })
  value: string | null = null;

  /**
   * Form attribute to associate switch with a form
   */
  @property({ type: String })
  form: string | null = null;

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

  render() {
    return html`
      <div
        class="switch-container"
        role="switch"
        aria-checked=${this.checked}
        aria-disabled=${this.disabled}
        aria-label=${this.ariaLabel || ''}
        aria-labelledby=${this.ariaLabelledBy || ''}
        tabindex=${this.disabled ? -1 : 0}
        @click=${this._handleClick}
        @keydown=${this._handleKeyDown}
        @keyup=${this._handleKeyUp}
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
        @mousedown=${this._handleMouseDown}
        @mouseup=${this._handleMouseUp}
      >
        <div class="track" ?checked=${this.checked} ?disabled=${this.disabled}>
          <div class="thumb" ?checked=${this.checked} ?disabled=${this.disabled} ?pressed=${this._pressed}>
            ${this.checked ? html`
              <svg class="checkmark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
              </svg>
            ` : ''}
          </div>
        </div>
      </div>
      <input
        type="checkbox"
        ?checked=${this.checked}
        ?disabled=${this.disabled}
        name=${this.name || ''}
        value=${this.value || ''}
        form=${this.form || ''}
        aria-hidden="true"
        tabindex="-1"
        @change=${this._handleInputChange}
      />
    `;
  }

  private _handleClick(e: MouseEvent) {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    this._toggle();
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (this.disabled) {
      return;
    }

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this._pressed = true;
    }
  }

  private _handleKeyUp(e: KeyboardEvent) {
    if (this.disabled) {
      return;
    }

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this._pressed = false;
      this._toggle();
    }
  }

  private _handleMouseEnter() {
    if (!this.disabled) {
      this._hovered = true;
    }
  }

  private _handleMouseLeave() {
    this._hovered = false;
    this._pressed = false;
  }

  private _handleMouseDown() {
    if (!this.disabled) {
      this._pressed = true;
    }
  }

  private _handleMouseUp() {
    this._pressed = false;
  }

  private _handleInputChange(e: Event) {
    // Sync with internal checkbox for form submission
    const input = e.target as HTMLInputElement;
    if (input.checked !== this.checked) {
      this.checked = input.checked;
    }
  }

  private _toggle() {
    this.checked = !this.checked;
    
    // Update the hidden input for form submission
    const input = this.shadowRoot?.querySelector('input[type="checkbox"]') as HTMLInputElement;
    if (input) {
      input.checked = this.checked;
    }

    this.dispatchEvent(new CustomEvent('switch-change', {
      bubbles: true,
      composed: true,
      detail: {
        checked: this.checked,
        name: this.name,
        value: this.value
      }
    }));
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

