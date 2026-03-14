
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, OnDestroy, DOCUMENT, NgZone, signal, DestroyRef } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import '@banegasn/m3-navigation-rail';
import '@banegasn/m3-navigation-bar';
import '@banegasn/m3-button';
import '@banegasn/m3-menu';

import { DialogService } from './services/dialog.service';
import { SettingsComponent } from './components/settings/settings.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  #document = inject(DOCUMENT);
  #dialogService = inject(DialogService);
  #router = inject(Router);
  #ngZone = inject(NgZone);
  #destroyRef = inject(DestroyRef);
  title = 'Multi-Framework Components Demo';
  currentTheme = 'light';
  currentRoute = signal('/');
  componentsMenuOpen = signal(false);
  railExpanded = signal(false);
  private mobileComponentsLongPressTimer: ReturnType<typeof setTimeout> | null = null;
  private mobileComponentsLongPressFired = false;
  private desktopComponentsCloseTimer: ReturnType<typeof setTimeout> | null = null;
  private boundMenuClick = (event: Event) => this.handleComponentsMenuClick(event);
  private boundMenuItemSelect = (event: Event) => this.handleMenuItemSelectCapture(event);

  onRailToggle(event: Event) {
    const e = event as CustomEvent<{ expanded: boolean }>;
    this.railExpanded.set(e.detail?.expanded ?? false);
  }

  readonly componentMenuItems = [
    { path: '/components', label: 'Browse all', icon: 'apps' },
    { path: '/buttons', label: 'Buttons', icon: 'smart_button' },
    { path: '/cards', label: 'Cards', icon: 'style' },
    { path: '/navigation-rail', label: 'Navigation Rail', icon: 'dock_to_left' },
    { path: '/navigation-bar', label: 'Navigation Bar', icon: 'bottom_navigation' },
    { path: '/switches', label: 'Switches', icon: 'toggle_on' },
    { path: '/radio-buttons', label: 'Radio Buttons', icon: 'radio_button_checked' },
    { path: '/search-bar', label: 'Search Bar', icon: 'search' },
    { path: '/split-button', label: 'Split Button', icon: 'arrow_split' },
    { path: '/menu', label: 'Menu', icon: 'menu' },
    { path: '/loading-indicator', label: 'Loading Indicator', icon: 'progress_activity' },
    { path: '/fab-menu', label: 'FAB Menu', icon: 'add_circle' }
  ];

  ngOnInit() {
    // Initialize theme
    this.initializeTheme();
    // Initialize RTL
    this.initializeRTL();
    
    // Listen for theme changes from settings dialog
    if (typeof window !== 'undefined') {
      window.addEventListener('theme-changed', ((event: CustomEvent) => {
        this.currentTheme = event.detail;
      }) as EventListener);
    }

    // Capture menu-item-select at document so we handle it before the menu (menu stays open until we close it)
    this.#document.addEventListener('menu-item-select', this.boundMenuItemSelect, true);
    // Fallback: click on menu item
    this.#document.addEventListener('click', this.boundMenuClick, true);

    // Track route changes for navigation bar active state
    this.currentRoute.set(this.#router.url);
    this.#router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe((event: any) => {
        this.currentRoute.set(event.url);
        this.closeComponentsMenu();
        this.scrollToTop();
      });
  }

  ngOnDestroy() {
    this.#document.removeEventListener('menu-item-select', this.boundMenuItemSelect, true);
    this.#document.removeEventListener('click', this.boundMenuClick, true);
  }

  initializeTheme() {
    let savedTheme = null;
    if (typeof localStorage !== 'undefined') {
      savedTheme = localStorage.getItem('theme');
    }
    
    if (savedTheme) {
      // Use saved theme
      this.#document.documentElement.setAttribute('theme', savedTheme);
      this.currentTheme = savedTheme;
    } else {
      // Use system preference
      let systemPrefersDark = false;
      if (typeof window !== 'undefined' && window.matchMedia) {
        systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      const theme = systemPrefersDark ? 'dark' : 'light';
      this.#document.documentElement.setAttribute('theme', theme);
      this.currentTheme = theme;
    }
  }

  initializeRTL() {
    let savedRTL = null;
    if (typeof localStorage !== 'undefined') {
      savedRTL = localStorage.getItem('rtl');
    }
    if (savedRTL === 'true') {
      this.#document.documentElement.setAttribute('dir', 'rtl');
    }
  }

  toggleTheme() {
    this.closeComponentsMenu();
    const currentTheme = this.#document.documentElement.getAttribute('theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.#document.documentElement.setAttribute('theme', newTheme);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
    this.currentTheme = newTheme;
  }

  openSettings() {
    this.closeComponentsMenu();
    this.#dialogService.open(SettingsComponent, {
      title: 'Settings',
      maxWidth: '500px',
      closeOnBackdrop: true,
      showCloseButton: true
    });
  }

  openGitHub() {
    this.closeComponentsMenu();
    window.open('https://github.com/banegasn/components', '_blank');
  }

  navigate(path: string) {
    this.closeComponentsMenu();
    this.#ngZone.run(() => this.#router.navigateByUrl(path));
  }

  isComponentsRoute() {
    return this.componentMenuItems.some((item) => item.path === this.currentRoute());
  }

  openComponentsMenu() {
    this.componentsMenuOpen.set(true);
  }

  toggleComponentsMenu() {
    this.componentsMenuOpen.update((open) => !open);
  }

  onComponentsMenuDismiss(event: Event) {
    const reason = (event as CustomEvent<{ reason: string }>)?.detail?.reason ?? 'unknown';
    const wasOpen = this.componentsMenuOpen();
    if (!wasOpen) return;
    // Defer close when user selected an item so menu-item-select can bubble and be handled first
    if (reason === 'selection') {
      queueMicrotask(() => this.closeComponentsMenu());
    } else {
      this.closeComponentsMenu();
    }
  }

  closeComponentsMenu() {
    const wasOpen = this.componentsMenuOpen();
    if (!wasOpen) return;
    
    if (this.desktopComponentsCloseTimer !== null) {
      clearTimeout(this.desktopComponentsCloseTimer);
      this.desktopComponentsCloseTimer = null;
    }
    this.componentsMenuOpen.set(false);
  }

  private isFromAppComponentsMenu(path: unknown[]): boolean {
    return path.some(
      (n) => n instanceof Element && (
        (n as Element).closest?.('.desktop-components-trigger') ||
        (n as Element).closest?.('.mobile-nav-shell')
      )
    );
  }

  handleComponentsMenuClick(event: Event) {
    const path = event.composedPath?.() ?? [];
    if (!this.isFromAppComponentsMenu(path)) return;

    const menuItem = path.find(
      (n): n is HTMLElement => n instanceof HTMLElement && n.tagName === 'M3-MENU-ITEM'
    );
    if (!menuItem) return;

    const value = (menuItem as unknown as { value?: string }).value ?? menuItem.getAttribute('value') ?? '';
    if (value) this.navigate(value);
  }

  onComponentsMenuItemSelect(event: Event) {
    this.handleMenuItemSelectCapture(event);
  }

  handleMenuItemSelectCapture(event: Event) {
    const path = event.composedPath?.() ?? [];
    const fromOurMenu = this.isFromAppComponentsMenu(path);
    if (!fromOurMenu) return;

    const e = event as CustomEvent<{ value?: string; text?: string }>;
    const value = e.detail?.value;
    if (value) {
      event.stopPropagation();
      event.preventDefault();
      this.navigate(value);
      return;
    }
    const text = e.detail?.text ?? '';
    const item = this.componentMenuItems.find((i) => i.label === text);
    if (item) {
      event.stopPropagation();
      event.preventDefault();
      this.navigate(item.path);
    }
  }

  onDesktopComponentsMouseEnter() {
    if (this.desktopComponentsCloseTimer !== null) {
      clearTimeout(this.desktopComponentsCloseTimer);
      this.desktopComponentsCloseTimer = null;
    }
    this.openComponentsMenu();
  }

  onDesktopComponentsMouseLeave() {
    this.desktopComponentsCloseTimer = setTimeout(() => {
      this.desktopComponentsCloseTimer = null;
      this.closeComponentsMenu();
    }, 150);
  }

  onMobileComponentsPointerDown(event: Event) {
    this.mobileComponentsLongPressFired = false;
    this.mobileComponentsLongPressTimer = setTimeout(() => {
      this.mobileComponentsLongPressTimer = null;
      this.mobileComponentsLongPressFired = true;
      this.openComponentsMenu();
    }, 500); // 500ms for long press
  }

  onMobileComponentsPointerUp(event: Event) {
    if (this.mobileComponentsLongPressTimer !== null) {
      clearTimeout(this.mobileComponentsLongPressTimer);
      this.mobileComponentsLongPressTimer = null;
    }
  }

  onMobileComponentsPointerCancel(event: Event) {
    if (this.mobileComponentsLongPressTimer !== null) {
      clearTimeout(this.mobileComponentsLongPressTimer);
      this.mobileComponentsLongPressTimer = null;
    }
  }

  onMobileComponentsContextMenu(event: Event) {
    event.preventDefault(); // Prevent browser context menu on long press
  }

  onMobileComponentsItemClick(event: Event) {
    // If long press fired, it means the menu opened. Don't navigate.
    if (this.mobileComponentsLongPressFired) {
      return;
    }
    this.navigate('/components');
  }

  scrollToTop() {
    const container = this.#document.querySelector('.app-container') as HTMLElement;
    if (container && typeof container.scrollTo === 'function') {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

}
