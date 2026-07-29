import { expect, fixture, html } from '@open-wc/testing';
import { describe, it } from 'vitest';
import './m3-dialog.js';
import '../../m3-button/src/m3-button.js';
import type {
  M3Dialog,
  M3DialogCloseDetail,
  M3DialogCloseReason,
} from './m3-dialog.js';

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

async function settleDialog(dialog: M3Dialog) {
  await dialog.updateComplete;
  await nextFrame();
}

describe('M3Dialog modal contract', () => {
  it('focuses the first slotted control and contains Tab and Shift+Tab', async () => {
    const dialog = await fixture<M3Dialog>(html`
      <m3-dialog open headline="Remove item">
        <button id="first">Cancel</button>
        <input id="last" aria-label="Name" />
      </m3-dialog>
    `);
    await settleDialog(dialog);

    const first = dialog.querySelector<HTMLButtonElement>('#first')!;
    const last = dialog.querySelector<HTMLInputElement>('#last')!;
    expect(document.activeElement).to.equal(first);

    last.focus();
    const tab = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    last.dispatchEvent(tab);
    expect(tab.defaultPrevented).to.equal(true);
    expect(document.activeElement).to.equal(first);

    const reverseTab = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    first.dispatchEvent(reverseTab);
    expect(reverseTab.defaultPrevented).to.equal(true);
    expect(document.activeElement).to.equal(last);
  });

  it('uses autofocus when supplied and focuses the dialog container when it has no focusable content', async () => {
    const autofocusDialog = await fixture<M3Dialog>(html`
      <m3-dialog open
        ><button>First</button
        ><button autofocus id="preferred">Preferred</button></m3-dialog
      >
    `);
    await settleDialog(autofocusDialog);
    expect(document.activeElement).to.equal(
      autofocusDialog.querySelector('#preferred'),
    );

    autofocusDialog.close();
    await autofocusDialog.updateComplete;
    const noFocusableDialog = await fixture<M3Dialog>(
      html`<m3-dialog open>Read this message.</m3-dialog>`,
    );
    await settleDialog(noFocusableDialog);
    expect(noFocusableDialog.shadowRoot!.activeElement).to.equal(
      noFocusableDialog.shadowRoot!.querySelector('.dialog'),
    );
  });

  it('includes focusable controls exposed from slotted component shadow roots', async () => {
    const dialog = await fixture<M3Dialog>(html`
      <m3-dialog open headline="Save changes"
        ><m3-button slot="actions" id="save">Save</m3-button></m3-dialog
      >
    `);
    await settleDialog(dialog);

    const action = dialog.querySelector<HTMLElement>('#save')!;
    expect(action.shadowRoot!.activeElement).to.equal(
      action.shadowRoot!.querySelector('button'),
    );
  });

  it('uses one cancelable close request for Escape and reports its close reason', async () => {
    const dialog = await fixture<M3Dialog>(
      html`<m3-dialog open><button>Dismiss</button></m3-dialog>`,
    );
    await settleDialog(dialog);

    const preventEscape = (event: Event) => event.preventDefault();
    dialog.addEventListener('dialog-request-close', preventEscape, {
      once: true,
    });
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(dialog.open).to.equal(true);

    let closeDetail: M3DialogCloseDetail | undefined;
    dialog.addEventListener('dialog-close', (event) => {
      closeDetail = (event as CustomEvent<M3DialogCloseDetail>).detail;
    });
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      }),
    );
    await dialog.updateComplete;
    expect(dialog.open).to.equal(false);
    expect(closeDetail).to.deep.equal({ reason: 'escape' });
  });

  it('honours scrim policy and reports scrim and action close reasons', async () => {
    const dialog = await fixture<M3Dialog>(
      html`<m3-dialog open><button>Dismiss</button></m3-dialog>`,
    );
    await settleDialog(dialog);
    dialog.closeOnScrim = false;
    await dialog.updateComplete;

    const scrim = dialog.shadowRoot!.querySelector<HTMLElement>('.scrim')!;
    scrim.click();
    expect(dialog.open).to.equal(true);

    dialog.closeOnScrim = true;
    await dialog.updateComplete;
    scrim.click();
    await dialog.updateComplete;
    expect(dialog.open).to.equal(false);

    await dialog.show();
    await settleDialog(dialog);
    let reason: M3DialogCloseReason | undefined;
    dialog.addEventListener(
      'dialog-close',
      (event) => {
        reason = (event as CustomEvent<M3DialogCloseDetail>).detail.reason;
      },
      { once: true },
    );
    expect(dialog.close('action')).to.equal(true);
    await dialog.updateComplete;
    expect(reason).to.equal('action');
  });

  it('generates accessible name and description hooks without empty ARIA attributes', async () => {
    const dialog = await fixture<M3Dialog>(html`
      <m3-dialog open headline="Delete item"
        ><p>This cannot be undone.</p>
        <button>Delete</button></m3-dialog
      >
    `);
    await settleDialog(dialog);

    const surface =
      dialog.shadowRoot!.querySelector<HTMLElement>('[role="dialog"]')!;
    expect(surface.getAttribute('aria-labelledby')).to.equal(
      surface.querySelector('.headline')!.id,
    );
    expect(surface.getAttribute('aria-describedby')).to.equal(
      surface.querySelector('.content')!.id,
    );
    expect(surface).to.be.accessible();

    dialog.close();
    await dialog.updateComplete;
    const unnamedDialog = await fixture<M3Dialog>(
      html`<m3-dialog open></m3-dialog>`,
    );
    await settleDialog(unnamedDialog);
    const unnamedSurface =
      unnamedDialog.shadowRoot!.querySelector<HTMLElement>('[role="dialog"]')!;
    expect(unnamedSurface.hasAttribute('aria-labelledby')).to.equal(false);
    expect(unnamedSurface.hasAttribute('aria-describedby')).to.equal(false);
  });

  it('restores focus to the connected opener and safely handles an opener that was removed', async () => {
    const container = await fixture<HTMLDivElement>(html`
      <div>
        <button id="opener">Open</button
        ><m3-dialog><button>Dismiss</button></m3-dialog>
      </div>
    `);
    const opener = container.querySelector<HTMLButtonElement>('#opener')!;
    const dialog = container.querySelector<M3Dialog>('m3-dialog')!;

    opener.focus();
    dialog.open = true;
    await settleDialog(dialog);
    dialog.close();
    await dialog.updateComplete;
    expect(document.activeElement).to.equal(opener);

    opener.focus();
    dialog.open = true;
    await settleDialog(dialog);
    opener.remove();
    expect(() => dialog.close()).not.to.throw();
    await dialog.updateComplete;
    expect(dialog.open).to.equal(false);
  });

  it('keeps only the topmost of multiple dialogs interactive and restores the page after the final close', async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div>
        <button id="inside-background">Background</button>
        <m3-dialog id="first"><button>First</button></m3-dialog>
        <m3-dialog id="second"><button>Second</button></m3-dialog>
      </div>
    `);
    const first = wrapper.querySelector<M3Dialog>('#first')!;
    const second = wrapper.querySelector<M3Dialog>('#second')!;
    const insideBackground =
      wrapper.querySelector<HTMLButtonElement>('#inside-background')!;
    const background = document.createElement('button');
    document.body.append(background);

    first.open = true;
    await settleDialog(first);
    expect(background.inert).to.equal(true);
    expect(insideBackground.inert).to.equal(true);
    expect(document.body.style.overflow).to.equal('hidden');

    second.open = true;
    await settleDialog(second);
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      }),
    );
    await second.updateComplete;
    expect(second.open).to.equal(false);
    expect(first.open).to.equal(true);

    first.close();
    await first.updateComplete;
    expect(background.inert).to.equal(false);
    expect(insideBackground.inert).to.equal(false);
    expect(document.body.style.overflow).to.equal('');
    background.remove();
  });
});
