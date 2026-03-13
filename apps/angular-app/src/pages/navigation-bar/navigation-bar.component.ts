import { Component, ChangeDetectionStrategy, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CodeBlockComponent } from "../../app/components/code-block/code-block.component";

import '@banegasn/m3-navigation-bar';
import '@banegasn/m3-card';

@Component({
  selector: 'app-navigation-bar',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css'],
  standalone: true,
  imports: [CodeBlockComponent],
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

