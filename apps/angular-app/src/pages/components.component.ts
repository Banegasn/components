import { Component, ChangeDetectionStrategy, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA,  } from "@angular/core";

import '@banegasn/lit-components';

@Component({
  selector: 'app-components ',
  template: `
    <h1>Components</h1>
    <lit-button label="Click me"></lit-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsComponent {
    
}