/**
 * Base Graph class
 * Responsible for managing graph data and rendering
 */
import { MultiGraph } from "graphology";
import { GraphDataProvider } from "./GraphDataProvider";
import { GraphRenderer } from "./GraphRenderer";

export class Graph {
    /**
     * @param {string} containerId - ID of the container element
     * @param {string} name - Graph name (home or fullpage)
     * @param {GraphDataProvider} dataProvider - Data provider instance
     */
    constructor(containerId, name, dataProvider) {
        this.containerId = containerId;
        this.name = name;
        this.dataProvider = dataProvider;
        this.container = document.getElementById(containerId);
        this.graph = new MultiGraph();
        this.renderer = new GraphRenderer(this.container);
        this.eventHandlers = {};
    }

    /**
     * Initialize the graph
     * @returns {Graph} This graph instance for chaining
     */
    initialize() {
        // Set graph attributes
        this.graph.setAttribute("name", this.name);
        this.graph.setAttribute("qualityType", "q42");

        // Initialize the renderer
        this.renderer.initialize();

        return this;
    }

    /**
     * Build the graph structure from data
     * @returns {HomeGraph} This graph instance for chaining
     */
    buildGraph() {
        const { propertyNodes, nodes, edges } = this.dataProvider.getData();

        try {
            this.createRootNode("Quality", 55, "#ebebeb");
            // Create nodes and edges
            this.createNodes(propertyNodes);
            this.createNodes(nodes);
            this.createEdges(edges);

            // Apply layout
            this.applyEnhancedRadialLayout("quality-root", 250);
        } catch (error) {
            console.error("Could not build graph", { cause: error });
        }

        return this;
    }

    /**
     * Creates the root node of the graph
     * @param {string} label - Label for the root node
     * @param {number} size - Size of the root node
     * @param {string} color - Color of the root node
     */
    createRootNode(label, size, color) {
        if (this.graph.hasNode("quality-root")) this.graph.dropNode("quality-root");
        this.graph.addNode("quality-root", {
            label,
            size,
            x: 0,
            y: 0,
            color,
        });
    }

    /**
     * Creates node elements
     * @param {{id: string, label: string, size: number, color: string, qualityType: string, page: string}[]} nodes - Array of node data
     */
    createNodes(nodes) {
        nodes.forEach((node) => {
                if (this.graph.hasNode(node.id)) this.graph.dropNode(node.id);
                this.graph.addNode(node.id, {
                    label: node.label,
                    size: node.size,
                    color: node.color,
                    qualityType: node.qualityType,
                    page: node.page,
                });
            }
        );
    }

    /**
     * Creates edges between nodes
     * @param {{source: string, target: string}[]} edges - Array of edge data
     */
    createEdges(edges) {
        edges.forEach((edge) => {
            try {
                if (this.graph.hasNode(edge.source) && this.graph.hasNode(edge.target)) {
                    this.graph.addEdge(edge.source, edge.target);
                } else {
                    // Silently skip edges whose endpoints are not present in the current view
                    // This can happen after filtering where some nodes are intentionally hidden
                }
            } catch (e) {
                // Extra safety: do not let a bad edge crash the graph build
                // You may enable logging below for debugging specific datasets
                console.warn("Skipped invalid edge", edge, e);
            }
        });
    }


    /**
     * Creates an enhanced radial hierarchical layout that handles interconnected nodes
     *
     * @param {string} rootId - ID of the root node
     * @param {number} levelRadius - Base radius between hierarchy levels
     */
    applyEnhancedRadialLayout(rootId, levelRadius = 150) {
        // Place root at center
        this.graph.updateNodeAttributes(rootId, (attr) => ({
            ...attr,
            x: 0,
            y: 0,
            hierarchyLevel: 1,
        }));

        // STEP 1: Position property nodes (Level 2) in a circle around root
        const propertyNodes = this.graph
            .inNeighbors(rootId)
            .filter((n) => this.graph.getNodeAttribute(n, "qualityType") === "property");

        // If there are no property nodes (e.g., after filtering), skip radial placement for properties
        if (propertyNodes.length === 0) {
            return;
        }

        const propertyAngleStep = (2 * Math.PI) / propertyNodes.length;

        propertyNodes.forEach((propNode, i) => {
            const angle = i * propertyAngleStep;
            const x = levelRadius * Math.cos(angle);
            const y = levelRadius * Math.sin(angle);

            this.graph.updateNodeAttributes(propNode, (attr) => ({
                ...attr,
                x,
                y,
                angle,
                hierarchyLevel: 2,
            }));
        });

        // STEP 2: Find all quality nodes (blue) and analyze their connections
        const qualityNodes = new Set();
        const propertyConnections = new Map(); // Maps quality node to its property parents

        propertyNodes.forEach((propNode) => {
            this.graph.inNeighbors(propNode).forEach((n) => {
                if (this.graph.getNodeAttribute(n, "qualityType") === "quality") {
                    qualityNodes.add(n);

                    // Track connections
                    if (!propertyConnections.has(n)) {
                        propertyConnections.set(n, []);
                    }
                    propertyConnections.get(n).push(propNode);
                }
            });
        });

        // STEP 3: Organize quality nodes by number of property connections
        const qualityNodesByConnections = new Map(); // Group quality nodes by connection count

        propertyConnections.forEach((connections, qualityNode) => {
            const count = connections.length;
            if (!qualityNodesByConnections.has(count)) {
                qualityNodesByConnections.set(count, []);
            }
            qualityNodesByConnections.get(count).push({
                id: qualityNode,
                connections: connections,
            });
        });

        // STEP 4: Position quality nodes
        // Single-property quality nodes go in circles around their property
        if (qualityNodesByConnections.has(1)) {
            const singleConnNodes = qualityNodesByConnections.get(1);

            // Group by parent property
            const nodesByProperty = new Map();
            singleConnNodes.forEach(({ id, connections }) => {
                const propId = connections[0];
                if (!nodesByProperty.has(propId)) {
                    nodesByProperty.set(propId, []);
                }
                nodesByProperty.get(propId).push(id);
            });

            // Place them in circles around their property
            nodesByProperty.forEach((nodes, propId) => {
                const propX = this.graph.getNodeAttribute(propId, "x");
                const propY = this.graph.getNodeAttribute(propId, "y");
                const propAngle = this.graph.getNodeAttribute(propId, "angle");

                const qualityRadius = levelRadius; // Slightly smaller than main level radius
                const angleStep = Math.PI / 1.5 / (nodes.length + 1);

                nodes.forEach((nodeId, i) => {
                    // Use angle that points away from center
                    const angle = propAngle - Math.PI / 4 + (i + 1) * angleStep;
                    const x = propX + qualityRadius * Math.cos(angle);
                    const y = propY + qualityRadius * Math.sin(angle);

                    this.graph.updateNodeAttributes(nodeId, (attr) => ({
                        ...attr,
                        x,
                        y,
                        hierarchyLevel: 3,
                    }));
                });
            });
        }

        // Multi-property quality nodes go in intermediate positions
        for (let connCount = 2; connCount <= propertyNodes.length; connCount++) {
            if (qualityNodesByConnections.has(connCount)) {
                const multiConnNodes = qualityNodesByConnections.get(connCount);

                multiConnNodes.forEach(({ id, connections }) => {
                    // Calculate center position between all connected properties
                    let avgX = 0,
                        avgY = 0;
                    connections.forEach((propId) => {
                        avgX += this.graph.getNodeAttribute(propId, "x");
                        avgY += this.graph.getNodeAttribute(propId, "y");
                    });

                    avgX /= connections.length;
                    avgY /= connections.length;

                    // Calculate distance from center to determine proper radius
                    const distFromCenter = Math.sqrt(avgX * avgX + avgY * avgY);
                    const radius = distFromCenter + levelRadius * 0.8; // Place slightly outward from properties

                    // Normalize and scale to radius
                    if (distFromCenter > 0) {
                        const factor = radius / distFromCenter;
                        avgX *= factor;
                        avgY *= factor;
                    }

                    this.graph.updateNodeAttributes(id, (attr) => ({
                        ...attr,
                        x: avgX,
                        y: avgY,
                        hierarchyLevel: 3,
                    }));
                });
            }
        }

        // Position standard nodes above qualities (top arc)
        const standardNodes = [];
        this.graph.forEachNode((nodeId, attrs) => {
            if (attrs.qualityType === "standard") standardNodes.push(nodeId);
        });
        if (standardNodes.length > 0) {
            const r = levelRadius * 2.2; // radius above qualities
            const startAngle = -Math.PI * 0.9; // near top-left
            const endAngle = -Math.PI * 0.1;   // near top-right
            const angleStep = (endAngle - startAngle) / (standardNodes.length + 1);
            // Compute approximate level to keep distance during overlap adjustment
            const approxLevel = Math.max(3, Math.round(1 + (r / (30 * 3)))); // minDistance assumed 30
            standardNodes.forEach((nodeId, i) => {
                const angle = startAngle + angleStep * (i + 1);
                const x = r * Math.cos(angle);
                const y = r * Math.sin(angle);
                this.graph.updateNodeAttributes(nodeId, (attr) => ({
                    ...attr,
                    x,
                    y,
                    hierarchyLevel: approxLevel,
                }));
            });
        }

        // STEP 5: Find requirement nodes (if not hidden)
        const reqNodes = new Set();
        qualityNodes.forEach((qualityNode) => {
            this.graph.inNeighbors(qualityNode).forEach((n) => {
                if (this.graph.getNodeAttribute(n, "qualityType") === "requirement") {
                    reqNodes.add(n);
                }
            });
        });

        // STEP 6: Position requirement nodes around their quality nodes
        if (reqNodes.size > 0) {
            // Group requirements by quality node
            const reqByQuality = new Map();
            reqNodes.forEach((reqId) => {
                const parents = this.graph
                    .outNeighbors(reqId)
                    .filter((n) => this.graph.getNodeAttribute(n, "qualityType") === "quality");

                // For simplicity, assign to first parent (could be enhanced for multi-parent)
                if (parents.length > 0) {
                    const mainParent = parents[0];
                    if (!reqByQuality.has(mainParent)) {
                        reqByQuality.set(mainParent, []);
                    }
                    reqByQuality.get(mainParent).push(reqId);
                }
            });

            // Position requirements in circles around their quality nodes
            reqByQuality.forEach((reqs, qualityId) => {
                const qualityX = this.graph.getNodeAttribute(qualityId, "x");
                const qualityY = this.graph.getNodeAttribute(qualityId, "y");

                // Calculate angle to center
                const angleToCenter = Math.atan2(qualityY, qualityX);

                const reqRadius = levelRadius * 0.7;
                const reqAngleStep = Math.PI / (reqs.length + 1);

                reqs.forEach((reqId, i) => {
                    // Start from the opposite direction of the center
                    const angle =
                        angleToCenter + Math.PI - reqAngleStep * (reqs.length / 2) + reqAngleStep * (i + 1);
                    const x = qualityX + reqRadius * Math.cos(angle);
                    const y = qualityY + reqRadius * Math.sin(angle);

                    this.graph.updateNodeAttributes(reqId, (attr) => ({
                        ...attr,
                        x,
                        y,
                        hierarchyLevel: 4,
                    }));
                });
            });
        }

        // STEP 7: Adjust nodes to avoid overlaps
        this._adjustNodeOverlaps(30); // 30 = minimum distance between nodes
    }

    /**
     * Adjust node positions to minimize overlaps
     * @private
     * @param {number} minDistance - Minimum distance between nodes
     */
    _adjustNodeOverlaps(minDistance) {
        const iterations = 50;
        const nodePositions = [];

        // Hilfsfunktion: Initialisiere nodePositions
        const initNodePositions = () => {
            this.graph.forEachNode((nodeId, attrs) => {
                const qualityType = attrs.qualityType;
                let nodeDist = minDistance;
                if (qualityType === "quality") {
                    nodeDist = minDistance * 1.5;
                }
                nodePositions.push({
                    id: nodeId,
                    x: attrs.x,
                    y: attrs.y,
                    level: attrs.hierarchyLevel || 1,
                    fixed: nodeId === "quality-root",
                    qualityType: qualityType,
                    minDist: nodeDist,
                });
            });
        };

        // Hilfsfunktion: Berechne Verschiebung für einen Knoten
        const computeNodeShift = (nodeA, i) => {
            if (nodeA.fixed) return { dx: 0, dy: 0, moved: false };
            let dx = 0, dy = 0, moved = false;
            for (let j = 0; j < nodePositions.length; j++) {
                if (i === j) continue;
                const nodeB = nodePositions[j];
                const repulsion = this._computeRepulsion(nodeA, nodeB);
                dx += repulsion.dx;
                dy += repulsion.dy;
                if (repulsion.moved) moved = true;
            }
            return { dx, dy, moved };
        };

        initNodePositions();

        // Iterative Anpassung
        for (let iter = 0; iter < iterations; iter++) {
            let moved = false;
            for (let i = 0; i < nodePositions.length; i++) {
                const nodeA = nodePositions[i];
                const { dx, dy, moved: nodeMoved } = computeNodeShift(nodeA, i);

                if (dx !== 0 || dy !== 0) {
                    nodeA.x += dx;
                    nodeA.y += dy;
                }
                if (nodeMoved) moved = true;

                this._adjustDistanceFromCenter(nodeA, minDistance);
            }
            if (!moved) break;
        }

        // Update graph mit neuen Positionen
        nodePositions.forEach(({ id, x, y }) => {
            this.graph.updateNodeAttributes(id, (attrs) => ({
                ...attrs,
                x,
                y,
            }));
        });
    }

    /**
     * Compute the force of repulsion between two nodes
     * @private
     * @param {Object} nodeA - First node
     * @param {Object} nodeB - Second node
     * @returns {Object} - Object with dx, dy, and moved properties
     */
    _computeRepulsion(nodeA, nodeB) {
        const xDiff = nodeA.x - nodeB.x;
        const yDiff = nodeA.y - nodeB.y;
        const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
        const effectiveMinDist = Math.max(nodeA.minDist, nodeB.minDist);

        if (distance > 0 && distance < effectiveMinDist) {
            let forceMultiplier = nodeA.qualityType === "quality" ? 0.15 : 0.1;
            const force = (effectiveMinDist - distance) / distance;
            return {
                dx: xDiff * force * forceMultiplier,
                dy: yDiff * force * forceMultiplier,
                moved: true,
            };
        }
        return { dx: 0, dy: 0, moved: false };
    }

    /**
     * Keep nodes at a distance from the center based on their hierarchy level
     * @private
     * @param {Object} node - Node to adjust
     * @param {number} minDistance - Minimum distance between nodes
     */
    _adjustDistanceFromCenter(node, minDistance) {
        const distFromCenter = Math.sqrt(node.x * node.x + node.y * node.y);
        const targetDist = (node.level - 1) * minDistance * 3;
        if (Math.abs(distFromCenter - targetDist) > minDistance * 0.5) {
            const angle = Math.atan2(node.y, node.x);
            node.x = targetDist * Math.cos(angle);
            node.y = targetDist * Math.sin(angle);
        }
    }

    /**
     * Prepare graph data for D3
     * @returns {Object} Object with nodes and links arrays
     */
    prepareGraphData() {
        const graphData = {
            nodes: [],
            links: []
        };

        // Add nodes to D3 data
        this.graph.forEachNode((nodeId, attrs) => {
            if (!attrs.hidden) {
                graphData.nodes.push({
                    id: nodeId,
                    ...attrs,
                    size: attrs.size
                });
            }
        });

        // Add edges to D3 data
        this.graph.forEachEdge((edgeId, attrs, source, target) => {
            // Only add edges where both nodes are visible
            if (!this.graph.getNodeAttribute(source, "hidden") && !this.graph.getNodeAttribute(target, "hidden")) {
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
     * Render the graph
     * @returns {Graph} This graph instance for chaining
     */
    render() {
        const graphData = this.prepareGraphData();

        // Render the graph
        this.renderer.render(
            graphData,
            this.eventHandlers.nodeHover,
            this.eventHandlers.nodeDoubleClick,
            this.eventHandlers.nodeClick
        );

        return this;
    }

    /**
     * Register event handlers
     * @param {Object} handlers - Object with event handler functions
     * @returns {Graph} This graph instance for chaining
     */
    registerEventHandlers(handlers) {
        this.eventHandlers = { ...this.eventHandlers, ...handlers };
        return this;
    }

    /**
     * Filter the graph data and re-render
     * @param {string} filterTerm - The search term to filter by
     * @returns {Graph} This graph instance for chaining
     */
    filter(filterTerm) { // NOTE: FullGraph may want legend-aware filtering in the future
        // Mark renderer filtering state
        if (this.renderer) this.renderer.isFiltering = !!filterTerm && filterTerm.trim() !== "";
        // Filter the data
        this.dataProvider.filterByTerm(filterTerm);
        this.renderFiltered();
        return this;
    }

    renderFiltered() {
        this._rebuildRenderAndCenter();
    }

    /**
     * Internal helper to rebuild graph from current provider data, render, and center with simulation warm-up
     * Keeps behavior identical across filter/reset paths and centralizes logic for maintainability
     * @private
     */
    _rebuildRenderAndCenter() {
        // Rebuild the graph with current provider data
        this.graph = new MultiGraph();
        this.graph.setAttribute("name", this.name);
        this.graph.setAttribute("qualityType", "q42");

        this.buildGraph();
        this.render();

        // Heat up the simulation to ensure nodes spread out properly
        if (this.renderer.simulation) {
            // Run the simulation with a higher alpha target to ensure nodes spread out
            this.renderer.simulation.alpha(1).alphaTarget(0.3).restart();

            // Center the view on the filtered nodes
            this.renderer.centerView();

            // After a short time, cool down the simulation
            setTimeout(() => {
                this.renderer.simulation.alphaTarget(0);

                // Center the view again after the simulation has settled
                this.renderer.centerView();
            }, 1000);
        }
    }

    /**
     * Reset the filter and re-render the graph
     * @returns {Graph} This graph instance for chaining
     */
    resetFilter() {
        if (this.renderer) this.renderer.isFiltering = false;
        this.dataProvider.resetFilter();

        this._rebuildRenderAndCenter();

        return this;
    }

    /**
     * Get the graph instance
     * @returns {MultiGraph} The graph instance
     */
    getGraph() {
        return this.graph;
    }

    /**
     * Get the renderer instance
     * @returns {GraphRenderer} The renderer instance
     */
    getRenderer() {
        return this.renderer;
    }
}
