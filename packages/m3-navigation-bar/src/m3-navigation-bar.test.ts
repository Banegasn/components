import { expect, fixture, html } from '@open-wc/testing';
import { describe, it } from 'vitest';
import {
  captureCustomEvents,
  settleLitElement,
} from '../../../test/lit-browser-contracts.js';
import './navigation-bar.js';
import './navigation-bar-item.js';
import type { M3NavigationBar } from './navigation-bar.js';
import type { M3NavigationBarItem } from './navigation-bar-item.js';

type ItemClickDetail = { label: string };

describe('M3NavigationBar browser contract', () => {
  it('exposes a labelled navigation landmark and propagates its layout to slotted items', async () => {
    const bar = await fixture<M3NavigationBar>(html`
      <m3-navigation-bar layout="horizontal">
        <m3-navigation-bar-item label="Home"></m3-navigation-bar-item>
        <m3-navigation-bar-item label="Search"></m3-navigation-bar-item>
      </m3-navigation-bar>
    `);
    await settleLitElement(bar);

    const navigation = bar.shadowRoot!.querySelector('nav')!;
    const items = [
      ...bar.querySelectorAll<M3NavigationBarItem>('m3-navigation-bar-item'),
    ];
    expect(navigation.getAttribute('role')).to.equal('navigation');
    expect(navigation.getAttribute('aria-label')).to.equal('Main navigation');
    expect(items.map((item) => item.layout)).to.deep.equal([
      'horizontal',
      'horizontal',
    ]);
    expect(bar).to.be.accessible();
  });

  it('emits one composed item-click payload from a nested item', async () => {
    const bar = await fixture<M3NavigationBar>(html`
      <m3-navigation-bar>
        <m3-navigation-bar-item label="Inbox"></m3-navigation-bar-item>
      </m3-navigation-bar>
    `);
    const events = captureCustomEvents<ItemClickDetail>(bar, 'item-click');

    try {
      bar
        .querySelector<M3NavigationBarItem>('m3-navigation-bar-item')!
        .shadowRoot!.querySelector<HTMLButtonElement>('button')!
        .click();

      expect(events.events).to.have.length(1);
      expect(events.events[0]!.detail).to.deep.equal({ label: 'Inbox' });
      expect(events.events[0]!.bubbles).to.equal(true);
      expect(events.events[0]!.composed).to.equal(true);
    } finally {
      events.dispose();
    }
  });

  it('renders active compact and large badges while retaining the fallback item label', async () => {
    const root = await fixture<HTMLDivElement>(html`
      <div>
        <m3-navigation-bar-item
          label="Inbox"
          badge="3"
          active
        ></m3-navigation-bar-item>
        <m3-navigation-bar-item
          label="Updates"
          largeBadge="New"
        ></m3-navigation-bar-item>
        <m3-navigation-bar-item></m3-navigation-bar-item>
      </div>
    `);
    const [inbox, updates, unnamed] = [
      ...root.querySelectorAll<M3NavigationBarItem>('m3-navigation-bar-item'),
    ];

    expect(
      inbox.shadowRoot!.querySelector('button')!.classList.contains('active'),
    ).to.equal(true);
    expect(inbox.shadowRoot!.querySelector('.badge')!.textContent).to.equal(
      '3',
    );
    expect(
      updates.shadowRoot!.querySelector('.badge-large')!.textContent,
    ).to.equal('New');
    expect(
      updates.shadowRoot!.querySelector('.badge-large-label')!.textContent,
    ).to.equal('New');
    expect(
      unnamed.shadowRoot!.querySelector('button')!.getAttribute('aria-label'),
    ).to.equal('Navigation item');
  });

  it('updates auto-layout on resize, removes the resize listener while detached, and restores it on reconnect', async () => {
    const ownWidth = Object.getOwnPropertyDescriptor(window, 'innerWidth');
    const setWidth = (width: number) =>
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        value: width,
      });
    setWidth(480);

    try {
      const container = await fixture<HTMLDivElement>(html`
        <div>
          <m3-navigation-bar auto-layout>
            <m3-navigation-bar-item label="Home"></m3-navigation-bar-item>
          </m3-navigation-bar>
        </div>
      `);
      const bar =
        container.querySelector<M3NavigationBar>('m3-navigation-bar')!;
      const item = bar.querySelector<M3NavigationBarItem>(
        'm3-navigation-bar-item',
      )!;
      await settleLitElement(bar);
      expect(item.layout).to.equal('vertical');

      setWidth(800);
      window.dispatchEvent(new Event('resize'));
      await settleLitElement(bar);
      expect(item.layout).to.equal('horizontal');

      bar.remove();
      setWidth(480);
      window.dispatchEvent(new Event('resize'));
      await settleLitElement(item);
      expect(item.layout).to.equal('horizontal');

      container.append(bar);
      await settleLitElement(bar);
      expect(item.layout).to.equal('vertical');
    } finally {
      if (ownWidth) {
        Object.defineProperty(window, 'innerWidth', ownWidth);
      } else {
        delete (window as { innerWidth?: number }).innerWidth;
      }
    }
  });
});
