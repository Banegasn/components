import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CodeBlockComponent } from "../../app/components/code-block/code-block.component";
import '@banegasn/m3-badge';
import '@banegasn/m3-button';

@Component({ selector: 'app-badge', schemas: [CUSTOM_ELEMENTS_SCHEMA], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './badge.component.html', styleUrls: ['./badge.component.css'], imports: [CodeBlockComponent] })
export class BadgeComponent {
  readonly dotExample = `<m3-badge><span class="material-symbols-outlined">mail</span></m3-badge>`;
  readonly labelExample = `<m3-badge label="3"><span class="material-symbols-outlined">notifications</span></m3-badge>`;
}
