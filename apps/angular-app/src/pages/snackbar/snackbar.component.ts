import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";
import { CodeBlockComponent } from "../../app/components/code-block/code-block.component";
import '@banegasn/m3-snackbar';
import '@banegasn/m3-button';

@Component({
  selector: 'app-snackbar',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css'],
  imports: [CodeBlockComponent]
})
export class SnackbarComponent {
  showBasic = signal(false);
  showAction = signal(false);
  showTwoLine = signal(false);

  readonly basicExample = `<m3-snackbar open>Message sent</m3-snackbar>`;
  readonly actionExample = `<m3-snackbar open>Message deleted\n  <m3-button slot="action" variant="text">Undo</m3-button>\n</m3-snackbar>`;
  readonly twoLineExample = `<m3-snackbar open lines="2">\n  This item was moved to trash. It will be deleted permanently in 30 days.\n  <m3-button slot="action" variant="text">Undo</m3-button>\n</m3-snackbar>`;
}
