import { Component, ChangeDetectionStrategy, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, inject, } from "@angular/core";
import { Router } from "@angular/router";
import '@banegasn/m3-button';
import '@banegasn/m3-card';
import '@banegasn/m3-switch';
import '@banegasn/m3-radio-button';
import '@banegasn/m3-split-button';
import '@banegasn/m3-loading-indicator';
import '@banegasn/m3-fab-menu';
import '@banegasn/m3-menu';

import { SeoLinkDirective } from '../../app/directives/seo-link.directive';

@Component({
  selector: 'app-components ',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [SeoLinkDirective],
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

  navigateToRadioButtons() {
    this.router.navigate(['/radio-buttons']);
  }

  navigateToSearchBar() {
    this.router.navigate(['/search-bar']);
  }

  navigateToSplitButton() {
    this.router.navigate(['/split-button']);
  }

  navigateToLoadingIndicator() {
    this.router.navigate(['/loading-indicator']);
  }

  navigateToMenu() {
    this.router.navigate(['/menu']);
  }

  navigateToFabMenu() {
    this.router.navigate(['/fab-menu']);
  }
}