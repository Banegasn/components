import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CodeBlockComponent } from "../../app/components/code-block/code-block.component";

import '@banegasn/m3-text-field';
import '@banegasn/m3-card';

@Component({
  selector: 'app-text-field',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.css'],
  imports: [CodeBlockComponent],
})
export class TextFieldComponent {
  email = '';

  readonly basicExample = `<m3-text-field label="Username"></m3-text-field>
<m3-text-field label="Password" type="password"></m3-text-field>`;

  readonly disabledExample = `<m3-text-field label="Disabled" disabled></m3-text-field>
<m3-text-field label="Disabled with value" value="Some value" disabled></m3-text-field>`;

  readonly interactiveExample = `<m3-text-field
  label="Email"
  [value]="email"
  (textfield-change)="onTextFieldChange($event)">
</m3-text-field>
<p>Email: {{email}}</p>`;

  onTextFieldChange(event: Event) {
    const detail = (event as CustomEvent).detail;
    this.email = detail.value;
  }
}
