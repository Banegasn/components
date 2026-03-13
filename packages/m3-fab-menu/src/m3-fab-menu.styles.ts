import { css } from 'lit';

export const m3FabMenuStyles = css`
  :host {
    display: inline-block;
    position: relative;
    z-index: 10;
    box-sizing: border-box;
    vertical-align: middle;
  }

  .fab {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background-color: var(--md-sys-color-primary-container, #eaddff);
    color: var(--md-sys-color-on-primary-container, #21005d);
    border: none;
    cursor: pointer;
    box-shadow: 0px 4px 8px 3px rgba(0,0,0,0.15);
    transition: transform 0.3s cubic-bezier(0.2, 0.0, 0, 1.0), border-radius 0.3s, background-color 0.3s;
  }

  .fab:hover {
    filter: brightness(0.95);
    box-shadow: 0px 6px 10px 4px rgba(0,0,0,0.15);
  }

  .fab.active {
    transform: rotate(135deg);
    border-radius: 28px; /* Circle */
    background-color: var(--md-sys-color-tertiary-container, #ffd8e4);
    color: var(--md-sys-color-on-tertiary-container, #31111d);
  }

  .menu {
    position: absolute;
    bottom: 70px;
    left: 50%;
    opacity: 0;
    pointer-events: none;
    transform: translateX(-50%) translateY(20px) scale(0.8);
    transition: opacity 0.2s, transform 0.2s cubic-bezier(0.2, 0.0, 0, 1.0);
    transform-origin: bottom center;
  }

  .menu slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .menu ::slotted(*) {
    display: block;
  }

  .menu.open {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(-50%) translateY(0) scale(1);
  }
`;
