import { css } from 'lit';

export const m3CardStyles = css`
  :host {
    display: block;
    --_container-shape: var(--md-card-container-shape, 12px);
  }

  /* Width variants */
  :host([width="auto"]),
  :host(:not([width])) {
    max-width: fit-content;
  }

  :host([width="full"]) {
    width: 100%;
  }

  :host([width="fixed"]) {
    width: var(--md-card-width, 320px);
  }

  :host([disabled]) {
    pointer-events: none;
    opacity: 0.38;
  }

  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: var(--_container-shape);
    overflow: hidden;
    transition: 
      background-color 0.2s,
      box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.28s cubic-bezier(0.4, 0, 0.2, 1),
      border-color 0.2s;
    outline: none;
  }

  /* Make clickable cards accessible and interactive */
  :host([clickable]) .card {
    cursor: pointer;
    user-select: none;
  }

  :host([clickable]) .card:focus-visible {
    outline: 2px solid var(--md-sys-color-primary, #6750a4);
    outline-offset: 2px;
  }

  /* ===== ELEVATED CARD VARIANT ===== */
  /* Uses surface-container-low with level1 elevation */
  :host([variant="elevated"]) .card,
  :host(:not([variant])) .card {
    background-color: var(
      --md-card-container-color,
      var(--md-sys-color-surface-container-low, #f7f2fa)
    );
    box-shadow: var(
      --md-card-elevation,
      0 1px 2px rgba(0, 0, 0, 0.3),
      0 1px 3px 1px rgba(0, 0, 0, 0.15)
    );
  }

  /* Elevated: Hover state - increased elevation */
  :host([variant="elevated"][clickable]) .card:hover,
  :host([clickable]:not([variant])) .card:hover {
    box-shadow: 
      0 1px 2px rgba(0, 0, 0, 0.3),
      0 2px 6px 2px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }

  /* Elevated: State layer overlay */
  :host([variant="elevated"]) .card::before,
  :host(:not([variant])) .card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
    z-index: 1;
  }

  :host([variant="elevated"][clickable]) .card:hover::before,
  :host([clickable]:not([variant])) .card:hover::before {
    opacity: 0.08;
  }

  :host([variant="elevated"][clickable]) .card:active::before,
  :host([clickable]:not([variant])) .card:active::before {
    opacity: 0.12;
  }

  /* Elevated: Pressed state */
  :host([variant="elevated"][clickable]) .card:active,
  :host([clickable]:not([variant])) .card:active {
    transform: scale(0.99);
    box-shadow: 
      0 1px 2px rgba(0, 0, 0, 0.3),
      0 1px 3px 1px rgba(0, 0, 0, 0.15);
  }

  /* Elevated: Dragged state */
  :host([variant="elevated"][dragged]) .card,
  :host([dragged]:not([variant])) .card {
    box-shadow: 
      0 4px 8px rgba(0, 0, 0, 0.3),
      0 6px 12px 4px rgba(0, 0, 0, 0.15);
    transform: scale(1.02);
  }

  /* ===== FILLED CARD VARIANT ===== */
  /* Uses surface-container-highest */
  :host([variant="filled"]) .card {
    background-color: var(
      --md-card-container-color,
      var(--md-sys-color-surface-container-highest, #e6e0e9)
    );
    box-shadow: none;
  }

  /* Filled: State layer overlay */
  :host([variant="filled"]) .card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
    z-index: 1;
  }

  :host([variant="filled"][clickable]) .card:hover::before {
    opacity: 0.08;
  }

  :host([variant="filled"][clickable]) .card:active::before {
    opacity: 0.12;
  }

  /* Filled: Hover state */
  :host([variant="filled"][clickable]) .card:hover {
    box-shadow: 
      0 1px 2px rgba(0, 0, 0, 0.3),
      0 1px 3px 1px rgba(0, 0, 0, 0.15);
  }

  /* Filled: Pressed state */
  :host([variant="filled"][clickable]) .card:active {
    transform: scale(0.99);
  }

  /* Filled: Dragged state */
  :host([variant="filled"][dragged]) .card {
    box-shadow: 
      0 4px 8px rgba(0, 0, 0, 0.3),
      0 6px 12px 4px rgba(0, 0, 0, 0.15);
    transform: scale(1.02);
  }

  /* ===== OUTLINED CARD VARIANT ===== */
  /* Uses surface with outline-variant border */
  :host([variant="outlined"]) .card {
    background-color: var(
      --md-card-container-color,
      var(--md-sys-color-surface, #fef7ff)
    );
    border: 1px solid var(--md-sys-color-outline-variant, #c9c5d0);
    box-shadow: none;
  }

  /* Outlined: State layer overlay */
  :host([variant="outlined"]) .card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: var(--md-sys-color-on-surface, #1d1b20);
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
    z-index: 1;
  }

  :host([variant="outlined"][clickable]) .card:hover::before {
    opacity: 0.08;
  }

  :host([variant="outlined"][clickable]) .card:active::before {
    opacity: 0.12;
  }

  /* Outlined: Hover state */
  :host([variant="outlined"][clickable]) .card:hover {
    border-color: var(--md-sys-color-outline, #79747e);
    box-shadow: 
      0 1px 2px rgba(0, 0, 0, 0.3),
      0 1px 3px 1px rgba(0, 0, 0, 0.15);
  }

  /* Outlined: Pressed state */
  :host([variant="outlined"][clickable]) .card:active {
    transform: scale(0.99);
  }

  /* Outlined: Dragged state */
  :host([variant="outlined"][dragged]) .card {
    box-shadow: 
      0 4px 8px rgba(0, 0, 0, 0.3),
      0 6px 12px 4px rgba(0, 0, 0, 0.15);
    transform: scale(1.02);
  }

  /* ===== CARD CONTENT SECTIONS ===== */
  
  /* Hide empty slot containers */
  .card-media:not(:has(*)),
  .card-header:not(:has(*)),
  .card-actions:not(:has(*)) {
    display: none;
  }
  
  /* Media section */
  .card-media {
    position: relative;
    width: 100%;
    overflow: hidden;
    z-index: 0;
  }

  .card-media ::slotted(*) {
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  .card-media ::slotted(img),
  .card-media ::slotted(video) {
    vertical-align: bottom;
  }

  /* Header section */
  .card-header {
    position: relative;
    padding: 16px;
    z-index: 0;
  }

  .card-header ::slotted(*) {
    margin: 0;
  }

  /* Content section */
  .card-content {
    position: relative;
    padding: 16px;
    flex: 1;
    z-index: 0;
  }

  /* If there's a header, reduce top padding of content */
  :host(:has([slot="header"])) .card-content {
    padding-top: 0;
  }

  /* If there's media, ensure proper spacing */
  :host(:has([slot="media"])) .card-header,
  :host(:has([slot="media"])) .card-content {
    padding-top: 16px;
  }

  .card-content ::slotted(*) {
    margin: 0;
  }

  .card-content ::slotted(* + *) {
    margin-top: 8px;
  }

  /* Actions section */
  .card-actions {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px;
    z-index: 0;
  }

  .card-actions ::slotted(*) {
    flex-shrink: 0;
  }

  /* Responsive adjustments */
  @media (max-width: 600px) {
    :host([width="fixed"]) {
      width: 100%;
    }

    .card-header,
    .card-content {
      padding: 12px;
    }

    .card-actions {
      padding: 8px;
    }
  }

  /* Support for :has() fallback */
  @supports not (selector(:has(*))) {
    .card-header + .card-content {
      padding-top: 0;
    }

    .card-media + .card-header,
    .card-media + .card-content {
      padding-top: 16px;
    }
  }
`;

