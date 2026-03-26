import { css } from 'lit';

export const m3CheckboxStyles = css`
  :host {
    display: inline-flex;
    vertical-align: middle;
    --_size: 18px;
    --_touch-size: 40px;
  }

  .checkbox-container {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--_touch-size);
    height: var(--_touch-size);
    border-radius: 50%;
    cursor: pointer;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  .checkbox-container[aria-disabled="true"] {
    cursor: not-allowed;
    pointer-events: none;
  }

  .checkbox-container:focus-visible .state-layer {
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.12;
  }
  
  .checkbox-container:focus-visible[aria-checked="true"] .state-layer,
  .checkbox-container:focus-visible[aria-checked="mixed"] .state-layer {
    background-color: var(--md-sys-color-primary, #6750a4);
    opacity: 0.12;
  }

  .state-layer {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background-color: transparent;
    opacity: 0;
    transition: background-color 0.2s, opacity 0.2s;
  }

  .checkbox-container:hover .state-layer {
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.08;
  }
  
  .checkbox-container:hover[aria-checked="true"] .state-layer,
  .checkbox-container:hover[aria-checked="mixed"] .state-layer {
    background-color: var(--md-sys-color-primary, #6750a4);
    opacity: 0.08;
  }

  .checkbox-container:active .state-layer {
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.12;
  }

  .checkbox-container:active[aria-checked="true"] .state-layer,
  .checkbox-container:active[aria-checked="mixed"] .state-layer {
    background-color: var(--md-sys-color-primary, #6750a4);
    opacity: 0.12;
  }

  .outline {
    position: relative;
    width: var(--_size);
    height: var(--_size);
    border-radius: 2px;
    box-sizing: border-box;
    border: 2px solid var(--md-sys-color-on-surface-variant, #49454f);
    transition: border-color 0.2s, background-color 0.2s;
  }

  .outline[checked],
  .outline[indeterminate] {
    border-color: var(--md-sys-color-primary, #6750a4);
    background-color: var(--md-sys-color-primary, #6750a4);
  }

  .outline[disabled] {
    border-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.38;
  }
  
  .outline[disabled][checked],
  .outline[disabled][indeterminate] {
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    border-color: transparent;
    opacity: 0.38;
  }

  .background {
    position: absolute;
    inset: -2px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--md-sys-color-on-primary, #ffffff);
    opacity: 0;
    transform: scale(0);
    transition: opacity 0.2s, transform 0.2s;
  }

  .background[checked],
  .background[indeterminate] {
    opacity: 1;
    transform: scale(1);
  }

  .background[disabled] {
    color: var(--md-sys-color-surface, #fff);
  }

  .icon {
    width: 100%;
    height: 100%;
  }

  input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    width: 0;
    height: 0;
    margin: 0;
  }
`;
