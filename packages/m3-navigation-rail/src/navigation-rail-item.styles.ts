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
    position: relative;
    cursor: pointer;
    border: none;
    background: transparent;
    width: 100%;
    border-radius: 16px;
    padding: 0;
    z-index: 2;
    min-height: 48px;
  }

  [slot="icon"] {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :host([expanded]) .item {
    flex-direction: row;
    justify-content: flex-start;
    gap: 8px;
    padding: 0 12px;
  }

  .indicator {
    position: absolute;
    top: 0;
    width: 80%;
    height: calc(100% - 20px);
    border-radius: 16px;
    z-index: -1;
    transition: transform 0.2s, background-color 0.2s ease-in-out, padding 0.3s;
  }

  :host([expanded]) .indicator {
    width: 100%;
    height: auto;
    left: 0;
    top: 0;
    bottom: 0;
  }

  .item:active .icon {
    transform: scale(0.95);
  }

  .item.active .indicator {
    background-color: var(--md-sys-color-secondary-container, #6750a4);
  }

  .item:hover .indicator {  
    background-color: var(--md-sys-color-surface-variant, #e7e0ec);
    transform: scale(1.01);
  }

  .icon {
    position: relative;
    padding: 4px 12px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    transition: color 0.2s, transform 0.1s;
  }

  :host([expanded]) .icon {
    padding: 4px;
  }

  .item.active .icon {
    color: var(--md-sys-color-on-secondary-container, #1d192b);
  }

  .label {
    font-family: Roboto, system-ui, sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    line-height: 16px;
    text-align: center;
    max-width: 64px;
    z-index: 2;
    transition: color 0.2s;
  }

  :host([expanded]) .label {
    font-size: 14px;
    text-align: left;
    max-width: 180px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item.active .label {
    color: var(--md-sys-color-on-surface, #1d1b20);
  }

  .badge {
    position: absolute;
    top: 4px;
    right: 4px;
    background-color: var(--md-sys-color-error, #ba1a1a);
    color: var(--md-sys-color-on-error, #ffffff);
    border-radius: 8px;
    min-width: 16px;
    height: 16px;
    padding: 0;
    font-size: 11px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

  .badge-expanded {
    background-color: var(--md-sys-color-error, #ba1a1a);
    color: var(--md-sys-color-on-error, #ffffff);
    border-radius: 8px;
    min-width: 16px;
    min-height: 16px;
    font-size: 11px;
    line-height: 16px;
    z-index: 1;
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

