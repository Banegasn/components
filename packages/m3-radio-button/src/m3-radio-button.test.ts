import { fixture, html, expect } from '@open-wc/testing';
import { describe, it } from 'vitest';
import './index.js';
import type { M3RadioButton } from './m3-radio-button.js';

const controls = (root: ParentNode): M3RadioButton[] =>
  Array.from(root.querySelectorAll<M3RadioButton>('m3-radio-button'));

const updateAll = async (radios: M3RadioButton[]): Promise<void> => {
  await Promise.all(radios.map((radio) => radio.updateComplete));
};

const tabIndex = (radio: M3RadioButton): string | null =>
  radio.shadowRoot!.querySelector('.radio-container')!.getAttribute('tabindex');

describe('m3-radio-button scoped groups', () => {
  it('isolates same-name groups by form owner and tree root', async () => {
    const container = await fixture<HTMLDivElement>(html`
      <div>
        <form id="first">
          <m3-radio-button name="theme" value="light" checked></m3-radio-button>
          <m3-radio-button name="theme" value="dark"></m3-radio-button>
        </form>
        <form id="second">
          <m3-radio-button
            name="theme"
            value="system"
            checked
          ></m3-radio-button>
        </form>
        <div id="shadow-host"></div>
      </div>
    `);
    const [light, dark] = controls(container.querySelector('#first')!);
    const system = controls(container.querySelector('#second')!)[0];
    const shadow = container
      .querySelector('#shadow-host')!
      .attachShadow({ mode: 'open' });
    shadow.innerHTML =
      '<m3-radio-button name="theme" value="shadow" checked></m3-radio-button>';
    const shadowRadio = controls(shadow)[0];
    await updateAll([light, dark, system, shadowRadio]);

    dark.click();
    await updateAll([light, dark, system, shadowRadio]);

    expect(light.checked).to.equal(false);
    expect(dark.checked).to.equal(true);
    expect(system.checked).to.equal(true);
    expect(shadowRadio.checked).to.equal(true);
    expect(
      new FormData(container.querySelector('#first') as HTMLFormElement).get(
        'theme',
      ),
    ).to.equal('dark');
    expect(
      new FormData(container.querySelector('#second') as HTMLFormElement).get(
        'theme',
      ),
    ).to.equal('system');
  });

  it('uses one roving tab stop and arrows skip disabled radios', async () => {
    const group = await fixture<HTMLDivElement>(html`
      <div>
        <m3-radio-button name="size" value="small" checked></m3-radio-button>
        <m3-radio-button name="size" value="medium" disabled></m3-radio-button>
        <m3-radio-button name="size" value="large"></m3-radio-button>
      </div>
    `);
    const [small, medium, large] = controls(group);
    await updateAll([small, medium, large]);

    expect(tabIndex(small)).to.equal('0');
    expect(tabIndex(medium)).to.equal('-1');
    expect(tabIndex(large)).to.equal('-1');
    small.focus();
    small
      .shadowRoot!.querySelector<HTMLElement>('.radio-container')!
      .dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'ArrowRight',
          bubbles: true,
          composed: true,
        }),
      );
    await updateAll([small, medium, large]);

    expect(small.checked).to.equal(false);
    expect(large.checked).to.equal(true);
    expect(tabIndex(small)).to.equal('-1');
    expect(tabIndex(large)).to.equal('0');
    expect(large.shadowRoot!.activeElement).to.equal(
      large.shadowRoot!.querySelector('.radio-container'),
    );
  });

  it('keeps checked state, events, and FormData synchronized', async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <m3-radio-button name="plan" value="free" checked></m3-radio-button>
        <m3-radio-button name="plan" value="pro"></m3-radio-button>
      </form>
    `);
    const [free, pro] = controls(form);
    await updateAll([free, pro]);
    let inputs = 0;
    let changes = 0;
    pro.addEventListener('input', () => {
      inputs += 1;
    });
    pro.addEventListener('change', () => {
      changes += 1;
    });

    pro.click();
    await updateAll([free, pro]);
    pro.click();
    await updateAll([free, pro]);

    expect(free.checked).to.equal(false);
    expect(pro.checked).to.equal(true);
    expect(inputs).to.equal(1);
    expect(changes).to.equal(1);
    expect(new FormData(form).get('plan')).to.equal('pro');
  });

  it('normalizes a checked radio renamed into another checked group', async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <m3-radio-button name="alpha" value="alpha-peer"></m3-radio-button>
        <m3-radio-button
          id="renamed"
          name="alpha"
          value="renamed"
          checked
        ></m3-radio-button>
        <m3-radio-button
          name="beta"
          value="beta-peer"
          checked
        ></m3-radio-button>
      </form>
    `);
    const [alphaPeer, renamed, betaPeer] = controls(form);
    await updateAll([alphaPeer, renamed, betaPeer]);

    renamed.name = 'beta';
    await updateAll([alphaPeer, renamed, betaPeer]);

    expect(alphaPeer.checked).to.equal(false);
    expect(renamed.checked).to.equal(true);
    expect(betaPeer.checked).to.equal(false);
    expect(tabIndex(alphaPeer)).to.equal('0');
    expect(tabIndex(renamed)).to.equal('0');
    expect(tabIndex(betaPeer)).to.equal('-1');
    expect(new FormData(form).get('alpha')).to.equal(null);
    expect(new FormData(form).get('beta')).to.equal('renamed');
  });

  it('normalizes a checked radio reassociated with a form that already has a checked peer', async () => {
    const container = await fixture<HTMLDivElement>(html`
      <div>
        <form id="first">
          <m3-radio-button name="plan" value="basic"></m3-radio-button>
          <m3-radio-button
            id="moved"
            name="plan"
            value="pro"
            checked
          ></m3-radio-button>
        </form>
        <form id="second">
          <m3-radio-button
            name="plan"
            value="enterprise"
            checked
          ></m3-radio-button>
        </form>
      </div>
    `);
    const first = container.querySelector<HTMLFormElement>('#first')!;
    const second = container.querySelector<HTMLFormElement>('#second')!;
    const [basic, moved] = controls(first);
    const [enterprise] = controls(second);
    await updateAll([basic, moved, enterprise]);

    moved.setAttribute('form', 'second');
    await updateAll([basic, moved, enterprise]);

    expect(moved.form).to.equal(second);
    expect(basic.checked).to.equal(false);
    expect(moved.checked).to.equal(true);
    expect(enterprise.checked).to.equal(false);
    expect(tabIndex(basic)).to.equal('0');
    expect(tabIndex(moved)).to.equal('0');
    expect(tabIndex(enterprise)).to.equal('-1');
    expect(new FormData(first).get('plan')).to.equal(null);
    expect(new FormData(second).get('plan')).to.equal('pro');
  });

  it('normalizes a checked radio moved into a root that has a checked peer', async () => {
    const container = await fixture<HTMLDivElement>(html`
      <div>
        <m3-radio-button name="root" value="document-peer"></m3-radio-button>
        <m3-radio-button
          id="moving"
          name="root"
          value="moving"
          checked
        ></m3-radio-button>
        <div id="shadow-host"></div>
      </div>
    `);
    const [documentPeer, moving] = controls(container);
    const shadow = container
      .querySelector('#shadow-host')!
      .attachShadow({ mode: 'open' });
    shadow.innerHTML =
      '<m3-radio-button name="root" value="shadow-peer" checked></m3-radio-button>';
    const [shadowPeer] = controls(shadow);
    await updateAll([documentPeer, moving, shadowPeer]);

    shadow.append(moving);
    await updateAll([documentPeer, moving, shadowPeer]);

    expect(documentPeer.checked).to.equal(false);
    expect(moving.checked).to.equal(true);
    expect(shadowPeer.checked).to.equal(false);
    expect(tabIndex(documentPeer)).to.equal('0');
    expect(tabIndex(moving)).to.equal('0');
    expect(tabIndex(shadowPeer)).to.equal('-1');
  });

  it('recomputes local groups after dynamic insertion and removal without touching sibling DOM', async () => {
    const container = await fixture<HTMLDivElement>(html`
      <div>
        <m3-radio-button
          name="density"
          value="compact"
          checked
        ></m3-radio-button>
      </div>
    `);
    const compact = controls(container)[0];
    await compact.updateComplete;
    const label = document.createElement('label');
    label.textContent = 'Unrelated sibling';
    container.append(label);
    const labelMarkup = label.outerHTML;
    const comfortable = document.createElement(
      'm3-radio-button',
    ) as M3RadioButton;
    comfortable.name = 'density';
    comfortable.value = 'comfortable';
    container.append(comfortable);
    await updateAll([compact, comfortable]);

    expect(tabIndex(compact)).to.equal('0');
    expect(tabIndex(comfortable)).to.equal('-1');
    compact.remove();
    await comfortable.updateComplete;

    expect(tabIndex(comfortable)).to.equal('0');
    expect(label.outerHTML).to.equal(labelMarkup);
  });

  it('supports external labels and cleans their scoped listeners through repeated lifecycle changes', async () => {
    const container = await fixture<HTMLDivElement>(html`
      <div>
        <label id="dark-label" for="dark">Dark theme</label>
        <m3-radio-button
          id="dark"
          name="theme"
          value="dark"
          aria-labelledby="dark-label"
        ></m3-radio-button>
      </div>
    `);
    const [radio] = controls(container);
    await radio.updateComplete;
    const label = container.querySelector('label') as HTMLLabelElement;
    label.click();
    await radio.updateComplete;

    expect(radio.checked).to.equal(true);
    expect(radio.labels).to.have.length(1);
    expect(
      radio
        .shadowRoot!.querySelector('.radio-container')!
        .getAttribute('aria-labelledby'),
    ).to.equal('dark-label');
    radio.remove();
    label.click();
    expect(radio.checked).to.equal(true);
    container.append(radio);
    await radio.updateComplete;
    radio.checked = false;
    await radio.updateComplete;
    label.click();
    await radio.updateComplete;
    expect(radio.checked).to.equal(true);
    radio.remove();
    radio.checked = false;
    label.click();
    expect(radio.checked).to.equal(false);
  });

  it('omits unset ARIA name and IDREF attributes', async () => {
    const radio = await fixture<M3RadioButton>(
      html`<m3-radio-button></m3-radio-button>`,
    );
    const control =
      radio.shadowRoot!.querySelector<HTMLElement>('.radio-container')!;

    expect(control.hasAttribute('aria-label')).to.be.false;
    expect(control.hasAttribute('aria-labelledby')).to.be.false;
  });
});
