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
    }

    /**
     * Build the graph structure from data
     * @returns {HomeGraph} This graph instance for chaining
     */
    buildGraph() {
        // For homepage, we need to prepare the data differently
        // Get home graph data (no requirements, hidden qualities)
        const homeData = this.dataProvider.prepareHomeGraphData();

        // #941651

        try {
            this.graph.clear(); // Clear any existing graph data

            this.createRootNode("Quality", 35, "#ebebeb");
            this.createNodes(homeData.propertyNodes);
            this.createNodes(homeData.nodes);
            this.createEdges(homeData.edges);

            this.applyEnhancedRadialLayout("quality-root", 250);

        } catch (error) {
            console.error("Could not build home graph", { cause: error });
        }

        return this;
    }

    /**
     * Register default event handlers for the home graph
     * @returns {HomeGraph} This graph instance for chaining
     */
    registerDefaultEventHandlers() {
        // Default double-click handler for navigation
        const nodeDoubleClick = (event, d) => {
            if (d.id !== "quality-root") {
                window.location.href = this.graph.getNodeAttribute(d.id, "page");
            }
        };

        // Default click handler for highlighting
        const nodeClick = (event, d) => {
            // Toggle highlight state
            const isHighlighted = d.highlighted;

            // Clear all highlights first
            this.renderer.nodes.each(function (node) {
                node.highlighted = false;
                node.connectedHighlighted = false;
            });

            if (!isHighlighted) {
                // Highlight this node and its connections
                d.highlighted = true;

                // Find connected nodes
                const connectedNodes = new Set();
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
            this.renderer.highlightNode(d.id, !isHighlighted);
        };

        return this.registerEventHandlers({
            nodeClick,
            nodeDoubleClick
        });
    }
}
