import { html, fixture, expect } from '@open-wc/testing';
import { afterEach, describe, it } from 'vitest';
import darkTheme from '../../../tokens/generated/dark.css?raw';
import highContrastTheme from '../../../tokens/generated/high-contrast.css?raw';
import './m3-divider.js';
import type { M3Divider } from './m3-divider.js';

const themeStyleAttribute = 'data-divider-theme';

function applyTheme(theme: 'dark' | 'high-contrast', css: string) {
  const style = document.createElement('style');
  style.setAttribute(themeStyleAttribute, theme);
  style.textContent = css;
  document.head.append(style);
  document.documentElement.setAttribute('theme', theme);
}

afterEach(() => {
  document.head.querySelectorAll(`[${themeStyleAttribute}]`).forEach((style) => style.remove());
  document.documentElement.removeAttribute('theme');
  document.documentElement.style.removeProperty('--md-sys-color-outline-variant');
});

describe('M3Divider', () => {
  it('renders a horizontal full-width divider by default', async () => {
    const el = await fixture<M3Divider>(html`<m3-divider></m3-divider>`);
    
    const hr = el.shadowRoot!.querySelector('hr');
    expect(hr).to.exist;
    expect(hr!.getAttribute('role')).to.equal('separator');
    expect(hr!.getAttribute('aria-orientation')).to.equal('horizontal');
  });

  it('preserves standalone visual defaults without a shared theme', async () => {
    const el = await fixture<M3Divider>(html`<m3-divider></m3-divider>`);
    const hr = el.shadowRoot!.querySelector('hr')!;
    const style = getComputedStyle(hr);

    expect(style.backgroundColor).to.equal('rgb(202, 196, 208)');
    expect(style.animationDuration).to.equal('0.6s');
    expect(style.animationTimingFunction).to.equal('cubic-bezier(0.2, 0, 0, 1)');
  });

  it('accepts canonical component token overrides', async () => {
    const el = await fixture<M3Divider>(html`
      <m3-divider
        style="--md-comp-divider-color: rgb(1, 2, 3); --md-comp-divider-motion-duration: 1s"
      ></m3-divider>
    `);
    const style = getComputedStyle(el.shadowRoot!.querySelector('hr')!);

    expect(style.backgroundColor).to.equal('rgb(1, 2, 3)');
    expect(style.animationDuration).to.equal('1s');
  });

  it('uses the generated dark and high-contrast semantic outline values', async () => {
    applyTheme('dark', darkTheme);
    const dark = await fixture<M3Divider>(html`<m3-divider></m3-divider>`);
    expect(getComputedStyle(dark.shadowRoot!.querySelector('hr')!).backgroundColor).to.equal('rgb(31, 41, 55)');

    document.head.querySelector(`[${themeStyleAttribute}]`)?.remove();
    applyTheme('high-contrast', highContrastTheme);
    const highContrast = await fixture<M3Divider>(html`<m3-divider></m3-divider>`);
    expect(getComputedStyle(highContrast.shadowRoot!.querySelector('hr')!).backgroundColor).to.equal('rgb(0, 0, 0)');
  });

  it('honors a consumer semantic override after a generated theme loads', async () => {
    applyTheme('dark', darkTheme);
    document.documentElement.style.setProperty('--md-sys-color-outline-variant', 'rgb(7, 8, 9)');
    const el = await fixture<M3Divider>(html`<m3-divider></m3-divider>`);

    expect(getComputedStyle(el.shadowRoot!.querySelector('hr')!).backgroundColor).to.equal('rgb(7, 8, 9)');
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
