import { DOCUMENT } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

import '@banegasn/m3-navigation-rail';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  #document = inject(DOCUMENT);
  title = 'Multi-Framework Components Demo';
  currentTheme = 'light';

  ngOnInit() {
    // Initialize theme
    this.initializeTheme();
  }

  initializeTheme() {
    // Check localStorage first, then fall back to system preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      // Use saved theme
      this.#document.documentElement.setAttribute('theme', savedTheme);
      this.currentTheme = savedTheme;
    } else {
      // Use system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = systemPrefersDark ? 'dark' : 'light';
      this.#document.documentElement.setAttribute('theme', theme);
    }
  }

  toggleTheme() {
    const currentTheme = this.#document.documentElement.getAttribute('theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    // Set the theme
    this.#document.documentElement.setAttribute('theme', newTheme);
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    this.currentTheme = newTheme;
  }
}
