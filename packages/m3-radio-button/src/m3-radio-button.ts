import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { FormAssociatedElement } from '@banegasn/m3-form-associated';
import { m3RadioButtonStyles } from './m3-radio-button.styles.js';
import { motionDuration } from './motion-duration.js';

/**
 * Material Design 3 radio button with native form participation.
 *
 * Radio grouping follows the platform rule: radios with the same `name` and
 * the same owner form are mutually exclusive. A selection emits one native
 * `input` and one native `change` event on the selected control.
 */
@customElement('m3-radio-button')
export class M3RadioButton extends FormAssociatedElement {
  static styles = m3RadioButtonStyles;
  static readonly formAssociated = true;

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: String, reflect: true }) name: string | null = null;
  @property({ type: String, reflect: true }) value: string | null = null;
  @property({ type: String, attribute: 'aria-label' }) ariaLabel: string | null = null;
  @property({ type: String, attribute: 'aria-labelledby' }) ariaLabelledBy: string | null = null;
  @property({ type: String, reflect: true }) size: 'small' | 'medium' | 'large' = 'small';

  @state() private _pressed = false;
  @state() private _ripple = false;
  private _defaultChecked = false;

  render() {
    return html`
      <div
        class="radio-container"
        role="radio"
        aria-checked=${this.checked}
        aria-disabled=${this.isFormDisabled}
        aria-label=${this.ariaLabel || ''}
        aria-labelledby=${this.ariaLabelledBy || ''}
        tabindex=${this.isFormDisabled ? -1 : 0}
        @click=${this._handleClick}
        @keydown=${this._handleKeyDown}
        @keyup=${this._handleKeyUp}
        @mousedown=${this._handleMouseDown}
        @mouseup=${this._handleMouseUp}
        @mouseleave=${this._handleMouseLeave}
      >
        <div class="radio-outer" ?checked=${this.checked} ?disabled=${this.isFormDisabled} ?pressed=${this._pressed}>
          ${this.checked ? html`<div class="radio-inner"></div>` : ''}
        </div>
        ${this._ripple ? html`<div class="ripple"></div>` : ''}
      </div>
    `;
  }

  firstUpdated(): void {
    this._defaultChecked = this.checked;
    this._syncFormState();
  }

  updated(): void {
    this._syncFormState();
  }

  private _handleClick(event: MouseEvent): void {
    if (this.isFormDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this._select();
  }

  private _handleKeyDown(event: KeyboardEvent): void {
    if (this.isFormDisabled) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this._pressed = true;
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      this._moveSelection(1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      this._moveSelection(-1);
    }
  }

  private _handleKeyUp(event: KeyboardEvent): void {
    if (this.isFormDisabled || (event.key !== ' ' && event.key !== 'Enter')) return;
    event.preventDefault();
    this._pressed = false;
    this._select();
  }

  private _handleMouseDown(): void {
    if (!this.isFormDisabled) this._pressed = true;
  }

  private _handleMouseUp(): void {
    this._pressed = false;
  }

  private _handleMouseLeave(): void {
    this._pressed = false;
  }

  private _select(emitEvents = true): void {
    if (this.checked || this.isFormDisabled) return;
    this.checked = true;
    this._radioGroup().forEach((radio) => {
      if (radio !== this && radio.checked) radio.checked = false;
    });
    this._triggerRipple();
    if (emitEvents) {
      this.emitInput();
      this.emitChange();
    }
  }

  private _moveSelection(direction: 1 | -1): void {
    const radios = this._radioGroup().filter((radio) => !radio.isFormDisabled);
    const index = radios.indexOf(this);
    if (index < 0 || radios.length < 2) return;
    const next = radios[(index + direction + radios.length) % radios.length];
    next.focus();
    next._select();
  }

  private _radioGroup(): M3RadioButton[] {
    if (!this.name) return [this];
    return Array.from(document.querySelectorAll<M3RadioButton>('m3-radio-button')).filter((radio) =>
      radio.name === this.name && radio.form === this.form,
    );
  }

  private _syncFormState(): void {
    const disabled = this.isFormDisabled;
    this.setFormValue(!disabled && this.checked ? this.value ?? 'on' : null, this.checked ? 'checked' : 'unchecked');
    const requiredRadio = this._radioGroup().some((radio) => radio.required && !radio.isFormDisabled);
    const selected = this._radioGroup().some((radio) => radio.checked && !radio.isFormDisabled);
    this.setFormValidity(
      !disabled && requiredRadio && !selected ? { valueMissing: true } : {},
      !disabled && requiredRadio && !selected ? 'Please select an option.' : '',
      this.shadowRoot?.querySelector<HTMLElement>('.radio-container') ?? undefined,
    );
  }

  private _triggerRipple(): void {
    this._ripple = true;
    void this.updateComplete.then(() => {
      const ripple = this.shadowRoot?.querySelector('.ripple');
      setTimeout(() => {
        this._ripple = false;
      }, ripple ? motionDuration(ripple, '--_ripple-duration') : 0);
    });
  }

  protected resetFormControl(): void {
    this.checked = this._defaultChecked;
  }

  protected restoreFormControlState(state: string | File | FormData | null): void {
    if (typeof state === 'string') this.checked = state === 'checked';
  }

  click(): void {
    this._select();
  }

  focus(): void {
    this.shadowRoot?.querySelector<HTMLElement>('.radio-container')?.focus();
  }

  blur(): void {
    this.shadowRoot?.querySelector<HTMLElement>('.radio-container')?.blur();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-radio-button': M3RadioButton;
  }
}
