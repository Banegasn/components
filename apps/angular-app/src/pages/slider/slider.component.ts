import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CodeBlockComponent } from "../../app/components/code-block/code-block.component";

import '@banegasn/m3-slider';
import '@banegasn/m3-card';

@Component({
  selector: 'app-slider',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
  imports: [CodeBlockComponent],
})
export class SliderComponent {
  brightness = 70;
  volume = 50;

  readonly basicExample = `<m3-slider min="0" max="100" value="50"></m3-slider>`;

  readonly disabledExample = `<m3-slider disabled value="30"></m3-slider>
<m3-slider disabled value="75"></m3-slider>`;

  readonly interactiveExample = `<m3-slider
  min="0"
  max="100"
  [value]="volume"
  (slider-change)="onSliderChange($event, 'volume')">
</m3-slider>
<p>Volume: {{volume}}</p>`;

  onSliderChange(event: Event, sliderName: string) {
    const detail = (event as CustomEvent).detail;
    if (sliderName === 'volume') {
      this.volume = detail.value;
    }
  }
}
