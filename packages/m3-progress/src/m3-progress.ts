import { LitElement, html, nothing } from 'lit';
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
  @property({ type: String, attribute: 'aria-label' }) ariaLabel:
    string | null = null;

  render() {
    const percentage = Math.max(0, Math.min(1, this.value)) * 100;
    const isNamed = Boolean(this.ariaLabel);

    return html`
      <div
        class="track"
        role=${isNamed ? 'progressbar' : nothing}
        aria-hidden=${isNamed ? nothing : 'true'}
        aria-valuenow=${isNamed && !this.indeterminate ? percentage : nothing}
        aria-valuemin=${isNamed ? '0' : nothing}
        aria-valuemax=${isNamed ? '100' : nothing}
        aria-label=${this.ariaLabel || nothing}
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
