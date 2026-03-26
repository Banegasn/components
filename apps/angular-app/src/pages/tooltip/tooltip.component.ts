import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CodeBlockComponent } from "../../app/components/code-block/code-block.component";
import '@banegasn/m3-tooltip';
import '@banegasn/m3-button';

@Component({
  selector: 'app-tooltip',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css'],
  imports: [CodeBlockComponent],
})
export class TooltipComponent {
  readonly basicExample = `<m3-tooltip text="Save" placement="top">
  <m3-button>Save</m3-button>
</m3-tooltip>`;
}
