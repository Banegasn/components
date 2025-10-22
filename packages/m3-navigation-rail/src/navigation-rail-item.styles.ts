import { css } from 'lit';

export const navigationRailItemStyles = css`
  :host {
    display: block;
    width: 100%;
  }

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 4px 0;
    cursor: pointer;
    border: none;
    background: transparent;
    width: 100%;
    position: relative;
    min-height: 56px;
  }

  .indicator {
    position: absolute;
    width: 80%;
    height: 80%;
    border-radius: 16px;
    background-color: transparent;
    transition: background-color 0.2s;
    top: 50%;
    transform: translateY(-50%);
    z-index: 0;
  }

  .item:hover .indicator {
    background-color: var(--md-sys-color-surface-variant, #e7e0ec);
  }

  .item.active .indicator {
    background-color: var(--md-sys-color-secondary-container, #e8def8);
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    transition: color 0.2s;
  }

  .item.active .icon {
    color: var(--md-sys-color-on-secondary-container, #1d192b);
  }

  .label {
    font-family: Roboto, system-ui, sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    z-index: 1;
    line-height: 16px;
    text-align: center;
    max-width: 64px;
    transition: color 0.2s;
  }

  .item.active .label {
    color: var(--md-sys-color-on-surface, #1d1b20);
  }

  .badge {
    position: absolute;
    top: 8px;
    right: 12px;
    background-color: var(--md-sys-color-error, #ba1a1a);
    color: var(--md-sys-color-on-error, #ffffff);
    border-radius: 8px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    font-size: 11px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

  .badge:empty {
    min-width: 6px;
    height: 6px;
    padding: 0;
    border-radius: 3px;
    top: 12px;
    right: 16px;
  }
`;

