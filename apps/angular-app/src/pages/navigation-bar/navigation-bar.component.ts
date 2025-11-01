import { Component, ChangeDetectionStrategy, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import '@banegasn/m3-navigation-bar';
import '@banegasn/m3-card';

@Component({
  selector: 'app-navigation-bar',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css'],
  standalone: true,
})
export class NavigationBarComponent {
  selectedItem = 'Home';

  constructor(private cdr: ChangeDetectorRef) {}

  onItemClick(event: any) {
    console.log('Navigation item clicked:', event.detail);
    this.selectedItem = event.detail.label;
    this.cdr.markForCheck();
  }
}

