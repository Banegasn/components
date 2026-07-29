import { html, fixture, expect } from '@open-wc/testing';
import { describe, it } from 'vitest';
import './m3-button.js';
import type { M3Button } from './m3-button.js';

async function settleSlotChange(el: M3Button) {
  await new Promise((resolve) => setTimeout(resolve, 0));
  await el.updateComplete;
}

describe('M3Button icon slot', () => {
  it('collapses the icon region when initially absent', async () => {
    const el = await fixture<M3Button>(html`<m3-button>Save</m3-button>`);
    expect(el.shadowRoot!.querySelector('.icon')!.hasAttribute('hidden')).to.be
      .true;
  });

  it('shows initially assigned icon content', async () => {
    const el = await fixture<M3Button>(
      html`<m3-button><span slot="icon">+</span>Save</m3-button>`,
    );
    await settleSlotChange(el);
    expect(el.shadowRoot!.querySelector('.icon')!.hasAttribute('hidden')).to.be
      .false;
  });

  it('reacts to icon add, remove, reassignment, and reconnect', async () => {
    const el = await fixture<M3Button>(html`<m3-button>Save</m3-button>`);
    const icon = document.createElement('span');
    icon.slot = 'icon';
    icon.textContent = '+';

    el.append(icon);
    await settleSlotChange(el);
    expect(el.shadowRoot!.querySelector('.icon')!.hasAttribute('hidden')).to.be
      .false;

    icon.slot = '';
    await settleSlotChange(el);
    expect(el.shadowRoot!.querySelector('.icon')!.hasAttribute('hidden')).to.be
      .true;

    el.remove();
    document.body.append(el);
    icon.slot = 'icon';
    await settleSlotChange(el);
    expect(el.shadowRoot!.querySelector('.icon')!.hasAttribute('hidden')).to.be
      .false;

    icon.remove();
    await settleSlotChange(el);
    expect(el.shadowRoot!.querySelector('.icon')!.hasAttribute('hidden')).to.be
      .true;
    el.remove();
  });
});
