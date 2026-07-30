import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  async function createFixture(): Promise<ComponentFixture<DialogComponent>> {
    await TestBed.configureTestingModule({
      imports: [DialogComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(DialogComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    return fixture;
  }

  it('does not render a dialog until the user opens the demo', async () => {
    const fixture = await createFixture();

    expect(fixture.nativeElement.querySelector('m3-dialog')).toBeNull();
  });

  it('keeps the Angular state in sync when the dialog closes', async () => {
    const fixture = await createFixture();
    fixture.componentInstance.dialogOpen = true;

    fixture.componentInstance.closeDialog(
      new CustomEvent('dialog-close', {
        detail: { reason: 'escape' },
      }),
    );

    expect(fixture.componentInstance.dialogOpen).toBe(false);
    expect(fixture.componentInstance.lastCloseReason).toBe('escape');
  });

  it('uses the dialog close API for action buttons', () => {
    const close = vi.fn();
    const dialog = { close } as unknown as HTMLElement;

    TestBed.createComponent(DialogComponent).componentInstance.closeFromAction(
      dialog,
    );

    expect(close).toHaveBeenCalledWith('action');
  });
});
