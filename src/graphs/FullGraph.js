/**
 * FullGraph class
 * Specialized graph implementation for the full page graph with filtering
 */
import { Graph } from "./Graph";
import standardsList from "../../assets/data/standards.json";

export class FullGraph extends Graph {

    #filterTypeState = {
        quality: true,
        requirement: false
    };

    /**
     * @param {string} containerId - ID of the container element
     * @param {GraphDataProvider} dataProvider - Data provider instance
     */
    constructor(containerId, dataProvider) {
        super(containerId, "fullpage", dataProvider);
        this.filterInput = document.getElementById("full-q-graph-filter__input");
        this.filterButton = document.getElementById("full-q-graph-filter__btn");
        this.debounceTimeout = null;
        // Persisted UI state
        this.currentStandard = "All";
        this.currentFilterTerm = "";
    }

    /**
     * Initialize the graph and register filter controls
     * @returns {FullGraph} This graph instance for chaining
     */
    initialize() {
        super.initialize();
        this.registerFilterControls();
        this.registerLegendToggles();
        this.registerStandardsControl();
        return this;
    }

    /**
     * Register legend toggles for qualities and requirements
     */
    registerLegendToggles() {
        const qualToggle = document.getElementById("legend-toggle-qualities");
        const reqToggle = document.getElementById("legend-toggle-requirements");

        // Guard if legend not present
        if (!qualToggle || !reqToggle) {
            return this;
        }

        // Sync current renderer state to inputs
        qualToggle.checked = this.renderer.typeVisibility.quality;
        reqToggle.checked = this.renderer.typeVisibility.requirement;

        // Listen for changes
        qualToggle.addEventListener("change", (e) => {
            this.#filterTypeState.quality = e.target.checked;
            // Drive visibility via renderer to avoid resetting text filter
            this.renderer.setTypeVisibility('quality', e.target.checked);
        });
        reqToggle.addEventListener("change", (e) => {
            this.#filterTypeState.requirement = e.target.checked;
            // Drive visibility via renderer to avoid resetting text filter
            this.renderer.setTypeVisibility('requirement', e.target.checked);
        });

        return this;
    }

    /**
     * Register filter controls
     * @returns {FullGraph} This graph instance for chaining
     */
    registerFilterControls() {
        if (!this.filterInput) {
            console.error("Filter input element not found");
            return this;
        }

        if (!this.filterButton) {
            console.error("Filter button element not found");
            return this;
        }

        // Apply filter immediately when button is clicked
        this.filterButton.addEventListener("click", () => {
            this.filter(this.filterInput.value);
        });

        // Apply debounced filter when typing
        this.filterInput.addEventListener("input", (e) => {
            this.debounceFilter(e.target.value);
        });

        // Also handle Enter key for immediate filtering
        this.filterInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter" || e.keyCode === 13) {
                this.filter(this.filterInput.value);
            }
        });

        return this;
    }

    /**
     * Debounce filter function with 300ms delay
     * @param {string} value - Filter value
     */
    debounceFilter(value) {
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
            this.filter(value);
        }, 300);
    }

    /**
     * Register default event handlers for the full graph
     * @returns {Graph} This graph instance for chaining
     */
    // Override filter to be aware of legend toggles
    filter(filterTerm) {
        this.currentFilterTerm = filterTerm || "";
        this.applyFiltersCombined();
        return this;
    }

    /**
     * Standards dropdown: populate a plain select and listen for changes
     */
    registerStandardsControl() {
        const stdSelect = document.getElementById("full-q-graph-standard__select");
        if (!stdSelect) {
            // Controls not present on page
            return this;
        }

        // Populate select using statically imported standards
        try {
            const allStandarOptions = ["All", ...standardsList];
            stdSelect.innerHTML = "";
            allStandarOptions.forEach(key => {
                const opt = document.createElement("option");
                opt.value = key;
                opt.textContent = key;
                stdSelect.appendChild(opt);
            });
            stdSelect.value = this.currentStandard || "All";
        } catch (err) {
            console.error("Failed to populate standards list", err);
        }

        // Handle change -> filter by standard
        const onChange = () => {
            const val = (stdSelect.value || "").trim();
            this.filterByStandard(val);
        };
        stdSelect.addEventListener("change", onChange);

        return this;
    }

    /**
     * Apply standard filter using data provider, but keep term filter applied
     * @param {string} standard
     */
    filterByStandard(standard) {
        this.currentStandard = (standard || "").trim();
        this.applyFiltersCombined();
        return this;
    }

    /**
     * Apply both standard and term filters together as needed
     */
    applyFiltersCombined() {
        const term = (this.currentFilterTerm || "").trim();
        const std = (this.currentStandard || "").trim();
        const standardActive = std !== "" && std.toLowerCase() !== "all";
        const termActive = term !== "";

        const qualitiesHidden = this.renderer?.typeVisibility?.quality === false;
        const requirementsVisible = this.renderer?.typeVisibility?.requirement !== false;

        if (standardActive && termActive) {
            // First apply standard to get a base set, then apply term within that set
            this.dataProvider.filterByStandard(std);
            const baseSet = new Set(this.dataProvider.filteredNodes.map(n => n.id));
            this.dataProvider.filterByTerm(term, { qualitiesHidden, requirementsVisible, baseNodeIdSet: baseSet });
        } else if (standardActive) {
            this.dataProvider.filterByStandard(std);
        } else if (termActive) {
            this.dataProvider.filterByTerm(term, { qualitiesHidden, requirementsVisible });
        } else {
            this.dataProvider.resetFilter();
        }

        if (this.renderer) this.renderer.isFiltering = standardActive || termActive;
        this.renderFiltered();
        return this;
    }

    registerDefaultEventHandlers() {
        // Default double-click handler for navigation
        const nodeDoubleClick = (event, d) => {
            if (d.id !== "quality-root") {
                window.location.href = this.graph.getNodeAttribute(d.id, "page");
            }
        };

        // Default click hover handler for highlighting
        const nodeHover = (event, d) => {
            // Toggle highlight state
            const isHighlighted = d.highlighted;

            // Clear all highlights first
            this.renderer.nodes.each(function (node) {
                node.highlighted = false;
                node.connectedHighlighted = false;
            });

            const connectedNodes = new Set();
            if (!isHighlighted) {
                // Highlight this node and its connections
                d.highlighted = true;

                // Find connected nodes
                this.renderer.links.each(function (link) {
                    if (link.source.id === d.id) {
                        connectedNodes.add(link.target.id);
                        link.target.connectedHighlighted = true;
                    }
                    if (link.target.id === d.id) {
                        connectedNodes.add(link.source.id);
                        link.source.connectedHighlighted = true;
                    }
                });
            }

            // Update visual appearance
            this.renderer.highlightNode(d.id, !isHighlighted, connectedNodes);
        };

        return this.registerEventHandlers({
            nodeHover,
            nodeDoubleClick
        });
    }
}
