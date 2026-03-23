/**
 * HomeGraph class
 * Specialized graph implementation for the homepage
 */
import { Graph } from "./Graph";
import { QUALITY_ROOT_ID } from "./constants";
import { isRootId } from "./nodeUtils";

export class HomeGraph extends Graph {
    /**
     * @param {string} containerId - ID of the container element
     * @param {GraphDataProvider} dataProvider - Data provider instance
     */
    constructor(containerId, dataProvider) {
        super(containerId, "home", dataProvider);
        this.layerState = {
            quality: true,
            requirement: false,
            standard: false,
            approach: false,
        };
        this.activeDimensionFilter = null;
        this.homeContainer = null;
        this.homeHeight = 520;
        this.lastOverlayTrigger = null;
        this.overlayCloseTimer = null;
    }

    /**
     * Initialize the graph and add the full graph toggle button
     * @returns {HomeGraph} This graph instance for chaining
     */
    initialize() {
        super.initialize();
        this.homeContainer = this.container;
        this.homeHeight = this.container?.clientHeight || this.homeHeight;
        this.renderer.typeVisibility.quality = this.layerState.quality;
        this.renderer.typeVisibility.requirement = this.layerState.requirement;
        this.renderer.typeVisibility.standard = this.layerState.standard;
        return this;
    }

    /**
     * Build the graph structure from data
     * @returns {HomeGraph} This graph instance for chaining
     */
    buildGraph() {
        this.graph.clear();
        return super.buildGraph();
    }

    /**
     * Register default event handlers for the home graph
     * @returns {Graph} This graph instance for chaining
     */
    registerDefaultEventHandlers() {
        // Default double-click handler for navigation
        const nodeDoubleClick = (event, d) => {
            if (!isRootId(d.id)) {
                window.location.href = this.graph.getNodeAttribute(d.id, "page");
            }
        };

        // Default click hover handler for highlighting
        const nodeHover = (event, d) => {
            // Toggle highlight state
            const isHighlighted = d.highlighted;

            // Clear all highlights first
            this.renderer.nodes?.each(function (node) {
                node.highlighted = false;
                node.connectedHighlighted = false;
            });

            const connectedNodes = new Set();
            if (!isHighlighted) {
                // Highlight this node and its connections
                d.highlighted = true;

                // Find connected nodes
                this.renderer.links?.each(function (link) {
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

    /**
     * Toggle one graph layer and update mirrored controls.
     * @param {'quality'|'requirement'|'standard'|'approach'} nodeType
     * @param {boolean} visible
     * @returns {HomeGraph}
     */
    setLayerVisible(nodeType, visible) {
        if (!(nodeType in this.layerState)) return this;

        if (nodeType === "approach") {
            this.layerState.approach = false;
            this.syncLayerControls();
            return this;
        }

        this.layerState[nodeType] = !!visible;
        this.renderer.setTypeVisibility(nodeType, visible);
        this.syncLayerControls();
        return this;
    }

    /**
     * Toggle the active dimension filter.
     * @param {string} dimensionId
     * @returns {HomeGraph}
     */
    toggleDimensionFilter(dimensionId) {
        if (!dimensionId) return this;

        if (this.activeDimensionFilter === dimensionId) {
            this.activeDimensionFilter = null;
            this.resetFilter();
        } else {
            this.activeDimensionFilter = dimensionId;
            this.filter(dimensionId);
        }

        this.syncDimensionPins();
        return this;
    }

    syncLayerControls() {
        const layerKeyByButton = {
            q: "quality",
            r: "requirement",
            s: "standard",
            a: "approach",
        };

        document.querySelectorAll(".q42-layer-toggle[data-layer]").forEach((button) => {
            const layer = layerKeyByButton[button.dataset.layer];
            if (!layer) return;

            const isOn = !!this.layerState[layer];
            const isDisabled = layer === "approach";

            button.classList.toggle("on", isOn);
            button.setAttribute("aria-pressed", String(isOn));
            button.classList.toggle("is-disabled", isDisabled);

            if (isDisabled) {
                button.setAttribute("disabled", "");
                button.setAttribute("aria-disabled", "true");
            } else {
                button.removeAttribute("disabled");
                button.removeAttribute("aria-disabled");
            }
        });
    }

    syncDimensionPins() {
        document.querySelectorAll(".q42-dim-pin[data-d]").forEach((button) => {
            const isActive = button.dataset.d === this.activeDimensionFilter;
            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
    }

    openOverlay(trigger = null) {
        const overlay = document.getElementById("q42-graph-overlay");
        const overlayCanvas = document.getElementById("q42-graph-overlay-canvas");
        const closeButton = overlay?.querySelector(".q42-close-btn");

        if (!overlay || !overlayCanvas || !this.renderer.svg?.node()) return this;
        if (!overlay.hidden) return this;

        clearTimeout(this.overlayCloseTimer);
        this.lastOverlayTrigger = trigger || document.activeElement;

        overlay.removeAttribute("hidden");
        this.renderer.attachToContainer(overlayCanvas);
        this.renderer.resize(
            overlayCanvas.clientWidth || window.innerWidth,
            overlayCanvas.clientHeight || (window.innerHeight - 160),
            { recenter: false }
        );
        this.renderer.simulation?.alpha(0.15).restart();
        document.body.style.overflow = "hidden";

        requestAnimationFrame(() => {
            overlay.classList.add("is-open");
            closeButton?.focus();
        });

        return this;
    }

    closeOverlay() {
        const overlay = document.getElementById("q42-graph-overlay");
        if (!overlay || overlay.hidden || !this.homeContainer) return this;

        overlay.classList.remove("is-open");
        this.renderer.attachToContainer(this.homeContainer);
        this.renderer.resize(
            this.homeContainer.clientWidth || window.innerWidth,
            this.homeContainer.clientHeight || this.homeHeight,
            { recenter: false }
        );
        this.renderer.simulation?.alpha(0.05).restart();
        document.body.style.overflow = "";

        this.overlayCloseTimer = setTimeout(() => {
            overlay.setAttribute("hidden", "");
            this.lastOverlayTrigger?.focus?.();
        }, 180);

        return this;
    }
}
