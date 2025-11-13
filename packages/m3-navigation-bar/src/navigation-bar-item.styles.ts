import { css } from 'lit';

export const navigationBarItemStyles = css`

  /* Vertical layout (default) - items expand to fill space equally */
  :host([layout="vertical"]) {
    flex: 1 1 0%;
  }

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 4px;
    position: relative;
    cursor: pointer;
    border: none;
    background: transparent;
    width: 100%;
    min-height: 64px;
    padding: 6px 0;
    border-radius: 0;
    z-index: 1;
    box-sizing: border-box;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  /* Vertical layout - item content is centered, width fills container */
  :host([layout="vertical"]) .item {
    min-width: 0;
  }

  /* Horizontal layout - item has fixed width container */
  :host([layout="horizontal"]) .item {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4px;
    min-width: 96px;
    width: auto;
    padding-inline: 20px;
  }

  [slot="icon"] {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }

  .bubble {
    position: absolute;
    left: 50%;
    top: 6px;
    transform: translate(-50%);
    width: 64px;
    height: 32px;
    border-radius: 16px;
    z-index: 0;
    transition: background-color 0.2s ease, opacity 0.2s ease, transform 0.2s ease, border-radius 0.2s ease, box-shadow 0.2s ease;
    opacity: 0;
    pointer-events: none;
    box-shadow: 0 0 0 0 transparent;
  }

  :host .item:hover .bubble {
   transform: translate(-50%) scale(1.03);
  }

  :host .item:active .bubble {
    transform: translate(-50%) scale(1.08);
    border-radius: 8px;
  }


  :host([layout="horizontal"]) .bubble {
    width: auto;
    top: 50%;
    transform: translate(0, -50%);
    border-radius: 20px;
    height: 40px;
    left: 0;
    right: 0;
  }

  :host([layout="horizontal"]) .item:hover .bubble {
    transform: translate(0, -50%) scale(1.03);
  }
  :host([layout="horizontal"]) .item:active .bubble {
    transform: translate(0, -50%) scale(1.08);
    border-radius: 16px;
  }

  .item.active .indicator {
    background-color: var(--md-sys-color-secondary-container, #e8def8);
    opacity: 1;
  }

  /* Focus indicator - only show on the indicator element when focus-visible */
  .item:focus-visible .indicator {
    opacity: 1;
    box-shadow: 0 0 0 2px var(--md-sys-color-primary, #6750a4);
  }

  /* Icon container */
  .icon-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 32px;
    z-index: 2;
  }

  :host([layout="horizontal"]) .icon-container {
    width: auto;
    height: 32px;
  }

  /* Icon styling */
  .icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    transition: color 0.2s ease;
    z-index: 2;
  }

  .item.active .icon {
    color: var(--md-sys-color-on-secondary-container, #1d192b);
  }

  /* Label styling */
  .label {
    font-family: 'Roboto', system-ui, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    text-align: center;
    transition: color 0.2s ease;
    z-index: 2;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .item.active .label {
    color: var(--md-sys-color-secondary, #6750a4);
  }


  .item:hover .state-layer {
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.08;
  }

  /* Active item hover/focus/press states - state layer over indicator */
  .item.active:hover .state-layer {
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.08;
  }

  .item:focus,
  .item:focus-visible {
    outline: none;
  }

  .item:active .state-layer {
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.10;
  }

  .item.active:active .state-layer {
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.10;
  }

  /* Badge styling */
  .badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: var(--md-sys-color-error, #ba1a1a);
    color: var(--md-sys-color-on-error, #ffffff);
    border-radius: 10px;
    min-width: 16px;
    height: 16px;
    padding: 0 6px;
    font-size: 10px;
    font-weight: 500;
    line-height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
    box-sizing: border-box;
  }

  .badge:empty {
    min-width: 8px;
    width: 8px;
    height: 8px;
    padding: 0;
    border-radius: 4px;
    top: 8px;
    right: 6px;
  }

  /* Large badge */
  .badge-large {
    position: absolute;
    top: 2px;
    right: 2px;
    background-color: var(--md-sys-color-error, #ba1a1a);
    color: var(--md-sys-color-on-error, #ffffff);
    border-radius: 12px;
    min-width: 24px;
    height: 24px;
    padding: 0 8px;
    font-size: 12px;
    font-weight: 500;
    line-height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    box-sizing: border-box;
  }

  .badge-large-label {
    font-size: 11px;
    font-weight: 500;
    line-height: 16px;
    padding: 0 4px;
    max-width: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

