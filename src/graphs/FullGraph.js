/**
 * FullGraph class
 * Specialized graph implementation for the full page graph with filtering
 */
import { Graph } from "./Graph";

export class FullGraph extends Graph {
    /**
     * @param {string} containerId - ID of the container element
     * @param {GraphDataProvider} dataProvider - Data provider instance
     */
    constructor(containerId, dataProvider) {
        super(containerId, "fullpage", dataProvider);
        this.filterInput = document.getElementById("full-q-graph-filter__input");
        this.filterButton = document.getElementById("full-q-graph-filter__btn");
        this.debounceTimeout = null;
    }

    /**
     * Initialize the graph and register filter controls
     * @returns {FullGraph} This graph instance for chaining
     */
    initialize() {
        super.initialize();
        this.registerFilterControls();
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
