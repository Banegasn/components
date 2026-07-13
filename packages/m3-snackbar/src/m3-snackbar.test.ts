import { html, fixture, expect } from '@open-wc/testing';
import './m3-snackbar.js';
import type { M3Snackbar } from './m3-snackbar.js';

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
