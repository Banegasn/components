import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { DialogComponent } from './dialog.component';

type DemoDialog = HTMLElement & {
  close(reason: 'action' | 'escape'): boolean;
  open: boolean;
  updateComplete: Promise<boolean>;
};

describe('DialogComponent', () => {
  const nativeDialog = HTMLDialogElement.prototype;
  const showModal = nativeDialog.showModal;
  const close = nativeDialog.close;

  beforeAll(() => {
    nativeDialog.showModal = function showModal() {
      this.setAttribute('open', '');
    };
    nativeDialog.close = function close() {
      this.removeAttribute('open');
    };
  });

  afterAll(() => {
    nativeDialog.showModal = showModal;
    nativeDialog.close = close;
  });

  async function createFixture(): Promise<ComponentFixture<DialogComponent>> {
    await TestBed.configureTestingModule({
      imports: [DialogComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(DialogComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    return fixture;
  }

  async function openDemo(
    fixture: ComponentFixture<DialogComponent>,
  ): Promise<DemoDialog> {
    const opener = fixture.nativeElement.querySelector(
      'm3-button',
    ) as HTMLElement;
    opener.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await fixture.whenStable();

    const dialog = fixture.nativeElement.querySelector(
      'm3-dialog',
    ) as DemoDialog;
    await dialog.updateComplete;

    return dialog;
  }

  it('does not render a dialog until the user opens the demo', async () => {
    const fixture = await createFixture();

    expect(fixture.nativeElement.querySelector('m3-dialog')).toBeNull();
  });

  it('opens from the rendered opener and closes from Cancel', async () => {
    const fixture = await createFixture();
    const dialog = await openDemo(fixture);

    expect(dialog.open).toBe(true);

    dialog
      .querySelectorAll('m3-button')[0]
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await dialog.updateComplete;
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('m3-dialog')).toBeNull();
    expect(fixture.componentInstance.lastCloseReason).toBe('action');
  });

  it('closes from the rendered Confirm action', async () => {
    const fixture = await createFixture();
    const dialog = await openDemo(fixture);

    dialog
      .querySelectorAll('m3-button')[1]
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await dialog.updateComplete;
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('m3-dialog')).toBeNull();
    expect(fixture.componentInstance.lastCloseReason).toBe('action');
  });

  it('handles an Escape close event from the rendered dialog', async () => {
    const fixture = await createFixture();
    const dialog = await openDemo(fixture);

    expect(dialog.close('escape')).toBe(true);
    await dialog.updateComplete;
    await fixture.whenStable();

    expect(fixture.componentInstance.dialogOpen).toBe(false);
    expect(fixture.componentInstance.lastCloseReason).toBe('escape');
    expect(fixture.nativeElement.querySelector('m3-dialog')).toBeNull();
  });
});
