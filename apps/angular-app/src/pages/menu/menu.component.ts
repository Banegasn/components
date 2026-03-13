import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CodeBlockComponent } from '../../app/components/code-block/code-block.component';
import '@banegasn/m3-button';
import '@banegasn/m3-menu';

@Component({
    selector: 'app-menu',
    standalone: true,
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    imports: [CodeBlockComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MenuComponent {
    menuOpen = false;
    lastSelection = 'None';

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
    }

    closeMenu() {
        this.menuOpen = false;
    }

    handleMenuSelect(event: Event) {
        const menuEvent = event as CustomEvent<{ text: string }>;
        this.lastSelection = menuEvent.detail.text;
        this.menuOpen = false;
    }
}
