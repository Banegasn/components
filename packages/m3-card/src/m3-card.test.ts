import { fixture, html, expect } from '@open-wc/testing';
import { describe, it } from 'vitest';
import './m3-card.js';
import type { M3Card } from './m3-card.js';

describe('M3Card tokens', () => {
  it('retains its standalone elevated surface fallback', async () => {
    const card = await fixture<M3Card>(html`<m3-card></m3-card>`);
    const surface = card.shadowRoot!.querySelector('.card')!;

    expect(getComputedStyle(surface).backgroundColor).to.equal('rgb(247, 242, 250)');
  });

  it('accepts the canonical component token', async () => {
    const card = await fixture<M3Card>(html`
      <m3-card style="--md-comp-card-container-color: rgb(1, 2, 3)"></m3-card>
    `);
    expect(getComputedStyle(card.shadowRoot!.querySelector('.card')!).backgroundColor).to.equal('rgb(1, 2, 3)');
  });
});
