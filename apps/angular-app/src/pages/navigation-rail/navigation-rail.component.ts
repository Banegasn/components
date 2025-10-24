import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import '@banegasn/m3-navigation-rail';

@Component({
  selector: 'app-navigation-rail',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navigation-rail.component.html',
  styleUrls: ['./navigation-rail.component.css'],
})
export class NavigationRailComponent {

  onItemClick(event: any) {
    console.log('Navigation item clicked:', event.detail);
  }
}

