import { fixture, html, expect } from '@open-wc/testing';
import { describe, it } from 'vitest';
import '@banegasn/m3-button';
import '@banegasn/m3-checkbox';
import '@banegasn/m3-radio-button';
import '@banegasn/m3-search-bar';
import '@banegasn/m3-slider';
import '@banegasn/m3-switch';
import '@banegasn/m3-text-field';
import type { M3Button } from '@banegasn/m3-button';
import type { M3Checkbox } from './m3-checkbox.js';
import type { M3RadioButton } from '@banegasn/m3-radio-button';
import type { M3SearchBar } from '@banegasn/m3-search-bar';
import type { M3Slider } from '@banegasn/m3-slider';
import type { M3Switch } from '@banegasn/m3-switch';
import type { M3TextField } from '@banegasn/m3-text-field';

describe('form-associated controls', () => {
  it('contributes each successful control to FormData without hidden inputs', async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <m3-text-field name="title" value="Expressive"></m3-text-field>
        <m3-checkbox name="terms" value="yes" checked></m3-checkbox>
        <m3-radio-button name="theme" value="dark" checked></m3-radio-button>
        <m3-switch name="alerts" value="enabled" checked></m3-switch>
        <m3-slider name="volume" value="25"></m3-slider>
        <m3-search-bar name="query" value="material"></m3-search-bar>
      </form>
    `);
    await Promise.all(Array.from(form.querySelectorAll<HTMLElement>('*')).map((element) =>
      'updateComplete' in element ? (element as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete : Promise.resolve(),
    ));

    const data = new FormData(form);
    expect(data.get('title')).to.equal('Expressive');
    expect(data.get('terms')).to.equal('yes');
    expect(data.get('theme')).to.equal('dark');
    expect(data.get('alerts')).to.equal('enabled');
    expect(data.get('volume')).to.equal('25');
    expect(data.get('query')).to.equal('material');
    expect(form.querySelectorAll('input')).to.have.length(0);
  });

  it('uses the host form attribute and excludes disabled fieldset descendants', async () => {
    const container = await fixture<HTMLDivElement>(html`
      <div>
        <form id="owner"></form>
        <m3-text-field form="owner" name="outside" value="owned"></m3-text-field>
        <form id="disabled-owner"><fieldset disabled><m3-checkbox name="skip" checked></m3-checkbox></fieldset></form>
      </div>
    `);
    const outside = container.querySelector<M3TextField>('m3-text-field')!;
    const disabled = container.querySelector<M3Checkbox>('m3-checkbox')!;
    await Promise.all([outside.updateComplete, disabled.updateComplete]);
    expect(outside.form?.id).to.equal('owner');
    expect(new FormData(container.querySelector<HTMLFormElement>('#owner')!).get('outside')).to.equal('owned');
    expect(new FormData(container.querySelector<HTMLFormElement>('#disabled-owner')!).has('skip')).to.equal(false);
  });

  it('enforces required fields through native form validity', async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><m3-text-field name="email" required></m3-text-field></form>
    `);
    const field = form.querySelector<M3TextField>('m3-text-field')!;
    await field.updateComplete;
    expect(form.checkValidity()).to.equal(false);
    expect(field.validity.valueMissing).to.equal(true);
    field.value = 'hello@example.test';
    await field.updateComplete;
    expect(field.validity.valid).to.equal(true);
    expect(form.checkValidity()).to.equal(true);
  });

  it('resets defaults and restores browser form state without interaction events', async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <m3-checkbox name="terms" checked></m3-checkbox>
        <m3-text-field name="title" value="Initial"></m3-text-field>
      </form>
    `);
    const checkbox = form.querySelector<M3Checkbox>('m3-checkbox')!;
    const text = form.querySelector<M3TextField>('m3-text-field')!;
    await Promise.all([checkbox.updateComplete, text.updateComplete]);
    let changes = 0;
    text.addEventListener('change', () => { changes += 1; });
    checkbox.checked = false;
    text.value = 'Edited';
    await Promise.all([checkbox.updateComplete, text.updateComplete]);
    form.reset();
    await Promise.all([checkbox.updateComplete, text.updateComplete]);
    expect(checkbox.checked).to.equal(true);
    expect(text.value).to.equal('Initial');
    text.formStateRestoreCallback('Restored');
    await text.updateComplete;
    expect(text.value).to.equal('Restored');
    expect(changes).to.equal(0);
  });

  it('groups radios by owner form and emits a single native input/change pair', async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <m3-radio-button name="theme" value="light" checked></m3-radio-button>
        <m3-radio-button name="theme" value="dark"></m3-radio-button>
      </form>
    `);
    const [light, dark] = Array.from(form.querySelectorAll<M3RadioButton>('m3-radio-button'));
    await Promise.all([light.updateComplete, dark.updateComplete]);
    let inputs = 0;
    let changes = 0;
    dark.addEventListener('input', () => { inputs += 1; });
    dark.addEventListener('change', () => { changes += 1; });
    dark.click();
    await Promise.all([light.updateComplete, dark.updateComplete]);
    expect(light.checked).to.equal(false);
    expect(dark.checked).to.equal(true);
    expect(inputs).to.equal(1);
    expect(changes).to.equal(1);
    expect(new FormData(form).get('theme')).to.equal('dark');
  });

  it('submits and resets through a form-associated button exactly once', async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <m3-text-field name="title" value="Initial"></m3-text-field>
        <m3-button type="submit" name="intent" value="save">Save</m3-button>
        <m3-button type="reset">Reset</m3-button>
      </form>
    `);
    const text = form.querySelector<M3TextField>('m3-text-field')!;
    const [submit, reset] = Array.from(form.querySelectorAll<M3Button>('m3-button'));
    await Promise.all([text.updateComplete, submit.updateComplete, reset.updateComplete]);
    expect(submit.type).to.equal('submit');
    expect(submit.form).to.equal(form);
    let submits = 0;
    let submitData: FormData | undefined;
    form.addEventListener('submit', (event) => {
      submits += 1;
      event.preventDefault();
      submitData = new FormData(form);
    });
    submit.click();
    expect(submits).to.equal(1);
    expect(submitData?.get('intent')).to.equal('save');
    text.value = 'Edited';
    await text.updateComplete;
    reset.click();
    await text.updateComplete;
    expect(text.value).to.equal('Initial');
  });

  it('keeps range and search values current through native input events', async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <m3-slider name="volume" value="10"></m3-slider>
        <m3-search-bar name="query" value="old"></m3-search-bar>
      </form>
    `);
    const slider = form.querySelector<M3Slider>('m3-slider')!;
    const search = form.querySelector<M3SearchBar>('m3-search-bar')!;
    await Promise.all([slider.updateComplete, search.updateComplete]);
    let sliderInputs = 0;
    let searchInputs = 0;
    slider.addEventListener('input', () => { sliderInputs += 1; });
    search.addEventListener('input', () => { searchInputs += 1; });
    const sliderInput = slider.shadowRoot!.querySelector<HTMLInputElement>('input')!;
    sliderInput.value = '30';
    sliderInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    const searchInput = search.shadowRoot!.querySelector<HTMLInputElement>('input')!;
    searchInput.value = 'new';
    searchInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await Promise.all([slider.updateComplete, search.updateComplete]);
    expect(sliderInputs).to.equal(1);
    expect(searchInputs).to.equal(1);
    const data = new FormData(form);
    expect(data.get('volume')).to.equal('30');
    expect(data.get('query')).to.equal('new');
  });

  it('uses switch native events and only submits checked values', async () => {
    const form = await fixture<HTMLFormElement>(html`<form><m3-switch name="alerts" value="on"></m3-switch></form>`);
    const control = form.querySelector<M3Switch>('m3-switch')!;
    await control.updateComplete;
    let inputs = 0;
    let changes = 0;
    control.addEventListener('input', () => { inputs += 1; });
    control.addEventListener('change', () => { changes += 1; });
    control.shadowRoot!.querySelector<HTMLElement>('.switch-container')!.click();
    await control.updateComplete;
    expect(inputs).to.equal(1);
    expect(changes).to.equal(1);
    expect(new FormData(form).get('alerts')).to.equal('on');
  });
});
