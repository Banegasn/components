import { css } from 'lit';

export const m3ChipStyles = css`
  :host {
    display: inline-flex;
    --_height: 32px;
    --_shape: 8px;
    vertical-align: middle;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: var(--_height);
    padding: 0 16px;
    border-radius: var(--_shape);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
    cursor: pointer;
    outline: none;
    border: none;
    background: transparent;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    transition: background-color 0.2s, box-shadow 0.2s, border-color 0.2s, color 0.2s;
    font-family: inherit;
    position: relative;
    overflow: hidden;
  }

  /* Assist chip */
  :host([variant="assist"]) .chip {
    border: 1px solid var(--md-sys-color-outline, #79747e);
    color: var(--md-sys-color-on-surface, #1d1b20);
  }

  /* Filter chip */
  :host([variant="filter"]) .chip {
    border: 1px solid var(--md-sys-color-outline, #79747e);
    color: var(--md-sys-color-on-surface-variant, #49454f);
  }

  :host([variant="filter"][selected]) .chip {
    border-color: transparent;
    background-color: var(--md-sys-color-secondary-container, #e8def8);
    color: var(--md-sys-color-on-secondary-container, #1d192b);
  }

  /* Input chip */
  :host([variant="input"]) .chip {
    border: 1px solid var(--md-sys-color-outline, #79747e);
    color: var(--md-sys-color-on-surface-variant, #49454f);
  }

  /* Suggestion chip */
  :host([variant="suggestion"]) .chip {
    border: 1px solid var(--md-sys-color-outline, #79747e);
    color: var(--md-sys-color-on-surface-variant, #49454f);
  }

  /* Elevated modifier */
  :host([elevated]) .chip {
    border-color: transparent;
    background-color: var(--md-sys-color-surface-container-low, #f7f2fa);
    box-shadow: 0 1px 2px rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15);
  }

  .label {
    position: relative;
    z-index: 2;
  }

  /* State Layer */
  .state-layer {
    position: absolute;
    inset: 0;
    background-color: currentColor;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
    z-index: 1;
  }

  .chip:hover .state-layer {
    opacity: 0.08;
  }

  .chip:active .state-layer {
    opacity: 0.12;
  }

  .chip:focus-visible .state-layer {
    opacity: 0.12;
  }

  /* Disabled */
  :host([disabled]) .chip {
    opacity: 0.38;
    cursor: not-allowed;
    pointer-events: none;
  }

  .leading-icon, .trailing-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    position: relative;
    z-index: 2;
  }

  .leading-icon {
    margin-left: -4px;
  }

  .trailing-icon {
    margin-right: -4px;
  }

  .checkmark {
    color: inherit;
  }
`;
