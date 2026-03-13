import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { m3LoadingIndicatorStyles } from './m3-loading-indicator.styles.js';

/**
 * Material Design 3 Loading Indicator
 * 
 * Expressive loading indicator with shape morphing capabilities.
 */
@customElement('m3-loading-indicator')
export class M3LoadingIndicator extends LitElement {
    static styles = m3LoadingIndicatorStyles;

    /**
     * Indicator variant
     */
    @property({ type: String, reflect: true })
    variant: 'standard' | 'contained' = 'standard';

    /**
     * Indicator shape
     */
    @property({ type: String, reflect: true })
    shape: 'circle' | 'square' = 'circle';

    render() {
        return html`
      <div class="container">
        <div class="shape"></div>
      </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'm3-loading-indicator': M3LoadingIndicator;
    }
}
