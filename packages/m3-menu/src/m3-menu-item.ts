import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('m3-menu-item')
export class M3MenuItem extends LitElement {
    static styles = css`
      :host {
        display: block;
      }

      .item {
        width: 100%;
        min-height: 48px;
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 12px;
        padding: 0 12px;
        border: none;
        border-radius: 12px;
        background: transparent;
        color: var(--md-sys-color-on-surface, #1d1b20);
        font: inherit;
        text-align: left;
        cursor: pointer;
      }

      .item.no-leading {
        grid-template-columns: 1fr auto;
      }

      .item.no-trailing {
        grid-template-columns: auto 1fr;
      }

      .item.no-leading.no-trailing {
        grid-template-columns: 1fr;
      }

      .item:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .item:focus-visible {
        outline: 2px solid var(--md-sys-color-primary, #6750a4);
        outline-offset: 2px;
      }

      .item:disabled {
        cursor: default;
        opacity: 0.38;
      }

      .icon-slot {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 24px;
        min-height: 24px;
      }

      .icon-slot[hidden] {
        display: none;
      }

      .label {
        min-width: 0;
        font-size: 0.875rem;
        font-weight: 500;
        line-height: 1.25rem;
      }
    `;

    @property({ type: String })
    value = '';

    @property({ type: Boolean, reflect: true })
    disabled = false;

    @state()
    private _hasLeadingIcon = false;

    @state()
    private _hasTrailingIcon = false;

    render() {
        const itemClasses = [
            'item',
            this._hasLeadingIcon ? '' : 'no-leading',
            this._hasTrailingIcon ? '' : 'no-trailing'
        ].filter(Boolean).join(' ');

        return html`
      <button
        class=${itemClasses}
        type="button"
        role="menuitem"
        ?disabled=${this.disabled}
        @click=${this._handleClick}
      >
        <span class="icon-slot" ?hidden=${!this._hasLeadingIcon}>
          <slot name="leading-icon" @slotchange=${this._handleLeadingSlotChange}></slot>
        </span>
        <span class="label">
          <slot></slot>
        </span>
        <span class="icon-slot" ?hidden=${!this._hasTrailingIcon}>
          <slot name="trailing-icon" @slotchange=${this._handleTrailingSlotChange}></slot>
        </span>
      </button>
    `;
    }

    firstUpdated() {
        this._syncSlotState();
    }

    focus(options?: FocusOptions) {
        this.shadowRoot?.querySelector<HTMLButtonElement>('button')?.focus(options);
    }

    private _handleClick() {
        if (this.disabled) {
            return;
        }

        const labelSlot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
        const text = labelSlot
            ?.assignedNodes({ flatten: true })
            .map((node) => node.textContent ?? '')
            .join('')
            .trim() ?? '';

        this.dispatchEvent(new CustomEvent('menu-item-select', {
            bubbles: true,
            composed: true,
            detail: {
                value: this.value || text,
                text
            }
        }));
    }

    private _handleLeadingSlotChange = () => {
        this._hasLeadingIcon = this._slotHasContent('leading-icon');
    };

    private _handleTrailingSlotChange = () => {
        this._hasTrailingIcon = this._slotHasContent('trailing-icon');
    };

    private _syncSlotState() {
        this._hasLeadingIcon = this._slotHasContent('leading-icon');
        this._hasTrailingIcon = this._slotHasContent('trailing-icon');
    }

    private _slotHasContent(name: string) {
        return this.shadowRoot
            ?.querySelector<HTMLSlotElement>(`slot[name="${name}"]`)
            ?.assignedNodes({ flatten: true })
            .some((node) => (node.textContent ?? '').trim().length > 0) ?? false;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'm3-menu-item': M3MenuItem;
    }
}
