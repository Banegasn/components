import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import '@banegasn/m3-card';
import '@banegasn/m3-button';

@Component({
  selector: 'app-cards',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
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

