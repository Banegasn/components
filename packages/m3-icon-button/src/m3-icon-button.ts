import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { m3IconButtonStyles } from './m3-icon-button.styles.js';

/**
 * Material Design 3 Icon Button Component
 *
 * An expressive icon button with multiple variants, press animations,
 * and toggle/selection support.
 *
 * @fires icon-button-click - Fired when the button is clicked
 * @fires icon-button-toggle - Fired when the button's selected state changes
 *
 * @slot - Default slot for the icon content
 *
 * @cssprop --md-sys-color-on-surface-variant - Icon color for standard variant
 * @cssprop --md-sys-color-primary - Background for filled/selected variant
 * @cssprop --md-sys-color-on-primary - Icon color on primary background
 * @cssprop --md-sys-color-secondary-container - Background for tonal variant
 * @cssprop --md-sys-color-on-secondary-container - Icon color on tonal background
 * @cssprop --md-sys-color-outline - Border color for outlined variant
 */
@customElement('m3-icon-button')
export class M3IconButton extends LitElement {
  static styles = m3IconButtonStyles;

  /**
   * Button variant
   * - standard: Transparent background with icon (default)
   * - filled: Solid primary background
   * - tonal: Secondary container background
   * - outlined: Transparent with outline border
   */
  @property({ type: String, reflect: true })
  variant: 'standard' | 'filled' | 'tonal' | 'outlined' = 'standard';

  /**
   * Disables the button
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Whether the button is selected (for toggle behavior)
   */
  @property({ type: Boolean, reflect: true })
  selected = false;

  /**
   * Enables toggle behavior (clicking toggles selected state)
   */
  @property({ type: Boolean, reflect: true })
  toggle = false;

  /**
   * Button size
   * - small: 32px (default)
   * - medium: 40px
   * - large: 48px
   */
  @property({ type: String, reflect: true })
  size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * ARIA label for accessibility (required for icon-only buttons)
   */
  @property({ type: String, attribute: 'aria-label' })
  ariaLabel: string | null = null;

  /**
   * Type attribute for form submission
   */
  @property({ type: String })
  type: 'button' | 'submit' | 'reset' = 'button';

  render() {
    return html`
      <button
        class="icon-button"
        type=${this.type}
        ?disabled=${this.disabled}
        aria-label=${this.ariaLabel || ''}
        aria-pressed=${this.toggle ? this.selected : undefined as any}
        @click=${this._handleClick}
      >
        <span class="icon">
          <slot></slot>
        </span>
      </button>
    `;
  }

  private _handleClick(e: MouseEvent) {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (this.toggle) {
      this.selected = !this.selected;
      this.dispatchEvent(new CustomEvent('icon-button-toggle', {
        bubbles: true,
        composed: true,
        detail: { selected: this.selected }
      }));
    }

    this.dispatchEvent(new CustomEvent('icon-button-click', {
      bubbles: true,
      composed: true,
      detail: { variant: this.variant, selected: this.selected }
    }));
  }

  /**
   * Focuses the button
   */
  focus() {
    this.shadowRoot?.querySelector('button')?.focus();
  }

  /**
   * Removes focus from the button
   */
  blur() {
    this.shadowRoot?.querySelector('button')?.blur();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-icon-button': M3IconButton;
  }
}
