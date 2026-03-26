import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CodeBlockComponent } from "../../app/components/code-block/code-block.component";
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

  readonly basicExample = `<m3-dialog open headline="Dialog Title">
  <p>Dialog body text goes here.</p>
  <m3-button slot="actions" variant="text">Cancel</m3-button>
  <m3-button slot="actions">Confirm</m3-button>
</m3-dialog>`;

  openDialog() { this.dialogOpen = true; }
  closeDialog() { this.dialogOpen = false; }
}
