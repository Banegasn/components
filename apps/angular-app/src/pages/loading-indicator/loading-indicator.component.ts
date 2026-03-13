import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@banegasn/m3-loading-indicator';
import '@banegasn/m3-button';

@Component({
    selector: 'app-loading-indicator',
    standalone: true,
    templateUrl: './loading-indicator.component.html',
    styleUrls: ['./loading-indicator.component.css'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoadingIndicatorComponent { }
