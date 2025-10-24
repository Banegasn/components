import { css } from 'lit';

export const m3ButtonStyles = css`
  :host {
    display: inline-block;
    --_container-height: var(--md-button-container-height, 40px);
    --_container-shape: var(--md-button-container-shape, 20px);
    --_label-text-size: var(--md-button-label-text-size, 14px);
    --_label-text-weight: var(--md-button-label-text-weight, 500);
    --_icon-size: var(--md-button-icon-size, 18px);
    --_spacing: var(--md-button-spacing, 24px);
  }

  /* Size variants - Material Design 3 Expressive */
  :host([size="extra-small"]) {
    --_container-height: var(--md-button-container-height, 32px);
    --_container-shape: var(--md-button-container-shape, 16px);
    --_label-text-size: var(--md-button-label-text-size, 12px);
    --_icon-size: var(--md-button-icon-size, 16px);
  }

  :host([size="small"]),
  :host(:not([size])) {
    --_container-height: var(--md-button-container-height, 40px);
    --_container-shape: var(--md-button-container-shape, 20px);
    --_label-text-size: var(--md-button-label-text-size, 14px);
    --_icon-size: var(--md-button-icon-size, 18px);
  }

  :host([size="medium"]) {
    --_container-height: var(--md-button-container-height, 48px);
    --_container-shape: var(--md-button-container-shape, 24px);
    --_label-text-size: var(--md-button-label-text-size, 16px);
    --_icon-size: var(--md-button-icon-size, 20px);
  }

  :host([size="large"]) {
    --_container-height: var(--md-button-container-height, 56px);
    --_container-shape: var(--md-button-container-shape, 28px);
    --_label-text-size: var(--md-button-label-text-size, 18px);
    --_icon-size: var(--md-button-icon-size, 24px);
  }

  :host([size="extra-large"]) {
    --_container-height: var(--md-button-container-height, 64px);
    --_container-shape: var(--md-button-container-shape, 32px);
    --_label-text-size: var(--md-button-label-text-size, 20px);
    --_icon-size: var(--md-button-icon-size, 28px);
  }

  /* Shape variants */
  :host([shape="square"]) {
    --_container-shape: var(--md-button-container-shape, 8px);
  }

  :host([shape="square"][size="extra-small"]) {
    --_container-shape: var(--md-button-container-shape, 4px);
  }

  :host([shape="square"][size="small"]),
  :host([shape="square"]:not([size])) {
    --_container-shape: var(--md-button-container-shape, 8px);
  }

  :host([shape="square"][size="medium"]) {
    --_container-shape: var(--md-button-container-shape, 10px);
  }

  :host([shape="square"][size="large"]) {
    --_container-shape: var(--md-button-container-shape, 12px);
  }

  :host([shape="square"][size="extra-large"]) {
    --_container-shape: var(--md-button-container-shape, 14px);
  }

  /* Padding variants */
  :host([padding="small"]) {
    --_spacing: var(--md-button-spacing, 16px);
  }

  :host([padding="default"]),
  :host(:not([padding])) {
    --_spacing: var(--md-button-spacing, 24px);
  }

  :host([disabled]) {
    pointer-events: none;
    opacity: 0.38;
  }

  button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: var(--_container-height);
    padding: 0 var(--_spacing);
    border: none;
    border-radius: var(--_container-shape);
    font-family: Roboto, system-ui, sans-serif;
    font-size: var(--_label-text-size);
    font-weight: var(--_label-text-weight);
    line-height: 20px;
    letter-spacing: 0.1px;
    cursor: pointer;
    outline: none;
    transition: background-color 0.2s, box-shadow 0.2s, transform 0.1s, border-radius 0.2s;
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-tap-highlight-color: transparent;
  }

  button:focus-visible {
    outline: 2px solid var(--md-sys-color-primary, #6750a4);
    outline-offset: 2px;
  }

  button:active {
    transform: scale(0.98);
  }

  /* Shape morphing on press - round shapes become less round */
  :host([shape="round"]) button:active,
  :host(:not([shape])) button:active {
    border-radius: calc(var(--_container-shape) * 0.6);
  }

  /* Shape morphing on press - square shapes become slightly more round */
  :host([shape="square"]) button:active {
    border-radius: calc(var(--_container-shape) * 1.5);
  }

  /* Filled Button (default) */
  :host([variant="filled"]) button,
  :host(:not([variant])) button {
    background-color: var(--md-sys-color-primary, #6750a4);
    color: var(--md-sys-color-on-primary, #ffffff);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15);
  }

  :host([variant="filled"]) button:hover,
  :host(:not([variant])) button:hover {
    background-color: var(--md-sys-color-primary-hover, #7965af);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3), 0 2px 6px 2px rgba(0, 0, 0, 0.15);
  }

  :host([variant="filled"]) button::before,
  :host(:not([variant])) button::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: var(--md-sys-color-on-primary, #ffffff);
    opacity: 0;
    transition: opacity 0.2s;
  }

  :host([variant="filled"]) button:hover::before,
  :host(:not([variant])) button:hover::before {
    opacity: 0.08;
  }

  :host([variant="filled"]) button:active::before,
  :host(:not([variant])) button:active::before {
    opacity: 0.12;
  }

  /* Elevated Button */
  :host([variant="elevated"]) button {
    background-color: var(--md-sys-color-surface-container-low, #f7f2fa);
    color: var(--md-sys-color-primary, #6750a4);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15);
  }

  :host([variant="elevated"]) button:hover {
    background-color: var(--md-sys-color-surface-container-low, #f7f2fa);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3), 0 2px 6px 2px rgba(0, 0, 0, 0.15);
  }

  :host([variant="elevated"]) button::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: var(--md-sys-color-primary, #6750a4);
    opacity: 0;
    transition: opacity 0.2s;
  }

  :host([variant="elevated"]) button:hover::before {
    opacity: 0.08;
  }

  :host([variant="elevated"]) button:active::before {
    opacity: 0.12;
  }

  /* Tonal Button */
  :host([variant="tonal"]) button {
    background-color: var(--md-sys-color-secondary-container, #e8def8);
    color: var(--md-sys-color-on-secondary-container, #1d192b);
    box-shadow: none;
  }

  :host([variant="tonal"]) button::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: var(--md-sys-color-on-secondary-container, #1d192b);
    opacity: 0;
    transition: opacity 0.2s;
  }

  :host([variant="tonal"]) button:hover::before {
    opacity: 0.08;
  }

  :host([variant="tonal"]) button:active::before {
    opacity: 0.12;
  }

  /* Outlined Button */
  :host([variant="outlined"]) button {
    background-color: transparent;
    color: var(--md-sys-color-primary, #6750a4);
    border: 1px solid var(--md-sys-color-outline, #79747e);
    box-shadow: none;
  }

  :host([variant="outlined"]) button::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: var(--md-sys-color-primary, #6750a4);
    opacity: 0;
    transition: opacity 0.2s;
  }

  :host([variant="outlined"]) button:hover::before {
    opacity: 0.08;
  }

  :host([variant="outlined"]) button:active::before {
    opacity: 0.12;
  }

  :host([variant="outlined"][disabled]) button {
    border-color: var(--md-sys-color-on-surface, #1d1b20);
  }

  /* Text Button */
  :host([variant="text"]) button {
    background-color: transparent;
    color: var(--md-sys-color-primary, #6750a4);
    box-shadow: none;
    padding: 0 12px;
  }

  :host([variant="text"]) button::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: var(--md-sys-color-primary, #6750a4);
    opacity: 0;
    transition: opacity 0.2s;
  }

  :host([variant="text"]) button:hover::before {
    opacity: 0.08;
  }

  :host([variant="text"]) button:active::before {
    opacity: 0.12;
  }

  /* Icon styling */
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--_icon-size);
    height: var(--_icon-size);
    position: relative;
    z-index: 1;
  }

  ::slotted([slot="icon"]) {
    width: 100%;
    height: 100%;
  }

  /* Label styling */
  .label {
    position: relative;
    z-index: 1;
  }

  /* Icon-only button */
  :host([icon-only]) button {
    padding: 0;
    width: var(--_container-height);
    min-width: var(--_container-height);
  }

  /* Full width */
  :host([full-width]) {
    display: block;
    width: 100%;
  }

  :host([full-width]) button {
    width: 100%;
  }

  /* Loading state */
  :host([loading]) button {
    pointer-events: none;
    position: relative;
  }

  :host([loading]) .label,
  :host([loading]) .icon {
    opacity: 0;
  }

  .loading-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 18px;
    height: 18px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    z-index: 2;
  }

  @keyframes spin {
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  /* Touch target */
  button::after {
    content: '';
    position: absolute;
    inset: -8px;
    border-radius: inherit;
  }
`;

