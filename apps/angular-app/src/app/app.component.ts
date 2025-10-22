import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// Import Lit components (web components work directly in Angular)
import '@banegasn/lit-components';
import '@banegasn/m3-navigation-rail';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
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

  handleLitClick() {
    console.log('Lit button clicked!', this.litClickCount);
  }
}
