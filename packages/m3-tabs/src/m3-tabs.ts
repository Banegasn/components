import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { m3TabsStyles, m3TabStyles } from './m3-tabs.styles.js';

/**
 * Material Design 3 Tabs Container
 *
 * @fires tab-change - Fired when a tab is selected
 * @slot - Slot for m3-tab elements
 */
@customElement('m3-tabs')
export class M3Tabs extends LitElement {
  static styles = m3TabsStyles;

  /** Index of the active tab (0-based) */
  @property({ type: Number, reflect: true, attribute: 'active-tab' }) activeTab = 0;

  @state() private _indicatorLeft = 0;
  @state() private _indicatorWidth = 0;

  render() {
    return html`
      <div class="tabs-container" role="tablist" @click=${this._handleTabClick}>
        <slot @slotchange=${this._updateIndicator}></slot>
        <div class="indicator" style="left: ${this._indicatorLeft}px; width: ${this._indicatorWidth}px;"></div>
      </div>
    `;
  }

  firstUpdated() {
    this._syncTabs();
    requestAnimationFrame(() => this._updateIndicator());
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('activeTab')) {
      this._syncTabs();
      this._updateIndicator();
    }
  }

  private _syncTabs() {
    const tabs = this._getTabs();
    tabs.forEach((tab, i) => {
      tab.active = i === this.activeTab;
    });
  }

  private _getTabs(): M3Tab[] {
    const slot = this.shadowRoot?.querySelector('slot');
    if (!slot) return [];
    return slot.assignedElements({ flatten: true }).filter(
      (el): el is M3Tab => el.tagName === 'M3-TAB'
    );
  }

  private _handleTabClick(e: Event) {
    const path = e.composedPath();
    const tabEl = path.find(
      (el): el is M3Tab => el instanceof HTMLElement && el.tagName === 'M3-TAB'
    );
    if (!tabEl || tabEl.disabled) return;

    const tabs = this._getTabs();
    const index = tabs.indexOf(tabEl);
    if (index >= 0 && index !== this.activeTab) {
      this.activeTab = index;
      this.dispatchEvent(new CustomEvent('tab-change', {
        bubbles: true,
        composed: true,
        detail: { index, value: tabEl.value }
      }));
    }
  }

  private _updateIndicator() {
    requestAnimationFrame(() => {
      const tabs = this._getTabs();
      const activeTab = tabs[this.activeTab];
      if (activeTab) {
        const containerRect = this.shadowRoot?.querySelector('.tabs-container')?.getBoundingClientRect();
        const tabRect = activeTab.getBoundingClientRect();
        if (containerRect) {
          this._indicatorLeft = tabRect.left - containerRect.left;
          this._indicatorWidth = tabRect.width;
        }
      }
    });
  }
}

/**
 * Material Design 3 Tab Element
 *
 * @slot - Default slot for tab label
 * @slot icon - Optional icon
 */
@customElement('m3-tab')
export class M3Tab extends LitElement {
  static styles = m3TabStyles;

  /** Whether this tab is active */
  @property({ type: Boolean, reflect: true }) active = false;

  /** Whether this tab is disabled */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Value used to identify this tab */
  @property({ type: String }) value = '';

  render() {
    return html`
      <button
        class="tab"
        role="tab"
        ?active=${this.active}
        ?disabled=${this.disabled}
        aria-selected=${this.active}
        tabindex=${this.active ? 0 : -1}
      >
        <slot name="icon"></slot>
        <div class="label">
          <slot></slot>
        </div>
        <div class="state-layer"></div>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-tabs': M3Tabs;
    'm3-tab': M3Tab;
  }
}
