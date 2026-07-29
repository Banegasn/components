import { fixture, html, expect } from '@open-wc/testing';
import { describe, it } from 'vitest';
import '../../m3-menu/src/m3-menu.js';
import './m3-split-button.js';
import type { M3SplitButton } from './m3-split-button.js';

describe('M3SplitButton public interaction contract', () => {
  it('coordinates a slotted menu, generated ARIA relationship, and focus return', async () => {
    const el = await fixture<M3SplitButton>(html`
      <m3-split-button>
        Send
        <m3-menu slot="menu"><m3-menu-item>Schedule</m3-menu-item></m3-menu>
      </m3-split-button>
    `);
    await el.updateComplete;
    const trigger = el.shadowRoot!.querySelector<HTMLButtonElement>('.menu-button')!;
    const menu = el.querySelector('m3-menu')!;
    expect(trigger.getAttribute('aria-haspopup')).to.equal('menu');
    expect(trigger.getAttribute('aria-controls')).to.equal(menu.id);
    expect(menu.id).not.to.equal('');

    trigger.click();
    await el.updateComplete;
    await (menu as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    expect(el.open).to.be.true;
    expect(trigger.getAttribute('aria-expanded')).to.equal('true');

    menu.shadowRoot!.querySelector<HTMLElement>('.surface')!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }),
    );
    await el.updateComplete;
    expect(el.open).to.be.false;
    expect(el.shadowRoot!.activeElement).to.equal(trigger);
  });

  it('does not emit empty aria-controls or activate disabled actions', async () => {
    const el = await fixture<M3SplitButton>(html`<m3-split-button disabled>Send</m3-split-button>`);
    const [main, trigger] = Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>('button'));
    let clicked = false;
    el.addEventListener('split-button-click', () => { clicked = true; });
    expect(trigger.hasAttribute('aria-controls')).to.be.false;
    main.click();
    trigger.click();
    await el.updateComplete;
    expect(clicked).to.be.false;
    expect(el.open).to.be.false;
  });
});
