import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CodeBlockComponent } from "../../app/components/code-block/code-block.component";
import '@banegasn/m3-progress';

@Component({ selector: 'app-progress', schemas: [CUSTOM_ELEMENTS_SCHEMA], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './progress.component.html', styleUrls: ['./progress.component.css'], imports: [CodeBlockComponent] })
export class ProgressComponent {
  readonly determinateExample = `<m3-progress value="0.6"></m3-progress>`;
  readonly indeterminateExample = `<m3-progress indeterminate></m3-progress>`;
}
