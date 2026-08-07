import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  OnDestroy,
  DOCUMENT,
  NgZone,
  signal,
  DestroyRef,
  effect,
  PLATFORM_ID,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import '@banegasn/m3-navigation-rail';
import '@banegasn/m3-navigation-bar';
import '@banegasn/m3-button';
import '@banegasn/m3-menu';

import { DialogService } from './services/dialog.service';
import { SettingsComponent } from './components/settings/settings.component';

import { SeoLinkComponent } from './components/seo-link/seo-link.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';

interface PageMeta {
  title: string;
  description: string;
  eyebrow: string;
  icon: string;
}

type ComponentsMenuElement = HTMLElement & {
  open: boolean;
  show(reason: 'trigger', opener: HTMLElement): void;
};

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SeoLinkComponent, PageHeaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  #document = inject(DOCUMENT);
  #dialogService = inject(DialogService);
  #router = inject(Router);
  #ngZone = inject(NgZone);
  #destroyRef = inject(DestroyRef);
  #platformId = inject(PLATFORM_ID);
  #changeDetectorRef = inject(ChangeDetectorRef);
  title = 'Multi-Framework Components Demo';
  currentTheme = 'light';
  currentRoute = signal('/');
  pageMeta = signal<PageMeta | null>(null);
  desktopComponentsMenuOpen = signal(false);
  mobileComponentsMenuOpen = signal(false);
  railExpanded = signal(true);

  constructor() {
    if (isPlatformBrowser(this.#platformId)) {
      const railExpanded = localStorage.getItem('railExpanded');
      if (railExpanded !== null) {
        this.railExpanded.set(JSON.parse(railExpanded));
      }

      effect(() => {
        localStorage.setItem(
          'railExpanded',
          JSON.stringify(this.railExpanded()),
        );
      });
    }
  }
  private mobileComponentsLongPressTimer: ReturnType<typeof setTimeout> | null =
    null;
  private mobileComponentsLongPressFired = false;
  private desktopComponentsCloseTimer: ReturnType<typeof setTimeout> | null =
    null;

  onRailToggle(event: Event) {
    const e = event as CustomEvent<{ expanded: boolean }>;
    this.railExpanded.set(e.detail?.expanded ?? false);
  }

  readonly componentMenuItems = [
    { path: '/components', label: 'Browse all', icon: 'apps' },
    { path: '/buttons', label: 'Buttons', icon: 'smart_button' },
    { path: '/divider', label: 'Divider', icon: 'horizontal_rule' },
    { path: '/list', label: 'List', icon: 'list' },
    { path: '/cards', label: 'Cards', icon: 'style' },
    {
      path: '/navigation-rail',
      label: 'Navigation Rail',
      icon: 'dock_to_left',
    },
    {
      path: '/navigation-bar',
      label: 'Navigation Bar',
      icon: 'bottom_navigation',
    },
    { path: '/switches', label: 'Switches', icon: 'toggle_on' },
    {
      path: '/radio-buttons',
      label: 'Radio Buttons',
      icon: 'radio_button_checked',
    },
    { path: '/checkboxes', label: 'Checkboxes', icon: 'check_box' },
    { path: '/sliders', label: 'Sliders', icon: 'linear_scale' },
    { path: '/text-fields', label: 'Text Fields', icon: 'text_fields' },
    { path: '/chips', label: 'Chips', icon: 'label' },
    { path: '/dialog', label: 'Dialog', icon: 'chat_bubble' },
    { path: '/tooltip', label: 'Tooltip', icon: 'info' },
    { path: '/badge', label: 'Badge', icon: 'badge' },
    { path: '/progress', label: 'Progress', icon: 'hourglass_empty' },
    { path: '/tabs', label: 'Tabs', icon: 'tab' },
    { path: '/search-bar', label: 'Search Bar', icon: 'search' },
    { path: '/split-button', label: 'Split Button', icon: 'arrow_split' },
    { path: '/menu', label: 'Menu', icon: 'menu' },
    {
      path: '/loading-indicator',
      label: 'Loading Indicator',
      icon: 'progress_activity',
    },
    { path: '/fab-menu', label: 'FAB Menu', icon: 'add_circle' },
    { path: '/icon-button', label: 'Icon Button', icon: 'smart_button' },
    { path: '/top-app-bar', label: 'Top App Bar', icon: 'web_asset' },
    { path: '/snackbar', label: 'Snackbar', icon: 'notifications' },
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
        this.#changeDetectorRef.markForCheck();
      }) as EventListener);
    }

    // Track route changes for navigation bar active state
    this.syncRouteState(this.#router.url);
    this.#router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe((event: any) => {
        this.syncRouteState(event.urlAfterRedirects);
        this.closeComponentsMenu();
        this.scrollToTop();
      });
  }

  private syncRouteState(url: string) {
    const path = url.split(/[?#]/, 1)[0];
    this.currentRoute.set(path);

    let snapshot = this.#router.routerState.snapshot.root;
    while (snapshot.firstChild) snapshot = snapshot.firstChild;

    const title = snapshot.routeConfig?.title;
    const description = snapshot.data['description'];
    if (typeof title !== 'string' || typeof description !== 'string') {
      this.pageMeta.set(null);
      return;
    }

    const contextualMeta: Record<string, Pick<PageMeta, 'eyebrow' | 'icon'>> = {
      '/quick-start': { eyebrow: 'Getting started', icon: 'rocket_launch' },
      '/components': { eyebrow: 'Component library', icon: 'widgets' },
      '/contact': { eyebrow: 'Community', icon: 'forum' },
    };
    const context = contextualMeta[path] ?? {
      eyebrow: 'Component reference',
      icon: 'deployed_code',
    };

    this.pageMeta.set({ title, description, ...context });
  }

  ngOnDestroy() {
    if (this.desktopComponentsCloseTimer !== null) {
      clearTimeout(this.desktopComponentsCloseTimer);
    }
    if (this.mobileComponentsLongPressTimer !== null) {
      clearTimeout(this.mobileComponentsLongPressTimer);
    }
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
        systemPrefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)',
        ).matches;
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
    const currentTheme =
      this.#document.documentElement.getAttribute('theme') || 'light';
    const isDark = currentTheme.endsWith('dark') || currentTheme === 'dark';
    const palette =
      currentTheme.replace(/-?dark$/, '').replace(/^light$/, '') || '';
    const newTheme = isDark
      ? palette || 'light'
      : palette
        ? `${palette}-dark`
        : 'dark';
    this.#document.documentElement.setAttribute('theme', newTheme);
    if (typeof localStorage !== 'undefined')
      localStorage.setItem('theme', newTheme);
    this.currentTheme = newTheme;
  }

  openSettings() {
    this.closeComponentsMenu();
    this.#dialogService.open(SettingsComponent, {
      title: 'Settings',
      maxWidth: '500px',
      closeOnBackdrop: true,
      showCloseButton: true,
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
    return this.componentMenuItems.some(
      (item) => item.path === this.currentRoute(),
    );
  }

  isDarkTheme() {
    return this.currentTheme === 'dark' || this.currentTheme.endsWith('-dark');
  }

  openDesktopComponentsMenu() {
    this.desktopComponentsMenuOpen.set(true);
  }

  openComponentsMenuFromKeyboard() {
    const menu = this.#document.querySelector<ComponentsMenuElement>(
      '#desktop-components-menu',
    );
    const trigger = this.#document.querySelector<HTMLElement>(
      '#desktop-components-trigger',
    );
    const opener = trigger?.shadowRoot?.querySelector<HTMLElement>('button');

    if (menu && opener) {
      menu.show('trigger', opener);
    }
    this.openDesktopComponentsMenu();
  }

  openMobileComponentsMenu() {
    this.mobileComponentsMenuOpen.set(true);
  }

  onDesktopComponentsMenuDismiss(event: Event) {
    this.handleComponentsMenuDismiss(event, () =>
      this.closeDesktopComponentsMenu(),
    );
  }

  onMobileComponentsMenuDismiss(event: Event) {
    this.handleComponentsMenuDismiss(event, () =>
      this.mobileComponentsMenuOpen.set(false),
    );
  }

  private handleComponentsMenuDismiss(event: Event, close: () => void) {
    const reason =
      (event as CustomEvent<{ reason: string }>)?.detail?.reason ?? 'unknown';
    if (reason === 'selection') {
      queueMicrotask(close);
    } else {
      close();
    }
  }

  closeComponentsMenu() {
    this.closeDesktopComponentsMenu();
    this.mobileComponentsMenuOpen.set(false);
  }

  private closeDesktopComponentsMenu() {
    if (this.desktopComponentsCloseTimer !== null) {
      clearTimeout(this.desktopComponentsCloseTimer);
      this.desktopComponentsCloseTimer = null;
    }
    this.desktopComponentsMenuOpen.set(false);
  }

  onDesktopComponentsMouseEnter() {
    if (this.desktopComponentsCloseTimer !== null) {
      clearTimeout(this.desktopComponentsCloseTimer);
      this.desktopComponentsCloseTimer = null;
    }
    this.openDesktopComponentsMenu();
  }

  onDesktopComponentsMouseLeave() {
    this.desktopComponentsCloseTimer = setTimeout(() => {
      this.desktopComponentsCloseTimer = null;
      this.desktopComponentsMenuOpen.set(false);
    }, 150); // motion-literal-exempt: pointer-intent debounce, not animation timing.
  }

  onDesktopComponentsTriggerKeydown(event: KeyboardEvent) {
    if (!['Enter', ' ', 'ArrowRight'].includes(event.key)) {
      return;
    }

    event.preventDefault();
    this.openComponentsMenuFromKeyboard();
  }

  onDesktopComponentsTriggerClick(event: Event) {
    event.preventDefault();
    this.openComponentsMenuFromKeyboard();
  }

  onComponentsMenuLinkClick(event: MouseEvent, path: string) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    this.navigate(path);
  }

  onMobileComponentsPointerDown(_event: Event) {
    this.mobileComponentsLongPressFired = false;
    this.mobileComponentsLongPressTimer = setTimeout(() => {
      this.mobileComponentsLongPressTimer = null;
      this.mobileComponentsLongPressFired = true;
      this.openMobileComponentsMenu();
    }, 500); // motion-literal-exempt: long-press interaction threshold, not animation timing.
  }

  onMobileComponentsPointerUp(_event: Event) {
    if (this.mobileComponentsLongPressTimer !== null) {
      clearTimeout(this.mobileComponentsLongPressTimer);
      this.mobileComponentsLongPressTimer = null;
    }
  }

  onMobileComponentsPointerCancel(_event: Event) {
    if (this.mobileComponentsLongPressTimer !== null) {
      clearTimeout(this.mobileComponentsLongPressTimer);
      this.mobileComponentsLongPressTimer = null;
    }
  }

  onMobileComponentsContextMenu(event: Event) {
    event.preventDefault(); // Prevent browser context menu on long press
  }

  onMobileComponentsItemClick(_event: Event) {
    // If long press fired, it means the menu opened. Don't navigate.
    if (this.mobileComponentsLongPressFired) {
      return;
    }
    this.navigate('/components');
  }

  scrollToTop() {
    const container = this.#document.querySelector(
      '.app-container',
    ) as HTMLElement;
    if (container && typeof container.scrollTo === 'function') {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
