import { LitElement, html } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { m3MenuStyles } from './m3-menu.styles.js';
import './m3-menu-item.js';

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

    @queryAssignedElements({ flatten: true })
    private _assignedElements!: HTMLElement[];

    private _pendingOpenReason: M3MenuOpenReason | undefined;
    private _returnFocus: HTMLElement | null = null;

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
                if (!this._returnFocus && document.activeElement instanceof HTMLElement) {
                    this._returnFocus = document.activeElement;
                }
                queueMicrotask(() => this.focusFirstItem());
            } else {
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
    show(reason: Extract<M3MenuOpenReason, 'trigger' | 'programmatic'> = 'programmatic') {
        if (this.open) {
            return;
        }
        this._returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
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
        const pathIncludesAnchor = this.parentElement != null && path.includes(this.parentElement);
        const pathIncludesSlottedContent = path.some(
            (node) => node instanceof Node && this.contains(node)
        );
        if (pathIncludesMenu || pathIncludesAnchor || pathIncludesSlottedContent) {
            return;
        }

        this.dismiss('outside');
    };

    private _handleKeydown = (event: KeyboardEvent) => {
        if (!this.open) {
            return;
        }

        const items = this._enabledItems();
        if (items.length === 0) {
            return;
        }

        const activeIndex = items.findIndex((item) => item.shadowRoot?.activeElement || item === document.activeElement);

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this._focusItem(activeIndex < 0 ? 0 : (activeIndex + 1) % items.length);
                break;
            case 'ArrowUp':
                event.preventDefault();
                this._focusItem(activeIndex < 0 ? items.length - 1 : (activeIndex - 1 + items.length) % items.length);
                break;
            case 'Home':
                event.preventDefault();
                this._focusItem(0);
                break;
            case 'End':
                event.preventDefault();
                this._focusItem(items.length - 1);
                break;
            case 'Escape':
                event.preventDefault();
                this.dismiss('escape');
                break;
            case 'Tab':
                this.dismiss('tab');
                break;
            default:
                break;
        }
    };

    private _handleItemSelect = () => {
        this.dismiss('selection');
    };

    private _enabledItems() {
        return (this._assignedElements ?? []).filter((element) =>
            element.tagName === 'M3-MENU-ITEM' && !element.hasAttribute('disabled')
        );
    }

    private _focusItem(index: number) {
        const items = this._enabledItems();
        if (index < 0 || index >= items.length) {
            return;
        }

        items[index].focus();
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
