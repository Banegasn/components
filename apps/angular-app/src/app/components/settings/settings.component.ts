import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { DialogRef } from '../../services/dialog.service';

import '@banegasn/m3-button';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  #document = inject(DOCUMENT);
  
  dialogRef?: DialogRef;
  currentTheme = 'light';
  isRTL = false;

  ngOnInit() {
    // Initialize current values
    this.currentTheme = this.#document.documentElement.getAttribute('theme') || 'light';
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

    // Emit event for app component to update
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: newTheme }));
  }

  toggleRTL() {
    this.isRTL = !this.isRTL;
    if (this.isRTL) {
      this.#document.documentElement.setAttribute('dir', 'rtl');
    } else {
      this.#document.documentElement.removeAttribute('dir');
    }
    // Save to localStorage
    localStorage.setItem('rtl', this.isRTL.toString());
  }
}

