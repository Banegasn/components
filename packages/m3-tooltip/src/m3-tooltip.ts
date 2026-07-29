import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { m3TooltipStyles } from './m3-tooltip.styles.js';

export type M3TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
export type M3TooltipVariant = 'plain' | 'rich';

const VIEWPORT_PADDING = 8;
const TOOLTIP_GAP = 8;
const RICH_HIDE_DELAY = 100;
let nextTooltipId = 0;

/**
 * Material Design 3 Tooltip Component.
 *
 * Exactly one direct, un-slotted element child is the trigger. Plain tooltips
 * describe that trigger; rich tooltips can additionally receive focus and
 * contain interactive content through their named slots.
 *
 * @slot - The trigger element
 * @slot title - Rich-tooltip heading
 * @slot content - Rich-tooltip body and interactive content
 */
@customElement('m3-tooltip')
export class M3Tooltip extends LitElement {
  static styles = m3TooltipStyles;

  /** Plain-tooltip text. */
  @property({ type: String }) text = '';

  /** Plain (descriptive) or rich (interactive) tooltip. */
  @property({ type: String, reflect: true })
  variant: M3TooltipVariant = 'plain';

  /** Preferred placement. The resolved placement may flip at viewport edges. */
  @property({ type: String, reflect: true })
  placement: M3TooltipPlacement = 'top';

  /** Delay, in milliseconds, before pointer hover shows the tooltip. */
  @property({ type: Number, reflect: true })
  delay = 500;

  @state() private _visible = false;
  @state() private _positioned = false;
  @state() private _resolvedPlacement: M3TooltipPlacement = 'top';

  private readonly _tooltipId = `m3-tooltip-${++nextTooltipId}`;
  private _trigger: HTMLElement | null = null;
  private _description: HTMLSpanElement | null = null;
  private _showTimeout: ReturnType<typeof setTimeout> | null = null;
  private _hideTimeout: ReturnType<typeof setTimeout> | null = null;
  private _positionFrame: number | null = null;

  connectedCallback() {
    super.connectedCallback();
    this._ensureDescription();
    this._setTrigger(this._findTrigger());
    window.addEventListener('resize', this._queuePosition);
    document.addEventListener('scroll', this._queuePosition, true);
    window.visualViewport?.addEventListener('resize', this._queuePosition);
  }

  disconnectedCallback() {
    this._clearTimeouts();
    this._cancelPosition();
    window.removeEventListener('resize', this._queuePosition);
    document.removeEventListener('scroll', this._queuePosition, true);
    window.visualViewport?.removeEventListener('resize', this._queuePosition);
    this._setTrigger(null);
    this._description?.remove();
    this._description = null;
    super.disconnectedCallback();
  }

  render() {
    const isRich = this.variant === 'rich';
    const hasTitle = this._hasRichTitle();

    return html`
      <slot @slotchange=${this._handleTriggerSlotChange}></slot>
      <div
        id=${this._tooltipId}
        class="tooltip-surface"
        part="surface"
        role=${isRich ? 'dialog' : 'tooltip'}
        aria-label=${ifDefined(isRich && !hasTitle ? 'Rich tooltip' : undefined)}
        aria-labelledby=${ifDefined(isRich && hasTitle ? `${this._tooltipId}-title` : undefined)}
        tabindex=${ifDefined(isRich ? '0' : undefined)}
        data-placement=${this._resolvedPlacement}
        ?visible=${this._visible}
        ?positioned=${this._positioned}
        aria-hidden=${String(!this._visible)}
        @mouseenter=${this._handleSurfaceMouseEnter}
        @mouseleave=${this._handleSurfaceMouseLeave}
        @focusin=${this._handleSurfaceFocusIn}
        @focusout=${this._handleSurfaceFocusOut}
        @keydown=${this._handleKeydown}
      >
        ${isRich
          ? html`
              <div id=${`${this._tooltipId}-title`} class="rich-title"><slot name="title" @slotchange=${this._handleRichSlotChange}></slot></div>
              <div class="rich-content"><slot name="content" @slotchange=${this._handleRichSlotChange}></slot></div>
            `
          : this.text}
      </div>
    `;
  }

  updated(changedProperties: Map<string, unknown>) {
    // Lit can finish an update after this element has been detached. Do not
    // recreate owned light-DOM nodes or mutate a trigger until reconnection.
    if (!this.isConnected) return;
    this._ensureDescription();
    this._syncDescription();
    this._setTrigger(this._findTrigger());
    if (changedProperties.has('_visible') || changedProperties.has('placement') || changedProperties.has('variant') || changedProperties.has('text')) {
      this._queuePosition();
    }
  }

  private _handleTriggerSlotChange = () => this._setTrigger(this._findTrigger());

  private _handleRichSlotChange = () => {
    this.requestUpdate();
    this._syncDescription();
    this._queuePosition();
  };

  private _handleTriggerMouseEnter = () => this._scheduleShow();

  private _handleTriggerMouseLeave = (event: MouseEvent) => {
    if (!this._isTooltipNode(event.relatedTarget)) this._scheduleHide();
  };

  private _handleTriggerFocusIn = () => this._showNow();

  private _handleTriggerFocusOut = (event: FocusEvent) => {
    if (!this._isTooltipNode(event.relatedTarget)) this._scheduleHide();
  };

  private _handleSurfaceMouseEnter = () => {
    this._clearHideTimeout();
    this._showNow();
  };

  private _handleSurfaceMouseLeave = (event: MouseEvent) => {
    if (!this._isTooltipNode(event.relatedTarget)) this._scheduleHide();
  };

  private _handleSurfaceFocusIn = () => {
    this._clearHideTimeout();
    this._showNow();
  };

  private _handleSurfaceFocusOut = (event: FocusEvent) => {
    if (!this._isTooltipNode(event.relatedTarget)) this._scheduleHide();
  };

  private _handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') this._hideNow();
  };

  private _scheduleShow() {
    this._clearHideTimeout();
    if (this._visible || this._showTimeout !== null) return;
    this._showTimeout = setTimeout(() => {
      this._showTimeout = null;
      this._showNow();
    }, Math.max(0, Number.isFinite(this.delay) ? this.delay : 0));
  }

  private _scheduleHide() {
    this._clearShowTimeout();
    if (!this._visible || this._hideTimeout !== null) return;
    this._hideTimeout = setTimeout(() => {
      this._hideTimeout = null;
      this._hideNow();
    }, this.variant === 'rich' ? RICH_HIDE_DELAY : 0);
  }

  private _showNow() {
    this._clearShowTimeout();
    this._clearHideTimeout();
    if (!this._visible) {
      this._positioned = false;
      this._visible = true;
    }
    this._queuePosition();
  }

  private _hideNow() {
    this._clearTimeouts();
    this._visible = false;
    this._positioned = false;
  }

  private _clearShowTimeout() {
    if (this._showTimeout !== null) {
      clearTimeout(this._showTimeout);
      this._showTimeout = null;
    }
  }

  private _clearHideTimeout() {
    if (this._hideTimeout !== null) {
      clearTimeout(this._hideTimeout);
      this._hideTimeout = null;
    }
  }

  private _clearTimeouts() {
    this._clearShowTimeout();
    this._clearHideTimeout();
  }

  private _findTrigger(): HTMLElement | null {
    return Array.from(this.children).find((child): child is HTMLElement =>
      child instanceof HTMLElement && child !== this._description && !child.hasAttribute('slot'),
    ) ?? null;
  }

  private _setTrigger(trigger: HTMLElement | null) {
    if (trigger === this._trigger) return;
    if (this._trigger) {
      this._trigger.removeEventListener('mouseenter', this._handleTriggerMouseEnter);
      this._trigger.removeEventListener('mouseleave', this._handleTriggerMouseLeave);
      this._trigger.removeEventListener('focusin', this._handleTriggerFocusIn);
      this._trigger.removeEventListener('focusout', this._handleTriggerFocusOut);
      this._trigger.removeEventListener('keydown', this._handleKeydown);
      this._removeDescriptionFrom(this._trigger);
    }
    this._trigger = trigger;
    if (!trigger) return;
    this._addDescriptionTo(trigger);
    trigger.addEventListener('mouseenter', this._handleTriggerMouseEnter);
    trigger.addEventListener('mouseleave', this._handleTriggerMouseLeave);
    trigger.addEventListener('focusin', this._handleTriggerFocusIn);
    trigger.addEventListener('focusout', this._handleTriggerFocusOut);
    trigger.addEventListener('keydown', this._handleKeydown);
  }

  private _addDescriptionTo(trigger: HTMLElement) {
    const ids = trigger.getAttribute('aria-describedby')?.split(/\s+/).filter(Boolean) ?? [];
    if (!ids.includes(this._tooltipId)) trigger.setAttribute('aria-describedby', [...ids, this._tooltipId].join(' '));
  }

  private _removeDescriptionFrom(trigger: HTMLElement) {
    const remaining = (trigger.getAttribute('aria-describedby')?.split(/\s+/).filter(Boolean) ?? []).filter((id) => id !== this._tooltipId);
    if (remaining.length > 0) trigger.setAttribute('aria-describedby', remaining.join(' '));
    else trigger.removeAttribute('aria-describedby');
  }

  private _ensureDescription() {
    if (!this.isConnected) return;
    if (this._description?.parentNode === this) return;

    const existing = Array.from(this.children).find((child): child is HTMLSpanElement =>
      child instanceof HTMLSpanElement
      && child.id === this._tooltipId
      && child.slot === 'description',
    );
    if (existing) {
      this._description = existing;
      this._syncDescription();
      return;
    }

    const description = document.createElement('span');
    // IDREFs are resolved in the trigger's tree; the visual surface retains
    // the same stable ID in its shadow-tree scope.
    description.id = this._tooltipId;
    description.slot = 'description';
    description.hidden = true;
    this.append(description);
    this._description = description;
    this._syncDescription();
  }

  private _syncDescription() {
    if (!this._description) return;
    this._description.textContent = this.variant === 'rich'
      ? [this._slotText('title'), this._slotText('content')].filter(Boolean).join(' ')
      : this.text;
  }

  private _slotText(name: 'title' | 'content') {
    return Array.from(this.querySelectorAll<HTMLElement>(`[slot="${name}"]`))
      .map((element) => element.textContent?.trim() ?? '')
      .filter(Boolean)
      .join(' ');
  }

  private _hasRichTitle() {
    return this._slotText('title').length > 0;
  }

  private _isTooltipNode(node: EventTarget | null): boolean {
    if (!(node instanceof Node)) return false;
    const surface = this.shadowRoot?.querySelector<HTMLElement>('.tooltip-surface');
    return node === this._trigger || Boolean(
      this._trigger?.contains(node)
      || surface?.contains(node)
      || (node instanceof HTMLElement && node.getAttribute('slot') === 'content' && this.contains(node)),
    );
  }

  private _queuePosition = () => {
    if (!this._visible || this._positionFrame !== null) return;
    this._positionFrame = requestAnimationFrame(() => {
      this._positionFrame = null;
      this._positionSurface();
    });
  };

  private _cancelPosition() {
    if (this._positionFrame !== null) {
      cancelAnimationFrame(this._positionFrame);
      this._positionFrame = null;
    }
  }

  private _positionSurface() {
    const surface = this.shadowRoot?.querySelector<HTMLElement>('.tooltip-surface');
    if (!this._visible || !surface || !this._trigger) return;
    const trigger = this._trigger.getBoundingClientRect();
    const surfaceRect = surface.getBoundingClientRect();
    const candidates = [this.placement, this._oppositePlacement(this.placement), 'top', 'bottom', 'right', 'left'] as M3TooltipPlacement[];
    const positions = candidates.filter((placement, index) => candidates.indexOf(placement) === index).map((placement) => ({ placement, ...this._placementPosition(placement, trigger, surfaceRect) }));
    const best = positions.find(({ left, top }) => this._fitsViewport(left, top, surfaceRect))
      ?? positions.sort((a, b) => this._visibleArea(b.left, b.top, surfaceRect) - this._visibleArea(a.left, a.top, surfaceRect))[0]!;
    const maxLeft = Math.max(VIEWPORT_PADDING, window.innerWidth - surfaceRect.width - VIEWPORT_PADDING);
    const maxTop = Math.max(VIEWPORT_PADDING, window.innerHeight - surfaceRect.height - VIEWPORT_PADDING);
    surface.style.left = `${Math.min(Math.max(best.left, VIEWPORT_PADDING), maxLeft)}px`;
    surface.style.top = `${Math.min(Math.max(best.top, VIEWPORT_PADDING), maxTop)}px`;
    this._resolvedPlacement = best.placement;
    this._positioned = true;
  }

  private _placementPosition(placement: M3TooltipPlacement, trigger: DOMRect, surface: DOMRect) {
    switch (placement) {
      case 'bottom': return { left: trigger.left + trigger.width / 2 - surface.width / 2, top: trigger.bottom + TOOLTIP_GAP };
      case 'left': return { left: trigger.left - surface.width - TOOLTIP_GAP, top: trigger.top + trigger.height / 2 - surface.height / 2 };
      case 'right': return { left: trigger.right + TOOLTIP_GAP, top: trigger.top + trigger.height / 2 - surface.height / 2 };
      case 'top': return { left: trigger.left + trigger.width / 2 - surface.width / 2, top: trigger.top - surface.height - TOOLTIP_GAP };
    }
  }

  private _oppositePlacement(placement: M3TooltipPlacement): M3TooltipPlacement {
    return ({ top: 'bottom', bottom: 'top', left: 'right', right: 'left' })[placement] as M3TooltipPlacement;
  }

  private _fitsViewport(left: number, top: number, surface: DOMRect) {
    return left >= VIEWPORT_PADDING && top >= VIEWPORT_PADDING && left + surface.width <= window.innerWidth - VIEWPORT_PADDING && top + surface.height <= window.innerHeight - VIEWPORT_PADDING;
  }

  private _visibleArea(left: number, top: number, surface: DOMRect) {
    return Math.max(0, Math.min(left + surface.width, window.innerWidth - VIEWPORT_PADDING) - Math.max(left, VIEWPORT_PADDING)) * Math.max(0, Math.min(top + surface.height, window.innerHeight - VIEWPORT_PADDING) - Math.max(top, VIEWPORT_PADDING));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-tooltip': M3Tooltip;
  }
}
