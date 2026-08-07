import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { M3Switch } from '@banegasn/m3-switch';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    document.documentElement.setAttribute('theme', 'light');
    document.documentElement.removeAttribute('dir');
    document.documentElement.removeAttribute('data-motion');
    localStorage.clear();
  });

  afterEach(() => {
    document.documentElement.setAttribute('theme', 'light');
    document.documentElement.removeAttribute('dir');
    document.documentElement.removeAttribute('data-motion');
    localStorage.clear();
  });

  function changeSwitch(element: M3Switch, checked: boolean) {
    element.checked = checked;
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }

  it('applies dark mode and RTL from native switch change events', () => {
    const fixture = TestBed.createComponent(SettingsComponent);
    fixture.detectChanges();

    const switches = fixture.nativeElement.querySelectorAll(
      'm3-switch',
    ) as NodeListOf<M3Switch>;
    const darkModeSwitch = switches[0];
    const rtlSwitch = switches[2];

    changeSwitch(darkModeSwitch, true);
    expect(document.documentElement.getAttribute('theme')).to.equal('dark');
    expect(localStorage.getItem('theme')).to.equal('dark');

    changeSwitch(rtlSwitch, true);
    expect(document.documentElement.getAttribute('dir')).to.equal('rtl');
    expect(localStorage.getItem('rtl')).to.equal('true');

    changeSwitch(darkModeSwitch, false);
    changeSwitch(rtlSwitch, false);
    expect(document.documentElement.getAttribute('theme')).to.equal('light');
    expect(document.documentElement.hasAttribute('dir')).to.equal(false);
  });

  it('activates and clears the demo reduced-motion token mode', () => {
    const fixture = TestBed.createComponent(SettingsComponent);
    fixture.detectChanges();

    const motionSwitch = fixture.nativeElement.querySelectorAll(
      'm3-switch',
    )[1] as M3Switch;

    changeSwitch(motionSwitch, true);
    expect(document.documentElement.getAttribute('data-motion')).to.equal(
      'reduced',
    );

    changeSwitch(motionSwitch, false);
    expect(document.documentElement.hasAttribute('data-motion')).to.equal(
      false,
    );
  });
});
