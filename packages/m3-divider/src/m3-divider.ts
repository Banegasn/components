import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { m3DividerStyles } from './m3-divider.styles.js';

/**
 * Material Design 3 Divider Component
 *
 * A beautiful, expressive divider with entrance animations and variants.
 * Follows Material Design 3 specifications with support for full-width,
 * inset, and middle variants, as well as horizontal and vertical orientations.
 *
 * @cssprop --md-sys-color-outline-variant - Divider color (default: #cac4d0)
 * @cssprop --md-sys-color-outline - Alternative divider color
 * @cssprop --_inset-start - Start inset padding for inset/middle variants (default: 16px)
 * @cssprop --_inset-end - End inset padding for middle variant (default: 16px)
 * @cssprop --_animation-duration - Duration of the entrance animation (default: 0.6s)
 */
@customElement('m3-divider')
export class M3Divider extends LitElement {
  static styles = m3DividerStyles;

  /**
   * Divider variant
   * - full-width: Spans the entire width (default)
   * - inset: Indented from the start edge (useful in lists with leading icons/avatars)
   * - middle: Indented from both edges
   */
  @property({ type: String, reflect: true })
  variant: 'full-width' | 'inset' | 'middle' = 'full-width';

  /**
   * Divider orientation
   * - horizontal: Standard horizontal line (default)
   * - vertical: Vertical line for separating side-by-side content
   */
  @property({ type: String, reflect: true })
  orientation: 'horizontal' | 'vertical' = 'horizontal';

  /**
   * Divider thickness in pixels
   * - 1: Standard 1px (default)
   * - 2: 2px for stronger separation
   * - 4: 4px for prominent section breaks
   */
  @property({ type: String, reflect: true })
  thickness: '1' | '2' | '4' = '1';

  /**
   * Disables the entrance animation
   */
  @property({ type: Boolean, reflect: true, attribute: 'no-animation' })
  noAnimation = false;

  /**
   * Enables a subtle pulsing animation for loading/placeholder states
   */
  @property({ type: Boolean, reflect: true })
  pulsing = false;

  /**
   * ARIA role for accessibility
   */
  @property({ type: String })
  role = 'separator';

  render() {
    return html`
      <hr
        class="divider"
        .ariaOrientation=${this.orientation}
        role=${this.role}
      />
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-divider': M3Divider;
  }
}
