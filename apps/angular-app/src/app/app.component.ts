import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

import '@banegasn/m3-navigation-rail';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Multi-Framework Components Demo';
  litClickCount = 0;

  ngOnInit() {
    // Listen for Lit button clicks
    document.addEventListener('lit-button-click', () => {
      this.litClickCount++;
    });
  }

  toggleTheme() {
    const theme = document.documentElement.getAttribute('theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('theme', theme);
  }
}
