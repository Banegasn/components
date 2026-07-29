import { html, fixture, expect } from '@open-wc/testing';
import { describe, it } from 'vitest';
import './m3-snackbar.js';
import type { M3Snackbar } from './m3-snackbar.js';

async function settleSlotChange(el: M3Snackbar) {
  await new Promise((resolve) => setTimeout(resolve, 0));
  await el.updateComplete;
}

describe('M3Snackbar', () => {
  it('is hidden by default', async () => {
    const el = await fixture<M3Snackbar>(html`<m3-snackbar></m3-snackbar>`);
    expect(el.shadowRoot!.querySelector('.snackbar')).to.not.exist;
  });

  it('renders when open', async () => {
    const el = await fixture<M3Snackbar>(html`<m3-snackbar open>Message</m3-snackbar>`);
    const snackbar = el.shadowRoot!.querySelector('.snackbar');
    expect(snackbar).to.exist;
    expect(snackbar!.getAttribute('role')).to.equal('status');
  });

  it('displays message property', async () => {
    const el = await fixture<M3Snackbar>(html`<m3-snackbar open message="Hello"></m3-snackbar>`);
    const msg = el.shadowRoot!.querySelector('.message');
    expect(msg!.textContent!.trim()).to.equal('Hello');
  });

  it('supports action slot', async () => {
    const el = await fixture<M3Snackbar>(html`
      <m3-snackbar open>
        Message
        <button slot="action">Undo</button>
      </m3-snackbar>
    `);
    const action = el.shadowRoot!.querySelector('.action');
    expect(action).to.exist;
    await settleSlotChange(el);
    expect(action!.hasAttribute('hidden')).to.be.false;
  });

  it('keeps an initially absent action region collapsed', async () => {
    const el = await fixture<M3Snackbar>(html`<m3-snackbar open>Message</m3-snackbar>`);
    expect(el.shadowRoot!.querySelector('.action')!.hasAttribute('hidden')).to.be.true;
  });

  it('reacts to action add, remove, reassignment, and reconnect', async () => {
    const el = await fixture<M3Snackbar>(html`<m3-snackbar open duration="0">Message</m3-snackbar>`);
    const action = document.createElement('button');
    action.slot = 'action';
    action.textContent = 'Undo';

    el.append(action);
    await settleSlotChange(el);
    expect(el.shadowRoot!.querySelector('.action')!.hasAttribute('hidden')).to.be.false;

    action.slot = '';
    await settleSlotChange(el);
    expect(el.shadowRoot!.querySelector('.action')!.hasAttribute('hidden')).to.be.true;

    el.remove();
    document.body.append(el);
    action.slot = 'action';
    await settleSlotChange(el);
    expect(el.shadowRoot!.querySelector('.action')!.hasAttribute('hidden')).to.be.false;

    action.remove();
    await settleSlotChange(el);
    expect(el.shadowRoot!.querySelector('.action')!.hasAttribute('hidden')).to.be.true;
    el.remove();
  });

  it('dispatches snackbar-dismiss on dismiss', async () => {
    const el = await fixture<M3Snackbar>(html`<m3-snackbar open duration="0">Test</m3-snackbar>`);
    let dismissed = false;
    el.addEventListener('snackbar-dismiss', () => { dismissed = true; });
    el.dismiss();
    // Wait for animation timeout
    await new Promise(resolve => setTimeout(resolve, 400));
    expect(dismissed).to.be.true;
    expect(el.open).to.be.false;
  });

  it('does not retain an exit delay when reduced motion is requested', async () => {
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () => ({ matches: true }),
    });

    try {
      const el = await fixture<M3Snackbar>(html`<m3-snackbar open duration="0">Test</m3-snackbar>`);
      el.dismiss();
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(el.open).to.be.false;
    } finally {
      Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        value: originalMatchMedia,
      });
    }
  });

  it('uses a consumer-overridden CSS duration for exit teardown', async () => {
    const el = await fixture<M3Snackbar>(html`<m3-snackbar open duration="0" style="--_animation-duration: 1ms">Test</m3-snackbar>`);
    el.dismiss();
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(el.open).to.be.false;
  });

  it('dispatches snackbar-action on action click', async () => {
    const el = await fixture<M3Snackbar>(html`
      <m3-snackbar open duration="0">
        Deleted
        <button slot="action">Undo</button>
      </m3-snackbar>
    `);
    let actionFired = false;
    el.addEventListener('snackbar-action', () => { actionFired = true; });
    const actionSlot = el.shadowRoot!.querySelector('.action')!;
    actionSlot.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, 400));
    expect(actionFired).to.be.true;
  });

  it('supports two-line mode', async () => {
    const el = await fixture<M3Snackbar>(html`<m3-snackbar open lines="2">Long message</m3-snackbar>`);
    expect(el.getAttribute('lines')).to.equal('2');
  });

  it('supports show() method', async () => {
    const el = await fixture<M3Snackbar>(html`<m3-snackbar>Message</m3-snackbar>`);
    el.show();
    await el.updateComplete;
    expect(el.open).to.be.true;
    expect(el.shadowRoot!.querySelector('.snackbar')).to.exist;
  });

  it('is accessible when open', async () => {
    const el = await fixture<M3Snackbar>(html`<m3-snackbar open>Accessible message</m3-snackbar>`);
    await new Promise(resolve => setTimeout(resolve, 450));
    await expect(el).to.be.accessible();
  });
});
