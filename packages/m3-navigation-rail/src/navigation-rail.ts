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
    }

    .rail {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      padding: 8px 0;
      gap: 12px;
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
  `;

  @property({ type: Boolean })
  showMenu = false;

  @property({ type: Boolean })
  showFab = false;

  render() {
    return html`
      <nav class="rail">
        ${this.showFab ? html`
          <div class="fab-slot">
            <slot name="fab"></slot>
          </div>
        ` : ''}
        
        ${this.showMenu ? html`
          <button class="menu-button" @click=${this._handleMenuClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
        ` : ''}
        
        <div class="items">
          <slot></slot>
        </div>
      </nav>
    `;
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

