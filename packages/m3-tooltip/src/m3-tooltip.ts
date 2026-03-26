import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { m3TooltipStyles } from './m3-tooltip.styles.js';

/**
 * Material Design 3 Tooltip Component
 *
 * @slot - Default slot for the trigger element
 *
 * @cssprop --md-sys-color-inverse-surface - Plain tooltip background
 * @cssprop --md-sys-color-inverse-on-surface - Plain tooltip text
 */
@customElement('m3-tooltip')
export class M3Tooltip extends LitElement {
  static styles = m3TooltipStyles;

  /** Tooltip text */
  @property({ type: String }) text = '';

  /** Variant: plain (default) or rich */
  @property({ type: String, reflect: true })
  variant: 'plain' | 'rich' = 'plain';

  /** Placement */
  @property({ type: String, reflect: true })
  placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

  @state() private _visible = false;
  private _showTimeout: ReturnType<typeof setTimeout> | null = null;
  private _hideTimeout: ReturnType<typeof setTimeout> | null = null;

  render() {
    return html`
      <div
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
        @focus=${this._handleFocus}
        @blur=${this._handleBlur}
      >
        <slot></slot>
      </div>
      <div
        class="tooltip-surface"
        role="tooltip"
        ?visible=${this._visible}
        aria-hidden=${!this._visible}
      >
        ${this.text}
      </div>
    `;
  }

  private _handleMouseEnter() {
    this._clearTimeouts();
    this._showTimeout = setTimeout(() => {
      this._visible = true;
    }, 500);
  }

  private _handleMouseLeave() {
    this._clearTimeouts();
    this._hideTimeout = setTimeout(() => {
      this._visible = false;
    }, 100);
  }

  private _handleFocus() {
    this._clearTimeouts();
    this._visible = true;
  }

  private _handleBlur() {
    this._clearTimeouts();
    this._visible = false;
  }

  private _clearTimeouts() {
    if (this._showTimeout) { clearTimeout(this._showTimeout); this._showTimeout = null; }
    if (this._hideTimeout) { clearTimeout(this._hideTimeout); this._hideTimeout = null; }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._clearTimeouts();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-tooltip': M3Tooltip;
  }
}
