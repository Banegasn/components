import { html, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { FormAssociatedElement } from '@banegasn/m3-form-associated';
import { m3RadioButtonStyles } from './m3-radio-button.styles.js';
import { motionDuration } from './motion-duration.js';

interface RadioGroupScope {
  root: Document | ShadowRoot;
  name: string | null;
  form: HTMLFormElement | null;
}

/**
 * Material Design 3 radio button with native form participation.
 *
 * Radio grouping is local to a tree root. Radios with the same non-empty
 * `name` and owner form are mutually exclusive; separate forms and shadow
 * roots are intentionally independent. A selection emits one native `input`
 * and one native `change` event on the selected control.
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
  @property({ type: String, attribute: 'aria-label' }) ariaLabel:
    string | null = null;
  @property({ type: String, attribute: 'aria-labelledby' }) ariaLabelledBy:
    string | null = null;
  @property({ type: String, reflect: true }) size:
    'small' | 'medium' | 'large' = 'small';

  @state() private _pressed = false;
  @state() private _ripple = false;
  private _defaultChecked = false;
  private _lastScopeRoot: Document | ShadowRoot | null = null;
  private _groupScope: RadioGroupScope | null = null;
  private readonly _labelListeners = new Map<HTMLLabelElement, EventListener>();

  render() {
    return html`
      <div
        class="radio-container"
        role="radio"
        aria-checked=${this.checked}
        aria-disabled=${this.isFormDisabled ? 'true' : nothing}
        aria-label=${this.ariaLabel || nothing}
        aria-labelledby=${this.ariaLabelledBy || nothing}
        tabindex=${this._tabIndex()}
        @click=${this._handleClick}
        @keydown=${this._handleKeyDown}
        @keyup=${this._handleKeyUp}
        @mousedown=${this._handleMouseDown}
        @mouseup=${this._handleMouseUp}
        @mouseleave=${this._handleMouseLeave}
      >
        <div
          class="radio-outer"
          ?checked=${this.checked}
          ?disabled=${this.isFormDisabled}
          ?pressed=${this._pressed}
        >
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

  connectedCallback(): void {
    super.connectedCallback();
    this._lastScopeRoot = this._scopeRoot();
    this._connectLabels();
    this._reconcileGroupScope();
    this.requestUpdate();
  }

  disconnectedCallback(): void {
    this._disconnectLabels();
    this._refreshScopedRadios(this._groupScope?.root ?? this._lastScopeRoot);
    this._lastScopeRoot = null;
    this._groupScope = null;
    super.disconnectedCallback();
  }

  updated(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('checked') && this.checked)
      this._clearCheckedPeers();
    this._syncFormState();
    if (changedProperties.has('name')) this._reconcileGroupScope();
    if (
      changedProperties.has('checked') ||
      changedProperties.has('name') ||
      changedProperties.has('disabled') ||
      changedProperties.has('required')
    ) {
      this._refreshScopedRadios();
    }
  }

  formAssociatedCallback(form: HTMLFormElement | null): void {
    super.formAssociatedCallback(form);
    this._reconcileGroupScope();
    this.requestUpdate();
  }

  formDisabledCallback(disabled: boolean): void {
    super.formDisabledCallback(disabled);
    this._refreshScopedRadios();
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
    if (this.isFormDisabled || (event.key !== ' ' && event.key !== 'Enter'))
      return;
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
    this._clearCheckedPeers();
    this._syncFormState();
    this._refreshScopedRadios();
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
    return this._scopedRadios().filter(
      (radio) => radio.name === this.name && radio.form === this.form,
    );
  }

  private _scopeRoot(): Document | ShadowRoot | null {
    const root = this.getRootNode();
    return root instanceof Document || root instanceof ShadowRoot ? root : null;
  }

  private _scopedRadios(root = this._scopeRoot()): M3RadioButton[] {
    return root
      ? Array.from(root.querySelectorAll<M3RadioButton>('m3-radio-button'))
      : [this];
  }

  private _currentGroupScope(): RadioGroupScope | null {
    const root = this._scopeRoot();
    return root ? { root, name: this.name, form: this.form } : null;
  }

  private _reconcileGroupScope(): void {
    const previous = this._groupScope;
    const current = this._currentGroupScope();
    const changed = !this._sameGroupScope(previous, current);
    if (this.checked && current && changed) this._clearCheckedPeers();
    this._groupScope = current;
    if (previous?.root) this._refreshScopedRadios(previous.root);
    if (current && current.root !== previous?.root)
      this._refreshScopedRadios(current.root);
  }

  private _sameGroupScope(
    first: RadioGroupScope | null,
    second: RadioGroupScope | null,
  ): boolean {
    return (
      first?.root === second?.root &&
      first?.name === second?.name &&
      first?.form === second?.form
    );
  }

  private _clearCheckedPeers(): void {
    this._radioGroup().forEach((radio) => {
      if (radio !== this && radio.checked) {
        radio.checked = false;
        radio._syncFormState();
      }
    });
  }

  private _tabIndex(): number {
    if (this.isFormDisabled) return -1;
    const enabled = this._radioGroup().filter((radio) => !radio.isFormDisabled);
    const active = enabled.find((radio) => radio.checked) ?? enabled[0];
    return active === this ? 0 : -1;
  }

  private _refreshScopedRadios(root = this._scopeRoot()): void {
    this._scopedRadios(root).forEach((radio) => {
      if (radio !== this) radio.requestUpdate();
    });
  }

  private _connectLabels(): void {
    Array.from(this.labels ?? []).forEach((label) => {
      if (
        !(label instanceof HTMLLabelElement) ||
        this._labelListeners.has(label)
      )
        return;
      const listener: EventListener = () => {
        if (this.isFormDisabled) return;
        this.focus();
        this._select();
      };
      label.addEventListener('click', listener);
      this._labelListeners.set(label, listener);
    });
  }

  private _disconnectLabels(): void {
    this._labelListeners.forEach((listener, label) =>
      label.removeEventListener('click', listener),
    );
    this._labelListeners.clear();
  }

  private _syncFormState(): void {
    const disabled = this.isFormDisabled;
    this.setFormValue(
      !disabled && this.checked ? (this.value ?? 'on') : null,
      this.checked ? 'checked' : 'unchecked',
    );
    const requiredRadio = this._radioGroup().some(
      (radio) => radio.required && !radio.isFormDisabled,
    );
    const selected = this._radioGroup().some(
      (radio) => radio.checked && !radio.isFormDisabled,
    );
    this.setFormValidity(
      !disabled && requiredRadio && !selected ? { valueMissing: true } : {},
      !disabled && requiredRadio && !selected ? 'Please select an option.' : '',
      this.shadowRoot?.querySelector<HTMLElement>('.radio-container') ??
        undefined,
    );
  }

  private _triggerRipple(): void {
    this._ripple = true;
    void this.updateComplete.then(() => {
      const ripple = this.shadowRoot?.querySelector('.ripple');
      setTimeout(
        () => {
          this._ripple = false;
        },
        ripple ? motionDuration(ripple, '--_ripple-duration') : 0,
      );
    });
  }

  protected resetFormControl(): void {
    this.checked = this._defaultChecked;
  }

  protected restoreFormControlState(
    state: string | File | FormData | null,
  ): void {
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
