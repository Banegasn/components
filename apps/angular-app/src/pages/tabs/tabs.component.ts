import {
  Component,
  ChangeDetectionStrategy,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CodeBlockComponent } from '../../app/components/code-block/code-block.component';
import '@banegasn/m3-tabs';

@Component({
  selector: 'app-tabs',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
  imports: [CodeBlockComponent],
})
export class TabsComponent {
  readonly basicExample = `<m3-tabs active-tab="0" (tab-change)="onTabChange($event)">
  <m3-tab panel="one-panel" value="one">Tab One</m3-tab>
  <m3-tab panel="two-panel" value="two">Tab Two</m3-tab>
  <m3-tab panel="three-panel" value="three">Tab Three</m3-tab>
</m3-tabs>
<section id="one-panel">Tab One content</section>
<section id="two-panel" hidden>Tab Two content</section>
<section id="three-panel" hidden>Tab Three content</section>`;
}
