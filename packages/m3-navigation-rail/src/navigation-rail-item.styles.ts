import { css } from 'lit';

export const navigationRailItemStyles = css`
  :host {
    /* motion-literal-exempt: token fallbacks keep motion usable without theme CSS. */
    --_rail-duration: var(--md-sys-motion-duration-long1, 450ms);
    --_rail-short-duration: var(--md-sys-motion-duration-short4, 200ms);
    --_rail-press-duration: var(--md-sys-motion-duration-short2, 100ms);
    --_rail-easing: var(
      --md-sys-motion-easing-emphasized,
      cubic-bezier(0.2, 0, 0, 1)
    );
    --_rail-standard-easing: var(
      --md-sys-motion-easing-standard,
      cubic-bezier(0.2, 0, 0, 1)
    );
    display: block;
    width: 100%;
  }

  @media (prefers-reduced-motion: reduce) {
    :host {
      /* motion-literal-exempt: reduced motion settles at the final state. */
      --_rail-duration: 1ms;
      --_rail-short-duration: 1ms;
      --_rail-press-duration: 1ms;
    }
  }

  .item {
    position: relative;
    display: block;
    width: 100%;
    height: 64px;
    padding: 0;
    border: none;
    border-radius: 16px;
    background: transparent;
    cursor: pointer;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    -webkit-tap-highlight-color: transparent;
    transition: height var(--_rail-duration)
      var(--_rail-easing);
  }

  :host([expanded]) .item {
    height: 48px;
  }

  .item:focus {
    outline: none;
  }

  .indicator {
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    width: 100%;
    height: 32px;
    border-radius: 20px;
    pointer-events: none;
    box-shadow: 0 0 0 0 transparent;
    transition:
      height var(--_rail-duration)
        var(--_rail-easing),
      border-radius var(--_rail-duration)
        var(--_rail-easing),
      background-color var(--_rail-short-duration)
        var(--_rail-standard-easing),
      box-shadow var(--_rail-short-duration)
        var(--_rail-standard-easing);
  }

  :host([expanded]) .indicator {
    height: 48px;
    border-radius: 16px;
  }

  .item:focus-visible .indicator {
    box-shadow: 0 0 0 2px var(--md-sys-color-primary, #6750a4);
  }

  .item.active .indicator {
    background-color: var(--md-sys-color-secondary-container, #6750a4);
  }

  .item:hover .indicator {
    background-color: var(--md-sys-color-surface-variant, #e7e0ec);
  }

  .icon {
    position: absolute;
    inset-inline-start: 8px;
    top: 0;
    display: flex;
    width: 48px;
    height: 32px;
    align-items: center;
    justify-content: center;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    transition:
      inset-inline-start var(--_rail-duration)
        var(--_rail-easing),
      top var(--_rail-duration)
        var(--_rail-easing),
      color var(--_rail-short-duration),
      transform var(--_rail-press-duration);
  }

  :host([expanded]) .icon {
    inset-inline-start: 4px;
    top: 8px;
  }

  .item:active .icon {
    transform: scale(0.9);
  }

  .item.active .icon {
    color: var(--md-sys-color-on-secondary-container, #1d192b);
  }

  .label-group {
    position: absolute;
    inset-inline-start: 0;
    top: 36px;
    display: flex;
    width: 100%;
    height: 20px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    overflow: hidden;
    white-space: nowrap;
    transition:
      inset-inline-start var(--_rail-duration)
        var(--_rail-easing),
      top var(--_rail-duration)
        var(--_rail-easing),
      width var(--_rail-duration)
        var(--_rail-easing);
  }

  :host([expanded]) .label-group {
    inset-inline-start: 56px;
    top: 14px;
    width: calc(100% - 68px);
    justify-content: flex-start;
  }

  .label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: Roboto, system-ui, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    text-align: center;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    transition:
      font-size var(--_rail-duration)
        var(--_rail-easing),
      color var(--_rail-short-duration);
  }

  :host([expanded]) .label {
    font-size: 14px;
    text-align: start;
  }

  .item.active .label {
    color: var(--md-sys-color-on-surface, #1d1b20);
  }

  .badge {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    min-width: 16px;
    height: 16px;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background-color: var(--md-sys-color-error, #ba1a1a);
    color: var(--md-sys-color-on-error, #ffffff);
    font-size: 11px;
    font-weight: 500;
  }

  .badge:empty {
    top: 4px;
    right: 4px;
    min-width: 6px;
    height: 6px;
    border-radius: 3px;
  }

  .badge-expanded {
    display: inline-flex;
    min-width: 16px;
    min-height: 16px;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background-color: var(--md-sys-color-error, #ba1a1a);
    color: var(--md-sys-color-on-error, #ffffff);
    font-size: 11px;
    line-height: 16px;
  }
`;
