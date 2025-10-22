import { css } from 'lit';

export const navigationRailToggleStyles = css`
  .toggle-button {
    width: 56px;
    height: 56px;
    border-radius: 28px;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s, margin 0.3s;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    place-self: flex-start;
    margin: 0;
  }

  .toggle-button:hover {
    background-color: var(--md-sys-color-surface-variant, #e7e0ec);
  }

  .toggle-button:active {
    background-color: var(--md-sys-color-secondary-container, #e8def8);
  }

  .icon {
    width: 24px;
    height: 24px;
  }

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`;

