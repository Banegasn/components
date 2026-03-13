import { css } from 'lit';

export const m3MenuStyles = css`
  :host {
    position: absolute;
    top: calc(var(--md-menu-anchor-height, 40px) + 8px);
    inset-inline-end: 0;
    z-index: 1000;
    display: block;
  }

  :host([placement="bottom-start"]) {
    inset-inline-start: 0;
    inset-inline-end: auto;
  }

  .surface {
    min-inline-size: var(--md-menu-min-width, 180px);
    max-inline-size: min(280px, calc(100vw - 32px));
    padding: 8px;
    border-radius: 16px;
    background: var(--md-sys-color-surface-container, #f3edf7);
    color: var(--md-sys-color-on-surface, #1d1b20);
    border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    box-shadow:
      0px 1px 2px rgba(0, 0, 0, 0.3),
      0px 2px 6px 2px rgba(0, 0, 0, 0.15);
  }

  .surface[hidden] {
    display: none;
  }

  ::slotted(m3-menu-item) {
    display: block;
  }
`;
