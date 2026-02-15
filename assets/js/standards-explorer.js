(function () {
  const grid = document.getElementById("standards-explorer-grid");
  if (!grid) return;

  const searchInput = document.getElementById("standards-search");
  const resetButton = document.getElementById("standards-reset-filters");
  const resultCounter = document.getElementById("standards-result-counter");
  const facetButtons = Array.from(document.querySelectorAll(".standards-facet-btn"));
  const cards = Array.from(grid.querySelectorAll(".standards-explorer-card"));
  const activeFacets = new Set();

  const normalize = (value) => (value || "").toLowerCase().trim();

  function cardMatchesFacets(card, facets) {
    if (facets.size === 0) return true;
    const cardCategories = (card.dataset.categories || "").split(/\s+/).filter(Boolean);
    return Array.from(facets).every((facet) => cardCategories.includes(facet));
  }

  function cardMatchesSearch(card, query) {
    if (!query) return true;
    const searchText = normalize(card.dataset.search);
    return searchText.includes(query);
  }

  function updateCounter(visibleCount) {
    if (!resultCounter) return;
    resultCounter.textContent = `${visibleCount} standard${visibleCount === 1 ? "" : "s"} visible`;
  }

  function applyFilters() {
    const query = normalize(searchInput ? searchInput.value : "");
    let visibleCount = 0;

    cards.forEach((card) => {
      const visible = cardMatchesFacets(card, activeFacets) && cardMatchesSearch(card, query);
      card.classList.toggle("is-hidden", !visible);
      card.setAttribute("aria-hidden", visible ? "false" : "true");
      if (visible) visibleCount += 1;
    });

    updateCounter(visibleCount);
  }

  facetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;
      if (!category) return;

      if (activeFacets.has(category)) {
        activeFacets.delete(category);
        button.classList.remove("is-active");
        button.setAttribute("aria-pressed", "false");
      } else {
        activeFacets.add(category);
        button.classList.add("is-active");
        button.setAttribute("aria-pressed", "true");
      }

      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      activeFacets.clear();
      facetButtons.forEach((button) => {
        button.classList.remove("is-active");
        button.setAttribute("aria-pressed", "false");
      });
      applyFilters();
    });
  }

  applyFilters();
})();
