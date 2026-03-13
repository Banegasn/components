import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CodeBlockComponent } from '../../app/components/code-block/code-block.component';
import '@banegasn/m3-loading-indicator';
import '@banegasn/m3-button';

@Component({
    selector: 'app-loading-indicator',
    standalone: true,
    templateUrl: './loading-indicator.component.html',
    styleUrls: ['./loading-indicator.component.css'],
    imports: [CodeBlockComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoadingIndicatorComponent { }
