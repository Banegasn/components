import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { m3ChipStyles } from './m3-chip.styles.js';

/**
 * Material Design 3 Chip Component
 *
 * @fires chip-click - Fired when the chip is clicked
 * @fires chip-remove - Fired when the trailing remove icon is clicked (input chips)
 * @fires chip-select - Fired when a filter chip's selected state changes
 *
 * @slot - Default slot for label text
 * @slot icon - Leading icon
 *
 * @cssprop --md-sys-color-outline - Border color
 * @cssprop --md-sys-color-on-surface - Text color
 * @cssprop --md-sys-color-secondary-container - Selected filter chip background
 */
@customElement('m3-chip')
export class M3Chip extends LitElement {
  static styles = m3ChipStyles;

  /** Chip variant */
  @property({ type: String, reflect: true })
  variant: 'assist' | 'filter' | 'input' | 'suggestion' = 'assist';

  /** Whether the chip is selected (filter chips) */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** Whether the chip is disabled */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Whether the chip has elevated style */
  @property({ type: Boolean, reflect: true }) elevated = false;

  /** Whether the chip can be removed (shows trailing X icon for input chips) */
  @property({ type: Boolean, reflect: true }) removable = false;

  /** ARIA label */
  @property({ type: String, attribute: 'aria-label' }) ariaLabel: string | null = null;

  render() {
    const hasIcon = this.querySelector('[slot="icon"]');
    const showLeadingIcon = (this.variant === 'filter' && this.selected) || hasIcon;

    return html`
      <button
        class="chip"
        ?disabled=${this.disabled}
        role=${this.variant === 'filter' ? 'option' : 'button'}
        aria-selected=${this.variant === 'filter' ? this.selected : undefined as any}
        aria-label=${this.ariaLabel || ''}
        @click=${this._handleClick}
      >
        ${showLeadingIcon ? html`
          <span class="leading-icon">
            ${this.variant === 'filter' && this.selected
              ? html`<svg class="checkmark" viewBox="0 0 18 18" width="18" height="18"><path d="M7 13.5L3 9.5l1.4-1.4L7 10.7l7.6-7.6L16 4.5l-9 9z" fill="currentColor"/></svg>`
              : html`<slot name="icon"></slot>`
            }
          </span>
        ` : ''}

        <span class="label">
          <slot></slot>
        </span>

        ${this.removable ? html`
          <span class="trailing-icon" @click=${this._handleRemove}>
            <svg viewBox="0 0 18 18" width="18" height="18"><path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" fill="currentColor"/></svg>
          </span>
        ` : ''}
        <div class="state-layer"></div>
      </button>
    `;
  }

  private _handleClick() {
    if (this.disabled) return;

    if (this.variant === 'filter') {
      this.selected = !this.selected;
      this.dispatchEvent(new CustomEvent('chip-select', {
        bubbles: true,
        composed: true,
        detail: { selected: this.selected }
      }));
    }

    this.dispatchEvent(new CustomEvent('chip-click', {
      bubbles: true,
      composed: true,
      detail: { variant: this.variant, selected: this.selected }
    }));
  }

  private _handleRemove(e: Event) {
    e.stopPropagation();
    if (this.disabled) return;

    this.dispatchEvent(new CustomEvent('chip-remove', {
      bubbles: true,
      composed: true
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-chip': M3Chip;
  }
}
