import {
  Component,
  inject,
  CUSTOM_ELEMENTS_SCHEMA,
  DOCUMENT,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DialogRef } from '../../services/dialog.service';
import { M3Switch } from '@banegasn/m3-switch';

@Component({
  selector: 'app-settings',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  #document = inject(DOCUMENT);

  dialogRef?: DialogRef;
  darkModeEnabled = false;
  reducedMotionEnabled = false;
  isRTL = false;
  activePalette = 'indigo';

  readonly palettes = [
    { id: 'indigo', label: 'Indigo', color: '#5b5bd6' },
    { id: 'emerald', label: 'Emerald', color: '#059669' },
    { id: 'rose', label: 'Rose', color: '#e11d48' },
    { id: 'amber', label: 'Amber', color: '#d97706' },
  ];

  ngOnInit() {
    const savedTheme =
      this.#document.documentElement.getAttribute('theme') || 'light';
    this.darkModeEnabled = savedTheme.endsWith('dark') || savedTheme === 'dark';
    this.activePalette = this.#getPaletteFromTheme(savedTheme);
    this.isRTL = this.#document.documentElement.getAttribute('dir') === 'rtl';
    const savedMotion = typeof localStorage !== 'undefined' ? localStorage.getItem('motion') : null;
    this.reducedMotionEnabled = savedMotion === 'reduced' || this.#document.documentElement.getAttribute('data-motion') === 'reduced';
    if (this.reducedMotionEnabled) {
      this.#document.documentElement.setAttribute('data-motion', 'reduced');
    }
  }

  #getPaletteFromTheme(theme: string): string {
    if (theme.startsWith('emerald')) return 'emerald';
    if (theme.startsWith('rose')) return 'rose';
    if (theme.startsWith('amber')) return 'amber';
    return 'indigo';
  }

  #buildTheme(palette: string, dark: boolean): string {
    if (palette === 'indigo') return dark ? 'dark' : 'light';
    return dark ? `${palette}-dark` : palette;
  }

  #applyTheme(theme: string) {
    this.#document.documentElement.setAttribute('theme', theme);
    if (typeof localStorage !== 'undefined')
      localStorage.setItem('theme', theme);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('theme-changed', { detail: theme }));
    }
  }

  setPalette(paletteId: string) {
    this.activePalette = paletteId;
    this.#applyTheme(this.#buildTheme(paletteId, this.darkModeEnabled));
  }

  onDarkModeChange(event: Event) {
    this.darkModeEnabled = this.#getSwitchChecked(event);
    this.#applyTheme(
      this.#buildTheme(this.activePalette, this.darkModeEnabled),
    );
  }

  onRTLChange(event: Event) {
    this.isRTL = this.#getSwitchChecked(event);
    if (this.isRTL) {
      this.#document.documentElement.setAttribute('dir', 'rtl');
    } else {
      this.#document.documentElement.removeAttribute('dir');
    }
    if (typeof localStorage !== 'undefined')
      localStorage.setItem('rtl', this.isRTL.toString());
  }

  onReducedMotionChange(event: Event) {
    this.reducedMotionEnabled = this.#getSwitchChecked(event);
    if (this.reducedMotionEnabled) {
      this.#document.documentElement.setAttribute('data-motion', 'reduced');
    } else {
      this.#document.documentElement.removeAttribute('data-motion');
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('motion', this.reducedMotionEnabled ? 'reduced' : 'system');
    }
  }

  #getSwitchChecked(event: Event): boolean {
    const switchElement = event.currentTarget ?? event.target;
    return switchElement instanceof M3Switch && switchElement.checked;
  }
}
