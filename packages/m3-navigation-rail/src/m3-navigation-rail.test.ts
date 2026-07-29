import { expect, fixture, html } from '@open-wc/testing';
import { describe, it } from 'vitest';
import {
  captureCustomEvents,
  settleLitElement,
} from '../../../test/lit-browser-contracts.js';
import './navigation-rail.js';
import './navigation-rail-item.js';
import './navigation-rail-toggle.js';
import type { M3NavigationRail } from './navigation-rail.js';
import type { M3NavigationRailItem } from './navigation-rail-item.js';
import type { M3NavigationRailToggle } from './navigation-rail-toggle.js';

type MenuToggleDetail = { expanded: boolean };
type ItemClickDetail = { label: string };

describe('M3NavigationRail browser contract', () => {
  it('propagates a toggle state to every item and reports the new state once', async () => {
    const rail = await fixture<M3NavigationRail>(html`
      <m3-navigation-rail>
        <m3-navigation-rail-toggle></m3-navigation-rail-toggle>
        <m3-navigation-rail-item label="Home"></m3-navigation-rail-item>
        <m3-navigation-rail-item
          slot="bottom"
          label="Settings"
        ></m3-navigation-rail-item>
      </m3-navigation-rail>
    `);
    const events = captureCustomEvents<MenuToggleDetail>(rail, 'menu-toggle');

    try {
      const toggle = rail.querySelector<M3NavigationRailToggle>(
        'm3-navigation-rail-toggle',
      )!;
      const toggleEvents = captureCustomEvents<undefined>(
        toggle,
        'toggle-click',
      );
      const items = [
        ...rail.querySelectorAll<M3NavigationRailItem>(
          'm3-navigation-rail-item',
        ),
      ];
      try {
        toggle.shadowRoot!.querySelector<HTMLButtonElement>('button')!.click();
        await settleLitElement(rail);

        expect(rail.expanded).to.equal(true);
        expect(toggle.expanded).to.equal(true);
        expect(items.map((item) => item.expanded)).to.deep.equal([true, true]);
        expect(events.events).to.have.length(1);
        expect(events.events[0]!.detail).to.deep.equal({ expanded: true });
        expect(events.events[0]!.bubbles).to.equal(true);
        expect(events.events[0]!.composed).to.equal(true);
        expect(events.events[0]!.cancelable).to.equal(false);
        expect(toggleEvents.events).to.have.length(1);
        expect(toggleEvents.events[0]!.bubbles).to.equal(true);
        expect(toggleEvents.events[0]!.composed).to.equal(true);
        expect(toggleEvents.events[0]!.cancelable).to.equal(false);
      } finally {
        toggleEvents.dispose();
      }
    } finally {
      events.dispose();
    }
  });

  it('renders assigned bottom navigation separately after the slot settles', async () => {
    const rail = await fixture<M3NavigationRail>(html`
      <m3-navigation-rail>
        <m3-navigation-rail-item label="Home"></m3-navigation-rail-item>
        <m3-navigation-rail-item
          slot="bottom"
          label="Settings"
        ></m3-navigation-rail-item>
      </m3-navigation-rail>
    `);
    await settleLitElement(rail);

    const bottom = rail.shadowRoot!.querySelector('.bottom-items');
    expect(bottom).to.exist;
    expect(bottom!.querySelector('slot')!.name).to.equal('bottom');
    expect(rail).to.be.accessible();
  });

  it('keeps item badges in the documented location and bubbles their click details', async () => {
    const rail = await fixture<M3NavigationRail>(html`
      <m3-navigation-rail>
        <m3-navigation-rail-item
          label="Inbox"
          badge="3"
          active
        ></m3-navigation-rail-item>
      </m3-navigation-rail>
    `);
    const item = rail.querySelector<M3NavigationRailItem>(
      'm3-navigation-rail-item',
    )!;
    const events = captureCustomEvents<ItemClickDetail>(rail, 'item-click');

    try {
      await settleLitElement(item);
      expect(item.shadowRoot!.querySelector('.badge')!.textContent).to.equal(
        '3',
      );
      expect(item.shadowRoot!.querySelector('.badge-expanded')).to.not.exist;
      expect(
        item.shadowRoot!.querySelector('button')!.getAttribute('aria-current'),
      ).to.equal('page');

      item.shadowRoot!.querySelector<HTMLButtonElement>('button')!.click();
      expect(events.events).to.have.length(1);
      expect(events.events[0]!.detail).to.deep.equal({ label: 'Inbox' });
      expect(events.events[0]!.bubbles).to.equal(true);
      expect(events.events[0]!.composed).to.equal(true);
      expect(events.events[0]!.cancelable).to.equal(false);

      rail.expanded = true;
      await settleLitElement(rail);
      expect(item.shadowRoot!.querySelector('.badge')).to.not.exist;
      expect(
        item.shadowRoot!.querySelector('.badge-expanded')!.textContent,
      ).to.equal('3');
    } finally {
      events.dispose();
    }
  });

  it('uses the fallback label and does not render a badge when none is supplied', async () => {
    const item = await fixture<M3NavigationRailItem>(html`
      <m3-navigation-rail-item></m3-navigation-rail-item>
    `);
    await settleLitElement(item);

    const button = item.shadowRoot!.querySelector('button')!;
    expect(button.getAttribute('aria-label')).to.equal('Navigation item');
    expect(item.shadowRoot!.querySelector('.label')).to.not.exist;
    expect(item.shadowRoot!.querySelector('.badge')).to.not.exist;
    expect(item.shadowRoot!.querySelector('.badge-expanded')).to.not.exist;
  });
});
