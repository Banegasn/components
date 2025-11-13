import { css } from 'lit';

export const m3RadioButtonStyles = css`
  :host {
    display: inline-block;
    --_radio-size: var(--md-radio-size, 16px);
    --_radio-ripple-size: var(--md-radio-ripple-size, 40px);
    --_radio-outer-size: var(--md-radio-outer-size, 16px);
    --_radio-inner-size: var(--md-radio-inner-size, 8px);
  }

  /* Size variants */
  :host([size="small"]),
  :host(:not([size])) {
    --_radio-outer-size: var(--md-radio-outer-size, 16px);
    --_radio-inner-size: var(--md-radio-inner-size, 8px);
    --_radio-ripple-size: var(--md-radio-ripple-size, 40px);
  }

  :host([size="medium"]) {
    --_radio-outer-size: var(--md-radio-outer-size, 20px);
    --_radio-inner-size: var(--md-radio-inner-size, 10px);
    --_radio-ripple-size: var(--md-radio-ripple-size, 48px);
  }

  :host([size="large"]) {
    --_radio-outer-size: var(--md-radio-outer-size, 24px);
    --_radio-inner-size: var(--md-radio-inner-size, 12px);
    --_radio-ripple-size: var(--md-radio-ripple-size, 56px);
  }

  .radio-container {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    width: var(--_radio-ripple-size);
    height: var(--_radio-ripple-size);
  }

  .radio-container:focus-visible {
    outline: 2px solid var(--md-sys-color-primary, #6750a4);
    outline-offset: 2px;
    border-radius: 50%;
  }

  .radio-container[aria-disabled="true"] {
    cursor: not-allowed;
    pointer-events: none;
  }

  input[type="radio"] {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    width: 0;
    height: 0;
    margin: 0;
    padding: 0;
  }

  .radio-outer {
    position: relative;
    width: var(--_radio-outer-size);
    height: var(--_radio-outer-size);
    border-radius: 50%;
    border: 2px solid var(--md-sys-color-on-surface, #1d1b20);
    background-color: transparent;
    transition: border-color 0.2s cubic-bezier(0.2, 0, 0, 1),
                background-color 0.2s cubic-bezier(0.2, 0, 0, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .radio-outer[checked] {
    border-color: var(--md-sys-color-primary, #6750a4);
  }

  .radio-outer[disabled] {
    border-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.38;
  }

  .radio-outer[checked][disabled] {
    border-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.38;
  }

  .radio-outer[pressed] {
    transform: scale(0.95);
  }

  /* Hover state */
  .radio-container:hover .radio-outer:not([disabled]) {
    border-color: var(--md-sys-color-primary, #6750a4);
  }

  .radio-container:hover .radio-outer[checked]:not([disabled]) {
    border-color: var(--md-sys-color-primary, #6750a4);
  }

  /* Pressed state overlay */
  .radio-outer::before {
    content: '';
    position: absolute;
    inset: -12px;
    border-radius: 50%;
    background-color: var(--md-sys-color-primary, #6750a4);
    opacity: 0;
    transition: opacity 0.2s cubic-bezier(0.2, 0, 0, 1);
    pointer-events: none;
  }

  /* Hover state overlay - lighter than pressed */
  .radio-container:hover .radio-outer:not([disabled])::before {
    opacity: 0.08;
  }

  .radio-container:active .radio-outer:not([disabled])::before {
    opacity: 0.12;
  }

  .radio-inner {
    width: var(--_radio-inner-size);
    height: var(--_radio-inner-size);
    border-radius: 50%;
    background-color: var(--md-sys-color-primary, #6750a4);
    transform: scale(0);
    transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
  }

  .radio-outer[checked] .radio-inner {
    transform: scale(1);
  }

  .radio-outer[disabled] .radio-inner {
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.38;
  }

  /* Ripple effect */
  .ripple {
    position: absolute;
    top: 50%;
    left: 50%;
    width: var(--_radio-ripple-size);
    height: var(--_radio-ripple-size);
    margin-top: calc(var(--_radio-ripple-size) / -2);
    margin-left: calc(var(--_radio-ripple-size) / -2);
    border-radius: 50%;
    background-color: var(--md-sys-color-primary, #6750a4);
    opacity: 0.3;
    transform: scale(0);
    animation: ripple-animation 0.6s cubic-bezier(0.2, 0, 0, 1);
    pointer-events: none;
    z-index: 0;
  }

  @keyframes ripple-animation {
    0% {
      transform: scale(0);
      opacity: 0.3;
    }
    50% {
      opacity: 0.2;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }

  /* Touch target enhancement */
  .radio-container::after {
    content: '';
    position: absolute;
    inset: -8px;
    border-radius: 50%;
  }
`;

