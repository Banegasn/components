import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { m3CheckboxStyles } from './m3-checkbox.styles.js';

/**
 * Material Design 3 Checkbox Component
 * 
 * A checkbox component following Material Design 3 specifications.
 * 
 * @fires checkbox-change - Fired when the checkbox state changes
 */
@customElement('m3-checkbox')
export class M3Checkbox extends LitElement {
  static styles = m3CheckboxStyles;

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) indeterminate = false;
  @property({ type: String }) name: string | null = null;
  @property({ type: String }) value: string | null = null;
  @property({ type: String }) form: string | null = null;
  @property({ type: String, attribute: 'aria-label' }) ariaLabel: string | null = null;

  @state() private _pressed = false;
  @state() private _hovered = false;

  render() {
    return html`
      <div
        class="checkbox-container"
        role="checkbox"
        aria-checked=${this.indeterminate ? 'mixed' : this.checked}
        aria-disabled=${this.disabled}
        aria-label=${this.ariaLabel || ''}
        tabindex=${this.disabled ? -1 : 0}
        @click=${this._handleClick}
        @keydown=${this._handleKeyDown}
        @keyup=${this._handleKeyUp}
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
        @mousedown=${this._handleMouseDown}
        @mouseup=${this._handleMouseUp}
      >
        <div class="state-layer"></div>
        <div class="outline" ?checked=${this.checked} ?disabled=${this.disabled} ?indeterminate=${this.indeterminate}>
          <div class="background" ?checked=${this.checked} ?disabled=${this.disabled} ?indeterminate=${this.indeterminate}>
            ${this.indeterminate
              ? html`<svg class="icon" viewBox="0 0 18 18"><rect x="4" y="8" width="10" height="2" fill="currentColor"/></svg>`
              : this.checked
                ? html`<svg class="icon" viewBox="0 0 18 18"><path d="M7 13.5L3 9.5l1.4-1.4L7 10.7l7.6-7.6L16 4.5l-9 9z" fill="currentColor"/></svg>`
                : ''}
          </div>
        </div>
      </div>
      <input
        type="checkbox"
        ?checked=${this.checked}
        ?disabled=${this.disabled}
        .indeterminate=${this.indeterminate}
        name=${this.name || ''}
        value=${this.value || ''}
        form=${this.form || ''}
        aria-hidden="true"
        tabindex="-1"
        @change=${this._handleInputChange}
      />
    `;
  }

  private _handleClick(e: MouseEvent) {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    this._toggle();
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (this.disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this._pressed = true;
    }
  }

  private _handleKeyUp(e: KeyboardEvent) {
    if (this.disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this._pressed = false;
      this._toggle();
    }
  }

  private _handleMouseEnter() {
    if (!this.disabled) this._hovered = true;
  }

  private _handleMouseLeave() {
    this._hovered = false;
    this._pressed = false;
  }

  private _handleMouseDown() {
    if (!this.disabled) this._pressed = true;
  }

  private _handleMouseUp() {
    this._pressed = false;
  }

  private _handleInputChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.checked !== this.checked) {
      this.checked = input.checked;
      this.indeterminate = input.indeterminate;
    }
  }

  private _toggle() {
    if (this.indeterminate) {
      this.indeterminate = false;
      this.checked = true;
    } else {
      this.checked = !this.checked;
    }
    
    // Update internal input for form submission
    const input = this.shadowRoot?.querySelector('input[type="checkbox"]') as HTMLInputElement;
    if (input) {
      input.checked = this.checked;
      input.indeterminate = this.indeterminate;
    }

    this.dispatchEvent(new CustomEvent('checkbox-change', {
      bubbles: true,
      composed: true,
      detail: {
        checked: this.checked,
        indeterminate: this.indeterminate,
        name: this.name,
        value: this.value
      }
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-checkbox': M3Checkbox;
  }
}
