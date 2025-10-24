import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import  '@banegasn/m3-button';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {

  onButtonClick(button: HTMLElement) {
    (button as any).loading = true;
    setTimeout(() => {
      (button as any).loading = false;
    }, 2000);
  }
}

