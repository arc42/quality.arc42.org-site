import { initNavigation } from './navigation.js';
import { initHeaderLinks } from './header-link.js';
import { initSearch } from './search.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeaderLinks();
    initSearch();
});
