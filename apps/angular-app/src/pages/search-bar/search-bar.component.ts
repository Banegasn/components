import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CodeBlockComponent } from "../../app/components/code-block/code-block.component";

import '@banegasn/m3-search-bar';
import '@banegasn/m3-card';
import '@banegasn/m3-button';

@Component({
  selector: 'app-search-bar',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
  imports: [CodeBlockComponent]
})
export class SearchBarComponent {
  searchValue = '';
  searchResults: string[] = [];
  placeholder = 'Search...';

  readonly basicExample = `<m3-search-bar placeholder="Search in your files"></m3-search-bar>`;
  
  readonly leadingIconExample = `
<m3-search-bar placeholder="Search products...">
    <span slot="leading" class="material-symbols-outlined">search</span>
</m3-search-bar>`;

  readonly leadingTrailingExample = `<m3-search-bar placeholder="Search with clear button...">
    <span slot="leading" class="material-symbols-outlined">search</span>
    <m3-button icon-only slot="trailing" variant="text">
        <span slot="icon" class="material-symbols-outlined">close</span>
    </m3-button>
</m3-search-bar>`;

  readonly menuButtonExample = `<m3-search-bar placeholder="Search with menu...">
    <m3-button icon-only slot="leading" variant="text">
        <span slot="icon" class="material-symbols-outlined">menu</span>
    </m3-button>
</m3-search-bar>`;

  readonly disabledExample = `<m3-search-bar placeholder="Disabled search..." disabled>
    <span slot="leading" class="material-symbols-outlined">search</span>
</m3-search-bar>`;

  onSearchInput(event: Event) {
    const value = (event as CustomEvent).detail.value;
    this.searchValue = value;
    console.log('Search input:', value);
    
    // Simulate search results
    if (value.length > 0) {
      this.searchResults = [
        `Result 1 for "${value}"`,
        `Result 2 for "${value}"`,
        `Result 3 for "${value}"`
      ];
    } else {
      this.searchResults = [];
    }
  }

  onSearchSubmit(event: Event) {
    const value = (event as CustomEvent).detail.value;
    console.log('Search submitted:', value);
    alert(`Searching for: ${value}`);
  }

  onSearchClear() {
    this.searchValue = '';
    this.searchResults = [];
    console.log('Search cleared');
  }

  clearSearch(searchBar: any) {
    if (searchBar && typeof searchBar.clear === 'function') {
      searchBar.clear();
    }
  }
}


