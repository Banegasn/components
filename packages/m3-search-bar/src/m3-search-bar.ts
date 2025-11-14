import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { m3SearchBarStyles } from './m3-search-bar.styles.js';

/**
 * Material Design 3 Search Bar Component
 * 
 * A search bar component following Material Design 3 specifications with
 * support for leading and trailing content projection slots.
 * 
 * @fires search-input - Fired when the input value changes
 * @fires search-submit - Fired when the search is submitted (Enter key)
 * @fires search-clear - Fired when the clear button is clicked
 * 
 * @slot leading - Content to display before the input (e.g., search icon, menu button)
 * @slot trailing - Content to display after the input (e.g., clear button, avatar)
 * 
 * @cssprop --md-search-bar-container-height - Height of the container (default: 64px)
 * @cssprop --md-search-bar-container-padding - Padding of the container (default: 16px)
 * @cssprop --md-search-bar-height - Height of the search bar (default: 56px)
 * @cssprop --md-search-bar-shape - Border radius of the search bar (default: 28px)
 * @cssprop --md-search-bar-padding-horizontal - Horizontal padding (default: 16px)
 * @cssprop --md-search-bar-padding-vertical - Vertical padding (default: 12px)
 * @cssprop --md-search-bar-input-font-size - Font size of input (default: 16px)
 * @cssprop --md-search-bar-input-line-height - Line height of input (default: 24px)
 * @cssprop --md-search-bar-icon-size - Size of icons in slots (default: 24px)
 * @cssprop --md-sys-color-surface-container - Container background color
 * @cssprop --md-sys-color-surface-container-high - Search bar background color
 * @cssprop --md-sys-color-on-surface - Input text color
 * @cssprop --md-sys-color-on-surface-variant - Placeholder and icon color
 * @cssprop --md-sys-color-outline-variant - Border color
 * @cssprop --md-sys-color-primary - Focus border color
 */
@customElement('m3-search-bar')
export class M3SearchBar extends LitElement {
  static styles = m3SearchBarStyles;

  /**
   * Placeholder text for the input field
   */
  @property({ type: String })
  placeholder: string = 'Search';

  /**
   * Current value of the input field
   */
  @property({ type: String })
  value: string = '';

  /**
   * Disables the search bar
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Name attribute for form submission
   */
  @property({ type: String })
  name: string | null = null;

  /**
   * Form attribute to associate search bar with a form
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
   * Maximum length of input
   */
  @property({ type: Number })
  maxLength: number | null = null;

  /**
   * Minimum length of input
   */
  @property({ type: Number })
  minLength: number | null = null;

  /**
   * Pattern for input validation
   */
  @property({ type: String })
  pattern: string | null = null;

  /**
   * Whether the input is required
   */
  @property({ type: Boolean })
  required = false;

  /**
   * Autocomplete attribute
   */
  @property({ type: String })
  autocomplete: string | null = null;

  /**
   * Internal state for focused state
   */
  @state()
  private _focused = false;

  render() {
    return html`
      <div class="search-container">
        <div
          class="search-bar"
          ?disabled=${this.disabled}
          @focusin=${this._handleFocusIn}
          @focusout=${this._handleFocusOut}
        >
          <div class="leading-slot">
            <slot name="leading"></slot>
          </div>
          <div class="input-wrapper">
            <input
              type="text"
              role="searchbox"
              class="input-field"
              .value=${this.value}
              placeholder=${this.placeholder}
              ?disabled=${this.disabled}
              ?required=${this.required}
              name=${this.name || ''}
              form=${this.form || ''}
              aria-label=${this.ariaLabel || ''}
              aria-labelledby=${this.ariaLabelledBy || ''}
              maxlength=${this.maxLength || ''}
              minlength=${this.minLength || ''}
              pattern=${this.pattern || ''}
              autocomplete=${this.autocomplete || ''}
              @input=${this._handleInput}
              @keydown=${this._handleKeyDown}
              @change=${this._handleChange}
            />
          </div>
          <div class="trailing-slot">
            <slot name="trailing"></slot>
          </div>
        </div>
      </div>
    `;
  }

  private _handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = input.value;

    this.dispatchEvent(new CustomEvent('search-input', {
      bubbles: true,
      composed: true,
      detail: {
        value: this.value,
        name: this.name
      }
    }));
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (this.disabled) {
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      this.dispatchEvent(new CustomEvent('search-submit', {
        bubbles: true,
        composed: true,
        detail: {
          value: this.value,
          name: this.name
        }
      }));
    }

    if (e.key === 'Escape' && this.value) {
      this._clear();
    }
  }

  private _handleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
  }

  private _handleFocusIn() {
    this._focused = true;
  }

  private _handleFocusOut() {
    this._focused = false;
  }

  private _clear() {
    this.value = '';
    const input = this.shadowRoot?.querySelector('.input-field') as HTMLInputElement;
    if (input) {
      input.value = '';
    }

    this.dispatchEvent(new CustomEvent('search-clear', {
      bubbles: true,
      composed: true,
      detail: {
        name: this.name
      }
    }));

    this.dispatchEvent(new CustomEvent('search-input', {
      bubbles: true,
      composed: true,
      detail: {
        value: this.value,
        name: this.name
      }
    }));
  }

  /**
   * Focuses the search input
   */
  focus() {
    (this.shadowRoot?.querySelector('.input-field') as HTMLInputElement)?.focus();
  }

  /**
   * Removes focus from the search input
   */
  blur() {
    (this.shadowRoot?.querySelector('.input-field') as HTMLInputElement)?.blur();
  }

  /**
   * Clears the search input
   */
  clear() {
    this._clear();
  }

  /**
   * Gets the current value
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Sets the value programmatically
   */
  setValue(value: string) {
    this.value = value;
    const input = this.shadowRoot?.querySelector('.input-field') as HTMLInputElement;
    if (input) {
      input.value = value;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-search-bar': M3SearchBar;
  }
}

