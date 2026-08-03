import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import '@banegasn/m3-button';
import { describe, expect, it, vi } from 'vitest';

import { AppComponent } from './app.component';

@Component({
  template: '<m3-button variant="tonal">Integrated button</m3-button>',
  changeDetection: ChangeDetectionStrategy.Eager,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class CustomElementHostComponent {}

type ComponentsMenuElement = HTMLElement & {
  open: boolean;
  updateComplete: Promise<boolean>;
};

const settle = () => new Promise<void>((resolve) => setTimeout(resolve));

describe('AppComponent', () => {
  it('creates the application shell', async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.title).toBe(
      'Multi-Framework Components Demo',
    );
  });

  it('renders a workspace Lit custom element through an Angular template', async () => {
    await TestBed.configureTestingModule({
      imports: [CustomElementHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(CustomElementHostComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      'm3-button',
    ) as HTMLElement & {
      updateComplete: Promise<boolean>;
      variant: string;
    };
    await button.updateComplete;

    expect(button).toBeInstanceOf(customElements.get('m3-button'));
    expect(button.variant).toBe('tonal');
    expect(button.shadowRoot?.querySelector('button')).not.toBeNull();
    expect(button.textContent?.trim()).toBe('Integrated button');
  });

  it('keeps the Components submenu open across its pointer bridge, routes selections, and returns focus on Escape', async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);
    const navigateByUrl = vi
      .spyOn(router, 'navigateByUrl')
      .mockResolvedValue(true);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '#desktop-components-trigger',
    ) as HTMLElement;
    const desktopMenuTrigger = fixture.nativeElement.querySelector(
      '.desktop-components-trigger',
    ) as HTMLElement;
    const menu = fixture.nativeElement.querySelector(
      'm3-menu[placement="right-start"]',
    ) as ComponentsMenuElement;
    await menu.updateComplete;

    desktopMenuTrigger.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    await menu.updateComplete;
    expect(menu.open).toBe(true);

    desktopMenuTrigger.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.nativeElement
      .querySelector('.desktop-components-menu-bridge')
      .dispatchEvent(new MouseEvent('mouseenter'));
    // motion-literal-exempt: test-only dwell exceeds the non-motion close delay.
    await new Promise((resolve) => setTimeout(resolve, 175));
    expect(menu.open).toBe(true);

    const firstMenuItem = menu.querySelector('m3-menu-item') as HTMLElement;
    const firstMenuLink = firstMenuItem.closest('a');
    expect(firstMenuLink?.getAttribute('href')).toBe('components');
    firstMenuItem.shadowRoot!.querySelector('button')!.click();
    await settle();
    expect(navigateByUrl).toHaveBeenCalledWith('/components');
    expect(fixture.componentInstance.componentsMenuOpen()).toBe(false);

    trigger.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
    fixture.detectChanges();
    await menu.updateComplete;
    expect(menu.open).toBe(true);

    const surface = menu.shadowRoot!.querySelector<HTMLElement>('.surface')!;
    surface.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
    fixture.detectChanges();
    await menu.updateComplete;
    expect(menu.open).toBe(false);
    expect(trigger.shadowRoot!.activeElement?.tagName).toBe('BUTTON');
  });
});
