import { css } from 'lit';

export const m3SliderStyles = css`
  :host {
    display: inline-block;
    width: 100%;
    min-width: 150px;
    height: 48px; /* Touch target size */
    --_track-height: 16px;
    --_active-track-height: 16px;
    --_thumb-size: 20px;
  }

  /* Slider container is exactly touch-target size */
  .slider-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .track-container {
    position: relative;
    width: 100%;
    height: var(--_track-height);
    display: flex;
    align-items: center;
  }

  .track-inactive {
    position: absolute;
    width: 100%;
    height: var(--_track-height);
    background-color: var(--md-sys-color-surface-container-highest, #e6e0e9);
    border-radius: 8px; /* Expressive pill shape for track */
  }

  .track-active {
    position: absolute;
    height: var(--_active-track-height);
    background-color: var(--md-sys-color-primary, #6750a4);
    border-radius: 8px;
  }

  .thumb-container {
    position: absolute;
    width: 0;
    height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    /* Disable pointer events here so input slider receives them */
    pointer-events: none;
  }

  .thumb {
    width: var(--_thumb-size);
    height: var(--_thumb-size);
    border-radius: 50%; /* Expressive circular thumb */
    background-color: var(--md-sys-color-primary, #6750a4);
    box-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2);
    /* Transform to visually center the thumb relative to left position */
    transform: translateX(-50%);
    z-index: 2;
  }

  .state-layer {
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--md-sys-color-primary, #6750a4);
    opacity: 0;
    transform: translateX(-50%);
    transition: opacity 0.2s;
    z-index: 1;
  }

  .state-layer[hovered] {
    opacity: 0.08;
  }

  .state-layer[focused] {
    opacity: 0.12;
  }

  .state-layer[active] {
    opacity: 0.12;
  }

  /* The actual invisible native input catching interaction */
  .slider-input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    margin: 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .slider-input:disabled {
    cursor: not-allowed;
  }

  :host([disabled]) .track-inactive {
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.12;
  }

  :host([disabled]) .track-active {
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0.38;
  }

  :host([disabled]) .thumb {
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    box-shadow: none;
    border: 2px solid var(--md-sys-color-surface, #fdf8fd);
    box-sizing: border-box;
  }
`;
