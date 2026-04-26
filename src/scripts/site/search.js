import lunr from 'lunr';

export function initSearch() {
    const searchStatus = document.getElementById("search-status");
    const resultsContainer = document.getElementById("search-results-container");
    const searchInput = document.getElementById("search");

    if (!searchInput || !resultsContainer) return;

    let lunrIndex = null;
    let searchLookup = null;

    // 1. Get query from URL
    const queryData = getQuery(["q"]);
    const initialQuery = queryData.query;

    if (initialQuery) {
        searchInput.value = initialQuery;
    }

    // 2. Load Index and Lookup
    Promise.all([
        fetch(window.baseurl + "/assets/data/search-index.json").then(r => r.json()),
        fetch(window.baseurl + "/assets/data/search-lookup.json").then(r => r.json())
    ]).then(([indexData, lookupData]) => {
        lunrIndex = lunr.Index.load(indexData);
        searchLookup = lookupData;
        
        if (searchStatus) searchStatus.textContent = "Search ready.";
        
        if (initialQuery) {
            performSearch(initialQuery);
        }
    }).catch(err => {
        console.error("Failed to load search index:", err);
        if (searchStatus) searchStatus.textContent = "Error loading search index. Please try refreshing.";
    });

    // 3. Listen for input (live search)
    let debounceTimer;
    searchInput.addEventListener("input", function() {
        const q = this.value;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            performSearch(q);
            // Update URL without reload
            const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?q=' + encodeURIComponent(q);
            window.history.pushState({path:newurl},'',newurl);
        }, 150);
    });

    function performSearch(q) {
        if (!lunrIndex || !q || q.length < 2) {
            if (!q) resultsContainer.innerHTML = '';
            if (searchStatus) searchStatus.textContent = "Enter at least 2 characters to search.";
            return;
        }

        if (searchStatus) searchStatus.textContent = "Searching for '" + q + "'...";
        
        // Support multi-term search with wildcards and field boosts
        const terms = q.trim().split(/\s+/);
        const results = lunrIndex.query(function(query) {
            terms.forEach(term => {
                // Title boost
                query.term(term, { fields: ['title'], boost: 10 });
                // Aliases boost
                query.term(term, { fields: ['aliases'], boost: 5 });
                // Tags boost
                query.term(term, { fields: ['tags'], boost: 3 });
                // Body search
                query.term(term, { fields: ['body'], boost: 1 });
                
                // Wildcard for partial matches (prefix)
                query.term(term, { fields: ['title', 'aliases', 'body'], boost: 2, wildcard: lunr.Query.wildcard.TRAILING });
            });
        });
        
        renderResults(results, q);
    }

    function highlightText(text, query) {
        if (!query) return text;
        const terms = query.trim().split(/\s+/).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const regex = new RegExp(`(${terms.join('|')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    function renderResults(results, q) {
        resultsContainer.innerHTML = '';

        if (results.length === 0) {
            if (searchStatus) searchStatus.textContent = "No results found for '" + q + "'.";
            return;
        }

        if (searchStatus) searchStatus.textContent = "Found " + results.length + " results for '" + q + "'.";

        results.forEach(result => {
            const item = searchLookup[result.ref];
            if (!item) return;

            const highlightedTitle = highlightText(item.title, q);

            const html = `
                <div class="search-result-item">
                    <span class="search-result-category cat-${item.type}">${item.type}</span>
                    <h2 class="search-result-title">
                        <a href="${window.baseurl}${item.url}">${highlightedTitle}</a>
                    </h2>
                    <div class="search-result-snippet">
                        ${item.url}
                    </div>
                </div>
            `;
            const div = document.createElement('div');
            div.innerHTML = html;
            resultsContainer.appendChild(div.firstElementChild);
        });
    }
}

function getQuery(keys) {
    let query = "";
    let key = "";
    keys.forEach(function (queryKey) {
        const regex = RegExp("[?&]" + queryKey + "=([^&]+)", 'i');
        let matched;
        if (matched = window.location.search.match(regex)) {
            query = decodeURIComponent(matched[1]).replace(/(　| )+/g, ' ');
            key = queryKey;
        }
    });
    return { query: query, key: key };
}
