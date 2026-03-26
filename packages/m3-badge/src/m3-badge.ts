import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { m3BadgeStyles } from './m3-badge.styles.js';

/**
 * Material Design 3 Badge Component
 *
 * @slot - Default slot for the element to badge
 */
@customElement('m3-badge')
export class M3Badge extends LitElement {
  static styles = m3BadgeStyles;

  /** Label text shown inside the badge. Empty = dot badge */
  @property({ type: String }) label = '';

  /** Badge size */
  @property({ type: String, reflect: true }) size: 'small' | 'large' = 'small';

  /** Hide the badge (with scale animation) */
  @property({ type: Boolean, reflect: true }) hidden = false;

  render() {
    return html`
      <slot></slot>
      <div
        class="badge"
        ?has-label=${!!this.label}
        ?hidden-badge=${this.hidden}
        role="status"
        aria-label=${this.label ? `${this.label} notifications` : 'notification'}
      >
        ${this.label || ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-badge': M3Badge;
  }
}
