import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { m3TextFieldStyles } from './m3-text-field.styles.js';

@customElement('m3-text-field')
export class M3TextField extends LitElement {
  static styles = m3TextFieldStyles;

  @property({ type: String }) type = 'text';
  @property({ type: String }) label = '';
  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) name: string | null = null;
  
  @state() private _focused = false;
  @query('input') inputEl!: HTMLInputElement;

  render() {
    return html`
      <div class="field-container" ?focused=${this._focused} ?has-value=${!!this.value}>
        <div class="state-layer"></div>
        <div class="label-wrapper">
          ${this.label ? html`<label class="label">${this.label}</label>` : ''}
        </div>
        <input
          class="input"
          type=${this.type}
          .value=${this.value}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          name=${this.name || ''}
          @focus=${this._handleFocus}
          @blur=${this._handleBlur}
          @input=${this._handleInput}
          @change=${this._handleChange}
        />
        <div class="indicator"></div>
      </div>
    `;
  }

  private _handleFocus() {
    this._focused = true;
  }

  private _handleBlur() {
    this._focused = false;
  }

  private _handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
    
    this.dispatchEvent(new CustomEvent('textfield-input', {
      bubbles: true,
      composed: true,
      detail: { value: this.value }
    }));
  }

  private _handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
    
    this.dispatchEvent(new CustomEvent('textfield-change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value, name: this.name }
    }));
  }

  focus() {
    this.inputEl?.focus();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-text-field': M3TextField;
  }
}
