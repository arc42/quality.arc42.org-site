(function () {
  const root = document.querySelector(".mobile-graph-page");
  if (!root) return;

  const media = globalThis.matchMedia("(max-width: 900px)");
  const sidebar = document.getElementById("full-q-graph-sidebar");
  const toggleButton = document.getElementById("mobile-graph-controls-toggle");
  const closeButton = document.getElementById("mobile-graph-sheet-close");
  const resetButton = document.getElementById("mobile-graph-reset__btn");
  const filterInput = document.getElementById("full-q-graph-filter__input");
  const filterButton = document.getElementById("full-q-graph-filter__btn");
  const centerButton = document.getElementById("full-q-graph-center__btn");
  const qualityToggle = document.getElementById("legend-toggle-qualities");
  const requirementsToggle = document.getElementById("legend-toggle-requirements");
  const standardsToggle = document.getElementById("legend-toggle-standards");

  const applyToggle = (toggle, checked) => {
    if (!toggle || toggle.checked === checked) return;
    toggle.checked = checked;
    toggle.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const openSheet = () => {
    if (!sidebar || !media.matches) return;
    sidebar.classList.add("is-open");
    toggleButton?.setAttribute("aria-expanded", "true");
  };

  const closeSheet = () => {
    if (!sidebar) return;
    sidebar.classList.remove("is-open");
    toggleButton?.setAttribute("aria-expanded", "false");
  };

  const setMobileDefaults = () => {
    if (!media.matches) {
      closeSheet();
      return;
    }
    applyToggle(qualityToggle, true);
    applyToggle(requirementsToggle, false);
    applyToggle(standardsToggle, false);
    closeSheet();
  };

  const clearFilterChips = () => {
    const closeButtons = document.querySelectorAll("#full-q-graph-filter__chips .q-chip__close");
    closeButtons.forEach((btn) => {
      if (btn instanceof HTMLElement) btn.click();
    });
  };

  const applyQuickFilter = (btn) => {
    if (!filterInput || !filterButton) return;
    const term = btn.getAttribute("data-term");
    if (!term) return;

    const withStandards = btn.getAttribute("data-show-standards") === "true";
    const withRequirements = btn.getAttribute("data-show-requirements") === "true";

    applyToggle(qualityToggle, true);
    applyToggle(standardsToggle, withStandards);
    applyToggle(requirementsToggle, withRequirements);

    filterInput.disabled = false;
    filterInput.value = term;
    filterButton.click();

    if (media.matches) closeSheet();
    globalThis.setTimeout(() => centerButton?.click(), 120);
  };

  toggleButton?.addEventListener("click", () => {
    if (sidebar?.classList.contains("is-open")) {
      closeSheet();
    } else {
      openSheet();
    }
  });

  closeButton?.addEventListener("click", closeSheet);

  resetButton?.addEventListener("click", () => {
    clearFilterChips();
    if (filterInput) {
      filterInput.disabled = false;
      filterInput.value = "";
    }
    filterButton?.click();
    setMobileDefaults();
    globalThis.setTimeout(() => centerButton?.click(), 120);
  });

  root.querySelectorAll(".mobile-quick-filter").forEach((btn) => {
    btn.addEventListener("click", () => applyQuickFilter(btn));
  });

  globalThis.document.addEventListener("click", (event) => {
    if (!media.matches || !sidebar || !toggleButton) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (sidebar.contains(target) || toggleButton.contains(target)) return;
    closeSheet();
  });

  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", setMobileDefaults);
  } else if (typeof media.addListener === "function") {
    media.addListener(setMobileDefaults);
  }

  // Let the main graph initialize first, then apply default mobile visibility.
  globalThis.setTimeout(setMobileDefaults, 180);
})();
