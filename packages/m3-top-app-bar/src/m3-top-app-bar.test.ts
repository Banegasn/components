import { html, fixture, expect } from '@open-wc/testing';
import { describe, it } from 'vitest';
import './m3-top-app-bar.js';
import type { M3TopAppBar } from './m3-top-app-bar.js';

async function settleSlotChange(el: M3TopAppBar) {
  await new Promise((resolve) => setTimeout(resolve, 0));
  await el.updateComplete;
}

describe('M3TopAppBar', () => {
  it('renders a small top app bar by default', async () => {
    const el = await fixture<M3TopAppBar>(html`<m3-top-app-bar>Title</m3-top-app-bar>`);
    const header = el.shadowRoot!.querySelector('header');
    expect(header).to.exist;
    expect(el.getAttribute('variant')).to.equal('small');
  });

  it('supports headline property', async () => {
    const el = await fixture<M3TopAppBar>(html`<m3-top-app-bar headline="My App"></m3-top-app-bar>`);
    const headline = el.shadowRoot!.querySelector('h1');
    expect(headline!.textContent!.trim()).to.equal('My App');
  });

  it('supports center-aligned variant', async () => {
    const el = await fixture<M3TopAppBar>(html`<m3-top-app-bar variant="center-aligned">Center</m3-top-app-bar>`);
    expect(el.getAttribute('variant')).to.equal('center-aligned');
  });

  it('supports medium variant', async () => {
    const el = await fixture<M3TopAppBar>(html`<m3-top-app-bar variant="medium">Medium</m3-top-app-bar>`);
    expect(el.getAttribute('variant')).to.equal('medium');
  });

  it('supports large variant', async () => {
    const el = await fixture<M3TopAppBar>(html`<m3-top-app-bar variant="large">Large</m3-top-app-bar>`);
    expect(el.getAttribute('variant')).to.equal('large');
  });

  it('supports elevated attribute', async () => {
    const el = await fixture<M3TopAppBar>(html`<m3-top-app-bar elevated>Title</m3-top-app-bar>`);
    expect(el.hasAttribute('elevated')).to.be.true;
  });

  it('supports navigation-icon slot', async () => {
    const el = await fixture<M3TopAppBar>(html`
      <m3-top-app-bar>
        <span slot="navigation-icon">Nav</span>
        Title
      </m3-top-app-bar>
    `);
    const nav = el.shadowRoot!.querySelector('.navigation-icon');
    expect(nav).to.exist;
    await settleSlotChange(el);
    expect(nav!.hasAttribute('hidden')).to.be.false;
  });

  it('supports actions slot', async () => {
    const el = await fixture<M3TopAppBar>(html`
      <m3-top-app-bar>
        Title
        <span slot="actions">Action</span>
      </m3-top-app-bar>
    `);
    const actions = el.shadowRoot!.querySelector('.actions');
    expect(actions).to.exist;
    await settleSlotChange(el);
    expect(actions!.hasAttribute('hidden')).to.be.false;
  });

  it('keeps initially absent navigation and action regions collapsed', async () => {
    const el = await fixture<M3TopAppBar>(html`<m3-top-app-bar>Title</m3-top-app-bar>`);
    expect(el.shadowRoot!.querySelector('.navigation-icon')!.hasAttribute('hidden')).to.be.true;
    expect(el.shadowRoot!.querySelector('.actions')!.hasAttribute('hidden')).to.be.true;
  });

  it('reacts to navigation and action add, remove, reassignment, and reconnect', async () => {
    const el = await fixture<M3TopAppBar>(html`<m3-top-app-bar>Title</m3-top-app-bar>`);
    const control = document.createElement('button');
    control.slot = 'navigation-icon';
    control.textContent = 'Menu';

    el.append(control);
    await settleSlotChange(el);
    expect(el.shadowRoot!.querySelector('.navigation-icon')!.hasAttribute('hidden')).to.be.false;

    control.slot = 'actions';
    await settleSlotChange(el);
    expect(el.shadowRoot!.querySelector('.navigation-icon')!.hasAttribute('hidden')).to.be.true;
    expect(el.shadowRoot!.querySelector('.actions')!.hasAttribute('hidden')).to.be.false;

    el.remove();
    document.body.append(el);
    control.remove();
    await settleSlotChange(el);
    expect(el.shadowRoot!.querySelector('.actions')!.hasAttribute('hidden')).to.be.true;
    el.remove();
  });

  it('is accessible', async () => {
    const el = await fixture<M3TopAppBar>(html`<m3-top-app-bar>Accessible</m3-top-app-bar>`);
    await expect(el).to.be.accessible();
  });
});
