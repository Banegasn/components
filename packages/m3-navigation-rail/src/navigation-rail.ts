import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('m3-navigation-rail')
export class M3NavigationRail extends LitElement {
    
  static styles = css`
    :host {
      display: block;
      width: 80px;
      height: 100%;
      background-color: var(--md-sys-color-surface, #fef7ff);
      border-right: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      transition: width 0.3s ease;
    }

    :host([expanded]) {
      width: 256px;
    }

    .rail {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 0;
      gap: 12px;
      min-width: 80px;
    }

    :host([expanded]) .rail {
      min-width: 256px;
      align-items: flex-start;
      padding: 8px 12px;
      box-sizing: border-box;
    }

    .fab-slot {
      margin-bottom: 4px;
    }

    .menu-button {
      width: 56px;
      height: 56px;
      border-radius: 28px;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    .menu-button:hover {
      background-color: var(--md-sys-color-surface-variant, #e7e0ec);
    }

    .items {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
      width: 100%;
    }

    :host([expanded]) .items {
      align-items: flex-start;
    }
  `;

  @property({ type: Boolean })
  showMenu = false;

  @property({ type: Boolean })
  showFab = false;

  @property({ type: Boolean, reflect: true })
  expanded = false;

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('expanded')) {
      this._updateItemsExpandedState();
    }
  }

  private _updateItemsExpandedState() {
    const items = this.querySelectorAll('m3-navigation-rail-item');
    items.forEach(item => {
      item.expanded = this.expanded;
    });
  }

  render() {
    return html`
      <nav class="rail">
        ${this.showFab ? html`
          <div class="fab-slot">
            <slot name="fab"></slot>
          </div>
        ` : ''}
        
        <div class="items">
          <slot @toggle-click=${this._handleToggleClick}></slot>
        </div>
      </nav>
    `;
  }

  private _handleToggleClick(e: CustomEvent) {
    this.expanded = e.detail.expanded;
  }

  private _handleMenuClick() {
    this.dispatchEvent(new CustomEvent('menu-click', {
      bubbles: true,
      composed: true,
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-navigation-rail': M3NavigationRail;
  }
}

