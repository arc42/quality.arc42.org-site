import { MultiGraph } from "graphology";
import { getDefaultNodeColor } from "./utils";
import { updateD3Visualization } from "./common";

/**
 * Adds a pointer cursor for non-quality root nodes
 * @param {String} hoveredNode
 * @param {HTMLElement} container
 */
const addPointerOnForNonQualityRootNode = (hoveredNode, container) => {
    if (hoveredNode !== "quality-root") container.style.cursor = "pointer";
}

/**
 * Resets the cursor to default
 * @param {HTMLElement} container
 * @returns {string}
 */
const resetCursorToDefault = (container) => container.style.cursor = "default";

/**
 * Registers event handlers for the home graph view
 * @param {MultiGraph} graph
 * @param {Object} renderer - D3 renderer object
 * @param {HTMLElement} container - Container element
 * @param {Function} updateNodeVisibility - Optional function to update node visibility and detail
 * @param {Function} updateLabelVisibility - Optional function to update label visibility based on zoom level
 */
export const registerHomeGraphEvents = (renderer, graph, container, updateNodeVisibility, updateLabelVisibility) => {
    // Common function to handle node and label hover
    const handleNodeHover = (d) => {
        const hoveredNode = d.id;
        addPointerOnForNonQualityRootNode(hoveredNode, container);

        // Set highlighted flag on hovered node
        d.highlighted = true;

        // Track connected nodes to highlight their labels
        const connectedNodes = new Set();

        if (graph.getNodeAttribute(hoveredNode, "qualityType") === "property") {
            graph.forEachEdge((edge, _, sourceNode, targetNode) => {
                const isSourceProperty = graph.getNodeAttribute(sourceNode, "qualityType") === "property";
                if (targetNode === hoveredNode) {
                    graph.updateNodeAttribute(sourceNode, "hidden", () => false);
                    graph.updateEdgeAttribute(edge, "hidden", () => false);

                    // Add connected node to the set
                    connectedNodes.add(sourceNode);
                } else if (!isSourceProperty) {
                    graph.updateEdgeAttribute(edge, "hidden", () => true);
                }
            });
        }

        // Set connectedHighlighted flag for connected nodes
        renderer.nodes.each(node => {
            if (connectedNodes.has(node.id)) {
                node.connectedHighlighted = true;
            }
        });

        // Update D3 visualization
        updateD3Visualization(renderer, graph, updateLabelVisibility, updateNodeVisibility);
    };

    // Common function to handle node and label leave
    const handleNodeLeave = () => {
        resetCursorToDefault(container);

        // Reset all highlight flags for nodes
        renderer.nodes.each(node => {
            node.highlighted = false;
            node.connectedHighlighted = false;
        });

        // Reset all highlight flags for labels
        renderer.labels.each(label => {
            label.highlighted = false;
            label.connectedHighlighted = false;
        });

        graph.forEachNode((node) => {
            const { qualityType, hidden } = graph.getNodeAttributes(node);
            if (qualityType === "quality" && !hidden) {
                graph.updateNodeAttribute(node, "hidden", () => true);
            }
        });

        // Update D3 visualization
        updateD3Visualization(renderer, graph, updateLabelVisibility, updateNodeVisibility);
    };

    // Register events for nodes
    renderer.nodes.on("mouseenter", (event, d) => handleNodeHover(d));
    renderer.nodes.on("mouseleave", handleNodeLeave);

    // Register events for labels
    renderer.labels.on("mouseenter", (event, d) => handleNodeHover(d));
    renderer.labels.on("mouseleave", handleNodeLeave);
};

/**
 * Registers event handlers for the full graph view
 * @param {MultiGraph} graph
 * @param {Object} renderer - D3 renderer object
 * @param {HTMLElement} container - Container element
 * @param {Function} updateNodeVisibility - Optional function to update node visibility and detail
 * @param {Function} updateLabelVisibility - Optional function to update label visibility based on zoom level
 */
export const registerFullGraphEvents = (renderer, graph, container, updateNodeVisibility, updateLabelVisibility) => {
    // Common function to handle node and label hover
    const handleNodeHover = (d) => {
        const hoveredNode = d.id;
        addPointerOnForNonQualityRootNode(hoveredNode, container);

        // Set highlighted flag on hovered node
        d.highlighted = true;

        // Track connected nodes to highlight their labels
        const connectedNodes = new Set();

        graph.forEachEdge((edgeId, _, sourceNode, targetNode) => {
            const isRelated = sourceNode === hoveredNode || targetNode === hoveredNode;
            graph.updateEdgeAttribute(edgeId, "color", () => (isRelated ? "red" : "#E0E0E0"));

            // Add connected nodes to the set
            if (isRelated) {
                if (sourceNode !== hoveredNode) connectedNodes.add(sourceNode);
                if (targetNode !== hoveredNode) connectedNodes.add(targetNode);
            }
        });

        // Update node colors and set connectedHighlighted flag
        renderer.nodes.each(node => {
            const isConnected = graph.hasEdge(hoveredNode, node.id) || graph.hasEdge(node.id, hoveredNode);
            if (node.id === hoveredNode) {
                graph.updateNodeAttribute(hoveredNode, "color", () => getDefaultNodeColor(graph, hoveredNode));
            } else {
                graph.updateNodeAttribute(node.id, "color", () =>
                    isConnected ? graph.getNodeAttribute(node.id, "color") : "#CCCCCC"
                );
            }

            // Set connectedHighlighted flag for connected nodes
            if (connectedNodes.has(node.id)) {
                node.connectedHighlighted = true;
            }
        });


        // Update D3 visualization
        updateD3Visualization(renderer, graph, updateLabelVisibility, updateNodeVisibility);
    };

    // Common function to handle node and label leave
    const handleNodeLeave = () => {
        resetCursorToDefault(container);

        graph.forEachEdge((edgeId) => {
            graph.updateEdgeAttribute(edgeId, "color", () => "#E0E0E0");
        });

        // Reset all highlight flags for nodes
        renderer.nodes.each(node => {
            node.highlighted = false;
            node.connectedHighlighted = false;
            graph.updateNodeAttribute(node.id, "color", () => getDefaultNodeColor(graph, node.id));
        });

        // Reset all highlight flags for labels
        renderer.labels.each(label => {
            label.highlighted = false;
            label.connectedHighlighted = false;
        });

        // Update D3 visualization
        updateD3Visualization(renderer, graph, updateLabelVisibility, updateNodeVisibility);
    };

    // Register events for nodes
    renderer.nodes.on("mouseenter", (event, d) => handleNodeHover(d));
    renderer.nodes.on("mouseleave", handleNodeLeave);

    // Register events for labels
    renderer.labels.on("mouseenter", (event, d) => handleNodeHover(d));
    renderer.labels.on("mouseleave", handleNodeLeave);
};

/**
 * Registers all event handlers for a given graph
 * @param {MultiGraph} graph
 * @param {Object} renderer - D3 renderer object
 * @param {HTMLElement} container - Container element
 * @param {Function} updateNodeVisibility - Optional function to update node visibility and detail
 * @param {Function} updateLabelVisibility - Optional function to update label visibility based on zoom level
 */
export const registerGraphEvents = (graph, renderer, container, updateNodeVisibility, updateLabelVisibility) => {
    const graphName = graph.getAttribute("name");

    renderer.nodes.on("dblclick", (event, d) => {
        if (d.id !== "quality-root") {
            window.location.href = graph.getNodeAttribute(d.id, "page");
        }
    });

    if (graphName === "home") {
        registerHomeGraphEvents(renderer, graph, container, updateNodeVisibility, updateLabelVisibility);
    } else {
        registerFullGraphEvents(renderer, graph, container, updateNodeVisibility, updateLabelVisibility);
    }
};
