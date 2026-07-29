import { css } from 'lit';

export const m3TextFieldStyles = css`
  :host {
    display: inline-flex;
    flex-direction: column;
    min-width: 240px;
    position: relative;
    border-radius: 4px 4px 0 0;
    font-family: inherit;
    --_state-layer-opacity: 0;
  }

  .field-container {
    position: relative;
    width: 100%;
    min-height: 56px;
    display: flex;
    align-items: stretch;
    background-color: var(--md-sys-color-surface-container-highest, #e6e0e9);
    border-radius: inherit;
    box-sizing: border-box;
    cursor: text;
    overflow: hidden;
  }

  .field-container.outlined {
    background-color: transparent;
    border: 1px solid var(--md-sys-color-outline, #79747e);
    border-radius: 4px;
  }

  :host(:hover:not([disabled])) {
    --_state-layer-opacity: 0.08;
  }

  .state-layer {
    position: absolute;
    inset: 0;
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: var(--_state-layer-opacity);
    pointer-events: none;
  }

  .input-area {
    position: relative;
    flex: 1;
    min-width: 0;
  }

  .leading-icon,
  .trailing-icon {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .leading-icon {
    padding-left: 12px;
  }
  .trailing-icon {
    padding-right: 12px;
  }
  .field-container:not([has-leading-icon]) .leading-icon,
  .field-container:not([has-trailing-icon]) .trailing-icon {
    display: none;
  }

  ::slotted([slot='leading-icon']),
  ::slotted([slot='trailing-icon']) {
    color: var(--md-sys-color-on-surface-variant, #49454f);
    display: block;
    max-width: 24px;
    max-height: 24px;
  }

  .label {
    position: absolute;
    left: 16px;
    top: 50%;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    font-size: 1rem;
    line-height: normal;
    pointer-events: auto;
    transform: translateY(-50%);
    transform-origin: top left;
    transition:
      transform var(--md-sys-motion-duration-short4),
      color var(--md-sys-motion-duration-short4),
      top var(--md-sys-motion-duration-short4);
    z-index: 1;
  }

  .field-container[focused] .label,
  .field-container[has-value] .label {
    top: 10px;
    transform: scale(0.75) translateY(0);
  }

  .field-container[focused] .label {
    color: var(--md-sys-color-primary, #6750a4);
  }

  .input {
    width: 100%;
    height: 56px;
    box-sizing: border-box;
    padding: 24px 16px 8px;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--md-sys-color-on-surface, #1d1b20);
    font: inherit;
    caret-color: var(--md-sys-color-primary, #6750a4);
  }

  .input::placeholder {
    color: transparent;
  }
  .field-container[focused] .input::placeholder {
    color: var(--md-sys-color-on-surface-variant, #49454f);
    opacity: 0.5;
  }

  .indicator {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    background-color: var(--md-sys-color-on-surface-variant, #49454f);
  }

  .field-container[focused] .indicator {
    height: 2px;
    background-color: var(--md-sys-color-primary, #6750a4);
  }

  .outlined .indicator {
    display: none;
  }
  .outlined[focused] {
    border: 2px solid var(--md-sys-color-primary, #6750a4);
  }

  .field-container[invalid] .indicator {
    background-color: var(--md-sys-color-error, #ba1a1a);
  }
  .field-container[invalid] .label {
    color: var(--md-sys-color-error, #ba1a1a);
  }
  .outlined[invalid] {
    border-color: var(--md-sys-color-error, #ba1a1a);
  }

  .supporting-row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    min-height: 20px;
    padding: 4px 16px 0;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    font-size: 0.75rem;
    line-height: 1rem;
  }

  .supporting-text {
    flex: 1;
  }
  .counter {
    white-space: nowrap;
  }
  .supporting-row[error] {
    color: var(--md-sys-color-error, #ba1a1a);
  }

  :host([disabled]) {
    cursor: default;
  }
  :host([disabled]) .field-container {
    background-color: rgba(
      var(--md-sys-color-on-surface-rgb, 29, 27, 32),
      0.04
    );
  }
  :host([disabled]) .label,
  :host([disabled]) .input,
  :host([disabled]) ::slotted(*) {
    color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.38;
  }
`;
