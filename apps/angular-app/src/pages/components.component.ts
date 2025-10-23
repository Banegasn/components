import { Component, ChangeDetectionStrategy, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA,  } from "@angular/core";

import '@banegasn/lit-components';

@Component({
  selector: 'app-components ',
  template: `
    <h1>Components</h1>
    <p>
      This page contains a list of all the components available in the library. Click on a component to see more information about it.
    </p>
    <lit-button label="Navigation Rail"></lit-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsComponent {
    
}