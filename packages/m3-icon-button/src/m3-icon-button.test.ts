import { html, fixture, expect } from '@open-wc/testing';
import './m3-icon-button.js';
import type { M3IconButton } from './m3-icon-button.js';

describe('M3IconButton', () => {
  it('renders a standard icon button by default', async () => {
    const el = await fixture<M3IconButton>(html`
      <m3-icon-button aria-label="Settings">
        <span class="material-symbols-outlined">settings</span>
      </m3-icon-button>
    `);
    const btn = el.shadowRoot!.querySelector('button');
    expect(btn).to.exist;
    expect(btn!.getAttribute('aria-label')).to.equal('Settings');
  });

  it('supports filled variant', async () => {
    const el = await fixture<M3IconButton>(html`
      <m3-icon-button variant="filled" aria-label="Add">
        <span>+</span>
      </m3-icon-button>
    `);
    expect(el.getAttribute('variant')).to.equal('filled');
  });

  it('supports tonal variant', async () => {
    const el = await fixture<M3IconButton>(html`
      <m3-icon-button variant="tonal" aria-label="Favorite">
        <span>★</span>
      </m3-icon-button>
    `);
    expect(el.getAttribute('variant')).to.equal('tonal');
  });

  it('supports outlined variant', async () => {
    const el = await fixture<M3IconButton>(html`
      <m3-icon-button variant="outlined" aria-label="Menu">
        <span>☰</span>
      </m3-icon-button>
    `);
    expect(el.getAttribute('variant')).to.equal('outlined');
  });

  it('reflects disabled state', async () => {
    const el = await fixture<M3IconButton>(html`
      <m3-icon-button disabled aria-label="Disabled">
        <span>X</span>
      </m3-icon-button>
    `);
    expect(el.hasAttribute('disabled')).to.be.true;
    const btn = el.shadowRoot!.querySelector('button');
    expect(btn!.hasAttribute('disabled')).to.be.true;
  });

  it('supports toggle behavior', async () => {
    const el = await fixture<M3IconButton>(html`
      <m3-icon-button toggle aria-label="Toggle">
        <span>♡</span>
      </m3-icon-button>
    `);
    expect(el.toggle).to.be.true;
    expect(el.selected).to.be.false;

    el.shadowRoot!.querySelector('button')!.click();
    await el.updateComplete;
    expect(el.selected).to.be.true;
  });

  it('dispatches icon-button-click on click', async () => {
    const el = await fixture<M3IconButton>(html`
      <m3-icon-button aria-label="Click">
        <span>▶</span>
      </m3-icon-button>
    `);
    let clicked = false;
    el.addEventListener('icon-button-click', () => { clicked = true; });
    el.shadowRoot!.querySelector('button')!.click();
    expect(clicked).to.be.true;
  });

  it('does not dispatch click when disabled', async () => {
    const el = await fixture<M3IconButton>(html`
      <m3-icon-button disabled aria-label="Disabled">
        <span>X</span>
      </m3-icon-button>
    `);
    let clicked = false;
    el.addEventListener('icon-button-click', () => { clicked = true; });
    el.shadowRoot!.querySelector('button')!.click();
    expect(clicked).to.be.false;
  });

  it('supports size variants', async () => {
    const small = await fixture<M3IconButton>(html`<m3-icon-button size="small" aria-label="S"><span>S</span></m3-icon-button>`);
    expect(small.getAttribute('size')).to.equal('small');

    const large = await fixture<M3IconButton>(html`<m3-icon-button size="large" aria-label="L"><span>L</span></m3-icon-button>`);
    expect(large.getAttribute('size')).to.equal('large');
  });

  it('is accessible', async () => {
    const el = await fixture<M3IconButton>(html`
      <m3-icon-button aria-label="Accessible">
        <span>A</span>
      </m3-icon-button>
    `);
    await expect(el).to.be.accessible();
  });
});
