import {
  Component,
  ChangeDetectionStrategy,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CodeBlockComponent } from '../../app/components/code-block/code-block.component';
import '@banegasn/m3-dialog';
import '@banegasn/m3-button';
import '@banegasn/m3-card';

@Component({
  selector: 'app-dialog',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  imports: [CodeBlockComponent],
})
export class DialogComponent {
  dialogOpen = false;
  lastCloseReason = '—';

  readonly basicExample = `<m3-dialog open headline="Dialog Title">
  <p>Dialog body text goes here.</p>
  <button slot="actions" onclick="this.closest('m3-dialog').close('action')">Cancel</button>
  <button slot="actions" onclick="this.closest('m3-dialog').close('action')">Confirm</button>
</m3-dialog>`;

  openDialog() {
    this.dialogOpen = true;
  }

  closeFromAction(dialog: HTMLElement) {
    (dialog as HTMLElement & { close(reason: 'action'): boolean }).close(
      'action',
    );
  }

  closeDialog(event: Event) {
    this.dialogOpen = false;
    this.lastCloseReason = (
      event as CustomEvent<{ reason: string }>
    ).detail.reason;
  }
}
