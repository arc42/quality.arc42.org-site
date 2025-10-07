/**
 * FullGraph class
 * Specialized graph implementation for the full page graph with filtering
 */
import { Graph } from "./Graph";

// Standards dropdown removed in favor of a sidebar toggle

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
        return this;
    }

    /**
     * Register legend toggles for qualities, requirements, and standards
     */
    registerLegendToggles() {
        const qualToggle = document.getElementById("legend-toggle-qualities");
        const reqToggle = document.getElementById("legend-toggle-requirements");
        const stdToggle = document.getElementById("legend-toggle-standards");

        // Guard if legend not present
        if (!qualToggle || !reqToggle) {
            return this;
        }

        // Sync current renderer state to inputs
        qualToggle.checked = this.renderer.typeVisibility.quality;
        reqToggle.checked = this.renderer.typeVisibility.requirement;
        if (stdToggle) stdToggle.checked = this.renderer.typeVisibility.standard;

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
        if (stdToggle) {
            stdToggle.addEventListener("change", (e) => {
                this.renderer.setTypeVisibility('standard', e.target.checked);
            });
        }

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
     * Apply both standard and term filters together as needed
     */
    applyFiltersCombined() {
        const term = (this.currentFilterTerm || "").trim();
        const termActive = term !== "";

        const qualitiesHidden = this.renderer?.typeVisibility?.quality === false;
        const requirementsVisible = this.renderer?.typeVisibility?.requirement !== false;

        if (termActive) {
            this.dataProvider.filterByTerm(term, { qualitiesHidden, requirementsVisible });
        } else {
            this.dataProvider.resetFilter();
        }

        if (this.renderer) this.renderer.isFiltering = termActive;
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

        // Default hover handler for highlighting (non-persistent)
        const nodeHover = (event, d) => {
            if (this.renderer.selectionActive) return; // Don't interfere with active selection
            // Toggle highlight state
            const isHighlighted = d.highlighted;

            // Clear all highlights first
            this.renderer.nodes.each(function (node) {
                node.highlighted = false;
                node.connectedHighlighted = false;
            });

            let connectedNodes = new Set();
            if (!isHighlighted) {
                // Highlight this node and its connections
                d.highlighted = true;

                if (d.qualityType === 'standard') {
                    // Direct neighbors (qualities)
                    const qualities = new Set();
                    const props = new Set();
                    // First collect direct neighbors
                    this.renderer.links.each(function (link) {
                        if (link.source.id === d.id) {
                            qualities.add(link.target.id);
                            link.target.connectedHighlighted = true;
                        }
                        if (link.target.id === d.id) {
                            qualities.add(link.source.id);
                            link.source.connectedHighlighted = true;
                        }
                    });
                    // Then collect properties 2-hop via qualities
                    const qualLookup = new Set(qualities);
                    this.renderer.links.each(function (link) {
                        if (qualLookup.has(link.source.id) && link.target.qualityType === 'property') {
                            props.add(link.target.id);
                            link.target.connectedHighlighted = true;
                        }
                        if (qualLookup.has(link.target.id) && link.source.qualityType === 'property') {
                            props.add(link.source.id);
                            link.source.connectedHighlighted = true;
                        }
                    });
                    connectedNodes = new Set([...qualities, ...props]);
                } else {
                    // Default: 1-hop neighbors
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
            }

            // Update visual appearance
            this.renderer.highlightNode(d.id, !isHighlighted, connectedNodes);
        };

        // Click handler: persistent selection for standards (dims unrelated)
        const nodeClick = (event, d) => {
            if (d.qualityType !== 'standard') return;

            const isSameSelection = this.renderer.selectionActive && this.renderer.selection && this.renderer.selection.id === d.id;

            // Clear all highlights first
            this.renderer.nodes.each(function (node) {
                node.highlighted = false;
                node.connectedHighlighted = false;
            });

            if (isSameSelection) {
                // Deselect
                this.renderer.selectionActive = false;
                this.renderer.setSelectionDimming(null, null, false);
                this.renderer.highlightNode(d.id, false, null);
                return;
            }

            // Compute related nodes: direct qualities, properties via those qualities, requirements attached to those qualities,
            // and qualities connected to those qualities (quality↔quality)
            const qualities = new Set();
            const props = new Set();
            const reqs = new Set();
            const relatedQuals = new Set();
            // First pass: collect direct neighbors (qualities)
            this.renderer.links.each(function (link) {
                if (link.source.id === d.id) {
                    if (link.target.qualityType === 'quality') {
                        qualities.add(link.target.id);
                    }
                    link.target.connectedHighlighted = true;
                }
                if (link.target.id === d.id) {
                    if (link.source.qualityType === 'quality') {
                        qualities.add(link.source.id);
                    }
                    link.source.connectedHighlighted = true;
                }
            });
            // Build lookup for selected qualities
            const qualLookup = new Set(qualities);
            // Second pass: collect properties (2-hop), requirements, and related qualities attached to those qualities
            this.renderer.links.each(function (link) {
                const sId = link.source.id;
                const tId = link.target.id;
                const sType = link.source.qualityType;
                const tType = link.target.qualityType;

                // Properties connected to selected qualities
                if (qualLookup.has(sId) && tType === 'property') {
                    props.add(tId);
                    link.target.connectedHighlighted = true;
                }
                if (qualLookup.has(tId) && sType === 'property') {
                    props.add(sId);
                    link.source.connectedHighlighted = true;
                }

                // Requirements connected to selected qualities (indirect relation to the standard)
                if (qualLookup.has(sId) && tType === 'requirement') {
                    reqs.add(tId);
                    link.target.connectedHighlighted = true;
                }
                if (qualLookup.has(tId) && sType === 'requirement') {
                    reqs.add(sId);
                    link.source.connectedHighlighted = true;
                }

                // Qualities connected to the selected qualities (quality↔quality edges)
                if (qualLookup.has(sId) && tType === 'quality') {
                    relatedQuals.add(tId);
                    link.target.connectedHighlighted = true;
                }
                if (qualLookup.has(tId) && sType === 'quality') {
                    relatedQuals.add(sId);
                    link.source.connectedHighlighted = true;
                }
            });
            const connectedNodes = new Set([...qualities, ...props, ...reqs, ...relatedQuals]);

            // Mark selected and apply visuals
            d.highlighted = true;
            this.renderer.selectionActive = true;
            this.renderer.highlightNode(d.id, true, connectedNodes);
            this.renderer.setSelectionDimming(d.id, connectedNodes, true);
        };

        return this.registerEventHandlers({
            nodeHover,
            nodeDoubleClick,
            nodeClick
        });
    }
}
