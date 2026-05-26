import { css } from 'lit';

export const m3TopAppBarStyles = css`
  :host {
    display: block;
    width: 100%;
    --_height: 64px;
    --_container-shape: 0px;
    --_animation-duration: 0.3s;
    --_animation-easing: cubic-bezier(0.2, 0, 0, 1);
  }

  .app-bar {
    display: flex;
    align-items: center;
    height: var(--_height);
    padding: 0 4px 0 16px;
    gap: 4px;
    background-color: var(--md-sys-color-surface, #fef7ff);
    color: var(--md-sys-color-on-surface, #1d1b20);
    border-radius: var(--_container-shape);
    position: relative;
    transition: background-color var(--_animation-duration) var(--_animation-easing),
                box-shadow var(--_animation-duration) var(--_animation-easing);
  }

  /* Elevation shadow when scrolled or elevated */
  :host([elevated]) .app-bar {
    box-shadow: 0 1px 2px rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15);
  }

  /* Navigation icon slot */
  .navigation-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-right: 8px;
  }

  /* Headline / title */
  .headline {
    flex: 1;
    min-width: 0;
    font-size: 1.375rem;
    font-weight: 400;
    line-height: 1.75rem;
    color: var(--md-sys-color-on-surface, #1d1b20);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: opacity var(--_animation-duration) var(--_animation-easing),
                transform var(--_animation-duration) var(--_animation-easing);
  }

  /* Actions slot */
  .actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    margin-left: auto;
  }

  /* Center-aligned variant */
  :host([variant="center-aligned"]) .app-bar {
    justify-content: center;
    padding: 0 16px;
  }

  :host([variant="center-aligned"]) .navigation-icon {
    position: absolute;
    left: 8px;
  }

  :host([variant="center-aligned"]) .headline {
    flex: 0 1 auto;
    text-align: center;
    font-size: 1.25rem;
    line-height: 1.5rem;
  }

  /* Small variant */
  :host([variant="small"]) {
    --_height: 56px;
  }

  :host([variant="small"]) .headline {
    font-size: 1.125rem;
    line-height: 1.5rem;
    font-weight: 500;
  }

  /* Medium variant */
  :host([variant="medium"]) {
    --_height: 112px;
    align-items: flex-start;
    padding-top: 16px;
  }

  :host([variant="medium"]) .headline {
    align-self: flex-end;
    padding-bottom: 20px;
  }

  /* Large variant */
  :host([variant="large"]) {
    --_height: 152px;
    align-items: flex-start;
    padding-top: 16px;
  }

  :host([variant="large"]) .headline {
    align-self: flex-end;
    padding-bottom: 24px;
    font-size: 1.5rem;
    line-height: 2rem;
  }

  /* Scroll behavior - hide on scroll down */
  :host([scroll-behavior="hide"]) .app-bar {
    transition: transform var(--_animation-duration) var(--_animation-easing),
                background-color var(--_animation-duration) var(--_animation-easing),
                box-shadow var(--_animation-duration) var(--_animation-easing);
  }

  :host([scroll-behavior="hide"][scrolled-down]) .app-bar {
    transform: translateY(-100%);
  }

  /* Scroll behavior - shrink on scroll */
  :host([scroll-behavior="shrink"][scrolled-down]) {
    --_height: 56px;
  }

  :host([scroll-behavior="shrink"][scrolled-down]) .headline {
    font-size: 1.125rem;
    line-height: 1.5rem;
  }
`;
