import { html, fixture, expect } from '@open-wc/testing';
import { describe, it } from 'vitest';
import { expectVisibleNameWithoutOptionalAttributes } from '../../../test/semantic-attributes.js';
import './m3-chip.js';
import type { M3Chip } from './m3-chip.js';

async function settleSlotChange(el: M3Chip) {
  await new Promise((resolve) => setTimeout(resolve, 0));
  await el.updateComplete;
}

describe('M3Chip icon slot', () => {
  it('collapses the icon region when initially absent', async () => {
    const el = await fixture<M3Chip>(html`<m3-chip>Tag</m3-chip>`);
    expect(
      el.shadowRoot!.querySelector('.leading-icon')!.hasAttribute('hidden'),
    ).to.be.true;
  });

  it('shows initially assigned icon content', async () => {
    const el = await fixture<M3Chip>(
      html`<m3-chip><span slot="icon">#</span>Tag</m3-chip>`,
    );
    await settleSlotChange(el);
    expect(
      el.shadowRoot!.querySelector('.leading-icon')!.hasAttribute('hidden'),
    ).to.be.false;
  });

  it('reacts to icon add, remove, reassignment, and reconnect', async () => {
    const el = await fixture<M3Chip>(html`<m3-chip>Tag</m3-chip>`);
    const icon = document.createElement('span');
    icon.slot = 'icon';
    icon.textContent = '#';

    el.append(icon);
    await settleSlotChange(el);
    expect(
      el.shadowRoot!.querySelector('.leading-icon')!.hasAttribute('hidden'),
    ).to.be.false;

    icon.slot = '';
    await settleSlotChange(el);
    expect(
      el.shadowRoot!.querySelector('.leading-icon')!.hasAttribute('hidden'),
    ).to.be.true;

    el.remove();
    document.body.append(el);
    icon.slot = 'icon';
    await settleSlotChange(el);
    expect(
      el.shadowRoot!.querySelector('.leading-icon')!.hasAttribute('hidden'),
    ).to.be.false;

    icon.remove();
    await settleSlotChange(el);
    expect(
      el.shadowRoot!.querySelector('.leading-icon')!.hasAttribute('hidden'),
    ).to.be.true;
    el.remove();
  });
});

describe('M3Chip semantic attributes', () => {
  it('keeps its slotted label as the browser-accessible name when aria-label is unset', async () => {
    const element = await fixture<M3Chip>(html`<m3-chip>Priority</m3-chip>`);
    const button =
      element.shadowRoot!.querySelector<HTMLButtonElement>('button')!;

    await expectVisibleNameWithoutOptionalAttributes(button, [
      'aria-label',
      'aria-selected',
    ]);
  });
});
