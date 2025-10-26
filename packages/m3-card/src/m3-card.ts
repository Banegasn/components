import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { m3CardStyles } from './m3-card.styles';

/**
 * Material Design 3 Card Component
 * 
 * A flexible card component following Material Design 3 specifications.
 * Cards contain content and actions about a single subject.
 * 
 * Based on official Material 3 guidelines:
 * https://m3.material.io/components/cards/guidelines
 * 
 * @fires card-click - Fired when the card is clicked (if clickable)
 * 
 * @slot - Default slot for card content
 * @slot header - Optional header content (e.g., title, subtitle)
 * @slot media - Optional media content (e.g., image, video)
 * @slot actions - Optional action buttons at the bottom
 * 
 * @cssprop --md-card-container-shape - Border radius (default: 12px for medium shape)
 * @cssprop --md-card-container-color - Background color
 * @cssprop --md-card-elevation - Box shadow elevation
 * @cssprop --md-sys-color-surface-container-low - Elevated card surface
 * @cssprop --md-sys-color-surface-container-highest - Filled card surface
 * @cssprop --md-sys-color-surface - Outlined card surface
 * @cssprop --md-sys-color-outline-variant - Outlined card border
 */
@customElement('m3-card')
export class M3Card extends LitElement {
  static styles = m3CardStyles;

  /**
   * Card variant style
   * - elevated: Card with subtle elevation shadow (default)
   * - filled: Card with solid filled background
   * - outlined: Card with border outline
   */
  @property({ type: String, reflect: true })
  variant: 'elevated' | 'filled' | 'outlined' = 'elevated';

  /**
   * Makes the card clickable/interactive
   */
  @property({ type: Boolean, reflect: true })
  clickable = false;

  /**
   * Disables the card interaction
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Shows the card in dragged state
   */
  @property({ type: Boolean, reflect: true })
  dragged = false;

  /**
   * Card width - controls responsive behavior
   * - auto: Natural width based on content (default)
   * - full: Full width of container
   * - fixed: Fixed width (specify with CSS)
   */
  @property({ type: String, reflect: true })
  width: 'auto' | 'full' | 'fixed' = 'auto';

  /**
   * ARIA label for accessibility (required if clickable)
   */
  @property({ type: String, attribute: 'aria-label' })
  ariaLabel: string | null = null;

  /**
   * ARIA role (automatically set to 'button' if clickable)
   */
  @property({ type: String, reflect: true })
  role: string | null = null;

  render() {
    const role = this.clickable ? (this.role || 'button') : this.role;
    const tabindex = this.clickable && !this.disabled ? '0' : undefined;
    
    return html`
      <div
        class="card"
        role=${role || ''}
        tabindex=${tabindex || ''}
        aria-label=${this.ariaLabel || ''}
        aria-disabled=${this.disabled}
        @click=${this._handleClick}
        @keydown=${this._handleKeyDown}
      >
        <div class="card-media">
          <slot name="media"></slot>
        </div>
        
        <div class="card-header">
          <slot name="header"></slot>
        </div>
        
        <div class="card-content">
          <slot></slot>
        </div>
        
        <div class="card-actions">
          <slot name="actions"></slot>
        </div>
      </div>
    `;
  }

  private _handleClick(e: MouseEvent) {
    if (this.disabled || !this.clickable) {
      return;
    }

    this.dispatchEvent(new CustomEvent('card-click', {
      bubbles: true,
      composed: true,
      detail: {
        variant: this.variant,
        width: this.width
      }
    }));
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (this.disabled || !this.clickable) {
      return;
    }

    // Handle Enter and Space key for accessibility
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleClick(e as any);
    }
  }

  /**
   * Focuses the card (if clickable)
   */
  focus() {
    (this.shadowRoot?.querySelector('.card') as HTMLElement)?.focus();
  }

  /**
   * Removes focus from the card
   */
  blur() {
    (this.shadowRoot?.querySelector('.card') as HTMLElement)?.blur();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-card': M3Card;
  }
}

