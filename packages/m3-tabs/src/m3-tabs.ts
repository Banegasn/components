import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { m3TabsStyles, m3TabStyles } from './m3-tabs.styles.js';

export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsActivation = 'automatic' | 'manual';
export type TabChangeReason = 'click' | 'keyboard';
export interface TabChangeDetail {
  activeTab: number;
  value: string;
  reason: TabChangeReason;
}
interface PanelState {
  ariaLabelledBy: string | null;
  hidden: boolean;
  role: string | null;
}
let tabsId = 0;

/** ARIA tabs controller. Each child `m3-tab` identifies its panel with `panel`. */
@customElement('m3-tabs')
export class M3Tabs extends LitElement {
  static styles = m3TabsStyles;
  /** Zero-based selected enabled tab, or -1 when all tabs are disabled. */
  @property({ type: Number, reflect: true, attribute: 'active-tab' })
  activeTab = 0;
  /** Keyboard axis and visual arrangement. */
  @property({ type: String, reflect: true }) orientation: TabsOrientation =
    'horizontal';
  /** Whether arrow-key focus selects the destination tab. */
  @property({ type: String, reflect: true }) activation: TabsActivation =
    'automatic';
  @state() private _indicatorOffset = 0;
  @state() private _indicatorSize = 0;
  private readonly _id = ++tabsId;
  private _activeTab?: M3Tab;
  private _focusedTab?: M3Tab;
  private _indicatorFrame?: number;
  private _resizeObserver?: ResizeObserver;
  private _tabsObserver?: MutationObserver;
  private _managedPanels = new Map<HTMLElement, PanelState>();
  private readonly _onWindowResize = () => this._scheduleIndicator();

  render() {
    const vertical = this._orientation() === 'vertical';
    const indicator = vertical
      ? `top:${this._indicatorOffset}px;height:${this._indicatorSize}px`
      : `left:${this._indicatorOffset}px;width:${this._indicatorSize}px`;
    return html`<div
      class="tabs-container ${vertical ? 'vertical' : ''}"
      role="tablist"
      aria-orientation=${this._orientation()}
      @click=${this._click}
      @keydown=${this._keydown}
    >
      <slot @slotchange=${this._slotChange}></slot>
      <div class="indicator" style=${indicator}></div>
    </div>`;
  }

  firstUpdated() {
    this._resizeObserver = new ResizeObserver(() => this._scheduleIndicator());
    this._observeTabs();
    this._tabsObserver = new MutationObserver(() => {
      this._synchronize(true);
      this._scheduleIndicator();
    });
    this._tabsObserver.observe(this, {
      attributes: true,
      attributeFilter: ['disabled', 'id', 'panel'],
      childList: true,
      characterData: true,
      subtree: true,
    });
    window.addEventListener('resize', this._onWindowResize);
    this._synchronize();
    this._scheduleIndicator();
    void document.fonts?.ready.then(() => this._scheduleIndicator());
  }

  updated(changed: Map<string, unknown>) {
    if (
      changed.has('orientation') &&
      this.orientation !== this._orientation()
    ) {
      this.orientation = this._orientation();
      return;
    }
    if (changed.has('activation') && this.activation !== this._activation()) {
      this.activation = this._activation();
      return;
    }
    if (changed.has('activeTab') || changed.has('orientation')) {
      this._synchronize();
      this._scheduleIndicator();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
    this._tabsObserver?.disconnect();
    window.removeEventListener('resize', this._onWindowResize);
    if (this._indicatorFrame !== undefined)
      cancelAnimationFrame(this._indicatorFrame);
    for (const [panel, state] of this._managedPanels)
      this._restorePanel(panel, state);
    this._managedPanels.clear();
  }

  private _slotChange() {
    this._observeTabs();
    this._synchronize(true);
    this._scheduleIndicator();
  }
  private _observeTabs() {
    this._resizeObserver?.disconnect();
    const list = this.shadowRoot?.querySelector('.tabs-container');
    if (list) this._resizeObserver?.observe(list);
    this._tabs().forEach((tab) => this._resizeObserver?.observe(tab));
  }

  private _synchronize(preserve = false) {
    const tabs = this._tabs();
    const selectedIndex = this._recover(
      tabs,
      preserve ? this._activeTab : undefined,
    );
    const selected = selectedIndex === -1 ? undefined : tabs[selectedIndex];
    const focused = this._recoverFocusedTab(tabs, selected);
    const panels = new Map<HTMLElement, M3Tab>();
    for (const [panel, state] of this._managedPanels) {
      if (!tabs.some((tab) => this._panel(tab) === panel)) {
        this._restorePanel(panel, state);
        this._managedPanels.delete(panel);
      }
    }
    tabs.forEach((tab, index) => {
      const isSelected = tab === selected;
      if (!tab.id) tab.id = `m3-tabs-${this._id}-tab-${index + 1}`;
      tab.active = isSelected;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', String(isSelected));
      if (tab.disabled) tab.setAttribute('aria-disabled', 'true');
      else tab.removeAttribute('aria-disabled');
      tab.tabIndex = tab === focused ? 0 : -1;
      const panel = this._panel(tab);
      if (panel && !panels.has(panel)) {
        panels.set(panel, tab);
        this._managePanel(panel);
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tab.id);
        panel.hidden = !isSelected;
        tab.setAttribute('aria-controls', panel.id);
      } else tab.removeAttribute('aria-controls');
    });
    this._activeTab = selected;
    this._focusedTab = focused;
    if (this.activeTab !== selectedIndex) this.activeTab = selectedIndex;
  }

  private _recover(tabs: M3Tab[], previous?: M3Tab) {
    if (previous && tabs.includes(previous) && !previous.disabled)
      return tabs.indexOf(previous);
    if (!tabs.some((tab) => !tab.disabled)) return -1;
    const requested = Number.isFinite(this.activeTab)
      ? Math.trunc(this.activeTab)
      : 0;
    const start = Math.min(Math.max(requested, 0), tabs.length - 1);
    for (let offset = 0; offset < tabs.length; offset += 1) {
      const index = (start + offset) % tabs.length;
      if (!tabs[index].disabled) return index;
    }
    return -1;
  }

  private _recoverFocusedTab(tabs: M3Tab[], selected?: M3Tab) {
    if (
      this._focusedTab &&
      tabs.includes(this._focusedTab) &&
      !this._focusedTab.disabled
    ) {
      return this._focusedTab;
    }
    return selected;
  }

  private _panel(tab: M3Tab) {
    if (!tab.panel) return null;
    const root = this.getRootNode();
    if (!(root instanceof Document || root instanceof ShadowRoot)) return null;
    return (
      [...root.querySelectorAll<HTMLElement>('[id]')].find(
        (element) => element.id === tab.panel,
      ) ?? null
    );
  }
  private _managePanel(panel: HTMLElement) {
    if (!this._managedPanels.has(panel))
      this._managedPanels.set(panel, {
        ariaLabelledBy: panel.getAttribute('aria-labelledby'),
        hidden: panel.hidden,
        role: panel.getAttribute('role'),
      });
  }
  private _restorePanel(panel: HTMLElement, state: PanelState) {
    if (state.ariaLabelledBy === null) panel.removeAttribute('aria-labelledby');
    else panel.setAttribute('aria-labelledby', state.ariaLabelledBy);
    if (state.role === null) panel.removeAttribute('role');
    else panel.setAttribute('role', state.role);
    panel.hidden = state.hidden;
  }
  private _tabs(): M3Tab[] {
    const slot = this.shadowRoot?.querySelector('slot');
    return slot
      ? slot
          .assignedElements({ flatten: true })
          .filter((element): element is M3Tab => element instanceof M3Tab)
      : [];
  }

  private _click(event: Event) {
    const tab = event
      .composedPath()
      .find((element): element is M3Tab => element instanceof M3Tab);
    if (tab && !tab.disabled) {
      this._setFocusedTab(tab);
      this._activate(tab, 'click');
    }
  }
  private _keydown(event: KeyboardEvent) {
    const current = event
      .composedPath()
      .find((element): element is M3Tab => element instanceof M3Tab);
    if (!current || current.disabled) return;
    const tabs = this._tabs();
    const currentIndex = tabs.indexOf(current);
    const nextKey =
      this._orientation() === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    const previousKey =
      this._orientation() === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    let index: number | undefined;
    if (event.key === nextKey) index = this._next(tabs, currentIndex, 1);
    else if (event.key === previousKey)
      index = this._next(tabs, currentIndex, -1);
    else if (event.key === 'Home')
      index = tabs.findIndex((tab) => !tab.disabled);
    else if (event.key === 'End')
      index = tabs.map((tab) => !tab.disabled).lastIndexOf(true);
    else if (
      (event.key === 'Enter' || event.key === ' ') &&
      this._activation() === 'manual'
    ) {
      event.preventDefault();
      this._activate(current, 'keyboard');
      return;
    } else return;
    if (index === undefined || index === -1) return;
    event.preventDefault();
    this._setFocusedTab(tabs[index]);
    tabs[index].focus();
    if (this._activation() === 'automatic')
      this._activate(tabs[index], 'keyboard');
  }
  private _next(tabs: M3Tab[], current: number, direction: 1 | -1) {
    for (let offset = 1; offset <= tabs.length; offset += 1) {
      const index = (current + direction * offset + tabs.length) % tabs.length;
      if (!tabs[index].disabled) return index;
    }
    return -1;
  }
  private _setFocusedTab(tab: M3Tab) {
    this._focusedTab = tab;
    this._tabs().forEach((candidate) => {
      candidate.tabIndex = candidate === tab ? 0 : -1;
    });
  }
  private _activate(tab: M3Tab, reason: TabChangeReason) {
    const activeTab = this._tabs().indexOf(tab);
    if (activeTab === -1 || activeTab === this.activeTab) return;
    this.activeTab = activeTab;
    this.dispatchEvent(
      new CustomEvent<TabChangeDetail>('tab-change', {
        bubbles: true,
        composed: true,
        detail: { activeTab, reason, value: tab.value },
      }),
    );
  }
  private _orientation(): TabsOrientation {
    return this.orientation === 'vertical' ? 'vertical' : 'horizontal';
  }
  private _activation(): TabsActivation {
    return this.activation === 'manual' ? 'manual' : 'automatic';
  }
  private _scheduleIndicator() {
    if (this._indicatorFrame !== undefined)
      cancelAnimationFrame(this._indicatorFrame);
    this._indicatorFrame = requestAnimationFrame(() => {
      this._indicatorFrame = undefined;
      const tab = this._activeTab;
      const list = this.shadowRoot?.querySelector('.tabs-container');
      if (!tab || !list) {
        this._indicatorOffset = 0;
        this._indicatorSize = 0;
        return;
      }
      const tabRect = tab.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      this._indicatorOffset =
        this._orientation() === 'vertical'
          ? tabRect.top - listRect.top
          : tabRect.left - listRect.left;
      this._indicatorSize =
        this._orientation() === 'vertical' ? tabRect.height : tabRect.width;
    });
  }
}

/** A tab controlled by its nearest `m3-tabs`; `panel` is its required panel ID. */
@customElement('m3-tab')
export class M3Tab extends LitElement {
  static styles = m3TabStyles;
  /** @internal Managed by m3-tabs. */ @property({
    type: Boolean,
    reflect: true,
  })
  active = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) value = '';
  @property({ type: String }) panel = '';
  render() {
    return html`<div class="tab">
      <slot name="icon"></slot>
      <div class="label"><slot></slot></div>
      <div class="state-layer"></div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-tabs': M3Tabs;
    'm3-tab': M3Tab;
  }
  interface HTMLElementEventMap {
    'tab-change': CustomEvent<TabChangeDetail>;
  }
}
