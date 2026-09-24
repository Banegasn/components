import { css } from 'lit';

export const navigationRailToggleStyles = css`
  :host {
    /* motion-literal-exempt: token fallbacks keep motion usable without theme CSS. */
    --_rail-duration: var(--md-sys-motion-duration-long1, 450ms);
    --_rail-medium-duration: var(--md-sys-motion-duration-medium2, 300ms);
    --_rail-short-duration: var(--md-sys-motion-duration-short4, 200ms);
    --_rail-easing: var(
      --md-sys-motion-easing-emphasized,
      cubic-bezier(0.2, 0, 0, 1)
    );
    --_rail-standard-easing: var(
      --md-sys-motion-easing-standard,
      cubic-bezier(0.2, 0, 0, 1)
    );
  }

  @media (prefers-reduced-motion: reduce) {
    :host {
      /* motion-literal-exempt: reduced motion settles at the final state. */
      --_rail-duration: 1ms;
      --_rail-medium-duration: 1ms;
      --_rail-short-duration: 1ms;
    }
  }

  .toggle-button {
    width: 56px;
    height: 56px;
    border-radius: 28px;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background-color var(--_rail-short-duration),
      box-shadow var(--_rail-short-duration)
        var(--_rail-standard-easing);
    color: var(--md-sys-color-on-surface-variant, #49454f);
    place-self: flex-start;
    margin: 0;
    position: relative;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    box-shadow: 0 0 0 0 transparent;
  }

  .toggle-button:focus,
  .toggle-button:focus-visible {
    outline: none;
  }

  /* Focus indicator - show box-shadow when focus-visible */
  .toggle-button:focus-visible {
    box-shadow: 0 0 0 2px var(--md-sys-color-primary, #6750a4);
  }

  .toggle-button:hover {
    background-color: var(--md-sys-color-surface-variant, #e7e0ec);
  }

  .toggle-button:active {
    background-color: var(--md-sys-color-secondary-container, #e8def8);
  }

  .icon {
    position: relative;
    width: 24px;
    height: 24px;
  }

  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    transition:
      opacity var(--_rail-medium-duration)
        var(--_rail-easing),
      transform var(--_rail-duration)
        var(--_rail-easing);
  }

  .menu-icon {
    opacity: 1;
    transform: rotate(0) scale(1);
  }

  .collapse-icon {
    opacity: 0;
    transform: translateX(8px) rotate(35deg) scale(0.7);
  }

  :host([expanded]) .menu-icon {
    opacity: 0;
    transform: rotate(-90deg) scale(0.7);
  }

  :host([expanded]) .collapse-icon {
    opacity: 1;
    transform: translateX(0) rotate(0) scale(1);
  }
`;
