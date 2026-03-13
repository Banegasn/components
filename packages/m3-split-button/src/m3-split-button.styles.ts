import { css } from 'lit';

export const m3SplitButtonStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    gap: 1px;
    vertical-align: middle;
    --md-split-button-height: 40px;
    --md-split-button-shape-start: 20px 4px 4px 20px;
    --md-split-button-shape-end: 4px 20px 20px 4px;
    --md-split-button-color-bg: var(--md-sys-color-primary, #6750a4);
    --md-split-button-color-text: var(--md-sys-color-on-primary, #ffffff);
  }

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: var(--md-split-button-height);
    padding: 0 24px;
    border: none;
    background-color: var(--md-split-button-color-bg);
    color: var(--md-split-button-color-text);
    font-family: var(--md-sys-typescale-label-large-font, Roboto, sans-serif);
    font-size: var(--md-sys-typescale-label-large-size, 14px);
    font-weight: var(--md-sys-typescale-label-large-weight, 500);
    line-height: var(--md-sys-typescale-label-large-line-height, 20px);
    cursor: pointer;
    transition: background-color 0.2s, box-shadow 0.2s;
    border-radius: var(--md-split-button-shape-start);
  }

  .menu-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: var(--md-split-button-height);
    width: 40px;
    border: none;
    background-color: var(--md-split-button-color-bg);
    color: var(--md-split-button-color-text);
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s, border-radius 0.2s;
    border-radius: var(--md-split-button-shape-end);
  }

  .button:hover, .menu-button:hover {
    filter: brightness(0.9);
  }

  .button:active, .menu-button:active {
    filter: brightness(0.8);
  }
  
  .menu-button.active {
      transform: rotate(180deg);
      border-radius: 20px; /* Shape morphing to circle/pill */
  }

  :host([variant="outlined"]) .button,
  :host([variant="outlined"]) .menu-button {
    background-color: transparent;
    border: 1px solid var(--md-sys-color-outline, #79747e);
    color: var(--md-sys-color-primary, #6750a4);
  }
  
  :host([variant="tonal"]) .button,
  :host([variant="tonal"]) .menu-button {
      background-color: var(--md-sys-color-secondary-container, #e8def8);
      color: var(--md-sys-color-on-secondary-container, #1d192b);
  }
  
  :host([variant="elevated"]) .button,
  :host([variant="elevated"]) .menu-button {
      background-color: var(--md-sys-color-surface-container-low, #f7f2fa);
      color: var(--md-sys-color-primary, #6750a4);
      box-shadow: 0px 1px 2px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15);
  }

  /* Remove border between buttons for filled/tonal/elevated to look seamless */
  :host(:not([variant="outlined"])) {
      gap: 1px;
      background-color: rgba(255,255,255,0.2); /* Divider color */
      border-radius: 20px;
  }
`;
