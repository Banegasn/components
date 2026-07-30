import { fixture, html, expect } from '@open-wc/testing';
import { userEvent } from 'vitest/browser';
import { describe, it } from 'vitest';
import './m3-menu.js';
import type { M3Menu } from './m3-menu.js';

const keydown = (element: Element, key: string) =>
  element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, composed: true }));

describe('M3Menu public interaction contract', () => {
  it('keeps public open state and rendered visibility in sync while reporting changes', async () => {
    const el = await fixture<M3Menu>(html`<m3-menu><m3-menu-item>One</m3-menu-item></m3-menu>`);
    const changes: Array<{ open: boolean; reason: string }> = [];
    el.addEventListener('menu-open-change', (event) => changes.push((event as CustomEvent).detail));

    el.show('trigger');
    await el.updateComplete;
    expect(el.open).to.be.true;
    expect(el.shadowRoot!.querySelector<HTMLElement>('.surface')!.hidden).to.be.false;
    expect(changes).to.deep.equal([{ open: true, reason: 'trigger' }]);

    el.dismiss('escape');
    await el.updateComplete;
    expect(el.open).to.be.false;
    expect(el.shadowRoot!.querySelector<HTMLElement>('.surface')!.hidden).to.be.true;
    expect(changes[1]).to.deep.equal({ open: false, reason: 'escape' });
  });

  it('handles keyboard navigation and Escape focus return', async () => {
    const trigger = await fixture<HTMLButtonElement>(html`<button>Open</button>`);
    const el = await fixture<M3Menu>(html`
      <m3-menu>
        <m3-menu-item>First</m3-menu-item>
        <m3-menu-item disabled>Disabled</m3-menu-item>
        <m3-menu-item>Last</m3-menu-item>
      </m3-menu>
    `);
    trigger.focus();
    el.show('trigger');
    await el.updateComplete;
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));
    const surface = el.shadowRoot!.querySelector<HTMLElement>('.surface')!;
    keydown(surface, 'End');
    expect((el.querySelectorAll('m3-menu-item')[2] as HTMLElement).shadowRoot!.activeElement).to.exist;

    keydown(surface, 'Escape');
    await el.updateComplete;
    expect(document.activeElement).to.equal(trigger);

  });

  it('can preserve focus when a menu opens programmatically for pointer interaction', async () => {
    const trigger = await fixture<HTMLButtonElement>(html`<button>Open</button>`);
    const el = await fixture<M3Menu>(html`<m3-menu><m3-menu-item>First</m3-menu-item></m3-menu>`);
    trigger.focus();

    el.focusOnOpen = false;
    el.open = true;
    await el.updateComplete;
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    expect(document.activeElement).to.equal(trigger);
  });

  it('dismisses on a real Tab key and moves focus to the next control', async () => {
    const container = await fixture<HTMLDivElement>(html`
      <div>
        <button id="trigger">Open</button>
        <m3-menu><m3-menu-item>First</m3-menu-item></m3-menu>
        <button id="after">After menu</button>
      </div>
    `);
    const trigger = container.querySelector<HTMLButtonElement>('#trigger')!;
    const after = container.querySelector<HTMLButtonElement>('#after')!;
    const el = container.querySelector<M3Menu>('m3-menu')!;
    el.show('trigger', trigger);
    await el.updateComplete;
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));
    expect((el.querySelector('m3-menu-item') as HTMLElement).shadowRoot!.activeElement).to.exist;

    await userEvent.keyboard('{Tab}');

    expect(el.open).to.be.false;
    expect(el.shadowRoot!.querySelector<HTMLElement>('.surface')!.hidden).to.be.true;
    expect(document.activeElement).to.equal(after);
  });

  it('dismisses on outside press, preserves nested menu targets, and supports multiple menus', async () => {
    const first = await fixture<M3Menu>(html`<m3-menu open><m3-menu-item><span>Nested</span></m3-menu-item></m3-menu>`);
    const second = await fixture<M3Menu>(html`<m3-menu open><m3-menu-item>Second</m3-menu-item></m3-menu>`);
    await first.updateComplete;
    await second.updateComplete;

    const nested = first.querySelector('span')!;
    nested.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }));
    await first.updateComplete;
    expect(first.open).to.be.true;

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }));
    await first.updateComplete;
    await second.updateComplete;
    expect(first.open).to.be.false;
    expect(second.open).to.be.false;
  });

  it('only exempts its defined opener, not siblings or a menu mounted on body', async () => {
    const container = await fixture<HTMLDivElement>(html`
      <div>
        <button id="opener">Open</button>
        <button id="sibling">Sibling control</button>
        <m3-menu><m3-menu-item>Item</m3-menu-item></m3-menu>
      </div>
    `);
    const opener = container.querySelector<HTMLButtonElement>('#opener')!;
    const sibling = container.querySelector<HTMLButtonElement>('#sibling')!;
    const el = container.querySelector<M3Menu>('m3-menu')!;
    el.show('trigger', opener);
    await el.updateComplete;

    await userEvent.click(opener);
    expect(el.open).to.be.true;

    await userEvent.click(sibling);
    await el.updateComplete;
    expect(el.open).to.be.false;

    const bodyMenu = document.createElement('m3-menu') as M3Menu;
    bodyMenu.innerHTML = '<m3-menu-item>Body menu item</m3-menu-item>';
    document.body.append(bodyMenu);
    try {
      bodyMenu.open = true;
      await bodyMenu.updateComplete;
      await userEvent.click(document.body);
      await bodyMenu.updateComplete;
      expect(bodyMenu.open).to.be.false;
    } finally {
      bodyMenu.remove();
    }
  });
});
