import { fixture, html, expect } from '@open-wc/testing';
import { afterEach, describe, it } from 'vitest';
import lightTheme from '../../../tokens/generated/light.css?raw';
import './m3-progress.js';
import type { M3Progress } from './m3-progress.js';

const themeAttribute = 'data-progress-motion-theme';

afterEach(() => {
  document.head
    .querySelectorAll(`[${themeAttribute}]`)
    .forEach((style) => style.remove());
  document.documentElement.removeAttribute('data-motion');
});

describe('M3Progress reduced motion', () => {
  it('uses the generated verification mode to freeze indeterminate progress at a meaningful start', async () => {
    const style = document.createElement('style');
    style.setAttribute(themeAttribute, 'light');
    style.textContent = lightTheme;
    document.head.append(style);
    document.documentElement.setAttribute('data-motion', 'reduced');

    const el = await fixture<M3Progress>(
      html`<m3-progress indeterminate></m3-progress>`,
    );
    const indicator = el.shadowRoot!.querySelector('.indicator')!;
    const computed = getComputedStyle(indicator);

    expect(computed.animationPlayState).to.equal('paused');
    expect(
      computed.getPropertyValue('--md-sys-motion-progress-start').trim(),
    ).to.equal('25%');
  });
});

describe('M3Progress semantics', () => {
  it('keeps an unnamed indicator out of the accessibility tree', async () => {
    const el = await fixture<M3Progress>(
      html`<m3-progress value="0.4"></m3-progress>`,
    );
    const track = el.shadowRoot!.querySelector<HTMLElement>('.track')!;

    expect(track.getAttribute('aria-hidden')).to.equal('true');
    expect(track.hasAttribute('role')).to.be.false;
    expect(track.hasAttribute('aria-valuenow')).to.be.false;
    expect(track.hasAttribute('aria-label')).to.be.false;
  });

  it('exposes named determinate progress with its value', async () => {
    const el = await fixture<M3Progress>(
      html`<m3-progress
        value="0.4"
        aria-label="Upload progress"
      ></m3-progress>`,
    );
    const track = el.shadowRoot!.querySelector<HTMLElement>('.track')!;

    expect(track.getAttribute('role')).to.equal('progressbar');
    expect(track.getAttribute('aria-label')).to.equal('Upload progress');
    expect(track.getAttribute('aria-valuenow')).to.equal('40');
  });

  it('omits aria-valuenow for named indeterminate progress', async () => {
    const el = await fixture<M3Progress>(
      html`<m3-progress
        indeterminate
        aria-label="Loading results"
      ></m3-progress>`,
    );
    const track = el.shadowRoot!.querySelector<HTMLElement>('.track')!;

    expect(track.getAttribute('role')).to.equal('progressbar');
    expect(track.hasAttribute('aria-valuenow')).to.be.false;
  });
});
