import { fixture, html, expect } from '@open-wc/testing';
import { describe, it } from 'vitest';
import './m3-tabs.js';
import type { M3Tabs, TabChangeDetail } from './m3-tabs.js';

const keydown = (tab: HTMLElement, key: string) =>
  tab.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, composed: true, key }),
  );

const tabsFixture = () =>
  fixture<HTMLDivElement>(html`
    <div>
      <m3-tabs>
        <m3-tab panel="overview" value="overview">Overview</m3-tab>
        <m3-tab panel="details" value="details" disabled>Details</m3-tab>
        <m3-tab panel="activity" value="activity">Activity</m3-tab>
      </m3-tabs>
      <section id="overview">Overview panel</section>
      <section id="details">Details panel</section>
      <section id="activity">Activity panel</section>
    </div>
  `);

describe('M3Tabs ARIA interaction contract', () => {
  it('creates bidirectional tab and tabpanel relationships with one selected enabled tab', async () => {
    const fixtureRoot = await tabsFixture();
    const tabs = fixtureRoot.querySelector<M3Tabs>('m3-tabs')!;
    await tabs.updateComplete;
    const tabElements = [...tabs.querySelectorAll<HTMLElement>('m3-tab')];
    const panels = ['overview', 'details', 'activity'].map((id) =>
      fixtureRoot.querySelector<HTMLElement>(`#${id}`)!,
    );

    expect(
      tabElements.filter((tab) => tab.getAttribute('aria-selected') === 'true'),
    ).to.have.length(1);
    expect(tabElements.filter((tab) => tab.tabIndex === 0)).to.have.length(1);
    tabElements.forEach((tab, index) => {
      expect(tab.getAttribute('role')).to.equal('tab');
      expect(tab.getAttribute('aria-controls')).to.equal(panels[index].id);
      expect(panels[index].getAttribute('role')).to.equal('tabpanel');
      expect(panels[index].getAttribute('aria-labelledby')).to.equal(tab.id);
    });
    expect(panels[0].hidden).to.be.false;
    expect(panels[1].hidden).to.be.true;
    expect(tabs).to.be.accessible();
  });

  it('uses the documented automatic horizontal policy, including Home and End, and skips disabled tabs', async () => {
    const fixtureRoot = await tabsFixture();
    const tabs = fixtureRoot.querySelector<M3Tabs>('m3-tabs')!;
    const [first, , last] = [...tabs.querySelectorAll<HTMLElement>('m3-tab')];
    const events: TabChangeDetail[] = [];
    tabs.addEventListener('tab-change', (event) =>
      events.push((event as CustomEvent<TabChangeDetail>).detail),
    );
    first.focus();
    keydown(first, 'ArrowRight');
    await tabs.updateComplete;
    expect(document.activeElement).to.equal(last);
    expect(tabs.activeTab).to.equal(2);
    expect(events.at(-1)).to.deep.equal({
      activeTab: 2,
      value: 'activity',
      reason: 'keyboard',
    });
    keydown(last, 'Home');
    await tabs.updateComplete;
    expect(tabs.activeTab).to.equal(0);
    keydown(first, 'End');
    await tabs.updateComplete;
    expect(tabs.activeTab).to.equal(2);
  });

  it('uses Up and Down in vertical manual mode, where Enter activates the focused tab', async () => {
    const fixtureRoot = await tabsFixture();
    const tabs = fixtureRoot.querySelector<M3Tabs>('m3-tabs')!;
    tabs.orientation = 'vertical';
    tabs.activation = 'manual';
    await tabs.updateComplete;
    const [first, , last] = [...tabs.querySelectorAll<HTMLElement>('m3-tab')];
    first.focus();
    keydown(first, 'ArrowDown');
    await tabs.updateComplete;
    expect(document.activeElement).to.equal(last);
    expect(tabs.activeTab).to.equal(0);
    expect(first.tabIndex).to.equal(-1);
    expect(last.tabIndex).to.equal(0);
    expect(first.getAttribute('aria-selected')).to.equal('true');
    expect(last.getAttribute('aria-selected')).to.equal('false');
    keydown(last, 'Enter');
    await tabs.updateComplete;
    expect(tabs.activeTab).to.equal(2);
    expect(last.tabIndex).to.equal(0);
    expect(last.getAttribute('aria-selected')).to.equal('true');
  });

  it('links panels in the same ShadowRoot rather than looking them up globally', async () => {
    const host = document.createElement('div');
    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <m3-tabs>
        <m3-tab panel="shadow-overview">Overview</m3-tab>
        <m3-tab panel="shadow-details">Details</m3-tab>
      </m3-tabs>
      <section id="shadow-overview">Overview panel</section>
      <section id="shadow-details">Details panel</section>
    `;
    document.body.append(host);
    try {
      const tabs = root.querySelector<M3Tabs>('m3-tabs')!;
      await tabs.updateComplete;
      const [first, second] = [...root.querySelectorAll<HTMLElement>('m3-tab')];
      const firstPanel = root.querySelector<HTMLElement>('#shadow-overview')!;
      const secondPanel = root.querySelector<HTMLElement>('#shadow-details')!;
      expect(first.getAttribute('aria-controls')).to.equal(firstPanel.id);
      expect(firstPanel.getAttribute('aria-labelledby')).to.equal(first.id);
      expect(second.getAttribute('aria-controls')).to.equal(secondPanel.id);
      expect(secondPanel.getAttribute('aria-labelledby')).to.equal(second.id);
    } finally {
      host.remove();
    }
  });

  it('recovers from invalid indexes and dynamic removal or disabling without selecting a disabled tab', async () => {
    const fixtureRoot = await tabsFixture();
    const tabs = fixtureRoot.querySelector<M3Tabs>('m3-tabs')!;
    tabs.activeTab = 99;
    await tabs.updateComplete;
    expect(tabs.activeTab).to.equal(2);
    const active = tabs.querySelectorAll('m3-tab')[2] as HTMLElement;
    active.setAttribute('disabled', '');
    await new Promise((resolve) => setTimeout(resolve));
    await tabs.updateComplete;
    expect(tabs.activeTab).to.equal(0);
    active.remove();
    await new Promise((resolve) => setTimeout(resolve));
    await tabs.updateComplete;
    expect(tabs.activeTab).to.equal(0);
  });
});
