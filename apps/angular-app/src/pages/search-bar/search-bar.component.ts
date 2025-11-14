import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import '@banegasn/m3-search-bar';
import '@banegasn/m3-card';
import '@banegasn/m3-button';

@Component({
  selector: 'app-search-bar',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent {
  searchValue = '';
  searchResults: string[] = [];
  placeholder = 'Search...';

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

