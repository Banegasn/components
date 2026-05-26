import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CodeBlockComponent } from "../../app/components/code-block/code-block.component";
import '@banegasn/m3-icon-button';

@Component({
  selector: 'app-icon-button',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.css'],
  imports: [CodeBlockComponent]
})
export class IconButtonComponent {
  readonly standardExample = `<m3-icon-button aria-label="Settings">\n  <span class="material-symbols-outlined">settings</span>\n</m3-icon-button>`;
  readonly filledExample = `<m3-icon-button variant="filled" aria-label="Add">\n  <span class="material-symbols-outlined">add</span>\n</m3-icon-button>`;
  readonly tonalExample = `<m3-icon-button variant="tonal" aria-label="Favorite">\n  <span class="material-symbols-outlined">favorite</span>\n</m3-icon-button>`;
  readonly outlinedExample = `<m3-icon-button variant="outlined" aria-label="Menu">\n  <span class="material-symbols-outlined">menu</span>\n</m3-icon-button>`;
  readonly toggleExample = `<m3-icon-button toggle aria-label="Bookmark">\n  <span class="material-symbols-outlined">bookmark</span>\n</m3-icon-button>`;
  readonly sizesExample = `<m3-icon-button size="small" aria-label="Close">\n  <span class="material-symbols-outlined">close</span>\n</m3-icon-button>\n<m3-icon-button aria-label="Close">\n  <span class="material-symbols-outlined">close</span>\n</m3-icon-button>\n<m3-icon-button size="large" aria-label="Close">\n  <span class="material-symbols-outlined">close</span>\n</m3-icon-button>`;
}
