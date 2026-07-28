import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent motion verification', () => {
  it('activates and clears the demo reduced-motion token mode', async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    const fixture = TestBed.createComponent(SettingsComponent);
    fixture.detectChanges();

    fixture.componentInstance.onReducedMotionChange(new CustomEvent('switch-change', { detail: { checked: true } }));
    expect(document.documentElement.getAttribute('data-motion')).to.equal('reduced');

    fixture.componentInstance.onReducedMotionChange(new CustomEvent('switch-change', { detail: { checked: false } }));
    expect(document.documentElement.hasAttribute('data-motion')).to.equal(false);
  });
});
