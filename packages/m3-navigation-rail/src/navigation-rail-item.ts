import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { navigationRailItemStyles } from './navigation-rail-item.styles.js';

@customElement('m3-navigation-rail-item')
export class M3NavigationRailItem extends LitElement {
  static styles = navigationRailItemStyles;

  @property({ type: Boolean })
  active = false;

  @property({ type: String })
  label = '';

  @property({ type: String })
  badge = '';

  render() {
    return html`
      <button class="item ${this.active ? 'active' : ''}" @click=${this._handleClick}>
        <div class="indicator"></div>
        <div class="icon">
          <slot name="icon"></slot>
        </div>
        ${this.label ? html`<span class="label">${this.label}</span>` : ''}
        ${this.badge ? html`<span class="badge">${this.badge}</span>` : ''}
      </button>
    `;
  }

  private _handleClick() {
    this.dispatchEvent(new CustomEvent('item-click', {
      bubbles: true,
      composed: true,
      detail: { label: this.label }
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-navigation-rail-item': M3NavigationRailItem;
  }
}

