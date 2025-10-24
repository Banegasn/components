import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { m3ButtonStyles } from './m3-button.styles.js';

/**
 * Material Design 3 Button Component
 * 
 * A flexible button component following Material Design 3 specifications with
 * support for multiple variants, icons, and accessibility features.
 * 
 * @fires button-click - Fired when the button is clicked
 * 
 * @slot - Default slot for button label text
 * @slot icon - Optional icon to display before the label
 * 
 * @cssprop --md-button-container-height - Height of the button (default: varies by size)
 * @cssprop --md-button-container-shape - Border radius (default: varies by shape)
 * @cssprop --md-button-label-text-size - Font size of label (default: varies by size)
 * @cssprop --md-button-label-text-weight - Font weight of label (default: 500)
 * @cssprop --md-button-icon-size - Size of the icon (default: varies by size)
 * @cssprop --md-button-spacing - Horizontal padding (default: varies by padding setting)
 * @cssprop --md-sys-color-primary - Primary color
 * @cssprop --md-sys-color-on-primary - Text color on primary
 * @cssprop --md-sys-color-secondary-container - Secondary container color
 * @cssprop --md-sys-color-on-secondary-container - Text color on secondary container
 * @cssprop --md-sys-color-surface-container-low - Surface color for elevated variant
 * @cssprop --md-sys-color-outline - Border color for outlined variant
 */
@customElement('m3-button')
export class M3Button extends LitElement {
  static styles = m3ButtonStyles;

  /**
   * Button variant style
   * - filled: Prominent button with solid background (default)
   * - elevated: Subtle button with elevation shadow
   * - tonal: Medium emphasis with tinted background
   * - outlined: Medium emphasis with border
   * - text: Low emphasis, no background
   */
  @property({ type: String, reflect: true })
  variant: 'filled' | 'elevated' | 'tonal' | 'outlined' | 'text' = 'filled';

  /**
   * Disables the button
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Shows a loading spinner and disables interaction
   */
  @property({ type: Boolean, reflect: true })
  loading = false;

  /**
   * Makes the button full width
   */
  @property({ type: Boolean, reflect: true, attribute: 'full-width' })
  fullWidth = false;

  /**
   * Makes the button icon-only (no label)
   */
  @property({ type: Boolean, reflect: true, attribute: 'icon-only' })
  iconOnly = false;

  /**
   * Button size - Material Design 3 expressive sizing
   * - extra-small: Compact size for dense layouts
   * - small: Default size (existing)
   * - medium: Larger for increased prominence
   * - large: Large for high emphasis
   * - extra-large: Maximum size for hero actions
   */
  @property({ type: String, reflect: true })
  size: 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large' = 'small';

  /**
   * Button shape style
   * - round: Fully rounded corners (default)
   * - square: Sharp corners with minimal rounding
   */
  @property({ type: String, reflect: true })
  shape: 'round' | 'square' = 'round';

  /**
   * Button padding style
   * - default: Standard 24dp padding (deprecated for small buttons)
   * - small: Compact 16dp padding (recommended for new designs)
   */
  @property({ type: String, reflect: true })
  padding: 'default' | 'small' = 'default';

  /**
   * Button type attribute for form submission
   */
  @property({ type: String })
  type: 'button' | 'submit' | 'reset' = 'button';

  /**
   * ARIA label for accessibility
   */
  @property({ type: String, attribute: 'aria-label' })
  ariaLabel: string | null = null;

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
   * Form attribute to associate button with a form
   */
  @property({ type: String })
  form: string | null = null;

  render() {
    return html`
      <button
        type=${this.type}
        ?disabled=${this.disabled || this.loading}
        aria-label=${this.ariaLabel || ''}
        aria-busy=${this.loading}
        name=${this.name || ''}
        value=${this.value || ''}
        form=${this.form || ''}
        @click=${this._handleClick}
      >
        ${this.loading ? html`<span class="loading-spinner"></span>` : ''}
        ${this._hasIcon() ? html`
          <span class="icon">
            <slot name="icon"></slot>
          </span>
        ` : ''}
        ${!this.iconOnly ? html`
          <span class="label">
            <slot></slot>
          </span>
        ` : ''}
      </button>
    `;
  }

  private _hasIcon(): boolean {
    return this.querySelector('[slot="icon"]') !== null;
  }

  private _handleClick(e: MouseEvent) {
    if (this.disabled || this.loading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    this.dispatchEvent(new CustomEvent('button-click', {
      bubbles: true,
      composed: true,
      detail: {
        variant: this.variant,
        size: this.size,
        shape: this.shape,
        padding: this.padding,
        name: this.name,
        value: this.value
      }
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
    'm3-button': M3Button;
  }
}

