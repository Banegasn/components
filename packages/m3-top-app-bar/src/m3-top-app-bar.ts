import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
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

  render() {
    const hasNav = this.querySelector('[slot="navigation-icon"]');
    const hasActions = this.querySelector('[slot="actions"]');

    return html`
      <header class="app-bar" part="app-bar">
        ${hasNav ? html`
          <div class="navigation-icon">
            <slot name="navigation-icon"></slot>
          </div>
        ` : ''}
        <h1 class="headline">
          <slot>${this.headline}</slot>
        </h1>
        ${hasActions ? html`
          <div class="actions">
            <slot name="actions"></slot>
          </div>
        ` : ''}
      </header>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-top-app-bar': M3TopAppBar;
  }
}
