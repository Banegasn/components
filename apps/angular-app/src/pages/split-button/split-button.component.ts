import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@banegasn/m3-split-button';

@Component({
    selector: 'app-split-button',
    standalone: true,
    templateUrl: './split-button.component.html',
    styleUrls: ['./split-button.component.css'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SplitButtonComponent {
    handleSplitClick(event: any) {
        console.log('Split button clicked:', event.detail);
    }
}
