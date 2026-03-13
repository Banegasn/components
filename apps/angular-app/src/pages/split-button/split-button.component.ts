import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CodeBlockComponent } from '../../app/components/code-block/code-block.component';
import '@banegasn/m3-menu';
import '@banegasn/m3-split-button';

@Component({
    selector: 'app-split-button',
    standalone: true,
    templateUrl: './split-button.component.html',
    styleUrls: ['./split-button.component.css'],
    imports: [CodeBlockComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SplitButtonComponent {
    lastInteraction = 'None';
    menuState: Record<string, boolean> = {
        send: false,
        save: false,
        edit: false,
        create: false
    };

    handleMenuToggle(key: string, event: any) {
        const { action, open } = event.detail ?? {};

        if (action === 'menu') {
            this.menuState[key] = Boolean(open);
            this.lastInteraction = `${action}: ${key}`;
            return;
        }

        if (action === 'main') {
            this.menuState[key] = false;
            this.lastInteraction = `${action}: ${key}`;
        }
    }

    handleMenuDismiss(key: string) {
        this.menuState[key] = false;
    }

    handleMenuItemSelect(key: string, event: Event) {
        const menuEvent = event as CustomEvent<{ text: string }>;
        this.menuState[key] = false;
        this.lastInteraction = `menu-item: ${key} -> ${menuEvent.detail.text}`;
    }
}
