import { Component, inject, CUSTOM_ELEMENTS_SCHEMA, DOCUMENT, OnInit } from '@angular/core';
import { DialogRef } from '../../services/dialog.service';
import '@banegasn/m3-switch';

@Component({
  selector: 'app-settings',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  #document = inject(DOCUMENT);

  dialogRef?: DialogRef;
  darkModeEnabled = false;
  isRTL = false;
  activePalette = 'indigo';

  readonly palettes = [
    { id: 'indigo', label: 'Indigo', color: '#5b5bd6' },
    { id: 'emerald', label: 'Emerald', color: '#059669' },
    { id: 'rose', label: 'Rose', color: '#e11d48' },
    { id: 'amber', label: 'Amber', color: '#d97706' },
  ];

  ngOnInit() {
    const savedTheme = this.#document.documentElement.getAttribute('theme') || 'light';
    this.darkModeEnabled = savedTheme.endsWith('dark') || savedTheme === 'dark';
    this.activePalette = this.#getPaletteFromTheme(savedTheme);
    this.isRTL = this.#document.documentElement.getAttribute('dir') === 'rtl';
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
    if (typeof localStorage !== 'undefined') localStorage.setItem('theme', theme);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('theme-changed', { detail: theme }));
    }
  }

  setPalette(paletteId: string) {
    this.activePalette = paletteId;
    this.#applyTheme(this.#buildTheme(paletteId, this.darkModeEnabled));
  }

  onDarkModeChange(event: Event) {
    this.darkModeEnabled = (event as CustomEvent).detail.checked;
    this.#applyTheme(this.#buildTheme(this.activePalette, this.darkModeEnabled));
  }

  onRTLChange(event: Event) {
    this.isRTL = (event as CustomEvent).detail.checked;
    if (this.isRTL) {
      this.#document.documentElement.setAttribute('dir', 'rtl');
    } else {
      this.#document.documentElement.removeAttribute('dir');
    }
    if (typeof localStorage !== 'undefined') localStorage.setItem('rtl', this.isRTL.toString());
  }
}
