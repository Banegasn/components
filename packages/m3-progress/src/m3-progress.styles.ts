import { css } from 'lit';

export const m3ProgressStyles = css`
  :host {
    display: block;
    width: 100%;
    height: 4px;
    position: relative;
    overflow: hidden;
    border-radius: 2px;
  }

  .track {
    position: absolute;
    inset: 0;
    background-color: var(--md-sys-color-surface-container-highest, #e6e0e9);
    border-radius: inherit;
  }

  .indicator {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: var(--md-sys-color-primary, #6750a4);
    border-radius: inherit;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Indeterminate animation */
  :host([indeterminate]) .indicator {
    width: 50% !important;
    animation: indeterminate 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  @keyframes indeterminate {
    0% {
      left: -50%;
    }
    100% {
      left: 100%;
    }
  }

  /* Disabled */
  :host([disabled]) .track {
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.12;
  }

  :host([disabled]) .indicator {
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.38;
  }
`;
