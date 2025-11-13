
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, OnDestroy, DOCUMENT, signal, DestroyRef } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import '@banegasn/m3-navigation-rail';
import '@banegasn/m3-navigation-bar';
import '@banegasn/m3-button';

import { DialogService } from './services/dialog.service';
import { SettingsComponent } from './components/settings/settings.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  #document = inject(DOCUMENT);
  #dialogService = inject(DialogService);
  #router = inject(Router);
  #destroyRef = inject(DestroyRef);
  title = 'Multi-Framework Components Demo';
  currentTheme = 'light';
  currentRoute = signal('/');

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
    this.currentRoute.set(this.#router.url);
    this.#router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe((event: any) => {
        this.currentRoute.set(event.url);
        this.scrollToTop();
      });
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
    this.#document.documentElement.setAttribute('theme', newTheme);
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

  scrollToTop() {
    const container = this.#document.querySelector('.app-container') as HTMLElement;
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
