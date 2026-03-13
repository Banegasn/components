import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { m3FabMenuStyles } from './m3-fab-menu.styles.js';

/**
 * Material Design 3 FAB Menu
 * 
 * Replaces speed dial with a more expressive menu interaction.
 */
@customElement('m3-fab-menu')
export class M3FabMenu extends LitElement {
    static styles = m3FabMenuStyles;

    @state()
    private _open = false;

    private _toggle() {
        this._open = !this._open;
    }

    render() {
        return html`
      <div class="menu ${this._open ? 'open' : ''}">
        <slot></slot>
      </div>
      <button class="fab ${this._open ? 'active' : ''}" @click=${this._toggle} aria-label="Menu">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
          <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
        </svg>
      </button>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'm3-fab-menu': M3FabMenu;
    }
}
