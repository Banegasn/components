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
      <p style="display:flex; gap:1rem;">
        <a href="/components" style="padding:.9em 2.4em; border:none; border-radius:8px; background:var(--md-sys-color-primary,#6750A4); color:var(--md-sys-color-on-primary,#fff); font-weight:500; text-decoration:none; box-shadow: 0 1px 3px rgba(0,0,0,0.07); transition: background .2s;">Browse Components</a>
        <a href="https://m3.material.io/" target="_blank" style="padding:.9em 2.4em; border:none; border-radius:8px; background:var(--md-sys-color-secondary,#625B71); color:var(--md-sys-color-on-secondary,#fff); font-weight:500; text-decoration:none; box-shadow: 0 1px 3px rgba(0,0,0,0.05); transition: background .2s;">About Material 3</a>
      </p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
})
export class HomeComponent {

}