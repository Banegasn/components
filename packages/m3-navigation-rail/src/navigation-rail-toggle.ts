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
        <div class="icon ${this.expanded ? 'expanded' : ''}">
          <svg viewBox="0 0 24 24">
            <path d="M9.29 15.88L13.17 12 9.29 8.12l1.42-1.41L15.41 12l-4.7 4.71-1.42-1.41z"/>
          </svg>
        </div>
      </button>
    `;
  }

  private _handleClick() {
    this.expanded = !this.expanded;
    this.dispatchEvent(new CustomEvent('toggle-click', {
      bubbles: true,
      composed: true,
      detail: { expanded: this.expanded }
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-navigation-rail-toggle': M3NavigationRailToggle;
  }
}

