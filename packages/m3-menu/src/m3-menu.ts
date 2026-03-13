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
        setTimeout(() => this._requestDismiss('selection'), 0);
    };

    updated(changedProperties: Map<string, unknown>) {
        if (changedProperties.has('offset')) {
            this._syncOffset();
        }

        if (changedProperties.has('open') && this.open) {
            queueMicrotask(() => this.focusFirstItem());
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

    private _handleDocumentPointerDown = (event: Event) => {
        if (!this.open) {
            return;
        }

        // Ignore events if the menu is hidden (e.g., its parent is display: none due to responsive CSS)
        if (this.getClientRects().length === 0) {
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

        this._requestDismiss('outside');
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
                this._requestDismiss('escape');
                break;
            case 'Tab':
                this._requestDismiss('tab');
                break;
            default:
                break;
        }
    };

    private _handleItemSelect = () => {
        this._requestDismiss('selection');
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

    private _requestDismiss(reason: 'escape' | 'outside' | 'selection' | 'tab') {
        this.dispatchEvent(new CustomEvent('menu-dismiss', {
            bubbles: true,
            composed: true,
            detail: { reason }
        }));
    }

    private _syncOffset() {
        this.style.setProperty('--md-menu-offset', `${this.offset}px`);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'm3-menu': M3Menu;
    }
}
