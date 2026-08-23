// Standards explorer: card grid with category + organization facets and search.
// Distinct enough from the letter-grouped explorers that it doesn't share their
// engine; kept here so all three explorers build through esbuild (one strategy).
//
// Facet logic: OR within a group, AND across groups. Selecting two categories
// widens the result set to standards in either category; adding an organization
// narrows across groups. Organizations are inherently OR (a card has exactly one
// organization), so this makes the two groups behave consistently and removes
// the near-disjoint AND combinations that used to blank the grid.
(function () {
    const grid = document.getElementById("standards-explorer-grid");
    if (!grid) return;

    const searchInput = document.getElementById("standards-search");
    const resetButton = document.getElementById("standards-reset-filters");
    const emptyResetButton = document.getElementById("standards-empty-reset");
    const emptyState = document.getElementById("standards-empty-state");
    const resultCounter = document.getElementById("standards-result-counter");
    const categoryFacetButtons = Array.from(
        document.querySelectorAll(".standards-facet-btn[data-category]"),
    );
    const organizationFacetList = document.getElementById("standards-org-facet-list");
    const cards = Array.from(grid.querySelectorAll(".standards-explorer-card"));
    const activeCategoryFacets = new Set();
    const activeOrganizationFacets = new Set();

    const normalize = (value) => (value || "").toLowerCase().trim();
    const slugify = (value) =>
        normalize(value)
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    function deriveOrganization(shortname) {
        const normalizedShortname = (shortname || "").trim().toUpperCase();
        if (normalizedShortname.startsWith("ISO/IEC/IEEE")) return "ISO/IEC/IEEE";
        if (normalizedShortname.startsWith("ISO/IEC")) return "ISO/IEC";
        if (normalizedShortname.startsWith("ISO ")) return "ISO";
        if (normalizedShortname.startsWith("IEC ")) return "IEC";
        if (normalizedShortname.startsWith("IEEE ")) return "IEEE";
        if (normalizedShortname.startsWith("ETSI")) return "ETSI";
        if (normalizedShortname.startsWith("EN ")) return "EN";
        if (normalizedShortname.startsWith("NIST")) return "NIST";
        if (normalizedShortname.startsWith("OWASP")) return "OWASP";
        if (normalizedShortname.startsWith("WCAG")) return "W3C";
        if (normalizedShortname.startsWith("GDPR") || normalizedShortname.startsWith("CRA"))
            return "EU";
        if (normalizedShortname.startsWith("HL7")) return "HL7";
        if (normalizedShortname.startsWith("MISRA")) return "MISRA";
        if (normalizedShortname.startsWith("PCI")) return "PCI";
        if (normalizedShortname.startsWith("SOC")) return "SOC";
        if (normalizedShortname.startsWith("SOX")) return "SOX";
        if (normalizedShortname.startsWith("DO-")) return "RTCA";
        if (normalizedShortname.startsWith("AIUC")) return "AIUC";
        const fallbackToken = (shortname || "").trim().split(/\s+/).find(Boolean);
        return fallbackToken || "Other";
    }

    function cardCategoriesOf(card) {
        return (card.dataset.categories || "").split(/\s+/).filter(Boolean);
    }

    // OR within the category group: a card matches if it carries ANY active
    // category. Empty selection matches everything.
    function cardMatchesCategoryFacets(card, facets) {
        if (facets.size === 0) return true;
        const cardCategories = cardCategoriesOf(card);
        return Array.from(facets).some((facet) => cardCategories.includes(facet));
    }

    function cardMatchesOrganizationFacets(card, facets) {
        if (facets.size === 0) return true;
        return facets.has(card.dataset.organization || "");
    }

    function cardMatchesSearch(card, query) {
        if (!query) return true;
        const searchText = normalize(card.dataset.search);
        return searchText.includes(query);
    }

    function updateCounter(visibleCount) {
        if (!resultCounter) return;
        resultCounter.textContent = `${ visibleCount } standard${ visibleCount === 1 ? "" : "s" } visible`;
    }

    // Live facet counts reflect the other groups' active filters plus search, so
    // each count answers "how many results carry this facet, given everything else
    // currently selected." Zero-count facets are dimmed (but stay operable).
    function updateFacetCounts(query) {
        categoryFacetButtons.forEach((button) => {
            const category = button.dataset.category;
            const count = cards.reduce((total, card) => {
                const matches =
                    cardMatchesOrganizationFacets(card, activeOrganizationFacets) &&
                    cardMatchesSearch(card, query) &&
                    cardCategoriesOf(card).includes(category);
                return matches ? total + 1 : total;
            }, 0);
            const countEl = button.querySelector(".standards-facet-count");
            if (countEl) countEl.textContent = String(count);
            button.classList.toggle("is-empty", count === 0);
        });

        organizationFacetButtons.forEach((button) => {
            const organization = button.dataset.organization;
            const count = cards.reduce((total, card) => {
                const matches =
                    cardMatchesCategoryFacets(card, activeCategoryFacets) &&
                    cardMatchesSearch(card, query) &&
                    (card.dataset.organization || "") === organization;
                return matches ? total + 1 : total;
            }, 0);
            const countEl = button.querySelector(".standards-facet-count");
            if (countEl) countEl.textContent = String(count);
            button.classList.toggle("is-empty", count === 0);
        });
    }

    function applyFilters() {
        const query = normalize(searchInput ? searchInput.value : "");
        let visibleCount = 0;

        cards.forEach((card) => {
            const visible =
                cardMatchesCategoryFacets(card, activeCategoryFacets) &&
                cardMatchesOrganizationFacets(card, activeOrganizationFacets) &&
                cardMatchesSearch(card, query);
            card.classList.toggle("is-hidden", !visible);
            card.setAttribute("aria-hidden", visible ? "false" : "true");
            if (visible) visibleCount += 1;
        });

        updateCounter(visibleCount);
        updateFacetCounts(query);
        if (emptyState) emptyState.hidden = visibleCount !== 0;
    }

    const organizationCounts = new Map();

    cards.forEach((card) => {
        const shortname = card.dataset.shortname || "";
        const organizationLabel = deriveOrganization(shortname);
        const organizationKey = slugify(organizationLabel) || "other";
        card.dataset.organization = organizationKey;
        card.dataset.organizationLabel = organizationLabel;
        card.dataset.search =
            `${ normalize(card.dataset.search) } ${ normalize(organizationLabel) }`.trim();

        const current = organizationCounts.get(organizationKey);
        if (current) {
            current.count += 1;
        } else {
            organizationCounts.set(organizationKey, { label: organizationLabel, count: 1 });
        }
    });

    if (organizationFacetList) {
        const sortedOrganizations = Array.from(organizationCounts.entries())
            .map(([key, data]) => ({ key, label: data.label, count: data.count }))
            .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

        sortedOrganizations.forEach((organization) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "standards-facet-btn standards-org-facet-btn";
            button.dataset.organization = organization.key;
            button.setAttribute("aria-pressed", "false");
            button.append(document.createTextNode(`${ organization.label } `));
            const count = document.createElement("span");
            count.className = "standards-facet-count";
            count.textContent = String(organization.count);
            button.appendChild(count);
            organizationFacetList.appendChild(button);
        });
    }

    const organizationFacetButtons = Array.from(
        document.querySelectorAll(".standards-org-facet-btn[data-organization]"),
    );

    categoryFacetButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const category = button.dataset.category;
            if (!category) return;

            if (activeCategoryFacets.has(category)) {
                activeCategoryFacets.delete(category);
                button.classList.remove("is-active");
                button.setAttribute("aria-pressed", "false");
            } else {
                activeCategoryFacets.add(category);
                button.classList.add("is-active");
                button.setAttribute("aria-pressed", "true");
            }

            applyFilters();
        });
    });

    organizationFacetButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const organization = button.dataset.organization;
            if (!organization) return;

            if (activeOrganizationFacets.has(organization)) {
                activeOrganizationFacets.delete(organization);
                button.classList.remove("is-active");
                button.setAttribute("aria-pressed", "false");
            } else {
                activeOrganizationFacets.add(organization);
                button.classList.add("is-active");
                button.setAttribute("aria-pressed", "true");
            }

            applyFilters();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
    }

    function resetAll() {
        if (searchInput) searchInput.value = "";
        activeCategoryFacets.clear();
        activeOrganizationFacets.clear();
        categoryFacetButtons.forEach((button) => {
            button.classList.remove("is-active");
            button.setAttribute("aria-pressed", "false");
        });
        organizationFacetButtons.forEach((button) => {
            button.classList.remove("is-active");
            button.setAttribute("aria-pressed", "false");
        });
        applyFilters();
        if (searchInput) searchInput.focus();
    }

    if (resetButton) resetButton.addEventListener("click", resetAll);
    if (emptyResetButton) emptyResetButton.addEventListener("click", resetAll);

    applyFilters();
})();
