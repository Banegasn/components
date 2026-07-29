import { html, nothing } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { FormAssociatedElement } from '@banegasn/m3-form-associated';
import { m3SliderStyles } from './m3-slider.styles.js';

/**
 * Material Design 3 Slider Component
 *
 * Emits native `input` while dragging and `change` on a committed value.
 */
@customElement('m3-slider')
export class M3Slider extends FormAssociatedElement {
  static styles = m3SliderStyles;
  static readonly formAssociated = true;

  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) value = 50;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Number }) step = 1;
  @property({ type: String, reflect: true }) name: string | null = null;
  @property({ type: String, attribute: 'aria-label' }) ariaLabel:
    string | null = null;

  @query('.slider-input') inputEl!: HTMLInputElement;

  @state() private _focused = false;
  @state() private _hovered = false;
  @state() private _active = false;
  private _defaultValue = this.value;

  render() {
    const fraction = Math.max(
      0,
      Math.min(1, (this.value - this.min) / (this.max - this.min)),
    );
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
          <div
            class="state-layer"
            ?active=${this._active}
            ?hovered=${this._hovered}
            ?focused=${this._focused}
          ></div>
          <div class="thumb"></div>
        </div>

        <input
          type="range"
          class="slider-input"
          min=${this.min}
          max=${this.max}
          step=${this.step}
          .value=${String(this.value)}
          ?disabled=${this.isFormDisabled}
          aria-label=${this.ariaLabel || nothing}
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

  firstUpdated(): void {
    this._defaultValue = this.value;
    this._syncFormState();
  }

  updated(): void {
    this._syncFormState();
  }

  private _handleMouseEnter() {
    if (!this.isFormDisabled) this._hovered = true;
  }

  private _handleMouseLeave() {
    this._hovered = false;
  }

  private _handleFocus() {
    if (!this.isFormDisabled) this._focused = true;
  }

  private _handleBlur() {
    this._focused = false;
  }

  private _handleMouseDown() {
    if (!this.isFormDisabled) this._active = true;
  }

  private _handleMouseUp() {
    this._active = false;
  }

  private _handleInput(e: Event) {
    e.stopPropagation();
    const target = e.target as HTMLInputElement;
    this.value = Number(target.value);
    this.emitInput();
  }

  private _handleChange(e: Event) {
    e.stopPropagation();
    const target = e.target as HTMLInputElement;
    this.value = Number(target.value);
    this.emitChange();
  }

  private _syncFormState(): void {
    this.setFormValue(
      this.isFormDisabled ? null : String(this.value),
      String(this.value),
    );
  }

  protected resetFormControl(): void {
    this.value = this._defaultValue;
  }

  protected restoreFormControlState(
    state: string | File | FormData | null,
  ): void {
    if (typeof state === 'string' && state !== '') this.value = Number(state);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-slider': M3Slider;
  }
}
