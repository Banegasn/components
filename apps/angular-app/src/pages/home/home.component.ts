import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-home',
    template: `
    <h1>Material 3 Component Library</h1>
    <section>
      <p>
        Welcome to the main hub for our modern <strong>Material UI components</strong>, designed with <strong>Material 3</strong> principles.<br>
        Explore a comprehensive set of web elements built for consistency, elegance, and effortless integration.
      </p>
      <div class="button-group">
        <m3-button variant="filled" (button-click)="navigateToComponents()">
          <span slot="icon" class="material-symbols-outlined">browse</span>
          Browse Components
        </m3-button>
        <m3-button variant="tonal" (button-click)="openMaterialDesign()">
          <span slot="icon" class="material-symbols-outlined">open_in_new</span>
          About Material 3
        </m3-button>
      </div>
    </section>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: []
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToComponents() {
    this.router.navigate(['/components']);
  }

  openMaterialDesign() {
    window.open('https://m3.material.io/', '_blank');
  }
}