import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CodeBlockComponent } from "../../app/components/code-block/code-block.component";
import '@banegasn/m3-list';

@Component({
  selector: 'app-list',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  imports: [CodeBlockComponent]
})
export class ListComponent {
  readonly simpleExample = `<m3-list>\n  <m3-list-item>Item One</m3-list-item>\n  <m3-list-item>Item Two</m3-list-item>\n  <m3-list-item>Item Three</m3-list-item>\n</m3-list>`;
  readonly staggeredExample = `<m3-list staggered>\n  <m3-list-item>Item 1</m3-list-item>\n  <m3-list-item>Item 2</m3-list-item>\n  <m3-list-item>Item 3</m3-list-item>\n</m3-list>`;
  readonly twoLineExample = `<m3-list>\n  <m3-list-item lines="2">\n    <span slot="leading" class="material-symbols-outlined">person</span>\n    Alice Smith\n    <span slot="supporting-text">Software Engineer</span>\n  </m3-list-item>\n  <m3-list-item lines="2">\n    <span slot="leading" class="material-symbols-outlined">person</span>\n    Bob Jones\n    <span slot="supporting-text">Product Designer</span>\n  </m3-list-item>\n</m3-list>`;
  readonly selectedExample = `<m3-list>\n  <m3-list-item selected>Selected Item</m3-list-item>\n  <m3-list-item>Normal Item</m3-list-item>\n</m3-list>`;
  readonly roundedExample = `<m3-list>\n  <m3-list-item shape="rounded">Rounded 1</m3-list-item>\n  <m3-list-item shape="rounded">Rounded 2</m3-list-item>\n</m3-list>`;
}
