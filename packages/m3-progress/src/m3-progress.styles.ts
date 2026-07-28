import { css } from 'lit';

export const m3ProgressStyles = css`
  :host {
    display: block;
    width: 100%;
    height: var(--md-comp-progress-track-height, 4px);
    position: relative;
    overflow: hidden;
    border-radius: 2px;
  }

  .track {
    position: absolute;
    inset: 0;
    background-color: var(--md-sys-color-surface-container-highest, #e6e0e9);
    border-radius: inherit;
  }

  .indicator {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: var(--md-sys-color-primary, #6750a4);
    border-radius: inherit;
    transition: width var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard);
  }

  /* Indeterminate animation */
  :host([indeterminate]) .indicator {
    width: 50% !important;
    animation: indeterminate var(--md-sys-motion-duration-extra-long4) var(--md-sys-motion-easing-standard) infinite;
    animation-play-state: var(--md-sys-motion-continuous-play-state, running);
  }

  @keyframes indeterminate {
    0% {
      left: var(--md-sys-motion-progress-start, -50%);
    }
    100% {
      left: 100%;
    }
  }

  /* Indeterminate progress becomes a static, centred partial track. */
  @media (prefers-reduced-motion: reduce) {
    :host([indeterminate]) .indicator {
      left: 25%;
      animation: none;
    }
  }

  /* Disabled */
  :host([disabled]) .track {
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.12;
  }

  :host([disabled]) .indicator {
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.38;
  }
`;
