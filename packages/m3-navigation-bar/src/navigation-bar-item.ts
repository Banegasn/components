import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { navigationBarItemStyles } from './navigation-bar-item.styles.js';

@customElement('m3-navigation-bar-item')
export class M3NavigationBarItem extends LitElement {
  static styles = navigationBarItemStyles;

  @property({ type: Boolean })
  active = false;

  @property({ type: String })
  label = '';

  @property({ type: String })
  badge: string = '';

  @property({ type: String })
  largeBadge: string = '';

  @property({ type: String, reflect: true })
  layout: 'vertical' | 'horizontal' = 'vertical';

  render() {
    return html`
      <button 
        class="item ${this.active ? 'active' : ''}" 
        @click=${this._handleClick}
        aria-label=${this.label || 'Navigation item'}
        aria-current=${this.active ? 'page' : 'false'}
      >
        <div class="state-layer bubble"></div>
        <div class="indicator bubble"></div>
        <div class="icon-container">
          <div class="icon">
            <slot name="icon"></slot>
            ${this._renderBadge()}
          </div>
        </div>
        ${this.label ? html`<span class="label">${this.label}</span>` : ''}
        ${this.largeBadge ? html`<span class="badge-large-label">${this.largeBadge}</span>` : ''}
      </button>
    `;
  }

  private _renderBadge() {
    if (this.largeBadge) {
      return html`<span class="badge-large">${this.largeBadge}</span>`;
    }
    if (this.badge !== '') {
      return html`<span class="badge">${this.badge}</span>`;
    }
    return '';
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
    'm3-navigation-bar-item': M3NavigationBarItem;
  }
}

