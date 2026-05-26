import { html, fixture, expect } from '@open-wc/testing';
import './m3-divider.js';
import type { M3Divider } from './m3-divider.js';

describe('M3Divider', () => {
  it('renders a horizontal full-width divider by default', async () => {
    const el = await fixture<M3Divider>(html`<m3-divider></m3-divider>`);
    
    const hr = el.shadowRoot!.querySelector('hr');
    expect(hr).to.exist;
    expect(hr!.getAttribute('role')).to.equal('separator');
    expect(hr!.getAttribute('aria-orientation')).to.equal('horizontal');
  });

  it('reflects variant="inset"', async () => {
    const el = await fixture<M3Divider>(html`<m3-divider variant="inset"></m3-divider>`);
    
    expect(el.getAttribute('variant')).to.equal('inset');
    const hr = el.shadowRoot!.querySelector('hr');
    expect(hr).to.exist;
  });

  it('reflects variant="middle"', async () => {
    const el = await fixture<M3Divider>(html`<m3-divider variant="middle"></m3-divider>`);
    
    expect(el.getAttribute('variant')).to.equal('middle');
  });

  it('supports vertical orientation', async () => {
    const el = await fixture<M3Divider>(html`<m3-divider orientation="vertical"></m3-divider>`);
    
    expect(el.getAttribute('orientation')).to.equal('vertical');
    const hr = el.shadowRoot!.querySelector('hr');
    expect(hr!.getAttribute('aria-orientation')).to.equal('vertical');
  });

  it('supports thickness attribute', async () => {
    const el = await fixture<M3Divider>(html`<m3-divider thickness="2"></m3-divider>`);
    
    expect(el.getAttribute('thickness')).to.equal('2');
  });

  it('supports pulsing attribute', async () => {
    const el = await fixture<M3Divider>(html`<m3-divider pulsing></m3-divider>`);
    
    expect(el.hasAttribute('pulsing')).to.be.true;
  });

  it('supports no-animation attribute', async () => {
    const el = await fixture<M3Divider>(html`<m3-divider no-animation></m3-divider>`);
    
    expect(el.hasAttribute('no-animation')).to.be.true;
  });

  it('updates aria-orientation when orientation changes', async () => {
    const el = await fixture<M3Divider>(html`<m3-divider></m3-divider>`);
    
    el.orientation = 'vertical';
    await el.updateComplete;
    
    const hr = el.shadowRoot!.querySelector('hr');
    expect(hr!.getAttribute('aria-orientation')).to.equal('vertical');
  });

  it('is accessible with proper ARIA attributes', async () => {
    const el = await fixture<M3Divider>(html`<m3-divider></m3-divider>`);
    
    await expect(el).to.be.accessible();
  });
});
