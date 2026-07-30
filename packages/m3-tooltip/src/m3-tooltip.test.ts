import { expect, fixture, html } from '@open-wc/testing';
import { describe, it } from 'vitest';
import './m3-tooltip.js';
import type { M3Tooltip } from './m3-tooltip.js';

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

async function settle(tooltip: M3Tooltip) {
  await tooltip.updateComplete;
  await nextFrame();
  await tooltip.updateComplete;
}

function surface(tooltip: M3Tooltip) {
  return tooltip.shadowRoot!.querySelector<HTMLElement>('.tooltip-surface')!;
}

describe('M3Tooltip public interaction contract', () => {
  it('shows a plain tooltip from hover and keyboard focus', async () => {
    const tooltip = await fixture<M3Tooltip>(html`
      <m3-tooltip text="Save document" delay="0"><button>Save</button></m3-tooltip>
    `);
    const trigger = tooltip.querySelector<HTMLButtonElement>('button')!;

    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    await new Promise((resolve) => setTimeout(resolve, 10));
    await settle(tooltip);
    expect(surface(tooltip).hasAttribute('visible')).to.equal(true);

    trigger.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: document.body }));
    await tooltip.updateComplete;
    expect(surface(tooltip).hasAttribute('visible')).to.equal(false);

    trigger.focus();
    await settle(tooltip);
    expect(document.activeElement).to.equal(trigger);
    expect(surface(tooltip).hasAttribute('visible')).to.equal(true);
  });

  it('provides a stable described-by ID whose accessible text is the tooltip text', async () => {
    const tooltip = await fixture<M3Tooltip>(html`
      <m3-tooltip text="Keyboard shortcut: ⌘S"><button aria-describedby="existing">Save</button></m3-tooltip>
    `);
    const trigger = tooltip.querySelector<HTMLButtonElement>('button')!;
    const tooltipSurface = surface(tooltip);
    const ids = trigger.getAttribute('aria-describedby')!.split(/\s+/);

    expect(tooltipSurface.id).to.match(/^m3-tooltip-\d+$/);
    expect(ids).to.include('existing');
    expect(ids).to.include(tooltipSurface.id);
    // The light-tree description is what browsers resolve for the trigger's
    // computed accessible description; its ID matches the stable surface ID.
    expect(document.getElementById(tooltipSurface.id)!.textContent).to.equal('Keyboard shortcut: ⌘S');
    await expect(tooltip).to.be.accessible();
  });

  it('dismisses with Escape without moving focus', async () => {
    const tooltip = await fixture<M3Tooltip>(html`
      <m3-tooltip text="Save"><button>Save</button></m3-tooltip>
    `);
    const trigger = tooltip.querySelector<HTMLButtonElement>('button')!;
    trigger.focus();
    await settle(tooltip);

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
    await settle(tooltip);
    expect(surface(tooltip).hasAttribute('visible')).to.equal(false);
    expect(document.activeElement).to.equal(trigger);
  });

  it('keeps a rich tooltip open while its content is hovered, focused, and used', async () => {
    const tooltip = await fixture<M3Tooltip>(html`
      <m3-tooltip variant="rich" delay="0">
        <button>More options</button>
        <span slot="title">More options</span>
        <button slot="content" id="action">Learn more</button>
      </m3-tooltip>
    `);
    const trigger = tooltip.querySelector<HTMLButtonElement>('button:not([slot])')!;
    const action = tooltip.querySelector<HTMLButtonElement>('#action')!;
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    await settle(tooltip);

    const tooltipSurface = surface(tooltip);
    expect(tooltipSurface.getAttribute('role')).to.equal('dialog');
    expect(getComputedStyle(tooltipSurface).pointerEvents).to.equal('auto');
    trigger.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: action }));
    let clicked = false;
    action.addEventListener('click', () => { clicked = true; });
    action.click();
    action.dispatchEvent(new FocusEvent('focusin', { bubbles: true, composed: true }));
    await new Promise((resolve) => setTimeout(resolve, 150));
    await settle(tooltip);
    expect(tooltipSurface.hasAttribute('visible')).to.equal(true);
    expect(clicked).to.equal(true);

    tooltipSurface.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: document.body }));
    await new Promise((resolve) => setTimeout(resolve, 150));
    await settle(tooltip);
    expect(tooltipSurface.hasAttribute('visible')).to.equal(false);
  });

  it('honors the documented delay and flips placement at viewport edges', async () => {
    const tooltip = await fixture<M3Tooltip>(html`
      <m3-tooltip text="Edge" placement="top" delay="40" style="position: fixed; top: 0; left: 20px">
        <button>Edge trigger</button>
      </m3-tooltip>
    `);
    const trigger = tooltip.querySelector<HTMLButtonElement>('button')!;
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(surface(tooltip).hasAttribute('visible')).to.equal(false);
    await new Promise((resolve) => setTimeout(resolve, 50));
    await settle(tooltip);
    expect(surface(tooltip).hasAttribute('visible')).to.equal(true);
    expect(surface(tooltip).dataset.placement).to.equal('bottom');
  });

  it('cleans timers, trigger listeners, and IDREF mutations across reconnects', async () => {
    const container = await fixture<HTMLDivElement>(html`
      <div><m3-tooltip text="Save" delay="40"><button aria-describedby="existing">Save</button></m3-tooltip></div>
    `);
    const tooltip = container.querySelector<M3Tooltip>('m3-tooltip')!;
    const trigger = tooltip.querySelector<HTMLButtonElement>('button')!;
    const tooltipId = surface(tooltip).id;
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    tooltip.remove();
    await new Promise((resolve) => setTimeout(resolve, 60));

    expect(trigger.getAttribute('aria-describedby')).to.equal('existing');
    expect(document.getElementById(tooltipId)).to.equal(null);
    container.append(tooltip);
    await settle(tooltip);
    expect(trigger.getAttribute('aria-describedby')!.split(/\s+/)).to.include(tooltipId);
    expect(surface(tooltip).hasAttribute('visible')).to.equal(false);
  });

  it('does not recreate a description while detached after property updates', async () => {
    const container = await fixture<HTMLDivElement>(html`
      <div>
        <m3-tooltip text="Original">
          <button aria-describedby="existing">Details</button>
          <span slot="title">Updated heading</span>
          <span slot="content">Updated content</span>
        </m3-tooltip>
      </div>
    `);
    const tooltip = container.querySelector<M3Tooltip>('m3-tooltip')!;
    const trigger = tooltip.querySelector<HTMLButtonElement>('button')!;
    const tooltipId = surface(tooltip).id;

    tooltip.remove();
    tooltip.text = 'Changed while detached';
    tooltip.variant = 'rich';
    await tooltip.updateComplete;
    expect(tooltip.querySelectorAll(`span[slot="description"]#${tooltipId}`).length).to.equal(0);
    expect(trigger.getAttribute('aria-describedby')).to.equal('existing');

    container.append(tooltip);
    await settle(tooltip);
    const descriptions = tooltip.querySelectorAll<HTMLSpanElement>(`span[slot="description"]#${tooltipId}`);
    const ids = trigger.getAttribute('aria-describedby')!.split(/\s+/);
    expect(descriptions).to.have.length(1);
    expect(descriptions[0]!.textContent).to.equal('Updated heading Updated content');
    expect(ids.filter((id) => id === tooltipId)).to.have.length(1);
    expect(ids).to.include('existing');
  });
});
