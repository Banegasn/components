import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CodeBlockComponent } from '../../app/components/code-block/code-block.component';
import '@banegasn/m3-button';
import '@banegasn/m3-menu';

const PLACEMENT_OPTIONS = [
    'bottom-start', 'bottom-center', 'bottom-end',
    'top-start', 'top-center', 'top-end',
    'right-start', 'right-center', 'right-end',
    'left-start', 'left-center', 'left-end'
] as const;

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
    examplePlacement: string = 'bottom-start';
    placementMenuOpen = false;
    readonly placementOptions = PLACEMENT_OPTIONS;

    togglePlacementMenu() {
        this.placementMenuOpen = !this.placementMenuOpen;
    }

    closePlacementMenu() {
        this.placementMenuOpen = false;
    }

    setPlacement(placement: string) {
        this.examplePlacement = placement;
        this.placementMenuOpen = false;
    }

    readonly basicExample = `<div class="menu-anchor">
  <m3-button variant="filled">Open menu</m3-button>
  <m3-menu open placement="bottom-start">
    <m3-menu-item value="profile">
      <span slot="leading-icon" class="material-symbols-outlined">person</span>
      Profile
    </m3-menu-item>
    <m3-menu-item value="share">
      <span slot="leading-icon" class="material-symbols-outlined">share</span>
      Share
    </m3-menu-item>
  </m3-menu>
</div>`;
    readonly positioningExample = `<m3-menu placement="right-center" offset="12" open>
  <m3-menu-item value="profile">Profile</m3-menu-item>
  <m3-menu-item value="share">Share</m3-menu-item>
</m3-menu>`;

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
    }

    closeMenu() {
        this.menuOpen = false;
        this.placementMenuOpen = false;
    }

    handleMenuSelect(event: Event) {
        const menuEvent = event as CustomEvent<{ text: string }>;
        this.lastSelection = menuEvent.detail.text;
        this.menuOpen = false;
    }

    handlePlacementSelect(event: Event) {
        const menuEvent = event as CustomEvent<{ value: string }>;
        this.setPlacement(menuEvent.detail.value);
    }
}
