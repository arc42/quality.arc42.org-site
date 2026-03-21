/**
 * GraphPageController
 *
 * Manages the interactive UI shell of the full-quality-graph page:
 * - mobile bottom-sheet open / close
 * - quick-filter chip buttons
 * - reset button
 * - responsive defaults when the viewport crosses the mobile breakpoint
 */
export class GraphPageController {
    static #MOBILE_BREAKPOINT = "(max-width: 900px)";

    #graph;
    #media;
    #sidebar;
    #toggleButton;
    #closeButton;
    #resetButton;
    #filterInput;
    #filterButton;
    #centerButton;
    #qualityToggle;
    #requirementsToggle;
    #standardsToggle;

    /**
     * @param {import('./FullGraph.js').FullGraph} [graph] - Optional graph instance for direct reset
     */
    constructor(graph = null) {
        this.#graph = graph;
        this.#media = globalThis.matchMedia(GraphPageController.#MOBILE_BREAKPOINT);
        this.#sidebar = document.getElementById("full-q-graph-sidebar");
        this.#toggleButton = document.getElementById("mobile-graph-controls-toggle");
        this.#closeButton = document.getElementById("mobile-graph-sheet-close");
        this.#resetButton = document.getElementById("mobile-graph-reset__btn");
        this.#filterInput = document.getElementById("full-q-graph-filter__input");
        this.#filterButton = document.getElementById("full-q-graph-filter__btn");
        this.#centerButton = document.getElementById("full-q-graph-center__btn");
        this.#qualityToggle = document.getElementById("legend-toggle-qualities");
        this.#requirementsToggle = document.getElementById("legend-toggle-requirements");
        this.#standardsToggle = document.getElementById("legend-toggle-standards");
    }

    /**
     * Bind all event listeners and apply the initial responsive state.
     * @returns {GraphPageController} this – for chaining
     */
    initialize() {
        this.#bindEvents();
        // Defer so the graph bundle can finish its own initialization first
        globalThis.setTimeout(() => this.#setMobileDefaults(), 180);
        return this;
    }

    // ── sheet open / close ────────────────────────────────────────────────────

    #openSheet() {
        if (!this.#sidebar || !this.#media.matches) return;
        this.#sidebar.classList.add("is-open");
        this.#sidebar.removeAttribute("inert");
        this.#sidebar.removeAttribute("aria-hidden");
        this.#toggleButton?.setAttribute("aria-expanded", "true");
    }

    #closeSheet() {
        if (!this.#sidebar) return;
        this.#sidebar.classList.remove("is-open");
        if (this.#media.matches) {
            this.#sidebar.setAttribute("inert", "");
            this.#sidebar.setAttribute("aria-hidden", "true");
        }
        this.#toggleButton?.setAttribute("aria-expanded", "false");
    }

    // ── responsive defaults ───────────────────────────────────────────────────

    #setMobileDefaults() {
        if (!this.#media.matches) {
            // Desktop: sidebar is always visible — make sure it is reachable
            this.#sidebar?.removeAttribute("inert");
            this.#sidebar?.removeAttribute("aria-hidden");
            this.#closeSheet();
            return;
        }
        this.#applyToggle(this.#qualityToggle, true);
        this.#applyToggle(this.#requirementsToggle, false);
        this.#applyToggle(this.#standardsToggle, false);
        this.#closeSheet();
    }

    // ── filtering helpers ─────────────────────────────────────────────────────

    #applyToggle(toggle, checked) {
        if (!toggle || toggle.checked === checked) return;
        toggle.checked = checked;
        toggle.dispatchEvent(new Event("change", { bubbles: true }));
    }

    #applyQuickFilter(btn) {
        if (!this.#filterInput || !this.#filterButton) return;
        const term = btn.dataset.term;
        if (!term) return;

        this.#applyToggle(this.#qualityToggle, true);
        this.#applyToggle(this.#standardsToggle, btn.dataset.showStandards === "true");
        this.#applyToggle(this.#requirementsToggle, btn.dataset.showRequirements === "true");

        this.#filterInput.disabled = false;
        this.#filterInput.value = term;
        this.#filterButton.click();

        if (this.#media.matches) this.#closeSheet();
        globalThis.setTimeout(() => this.#centerButton?.click(), 120);
    }

    // ── event binding ─────────────────────────────────────────────────────────

    #bindEvents() {
        this.#toggleButton?.addEventListener("click", () => {
            if (this.#sidebar?.classList.contains("is-open")) {
                this.#closeSheet();
            } else {
                this.#openSheet();
            }
        });

        this.#closeButton?.addEventListener("click", () => this.#closeSheet());

        this.#resetButton?.addEventListener("click", () => {
            if (this.#graph) {
                this.#graph.resetFilter();
            } else {
                if (this.#filterInput) {
                    this.#filterInput.disabled = false;
                    this.#filterInput.value = "";
                }
                this.#filterButton?.click();
            }
            this.#setMobileDefaults();
            globalThis.setTimeout(() => this.#centerButton?.click(), 120);
        });

        document.querySelectorAll(".mobile-quick-filter").forEach(btn => {
            btn.addEventListener("click", () => this.#applyQuickFilter(btn));
        });

        // Close sheet when tapping outside (mobile only)
        document.addEventListener("click", event => {
            if (!this.#media.matches || !this.#sidebar || !this.#toggleButton) return;
            if (!(event.target instanceof Node)) return;
            if (this.#sidebar.contains(event.target) || this.#toggleButton.contains(event.target)) return;
            this.#closeSheet();
        });

        const onBreakpointChange = () => this.#setMobileDefaults();
        if (typeof this.#media.addEventListener === "function") {
            this.#media.addEventListener("change", onBreakpointChange);
        } else {
            // Safari < 14 fallback
            this.#media.addListener(onBreakpointChange);
        }
    }
}
