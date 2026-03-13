import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CodeBlockComponent } from "../../app/components/code-block/code-block.component";

import '@banegasn/m3-radio-button';
import '@banegasn/m3-card';

@Component({
  selector: 'app-radio-button',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.css'],
  imports: [CodeBlockComponent],
})
export class RadioButtonComponent {
  selectedTheme = 'light';
  selectedSize = 'small';
  selectedColor = 'blue';
  selectedOption = 'option1';

  readonly basicExample = `<m3-radio-button name="group" value="1"></m3-radio-button>
<m3-radio-button name="group" value="2" checked></m3-radio-button>`;

  readonly disabledExample = `<m3-radio-button disabled></m3-radio-button>
<m3-radio-button checked disabled></m3-radio-button>`;

  readonly groupExample = `<m3-radio-button
  name="theme"
  value="light"
  [checked]="selectedTheme === 'light'"
  (radio-change)="onRadioChange($event, 'theme')">
</m3-radio-button>`;

  readonly ariaExample = `<m3-radio-button aria-label="Option A"></m3-radio-button>
<m3-radio-button aria-labelledby="label-id"></m3-radio-button>`;

  onRadioChange(event: Event, groupName: string) {
    const checked = (event as CustomEvent).detail.checked;
    const value = (event as CustomEvent).detail.value;
    
    if (checked) {
      console.log(`${groupName} is now:`, value);
      
      switch (groupName) {
        case 'theme':
          this.selectedTheme = value;
          break;
        case 'size':
          this.selectedSize = value;
          break;
        case 'color':
          this.selectedColor = value;
          break;
        case 'option':
          this.selectedOption = value;
          break;
      }
    }
  }
}

