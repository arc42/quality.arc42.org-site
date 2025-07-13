/**
 * GraphRenderer class
 * Responsible for rendering graph data using D3
 */
import * as d3 from "d3";

export class GraphRenderer {
    /**
     * @param {HTMLElement} container - The container element to render the graph in
     */
    constructor(container) {
        this.container = container;
        this.width = container.clientWidth;
        this.height = container.clientHeight;
        this.svg = null;
        this.nodes = null;
        this.links = null;
        this.labels = null;
        this.simulation = null;
        this.updateLabelVisibility = null;
        this.updateNodeVisibility = null;
        this.currentZoomScale = 1;
    }

    /**
     * Initialize the renderer
     */
    initialize() {
        // Create SVG if it doesn't exist
        if (!this.svg) {
            this.svg = d3.select(this.container)
                .append("svg")
                .attr("width", this.width)
                .attr("height", this.height);
        }

        // Create force simulation
        this.simulation = this.createSimulation();

        // Setup resize handler
        this.container.addEventListener("resize", this.handleResize.bind(this));

        return this;
    }

    /**
     * Handle container resize
     */
    handleResize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;

        if (this.svg) {
            this.svg.attr("width", this.width).attr("height", this.height);
        }

        if (this.simulation) {
            // Adjust center position to account for sidebar width
            const sidebarWidth = 200;
            const centerX = (this.width + sidebarWidth) / 2;

            this.simulation.force("center").x(centerX).y(this.height / 2);
            this.simulation.alpha(1).restart();
        }
    }

    /**
     * Create a D3 force simulation
     * @returns {d3.Simulation} The created simulation
     */
    createSimulation() {
        return d3.forceSimulation()
            .force("link", d3.forceLink().id(d => d.id).distance(150))
            .force("charge", d3.forceManyBody().strength(-400))
            .force("center", d3.forceCenter(this.width / 2, this.height / 2))
            .force("collide", d3.forceCollide().radius(d => d.size * 2));
    }

    /**
     * Render the graph with the given data
     * @param {Object} graphData - Object with nodes and links arrays
     * @param {Function} onNodeHover - Function to call when a node is hovered
     * @param {Function} onNodeDoubleClick - Function to call when a node is double-clicked
     */
    render(graphData, onNodeHover, onNodeDoubleClick) {
        // Clear existing elements
        if (this.svg) {
            this.svg.selectAll("g").remove();
        } else {
            this.initialize();
        }

        // Create links
        this.links = this.svg.append("g")
            .selectAll("line")
            .data(graphData.links)
            .enter()
            .append("line")
            .attr("stroke", "#E0E0E0")
            .attr("stroke-width", 1)
            .attr("opacity", 0.6);

        // Create nodes
        this.nodes = this.svg.append("g")
            .selectAll("circle")
            .data(graphData.nodes)
            .enter()
            .append("circle")
            .attr("r", d => d.size)
            .attr("fill", d => d.color)
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5);

        // Add labels
        this.labels = this.svg.append("g")
            .selectAll("text")
            .data(graphData.nodes)
            .enter()
            .append("text")
            .text(d => d.label)
            .attr("font-size", d => (d.qualityType === "property" || d.id === "quality-root") ? Math.max(10, d.size * 0.45) : 10)
            .attr("text-anchor", d => (d.id === "quality-root" || d.qualityType === "property") ? "middle" : "start")
            .attr("dominant-baseline", d => (d.id === "quality-root" || d.qualityType === "property") ? "middle" : "auto")
            .attr("dx", d => {
                if (d.id === "quality-root" || d.qualityType === "property") {
                    return 0;
                } else {
                    // For requirements and qualities, position labels outside the node
                    return d.size + 5; // Node radius + 5px padding
                }
            })
            .attr("dy", d => (d.id === "quality-root" || d.qualityType === "property") ? 0 : 4);

        // Setup zoom
        this.setupZoom();

        // Setup drag
        this.setupDrag();

        // Setup node interactions
        if (onNodeHover) {
            // Add mouseenter event to highlight the node
            this.nodes.on("mouseenter", onNodeHover);

            // Add mouseleave event to reset highlighting
            this.nodes.on("mouseleave", (event, d) => {
                // Reset all highlights
                this.nodes.each(function (node) {
                    node.highlighted = false;
                    node.connectedHighlighted = false;
                });

                // Reset visual appearance
                this.highlightNode(d.id, false, null);
            });

            // Add hover events to labels that are inside nodes (quality-root and property types)
            const internalLabels = this.labels.filter(d => d.id === "quality-root" || d.qualityType === "property");

            // Add mouseenter event to highlight the node
            internalLabels.on("mouseenter", onNodeHover);

            // Add mouseleave event to reset highlighting
            internalLabels.on("mouseleave", (event, d) => {
                // Reset all highlights
                this.nodes.each(function (node) {
                    node.highlighted = false;
                    node.connectedHighlighted = false;
                });

                // Reset visual appearance
                this.highlightNode(d.id, false, null);
            });
        }

        if (onNodeDoubleClick) {
            this.nodes.on("dblclick", onNodeDoubleClick);
        }

        // Update node positions based on graph layout
        graphData.nodes.forEach(node => {
            node.x = node.x !== undefined ? node.x + this.width / 2 : this.width / 2;
            node.y = node.y !== undefined ? node.y + this.height / 2 : this.height / 2;
        });

        // Setup simulation
        this.simulation.nodes(graphData.nodes)
            .on("tick", this.handleTick.bind(this));

        this.simulation.force("link").links(graphData.links);

        // Set initial label and node visibility
        this.updateLabelVisibility = this.createLabelVisibilityUpdater(this.labels, this.currentZoomScale);
        this.updateNodeVisibility = this.createNodeVisibilityUpdater(this.nodes, this.currentZoomScale);

        this.updateLabelVisibility();
        this.updateNodeVisibility();

        return this;
    }

    /**
     * Handle simulation tick
     */
    handleTick() {
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
            // Batch DOM updates for better performance
            if (this.links) {
                this.links
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);
            }

            if (this.nodes) {
                this.nodes
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y);
            }

            if (this.labels) {
                this.labels
                    .attr("x", d => d.x)
                    .attr("y", d => d.y);
            }
        });
    }

    /**
     * Setup zoom behavior
     */
    setupZoom() {
        const zoom = d3.zoom()
            .on("zoom", (event) => {
                this.svg.selectAll("g").attr("transform", event.transform);
                this.currentZoomScale = event.transform.k;

                // Update label and node visibility
                if (this.updateLabelVisibility) {
                    this.updateLabelVisibility(this.currentZoomScale);
                }

                if (this.updateNodeVisibility) {
                    this.updateNodeVisibility(this.currentZoomScale);
                }
            });

        this.svg.call(zoom);

        // Set initial transform to account for sidebar width
        const sidebarWidth = 200;
        const initialTransform = d3.zoomIdentity.translate(sidebarWidth / 2, 0);
        this.svg.call(zoom.transform, initialTransform);
    }

    /**
     * Setup drag behavior
     */
    setupDrag() {
        // Define the drag behavior
        const dragBehavior = d3.drag()
            .on("start", (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on("end", (event, _) => {
                if (!event.active) this.simulation.alphaTarget(0);
            });

        // Apply drag behavior to nodes
        this.nodes.call(dragBehavior);

        // Apply drag behavior to labels that are inside nodes (quality-root and property types)
        this.labels.filter(d => d.id === "quality-root" || d.qualityType === "property")
            .call(dragBehavior);
    }

    /**
     * Highlight nodes and their connections
     * @param {string} nodeId - ID of the node to highlight
     * @param {boolean} highlight - Whether to highlight or unhighlight
     * @param {Set} [providedConnectedNodes] - Optional Set of connected node IDs
     */
    highlightNode(nodeId, highlight = true, providedConnectedNodes = null) {
        if (!this.nodes || !this.links || !this.labels) return;

        // Highlight the node
        this.nodes.filter(d => d.id === nodeId)
            .classed("highlighted", highlight);

        // Use provided connected nodes if available, otherwise calculate them
        const connectedNodes = providedConnectedNodes || (() => {
            const nodes = new Set();
            this.links.each(function (d) {
                if (d.source.id === nodeId) nodes.add(d.target.id);
                if (d.target.id === nodeId) nodes.add(d.source.id);
            });
            return nodes;
        })();

        this.nodes.filter(d => connectedNodes.has(d.id))
            .classed("connected-highlighted", highlight);

        // Highlight labels
        this.labels.filter(d => d.id === nodeId)
            .classed("highlighted", highlight);

        this.labels.filter(d => connectedNodes.has(d.id))
            .classed("connected-highlighted", highlight);

        this.links.filter(d => d.source.id === nodeId || d.target.id === nodeId)
            .classed("highlighted", highlight)
            .attr("stroke", highlight ? "#941651" : "#E0E0E0")
            .attr("stroke-width", highlight ? 2 : 1);
    }

    /**
     * Get the renderer components
     * @returns {Object} Object with nodes, links, labels, and simulation
     */
    getComponents() {
        return {
            nodes: this.nodes,
            links: this.links,
            labels: this.labels,
            simulation: this.simulation
        };
    }

    /**
     * Clear the renderer
     */
    clear() {
        if (this.svg) {
            this.svg.selectAll("*").remove();
        }
        this.nodes = null;
        this.links = null;
        this.labels = null;
        this.simulation = null;
    }

    /**
     * Creates a function to update node visibility and detail based on zoom level
     *
     * @param {d3.Selection} node - Node selection
     * @param {number} initialZoomScale - Initial zoom scale
     * @returns {Function} Function to update node visibility and detail
     */
    createNodeVisibilityUpdater(node, initialZoomScale) {
        // Store the current zoom scale, initialized with the provided value
        let currentZoomScale = initialZoomScale;

        // Return a function that can either update all nodes or check a single node
        return (nodeData) => {
            // If nodeData is provided, we're checking visibility for a single node
            if (nodeData) {
                // Always show root, property, and requirement nodes at full detail
                if (nodeData.id === "quality-root" || nodeData.qualityType === "property" || nodeData.qualityType === "requirement") {
                    return {
                        visible: true,
                        size: nodeData.size,
                        opacity: 1,
                        strokeWidth: 1.5
                    };
                }

                // For quality nodes, adjust detail based on zoom level
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

                    // Always show root, property, and requirement nodes at full detail
                    if (d.id === "quality-root" || d.qualityType === "property" || d.qualityType === "requirement") {
                        nodeElement.style("display", null);
                        nodeElement.attr("opacity", 1);
                        nodeElement.attr("r", d.size);
                        nodeElement.attr("stroke-width", 1.5);
                        return;
                    }

                    // For quality nodes, adjust detail based on zoom level
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
    createLabelVisibilityUpdater(label, initialZoomScale) {
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

                // For quality and requirement nodes, hide labels when zoom level is too low
                // Higher threshold for quality and requirement nodes to hide their labels sooner when zooming out
                const visibilityThreshold = nodeData.qualityType === "quality" || nodeData.qualityType === "requirement"
                                            ? 1.2 / (nodeData.size / 10) // Higher threshold for quality and requirement nodes
                                            : 0.8 / (nodeData.size / 10); // Original threshold for other nodes

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

                    // For quality and requirement nodes, hide labels when zoom level is too low
                    // Higher threshold for quality and requirement nodes to hide their labels sooner when zooming out
                    const visibilityThreshold = d.qualityType === "quality" || d.qualityType === "requirement"
                                                ? 1.2 / (d.size / 10) // Higher threshold for quality and requirement nodes
                                                : 0.8 / (d.size / 10); // Original threshold for other nodes

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
}
