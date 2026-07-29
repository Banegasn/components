import { css } from 'lit';
export const m3TabsStyles = css`
  :host {
    display: block;
    width: 100%;
    overflow: hidden;
  }
  .tabs-container {
    display: flex;
    width: 100%;
    border-bottom: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    position: relative;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  .tabs-container.vertical {
    flex-direction: column;
    width: fit-content;
    min-width: 100%;
    border-bottom: 0;
    border-right: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
  }
  .indicator {
    position: absolute;
    bottom: 0;
    height: 3px;
    background-color: var(--md-sys-color-primary, #6750a4);
    border-radius: 3px 3px 0 0;
    transition:
      left var(--md-sys-motion-duration-medium2)
        var(--md-sys-motion-easing-emphasized),
      width var(--md-sys-motion-duration-medium2)
        var(--md-sys-motion-easing-emphasized);
    z-index: 1;
  }
  .vertical .indicator {
    right: 0;
    bottom: auto;
    width: 3px;
    height: auto;
    border-radius: 3px 0 0 3px;
    transition:
      top var(--md-sys-motion-duration-medium2)
        var(--md-sys-motion-easing-emphasized),
      height var(--md-sys-motion-duration-medium2)
        var(--md-sys-motion-easing-emphasized);
  }
`;
export const m3TabStyles = css`
  :host {
    display: inline-flex;
    flex: 1 1 0%;
    min-width: 0;
    outline: none;
  }
  .tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 100%;
    min-height: 48px;
    padding: 12px 16px;
    box-sizing: border-box;
    background: transparent;
    cursor: pointer;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
    font-family: inherit;
    position: relative;
    transition: color var(--md-sys-motion-duration-short4);
    overflow: hidden;
  }
  :host([active]) .tab {
    color: var(--md-sys-color-primary, #6750a4);
  }
  .label {
    position: relative;
    z-index: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .state-layer {
    position: absolute;
    inset: 0;
    background-color: currentColor;
    opacity: 0;
    transition: opacity var(--md-sys-motion-duration-short4);
    pointer-events: none;
    z-index: 1;
  }
  :host(:hover) .state-layer {
    opacity: 0.08;
  }
  :host(:active) .state-layer,
  :host(:focus-visible) .state-layer {
    opacity: 0.12;
  }
  :host([disabled]) {
    opacity: 0.38;
    cursor: not-allowed;
    pointer-events: none;
  }
  ::slotted([slot='icon']) {
    width: 24px;
    height: 24px;
    margin-bottom: 2px;
    color: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
