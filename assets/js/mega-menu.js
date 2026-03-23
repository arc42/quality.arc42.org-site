/**
 * Q42 mega-menu interactions for the splash homepage.
 */

(function () {
  "use strict";

  // ── Mega-menu ──────────────────────────────────────────────
  const megaWrap = document.getElementById("q42MegaExplore");
  const megaTrigger = megaWrap?.querySelector(".q42-mega-trigger");

  if (megaTrigger) {
    megaTrigger.addEventListener("click", function () {
      const isOpen = megaWrap.classList.toggle("open");
      megaTrigger.setAttribute("aria-expanded", isOpen);
    });
  }

  document.addEventListener("click", function (e) {
    if (megaWrap && !e.target.closest(".q42-mega-wrap")) {
      megaWrap.classList.remove("open");
      megaTrigger?.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      megaWrap?.classList.remove("open");
      megaTrigger?.setAttribute("aria-expanded", "false");
    }

    // "/" focuses the search input (unless already typing in a field)
    if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      const searchInput = document.getElementById("q42-search-input");
      if (searchInput) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    }
  });
})();
