import { css } from 'lit';

export const m3IconButtonStyles = css`
  :host {
    display: inline-flex;
    --_size: 40px;
    --_icon-size: 24px;
    --_shape: 999px;
    --_animation-duration: 0.2s;
    --_animation-easing: cubic-bezier(0.2, 0, 0, 1);
  }

  .icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--_size);
    height: var(--_size);
    border-radius: var(--_shape);
    border: none;
    background: transparent;
    cursor: pointer;
    outline: none;
    position: relative;
    overflow: hidden;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    transition: transform var(--_animation-duration) var(--_animation-easing),
                background-color var(--_animation-duration) var(--_animation-easing),
                color var(--_animation-duration) var(--_animation-easing);
    padding: 0;
    font-family: inherit;
  }

  .icon-button::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: currentColor;
    opacity: 0;
    transition: opacity var(--_animation-duration) var(--_animation-easing);
    z-index: 0;
  }

  .icon-button:hover::before {
    opacity: 0.08;
  }

  .icon-button:active::before {
    opacity: 0.12;
    transform: scale(0.92);
  }

  .icon-button:focus-visible::before {
    opacity: 0.12;
  }

  .icon-button:focus-visible {
    outline: 2px solid var(--md-sys-color-primary, #6750a4);
    outline-offset: 2px;
  }

  /* Press/scale animation */
  .icon-button:active {
    transform: scale(0.92);
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--_icon-size);
    height: var(--_icon-size);
    position: relative;
    z-index: 1;
    transition: transform var(--_animation-duration) var(--_animation-easing);
  }

  .icon-button:active .icon {
    transform: scale(0.9);
  }

  /* Standard variant (default) */
  :host([variant="standard"]) .icon-button {
    color: var(--md-sys-color-on-surface-variant, #49454f);
  }

  /* Filled variant */
  :host([variant="filled"]) .icon-button {
    background-color: var(--md-sys-color-primary, #6750a4);
    color: var(--md-sys-color-on-primary, #ffffff);
  }

  :host([variant="filled"]) .icon-button:hover::before {
    opacity: 0.08;
  }

  :host([variant="filled"]) .icon-button:active::before {
    opacity: 0.12;
  }

  /* Tonal variant */
  :host([variant="tonal"]) .icon-button {
    background-color: var(--md-sys-color-secondary-container, #e8def8);
    color: var(--md-sys-color-on-secondary-container, #1d192b);
  }

  :host([variant="tonal"]) .icon-button:hover::before {
    opacity: 0.08;
  }

  :host([variant="tonal"]) .icon-button:active::before {
    opacity: 0.12;
  }

  /* Outlined variant */
  :host([variant="outlined"]) .icon-button {
    border: 1px solid var(--md-sys-color-outline, #79747e);
    color: var(--md-sys-color-on-surface-variant, #49454f);
  }

  :host([variant="outlined"]) .icon-button:hover::before {
    opacity: 0.08;
  }

  /* Disabled state */
  :host([disabled]) .icon-button {
    opacity: 0.38;
    cursor: not-allowed;
    pointer-events: none;
    transform: none;
  }

  /* Selected/toggle state */
  :host([selected]) .icon-button {
    background-color: var(--md-sys-color-primary, #6750a4);
    color: var(--md-sys-color-on-primary, #ffffff);
  }

  :host([variant="outlined"][selected]) .icon-button {
    border-color: transparent;
  }

  /* Size variants */
  :host([size="small"]) {
    --_size: 32px;
    --_icon-size: 18px;
  }

  :host([size="large"]) {
    --_size: 48px;
    --_icon-size: 24px;
  }

  /* Toggle transition for selected state */
  :host([toggle]) .icon-button {
    transition: transform 0.15s cubic-bezier(0.2, 0, 0, 1),
                background-color 0.3s cubic-bezier(0.2, 0, 0, 1),
                color 0.3s cubic-bezier(0.2, 0, 0, 1);
  }
`;
