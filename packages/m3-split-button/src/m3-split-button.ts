import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { m3SplitButtonStyles } from './m3-split-button.styles.js';

/**
 * Material Design 3 Split Button Component
 * 
 * A split button with a main action and a dropdown menu action.
 * Features shape morphing and rotation animations.
 */
@customElement('m3-split-button')
export class M3SplitButton extends LitElement {
    static styles = m3SplitButtonStyles;

    /**
     * Button variant style
     */
    @property({ type: String, reflect: true })
    variant: 'filled' | 'outlined' | 'tonal' | 'elevated' = 'filled';

    @property({ type: Boolean, reflect: true, attribute: 'menu-open' })
    menuOpen = false;

    @property({ type: String, attribute: 'menu-id' })
    menuId: string | null = null;

    private _handleMainClick() {
        this.dispatchEvent(new CustomEvent('split-button-click', {
            bubbles: true,
            composed: true,
            detail: { action: 'main' }
        }));
    }

    private _handleMenuClick() {
        this.menuOpen = !this.menuOpen;
        this.dispatchEvent(new CustomEvent('split-button-click', {
            bubbles: true,
            composed: true,
            detail: { action: 'menu', open: this.menuOpen }
        }));
    }

    render() {
        return html`
      <button class="button" type="button" @click=${this._handleMainClick}>
        <slot></slot>
      </button>
      <button
        class="menu-button ${this.menuOpen ? 'active' : ''}"
        type="button"
        @click=${this._handleMenuClick}
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded=${String(this.menuOpen)}
        aria-controls=${this.menuId ?? ''}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
          <path d="M480-360 280-560h400L480-360Z"/>
        </svg>
      </button>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'm3-split-button': M3SplitButton;
    }
}
