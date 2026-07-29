import { fixture, html, expect } from '@open-wc/testing';
import { describe, it } from 'vitest';
import { expectVisibleNameWithoutOptionalAttributes } from '../../../test/semantic-attributes.js';
import './m3-card.js';
import type { M3Card } from './m3-card.js';

describe('M3Card tokens', () => {
  it('retains its standalone elevated surface fallback', async () => {
    const card = await fixture<M3Card>(html`<m3-card></m3-card>`);
    const surface = card.shadowRoot!.querySelector('.card')!;

    expect(getComputedStyle(surface).backgroundColor).to.equal(
      'rgb(247, 242, 250)',
    );
  });

  it('accepts the canonical component token', async () => {
    const card = await fixture<M3Card>(html`
      <m3-card style="--md-comp-card-container-color: rgb(1, 2, 3)"></m3-card>
    `);
    expect(
      getComputedStyle(card.shadowRoot!.querySelector('.card')!)
        .backgroundColor,
    ).to.equal('rgb(1, 2, 3)');
  });
});

describe('M3Card semantic attributes', () => {
  it("keeps a clickable card's slotted text as its browser-accessible name", async () => {
    const card = await fixture<M3Card>(
      html`<m3-card clickable>Project overview</m3-card>`,
    );
    const surface = card.shadowRoot!.querySelector<HTMLElement>('.card')!;

    await expectVisibleNameWithoutOptionalAttributes(surface, ['aria-label']);
  });

  it('omits optional role and tabindex from a static card', async () => {
    const card = await fixture<M3Card>(
      html`<m3-card>Project overview</m3-card>`,
    );
    const surface = card.shadowRoot!.querySelector<HTMLElement>('.card')!;

    await expectVisibleNameWithoutOptionalAttributes(surface, [
      'role',
      'tabindex',
      'aria-label',
    ]);
  });
});
