import { fixture, html, expect } from '@open-wc/testing';
import { describe, it } from 'vitest';
import './m3-text-field.js';
import type { M3TextField } from './m3-text-field.js';

describe('m3-text-field', () => {
  it('implements the documented variant, slot, supporting-text, and ARIA contract', async () => {
    const field = await fixture<M3TextField>(html`
      <m3-text-field
        variant="outlined"
        label="Account name"
        helper-text="Use 3 to 8 letters."
        show-counter
        maxlength="8"
        aria-describedby="account-guidance"
      >
        <span slot="leading-icon">@</span>
        <span slot="trailing-icon">✓</span>
      </m3-text-field>
    `);
    await field.updateComplete;

    const root = field.shadowRoot!;
    const input = root.querySelector<HTMLInputElement>('input')!;
    const label = root.querySelector<HTMLLabelElement>('label')!;
    const supporting = root.querySelector<HTMLElement>('.supporting-row')!;
    expect(root.querySelector('.field-container')!.className).to.contain(
      'outlined',
    );
    expect(label.htmlFor).to.equal(input.id);
    expect(input.getAttribute('aria-describedby')).to.equal(
      `${'account-guidance'} ${supporting.id}`,
    );
    expect(input.getAttribute('aria-errormessage')).to.equal(null);
    expect(input.maxLength).to.equal(8);
    expect(supporting.textContent).to.contain('Use 3 to 8 letters.');
    expect(supporting.textContent).to.contain('0/8');
    expect(
      root
        .querySelector<HTMLSlotElement>('slot[name="leading-icon"]')!
        .assignedElements(),
    ).to.have.length(1);
    expect(
      root
        .querySelector<HTMLSlotElement>('slot[name="trailing-icon"]')!
        .assignedElements(),
    ).to.have.length(1);
  });

  it('associates its visible label with the input and preserves optional ARIA absence', async () => {
    const field = await fixture<M3TextField>(
      html`<m3-text-field label="Email"></m3-text-field>`,
    );
    await field.updateComplete;
    const root = field.shadowRoot!;
    const input = root.querySelector<HTMLInputElement>('input')!;
    root.querySelector<HTMLLabelElement>('label')!.click();

    expect(root.activeElement).to.equal(input);
    expect(input.hasAttribute('aria-label')).to.equal(false);
    expect(input.hasAttribute('aria-labelledby')).to.equal(false);
    expect(input.hasAttribute('aria-describedby')).to.equal(false);
    await expect(field).to.be.accessible();
  });

  it('contributes native constraint validity and custom errors to its owner form', async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <m3-text-field
          name="username"
          required
          pattern="[A-Za-z]+"
          maxlength="8"
        ></m3-text-field>
      </form>
    `);
    const field = form.querySelector<M3TextField>('m3-text-field')!;
    await field.updateComplete;

    expect(field.validity.valueMissing).to.equal(true);
    expect(form.checkValidity()).to.equal(false);

    const input = field.shadowRoot!.querySelector<HTMLInputElement>('input')!;
    input.value = '123';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await field.updateComplete;
    expect(field.validity.patternMismatch).to.equal(true);
    expect(
      field.shadowRoot!.querySelector('.supporting-row')!.textContent,
    ).to.not.equal('');

    field.error = true;
    field.errorText = 'That username is reserved.';
    await field.updateComplete;
    expect(field.validity.customError).to.equal(true);
    expect(field.validationMessage).to.equal('That username is reserved.');
    expect(
      field
        .shadowRoot!.querySelector<HTMLInputElement>('input')!
        .getAttribute('aria-errormessage'),
    ).to.match(/supporting$/);

    field.error = false;
    input.value = 'Ada';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await field.updateComplete;
    expect(field.validity.valid).to.equal(true);
    expect(new FormData(form).get('username')).to.equal('Ada');
  });

  it('emits exactly one native input/change pair and no removed custom aliases', async () => {
    const field = await fixture<M3TextField>(
      html`<m3-text-field></m3-text-field>`,
    );
    await field.updateComplete;
    const input = field.shadowRoot!.querySelector<HTMLInputElement>('input')!;
    let inputs = 0;
    let changes = 0;
    let legacyInputs = 0;
    let legacyChanges = 0;
    field.addEventListener('input', () => {
      inputs += 1;
    });
    field.addEventListener('change', () => {
      changes += 1;
    });
    field.addEventListener('textfield-input', () => {
      legacyInputs += 1;
    });
    field.addEventListener('textfield-change', () => {
      legacyChanges += 1;
    });

    input.value = 'Grace';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await field.updateComplete;

    expect(field.value).to.equal('Grace');
    expect(inputs).to.equal(1);
    expect(changes).to.equal(1);
    expect(legacyInputs).to.equal(0);
    expect(legacyChanges).to.equal(0);
  });
});
