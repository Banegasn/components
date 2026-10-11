import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { m3SnackbarStyles } from './m3-snackbar.styles.js';
import { motionDuration } from './motion-duration.js';

export type M3SnackbarDismissReason =
  'timeout' | 'action' | 'programmatic' | 'replacement';

/**
 * Material Design 3 Snackbar Component
 *
 * A transient message component with expressive entrance/exit animations,
 * auto-dismiss support, and action slot.
 *
 * @fires snackbar-dismiss - Fired once when the snackbar is dismissed. Its
 * detail contains the dismissal reason.
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
  private _exitController: AbortController | null = null;
  private _exitGeneration = 0;
  private _closingInternally = false;
  private _isLeaving = false;

  @state()
  private _hasAction = false;

  connectedCallback() {
    super.connectedCallback();
    if (this.open && !this._isLeaving) {
      this._startDismissTimer();
    }
  }

  disconnectedCallback() {
    this._clearDismissTimer();
    this._cancelExit();
    super.disconnectedCallback();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('open')) {
      if (this.open) {
        this._closingInternally = false;
        this._cancelExit();
        this._startDismissTimer();
      } else {
        this._clearDismissTimer();
        this._cancelExit();
        if (this._closingInternally) {
          this._closingInternally = false;
        } else {
          this._dispatchDismiss('programmatic');
        }
      }
    }

    // A duration change restarts the full timer from the change. A snackbar
    // that is already leaving keeps the dismissal that initiated its exit.
    if (changedProperties.has('duration') && this.open && !this._isLeaving) {
      this._startDismissTimer();
    }
  }

  private _startDismissTimer() {
    this._clearDismissTimer();
    if (this.duration > 0) {
      this._dismissTimer = setTimeout(() => {
        this._dismissTimer = null;
        this.dismiss('timeout');
      }, this.duration);
    }
  }

  private _clearDismissTimer() {
    if (this._dismissTimer !== null) {
      clearTimeout(this._dismissTimer);
      this._dismissTimer = null;
    }
  }

  /** Dismisses the snackbar after its exit animation completes. */
  dismiss(reason: M3SnackbarDismissReason = 'programmatic') {
    if (!this.open || this._isLeaving) return;
    this._isLeaving = true;
    this._clearDismissTimer();
    this.requestUpdate();

    void this._waitForExitAnimation(reason);
  }

  private async _waitForExitAnimation(reason: M3SnackbarDismissReason) {
    const generation = ++this._exitGeneration;
    await this.updateComplete;

    if (
      !this.open ||
      !this._isLeaving ||
      generation !== this._exitGeneration ||
      !this.isConnected
    ) {
      return;
    }

    const snackbar = this.shadowRoot?.querySelector('.snackbar');
    // Reduced motion has no animation to await. Otherwise, lifecycle state is
    // committed by the exit animation itself rather than a guessed timeout.
    if (!snackbar || motionDuration(snackbar, '--_animation-duration') === 0) {
      this._finishDismissal(reason, generation);
      return;
    }

    const controller = new AbortController();
    this._exitController = controller;
    const finish = (event: Event) => {
      if (
        event.target === snackbar &&
        (event as AnimationEvent).animationName === 'snackbar-exit'
      ) {
        this._finishDismissal(reason, generation);
      }
    };
    snackbar.addEventListener('animationend', finish, {
      signal: controller.signal,
    });
    snackbar.addEventListener('animationcancel', finish, {
      signal: controller.signal,
    });
  }

  private _finishDismissal(
    reason: M3SnackbarDismissReason,
    generation: number,
  ) {
    if (!this.open || !this._isLeaving || generation !== this._exitGeneration) {
      return;
    }

    this._exitController?.abort();
    this._exitController = null;
    this._isLeaving = false;
    this._closingInternally = true;
    this.open = false;
    this._dispatchDismiss(reason);
  }

  private _cancelExit() {
    this._exitGeneration += 1;
    this._exitController?.abort();
    this._exitController = null;
    this._isLeaving = false;
  }

  private _dispatchDismiss(reason: M3SnackbarDismissReason) {
    this.dispatchEvent(
      new CustomEvent<{ reason: M3SnackbarDismissReason }>('snackbar-dismiss', {
        bubbles: true,
        composed: true,
        detail: { reason },
      }),
    );
  }

  /**
   * Shows the snackbar. Calling show while it is open replaces the current
   * message lifecycle, reports `replacement`, and restarts auto-dismiss.
   * Calling it during exit instead reopens that lifecycle without dismissal.
   */
  show() {
    if (this.open) {
      if (this._isLeaving) {
        this._cancelExit();
      } else {
        this._dispatchDismiss('replacement');
      }
      this._startDismissTimer();
      this.requestUpdate();
      return;
    }
    this.open = true;
  }

  private _handleActionClick(e: Event) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('snackbar-action', {
        bubbles: true,
        composed: true,
      }),
    );
    this.dismiss('action');
  }

  private _handleSnackbarClick = () => this.dismiss('programmatic');

  render() {
    if (!this.open) return html``;

    return html`
      <div
        class="snackbar ${this._isLeaving ? 'leaving' : ''}"
        role="status"
        aria-live=${this.live}
        @click=${this._handleSnackbarClick}
      >
        <span class="message">
          <slot>${this.message}</slot>
        </span>
        <span
          class="action"
          ?hidden=${!this._hasAction}
          @click=${this._handleActionClick}
        >
          <slot
            name="action"
            @slotchange=${this._handleActionSlotChange}
          ></slot>
        </span>
      </div>
    `;
  }

  firstUpdated() {
    this._hasAction = this._slotHasContent();
  }

  private _handleActionSlotChange = () => {
    queueMicrotask(() => {
      this._hasAction = this._slotHasContent();
    });
  };

  private _slotHasContent(): boolean {
    return (
      this.shadowRoot
        ?.querySelector<HTMLSlotElement>('slot[name="action"]')
        ?.assignedNodes({ flatten: true })
        .some(
          (node) =>
            node.nodeType === Node.ELEMENT_NODE ||
            (node.textContent ?? '').trim().length > 0,
        ) ?? false
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-snackbar': M3Snackbar;
  }
}
