import { css } from 'lit';

export const m3DialogStyles = css`
  :host {
    display: contents;
  }

  .scrim {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.32);
    opacity: 0;
    transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  }

  .scrim[open] {
    opacity: 1;
    pointer-events: auto;
  }

  .dialog-container {
    position: fixed;
    inset: 0;
    z-index: 1001;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .dialog {
    position: relative;
    min-width: 280px;
    max-width: 560px;
    width: calc(100% - 48px);
    max-height: calc(100% - 48px);
    background-color: var(--md-sys-color-surface-container-high, #ece6f0);
    border-radius: 28px;
    box-shadow: 0 8px 12px 6px rgba(0, 0, 0, 0.15), 0 4px 4px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    transform: scale(0.9);
    opacity: 0;
    transition: transform 0.2s cubic-bezier(0, 0, 0, 1), opacity 0.15s cubic-bezier(0, 0, 0, 1);
    pointer-events: none;
  }

  .dialog[open] {
    transform: scale(1);
    opacity: 1;
    pointer-events: auto;
  }

  .icon-slot {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 24px 0;
    color: var(--md-sys-color-secondary, #625b71);
  }

  .icon-slot:empty {
    display: none;
  }

  .headline {
    padding: 24px 24px 16px;
    margin: 0;
    font-size: 1.5rem;
    font-weight: 400;
    line-height: 2rem;
    color: var(--md-sys-color-on-surface, #1d1b20);
    text-align: center;
  }

  :host([has-icon]) .headline {
    text-align: center;
  }

  .content {
    padding: 0 24px 24px;
    overflow-y: auto;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    padding: 16px 24px 24px;
  }

  .actions:empty {
    display: none;
  }
`;
