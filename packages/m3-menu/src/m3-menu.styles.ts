import { css } from 'lit';

export const m3MenuStyles = css`
  :host {
    position: absolute;
    z-index: 1000;
    display: block;
    top: calc(100% + var(--md-menu-offset, 8px));
    inset-inline-end: 0;
  }

  :host([placement="bottom-start"]) {
    top: calc(100% + var(--md-menu-offset, 8px));
    bottom: auto;
    inset-inline-start: 0;
    inset-inline-end: auto;
    transform: none;
  }

  :host([placement="bottom-center"]) {
    top: calc(100% + var(--md-menu-offset, 8px));
    bottom: auto;
    inset-inline-start: 50%;
    inset-inline-end: auto;
    transform: translateX(-50%);
  }

  :host([placement="bottom-end"]) {
    top: calc(100% + var(--md-menu-offset, 8px));
    bottom: auto;
    inset-inline-start: auto;
    inset-inline-end: 0;
    transform: none;
  }

  :host([placement="top-start"]) {
    top: auto;
    bottom: calc(100% + var(--md-menu-offset, 8px));
    inset-inline-start: 0;
    inset-inline-end: auto;
    transform: none;
  }

  :host([placement="top-center"]) {
    top: auto;
    bottom: calc(100% + var(--md-menu-offset, 8px));
    inset-inline-start: 50%;
    inset-inline-end: auto;
    transform: translateX(-50%);
  }

  :host([placement="top-end"]) {
    top: auto;
    bottom: calc(100% + var(--md-menu-offset, 8px));
    inset-inline-start: auto;
    inset-inline-end: 0;
    transform: none;
  }

  :host([placement="right-start"]) {
    top: 0;
    bottom: auto;
    inset-inline-start: calc(100% + var(--md-menu-offset, 8px));
    inset-inline-end: auto;
    transform: none;
  }

  :host([placement="right-center"]) {
    top: 50%;
    bottom: auto;
    inset-inline-start: calc(100% + var(--md-menu-offset, 8px));
    inset-inline-end: auto;
    transform: translateY(-50%);
  }

  :host([placement="right-end"]) {
    top: auto;
    bottom: 0;
    inset-inline-start: calc(100% + var(--md-menu-offset, 8px));
    inset-inline-end: auto;
    transform: none;
  }

  :host([placement="left-start"]) {
    top: 0;
    bottom: auto;
    inset-inline-start: auto;
    inset-inline-end: calc(100% + var(--md-menu-offset, 8px));
    transform: none;
  }

  :host([placement="left-center"]) {
    top: 50%;
    bottom: auto;
    inset-inline-start: auto;
    inset-inline-end: calc(100% + var(--md-menu-offset, 8px));
    transform: translateY(-50%);
  }

  :host([placement="left-end"]) {
    top: auto;
    bottom: 0;
    inset-inline-start: auto;
    inset-inline-end: calc(100% + var(--md-menu-offset, 8px));
    transform: none;
  }

  .surface {
    min-inline-size: var(--md-menu-min-width, 180px);
    max-inline-size: min(280px, calc(100vw - 32px));
    max-block-size: var(--md-menu-max-height, calc(100vh - 64px));
    overflow-y: auto;
    padding: 8px;
    border-radius: 16px;
    background: var(--md-sys-color-surface-container, #f3edf7);
    color: var(--md-sys-color-on-surface, #1d1b20);
    border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    box-shadow:
      0px 1px 2px rgba(0, 0, 0, 0.3),
      0px 2px 6px 2px rgba(0, 0, 0, 0.15);
  }

  .surface::-webkit-scrollbar {
    width: 14px;
  }

  .surface::-webkit-scrollbar-track {
    background: transparent;
  }

  .surface::-webkit-scrollbar-thumb {
    background-color: var(--md-sys-color-outline-variant, #cac4d0);
    border-radius: 7px;
    border: 4px solid var(--md-sys-color-surface-container, #f3edf7);
  }

  .surface::-webkit-scrollbar-thumb:hover {
    background-color: var(--md-sys-color-outline, #79747e);
  }

  .surface[hidden] {
    display: none;
  }

  ::slotted(m3-menu-item) {
    display: block;
  }
`;
