import { css } from 'lit';

export const m3ListStyles = css`
  :host {
    display: block;
    width: 100%;
    --_list-padding-top: 8px;
    --_list-padding-bottom: 8px;
    --_stagger-delay: 0.05s;
  }

  .list {
    display: flex;
    flex-direction: column;
    padding: var(--_list-padding-top) 0 var(--_list-padding-bottom);
    margin: 0;
    list-style: none;
  }

  /* Staggered entrance animation for child items */
  :host([staggered]) ::slotted(m3-list-item) {
    opacity: 0;
    transform: translateY(8px);
    animation: list-item-enter 0.4s cubic-bezier(0.2, 0, 0, 1) forwards;
  }

  /* We can't use nth-child on slotted elements with dynamic delay easily in pure CSS,
     but we can support a reasonable number of items */
  :host([staggered]) ::slotted(m3-list-item:nth-child(1)) { animation-delay: calc(var(--_stagger-delay) * 0); }
  :host([staggered]) ::slotted(m3-list-item:nth-child(2)) { animation-delay: calc(var(--_stagger-delay) * 1); }
  :host([staggered]) ::slotted(m3-list-item:nth-child(3)) { animation-delay: calc(var(--_stagger-delay) * 2); }
  :host([staggered]) ::slotted(m3-list-item:nth-child(4)) { animation-delay: calc(var(--_stagger-delay) * 3); }
  :host([staggered]) ::slotted(m3-list-item:nth-child(5)) { animation-delay: calc(var(--_stagger-delay) * 4); }
  :host([staggered]) ::slotted(m3-list-item:nth-child(6)) { animation-delay: calc(var(--_stagger-delay) * 5); }
  :host([staggered]) ::slotted(m3-list-item:nth-child(7)) { animation-delay: calc(var(--_stagger-delay) * 6); }
  :host([staggered]) ::slotted(m3-list-item:nth-child(8)) { animation-delay: calc(var(--_stagger-delay) * 7); }
  :host([staggered]) ::slotted(m3-list-item:nth-child(9)) { animation-delay: calc(var(--_stagger-delay) * 8); }
  :host([staggered]) ::slotted(m3-list-item:nth-child(10)) { animation-delay: calc(var(--_stagger-delay) * 9); }
  :host([staggered]) ::slotted(m3-list-item:nth-child(11)) { animation-delay: calc(var(--_stagger-delay) * 10); }
  :host([staggered]) ::slotted(m3-list-item:nth-child(12)) { animation-delay: calc(var(--_stagger-delay) * 11); }
  :host([staggered]) ::slotted(m3-list-item:nth-child(13)) { animation-delay: calc(var(--_stagger-delay) * 12); }
  :host([staggered]) ::slotted(m3-list-item:nth-child(14)) { animation-delay: calc(var(--_stagger-delay) * 13); }
  :host([staggered]) ::slotted(m3-list-item:nth-child(15)) { animation-delay: calc(var(--_stagger-delay) * 14); }
  :host([staggered]) ::slotted(m3-list-item:nth-child(16)) { animation-delay: calc(var(--_stagger-delay) * 15); }
  :host([staggered]) ::slotted(m3-list-item:nth-child(17)) { animation-delay: calc(var(--_stagger-delay) * 16); }
  :host([staggered]) ::slotted(m3-list-item:nth-child(18)) { animation-delay: calc(var(--_stagger-delay) * 17); }
  :host([staggered]) ::slotted(m3-list-item:nth-child(19)) { animation-delay: calc(var(--_stagger-delay) * 18); }
  :host([staggered]) ::slotted(m3-list-item:nth-child(20)) { animation-delay: calc(var(--_stagger-delay) * 19); }

  @keyframes list-item-enter {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
