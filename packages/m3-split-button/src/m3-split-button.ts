import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { m3SplitButtonStyles } from './m3-split-button.styles.js';

type MenuOpenReason =
  'trigger' | 'programmatic' | 'escape' | 'outside' | 'selection' | 'tab';

interface MenuElement extends HTMLElement {
  open: boolean;
  show(reason?: 'trigger' | 'programmatic', opener?: HTMLElement | null): void;
  dismiss(reason?: MenuOpenReason): void;
  focusFirstItem(): void;
  focusLastItem(): void;
}

let menuId = 0;

/** A primary action paired with an `m3-menu` in the named `menu` slot. */
@customElement('m3-split-button')
export class M3SplitButton extends LitElement {
  static styles = m3SplitButtonStyles;

  @property({ type: String, reflect: true })
  variant: 'filled' | 'outlined' | 'tonal' | 'elevated' = 'filled';

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String, attribute: 'menu-label' })
  menuLabel = 'More options';

  @queryAssignedElements({ slot: 'menu', flatten: true })
  private _menus!: HTMLElement[];

  private _pendingReason: MenuOpenReason | undefined;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('menu-open-change', this._handleMenuOpenChange);
    this.addEventListener('menu-dismiss', this._handleMenuDismiss);
  }

  disconnectedCallback() {
    this.removeEventListener('menu-open-change', this._handleMenuOpenChange);
    this.removeEventListener('menu-dismiss', this._handleMenuDismiss);
    super.disconnectedCallback();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (!changedProperties.has('open')) {
      return;
    }

    const reason = this._pendingReason ?? 'programmatic';
    this._pendingReason = undefined;
    const menu = this._menu();
    if (menu && menu.open !== this.open) {
      if (this.open) {
        menu.show(
          reason === 'programmatic' ? 'programmatic' : 'trigger',
          this._menuTrigger(),
        );
      } else {
        menu.dismiss(reason);
      }
    }
    this.dispatchEvent(
      new CustomEvent('split-button-open-change', {
        bubbles: true,
        composed: true,
        detail: { open: this.open, reason },
      }),
    );
  }

  render() {
    const controls = this._menu()?.id || undefined;
    return html`
      <button
        class="button"
        type="button"
        ?disabled=${this.disabled}
        @click=${this._handleMainClick}
      >
        <slot></slot>
      </button>
      <button
        class="menu-button ${this.open ? 'active' : ''}"
        type="button"
        ?disabled=${this.disabled}
        aria-label=${ifDefined(this.menuLabel || undefined)}
        aria-haspopup="menu"
        aria-expanded=${String(this.open)}
        aria-controls=${ifDefined(controls || undefined)}
        @click=${this._toggle}
        @keydown=${this._handleKeydown}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M480-360 280-560h400L480-360Z" />
        </svg>
      </button>
      <slot name="menu" @slotchange=${this._handleMenuSlotChange}></slot>
    `;
  }

  private _handleMainClick = () => {
    if (this.disabled) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent('split-button-click', {
        bubbles: true,
        composed: true,
        detail: { action: 'main' },
      }),
    );
  };

  private _handleMenuSlotChange = () => {
    const menu = this._menu();
    if (!menu) {
      return;
    }
    if (!menu.id) {
      menu.id = `m3-split-button-menu-${++menuId}`;
    }
    if (menu.open !== this.open) {
      menu.open = this.open;
    }
    this.requestUpdate();
  };

  private _handleMenuOpenChange = (event: Event) => {
    if (event.target === this) {
      return;
    }
    const detail = (
      event as CustomEvent<{ open: boolean; reason: MenuOpenReason }>
    ).detail;
    this._pendingReason = detail.reason;
    this.open = detail.open;
  };

  private _handleMenuDismiss = (event: Event) => {
    if (event.target === this) {
      return;
    }
    const detail = (event as CustomEvent<{ reason: MenuOpenReason }>).detail;
    if (detail.reason !== 'tab') {
      this.shadowRoot
        ?.querySelector<HTMLButtonElement>('.menu-button')
        ?.focus();
    }
    this.dispatchEvent(
      new CustomEvent('split-button-dismiss', {
        bubbles: true,
        composed: true,
        detail,
      }),
    );
  };

  private _toggle = (event: MouseEvent) => {
    if (!this.disabled) {
      (event.currentTarget as HTMLButtonElement).focus();
      this._requestOpen(!this.open, 'trigger');
    }
  };

  private _handleKeydown = (event: KeyboardEvent) => {
    if (this.disabled) {
      return;
    }
    if (event.key === 'Escape' && this.open) {
      event.preventDefault();
      this._requestOpen(false, 'escape');
      return;
    }
    if (
      !this.open &&
      ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)
    ) {
      event.preventDefault();
      this._requestOpen(true, 'trigger');
      queueMicrotask(() => {
        const menu = this._menu();
        if (event.key === 'ArrowUp' || event.key === 'End') {
          menu?.focusLastItem();
        } else {
          menu?.focusFirstItem();
        }
      });
    }
  };

  private _requestOpen(open: boolean, reason: MenuOpenReason) {
    if (this.open !== open) {
      this._pendingReason = reason;
      this.open = open;
    }
  }

  private _menu(): MenuElement | null {
    return (
      (this._menus?.find((element) => element.tagName === 'M3-MENU') as
        MenuElement | undefined) ?? null
    );
  }

  private _menuTrigger(): HTMLButtonElement | null {
    return (
      this.shadowRoot?.querySelector<HTMLButtonElement>('.menu-button') ?? null
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-split-button': M3SplitButton;
  }
}
