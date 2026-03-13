import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CodeBlockComponent } from '../../app/components/code-block/code-block.component';
import '@banegasn/m3-card';
import '@banegasn/m3-button';

@Component({
  selector: 'app-quick-start',
  templateUrl: './quick-start.component.html',
  styleUrls: ['./quick-start.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CodeBlockComponent]
})
export class QuickStartComponent {
  readonly cdnCode = `<!-- Import directly as a module via jsDelivr CDN -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@banegasn/m3-button/+esm"></script>

<!-- Or import multiple components dynamically -->
<script type="module">
  import "https://cdn.jsdelivr.net/npm/@banegasn/m3-button/+esm";
  import "https://cdn.jsdelivr.net/npm/@banegasn/m3-card/+esm";
</script>

<!-- Use the components -->
<m3-button variant="filled">Click me</m3-button>`;

  readonly installCode = `npm install @banegasn/m3-button`;
  readonly pnpmCode = `pnpm add @banegasn/m3-button`;

  readonly angularCode = `import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@banegasn/m3-button';

@Component({
  selector: 'app-root',
  template: \`<m3-button variant="filled">Angular Button</m3-button>\`,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {}`;

  readonly reactCode = `import React from 'react';
import '@banegasn/m3-button';

function App() {
  const handleClick = (e) => {
    console.log('Button clicked', e.detail);
  };

  return (
    <m3-button variant="filled" onbutton-click={handleClick}>
      React Button
    </m3-button>
  );
}

export default App;`;

  readonly vueCode = `<script setup>
import '@banegasn/m3-button';

const handleClick = (e) => {
  console.log('Button clicked', e.detail);
};
</script>

<template>
  <m3-button variant="filled" @button-click="handleClick">
    Vue Button
  </m3-button>
</template>`;
}
