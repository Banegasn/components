import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('lit-button')
export class LitButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    
    button {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.2s;
      background-color: #3b82f6;
      color: white;
    }
    
    button:hover {
      background-color: #2563eb;
    }
    
    button:active {
      transform: scale(0.98);
    }
    
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

  @property({ type: String })
  label = 'Click me';

  @property({ type: Boolean })
  disabled = false;

  render() {
    return html`
      <button ?disabled=${this.disabled} @click=${this._handleClick}>
        ${this.label}
      </button>
    `;
  }

  private _handleClick() {
    this.dispatchEvent(new CustomEvent('lit-button-click', {
      bubbles: true,
      composed: true,
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-button': LitButton;
  }
}
