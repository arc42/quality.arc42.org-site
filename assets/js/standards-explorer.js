(function () {
  const grid = document.getElementById("standards-explorer-grid");
  if (!grid) return;

  const searchInput = document.getElementById("standards-search");
  const resetButton = document.getElementById("standards-reset-filters");
  const resultCounter = document.getElementById("standards-result-counter");
  const categoryFacetButtons = Array.from(document.querySelectorAll(".standards-facet-btn[data-category]"));
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
    if (normalizedShortname.startsWith("GDPR") || normalizedShortname.startsWith("CRA")) return "EU";
    if (normalizedShortname.startsWith("HL7")) return "HL7";
    if (normalizedShortname.startsWith("MISRA")) return "MISRA";
    if (normalizedShortname.startsWith("PCI")) return "PCI";
    if (normalizedShortname.startsWith("SOC")) return "SOC";
    if (normalizedShortname.startsWith("SOX")) return "SOX";
    if (normalizedShortname.startsWith("DO-")) return "RTCA";
    if (normalizedShortname.startsWith("AIUC")) return "AIUC";
    const fallbackToken = (shortname || "").trim().split(/\s+/).filter(Boolean)[0];
    return fallbackToken || "Other";
  }

  function cardMatchesCategoryFacets(card, facets) {
    if (facets.size === 0) return true;
    const cardCategories = (card.dataset.categories || "").split(/\s+/).filter(Boolean);
    return Array.from(facets).every((facet) => cardCategories.includes(facet));
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
    resultCounter.textContent = `${visibleCount} standard${visibleCount === 1 ? "" : "s"} visible`;
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
  }

  const organizationCounts = new Map();

  cards.forEach((card) => {
    const shortname = card.dataset.shortname || "";
    const organizationLabel = deriveOrganization(shortname);
    const organizationKey = slugify(organizationLabel) || "other";
    card.dataset.organization = organizationKey;
    card.dataset.organizationLabel = organizationLabel;
    card.dataset.search = `${normalize(card.dataset.search)} ${normalize(organizationLabel)}`.trim();

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
      button.append(document.createTextNode(`${organization.label} `));
      const count = document.createElement("span");
      count.className = "standards-facet-count";
      count.textContent = String(organization.count);
      button.appendChild(count);
      organizationFacetList.appendChild(button);
    });
  }

  const organizationFacetButtons = Array.from(
    document.querySelectorAll(".standards-org-facet-btn[data-organization]")
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

  if (resetButton) {
    resetButton.addEventListener("click", () => {
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
    });
  }

  applyFilters();
})();
