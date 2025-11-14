import { css } from 'lit';

export const m3SearchBarStyles = css`
  :host {
    display: block;
    --_bar-height: var(--md-search-bar-height, 38px);
    --_bar-shape: var(--md-search-bar-shape, 28px);
    --_bar-padding-horizontal: var(--md-search-bar-padding-horizontal, 16px);
    --_bar-padding-vertical: var(--md-search-bar-padding-vertical, 8px);
    --_input-font-size: var(--md-search-bar-input-font-size, 16px);
    --_input-line-height: var(--md-search-bar-input-line-height, 24px);
    --_icon-size: var(--md-search-bar-icon-size, 24px);
  }

  .search-bar {
    position: relative;
    max-width: 100%;
    height: var(--_bar-height);
    border-radius: var(--_bar-shape);
    background-color: var(--md-sys-color-surface-container-high);
    border: 1px solid var(--md-sys-color-outline-variant);
    display: flex;
    align-items: center;
    padding: var(--_bar-padding-vertical) var(--_bar-padding-horizontal);
    gap: 12px;
    transition: background-color 0.2s cubic-bezier(0.2, 0, 0, 1),
                border-color 0.2s cubic-bezier(0.2, 0, 0, 1),
                box-shadow 0.2s cubic-bezier(0.2, 0, 0, 1);
    box-shadow: var(--md-sys-elevation-level1, 0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15));
  }

  .search-bar:focus-within {
    background-color: var(--md-sys-color-surface-container-high);
    border-color: var(--md-sys-color-primary);
    box-shadow: var(--md-sys-elevation-level2, 0 2px 4px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1));
  }

  .search-bar[disabled] {
    background-color: var(--md-sys-color-surface-container-high);
    border-color: var(--md-sys-color-outline-variant);
    opacity: 0.38;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Leading slot */
  .leading-slot {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--md-sys-color-on-surface-variant);
  }

  .leading-slot ::slotted(*) {
    width: var(--_icon-size);
    height: var(--_icon-size);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Input field */
  .input-wrapper {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
  }

  .input-field {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-family: var(--md-sys-typescale-body-large-font, 'Roboto', sans-serif);
    font-size: var(--_input-font-size);
    line-height: var(--_input-line-height);
    font-weight: var(--md-sys-typescale-body-large-weight, 400);
    color: var(--md-sys-color-on-surface);
    padding: 0;
    margin: 0;
  }

  .input-field::placeholder {
    color: var(--md-sys-color-on-surface-variant);
    opacity: 0.6;
  }

  .input-field:disabled {
    opacity: 0.38;
    cursor: not-allowed;
  }

  /* Trailing slot */
  .trailing-slot {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--md-sys-color-on-surface-variant);
  }

  .trailing-slot ::slotted(*) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Hover state overlay */
  .search-bar::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: var(--md-sys-color-on-surface);
    opacity: 0;
    transition: opacity 0.2s cubic-bezier(0.2, 0, 0, 1);
    pointer-events: none;
  }

  .search-bar:hover:not([disabled]):not(:focus-within)::before {
    opacity: 0.04;
  }

  /* Pressed state overlay */
  .search-bar::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: var(--md-sys-color-on-surface);
    opacity: 0;
    transition: opacity 0.2s cubic-bezier(0.2, 0, 0, 1);
    pointer-events: none;
  }

  .search-bar:active:not([disabled]):not(:focus-within)::after {
    opacity: 0.08;
  }

  /* Focus visible outline */
  .search-bar:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }
`;

