import { css } from 'lit';

export const m3DividerStyles = css`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    --_color: var(--md-comp-divider-color, var(--md-sys-color-outline-variant, #cac4d0));
    --_thickness: 1px;
    --_inset-start: 16px;
    --_inset-end: 16px;
    --_middle-space: 16px;
    --_animation-duration: var(--md-comp-divider-motion-duration, 0.6s);
    --_animation-easing: var(--md-comp-divider-motion-easing, cubic-bezier(0.2, 0, 0, 1));
  }

  /* Horizontal (default) */
  .divider {
    width: 100%;
    height: var(--_thickness);
    background-color: var(--_color);
    border: none;
    margin: 0;
    transform-origin: center;
    animation: divider-enter var(--_animation-duration) var(--_animation-easing) forwards;
  }

  /* Vertical */
  :host([orientation="vertical"]) {
    display: inline-flex;
    height: 100%;
    align-self: stretch;
  }

  :host([orientation="vertical"]) .divider {
    width: var(--_thickness);
    height: 100%;
    animation-name: divider-enter-vertical;
  }

  /* Inset variant */
  :host([variant="inset"]) .divider {
    width: calc(100% - var(--_inset-start));
    margin-left: var(--_inset-start);
    margin-right: 0;
  }

  :host([variant="inset"][orientation="vertical"]) .divider {
    width: var(--_thickness);
    height: calc(100% - var(--_inset-start));
    margin-left: 0;
    margin-top: var(--_inset-start);
    margin-bottom: 0;
  }

  /* Middle variant */
  :host([variant="middle"]) .divider {
    width: calc(100% - var(--_inset-start) - var(--_inset-end));
  }

  :host([variant="middle"][orientation="vertical"]) .divider {
    width: var(--_thickness);
    height: calc(100% - var(--_inset-start) - var(--_inset-end));
  }

  /* Thickness variants */
  :host([thickness="2"]) .divider {
    --_thickness: 2px;
  }

  :host([thickness="4"]) .divider {
    --_thickness: 4px;
  }

  /* No animation */
  :host([no-animation]) .divider {
    animation: none;
  }

  /* Pulsing divider for loading/placeholder states */
  :host([pulsing]) .divider {
    animation: divider-enter var(--_animation-duration) var(--_animation-easing) forwards,
               divider-pulse 2s ease-in-out infinite var(--_animation-duration);
  }

  :host([pulsing][orientation="vertical"]) .divider {
    animation: divider-enter-vertical var(--_animation-duration) var(--_animation-easing) forwards,
               divider-pulse 2s ease-in-out infinite var(--_animation-duration);
  }

  @keyframes divider-enter {
    from {
      transform: scaleX(0);
      opacity: 0;
    }
    to {
      transform: scaleX(1);
      opacity: 1;
    }
  }

  @keyframes divider-enter-vertical {
    from {
      transform: scaleY(0);
      opacity: 0;
    }
    to {
      transform: scaleY(1);
      opacity: 1;
    }
  }

  @keyframes divider-pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
`;
