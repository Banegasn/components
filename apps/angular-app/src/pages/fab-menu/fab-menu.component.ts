import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CodeBlockComponent } from '../../app/components/code-block/code-block.component';
import '@banegasn/m3-fab-menu';
import '@banegasn/m3-button';

@Component({
    selector: 'app-fab-menu',
    standalone: true,
    templateUrl: './fab-menu.component.html',
    styleUrls: ['./fab-menu.component.css'],
    imports: [CodeBlockComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FabMenuComponent {
    readonly basicExample = `<m3-fab-menu>
    <m3-button variant="elevated" icon-only>...</m3-button>
    <m3-button variant="elevated" icon-only>...</m3-button>
</m3-fab-menu>`;
}
