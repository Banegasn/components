import { css } from 'lit';

export const m3SwitchStyles = css`
  :host {
    display: inline-block;
    --_track-width: var(--md-switch-track-width, 52px);
    --_track-height: var(--md-switch-track-height, 32px);
    --_thumb-size: var(--md-switch-thumb-size, 24px);
    --_track-shape: var(--md-switch-track-shape, 16px);
    --_thumb-shape: var(--md-switch-thumb-shape, 12px);
  }

  .switch-container {
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }

  .switch-container:focus-visible {
    outline: 2px solid var(--md-sys-color-primary, #6750a4);
    outline-offset: 4px;
    border-radius: var(--_track-shape);
  }

  .switch-container[aria-disabled="true"] {
    cursor: not-allowed;
    pointer-events: none;
  }

  input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    width: 0;
    height: 0;
    margin: 0;
    padding: 0;
  }

  .track {
    position: relative;
    width: var(--_track-width);
    height: var(--_track-height);
    border-radius: var(--_track-shape);
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.38;
    transition: background-color 0.2s cubic-bezier(0.2, 0, 0, 1),
                opacity 0.2s cubic-bezier(0.2, 0, 0, 1);
    overflow: hidden;
  }

  .track[checked] {
    background-color: var(--md-sys-color-primary, #6750a4);
    opacity: 1;
  }

  .track[disabled] {
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.12;
  }

  .track[checked][disabled] {
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.12;
  }

  /* Hover state overlay */
  .track::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0;
    transition: opacity 0.2s cubic-bezier(0.2, 0, 0, 1);
    pointer-events: none;
  }

  .switch-container:hover .track:not([disabled])::before {
    opacity: 0.08;
  }

  .switch-container:hover .track[checked]:not([disabled])::before {
    background-color: var(--md-sys-color-on-primary, #ffffff);
    opacity: 0.08;
  }

  /* Pressed state overlay */
  .track::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0;
    transition: opacity 0.2s cubic-bezier(0.2, 0, 0, 1);
    pointer-events: none;
  }

  .switch-container:active .track:not([disabled])::after {
    opacity: 0.12;
  }

  .switch-container:active .track[checked]:not([disabled])::after {
    background-color: var(--md-sys-color-on-primary, #ffffff);
    opacity: 0.12;
  }

  .thumb {
    position: absolute;
    top: 4px;
    left: 4px;
    width: var(--_thumb-size);
    height: var(--_thumb-size);
    border-radius: var(--_thumb-shape);
    background-color: var(--md-sys-color-surface-container-highest, #e6e0e9);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1),
                background-color 0.2s cubic-bezier(0.2, 0, 0, 1),
                box-shadow 0.2s cubic-bezier(0.2, 0, 0, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .thumb[checked] {
    transform: translateX(calc(var(--_track-width) - var(--_thumb-size) - 8px));
    background-color: var(--md-sys-color-on-primary, #ffffff);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .thumb[disabled] {
    background-color: var(--md-sys-color-surface-container-highest, #e6e0e9);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .thumb[checked][disabled] {
    background-color: var(--md-sys-color-surface-container-highest, #e6e0e9);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .thumb[pressed] {
    transform: scale(0.95);
  }

  .thumb[checked][pressed] {
    transform: translateX(calc(var(--_track-width) - var(--_thumb-size) - 8px)) scale(0.95);
  }

  .checkmark {
    width: 16px;
    height: 16px;
    color: var(--md-sys-color-primary, #6750a4);
    opacity: 0;
    transform: scale(0);
    transition: opacity 0.2s cubic-bezier(0.2, 0, 0, 1),
                transform 0.2s cubic-bezier(0.2, 0, 0, 1);
  }

  .thumb[checked] .checkmark {
    opacity: 1;
    transform: scale(1);
  }

  .thumb[disabled] .checkmark {
    color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.38;
  }

  /* Touch target enhancement */
  .switch-container::after {
    content: '';
    position: absolute;
    inset: -8px;
    border-radius: var(--_track-shape);
  }

  /* Ripple effect on interaction */
  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 0.3;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }
`;

