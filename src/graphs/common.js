/**
 * Common utilities for graph visualization
 */
import { MultiGraph } from "graphology";
import * as d3 from "d3";
import { applyEnhancedRadialLayout, createEdges, createNodes, createRootNode } from "./utils";
import { registerGraphEvents } from "./events";
import { registerFilterEvents } from "./filter";

/**
 * Creates a graph with the given name and data
 *
 * @param {string} name - Graph name (home or fullpage)
 * @param {Array} propertyNodes - Property nodes data
 * @param {Array} nodes - Quality and requirement nodes data
 * @param {Array} edges - Edge data
 * @returns {MultiGraph} The created graph
 */
export function createGraph(name, propertyNodes, nodes, edges) {
    const graph = new MultiGraph();
    graph.setAttribute("name", name);
    graph.setAttribute("qualityType", "q42");

    try {
        createRootNode(graph, "Quality", 35, "darkorange");
        createNodes(graph, propertyNodes);
        createNodes(graph, nodes);
        createEdges(graph, edges);
    } catch (error) {
        console.error("Could not render graph", { cause: error });
    }

    // For homepage, hide quality nodes and remove requirement nodes
    if (name === "home") {
        graph.forEachNode((node) => {
            const nodeType = graph.getNodeAttribute(node, "qualityType");
            const isQualityNode = nodeType === "quality";
            const isRequirementNode = nodeType === "requirement";

            if (isRequirementNode) graph.dropNode(node);
            if (isQualityNode) graph.setNodeAttribute(node, "hidden", true);
        });
    }

    applyEnhancedRadialLayout(graph, "quality-root", 250);
    return graph;
}

/**
 * Calculate node size based on connections
 *
 * @param {MultiGraph} graph - The graph
 * @param {string} nodeId - Node ID
 * @param {string} qualityType - Node quality type
 * @returns {number} The calculated node size
 */
export function calculateNodeSize(graph, nodeId, qualityType) {
    // Keep the root node size as is
    if (nodeId === "quality-root") {
        return 35;
    }

    // For property nodes, size based on number of connected quality nodes
    if (qualityType === "property") {
        const connectedQualities = graph.inNeighbors(nodeId)
            .filter(n => graph.getNodeAttribute(n, "qualityType") === "quality");
        // Base size 15, plus 2 for each connected quality, with a minimum of 15
        return Math.max(15, 15 + connectedQualities.length * 2);
    }

    // For quality nodes, size based on number of connected property nodes
    if (qualityType === "quality") {
        const connectedProperties = graph.outNeighbors(nodeId)
            .filter(n => graph.getNodeAttribute(n, "qualityType") === "property");
        // Base size 8, plus 2 for each connected property, with a minimum of 8
        return Math.max(8, 8 + connectedProperties.length * 2);
    }

    // For requirement nodes, keep a smaller fixed size
    return 5;
}

/**
 * Prepares graph data for D3
 *
 * @param {MultiGraph} graph - The graph
 * @returns {Object} Object with nodes and links arrays
 */
export function prepareGraphData(graph) {
    const graphData = {
        nodes: [],
        links: []
    };

    // Add nodes to D3 data
    graph.forEachNode((nodeId, attrs) => {
        if (!attrs.hidden) {
            // Calculate size based on connections
            const size = calculateNodeSize(graph, nodeId, attrs.qualityType);

            graphData.nodes.push({
                id: nodeId,
                ...attrs,
                size: size
            });
        }
    });

    // Add edges to D3 data
    graph.forEachEdge((edgeId, attrs, source, target) => {
        // Only add edges where both nodes are visible
        if (!graph.getNodeAttribute(source, "hidden") && !graph.getNodeAttribute(target, "hidden")) {
            graphData.links.push({
                id: edgeId,
                source,
                target,
                ...attrs
            });
        }
    });

    return graphData;
}

/**
 * Creates a D3 force simulation
 *
 * @param {number} width - Container width
 * @param {number} height - Container height
 * @returns {d3.Simulation} The created simulation
 */
export function createSimulation(width, height) {
    return d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(d => d.size * 1.5));
}

/**
 * Creates SVG elements for the graph
 *
 * @param {HTMLElement} container - Container element
 * @param {Object} graphData - Graph data with nodes and links
 * @param {number} width - Container width
 * @param {number} height - Container height
 * @returns {Object} Object with svg, node, link, and label selections
 */
export function createSvgElements(container, graphData, width, height) {
    // Create SVG
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create links
    const link = svg.append("g")
        .selectAll("line")
        .data(graphData.links)
        .enter()
        .append("line")
        .attr("stroke", "#E0E0E0")
        .attr("stroke-width", 1)
        .attr("opacity", 0.6);

    // Create nodes
    const node = svg.append("g")
        .selectAll("circle")
        .data(graphData.nodes)
        .enter()
        .append("circle")
        .attr("r", d => d.size)
        .attr("fill", d => d.color)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5);

    // Add labels
    const label = svg.append("g")
        .selectAll("text")
        .data(graphData.nodes)
        .enter()
        .append("text")
        .text(d => d.label)
        .attr("font-size", d => (d.qualityType === "property" || d.id === "quality-root") ? Math.max(10, d.size * 0.45) : 10)
        .attr("text-anchor", d => (d.id === "quality-root" || d.qualityType === "property") ? "middle" : "start")
        .attr("dominant-baseline", d => (d.id === "quality-root" || d.qualityType === "property") ? "middle" : "auto")
        .attr("dx", d => (d.id === "quality-root" || d.qualityType === "property") ? 0 : 12)
        .attr("dy", d => (d.id === "quality-root" || d.qualityType === "property") ? 0 : 4);

    return { svg, node, link, label };
}

/**
 * Sets up zoom behavior for the graph
 *
 * @param {d3.Selection} svg - SVG selection
 * @param {Function} updateLabelVisibility - Function to update label visibility
 * @param {Function} updateNodeVisibility - Function to update node visibility and detail
 * @returns {Object} Object with zoom function and currentZoomScale
 */
export function setupZoom(svg, updateLabelVisibility, updateNodeVisibility) {
    let currentZoomScale = 1;

    const zoom = d3.zoom()
        .on("zoom", (event) => {
            svg.selectAll("g").attr("transform", event.transform);
            currentZoomScale = event.transform.k;

            // Update label visibility if function is provided
            if (updateLabelVisibility) {
                // Pass the current zoom scale to the updateLabelVisibility function
                updateLabelVisibility(currentZoomScale);
            }

            // Update node visibility and detail if function is provided
            if (updateNodeVisibility) {
                // Pass the current zoom scale to the updateNodeVisibility function
                updateNodeVisibility(currentZoomScale);
            }
        });

    svg.call(zoom);
    return { zoom, currentZoomScale };
}

/**
 * Sets up drag behavior for nodes
 *
 * @param {d3.Selection} node - Node selection
 * @param {d3.Simulation} simulation - D3 force simulation
 */
export function setupDrag(node, simulation) {
    node.call(d3.drag()
        .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        })
        .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
        })
        .on("end", (event, _) => {
            if (!event.active) simulation.alphaTarget(0);
        }));
}

/**
 * Updates the D3 visualization based on the current graph state
 * Optimized to remove hidden elements from the DOM for better performance
 *
 * @param {Object} renderer - D3 renderer object
 * @param {MultiGraph} graph - The graph
 * @param {Function} updateLabelVisibility - Optional function to update label visibility
 * @param {Function} updateNodeVisibility - Optional function to update node visibility and detail
 */
export function updateD3Visualization(renderer, graph, updateLabelVisibility, updateNodeVisibility) {
    // Update nodes with optimized DOM handling
    renderer.nodes.each(function (d) {
        const nodeElement = d3.select(this);
        const isHidden = graph.getNodeAttribute(d.id, "hidden");

        // Update visual attributes
        nodeElement
            .attr("fill", graph.getNodeAttribute(d.id, "color"))
            .classed("highlighted", d.highlighted)
            .classed("connected-highlighted", d.connectedHighlighted);

        // If node is hidden, remove it from the DOM for better performance
        if (isHidden) {
            nodeElement.style("display", "none");
            nodeElement.attr("opacity", 0);
        } else if (!isHidden && updateNodeVisibility) {
            const nodeDetail = updateNodeVisibility(d);
            // Apply detail level adjustments
            if (nodeDetail.visible) {
                nodeElement.style("display", null);
                nodeElement.attr("opacity", nodeDetail.opacity || 1);
                // Adjust node size based on detail level
                nodeElement.attr("r", nodeDetail.size);
                // Adjust stroke width based on detail level
                nodeElement.attr("stroke-width", nodeDetail.strokeWidth);
            } else {
                nodeElement.style("display", "none");
                nodeElement.attr("opacity", 0);
            }
        } else {
            nodeElement.style("display", null);
            nodeElement.attr("opacity", 1);
        }
    });

    // Update links with optimized DOM handling
    renderer.links.each(function (d) {
        const linkElement = d3.select(this);
        const isHidden = graph.getEdgeAttribute(d.id, "hidden");

        // Update visual attributes
        linkElement.attr("stroke", graph.getEdgeAttribute(d.id, "color") || "#E0E0E0");

        // If link is hidden, remove it from the DOM for better performance
        if (isHidden) {
            linkElement.style("display", "none");
            linkElement.attr("opacity", 0);
        } else {
            linkElement.style("display", null);
            linkElement.attr("opacity", 0.6);
        }
    });

    // Update labels with optimized DOM handling
    if (renderer.labels) {
        renderer.labels.each(function (d) {
            const labelElement = d3.select(this);
            const isNodeHidden = graph.getNodeAttribute(d.id, "hidden");

            // Update visual attributes
            labelElement
                .classed("highlighted", d.highlighted)
                .classed("connected-highlighted", d.connectedHighlighted);

            // If node is hidden, hide the label
            if (isNodeHidden) {
                labelElement.style("display", "none");
                labelElement.attr("opacity", 0);
                return;
            }

            // Determine label visibility
            let opacity = 0.7; // Default visibility

            // If we have a custom visibility updater, use it
            if (updateLabelVisibility) {
                opacity = updateLabelVisibility(d);
            } else if (d.id === "quality-root" || graph.getNodeAttribute(d.id, "qualityType") === "property" || d.highlighted || d.connectedHighlighted) {
                opacity = 1;
            }

            // Apply visibility
            labelElement.attr("opacity", opacity);

            // If label is not visible, remove it from the DOM for better performance
            if (opacity === 0) {
                labelElement.style("display", "none");
            } else {
                labelElement.style("display", null);
            }
        });
    }
}

/**
 * Creates a function to update node visibility and detail based on zoom level
 *
 * @param {d3.Selection} node - Node selection
 * @param {number} initialZoomScale - Initial zoom scale
 * @returns {Function} Function to update node visibility and detail
 */
export function createNodeVisibilityUpdater(node, initialZoomScale) {
    // Store the current zoom scale, initialized with the provided value
    let currentZoomScale = initialZoomScale;

    // Return a function that can either update all nodes or check a single node
    return (nodeData) => {
        // If nodeData is provided, we're checking visibility for a single node
        if (nodeData) {
            // Always show root and property nodes at full detail
            if (nodeData.id === "quality-root" || nodeData.qualityType === "property") {
                return {
                    visible: true,
                    size: nodeData.size,
                    opacity: 1,
                    strokeWidth: 1.5
                };
            }

            // For other nodes, adjust detail based on zoom level
            // Calculate visibility threshold based on node size
            const visibilityThreshold = 0.4 / (nodeData.size / 10);

            // Check if this node or a connected node is highlighted
            const isHighlighted = nodeData.highlighted || nodeData.connectedHighlighted;

            // If node is too small to be visible at current zoom level and not highlighted, hide it
            if (!isHighlighted && currentZoomScale < visibilityThreshold) {
                return { visible: false };
            }

            // Otherwise, adjust detail level based on zoom
            // Calculate size factor - reduce size when zoomed out
            const sizeFactor = Math.min(1, Math.max(0.5, currentZoomScale / 1.5));
            // Calculate stroke width - thinner strokes when zoomed out
            const strokeWidth = Math.min(1.5, Math.max(0.5, currentZoomScale / 1.5));

            // For highlighted nodes, always show at full detail
            if (isHighlighted) {
                return {
                    visible: true,
                    size: nodeData.size,
                    opacity: 1,
                    strokeWidth: 1.5
                };
            }

            // For normal nodes, adjust detail based on zoom
            return {
                visible: true,
                size: nodeData.size * sizeFactor,
                opacity: Math.min(1, Math.max(0.6, currentZoomScale / 1.2)),
                strokeWidth: strokeWidth
            };
        }
        // Otherwise, update all nodes with the current zoom scale
        else {
            // If a zoom scale is provided as the first argument, update the stored value
            if (typeof arguments[0] === 'number') {
                currentZoomScale = arguments[0];
            }

            // Update all nodes based on their type and zoom level
            node.each(function (d) {
                const nodeElement = d3.select(this);

                // Always show root and property nodes at full detail
                if (d.id === "quality-root" || d.qualityType === "property") {
                    nodeElement.style("display", null);
                    nodeElement.attr("opacity", 1);
                    nodeElement.attr("r", d.size);
                    nodeElement.attr("stroke-width", 1.5);
                    return;
                }

                // For other nodes, adjust detail based on zoom level
                // Calculate visibility threshold based on node size
                const visibilityThreshold = 0.4 / (d.size / 10);

                // Check if this node or a connected node is highlighted
                const isHighlighted = d.highlighted || d.connectedHighlighted;

                // If node is too small to be visible at current zoom level and not highlighted, hide it
                if (!isHighlighted && currentZoomScale < visibilityThreshold) {
                    nodeElement.style("display", "none");
                    nodeElement.attr("opacity", 0);
                    return;
                }

                // Otherwise, adjust detail level based on zoom
                // Calculate size factor - reduce size when zoomed out
                const sizeFactor = Math.min(1, Math.max(0.5, currentZoomScale / 1.5));
                // Calculate stroke width - thinner strokes when zoomed out
                const strokeWidth = Math.min(1.5, Math.max(0.5, currentZoomScale / 1.5));

                // For highlighted nodes, always show at full detail
                if (isHighlighted) {
                    nodeElement.style("display", null);
                    nodeElement.attr("opacity", 1);
                    nodeElement.attr("r", d.size);
                    nodeElement.attr("stroke-width", 1.5);
                    return;
                }

                // For normal nodes, adjust detail based on zoom
                nodeElement.style("display", null);
                nodeElement.attr("opacity", Math.min(1, Math.max(0.6, currentZoomScale / 1.2)));
                nodeElement.attr("r", d.size * sizeFactor);
                nodeElement.attr("stroke-width", strokeWidth);
            });
        }
    };
}

/**
 * Creates a function to update label visibility based on zoom level
 *
 * @param {d3.Selection} label - Label selection
 * @param {number} initialZoomScale - Initial zoom scale
 * @returns {Function} Function to update label visibility
 */
export function createLabelVisibilityUpdater(label, initialZoomScale) {
    // Store the current zoom scale, initialized with the provided value
    let currentZoomScale = initialZoomScale;

    // Return a function that can either update all labels or check a single node
    return (nodeData) => {
        // If nodeData is provided, we're checking visibility for a single node
        if (nodeData) {
            // Always show labels for root and property nodes as specified in the requirements
            if (nodeData.id === "quality-root" || nodeData.qualityType === "property") {
                return 1;
            }

            // For other nodes, show labels only when zoomed in enough
            // The threshold is based on node size - larger nodes' labels remain visible longer when zooming out
            const visibilityThreshold = 0.8 / (nodeData.size / 10);

            // Check if this node or a connected node is highlighted
            const isHighlighted = nodeData.highlighted || nodeData.connectedHighlighted;

            // Show label if node is highlighted or zoom is sufficient
            return (isHighlighted || currentZoomScale > visibilityThreshold) ? 1 : 0;
        }
        // Otherwise, update all labels with the current zoom scale
        else {
            // If a zoom scale is provided as the first argument, update the stored value
            if (typeof arguments[0] === 'number') {
                currentZoomScale = arguments[0];
            }

            // Update all labels based on their type and zoom level
            label.each(function (d) {
                const labelElement = d3.select(this);

                // Always show labels for root and property nodes as specified in the requirements
                if (d.id === "quality-root" || d.qualityType === "property") {
                    labelElement.attr("opacity", 1);
                    // Make these labels more prominent
                    labelElement.attr("font-weight", "bold");
                    return;
                }

                // For other nodes, show labels only when zoomed in enough
                // The threshold is based on node size - larger nodes' labels remain visible longer when zooming out
                const visibilityThreshold = 0.8 / (d.size / 10);

                // Check if this node or a connected node is highlighted
                const isHighlighted = d.highlighted || d.connectedHighlighted;

                // Show label if node is highlighted or zoom is sufficient
                const opacity = (isHighlighted || currentZoomScale > visibilityThreshold) ? 1 : 0;
                labelElement.attr("opacity", opacity);

                // If the label is not visible, remove it from the DOM for better performance
                if (opacity === 0 && !isHighlighted) {
                    labelElement.style("display", "none");
                } else {
                    labelElement.style("display", "default");
                }
            });
        }
    };
}

/**
 * Initializes and renders a graph
 *
 * @param {string} containerId - ID of the container element
 * @param {string} graphName - Name of the graph (home or fullpage)
 * @param {Array} propertyNodesData - Property nodes data
 * @param {Array} nodesData - Quality and requirement nodes data
 * @param {Array} edgesData - Edge data
 * @returns {Object} Object with graph and renderer
 */
export function initializeAndRenderGraph(containerId, graphName, propertyNodesData, nodesData, edgesData) {
    // Create graph
    const graph = createGraph(graphName, propertyNodesData, nodesData, edgesData);

    // Get container and dimensions
    const container = document.getElementById(containerId);
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create D3 force simulation
    const simulation = createSimulation(width, height);

    // Prepare data for D3
    const graphData = prepareGraphData(graph);

    // Create SVG elements
    const { svg, node, link, label } = createSvgElements(container, graphData, width, height);
    container.addEventListener("resize", (event) => {
        console.warn("Container resized, updating SVG dimensions", event);
        // Update SVG dimensions on resize
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        svg.attr("width", newWidth).attr("height", newHeight);
        simulation.force("center").x(newWidth / 2).y(newHeight / 2);
        simulation.alpha(1).restart();
    });

    // Create label and node visibility updaters
    let currentZoomScale = 1;
    const updateLabelVisibility = createLabelVisibilityUpdater(label, currentZoomScale);
    const updateNodeVisibility = createNodeVisibilityUpdater(node, currentZoomScale);

    // Setup zoom with both visibility updaters
    const zoomResult = setupZoom(svg, updateLabelVisibility, updateNodeVisibility);
    currentZoomScale = zoomResult.currentZoomScale;

    // Setup drag
    setupDrag(node, simulation);

    // Update node positions based on graph layout
    graphData.nodes.forEach(node => {
        node.x = graph.getNodeAttribute(node.id, "x") + width / 2;
        node.y = graph.getNodeAttribute(node.id, "y") + height / 2;
    });

    // Optimize force simulation tick updates
    simulation.nodes(graphData.nodes)
        .on("tick", () => {
            // Use requestAnimationFrame for better performance
            requestAnimationFrame(() => {
                // Batch DOM updates for better performance
                link
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);

                node
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y);

                label
                    .attr("x", d => d.x)
                    .attr("y", d => d.y);
            });
        });

    simulation.force("link").links(graphData.links);

    // Create renderer object for event handling
    const renderer = {
        nodes: node,
        links: link,
        labels: label,
        simulation: simulation
    };

    // Set initial label visibility
    updateLabelVisibility();

    // Register custom interactions
    registerGraphEvents(graph, renderer, container, updateNodeVisibility, updateLabelVisibility);

    // Register filter events for fullpage graph
    if (graphName === "fullpage") {
        registerFilterEvents(graph, renderer);
    }

    return { graph, renderer };
}
