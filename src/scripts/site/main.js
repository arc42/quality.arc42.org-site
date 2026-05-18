import { initNavigation } from './navigation.js';
import { initHeaderLinks } from './header-link.js';
import { initSearch } from './search.js';
import { initAutocomplete } from './autocomplete.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeaderLinks();
    initSearch();        // /search/ full-results page (no-op without #search-results-container)
    initAutocomplete();  // header dropdown (no-op without [data-site-search])
});
