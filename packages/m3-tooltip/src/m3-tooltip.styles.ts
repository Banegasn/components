import { css } from 'lit';

export const m3TooltipStyles = css`
  :host { display: inline-block; }

  .tooltip-surface {
    position: fixed;
    z-index: 999;
    max-width: min(320px, calc(100vw - 16px));
    max-height: calc(100vh - 16px);
    overflow: auto;
    padding: 4px 8px;
    border-radius: var(--md-comp-tooltip-shape, 4px);
    font-size: 0.75rem;
    line-height: 1rem;
    opacity: 0;
    pointer-events: none;
    transform: scale(0.96);
    transition: opacity var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-emphasized-decelerate), transform var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-emphasized-decelerate);
  }

  .tooltip-surface:not([positioned]) { visibility: hidden; }
  .tooltip-surface[visible] { opacity: 1; transform: scale(1); }

  :host([variant="plain"]) .tooltip-surface {
    background-color: var(--md-sys-color-inverse-surface, #322f35);
    color: var(--md-sys-color-inverse-on-surface, #f5eff7);
  }

  :host([variant="rich"]) .tooltip-surface {
    padding: 12px 16px;
    border-radius: var(--md-comp-tooltip-shape, 12px);
    background-color: var(--md-sys-color-surface-container, #f3edf7);
    color: var(--md-sys-color-on-surface, #1d1b20);
    box-shadow: 0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.3);
    pointer-events: auto;
  }

  .rich-title { margin-bottom: 4px; font-weight: 700; }
  .rich-content { font-size: 0.875rem; line-height: 1.25rem; }
  .tooltip-surface[data-placement="top"] { transform-origin: bottom center; }
  .tooltip-surface[data-placement="bottom"] { transform-origin: top center; }
  .tooltip-surface[data-placement="left"] { transform-origin: center right; }
  .tooltip-surface[data-placement="right"] { transform-origin: center left; }

  @media (prefers-reduced-motion: reduce) { .tooltip-surface { transition: none; } }
`;
