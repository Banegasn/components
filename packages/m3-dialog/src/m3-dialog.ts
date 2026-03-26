import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { m3DialogStyles } from './m3-dialog.styles.js';

/**
 * Material Design 3 Dialog Component
 *
 * A modal dialog following Material Design 3 specifications.
 *
 * @fires dialog-open - Fired when the dialog opens
 * @fires dialog-close - Fired when the dialog closes
 *
 * @slot - Default slot for dialog body content
 * @slot icon - Optional icon displayed above the headline
 * @slot actions - Action buttons at the bottom
 *
 * @cssprop --md-sys-color-surface-container-high - Dialog surface color
 * @cssprop --md-sys-color-on-surface - Text color
 */
@customElement('m3-dialog')
export class M3Dialog extends LitElement {
  static styles = m3DialogStyles;

  /** Whether the dialog is open */
  @property({ type: Boolean, reflect: true }) open = false;

  /** Headline text */
  @property({ type: String }) headline = '';

  /** Close dialog when clicking the scrim */
  @property({ type: Boolean, attribute: 'close-on-scrim' }) closeOnScrim = true;

  render() {
    return html`
      <div class="scrim" ?open=${this.open} @click=${this._handleScrimClick}></div>
      <div class="dialog-container">
        <div
          class="dialog"
          ?open=${this.open}
          role="dialog"
          aria-modal="true"
          aria-label=${this.headline || ''}
          @keydown=${this._handleKeyDown}
        >
          <div class="icon-slot">
            <slot name="icon"></slot>
          </div>
          ${this.headline ? html`<h2 class="headline">${this.headline}</h2>` : ''}
          <div class="content">
            <slot></slot>
          </div>
          <div class="actions">
            <slot name="actions"></slot>
          </div>
        </div>
      </div>
    `;
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('open')) {
      if (this.open) {
        this._onOpen();
      } else if (changedProperties.get('open') === true) {
        this._onClose();
      }
    }
  }

  private _onOpen() {
    this.dispatchEvent(new CustomEvent('dialog-open', { bubbles: true, composed: true }));
    // Trap focus
    requestAnimationFrame(() => {
      const firstFocusable = this.shadowRoot?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    });
  }

  private _onClose() {
    this.dispatchEvent(new CustomEvent('dialog-close', { bubbles: true, composed: true }));
  }

  private _handleScrimClick() {
    if (this.closeOnScrim) {
      this.open = false;
    }
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      this.open = false;
    }
  }

  /** Opens the dialog */
  show() {
    this.open = true;
  }

  /** Closes the dialog */
  close() {
    this.open = false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-dialog': M3Dialog;
  }
}
