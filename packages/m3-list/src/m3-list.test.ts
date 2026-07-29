import { html, fixture, expect } from '@open-wc/testing';
import { describe, it } from 'vitest';
import { expectVisibleNameWithoutOptionalAttributes } from '../../../test/semantic-attributes.js';
import './m3-list.js';
import './m3-list-item.js';
import type { M3List } from './m3-list.js';
import type { M3ListItem } from './m3-list-item.js';

async function settleSlotChange(el: M3ListItem) {
  await new Promise((resolve) => setTimeout(resolve, 0));
  await el.updateComplete;
}

describe('M3List', () => {
  it('renders a list container', async () => {
    const el = await fixture<M3List>(html`<m3-list></m3-list>`);
    const ul = el.shadowRoot!.querySelector('ul');
    expect(ul).to.exist;
    expect(ul!.getAttribute('role')).to.equal('list');
  });

  it('supports staggered attribute', async () => {
    const el = await fixture<M3List>(html`<m3-list staggered></m3-list>`);
    expect(el.hasAttribute('staggered')).to.be.true;
  });

  it('projects list items into the slot', async () => {
    const el = await fixture<M3List>(html`
      <m3-list>
        <m3-list-item>Item 1</m3-list-item>
        <m3-list-item>Item 2</m3-list-item>
      </m3-list>
    `);
    const items = el.querySelectorAll('m3-list-item');
    expect(items.length).to.equal(2);
  });
});

describe('M3ListItem', () => {
  it('renders a single-line item by default', async () => {
    const el = await fixture<M3ListItem>(
      html`<m3-list-item>Headline</m3-list-item>`,
    );
    const li = el.shadowRoot!.querySelector('li');
    expect(li).to.exist;
    expect(li!.getAttribute('role')).to.equal('listitem');
    expect(li!.getAttribute('tabindex')).to.equal('0');
  });

  it('supports two-line layout', async () => {
    const el = await fixture<M3ListItem>(html`
      <m3-list-item lines="2">
        Headline
        <span slot="supporting-text">Supporting text</span>
      </m3-list-item>
    `);
    expect(el.getAttribute('lines')).to.equal('2');
  });

  it('supports three-line layout', async () => {
    const el = await fixture<M3ListItem>(html`
      <m3-list-item lines="3">
        Headline
        <span slot="supporting-text">Supporting text</span>
        <span slot="tertiary-text">Tertiary text</span>
      </m3-list-item>
    `);
    expect(el.getAttribute('lines')).to.equal('3');
  });

  it('reflects selected state', async () => {
    const el = await fixture<M3ListItem>(
      html`<m3-list-item selected>Selected</m3-list-item>`,
    );
    expect(el.hasAttribute('selected')).to.be.true;
    const li = el.shadowRoot!.querySelector('li');
    expect(li!.getAttribute('aria-selected')).to.equal('true');
  });

  it('reflects disabled state', async () => {
    const el = await fixture<M3ListItem>(
      html`<m3-list-item disabled>Disabled</m3-list-item>`,
    );
    expect(el.hasAttribute('disabled')).to.be.true;
    const li = el.shadowRoot!.querySelector('li');
    expect(li!.getAttribute('aria-disabled')).to.equal('true');
    expect(li!.getAttribute('tabindex')).to.equal('-1');
  });

  it('supports leading slot', async () => {
    const el = await fixture<M3ListItem>(html`
      <m3-list-item>
        <span slot="leading">Icon</span>
        Headline
      </m3-list-item>
    `);
    const leading = el.shadowRoot!.querySelector('.leading');
    expect(leading).to.exist;
    expect(leading!.hasAttribute('hidden')).to.be.false;
  });

  it('supports trailing slot', async () => {
    const el = await fixture<M3ListItem>(html`
      <m3-list-item>
        Headline
        <span slot="trailing">Action</span>
      </m3-list-item>
    `);
    const trailing = el.shadowRoot!.querySelector('.trailing');
    expect(trailing).to.exist;
    expect(trailing!.hasAttribute('hidden')).to.be.false;
  });

  it('keeps initially absent optional regions collapsed', async () => {
    const el = await fixture<M3ListItem>(html`<m3-list-item>Headline</m3-list-item>`);
    for (const selector of ['.leading', '.supporting-text', '.tertiary-text', '.trailing']) {
      expect(el.shadowRoot!.querySelector(selector)!.hasAttribute('hidden')).to.be.true;
    }
  });

  it('reacts to optional content add, remove, reassignment, and reconnect', async () => {
    const el = await fixture<M3ListItem>(html`<m3-list-item>Headline</m3-list-item>`);
    const content = document.createElement('span');
    content.slot = 'leading';
    content.textContent = 'Icon';

    el.append(content);
    await settleSlotChange(el);
    expect(el.shadowRoot!.querySelector('.leading')!.hasAttribute('hidden')).to.be.false;

    content.slot = 'trailing';
    await settleSlotChange(el);
    expect(el.shadowRoot!.querySelector('.leading')!.hasAttribute('hidden')).to.be.true;
    expect(el.shadowRoot!.querySelector('.trailing')!.hasAttribute('hidden')).to.be.false;

    content.slot = 'supporting-text';
    await settleSlotChange(el);
    expect(el.shadowRoot!.querySelector('.trailing')!.hasAttribute('hidden')).to.be.true;
    expect(el.shadowRoot!.querySelector('.supporting-text')!.hasAttribute('hidden')).to.be.false;

    el.remove();
    document.body.append(el);
    content.remove();
    await settleSlotChange(el);
    expect(el.shadowRoot!.querySelector('.supporting-text')!.hasAttribute('hidden')).to.be.true;
    el.remove();
  });

  it('supports shape variants', async () => {
    const el = await fixture<M3ListItem>(
      html`<m3-list-item shape="rounded">Rounded</m3-list-item>`,
    );
    expect(el.getAttribute('shape')).to.equal('rounded');
  });

  it('dispatches item-click on click', async () => {
    const el = await fixture<M3ListItem>(
      html`<m3-list-item>Clickable</m3-list-item>`,
    );
    let clicked = false;
    el.addEventListener('item-click', () => {
      clicked = true;
    });
    el.shadowRoot!.querySelector('li')!.click();
    expect(clicked).to.be.true;
  });

  it('does not dispatch click when disabled', async () => {
    const el = await fixture<M3ListItem>(
      html`<m3-list-item disabled>Disabled</m3-list-item>`,
    );
    let clicked = false;
    el.addEventListener('item-click', () => {
      clicked = true;
    });
    el.shadowRoot!.querySelector('li')!.click();
    expect(clicked).to.be.false;
  });

  it('responds to Enter key', async () => {
    const el = await fixture<M3ListItem>(
      html`<m3-list-item>Keyboard</m3-list-item>`,
    );
    let clicked = false;
    el.addEventListener('item-click', () => {
      clicked = true;
    });
    const li = el.shadowRoot!.querySelector('li')!;
    li.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    expect(clicked).to.be.true;
  });

  it('is accessible', async () => {
    const el = await fixture<M3List>(html`
      <m3-list>
        <m3-list-item>Accessible</m3-list-item>
      </m3-list>
    `);
    await expect(el).to.be.accessible();
  });

  it('keeps the visible item label usable when aria-label is unset', async () => {
    const list = await fixture<M3List>(html`
      <m3-list><m3-list-item>Inbox</m3-list-item></m3-list>
    `);
    const el = list.querySelector<M3ListItem>('m3-list-item')!;
    await el.updateComplete;
    const item = el.shadowRoot!.querySelector<HTMLElement>('li')!;

    await expectVisibleNameWithoutOptionalAttributes(item, ['aria-label']);
  });
});
