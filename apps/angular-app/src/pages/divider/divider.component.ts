import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CodeBlockComponent } from "../../app/components/code-block/code-block.component";
import '@banegasn/m3-divider';

@Component({
  selector: 'app-divider',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.css'],
  imports: [CodeBlockComponent]
})
export class DividerComponent {
  readonly fullWidthExample = `<m3-divider></m3-divider>`;
  readonly insetExample = `<m3-divider variant="inset"></m3-divider>`;
  readonly middleExample = `<m3-divider variant="middle"></m3-divider>`;
  readonly verticalExample = `<div style="display:flex; gap:16px; align-items:center;">\n  <span>Item A</span>\n  <m3-divider orientation="vertical" style="height:24px;"></m3-divider>\n  <span>Item B</span>\n</div>`;
  readonly thicknessExample = `<m3-divider thickness="2"></m3-divider>\n<m3-divider thickness="4"></m3-divider>`;
  readonly pulsingExample = `<m3-divider pulsing></m3-divider>`;
}
