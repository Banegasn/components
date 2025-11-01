import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('m3-navigation-bar')
export class M3NavigationBar extends LitElement {
    
  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 64px;
      background-color: var(--md-sys-color-surface-container, #f7f2fa);
      box-shadow: var(--md-sys-elevation-level2, 0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15));
      position: relative;
      z-index: 1000;
    }

    .container {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      align-items: flex-start;
      justify-content: center;
      gap: 0;
      margin: 0;
    }

    :host([layout="horizontal"]) .container {
      gap: 12px;
    }

    @media (min-width: 600px) {
      :host([auto-layout]) .container {
        gap: 12px;
      }
    }

    /* Slot content */
    ::slotted(m3-navigation-bar-item) {
      transition: flex 0.2s ease, width 0.2s ease;
    }
  `;

  @property({ type: String, reflect: true })
  layout: 'vertical' | 'horizontal' = 'vertical';

  @property({ type: Boolean, reflect: true, attribute: 'auto-layout' })
  autoLayout = false;

  @state()
  private _currentLayout: 'vertical' | 'horizontal' = 'vertical';

  connectedCallback() {
    super.connectedCallback();
    if (this.autoLayout) {
      this._updateLayout();
      window.addEventListener('resize', this._handleResize);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.autoLayout) {
      window.removeEventListener('resize', this._handleResize);
    }
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('layout') && !this.autoLayout) {
      this._updateItemsLayout();
    }
    if (changedProperties.has('autoLayout')) {
      if (this.autoLayout) {
        this._updateLayout();
        window.addEventListener('resize', this._handleResize);
      } else {
        window.removeEventListener('resize', this._handleResize);
        this._updateItemsLayout();
      }
    }
  }

  firstUpdated() {
    if (this.autoLayout) {
      this._updateLayout();
    } else {
      this._updateItemsLayout();
    }
  }

  private _handleResize = () => {
    this._updateLayout();
  };

  private _updateLayout() {
    const width = window.innerWidth;
    const newLayout = width >= 600 ? 'horizontal' : 'vertical';
    
    if (newLayout !== this._currentLayout) {
      this._currentLayout = newLayout;
      this._updateItemsLayout();
    }
  }

  private _updateItemsLayout() {
    const items = this.querySelectorAll('m3-navigation-bar-item');
    const layoutToUse = this.autoLayout ? this._currentLayout : this.layout;
    items.forEach(item => {
      item.layout = layoutToUse;
    });
  }

  render() {
    return html`
      <nav class="container" role="navigation" aria-label="Main navigation">
        <slot @slotchange=${this._handleSlotChange}></slot>
      </nav>
    `;
  }

  private _handleSlotChange() {
    this._updateItemsLayout();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-navigation-bar': M3NavigationBar;
  }
}

