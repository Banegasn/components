import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { m3TopAppBarStyles } from './m3-top-app-bar.styles.js';

/**
 * Material Design 3 Top App Bar Component
 *
 * A flexible top app bar with multiple variants, slots for navigation icon,
 * title, and actions. Supports elevation transitions and scroll behaviors.
 *
 * @slot navigation-icon - Leading navigation icon (e.g., menu or back arrow)
 * @slot headline - Title text (default slot also works)
 * @slot actions - Trailing action icons/buttons
 *
 * @cssprop --md-sys-color-surface - App bar background color
 * @cssprop --md-sys-color-on-surface - Title and icon color
 */
@customElement('m3-top-app-bar')
export class M3TopAppBar extends LitElement {
  static styles = m3TopAppBarStyles;

  /**
   * App bar variant
   * - small: Compact 56dp height (default)
   * - center-aligned: Title centered with absolute nav icon
   * - medium: 112dp height with title at bottom
   * - large: 152dp height with large title at bottom
   */
  @property({ type: String, reflect: true })
  variant: 'small' | 'center-aligned' | 'medium' | 'large' = 'small';

  /**
   * Forces elevated shadow (useful when content is scrolled underneath)
   */
  @property({ type: Boolean, reflect: true })
  elevated = false;

  /**
   * Scroll behavior
   * - none: Fixed position (default)
   * - hide: Hides on scroll down, shows on scroll up
   * - shrink: Shrinks to small variant on scroll down
   */
  @property({ type: String, reflect: true, attribute: 'scroll-behavior' })
  scrollBehavior: 'none' | 'hide' | 'shrink' = 'none';

  /**
   * Whether the bar is currently scrolled down (for scroll-behavior)
   */
  @property({ type: Boolean, reflect: true, attribute: 'scrolled-down' })
  scrolledDown = false;

  /**
   * Headline text (alternative to slot)
   */
  @property({ type: String })
  headline = '';

  @state() private _hasNavigationIcon = false;
  @state() private _hasActions = false;

  render() {
    return html`
      <header class="app-bar" part="app-bar">
        <div class="navigation-icon" ?hidden=${!this._hasNavigationIcon}>
          <slot name="navigation-icon" @slotchange=${this._handleSlotChange}></slot>
        </div>
        <h1 class="headline">
          <slot>${this.headline}</slot>
        </h1>
        <div class="actions" ?hidden=${!this._hasActions}>
          <slot name="actions" @slotchange=${this._handleSlotChange}></slot>
        </div>
      </header>
    `;
  }

  firstUpdated() {
    this._syncSlotState();
  }

  private _handleSlotChange = () => {
    queueMicrotask(() => this._syncSlotState());
  };

  private _syncSlotState() {
    this._hasNavigationIcon = this._slotHasContent('navigation-icon');
    this._hasActions = this._slotHasContent('actions');
  }

  private _slotHasContent(name: string): boolean {
    return this.shadowRoot
      ?.querySelector<HTMLSlotElement>(`slot[name="${name}"]`)
      ?.assignedNodes({ flatten: true })
      .some((node) => node.nodeType === Node.ELEMENT_NODE || (node.textContent ?? '').trim().length > 0) ?? false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-top-app-bar': M3TopAppBar;
  }
}
