import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { m3SliderStyles } from './m3-slider.styles.js';

/**
 * Material Design 3 Slider Component
 * 
 * @fires slider-change - Fired when the slider value changes
 */
@customElement('m3-slider')
export class M3Slider extends LitElement {
  static styles = m3SliderStyles;

  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) value = 50;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Number }) step = 1;
  @property({ type: String }) name: string | null = null;
  @property({ type: String, attribute: 'aria-label' }) ariaLabel: string | null = null;
  
  @query('.slider-input') inputEl!: HTMLInputElement;

  @state() private _focused = false;
  @state() private _hovered = false;
  @state() private _active = false;

  render() {
    const fraction = Math.max(0, Math.min(1, (this.value - this.min) / (this.max - this.min)));
    const percentage = fraction * 100;

    return html`
      <div
        class="slider-container"
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
      >
        <div class="track-container">
          <div class="track-inactive"></div>
          <div class="track-active" style="width: ${percentage}%"></div>
        </div>
        
        <div class="thumb-container" style="left: ${percentage}%">
          <div class="state-layer" ?active=${this._active} ?hovered=${this._hovered} ?focused=${this._focused}></div>
          <div class="thumb"></div>
        </div>

        <input
          type="range"
          class="slider-input"
          min=${this.min}
          max=${this.max}
          step=${this.step}
          .value=${String(this.value)}
          ?disabled=${this.disabled}
          aria-label=${this.ariaLabel || ''}
          name=${this.name || ''}
          @input=${this._handleInput}
          @change=${this._handleChange}
          @focus=${this._handleFocus}
          @blur=${this._handleBlur}
          @mousedown=${this._handleMouseDown}
          @mouseup=${this._handleMouseUp}
          @touchstart=${this._handleMouseDown}
          @touchend=${this._handleMouseUp}
        />
      </div>
    `;
  }

  private _handleMouseEnter() {
    if (!this.disabled) this._hovered = true;
  }

  private _handleMouseLeave() {
    this._hovered = false;
  }

  private _handleFocus() {
    if (!this.disabled) this._focused = true;
  }

  private _handleBlur() {
    this._focused = false;
  }

  private _handleMouseDown() {
    if (!this.disabled) this._active = true;
  }

  private _handleMouseUp() {
    this._active = false;
  }

  private _handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = Number(target.value);
    
    this.dispatchEvent(new CustomEvent('slider-input', {
      bubbles: true,
      composed: true,
      detail: { value: this.value }
    }));
  }

  private _handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = Number(target.value);

    this.dispatchEvent(new CustomEvent('slider-change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value, name: this.name }
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-slider': M3Slider;
  }
}
