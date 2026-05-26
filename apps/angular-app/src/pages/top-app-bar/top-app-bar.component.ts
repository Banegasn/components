import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CodeBlockComponent } from "../../app/components/code-block/code-block.component";
import '@banegasn/m3-top-app-bar';
import '@banegasn/m3-icon-button';

@Component({
  selector: 'app-top-app-bar',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './top-app-bar.component.html',
  styleUrls: ['./top-app-bar.component.css'],
  imports: [CodeBlockComponent]
})
export class TopAppBarComponent {
  readonly smallExample = `<m3-top-app-bar>\n  <m3-icon-button slot="navigation-icon" aria-label="Menu"><span class="material-symbols-outlined">menu</span></m3-icon-button>\n  My App\n  <span slot="actions">\n    <m3-icon-button aria-label="Search"><span class="material-symbols-outlined">search</span></m3-icon-button>\n  </span>\n</m3-top-app-bar>`;
  readonly centerExample = `<m3-top-app-bar variant="center-aligned">\n  <m3-icon-button slot="navigation-icon" aria-label="Back"><span class="material-symbols-outlined">arrow_back</span></m3-icon-button>\n  Page Title\n</m3-top-app-bar>`;
  readonly mediumExample = `<m3-top-app-bar variant="medium">\n  <m3-icon-button slot="navigation-icon" aria-label="Menu"><span class="material-symbols-outlined">menu</span></m3-icon-button>\n  Headline\n</m3-top-app-bar>`;
  readonly largeExample = `<m3-top-app-bar variant="large">\n  <m3-icon-button slot="navigation-icon" aria-label="Menu"><span class="material-symbols-outlined">menu</span></m3-icon-button>\n  Large Headline\n</m3-top-app-bar>`;
}
