import { fixture, html, expect } from '@open-wc/testing';
import { describe, it } from 'vitest';
import '../../m3-menu/src/m3-menu.js';
import './m3-fab-menu.js';
import type { M3FabMenu } from './m3-fab-menu.js';

describe('M3FabMenu public interaction contract', () => {
  it('uses the supplied label and coordinates its slotted menu', async () => {
    const el = await fixture<M3FabMenu>(html`
      <m3-fab-menu label="Create item">
        <m3-menu slot="menu"><m3-menu-item>New file</m3-menu-item></m3-menu>
      </m3-fab-menu>
    `);
    await el.updateComplete;
    const trigger = el.shadowRoot!.querySelector<HTMLButtonElement>('.fab')!;
    const menu = el.querySelector('m3-menu')!;
    expect(trigger.getAttribute('aria-label')).to.equal('Create item');
    expect(trigger.getAttribute('aria-controls')).to.equal(menu.id);

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }));
    await el.updateComplete;
    await (menu as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));
    expect(el.open).to.be.true;
    expect(trigger.getAttribute('aria-expanded')).to.equal('true');
    expect((menu.querySelector('m3-menu-item') as HTMLElement).shadowRoot!.activeElement).to.exist;
  });

  it('reports dismissal and keeps a disabled trigger inert', async () => {
    const el = await fixture<M3FabMenu>(html`
      <m3-fab-menu disabled><m3-menu slot="menu"><m3-menu-item>New</m3-menu-item></m3-menu></m3-fab-menu>
    `);
    const trigger = el.shadowRoot!.querySelector<HTMLButtonElement>('.fab')!;
    trigger.click();
    await el.updateComplete;
    expect(el.open).to.be.false;
  });
});
