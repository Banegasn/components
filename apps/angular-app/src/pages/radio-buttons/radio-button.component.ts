import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import '@banegasn/m3-radio-button';
import '@banegasn/m3-card';

@Component({
  selector: 'app-radio-button',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.css'],
})
export class RadioButtonComponent {
  selectedTheme = 'light';
  selectedSize = 'small';
  selectedColor = 'blue';
  selectedOption = 'option1';

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

