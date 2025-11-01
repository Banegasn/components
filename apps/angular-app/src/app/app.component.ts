
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, OnDestroy, DOCUMENT } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

import '@banegasn/m3-navigation-rail';
import '@banegasn/m3-navigation-bar';
import '@banegasn/m3-button';

import { DialogService } from './services/dialog.service';
import { SettingsComponent } from './components/settings/settings.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  #document = inject(DOCUMENT);
  #dialogService = inject(DialogService);
  #router = inject(Router);
  #routerSubscription?: Subscription;
  
  title = 'Multi-Framework Components Demo';
  currentTheme = 'light';
  currentRoute = '/';

  ngOnInit() {
    // Initialize theme
    this.initializeTheme();
    // Initialize RTL
    this.initializeRTL();
    
    // Listen for theme changes from settings dialog
    window.addEventListener('theme-changed', ((event: CustomEvent) => {
      this.currentTheme = event.detail;
    }) as EventListener);

    // Track route changes for navigation bar active state
    this.currentRoute = this.#router.url;
    this.#routerSubscription = this.#router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });
  }

  ngOnDestroy() {
    this.#routerSubscription?.unsubscribe();
  }

  initializeTheme() {
    // Check localStorage first, then fall back to system preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      // Use saved theme
      this.#document.documentElement.setAttribute('theme', savedTheme);
      this.currentTheme = savedTheme;
    } else {
      // Use system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = systemPrefersDark ? 'dark' : 'light';
      this.#document.documentElement.setAttribute('theme', theme);
      this.currentTheme = theme;
    }
  }

  initializeRTL() {
    const savedRTL = localStorage.getItem('rtl');
    if (savedRTL === 'true') {
      this.#document.documentElement.setAttribute('dir', 'rtl');
    }
  }

  toggleTheme() {
    const currentTheme = this.#document.documentElement.getAttribute('theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    // Set the theme
    this.#document.documentElement.setAttribute('theme', newTheme);
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    this.currentTheme = newTheme;
  }

  openSettings() {
    this.#dialogService.open(SettingsComponent, {
      title: 'Settings',
      maxWidth: '500px',
      closeOnBackdrop: true,
      showCloseButton: true
    });
  }

  openGitHub() {
    window.open('https://github.com/banegasn/components', '_blank');
  }

  navigate(path: string) {
    this.#router.navigate([path]);
  }

  isActiveRoute(path: string): boolean {
    return this.currentRoute === path || this.currentRoute.startsWith(path + '/');
  }
}
