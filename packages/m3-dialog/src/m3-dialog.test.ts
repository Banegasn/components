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
  // Initial focus is a presentation-frame concern. Keeping it outside Lit's
  // update promise avoids making fixture() wait on WebKit's native dialog
  // focus processing, while still asserting the completed modal contract.
  await nextFrame();
  // A dialog opened immediately after another native dialog closes may wait
  // for WebKit to release the prior top-layer entry before it can focus.
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

    const surface =
      dialog.shadowRoot!.querySelector<HTMLDialogElement>('.dialog')!;
    surface.click();
    expect(dialog.open).to.equal(true);

    dialog.closeOnScrim = true;
    await dialog.updateComplete;
    surface.click();
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
    expect(
      first.shadowRoot!.querySelector<HTMLDialogElement>('.dialog')!.open,
    ).to.equal(true);
    expect(background.inert).to.equal(true);
    expect(insideBackground.inert).to.equal(true);
    expect(document.body.style.overflow).to.equal('hidden');

    second.open = true;
    await settleDialog(second);
    expect(
      second.shadowRoot!.querySelector<HTMLDialogElement>('.dialog')!.open,
    ).to.equal(true);
    const secondSurface =
      second.shadowRoot!.querySelector<HTMLDialogElement>('.dialog')!;
    const secondBounds = secondSurface.getBoundingClientRect();
    expect(
      document.elementFromPoint(secondBounds.x + 8, secondBounds.y + 8),
    ).to.equal(second);
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
    const firstSurface =
      first.shadowRoot!.querySelector<HTMLDialogElement>('.dialog')!;
    expect(firstSurface.open).to.equal(true);
    const firstBounds = firstSurface.getBoundingClientRect();
    expect(
      document.elementFromPoint(firstBounds.x + 8, firstBounds.y + 8),
    ).to.equal(first);

    first.close();
    await first.updateComplete;
    expect(background.inert).to.equal(false);
    expect(insideBackground.inert).to.equal(false);
    expect(document.body.style.overflow).to.equal('');
    background.remove();
  });

  it('restores native modal containment when an open dialog reconnects', async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div>
        <button id="background">Background</button>
        <m3-dialog open><button>Dismiss</button></m3-dialog>
      </div>
    `);
    const background = wrapper.querySelector<HTMLButtonElement>('#background')!;
    const dialog = wrapper.querySelector<M3Dialog>('m3-dialog')!;
    const surface =
      dialog.shadowRoot!.querySelector<HTMLDialogElement>('.dialog')!;
    await settleDialog(dialog);

    expect(surface.open).to.equal(true);
    expect(background.inert).to.equal(true);

    dialog.remove();
    expect(surface.open).to.equal(false);
    expect(background.inert).to.equal(false);

    wrapper.append(dialog);
    await settleDialog(dialog);

    expect(dialog.open).to.equal(true);
    expect(surface.open).to.equal(true);
    expect(surface.getAttribute('aria-modal')).to.equal('true');
    expect(background.inert).to.equal(true);
    const bounds = surface.getBoundingClientRect();
    expect(document.elementFromPoint(bounds.x + 8, bounds.y + 8)).to.equal(
      dialog,
    );
  });

  it('puts the most recently opened dialog above an earlier DOM sibling across stacking contexts', async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div>
        <div style="position: relative; z-index: 1; transform: translateZ(0)">
          <m3-dialog id="newer" headline="Newer"
            ><button>Newer</button></m3-dialog
          >
        </div>
        <div style="position: relative; z-index: 2; transform: translateZ(0)">
          <m3-dialog id="older" headline="Older"
            ><button>Older</button></m3-dialog
          >
        </div>
      </div>
    `);
    const newer = wrapper.querySelector<M3Dialog>('#newer')!;
    const older = wrapper.querySelector<M3Dialog>('#older')!;

    older.open = true;
    await settleDialog(older);
    newer.open = true;
    await settleDialog(newer);

    const newerSurface =
      newer.shadowRoot!.querySelector<HTMLDialogElement>('.dialog')!;
    const newerBounds = newerSurface.getBoundingClientRect();
    expect(
      document.elementFromPoint(newerBounds.x + 8, newerBounds.y + 8),
    ).to.equal(newer);
  });

  it('inerts sibling branches in a ShadowRoot before ascending to the host', async () => {
    const host = document.createElement('div');
    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML =
      '<button id="shadow-background">Background</button><m3-dialog><button>Dismiss</button></m3-dialog>';
    document.body.append(host);

    const shadowBackground =
      root.querySelector<HTMLButtonElement>('#shadow-background')!;
    const dialog = root.querySelector<M3Dialog>('m3-dialog')!;
    await customElements.whenDefined('m3-dialog');
    dialog.open = true;
    await settleDialog(dialog);
    expect(shadowBackground.inert).to.equal(true);

    dialog.close();
    await dialog.updateComplete;
    expect(shadowBackground.inert).to.equal(false);
    host.remove();
  });
});
