import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
    fixture.componentRef.setInput('title', 'Buttons');
    fixture.componentRef.setInput(
      'description',
      'Material 3 button component reference.',
    );
    fixture.componentRef.setInput('eyebrow', 'Component reference');
    fixture.componentRef.setInput('icon', 'deployed_code');
    fixture.detectChanges();
  });

  it('renders the route metadata as one accessible page introduction', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('h1')).toHaveLength(1);
    expect(element.querySelector('h1')?.textContent).toContain('Buttons');
    expect(element.querySelector('p')?.textContent).toContain(
      'Material 3 button component reference.',
    );
    expect(
      element.querySelector('header')?.getAttribute('aria-labelledby'),
    ).toBe('route-page-title');
  });
});
