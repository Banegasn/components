import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CodeBlockComponent } from "../../app/components/code-block/code-block.component";

import '@banegasn/m3-checkbox';
import '@banegasn/m3-card';

@Component({
  selector: 'app-checkbox',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css'],
  imports: [CodeBlockComponent],
})
export class CheckboxComponent {
  termsAccepted = false;
  newsletterSubscribed = true;

  readonly basicExample = `<m3-checkbox></m3-checkbox>
<m3-checkbox checked></m3-checkbox>`;

  readonly indeterminateExample = `<m3-checkbox indeterminate></m3-checkbox>`;

  readonly disabledExample = `<m3-checkbox disabled></m3-checkbox>
<m3-checkbox checked disabled></m3-checkbox>
<m3-checkbox indeterminate disabled></m3-checkbox>`;

  readonly interactiveExample = `<m3-checkbox
  [checked]="termsAccepted"
  (checkbox-change)="onCheckboxChange($event, 'terms')">
</m3-checkbox>`;

  onCheckboxChange(event: Event, checkboxName: string) {
    const detail = (event as CustomEvent).detail;
    console.log(`${checkboxName} checked state is now:`, detail.checked);
  }
}
