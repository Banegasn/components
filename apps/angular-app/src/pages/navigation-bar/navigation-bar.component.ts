import { Component, ChangeDetectionStrategy, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CodeBlockComponent } from "../../app/components/code-block/code-block.component";

import '@banegasn/m3-navigation-bar';
import '@banegasn/m3-card';

@Component({
  selector: 'app-navigation-bar',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css'],
  standalone: true,
  imports: [CodeBlockComponent],
})
export class NavigationBarComponent {
  selectedItem = 'Home';
  
  readonly basicBarExample = `<m3-navigation-bar>
  <m3-navigation-bar-item label="Home" active>
    <span slot="icon" class="material-symbols-outlined">home</span>
  </m3-navigation-bar-item>
</m3-navigation-bar>`;

  readonly badgeExample = `<m3-navigation-bar-item label="Messages" badge="12">
  <span slot="icon" class="material-symbols-outlined">mail</span>
</m3-navigation-bar-item>`;

  readonly horizontalExample = `<m3-navigation-bar layout="horizontal">
  <m3-navigation-bar-item label="Home" active>...</m3-navigation-bar-item>
</m3-navigation-bar>`;

  readonly autoLayoutExample = `<m3-navigation-bar auto-layout>
  <m3-navigation-bar-item label="Home" active>...</m3-navigation-bar-item>
</m3-navigation-bar>`;

  readonly installExample = `npm install @banegasn/m3-navigation-bar`;

  readonly importExample = `import '@banegasn/m3-navigation-bar';`;

  readonly basicUsageExample = `<m3-navigation-bar>
  <m3-navigation-bar-item label="Home" active>
    <span slot="icon" class="material-symbols-outlined">home</span>
  </m3-navigation-bar-item>

  <m3-navigation-bar-item label="Music">
    <span slot="icon" class="material-symbols-outlined">music_note</span>
  </m3-navigation-bar-item>

  <m3-navigation-bar-item label="Podcasts">
    <span slot="icon" class="material-symbols-outlined">podcasts</span>
  </m3-navigation-bar-item>
</m3-navigation-bar>`;

  readonly angularExample = `// navigation-bar.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@banegasn/m3-navigation-bar';

@Component({
  selector: 'app-navigation',
  template: \`
    <m3-navigation-bar [auto-layout]="true">
      <m3-navigation-bar-item
        label="Home"
        [active]="true"
        (item-click)="onItemClick($event)"
      >
        <span slot="icon" class="material-symbols-outlined">home</span>
      </m3-navigation-bar-item>
    </m3-navigation-bar>
  \`,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NavigationComponent {
  onItemClick(event: CustomEvent) {
    console.log('Clicked:', event.detail.label);
  }
}`;

  readonly reactExample = `import '@banegasn/m3-navigation-bar';

function App() {
  const handleItemClick = (e) => {
    console.log('Clicked:', e.detail.label);
  };

  return (
    <m3-navigation-bar auto-layout>
      <m3-navigation-bar-item
        label="Home"
        active
        onitem-click={handleItemClick}
      >
        <span slot="icon" class="material-symbols-outlined">home</span>
      </m3-navigation-bar-item>
    </m3-navigation-bar>
  );
}`;

  readonly vueExample = `<template>
  <m3-navigation-bar :auto-layout="true">
    <m3-navigation-bar-item
      label="Home"
      :active="true"
      @item-click="handleItemClick"
    >
      <span slot="icon" class="material-symbols-outlined">home</span>
    </m3-navigation-bar-item>
  </m3-navigation-bar>
</template>

<script setup>
import '@banegasn/m3-navigation-bar';

const handleItemClick = (event) => {
  console.log('Clicked:', event.detail.label);
};
</script>`;

  constructor(private cdr: ChangeDetectorRef) {}

  onItemClick(event: any) {
    console.log('Navigation item clicked:', event.detail);
    this.selectedItem = event.detail.label;
    this.cdr.markForCheck();
  }
}

