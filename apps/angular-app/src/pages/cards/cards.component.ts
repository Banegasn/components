import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CodeBlockComponent } from "../../app/components/code-block/code-block.component";

import '@banegasn/m3-card';
import '@banegasn/m3-button';

@Component({
  selector: 'app-cards',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
  imports: [CodeBlockComponent],
})
export class CardsComponent {
  
  onCardClick(event: any) {
    console.log('Card clicked:', event.detail);
    alert('Card clicked! Check console for details.');
  }

  handleAction(action: string) {
    console.log('Action clicked:', action);
    alert(`${action} clicked!`);
  }
}

