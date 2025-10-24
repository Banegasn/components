import { Component, ChangeDetectionStrategy, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, } from "@angular/core";
import '@banegasn/m3-button';

@Component({
  selector: 'app-components ',
  templateUrl: './components.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsComponent { }