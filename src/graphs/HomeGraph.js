/**
 * HomeGraph class
 * Specialized graph implementation for the homepage
 */
import { Graph } from "./Graph";

export class HomeGraph extends Graph {
    /**
     * @param {string} containerId - ID of the container element
     * @param {GraphDataProvider} dataProvider - Data provider instance
     */
    constructor(containerId, dataProvider) {
        super(containerId, "home", dataProvider);
        this.fullGraphToggle = null;
    }

    /**
     * Initialize the graph and add the full graph toggle button
     * @returns {HomeGraph} This graph instance for chaining
     */
    initialize() {
        super.initialize();
        this.addFullGraphToggle();
        return this;
    }

    /**
     * Build the graph structure from data
     * @returns {HomeGraph} This graph instance for chaining
     */
    buildGraph() {
        // For homepage, we need to prepare the data differently
        // Get home graph data (only root and property nodes)
        const homeData = this.dataProvider.prepareHomeGraphData();

        try {
            this.graph.clear();

            this.createRootNode("Quality", 55, "#ebebeb");
            this.createNodes(homeData.propertyNodes);
            this.createEdges(homeData.edges);

            this.applyEnhancedRadialLayout("quality-root", 250);
        } catch (error) {
            console.error("Could not build home graph", { cause: error });
        }

        return this;
    }

    /**
     * Add the full graph toggle button to the container
     * @returns {HomeGraph} This graph instance for chaining
     */
    addFullGraphToggle() {
        // Create the button element
        this.fullGraphToggle = document.createElement('button');
        this.fullGraphToggle.id = 'full-graph-toggle';
        this.fullGraphToggle.innerHTML = '<i class="fas fa-expand"></i>';
        this.fullGraphToggle.setAttribute('aria-label', 'Open full graph');
        this.fullGraphToggle.title = 'Open full graph';

        // Add click event listener to navigate to the full graph page
        this.fullGraphToggle.addEventListener('click', () => {
            window.location.href = '/full-quality-graph';
        });

        // Add the button to the container
        this.container.appendChild(this.fullGraphToggle);

        return this;
    }

    /**
     * Register default event handlers for the home graph
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
