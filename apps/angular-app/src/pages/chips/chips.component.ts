import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CodeBlockComponent } from "../../app/components/code-block/code-block.component";
import '@banegasn/m3-chip';
import '@banegasn/m3-card';

@Component({
  selector: 'app-chips',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.css'],
  imports: [CodeBlockComponent],
})
export class ChipsComponent {
  readonly assistExample = `<m3-chip variant="assist">Assist</m3-chip>`;
  readonly filterExample = `<m3-chip variant="filter">Filter</m3-chip>
<m3-chip variant="filter" selected>Selected</m3-chip>`;
  readonly inputExample = `<m3-chip variant="input" removable>Input Chip</m3-chip>`;
  readonly suggestionExample = `<m3-chip variant="suggestion">Suggestion</m3-chip>`;
}
