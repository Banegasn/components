import { css } from 'lit';

export const m3BadgeStyles = css`
  :host {
    display: inline-flex;
    position: relative;
  }

  .badge {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 6px;
    height: 6px;
    border-radius: 100px;
    background-color: var(--md-sys-color-error, #b3261e);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
    transform: scale(1);
  }

  .badge[has-label] {
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    top: -8px;
    right: -8px;
    font-size: 0.6875rem;
    font-weight: 500;
    line-height: 1;
    color: var(--md-sys-color-on-error, #ffffff);
  }

  .badge[hidden-badge] {
    transform: scale(0);
  }

  /* Large badge */
  :host([size="large"]) .badge {
    min-width: 10px;
    height: 10px;
    top: -6px;
    right: -6px;
  }

  :host([size="large"]) .badge[has-label] {
    min-width: 22px;
    height: 22px;
    padding: 0 5px;
    top: -10px;
    right: -10px;
    font-size: 0.75rem;
  }
`;
