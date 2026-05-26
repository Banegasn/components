import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { m3SnackbarStyles } from './m3-snackbar.styles.js';

/**
 * Material Design 3 Snackbar Component
 *
 * A transient message component with expressive entrance/exit animations,
 * auto-dismiss support, and action slot.
 *
 * @fires snackbar-dismiss - Fired when the snackbar is dismissed
 * @fires snackbar-action - Fired when the action button is clicked
 *
 * @slot - Default slot for the message text
 * @slot action - Optional action button/content
 *
 * @cssprop --md-sys-color-inverse-surface - Snackbar background color
 * @cssprop --md-sys-color-inverse-on-surface - Snackbar text color
 */
@customElement('m3-snackbar')
export class M3Snackbar extends LitElement {
  static styles = m3SnackbarStyles;

  /**
   * Snackbar message (alternative to default slot)
   */
  @property({ type: String })
  message = '';

  /**
   * Whether the snackbar is open/visible
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * Auto-dismiss duration in milliseconds.
   * Set to 0 to disable auto-dismiss.
   */
  @property({ type: Number })
  duration = 4000;

  /**
   * Number of lines for the message
   * - 1: Single line (default)
   * - 2: Two lines for longer messages
   */
  @property({ type: String, reflect: true })
  lines: '1' | '2' = '1';

  /**
   * ARIA live region politeness
   */
  @property({ type: String })
  live: 'polite' | 'assertive' = 'polite';

  private _dismissTimer: ReturnType<typeof setTimeout> | null = null;
  private _isLeaving = false;

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('open')) {
      if (this.open) {
        this._isLeaving = false;
        this._startDismissTimer();
      } else {
        this._clearDismissTimer();
      }
    }
  }

  private _startDismissTimer() {
    this._clearDismissTimer();
    if (this.duration > 0) {
      this._dismissTimer = setTimeout(() => {
        this.dismiss();
      }, this.duration);
    }
  }

  private _clearDismissTimer() {
    if (this._dismissTimer !== null) {
      clearTimeout(this._dismissTimer);
      this._dismissTimer = null;
    }
  }

  /**
   * Dismisses the snackbar with exit animation
   */
  dismiss() {
    if (!this.open || this._isLeaving) return;
    this._isLeaving = true;
    this.requestUpdate();

    // Wait for exit animation then close
    setTimeout(() => {
      this.open = false;
      this._isLeaving = false;
      this.dispatchEvent(new CustomEvent('snackbar-dismiss', {
        bubbles: true,
        composed: true
      }));
    }, 350);
  }

  /**
   * Shows the snackbar
   */
  show() {
    this.open = true;
  }

  private _handleActionClick(e: Event) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('snackbar-action', {
      bubbles: true,
      composed: true
    }));
    this.dismiss();
  }

  render() {
    if (!this.open) return html``;

    const hasAction = this.querySelector('[slot="action"]');

    return html`
      <div
        class="snackbar ${this._isLeaving ? 'leaving' : ''}"
        role="status"
        aria-live=${this.live}
        @click=${this.dismiss}
      >
        <span class="message">
          <slot>${this.message}</slot>
        </span>
        ${hasAction ? html`
          <span class="action" @click=${this._handleActionClick}>
            <slot name="action"></slot>
          </span>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-snackbar': M3Snackbar;
  }
}
