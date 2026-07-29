import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CodeBlockComponent } from '../../app/components/code-block/code-block.component';
import '@banegasn/m3-menu';
import '@banegasn/m3-split-button';

@Component({
  selector: 'app-split-button',
  standalone: true,
  templateUrl: './split-button.component.html',
  styleUrls: ['./split-button.component.css'],
  imports: [CodeBlockComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SplitButtonComponent {
  lastInteraction = 'None';
  menuOpen = false;

  readonly basicExample = `<div class="split-button-demo">
  <m3-split-button open>
    Send
    <m3-menu slot="menu" placement="bottom-end">
    <m3-menu-item value="schedule-send">Schedule send</m3-menu-item>
    <m3-menu-item value="save-draft">Save draft</m3-menu-item>
    </m3-menu>
  </m3-split-button>
</div>`;

  handlePrimaryAction() {
    this.menuOpen = false;
    this.lastInteraction = 'main: send';
  }

  handleMenuChange(event: Event) {
    const detail = (event as CustomEvent<{ open: boolean; reason: string }>).detail;
    this.menuOpen = detail.open;
    this.lastInteraction = `menu: ${detail.reason}`;
  }

  handleMenuItemSelect(event: Event) {
    const menuEvent = event as CustomEvent<{ text: string }>;
    this.menuOpen = false;
    this.lastInteraction = `menu-item: ${menuEvent.detail.text}`;
  }
}
