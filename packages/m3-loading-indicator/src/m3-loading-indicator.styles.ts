import { css } from 'lit';

export const m3LoadingIndicatorStyles = css`
  :host {
    display: inline-block;
    --_size: var(--md-comp-loading-indicator-size, 48px);
    --_color: var(--md-comp-loading-indicator-color, var(--md-sys-color-primary, #6750a4));
  }

  .container {
    position: relative;
    width: var(--_size);
    height: var(--_size);
    animation: rotate 1.5s linear infinite;
  }

  .shape {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 4px solid var(--_color);
    border-right-color: transparent;
    border-bottom-color: transparent;
    box-sizing: border-box;
    transition: border-radius 0.5s ease;
  }
  
  :host([shape="square"]) .shape {
      border-radius: 8px;
  }

  @keyframes rotate {
    0% { transform: rotate(0deg); }
    50% { transform: rotate(180deg); border-width: 2px; }
    100% { transform: rotate(360deg); border-width: 4px; }
  }
  
  :host([variant="contained"]) {
      --_size: var(--md-comp-loading-indicator-size, 100%);
      --_color: var(--md-comp-loading-indicator-color, currentColor);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1em;
      height: 1em;
      vertical-align: middle;
      line-height: 1;
      flex-shrink: 0;
  }
  
  :host([variant="contained"]) .shape {
      border-width: 2px;
  }
`;
