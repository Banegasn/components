import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { provideRouter, Router, TitleStrategy } from '@angular/router';

import { AppTitleStrategy } from './app.config';

@Component({ template: '' })
class EmptyRouteComponent {}

describe('AppTitleStrategy', () => {
  it('updates the document title and social metadata from route data', async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'test-route',
            component: EmptyRouteComponent,
            title: 'Test Route',
            data: { description: 'A route-specific test description.' },
          },
        ]),
        { provide: TitleStrategy, useClass: AppTitleStrategy },
      ],
    }).compileComponents();

    const router = TestBed.inject(Router);
    const title = TestBed.inject(Title);
    const meta = TestBed.inject(Meta);

    await router.navigateByUrl('/test-route');

    expect(title.getTitle()).toBe('Material 3 Expressive - Test Route');
    expect(meta.getTag('property="og:title"')?.content).toBe(
      'Material 3 Expressive - Test Route',
    );
    expect(meta.getTag('name="twitter:title"')?.content).toBe(
      'Material 3 Expressive - Test Route',
    );
    expect(meta.getTag('name="description"')?.content).toBe(
      'A route-specific test description.',
    );
    expect(meta.getTag('property="og:description"')?.content).toBe(
      'A route-specific test description.',
    );
    expect(meta.getTag('name="twitter:description"')?.content).toBe(
      'A route-specific test description.',
    );
  });
});
