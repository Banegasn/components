import { css } from 'lit';

export const m3ListItemStyles = css`
  :host {
    display: block;
    --_item-min-height: 56px;
    --_item-padding-start: 16px;
    --_item-padding-end: 16px;
    --_leading-gap: 16px;
    --_trailing-gap: 16px;
    --_shape: 0px;
    --_animation-duration: 0.3s;
  }

  .item {
    display: flex;
    align-items: center;
    min-height: var(--_item-min-height);
    padding: 8px var(--_item-padding-end) 8px var(--_item-padding-start);
    gap: var(--_leading-gap);
    border-radius: var(--_shape);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    transition: background-color var(--_animation-duration) cubic-bezier(0.2, 0, 0, 1);
    background-color: transparent;
  }

  /* Content area */
  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    gap: 0px;
  }

  .headline {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5rem;
    color: var(--md-sys-color-on-surface, #1d1b20);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .supporting-text {
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.25rem;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tertiary-text {
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1rem;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Leading content */
  .leading {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--md-sys-color-on-surface-variant, #49454f);
  }

  /* Trailing content */
  .trailing {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    margin-left: auto;
    padding-left: var(--_trailing-gap);
  }

  /* State layer for ripple/touch feedback */
  .state-layer {
    position: absolute;
    inset: 0;
    background-color: currentColor;
    opacity: 0;
    transition: opacity var(--_animation-duration);
    pointer-events: none;
    z-index: 0;
  }

  .item:hover .state-layer {
    opacity: 0.08;
  }

  .item:active .state-layer {
    opacity: 0.12;
  }

  .item:focus-visible .state-layer {
    opacity: 0.12;
  }

  /* Selected state */
  :host([selected]) .item {
    background-color: var(--md-sys-color-secondary-container, #e8def8);
  }

  :host([selected]) .headline {
    color: var(--md-sys-color-on-secondary-container, #1d192b);
  }

  :host([selected]) .leading,
  :host([selected]) .trailing {
    color: var(--md-sys-color-on-secondary-container, #1d192b);
  }

  /* Disabled state */
  :host([disabled]) .item {
    opacity: 0.38;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Line variants */
  :host([lines="2"]) {
    --_item-min-height: 72px;
  }

  :host([lines="3"]) {
    --_item-min-height: 88px;
  }

  :host([lines="2"]) .content,
  :host([lines="3"]) .content {
    gap: 4px;
  }

  /* Shape variants */
  :host([shape="rounded"]) {
    --_shape: 12px;
  }

  :host([shape="full"]) {
    --_shape: 999px;
  }

  /* Focus ring */
  .item:focus-visible {
    outline: 2px solid var(--md-sys-color-primary, #6750a4);
    outline-offset: -2px;
  }
`;
