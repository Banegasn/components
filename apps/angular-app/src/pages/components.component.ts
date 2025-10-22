import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: 'app-components ',
  template: `
    <h1>Components</h1>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
})
export class ComponentsComponent {
    
}