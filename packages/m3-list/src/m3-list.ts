import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { m3ListStyles } from './m3-list.styles.js';

/**
 * Material Design 3 List Component
 *
 * Container for list items with optional staggered entrance animations.
 *
 * @slot - Default slot for m3-list-item elements
 *
 * @cssprop --_list-padding-top - Top padding of the list (default: 8px)
 * @cssprop --_list-padding-bottom - Bottom padding of the list (default: 8px)
 * @cssprop --_stagger-delay - Delay between each item's entrance animation (default: 0.05s)
 */
@customElement('m3-list')
export class M3List extends LitElement {
  static styles = m3ListStyles;

  /**
   * Enables staggered entrance animation for list items
   */
  @property({ type: Boolean, reflect: true })
  staggered = false;

  /**
   * ARIA role for the list
   */
  @property({ type: String })
  role = 'list';

  render() {
    return html`
      <ul class="list" role=${this.role}>
        <slot></slot>
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-list': M3List;
  }
}
