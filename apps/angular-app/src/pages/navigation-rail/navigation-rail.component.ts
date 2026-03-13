import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CodeBlockComponent } from "../../app/components/code-block/code-block.component";

import '@banegasn/m3-navigation-rail';
import '@banegasn/m3-card';

@Component({
  selector: 'app-navigation-rail',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navigation-rail.component.html',
  styleUrls: ['./navigation-rail.component.css'],
  imports: [CodeBlockComponent],
})
export class NavigationRailComponent {
  readonly basicRailExample = `<m3-navigation-rail>
  <m3-navigation-rail-toggle></m3-navigation-rail-toggle>
  <m3-navigation-rail-item label="Home" active>
    <span slot="icon" class="material-symbols-outlined">home</span>
  </m3-navigation-rail-item>
</m3-navigation-rail>`;

  readonly badgeExample = `<m3-navigation-rail-item label="Messages" badge="12">
  <span slot="icon" class="material-symbols-outlined">mail</span>
</m3-navigation-rail-item>`;

  readonly bottomItemExample = `<m3-navigation-rail-item slot="bottom" label="Settings">
  <span slot="icon" class="material-symbols-outlined">settings</span>
</m3-navigation-rail-item>`;

  readonly installExample = `npm install @banegasn/m3-navigation-rail`;

  readonly basicUsageExample = `<m3-navigation-rail>
  <m3-navigation-rail-toggle></m3-navigation-rail-toggle>

  <m3-navigation-rail-item label="Home" active>
    <span slot="icon" class="material-symbols-outlined">home</span>
  </m3-navigation-rail-item>

  <m3-navigation-rail-item label="Search">
    <span slot="icon" class="material-symbols-outlined">search</span>
  </m3-navigation-rail-item>
</m3-navigation-rail>`;

  readonly angularExample = `// app.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@banegasn/m3-navigation-rail';

@Component({
  selector: 'app-root',
  template: \`
    <m3-navigation-rail>
      <m3-navigation-rail-toggle></m3-navigation-rail-toggle>
      <m3-navigation-rail-item
        label="Home"
        [active]="true"
        (item-click)="onItemClick($event)"
      >
        <span slot="icon" class="material-symbols-outlined">home</span>
      </m3-navigation-rail-item>
    </m3-navigation-rail>
  \`,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  onItemClick(event: CustomEvent) {
    console.log('Clicked:', event.detail.label);
  }
}`;

  readonly reactExample = `import '@banegasn/m3-navigation-rail';

function App() {
  const handleItemClick = (e) => {
    console.log('Clicked:', e.detail.label);
  };

  return (
    <m3-navigation-rail>
      <m3-navigation-rail-toggle />
      <m3-navigation-rail-item
        label="Home"
        active
        onitem-click={handleItemClick}
      >
        <span slot="icon" class="material-symbols-outlined">home</span>
      </m3-navigation-rail-item>
    </m3-navigation-rail>
  );
}`;

  readonly vueExample = `<template>
  <m3-navigation-rail>
    <m3-navigation-rail-toggle />
    <m3-navigation-rail-item
      label="Home"
      :active="true"
      @item-click="handleItemClick"
    >
      <span slot="icon" class="material-symbols-outlined">home</span>
    </m3-navigation-rail-item>
  </m3-navigation-rail>
</template>

<script setup>
import '@banegasn/m3-navigation-rail';

const handleItemClick = (event) => {
  console.log('Clicked:', event.detail.label);
};
</script>`;

  onItemClick(event: any) {
    console.log('Navigation item clicked:', event.detail);
  }
}

