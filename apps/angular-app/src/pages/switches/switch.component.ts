import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import '@banegasn/m3-switch';
import '@banegasn/m3-card';

@Component({
  selector: 'app-switch',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css'],
})
export class SwitchComponent {
  notificationsEnabled = false;
  darkModeEnabled = false;
  autoSaveEnabled = true;
  locationEnabled = false;

  onSwitchChange(event: Event, switchName: string) {
    const checked = (event as CustomEvent).detail.checked;
    console.log(`${switchName} is now:`, checked);
    
    // Update the corresponding property
    switch (switchName) {
      case 'notifications':
        this.notificationsEnabled = checked;
        break;
      case 'darkMode':
        this.darkModeEnabled = checked;
        break;
      case 'autoSave':
        this.autoSaveEnabled = checked;
        break;
      case 'location':
        this.locationEnabled = checked;
        break;
    }
  }
}

