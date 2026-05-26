import { css } from 'lit';

export const m3SnackbarStyles = css`
  :host {
    display: block;
    --_animation-duration: 0.4s;
    --_animation-easing: cubic-bezier(0.2, 0, 0, 1);
    --_exit-easing: cubic-bezier(0.4, 0, 1, 1);
  }

  .snackbar {
    display: flex;
    align-items: center;
    min-height: 48px;
    padding: 0 16px;
    gap: 8px;
    background-color: var(--md-sys-color-inverse-surface, #322f35);
    color: var(--md-sys-color-inverse-on-surface, #f5eff7);
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.25rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 4px 8px 3px rgba(0,0,0,0.15);
    animation: snackbar-enter var(--_animation-duration) var(--_animation-easing) forwards;
  }

  .snackbar.leaving {
    animation: snackbar-exit var(--_animation-duration) var(--_exit-easing) forwards;
  }

  .message {
    flex: 1;
    min-width: 0;
    padding: 14px 0;
  }

  .action {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  /* Two-line snackbar for longer messages */
  :host([lines="2"]) .snackbar {
    min-height: 68px;
    align-items: flex-start;
  }

  :host([lines="2"]) .message {
    padding-top: 14px;
  }

  :host([lines="2"]) .action {
    padding-top: 6px;
  }

  @keyframes snackbar-enter {
    from {
      opacity: 0;
      transform: translateY(100%) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes snackbar-exit {
    from {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateY(100%) scale(0.9);
    }
  }
`;
