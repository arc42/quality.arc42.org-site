(function () {
  const root = document.getElementById("full-q-graph-container");
  if (!root) return;
  // Avoid clashing with dedicated mobile page controls script.
  if (document.querySelector(".mobile-graph-page")) return;

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
    globalThis.setTimeout(() => centerButton?.click(), 120);
  };

  root.querySelectorAll(".full-quick-filter").forEach((btn) => {
    btn.addEventListener("click", () => applyQuickFilter(btn));
  });
})();
