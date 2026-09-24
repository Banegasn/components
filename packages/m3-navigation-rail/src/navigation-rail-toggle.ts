import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { navigationRailToggleStyles } from './navigation-rail-toggle.styles.js';

@customElement('m3-navigation-rail-toggle')
export class M3NavigationRailToggle extends LitElement {
  static styles = navigationRailToggleStyles;

  @property({ type: Boolean, reflect: true })
  expanded = false;

  render() {
    return html`
      <button 
        class="toggle-button" 
        @click=${this._handleClick}
        aria-label="${this.expanded ? 'Collapse navigation' : 'Expand navigation'}"
      >
        <div class="icon" aria-hidden="true">
          <svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
          <svg class="collapse-icon" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 12H4m7-7-7 7 7 7"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </button>
    `;
  }

  private _handleClick() {
    this.dispatchEvent(new CustomEvent('toggle-click', {
      bubbles: true,
      composed: true
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-navigation-rail-toggle': M3NavigationRailToggle;
  }
}
