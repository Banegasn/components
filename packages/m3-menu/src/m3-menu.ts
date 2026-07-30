import { LitElement, html } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { m3MenuStyles } from './m3-menu.styles.js';
import './m3-menu-item.js';
import type { M3MenuItem } from './m3-menu-item.js';

export type M3MenuPlacement =
    | 'bottom-start'
    | 'bottom-center'
    | 'bottom-end'
    | 'top-start'
    | 'top-center'
    | 'top-end'
    | 'right-start'
    | 'right-center'
    | 'right-end'
    | 'left-start'
    | 'left-center'
    | 'left-end';

export type M3MenuDismissReason = 'escape' | 'outside' | 'selection' | 'tab';
export type M3MenuOpenReason = 'trigger' | 'programmatic' | M3MenuDismissReason;

@customElement('m3-menu')
export class M3Menu extends LitElement {
    static styles = m3MenuStyles;

    @property({ type: Boolean, reflect: true })
    open = false;

    @property({ type: String, reflect: true })
    placement: M3MenuPlacement = 'bottom-end';

    @property({ type: Number, reflect: true })
    offset = 8;

    /** Whether a programmatic open should move focus into the menu. */
    @property({ type: Boolean, attribute: 'focus-on-open' })
    focusOnOpen = true;

    @queryAssignedElements({ flatten: true })
    private _assignedElements!: HTMLElement[];

    private _pendingOpenReason: M3MenuOpenReason | undefined;
    private _returnFocus: HTMLElement | null = null;
    private _opener: HTMLElement | null = null;
    private _pendingTabDismiss = false;

    connectedCallback() {
        super.connectedCallback();
        this._syncOffset();
        this.addEventListener('menu-item-select', this._handleMenuItemSelectBubble);
        document.addEventListener('pointerdown', this._handleDocumentPointerDown, true);
    }

    disconnectedCallback() {
        this.removeEventListener('menu-item-select', this._handleMenuItemSelectBubble);
        document.removeEventListener('pointerdown', this._handleDocumentPointerDown, true);
        super.disconnectedCallback();
    }

    private _handleMenuItemSelectBubble = (event: Event) => {
        if (event.target === this) return;
        const ce = event as CustomEvent<{ value?: string; text?: string }>;
        const detail = ce.detail ?? {};
        event.stopPropagation();
        this.dispatchEvent(new CustomEvent('menu-item-select', { bubbles: true, composed: true, detail }));
        queueMicrotask(() => this.dismiss('selection'));
    };

    updated(changedProperties: Map<string, unknown>) {
        if (changedProperties.has('offset')) {
            this._syncOffset();
        }

        if (changedProperties.has('open')) {
            const reason = this._pendingOpenReason ?? 'programmatic';
            this._pendingOpenReason = undefined;
            this.dispatchEvent(new CustomEvent('menu-open-change', {
                bubbles: true,
                composed: true,
                detail: { open: this.open, reason }
            }));

            if (this.open) {
                this._setRovingTabstop(0);
                // Pointer-driven menus can opt out of moving keyboard focus on
                // open, while explicit trigger activation always enters the menu.
                if (reason === 'trigger' || this.focusOnOpen) {
                    if (!this._returnFocus && document.activeElement instanceof HTMLElement) {
                        this._returnFocus = document.activeElement;
                    }
                    queueMicrotask(() => this.focusFirstItem());
                }
            } else {
                this._pendingTabDismiss = false;
                if (reason !== 'programmatic') {
                    this.dispatchEvent(new CustomEvent('menu-dismiss', {
                        bubbles: true,
                        composed: true,
                        detail: { reason }
                    }));
                }
                if (reason !== 'tab') {
                    this._returnFocus?.focus();
                }
                this._returnFocus = null;
                this._opener = null;
            }
        }
    }

    render() {
        return html`
      <div
        class="surface"
        part="surface"
        role="menu"
        ?hidden=${!this.open}
        @keydown=${this._handleKeydown}
        @focusout=${this._handleFocusOut}
      >
        <slot @menu-item-select=${this._handleItemSelect}></slot>
      </div>
    `;
    }

    focusFirstItem() {
        this._focusItem(0);
    }

    focusLastItem() {
        const items = this._enabledItems();
        this._focusItem(items.length - 1);
    }

    /** Opens the menu and moves focus to its first enabled item. */
    show(
        reason: Extract<M3MenuOpenReason, 'trigger' | 'programmatic'> = 'programmatic',
        opener: HTMLElement | null = document.activeElement instanceof HTMLElement && document.activeElement !== document.body
            ? document.activeElement
            : null
    ) {
        if (this.open) {
            if (reason === 'trigger') {
                this._returnFocus = opener;
                this._opener = opener;
                this.focusFirstItem();
            }
            return;
        }
        this._returnFocus = opener;
        this._opener = opener;
        this._setOpen(true, reason);
    }

    /** Closes the menu, reports the reason, and restores trigger focus except on Tab. */
    dismiss(reason: M3MenuOpenReason = 'programmatic') {
        if (!this.open) {
            return;
        }
        this._setOpen(false, reason);
    }

    private _handleDocumentPointerDown = (event: Event) => {
        if (!this.open) {
            return;
        }

        const path = event.composedPath();
        const pathIncludesMenu = path.includes(this);
        const pathIncludesOpener = this._opener != null && path.includes(this._opener);
        const pathIncludesSlottedContent = path.some(
            (node) => node instanceof Node && this.contains(node)
        );
        if (pathIncludesMenu || pathIncludesOpener || pathIncludesSlottedContent) {
            return;
        }

        this.dismiss('outside');
    };

    private _handleKeydown = (event: KeyboardEvent) => {
        if (!this.open) {
            return;
        }

        switch (event.key) {
            case 'ArrowDown':
                if (this._enabledItems().length === 0) return;
                event.preventDefault();
                {
                    const items = this._enabledItems();
                    const activeIndex = items.findIndex((item) => item.shadowRoot?.activeElement || item === document.activeElement);
                    this._focusItem(activeIndex < 0 ? 0 : (activeIndex + 1) % items.length);
                }
                break;
            case 'ArrowUp':
                if (this._enabledItems().length === 0) return;
                event.preventDefault();
                {
                    const items = this._enabledItems();
                    const activeIndex = items.findIndex((item) => item.shadowRoot?.activeElement || item === document.activeElement);
                    this._focusItem(activeIndex < 0 ? items.length - 1 : (activeIndex - 1 + items.length) % items.length);
                }
                break;
            case 'Home':
                if (this._enabledItems().length === 0) return;
                event.preventDefault();
                this._focusItem(0);
                break;
            case 'End':
                if (this._enabledItems().length === 0) return;
                event.preventDefault();
                this._focusItem(this._enabledItems().length - 1);
                break;
            case 'Escape':
                event.preventDefault();
                this.dismiss('escape');
                break;
            case 'Tab':
                // Keep the focused item available while the browser performs
                // its native sequential focus navigation. _handleFocusOut
                // dismisses once focus has actually left the menu.
                this._pendingTabDismiss = true;
                break;
            default:
                break;
        }
    };

    private _handleItemSelect = () => {
        this.dismiss('selection');
    };

    private _handleFocusOut = () => {
        queueMicrotask(() => {
            if (!this._pendingTabDismiss) {
                return;
            }

            this._pendingTabDismiss = false;
            if (this.open && !this.matches(':focus-within')) {
                this.dismiss('tab');
            }
        });
    };

    private _enabledItems(): M3MenuItem[] {
        return (this._assignedElements ?? []).flatMap((element) => {
            if (element.tagName === 'M3-MENU-ITEM') {
                return [element];
            }
            return Array.from(element.querySelectorAll<HTMLElement>('m3-menu-item'));
        }).filter((element) => !element.hasAttribute('disabled')) as M3MenuItem[];
    }

    private _focusItem(index: number) {
        const items = this._enabledItems();
        if (index < 0 || index >= items.length) {
            return;
        }

        this._setRovingTabstop(index);
        items[index].focus();
    }

    private _setRovingTabstop(activeIndex: number) {
        this._enabledItems().forEach((item, itemIndex) => item.setTabbable(itemIndex === activeIndex));
    }

    private _setOpen(open: boolean, reason: M3MenuOpenReason) {
        this._pendingOpenReason = reason;
        this.open = open;
    }

    private _syncOffset() {
        this.style.setProperty('--_menu-offset', `${this.offset}px`);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'm3-menu': M3Menu;
    }
}
