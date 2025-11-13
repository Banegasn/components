import { Component, ChangeDetectionStrategy, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, inject, } from "@angular/core";
import { Router } from "@angular/router";
import '@banegasn/m3-button';
import '@banegasn/m3-card';
import '@banegasn/m3-switch';

@Component({
  selector: 'app-components ',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsComponent {
  readonly router = inject(Router);

  navigateToButtons() {
    this.router.navigate(['/buttons']);
  }

  navigateToCards() {
    this.router.navigate(['/cards']);
  }

  navigateToNavigationRail() {
    this.router.navigate(['/navigation-rail']);
  }

  navigateToNavigationBar() {
    this.router.navigate(['/navigation-bar']);
  }

  navigateToSwitches() {
    this.router.navigate(['/switches']);
  }
}