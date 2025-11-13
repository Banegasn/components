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
  currentTheme = 'light';
  isRTL = false;
  darkModeEnabled = false;

  ngOnInit() {
    // Initialize current values
    this.currentTheme = this.#document.documentElement.getAttribute('theme') || 'light';
    this.darkModeEnabled = this.currentTheme === 'dark';
    this.isRTL = this.#document.documentElement.getAttribute('dir') === 'rtl';
  }

  toggleTheme() {
    const currentTheme = this.#document.documentElement.getAttribute('theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Set the theme
    this.#document.documentElement.setAttribute('theme', newTheme);

    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    this.currentTheme = newTheme;
    this.darkModeEnabled = newTheme === 'dark';

    // Emit event for app component to update
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: newTheme }));
  }

  onDarkModeChange(event: Event) {
    const checked = (event as CustomEvent).detail.checked;
    this.darkModeEnabled = checked;
    const newTheme = checked ? 'dark' : 'light';

    // Set the theme
    this.#document.documentElement.setAttribute('theme', newTheme);

    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    this.currentTheme = newTheme;

    // Emit event for app component to update
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: newTheme }));
  }

  onRTLChange(event: Event) {
    const checked = (event as CustomEvent).detail.checked;
    this.isRTL = checked;
    
    if (this.isRTL) {
      this.#document.documentElement.setAttribute('dir', 'rtl');
    } else {
      this.#document.documentElement.removeAttribute('dir');
    }
    // Save to localStorage
    localStorage.setItem('rtl', this.isRTL.toString());
  }
}

