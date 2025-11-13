import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { m3RadioButtonStyles } from './m3-radio-button.styles.js';

/**
 * Material Design 3 Radio Button Component
 * 
 * A radio button component following Material Design 3 specifications that allows
 * users to select a single option from a group of options.
 * 
 * @fires radio-change - Fired when the radio button state changes
 * 
 * @cssprop --md-radio-size - Size of the radio button (default: 20px)
 * @cssprop --md-radio-ripple-size - Size of the ripple effect (default: 40px)
 * @cssprop --md-sys-color-primary - Primary color for the radio when checked
 * @cssprop --md-sys-color-on-surface - Color for the radio when unchecked
 * @cssprop --md-sys-color-outline - Outline color for disabled state
 */
@customElement('m3-radio-button')
export class M3RadioButton extends LitElement {
  static styles = m3RadioButtonStyles;

  /**
   * Whether the radio button is checked
   */
  @property({ type: Boolean, reflect: true })
  checked = false;

  /**
   * Disables the radio button
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Name attribute for radio group
   */
  @property({ type: String })
  name: string | null = null;

  /**
   * Value attribute for form submission
   */
  @property({ type: String })
  value: string | null = null;

  /**
   * Form attribute to associate radio with a form
   */
  @property({ type: String })
  form: string | null = null;

  /**
   * ARIA label for accessibility
   */
  @property({ type: String, attribute: 'aria-label' })
  ariaLabel: string | null = null;

  /**
   * ARIA labelled by for accessibility
   */
  @property({ type: String, attribute: 'aria-labelledby' })
  ariaLabelledBy: string | null = null;

  /**
   * Radio button size
   * - small: 16px outer, 8px inner (default)
   * - medium: 20px outer, 10px inner
   * - large: 24px outer, 12px inner
   */
  @property({ type: String, reflect: true })
  size: 'small' | 'medium' | 'large' = 'small';

  /**
   * Internal state for pressed/active visual feedback
   */
  @state()
  private _pressed = false;

  /**
   * Internal state for ripple animation
   */
  @state()
  private _ripple = false;

  /**
   * Unique ID for the radio button
   */
  private _radioId = `m3-radio-${Math.random().toString(36).substr(2, 9)}`;

  connectedCallback() {
    super.connectedCallback();
    // Set the ID attribute for label association
    this.setAttribute('id', this._radioId);
    
    // Listen for changes from other radio buttons in the same group
    if (this.name) {
      document.addEventListener('radio-group-change', this._handleGroupChange as EventListener);
    }

    // Listen for clicks on associated labels
    document.addEventListener('click', this._handleLabelClick, true);
    
    // Set up label associations after rendering
    this.updateComplete.then(() => {
      this._setupLabelAssociations();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.name) {
      document.removeEventListener('radio-group-change', this._handleGroupChange as EventListener);
    }
    document.removeEventListener('click', this._handleLabelClick);
  }

  render() {
    return html`
      <div
        class="radio-container"
        role="radio"
        aria-checked=${this.checked}
        aria-disabled=${this.disabled}
        aria-label=${this.ariaLabel || ''}
        aria-labelledby=${this.ariaLabelledBy || ''}
        tabindex=${this.disabled ? -1 : 0}
        @click=${this._handleClick}
        @keydown=${this._handleKeyDown}
        @keyup=${this._handleKeyUp}
        @mousedown=${this._handleMouseDown}
        @mouseup=${this._handleMouseUp}
        @mouseleave=${this._handleMouseLeave}
      >
        <div class="radio-outer" ?checked=${this.checked} ?disabled=${this.disabled} ?pressed=${this._pressed}>
          ${this.checked ? html`
            <div class="radio-inner"></div>
          ` : ''}
        </div>
        ${this._ripple ? html`
          <div class="ripple"></div>
        ` : ''}
      </div>
      <input
        type="radio"
        ?checked=${this.checked}
        ?disabled=${this.disabled}
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

    if (!this.checked) {
      this._select();
    }
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (this.disabled) {
      return;
    }

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this._pressed = true;
      return;
    }

    // Arrow key navigation for radio groups
    if (this.name && (e.key === 'ArrowRight' || e.key === 'ArrowDown')) {
      e.preventDefault();
      this._navigateToNext();
      return;
    }

    if (this.name && (e.key === 'ArrowLeft' || e.key === 'ArrowUp')) {
      e.preventDefault();
      this._navigateToPrevious();
      return;
    }
  }

  private _handleKeyUp(e: KeyboardEvent) {
    if (this.disabled) {
      return;
    }

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this._pressed = false;
      if (!this.checked) {
        this._select();
      }
    }
  }

  private _navigateToNext() {
    const radios = this._getRadioGroup();
    const currentIndex = radios.indexOf(this);
    const nextIndex = (currentIndex + 1) % radios.length;
    const nextRadio = radios[nextIndex];
    
    if (nextRadio && !nextRadio.disabled) {
      nextRadio.focus();
      if (!nextRadio.checked) {
        nextRadio.click();
      }
    }
  }

  private _navigateToPrevious() {
    const radios = this._getRadioGroup();
    const currentIndex = radios.indexOf(this);
    const previousIndex = currentIndex === 0 ? radios.length - 1 : currentIndex - 1;
    const previousRadio = radios[previousIndex];
    
    if (previousRadio && !previousRadio.disabled) {
      previousRadio.focus();
      if (!previousRadio.checked) {
        previousRadio.click();
      }
    }
  }

  private _getRadioGroup(): M3RadioButton[] {
    if (!this.name) {
      return [this];
    }

    // Find all radio buttons with the same name
    const allRadios = Array.from(document.querySelectorAll(`m3-radio-button[name="${this.name}"]`)) as M3RadioButton[];
    return allRadios.filter(radio => radio.name === this.name);
  }

  private _handleMouseDown() {
    if (!this.disabled) {
      this._pressed = true;
    }
  }

  private _handleMouseUp() {
    this._pressed = false;
  }

  private _handleMouseLeave() {
    this._pressed = false;
  }

  private _handleInputChange(e: Event) {
    // Sync with internal radio for form submission
    const input = e.target as HTMLInputElement;
    if (input.checked !== this.checked) {
      this.checked = input.checked;
    }
  }

  private _handleGroupChange = (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail.name === this.name && customEvent.detail.value !== this.value) {
      this.checked = false;
      this._updateInput();
    }
  };

  private _setupLabelAssociations() {
    // Find labels with 'for' attribute pointing to this radio
    const labels = document.querySelectorAll(`label[for="${this._radioId}"]`) as NodeListOf<HTMLLabelElement>;
    labels.forEach(label => {
      label.style.cursor = 'pointer';
      label.addEventListener('click', (e) => {
        e.preventDefault();
        if (!this.disabled) {
          this._select();
        }
      });
    });
    
    // Find sibling labels
    const nextSibling = this.nextElementSibling;
    const previousSibling = this.previousElementSibling;
    
    if (nextSibling && nextSibling.tagName === 'LABEL') {
      (nextSibling as HTMLLabelElement).style.cursor = 'pointer';
      nextSibling.addEventListener('click', (e) => {
        e.preventDefault();
        if (!this.disabled) {
          this._select();
        }
      });
    }
    
    if (previousSibling && previousSibling.tagName === 'LABEL') {
      (previousSibling as HTMLLabelElement).style.cursor = 'pointer';
      previousSibling.addEventListener('click', (e) => {
        e.preventDefault();
        if (!this.disabled) {
          this._select();
        }
      });
    }
    
    // Find labels in the same container
    const container = this.closest('.radio-item, .radio-group, .setting-item');
    if (container) {
      const labelsInContainer = container.querySelectorAll('label') as NodeListOf<HTMLLabelElement>;
      labelsInContainer.forEach(label => {
        const radioInContainer = container.querySelector('m3-radio-button');
        if (radioInContainer === this) {
          label.style.cursor = 'pointer';
          label.addEventListener('click', (e) => {
            e.preventDefault();
            if (!this.disabled) {
              this._select();
            }
          });
        }
      });
    }
  }

  private _handleLabelClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Check if the clicked element is a label
    if (target.tagName === 'LABEL') {
      const labelFor = target.getAttribute('for');
      
      // If label has 'for' attribute matching this radio's ID
      if (labelFor === this._radioId) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.disabled) {
          this._select();
        }
        return;
      }
      
      // Check if label is next sibling or previous sibling
      const nextSibling = this.nextElementSibling;
      const previousSibling = this.previousElementSibling;
      
      if (target === nextSibling || target === previousSibling) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.disabled) {
          this._select();
        }
        return;
      }
      
      // Check if this radio is inside the label
      if (target.contains(this)) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.disabled) {
          this._select();
        }
        return;
      }
      
      // Check if label and radio are in the same container (like .radio-item)
      const labelContainer = target.closest('.radio-item, .radio-group, .setting-item');
      if (labelContainer && labelContainer.contains(this)) {
        // Check if this is the radio button in that container
        const radioInContainer = labelContainer.querySelector('m3-radio-button');
        if (radioInContainer === this) {
          e.preventDefault();
          e.stopPropagation();
          if (!this.disabled) {
            this._select();
          }
          return;
        }
      }
    }
  };

  private _select() {
    this.checked = true;
    this._updateInput();
    this._triggerRipple();

    // Uncheck other radio buttons in the same group
    if (this.name) {
      document.dispatchEvent(new CustomEvent('radio-group-change', {
        detail: {
          name: this.name,
          value: this.value
        }
      }));
    }

    this.dispatchEvent(new CustomEvent('radio-change', {
      bubbles: true,
      composed: true,
      detail: {
        checked: this.checked,
        name: this.name,
        value: this.value
      }
    }));
  }

  private _updateInput() {
    const input = this.shadowRoot?.querySelector('input[type="radio"]') as HTMLInputElement;
    if (input) {
      input.checked = this.checked;
    }
  }

  private _triggerRipple() {
    this._ripple = true;
    setTimeout(() => {
      this._ripple = false;
    }, 600);
  }

  /**
   * Programmatically clicks the radio button
   */
  click() {
    if (!this.disabled) {
      this._select();
    }
  }

  /**
   * Focuses the radio button
   */
  focus() {
    (this.shadowRoot?.querySelector('.radio-container') as HTMLElement)?.focus();
  }

  /**
   * Removes focus from the radio button
   */
  blur() {
    (this.shadowRoot?.querySelector('.radio-container') as HTMLElement)?.blur();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-radio-button': M3RadioButton;
  }
}

