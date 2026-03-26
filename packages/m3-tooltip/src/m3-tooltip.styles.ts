import { css } from 'lit';

export const m3TooltipStyles = css`
  :host {
    display: inline-block;
    position: relative;
  }

  .tooltip-surface {
    position: absolute;
    z-index: 999;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    line-height: 1rem;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transform: scale(0.8);
    transition: opacity 0.15s cubic-bezier(0, 0, 0, 1), transform 0.15s cubic-bezier(0, 0, 0, 1);
  }

  /* Plain tooltip */
  :host([variant="plain"]) .tooltip-surface,
  :host(:not([variant])) .tooltip-surface {
    background-color: var(--md-sys-color-inverse-surface, #322f35);
    color: var(--md-sys-color-inverse-on-surface, #f5eff7);
    max-width: 200px;
    white-space: normal;
  }

  /* Rich tooltip */
  :host([variant="rich"]) .tooltip-surface {
    background-color: var(--md-sys-color-surface-container, #f3edf7);
    color: var(--md-sys-color-on-surface, #1d1b20);
    border-radius: 12px;
    padding: 12px 16px;
    max-width: 320px;
    white-space: normal;
    box-shadow: 0 2px 6px 2px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.3);
  }

  .tooltip-surface[visible] {
    opacity: 1;
    transform: scale(1);
  }

  /* Placement */
  :host([placement="top"]) .tooltip-surface {
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) scale(0.8);
  }
  :host([placement="top"]) .tooltip-surface[visible] {
    transform: translateX(-50%) scale(1);
  }

  :host([placement="bottom"]) .tooltip-surface,
  :host(:not([placement])) .tooltip-surface {
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) scale(0.8);
  }
  :host([placement="bottom"]) .tooltip-surface[visible],
  :host(:not([placement])) .tooltip-surface[visible] {
    transform: translateX(-50%) scale(1);
  }

  :host([placement="left"]) .tooltip-surface {
    right: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%) scale(0.8);
  }
  :host([placement="left"]) .tooltip-surface[visible] {
    transform: translateY(-50%) scale(1);
  }

  :host([placement="right"]) .tooltip-surface {
    left: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%) scale(0.8);
  }
  :host([placement="right"]) .tooltip-surface[visible] {
    transform: translateY(-50%) scale(1);
  }
`;
