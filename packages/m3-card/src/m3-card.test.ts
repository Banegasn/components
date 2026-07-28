import { fixture, html, expect } from '@open-wc/testing';
import { describe, it } from 'vitest';
import './m3-card.js';
import type { M3Card } from './m3-card.js';

describe('M3Card token compatibility', () => {
  it('retains its standalone elevated surface fallback', async () => {
    const card = await fixture<M3Card>(html`<m3-card></m3-card>`);
    const surface = card.shadowRoot!.querySelector('.card')!;

    expect(getComputedStyle(surface).backgroundColor).to.equal('rgb(247, 242, 250)');
  });

  it('prefers the canonical component token and still accepts the legacy hook', async () => {
    const canonical = await fixture<M3Card>(html`
      <m3-card style="--md-comp-card-container-color: rgb(1, 2, 3)"></m3-card>
    `);
    const legacy = await fixture<M3Card>(html`
      <m3-card style="--md-card-container-color: rgb(4, 5, 6)"></m3-card>
    `);

    expect(getComputedStyle(canonical.shadowRoot!.querySelector('.card')!).backgroundColor).to.equal('rgb(1, 2, 3)');
    expect(getComputedStyle(legacy.shadowRoot!.querySelector('.card')!).backgroundColor).to.equal('rgb(4, 5, 6)');
  });
});
