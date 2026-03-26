import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { m3ProgressStyles } from './m3-progress.styles.js';

/**
 * Material Design 3 Linear Progress Indicator
 *
 * @cssprop --md-sys-color-primary - Indicator color
 */
@customElement('m3-progress')
export class M3Progress extends LitElement {
  static styles = m3ProgressStyles;

  /** Progress value (0–1) */
  @property({ type: Number }) value = 0;

  /** Whether the progress is indeterminate */
  @property({ type: Boolean, reflect: true }) indeterminate = false;

  /** Whether the progress indicator is disabled */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** ARIA label */
  @property({ type: String, attribute: 'aria-label' }) ariaLabel: string | null = null;

  render() {
    const percentage = Math.max(0, Math.min(1, this.value)) * 100;

    return html`
      <div
        class="track"
        role="progressbar"
        aria-valuenow=${this.indeterminate ? undefined as any : percentage}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label=${this.ariaLabel || 'Progress'}
      >
        <div
          class="indicator"
          style=${this.indeterminate ? '' : `width: ${percentage}%`}
        ></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-progress': M3Progress;
  }
}
