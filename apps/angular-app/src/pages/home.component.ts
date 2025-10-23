import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
    selector: 'app-home',
    template: `
    <h1>Material 3 Component Library</h1>
    <section>
      <p>
        Welcome to the main hub for our modern <strong>Material UI components</strong>, designed with <strong>Material 3</strong> principles.<br>
        Explore a comprehensive set of web elements built for consistency, elegance, and effortless integration.
      </p>
      <p class="button-group">
        <a href="/components" class="button primary">Browse Components</a>
        <a href="https://m3.material.io/" target="_blank" class="button secondary">About Material 3</a>
      </p>
    </section>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: []
})
export class HomeComponent {

}