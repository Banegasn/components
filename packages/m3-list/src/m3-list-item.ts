import { LitElement, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { customElement, property } from 'lit/decorators.js';
import { m3ListItemStyles } from './m3-list-item.styles.js';

/**
 * Material Design 3 List Item Component
 *
 * A flexible list item supporting one, two, or three lines of text,
 * with leading and trailing content slots and expressive interactions.
 *
 * @fires item-click - Fired when the item is clicked
 * @fires item-select - Fired when the item's selected state changes
 *
 * @slot - Default slot for headline text
 * @slot supporting-text - Secondary line of text
 * @slot tertiary-text - Third line of text
 * @slot leading - Content at the start (icon, avatar, checkbox, radio)
 * @slot trailing - Content at the end (icon, badge, switch)
 *
 * @cssprop --md-sys-color-on-surface - Headline text color
 * @cssprop --md-sys-color-on-surface-variant - Supporting text color
 * @cssprop --md-sys-color-secondary-container - Selected background color
 * @cssprop --md-sys-color-on-secondary-container - Selected text color
 */
@customElement('m3-list-item')
export class M3ListItem extends LitElement {
  static styles = m3ListItemStyles;

  /**
   * Number of text lines
   * - 1: Single line (default, 56dp min-height)
   * - 2: Two lines (72dp min-height)
   * - 3: Three lines (88dp min-height)
   */
  @property({ type: String, reflect: true })
  lines: '1' | '2' | '3' = '1';

  /**
   * Whether the item is selected
   */
  @property({ type: Boolean, reflect: true })
  selected = false;

  /**
   * Whether the item is disabled
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Whether the item is clickable
   */
  @property({ type: Boolean, reflect: true })
  clickable = true;

  /**
   * Shape style
   * - default: No rounding (default)
   * - rounded: 12px rounding
   * - full: Fully rounded pill shape
   */
  @property({ type: String, reflect: true })
  shape: 'default' | 'rounded' | 'full' = 'default';

  /**
   * ARIA label for accessibility
   */
  @property({ type: String, attribute: 'aria-label' })
  ariaLabel: string | null = null;

  /**
   * Value for selection management
   */
  @property({ type: String })
  value: string | null = null;

  render() {
    const hasLeading = this.querySelector('[slot="leading"]');
    const hasTrailing = this.querySelector('[slot="trailing"]');
    const hasSupporting = this.querySelector('[slot="supporting-text"]');
    const hasTertiary = this.querySelector('[slot="tertiary-text"]');

    return html`
      <li
        class="item"
        role="listitem"
        tabindex=${this.clickable && !this.disabled ? '0' : '-1'}
        aria-selected=${ifDefined(this.selected ? 'true' : undefined)}
        aria-label=${this.ariaLabel || ''}
        aria-disabled=${this.disabled}
        @click=${this._handleClick}
        @keydown=${this._handleKeydown}
      >
        <div class="state-layer"></div>
        ${hasLeading ? html`
          <div class="leading">
            <slot name="leading"></slot>
          </div>
        ` : ''}
        <div class="content">
          <span class="headline"><slot></slot></span>
          ${hasSupporting ? html`<span class="supporting-text"><slot name="supporting-text"></slot></span>` : ''}
          ${hasTertiary ? html`<span class="tertiary-text"><slot name="tertiary-text"></slot></span>` : ''}
        </div>
        ${hasTrailing ? html`
          <div class="trailing">
            <slot name="trailing"></slot>
          </div>
        ` : ''}
      </li>
    `;
  }

  private _handleClick() {
    if (this.disabled || !this.clickable) return;

    this.dispatchEvent(new CustomEvent('item-click', {
      bubbles: true,
      composed: true,
      detail: { value: this.value, selected: this.selected }
    }));

    this.dispatchEvent(new CustomEvent('item-select', {
      bubbles: true,
      composed: true,
      detail: { value: this.value, selected: !this.selected }
    }));
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleClick();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-list-item': M3ListItem;
  }
}
