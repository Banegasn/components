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
  
  readonly basicCardExample = `<m3-card variant="elevated">
  <h3 slot="header">Card Title</h3>
  <p>Card content goes here</p>
  <div slot="actions">
    <m3-button variant="text">Cancel</m3-button>
    <m3-button variant="filled">Confirm</m3-button>
  </div>
</m3-card>`;

  readonly clickableCardExample = `<m3-card 
  clickable 
  aria-label="Navigate to products"
  (card-click)="handleClick($event)">
  <p>Click anywhere on this card</p>
</m3-card>`;

  readonly mediaCardExample = `<m3-card variant="elevated">
  <div slot="media">
    <!-- Product image -->
  </div>
  <h3 slot="header">Card Title</h3>
  <p>Card content goes here</p>
</m3-card>`;

  readonly widthCardExample = `<m3-card variant="elevated" width="full">...</m3-card>
<m3-card variant="filled" width="fixed">...</m3-card>
<m3-card variant="outlined" width="auto">...</m3-card>`;

  readonly stateCardExample = `<m3-card variant="filled" disabled>...</m3-card>
<m3-card variant="outlined" dragged>...</m3-card>`;

  readonly complexCardExample = `<m3-card variant="elevated">
  <div slot="media">
    <!-- Product image -->
  </div>
  <div slot="header">
    <h3>Premium Headphones</h3>
    <div class="price">$299</div>
  </div>
  <p>Experience premium sound quality...</p>
  <div slot="actions">
    <m3-button variant="filled">Add to Cart</m3-button>
  </div>
</m3-card>`;

  onCardClick(event: any) {
    console.log('Card clicked:', event.detail);
    alert('Card clicked! Check console for details.');
  }

  handleAction(action: string) {
    console.log('Action clicked:', action);
    alert(`${action} clicked!`);
  }
}

