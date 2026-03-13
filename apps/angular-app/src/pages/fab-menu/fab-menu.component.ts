import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@banegasn/m3-fab-menu';
import '@banegasn/m3-button';

@Component({
    selector: 'app-fab-menu',
    standalone: true,
    templateUrl: './fab-menu.component.html',
    styleUrls: ['./fab-menu.component.css'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FabMenuComponent { }
