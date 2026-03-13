import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CodeBlockComponent } from "../../app/components/code-block/code-block.component";

import '@banegasn/m3-navigation-rail';
import '@banegasn/m3-card';

@Component({
  selector: 'app-navigation-rail',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navigation-rail.component.html',
  styleUrls: ['./navigation-rail.component.css'],
  imports: [CodeBlockComponent],
})
export class NavigationRailComponent {

  onItemClick(event: any) {
    console.log('Navigation item clicked:', event.detail);
  }
}

