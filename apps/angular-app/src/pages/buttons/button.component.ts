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

  readonly basicExample = `<m3-button variant="filled">Filled Button</m3-button>
<m3-button variant="elevated">Elevated Button</m3-button>
<m3-button variant="tonal">Tonal Button</m3-button>
<m3-button variant="outlined">Outlined Button</m3-button>
<m3-button variant="text">Text Button</m3-button>`;

  readonly sizeExample = `<m3-button variant="filled" size="small">Small</m3-button>
<m3-button variant="filled" size="medium">Medium</m3-button>
<m3-button variant="filled" size="large">Large</m3-button>`;

  readonly shapeExample = `<m3-button variant="filled" shape="round">Round</m3-button>
<m3-button variant="filled" shape="square">Square</m3-button>`;

  readonly paddingExample = `<m3-button variant="filled" padding="default">Default</m3-button>
<m3-button variant="filled" padding="small">Small</m3-button>`;

  readonly iconExample = `<m3-button variant="filled">
  <svg slot="icon" viewBox="0 0 24 24" width="18" height="18">...</svg>
  Add Item
</m3-button>`;

  readonly iconOnlyExample = `<m3-button icon-only aria-label="Add" variant="filled">
  <svg slot="icon" viewBox="0 0 24 24" width="18" height="18">...</svg>
</m3-button>`;

  readonly loadingExample = `<m3-button variant="filled" loading>Processing...</m3-button>`;

  readonly fullWidthExample = `<m3-button variant="filled" full-width>Save Changes</m3-button>`;

  onButtonClick(button: HTMLElement) {
    (button as any).loading = true;
    setTimeout(() => {
      (button as any).loading = false;
    }, 2000);
  }
}

