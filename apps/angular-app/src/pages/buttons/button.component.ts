import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CodeBlockComponent } from "../../app/components/code-block/code-block.component";

import  '@banegasn/m3-button';
import  '@banegasn/m3-card';

@Component({
  selector: 'app-button',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  imports: [CodeBlockComponent],
})
export class ButtonComponent {

  onButtonClick(button: HTMLElement) {
    (button as any).loading = true;
    setTimeout(() => {
      (button as any).loading = false;
    }, 2000);
  }
}

