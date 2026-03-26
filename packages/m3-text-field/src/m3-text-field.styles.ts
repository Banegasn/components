import { css } from 'lit';

export const m3TextFieldStyles = css`
  :host {
    display: inline-flex;
    flex-direction: column;
    min-width: 240px;
    height: 56px;
    position: relative;
    border-radius: 4px 4px 0 0;
    font-family: inherit;
    --_state-layer-opacity: 0;
  }

  .field-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    background-color: var(--md-sys-color-surface-container-highest, #e6e0e9);
    border-radius: inherit;
    transition: background-color 0.2s, box-shadow 0.2s;
    cursor: text;
    overflow: hidden;
  }

  /* Hover state using opacity on state-layer */
  :host(:hover:not([disabled])) {
    --_state-layer-opacity: 0.08;
  }

  .state-layer {
    position: absolute;
    inset: 0;
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: var(--_state-layer-opacity);
    transition: opacity 0.2s;
    pointer-events: none;
    z-index: 0;
  }

  /* Focus indicator */
  .indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background-color: var(--md-sys-color-on-surface-variant, #49454f);
    transition: height 0.2s, background-color 0.2s;
    z-index: 3;
  }

  .field-container[focused] .indicator {
    height: 2px;
    background-color: var(--md-sys-color-primary, #6750a4);
  }

  /* Label styles */
  .label-wrapper {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    transform-origin: top left;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s, top 0.2s;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    font-size: 1rem;
    line-height: normal;
    z-index: 2;
  }

  .field-container[focused] .label-wrapper,
  .field-container[has-value] .label-wrapper {
    top: 10px;
    transform: scale(0.75) translateY(0);
  }

  .field-container[focused] .label-wrapper {
    color: var(--md-sys-color-primary, #6750a4);
  }

  /* Input styles */
  .input {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 24px 16px 8px 16px;
    border: none;
    outline: none;
    background: transparent;
    color: var(--md-sys-color-on-surface, #1d1b20);
    font-size: 1rem;
    font-family: inherit;
    position: relative;
    z-index: 1;
    caret-color: var(--md-sys-color-primary, #6750a4);
  }

  /* Handle Autofill styles */
  .input:-webkit-autofill,
  .input:-webkit-autofill:hover,
  .input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px var(--md-sys-color-surface-container-highest, #e6e0e9) inset !important;
    -webkit-text-fill-color: var(--md-sys-color-on-surface, #1d1b20) !important;
    transition: background-color 5000s ease-in-out 0s;
  }

  /* Placeholder */
  .input::placeholder {
    color: transparent;
  }

  .field-container[focused] .input::placeholder {
    color: var(--md-sys-color-on-surface-variant, #49454f);
    opacity: 0.5;
  }

  /* Disabled State */
  :host([disabled]) {
    cursor: default;
    pointer-events: none;
  }

  :host([disabled]) .field-container {
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.04;
  }

  /* Ensure label remains visible but faded in disabled state */
  :host([disabled]) .label-wrapper {
    opacity: 1 !important;
    color: var(--md-sys-color-on-surface, #1d1b20);
    filter: opacity(0.38); /* Use filter to apply opacity relative to parent's 4% */
  }

  /* Correction for disabled label invisibility: 
     Apply 38% opacity directly to the elements, and 4% to container */
  :host([disabled]) .input,
  :host([disabled]) .indicator {
    opacity: 0.38;
    color: var(--md-sys-color-on-surface, #1d1b20);
  }

  /* Re-fix: if container is 0.04, children are effectively invisible.
     Let's use a different approach for disabled: fixed light/dark color with no container opacity */
  :host([disabled]) .field-container {
    background-color: rgba(var(--md-sys-color-on-surface-rgb, 29, 27, 32), 0.04);
    opacity: 1;
  }
  
  /* Fallback if rgb variable not present */
  @supports not (color: rgba(var(--foo), 0.1)) {
    :host([disabled]) .field-container {
      background-color: #f5f5f5; /* Light fallback */
    }
  }

  :host([disabled]) .label-wrapper,
  :host([disabled]) .input {
    color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.38;
  }
`;
