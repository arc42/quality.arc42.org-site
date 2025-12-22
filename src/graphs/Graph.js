/**
 * Base Graph class
 * Responsible for managing graph data and rendering
 */
import { MultiGraph } from "graphology";
import { NODE_TYPES, QUALITY_ROOT_ID } from "./constants";
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
            this.applyEnhancedRadialLayout(QUALITY_ROOT_ID, 250);
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
        if (this.graph.hasNode(QUALITY_ROOT_ID)) {
            this.graph.dropNode(QUALITY_ROOT_ID);
        }
        this.graph.addNode(QUALITY_ROOT_ID, {
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
            if (this.graph.hasNode(node.id)) {
                this.graph.dropNode(node.id);
            }
            this.graph.addNode(node.id, {
                label: node.label,
                size: node.size,
                color: node.color,
                qualityType: node.qualityType,
                page: node.page,
            });
        });
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

        // STEP 1: Position property nodes
        const propertyNodes = this._positionPropertyNodes(rootId, levelRadius);
        if (propertyNodes.length > 0) {
            // STEP 2 & 3: Find quality nodes and group by connections
            const {
                qualityNodesByConnections,
                propertyConnections
            } = this._analyzeQualityNodeConnections(propertyNodes);

            // STEP 4: Position quality nodes
            this._positionQualityNodes(qualityNodesByConnections, levelRadius);

            // Position standard nodes
            this._positionStandardNodes(levelRadius);

            // STEP 5 & 6: Position requirement nodes
            this._positionRequirementNodes(propertyConnections, levelRadius);

            // STEP 7: Adjust nodes to avoid overlaps
            this._adjustNodeOverlaps(30); // 30 = minimum distance between nodes
        }
    }

    _positionPropertyNodes(rootId, levelRadius) {
        const propertyNodes = this.graph
            .inNeighbors(rootId)
            .filter((n) => this.graph.getNodeAttribute(n, "qualityType") === NODE_TYPES.PROPERTY);

        if (propertyNodes.length === 0) return [];

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
        return propertyNodes;
    }

    _analyzeQualityNodeConnections(propertyNodes) {
        const propertyConnections = new Map(); // Maps quality node to its property parents

        propertyNodes.forEach((propNode) => {
            this.graph.inNeighbors(propNode).forEach((n) => {
                if (this.graph.getNodeAttribute(n, "qualityType") === "quality") {
                    if (!propertyConnections.has(n)) {
                        propertyConnections.set(n, []);
                    }
                    propertyConnections.get(n).push(propNode);
                }
            });
        });

        const qualityNodesByConnections = new Map();
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

        return { qualityNodesByConnections, propertyConnections };
    }

    _positionQualityNodes(qualityNodesByConnections, levelRadius) {
        // Single-property quality nodes
        if (qualityNodesByConnections.has(1)) {
            this._positionSinglePropertyQualityNodes(qualityNodesByConnections.get(1), levelRadius);
        }

        // Multi-property quality nodes
        const maxConns = Array.from(qualityNodesByConnections.keys()).reduce((a, b) => Math.max(a, b), 0);
        for (let connCount = 2; connCount <= maxConns; connCount++) {
            if (qualityNodesByConnections.has(connCount)) {
                this._positionMultiPropertyQualityNodes(qualityNodesByConnections.get(connCount), levelRadius);
            }
        }
    }

    _positionSinglePropertyQualityNodes(singleConnNodes, levelRadius) {
        const nodesByProperty = new Map();
        singleConnNodes.forEach(({ id, connections }) => {
            const propId = connections[0];
            if (!nodesByProperty.has(propId)) nodesByProperty.set(propId, []);
            nodesByProperty.get(propId).push(id);
        });

        nodesByProperty.forEach((nodes, propId) => {
            const propX = this.graph.getNodeAttribute(propId, "x");
            const propY = this.graph.getNodeAttribute(propId, "y");
            const propAngle = this.graph.getNodeAttribute(propId, "angle");

            const qualityRadius = levelRadius;
            const angleStep = Math.PI / 1.5 / (nodes.length + 1);

            nodes.forEach((nodeId, i) => {
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

    _positionMultiPropertyQualityNodes(multiConnNodes, levelRadius) {
        multiConnNodes.forEach(({ id, connections }) => {
            let avgX = 0, avgY = 0;
            connections.forEach((propId) => {
                avgX += this.graph.getNodeAttribute(propId, "x");
                avgY += this.graph.getNodeAttribute(propId, "y");
            });

            avgX /= connections.length;
            avgY /= connections.length;

            const distFromCenter = Math.hypot(avgX, avgY);
            const radius = distFromCenter + levelRadius * 0.8;

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

    _positionStandardNodes(levelRadius) {
        const standardNodes = [];
        this.graph.forEachNode((nodeId, attrs) => {
            if (attrs.qualityType === "standard") standardNodes.push(nodeId);
        });

        if (standardNodes.length > 0) {
            const r = levelRadius * 2.2;
            const startAngle = -Math.PI * 0.9;
            const endAngle = -Math.PI * 0.1;
            const angleStep = (endAngle - startAngle) / (standardNodes.length + 1);
            const approxLevel = Math.max(3, Math.round(1 + (r / (30 * 3))));

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
    }

    _positionRequirementNodes(propertyConnections, levelRadius) {
        const reqByQuality = new Map();
        this.graph.forEachNode((nodeId, attrs) => {
            if (attrs.qualityType === "requirement") {
                const parents = this.graph.outNeighbors(nodeId)
                    .filter((n) => this.graph.getNodeAttribute(n, "qualityType") === "quality");
                if (parents.length > 0) {
                    const mainParent = parents[0];
                    if (!reqByQuality.has(mainParent)) reqByQuality.set(mainParent, []);
                    reqByQuality.get(mainParent).push(nodeId);
                }
            }
        });

        reqByQuality.forEach((reqs, qualityId) => {
            const qualityX = this.graph.getNodeAttribute(qualityId, "x");
            const qualityY = this.graph.getNodeAttribute(qualityId, "y");
            const angleToCenter = Math.atan2(qualityY, qualityX);

            const reqRadius = levelRadius * 0.7;
            const reqAngleStep = Math.PI / (reqs.length + 1);

            reqs.forEach((reqId, i) => {
                const angle = angleToCenter + Math.PI - reqAngleStep * (reqs.length / 2) + reqAngleStep * (i + 1);
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

    /**
     * Adjust node positions to minimize overlaps
     * @private
     * @param {number} minDistance - Minimum distance between nodes
     */
    _adjustNodeOverlaps(minDistance) {
        const iterations = 50;
        const nodePositions = this._initNodePositions(minDistance);

        // Iterative adjustment
        for (let iter = 0; iter < iterations; iter++) {
            let moved = false;
            for (let i = 0; i < nodePositions.length; i++) {
                const nodeA = nodePositions[i];
                const { dx, dy, moved: nodeMoved } = this._computeNodeShift(nodeA, i, nodePositions);

                if (dx !== 0 || dy !== 0) {
                    nodeA.x += dx;
                    nodeA.y += dy;
                }
                if (nodeMoved) moved = true;

                this._adjustDistanceFromCenter(nodeA, minDistance);
            }
            if (!moved) break;
        }

        // Update graph with new positions
        nodePositions.forEach(({ id, x, y }) => {
            this.graph.updateNodeAttributes(id, (attrs) => ({
                ...attrs,
                x,
                y,
            }));
        });
    }

    _initNodePositions(minDistance) {
        const nodePositions = [];
        this.graph.forEachNode((nodeId, attrs) => {
            const qualityType = attrs.qualityType;
            let nodeDist = minDistance;
            if (qualityType === NODE_TYPES.QUALITY) {
                nodeDist = minDistance * 1.5;
            }
            nodePositions.push({
                id: nodeId,
                x: attrs.x,
                y: attrs.y,
                level: attrs.hierarchyLevel || 1,
                fixed: nodeId === QUALITY_ROOT_ID,
                qualityType: qualityType,
                minDist: nodeDist,
            });
        });
        return nodePositions;
    }

    _computeNodeShift(nodeA, i, nodePositions) {
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
        const distance = Math.hypot(xDiff, yDiff);
        const effectiveMinDist = Math.max(nodeA.minDist, nodeB.minDist);

        if (distance > 0 && distance < effectiveMinDist) {
            const isQualityType = nodeA.qualityType === NODE_TYPES.QUALITY;
            const forceMultiplier = isQualityType ? 0.15 : 0.1;
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
        const distFromCenter = Math.hypot(node.x, node.y);
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
     * @param {string|string[]} filterTerm - The search term(s) to filter by
     * @returns {Graph} This graph instance for chaining
     */
    filter(filterTerm) { // NOTE: FullGraph may want legend-aware filtering in the future
        // Determine if any filter terms are active
        const active = Array.isArray(filterTerm)
                       ? filterTerm.some(t => t?.toString().trim())
                       : filterTerm?.toString().trim();

        // Mark renderer filtering state
        if (this.renderer) this.renderer.isFiltering = !!active;
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
