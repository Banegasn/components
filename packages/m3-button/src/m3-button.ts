import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { FormAssociatedElement } from '@banegasn/m3-form-associated';
import { m3ButtonStyles } from './m3-button.styles.js';

/**
 * Material Design 3 Button Component
 *
 * A flexible button component following Material Design 3 specifications with
 * support for multiple variants, icons, and accessibility features.
 *
 * Native click semantics are exposed on the host. Submit and reset types act
 * on the owner form selected by the host's native `form` attribute.
 *
 * @slot - Default slot for button label text
 * @slot icon - Optional icon to display before the label
 *
 * @cssprop --md-comp-button-container-height - Height of the button (default: varies by size)
 * @cssprop --md-comp-button-container-shape - Border radius (default: varies by shape)
 * @cssprop --md-comp-button-label-text-size - Font size of label (default: varies by size)
 * @cssprop --md-comp-button-label-text-weight - Font weight of label (default: 500)
 * @cssprop --md-comp-button-icon-size - Size of the icon (default: varies by size)
 * @cssprop --md-comp-button-spacing - Horizontal padding (default: varies by padding setting)
 * @cssprop --md-sys-color-primary - Primary color
 * @cssprop --md-sys-color-on-primary - Text color on primary
 * @cssprop --md-sys-color-secondary-container - Secondary container color
 * @cssprop --md-sys-color-on-secondary-container - Text color on secondary container
 * @cssprop --md-sys-color-surface-container-low - Surface color for elevated variant
 * @cssprop --md-sys-color-outline - Border color for outlined variant
 */
@customElement('m3-button')
export class M3Button extends FormAssociatedElement {
  static styles = m3ButtonStyles;
  static readonly formAssociated = true;

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
  @property({ type: String, reflect: true })
  type: 'button' | 'submit' | 'reset' = 'button';

  /**
   * ARIA label for accessibility
   */
  @property({ type: String, attribute: 'aria-label' })
  ariaLabel: string | null = null;

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

  @state()
  private _hasIcon = false;

  render() {
    return html`
      <button
        type="button"
        ?disabled=${this.isFormDisabled || this.loading}
        aria-label=${this.ariaLabel || nothing}
        aria-busy=${this.loading ? 'true' : nothing}
        @click=${this._handleClick}
      >
        ${this.loading ? html`<span class="loading-spinner"></span>` : ''}
        <span class="icon" ?hidden=${!this._hasIcon}>
          <slot name="icon" @slotchange=${this._handleIconSlotChange}></slot>
        </span>
        ${!this.iconOnly ? html`
          <span class="label">
            <slot></slot>
          </span>
        ` : ''}
      </button>
    `;
  }

  firstUpdated() {
    this._hasIcon = this._slotHasContent('icon');
  }

  private _handleIconSlotChange = () => {
    queueMicrotask(() => {
      this._hasIcon = this._slotHasContent('icon');
    });
  };

  private _slotHasContent(name: string): boolean {
    return this.shadowRoot
      ?.querySelector<HTMLSlotElement>(`slot[name="${name}"]`)
      ?.assignedNodes({ flatten: true })
      .some((node) => node.nodeType === Node.ELEMENT_NODE || (node.textContent ?? '').trim().length > 0) ?? false;
  }

  private _handleClick(e: MouseEvent) {
    if (this.isFormDisabled || this.loading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    this._performFormAction();
  }

  private _performFormAction(): void {
    if (this.type === 'submit') {
      this.form?.requestSubmit();
    } else if (this.type === 'reset') {
      this.form?.reset();
    }
  }

  protected resetFormControl(): void {
    // Native buttons have no mutable form value to reset.
  }

  protected restoreFormControlState(
    _state: string | File | FormData | null,
  ): void {
    // Native buttons have no restorable form state.
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

  click(): void {
    if (!this.isFormDisabled && !this.loading) {
      super.click();
      this._performFormAction();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-button': M3Button;
  }
}
