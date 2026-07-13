import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import '@banegasn/m3-button';

import { AppComponent } from './app.component';

@Component({
  template: '<m3-button variant="tonal">Integrated button</m3-button>',
  changeDetection: ChangeDetectionStrategy.Eager,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class CustomElementHostComponent {}

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
});
