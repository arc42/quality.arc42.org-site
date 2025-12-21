import * as d3 from "d3";
import { NODE_TYPES } from './constants';
import { isProperty, isQuality, isRequirement, isRoot, isStandard } from './nodeUtils';

/**
 * GraphRenderer class
 * Responsible for rendering graph data using D3 (Canvas for nodes/links + SVG for labels/interactions)
 */
export class GraphRenderer {

    /**
     * @param {HTMLElement} container - The container element to render the graph in
     */
    constructor(container) {
        // Centralized helpers
        this._legendHidden = (d, typeVis) => {
            if (d) {
                if (isQuality(d)) return typeVis.quality === false;
                if (isRequirement(d)) return typeVis.requirement === false;
                if (isStandard(d)) return typeVis.standard === false;
            }
            return false; // root & property never hidden by legend
        };
        this._isStdSelectionActive = () => !!(this.selectionActive && this.selection?.isStandard);
        this._nodeHighlighted = (d) => !!(d?.highlighted || d?.connectedHighlighted);
        this._labelVisibilityThreshold = (d) => ((isQuality(d) || isRequirement(d) || isStandard(d)) ? 1.2 : 0.8) / (d.size / 10);
        this._nodeVisibilityThreshold = (d) => 0.4 / (d.size / 10);
        this._edgeEndpointsRelated = (edge, sel) => {
            const a = edge.source.id, b = edge.target.id;
            const aRel = (a === sel.id) || sel.connected.has(a);
            const bRel = (b === sel.id) || sel.connected.has(b);
            return aRel && bRel;
        };
        this._edgeShouldShowDespiteRoot = (edge, sel) => {
            if (sel.isStandard) {
                const a = edge.source, b = edge.target;
                const isRootAPropB = isRoot(a) && isProperty(b);
                const isRootBPropA = isRoot(b) && isProperty(a);
                if (isRootAPropB && (sel.connected.has(b.id) || sel.id === b.id)) return true;
                if (isRootBPropA && (sel.connected.has(a.id) || sel.id === a.id)) return true;
            }
            return false;
        };
        this._hideIfDimmedPropertyUnderStd = (d) => this._isStdSelectionActive() && isProperty(d) && d._dimmed;
        this.container = container;
        this.width = container.clientWidth;
        this.height = container.clientHeight;
        // Canvas and SVG layers
        this.canvas = null;
        this.ctx = null;
        this.svg = null;
        this.nodes = null; // invisible circles for hit testing
        this.links = null; // hidden SVG lines retained for data adjacency
        this.labels = null; // visible SVG text labels
        this.virtualLinksLayer = null; // unused for rendering; kept for compatibility
        this.virtualLinks = null; // selection, not rendered (hidden)
        this.virtualEdgesData = [];
        this.simulation = null;
        this.updateLabelVisibility = null;
        this.updateNodeVisibility = null;
        this.currentZoomScale = 1;
        this.currentTransform = d3.zoomIdentity;
        this.isFiltering = false;
        // Persistent selection state (used to keep dimming active on click)
        this.selectionActive = false;
        this.selection = { id: null, connected: new Set() };
        // Legend-driven type visibility (properties and root are always visible)
        this.typeVisibility = {
            quality: true,
            requirement: false,
            standard: true
        };
        // Tooltip for synonym display
        this.tooltip = null;
        this._createTooltip();
    }

    /**
     * Create tooltip element for displaying synonym information
     * @private
     */
    _createTooltip() {
        // Remove existing tooltip if any
        d3.select(this.container).select('.graph-tooltip').remove();

        // Create new tooltip
        this.tooltip = d3.select(this.container)
            .append('div')
            .attr('class', 'graph-tooltip')
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('background-color', 'rgba(0, 0, 0, 0.85)')
            .style('color', '#fff')
            .style('padding', '8px 12px')
            .style('border-radius', '4px')
            .style('font-size', '13px')
            .style('pointer-events', 'none')
            .style('z-index', '1000')
            .style('box-shadow', '0 2px 8px rgba(0,0,0,0.3)')
            .style('max-width', '250px')
            .style('line-height', '1.4');
    }

    /**
     * Show tooltip with node information
     * @param {Object} node - The node data
     * @param {MouseEvent} event - The mouse event
     * @private
     */
    _showTooltip(node, event) {
        if (this.tooltip && node) {
            let content = `<strong>${ node.label }</strong>`;

            // Add synonym information if available
            if (node.labels?.length > 1) {
                const synonyms = node.labels.slice(1); // All labels except the first (canonical)
                content += `<br><span style="color: #aaa; font-size: 11px;">Also known as:</span><br>`;
                content += `<span style="color: #00B8F5;">${ synonyms.join(', ') }</span>`;
            }

            // Compute position once to reduce repeated work
            const rect = this.container.getBoundingClientRect();
            const scrollLeft = (this.container.scrollLeft || 0);
            const scrollTop = (this.container.scrollTop || 0);

            this.tooltip
                .html(content)
                .style('visibility', 'visible')
                .style('left', (event.clientX - rect.left + scrollLeft) + 'px')
                .style('top', (event.clientY - rect.top + scrollTop) + 'px');
        }
    }

    /**
     * Hide tooltip
     * @private
     */
    _hideTooltip() {
        if (this.tooltip) {
            this.tooltip.style('visibility', 'hidden');
        }
    }

    // Label layout helpers to keep render() concise
    _labelFontSize(d) {
        const isInternal = isProperty(d) || isRoot(d);
        return isInternal ? Math.max(10, d.size * 0.45) : 10;
    }

    _labelTextAnchor(d) {
        const isInternal = isRoot(d) || isProperty(d);
        return isInternal ? "middle" : "start";
    }

    _labelDominantBaseline(d) {
        const isInternal = isRoot(d) || isProperty(d);
        return isInternal ? "middle" : "auto";
    }

    _labelDx(d) {
        const isInternal = isRoot(d) || isProperty(d);
        if (isInternal) return 0;
        // For requirements and qualities, position labels outside the node
        return d.size + 5; // Node radius + 5px padding
    }

    _labelDy(d) {
        const isInternal = isRoot(d) || isProperty(d);
        return isInternal ? 0 : 4;
    }

    /**
     * Bind common hover handlers to a D3 selection (nodes or labels inside nodes)
     * Keeps logic centralized and reduces duplication.
     * @param {d3.Selection} selection
     * @param {(event: any, d: any) => void} onNodeHover
     * @private
     */
    _bindHoverHandlers(selection, onNodeHover) {
        if (!selection) return;
        // mouseenter
        selection.on("mouseenter", (event, d) => {
            this._showTooltip(d, event);
            if (onNodeHover) onNodeHover(event, d);
        });
        // mouseleave
        selection.on("mouseleave", (event, d) => {
            this._hideTooltip();
            if (this.selectionActive) return;
            // Reset all highlight flags on nodes
            this._resetNodeHighlightFlags();
            // Reset visual appearance for the node we left
            this.highlightNode(d.id, false, null);
        });
    }

    /**
     * Reset per-node in-memory highlight flags (no DOM mutations)
     * Keeps behavior centralized for reuse across handlers.
     * @private
     */
    _resetNodeHighlightFlags() {
        if (!this.nodes) return;
        this.nodes.each(function (node) {
            node.highlighted = false;
            node.connectedHighlighted = false;
        });
    }

    /**
     * Clear per-edge hover highlight flags on real and virtual edges.
     * @private
     */
    _clearEdgeHoverFlags() {
        if (this.links) this.links.each(function (l) {
            l._hoverHighlight = false;
        });
        if (Array.isArray(this.virtualEdgesData)) this.virtualEdgesData.forEach(vl => {
            vl._hoverHighlight = false;
        });
    }

    /**
     * Clear node/label highlight classes and reset related in-memory flags.
     * Does not affect selection state by itself.
     * @private
     */
    _clearNodeLabelHighlightStates() {
        if (this.nodes) {
            this.nodes
                .classed("highlighted", false)
                .classed("connected-highlighted", false)
                .each(function (n) {
                    n.highlighted = false;
                    n.connectedHighlighted = false;
                });
        }
        if (this.labels) {
            this.labels
                .classed("highlighted", false)
                .classed("connected-highlighted", false);
        }
    }

    /**
     * Convenience: clear all hover/highlight visual states and redraw canvas.
     * @private
     */
    _clearAllHoverAndHighlights() {
        this._clearEdgeHoverFlags();
        this._clearNodeLabelHighlightStates();
        this.drawCanvas();
    }

    /**
     * Validates if the given type is supported
     * @param {('quality'|'requirement')} type
     * @returns {boolean} true if type is valid and supported
     */
    isValidNodeType(type) {
        return type in this.typeVisibility;
    }

    /**
     * Set visibility for a node type and apply it
     * @param {('quality'|'requirement'|'standard')} type
     * @param {boolean} visible
     */
    setTypeVisibility(type, visible) {
        if (this.isValidNodeType(type)) {
            this.typeVisibility[type] = !!visible;
            // If standards are being hidden, clear any active standard selection
            if (type === 'standard' && !visible) {
                if (this.selectionActive && this.selection?.isStandard) {
                    this.setSelectionDimming(null, null, false);
                }
                // Clear any hover/highlight flags and classes, then redraw
                this._clearAllHoverAndHighlights();
            }
            // IMPORTANT: Do NOT clear highlights when turning standards back on.
            // Users may have an active selection (e.g., from URL state) that must persist.
            this.applyTypeVisibility();
        }
    }

    /**
     * Apply current type visibility to nodes, labels, and links
     */
    applyTypeVisibility() {
        if (this.nodes && this.labels && this.links) {
            const typeVis = this.typeVisibility;

            // Mark nodes with legendHidden flag used by updaters
            this._updateNodesLegendHidden(typeVis);

            // Update node/label display immediately
            this.nodes.style("display", d => d._legendHidden ? "none" : null);
            this.labels.style("display", d => d._legendHidden ? "none" : null);

            // Hide links connected to hidden nodes
            this.links.style("display", d => {
                const hidden = d.source._legendHidden || d.target._legendHidden;
                d._hiddenByLegendEdge = hidden;
                return hidden ? "none" : null;
            });

            this._handleVirtualEdges(typeVis);

            // Re-run the zoom-based visibility updaters
            this._refreshVisibilityUpdaters();

            // Hide property nodes that have no visible neighbor if filtering is active
            if (this.isFiltering) {
                this._hideIsolatedPropertyNodes(typeVis);
            }

            // Second refresh in case property nodes were hidden
            this._refreshVisibilityUpdaters();

            // Redraw canvas to reflect visibility changes
            this.drawCanvas();
        }
    }

    _updateNodesLegendHidden(typeVis) {
        this.nodes.each(function (d) {
            const t = d.qualityType;
            d._legendHidden = (t === NODE_TYPES.QUALITY && !typeVis.quality) ||
                (t === NODE_TYPES.REQUIREMENT && !typeVis.requirement) ||
                (t === NODE_TYPES.STANDARD && !typeVis.standard);
        });
    }

    _handleVirtualEdges(typeVis) {
        if (!typeVis.quality && typeVis.requirement) {
            this.virtualEdgesData = this._computeVirtualEdges(typeVis);
            this._kickSimulation();
        } else {
            this.virtualEdgesData = [];
            this.virtualLinksLayer?.selectAll('line').remove();
        }
    }

    _kickSimulation() {
        if (this.simulation) {
            const prevAlphaTarget = this.simulation.alphaTarget();
            this.simulation.alpha(0.3).alphaTarget(Math.max(prevAlphaTarget, 0.01)).restart();
            setTimeout(() => {
                if (this.simulation) this.simulation.alphaTarget(prevAlphaTarget || 0);
            }, 100);
        }
    }

    _refreshVisibilityUpdaters() {
        if (this.updateNodeVisibility) this.updateNodeVisibility(this.currentZoomScale);
        if (this.updateLabelVisibility) this.updateLabelVisibility(this.currentZoomScale);
    }

    _hideIsolatedPropertyNodes(typeVis) {
        const nodeById = new Map();
        this.nodes?.each(d => nodeById.set(d.id, d));

        const neighbors = this._buildAdjacencyMap();

        const considerVirtual = !typeVis.quality && typeVis.requirement;
        const renderer = this;

        this.nodes?.each(function (d) {
            if (d.qualityType !== 'property') return;

            let hasVisibleNeighbor = false;
            const nbs = neighbors.get(d.id) || new Set();

            for (const nbId of nbs) {
                const nb = nodeById.get(nbId);
                const isRelevant = nb && (nb.qualityType === 'quality' || nb.qualityType === 'requirement') && !nb._legendHidden;
                if (isRelevant) {
                    hasVisibleNeighbor = true;
                    break;
                }
            }

            if (!hasVisibleNeighbor && considerVirtual) {
                hasVisibleNeighbor = renderer._hasVisibleRequirementNeighborViaQuality(d.id, nodeById, neighbors);
            }

            const displayVal = hasVisibleNeighbor ? null : 'none';
            d3.select(this).style('display', displayVal);
            renderer.labels?.filter(ld => ld.id === d.id).style('display', displayVal);
        });
    }

    _buildAdjacencyMap() {
        const neighbors = new Map();
        const addNb = (a, b) => {
            if (!neighbors.has(a)) neighbors.set(a, new Set());
            neighbors.get(a).add(b);
        };
        this.links.each(d => {
            addNb(d.source.id, d.target.id);
            addNb(d.target.id, d.source.id);
        });
        return neighbors;
    }

    _hasVisibleRequirementNeighborViaQuality(nodeId, nodeById, neighbors) {
        const nbs = neighbors.get(nodeId) || new Set();
        for (const qId of nbs) {
            const qNode = nodeById.get(qId);
            if (qNode?.qualityType === 'quality') {
                const qNbs = neighbors.get(qId) || new Set();
                for (const rId of qNbs) {
                    const rNode = nodeById.get(rId);
                    if (rNode?.qualityType === 'requirement' && !rNode._legendHidden) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Compute virtual edges for current data given type visibility settings.
     * Keeps logic isolated to reduce complexity of applyTypeVisibility.
     * @param {*} typeVis
     * @returns {Array<{source:any,target:any}>}
     * @private
     */
    _computeVirtualEdges(typeVis) {
        const virtualEdges = [];
        // Build quick maps of nodes by id for type lookup
        const nodeById = new Map();
        this.nodes.each(function (d) {
            nodeById.set(d.id, d);
        });

        // Build adjacency for existing links
        const neighbors = new Map();

        function addNeighbor(a, b) {
            if (!neighbors.has(a)) neighbors.set(a, new Set());
            neighbors.get(a).add(b);
        }

        this.links.each(function (d) {
            addNeighbor(d.source.id, d.target.id);
            addNeighbor(d.target.id, d.source.id);
        });

        const standardsVisible = !!typeVis.standard;
        nodeById.forEach((node, id) => {
            if (node.qualityType === NODE_TYPES.REQUIREMENT && !node._legendHidden) {
                const nbs = neighbors.get(id) || new Set();
                nbs.forEach(qId => {
                    const qNode = nodeById.get(qId);
                    if (!qNode || qNode.qualityType !== NODE_TYPES.QUALITY) return;
                    const qNbs = neighbors.get(qId) || new Set();

                    if (standardsVisible) {
                        // Prefer virtual links to standards when the standards are shown
                        qNbs.forEach(sId => {
                            const sNode = nodeById.get(sId);
                            if (!sNode || sNode.qualityType !== NODE_TYPES.STANDARD) return;
                            if (sNode._legendHidden) return; // respect legend toggle for standards
                            const hasDirect = neighbors.get(id)?.has(sId);
                            if (!hasDirect) {
                                virtualEdges.push({ source: node, target: sNode });
                            }
                        });
                    } else {
                        // Fallback to properties (original behavior)
                        qNbs.forEach(pId => {
                            const pNode = nodeById.get(pId);
                            if (!pNode || pNode.qualityType !== NODE_TYPES.PROPERTY) return;
                            const hasDirect = neighbors.get(id)?.has(pId);
                            if (!hasDirect) {
                                virtualEdges.push({ source: node, target: pNode });
                            }
                        });
                    }
                });
            }
        });

        return virtualEdges;
    }

    /**
     * Initialize the renderer
     */
    initialize() {
        // Create Canvas if it doesn't exist (below SVG)
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.container.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
        }
        // Create SVG overlay for labels and interaction if it doesn't exist
        if (!this.svg) {
            this.svg = d3.select(this.container)
                .append("svg")
                .attr("width", this.width)
                .attr("height", this.height)
                .style("position", "absolute")
                .style("top", 0)
                .style("left", 0);
        }

        // Create force simulation
        this.simulation = this.createSimulation();

        // Setup resize handler
        this._addResizeHandler();

        return this;
    }

    /**
     * Handle container resize
     */
    _handleResize(width, height) {
        this.width = width;
        this.height = height;

        if (this.canvas) {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }
        if (this.svg) {
            this.svg.attr("width", this.width).attr("height", this.height);
        }

        if (this.simulation) {
            const centerX = this.width / 2;

            this.simulation.force("center").x(centerX).y(this.height / 2);
            this.simulation.alpha(1).restart();
        }
        // Re-draw on resize
        this.drawCanvas();
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
     * @param {Function} onNodeClick - Function to call when a node is clicked
     * @returns {GraphRenderer} The current renderer instance
     */
    render(graphData, onNodeHover, onNodeDoubleClick, onNodeClick) {
        // Clear existing elements
        if (this.svg) {
            this.svg.selectAll("g").remove();
        } else {
            this.initialize();
        }

        // Create links (hidden SVG, kept for data adjacency only)
        this.links = this.svg.append("g")
            .attr("class", "links")
            .style("pointer-events", "none")
            .style("display", "none")
            .selectAll("line")
            .data(graphData.links)
            .enter()
            .append("line");

        // Prepare virtual links data container (no SVG lines rendered)
        this.virtualLinksLayer = this.svg.append("g").attr("class", "virtual-links").style("display", "none");
        this.virtualLinks = this.virtualLinksLayer.selectAll("line");
        this.virtualEdgesData = [];

        // Create invisible nodes for hit-testing (events enabled)
        this.nodes = this.svg.append("g")
            .attr("class", "nodes")
            .style("pointer-events", "all")
            .selectAll("circle")
            .data(graphData.nodes)
            .enter()
            .append("circle")
            .attr("r", d => d.size)
            .attr("fill", "transparent")
            .attr("stroke", "transparent")
            .attr("opacity", 0)
            .style("pointer-events", "all");

        // Add labels (visible, re-enable pointer-events for labels we need)
        this.labels = this.svg.append("g")
            .attr("class", "labels")
            .style("pointer-events", "none")
            .selectAll("text")
            .data(graphData.nodes)
            .enter()
            .append("text")
            .text(d => d.label)
            .attr("font-size", d => this._labelFontSize(d))
            .attr("text-anchor", d => this._labelTextAnchor(d))
            .attr("dominant-baseline", d => this._labelDominantBaseline(d))
            .attr("dx", d => this._labelDx(d))
            .attr("dy", d => this._labelDy(d))
            .style("pointer-events", (d) => (isRoot(d) || isProperty(d)) ? "all" : "none");

        // Setup zoom
        this.setupZoom();

        // Setup drag
        this.setupDrag();

        // Setup node interactions (on invisible hit circles and selected labels)
        if (onNodeHover) {
            // Bind identical hover behavior to both node hit-circles and internal labels
            this._bindHoverHandlers(this.nodes, onNodeHover);
            const internalLabels = this.labels.filter(d => isRoot(d) || isProperty(d));
            this._bindHoverHandlers(internalLabels, onNodeHover);
        }

        if (onNodeDoubleClick) {
            this.nodes.on("dblclick", onNodeDoubleClick);
        }
        if (onNodeClick) {
            this.nodes.on("click", onNodeClick);
        }

        // Update node positions based on graph layout
        graphData.nodes.forEach(node => {
            node.x = node.x === undefined ? this.width / 2 : node.x + this.width / 2;
            node.y = node.y === undefined ? this.height / 2 : node.y + this.height / 2;
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

        // Apply legend-driven type visibility (requirements initially hidden by default)
        this.applyTypeVisibility();

        // Initial draw
        this.drawCanvas();

        return this;
    }

    /**
     * Set dimming for selection: dims nodes/links that are not selected or connected
     * @param {string|null} selectedId
     * @param {Set<string>|null} connectedSet
     * @param {boolean} active
     */
    setSelectionDimming(selectedId, connectedSet, active) {
        this.selectionActive = !!active;
        if (this.nodes && this.links && this.labels) {
            if (active) {
                // Activate selection dimming
                // Detect if the selected node is a standard
                let isStandard = false;
                this.nodes.each(function (d) {
                    if (d.id === selectedId) {
                        isStandard = d.qualityType === 'standard';
                    }
                });
                this.selection = { id: selectedId, connected: new Set(connectedSet || []), isStandard };

                const renderer = this;
                const selected = this.selection;
                this.nodes.each(function (d) {
                    const isRelated = d.id === selected.id || selected.connected.has(d.id);
                    d._dimmed = !isRelated;
                });
                // Compute dimming for all links using shared predicates
                this.links.each(function (l) {
                    const endpointsRelated = renderer._edgeEndpointsRelated(l, selected);
                    const keepRootProp = renderer._edgeShouldShowDespiteRoot(l, selected);
                    l._dimmed = !(endpointsRelated || keepRootProp);
                    // canvas-specific hidden flag when std selection hides dimmed property links
                    l._canvasHidden = !!(selected.isStandard && (renderer._hideIfDimmedPropertyUnderStd(l.source) || renderer._hideIfDimmedPropertyUnderStd(l.target)));
                });
                if (Array.isArray(this.virtualEdgesData)) this.virtualEdgesData.forEach(function (l) {
                    const endpointsRelated = renderer._edgeEndpointsRelated(l, selected);
                    l._dimmed = !endpointsRelated;
                });
            } else {
                // Clear flags
                this.selection = { id: null, connected: new Set(), isStandard: false };
                this.nodes.each(function (d) {
                    d._dimmed = false;
                });
                this.links.each(function (l) {
                    l._dimmed = false;
                    l._canvasHidden = false;
                });
                if (Array.isArray(this.virtualEdgesData)) this.virtualEdgesData.forEach(l => {
                    l._dimmed = false;
                });

                // Restore base link opacity & display (canvas redraw will use defaults)
            }

            // Re-apply zoom-based updaters
            if (this.updateNodeVisibility) this.updateNodeVisibility(this.currentZoomScale);
            if (this.updateLabelVisibility) this.updateLabelVisibility(this.currentZoomScale);
            this.drawCanvas();
        }
    }

    /**
     * Handle simulation tick
     */
    handleTick() {
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
            // Only position invisible SVG for interactions and labels
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

            // Redraw canvas
            this.drawCanvas();
        });
    }

    /**
     * Setup zoom behavior
     */
    setupZoom() {
        const zoom = d3.zoom()
            .on("zoom", (event) => {
                this.currentTransform = event.transform;
                this.svg.selectAll("g").attr("transform", this.currentTransform);
                this.currentZoomScale = this.currentTransform.k;

                // Update label and node visibility
                if (this.updateLabelVisibility) {
                    this.updateLabelVisibility(this.currentZoomScale);
                }

                if (this.updateNodeVisibility) {
                    this.updateNodeVisibility(this.currentZoomScale);
                }

                // Redraw canvas with new transform
                this.drawCanvas();
            });

        this.svg.call(zoom);

        // Set initial transform to account for sidebar width
        const sidebarWidth = 200;
        const initialTransform = d3.zoomIdentity.translate(sidebarWidth / 2, 0);
        this.svg.call(zoom.transform, initialTransform);
        this.currentTransform = initialTransform;
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

        // Apply drag behavior to labels that are inside nodes (root and property types)
        this.labels.filter(d => isRoot(d) || isProperty(d))
            .call(dragBehavior);
    }

    /**
     * Draw graph on Canvas
     */
    drawCanvas() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        // Reset transform and clear
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.width, this.height);
        // Apply current zoom/pan transform
        const t = this.currentTransform || d3.zoomIdentity;
        ctx.setTransform(t.k, 0, 0, t.k, t.x, t.y);

        // Helper to iterate selection data
        const nodesData = [];
        if (this.nodes) this.nodes.each(d => nodesData.push(d));
        const linksData = [];
        if (this.links) this.links.each(d => linksData.push(d));
        const virtualData = Array.isArray(this.virtualEdgesData) ? this.virtualEdgesData : [];

        this._drawNormalLinks(ctx, linksData);
        this._drawVirtualLinks(ctx, virtualData);
        this._drawNodes(ctx, nodesData);

        // Reset alpha
        ctx.globalAlpha = 1;
    }

    /**
     * Draw straight links on canvas
     * @private
     */
    _drawNormalLinks(ctx, linksData) {
        linksData.forEach(l => {
            if (!l?.source || !l?.target) return;
            if (l.source._legendHidden || l.target._legendHidden) return;
            if (this._isStdSelectionActive() && (this._hideIfDimmedPropertyUnderStd(l.source) || this._hideIfDimmedPropertyUnderStd(l.target))) return;
            const isHover = !!l._hoverHighlight;
            const baseOpacity = l._dimmed ? 0.05 : 0.6;
            const opacity = isHover ? 0.9 : baseOpacity;
            if (opacity <= 0) return;
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = isHover ? '#cb9fff' : '#E0E0E0';
            ctx.lineWidth = isHover ? 2 : 1;
            ctx.beginPath();
            ctx.moveTo(l.source.x, l.source.y);
            ctx.lineTo(l.target.x, l.target.y);
            ctx.stroke();
        });
    }

    /**
     * Draw virtual (dashed) links on canvas
     * @private
     */
    _drawVirtualLinks(ctx, virtualData) {
        virtualData.forEach(vl => {
            const s = vl.source, tNode = vl.target;
            if (!s || !tNode) return;
            if (s._legendHidden || tNode._legendHidden) return;
            const isHover = !!vl._hoverHighlight;
            const baseOpacity = vl._dimmed ? 0.05 : 0.4;
            const opacity = isHover ? 0.85 : baseOpacity;
            if (opacity <= 0) return;
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = isHover ? '#cb9fff' : '#E0E0E0';
            ctx.setLineDash([3, 3]);
            ctx.lineWidth = isHover ? 2 : 1;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(tNode.x, tNode.y);
            ctx.stroke();
            ctx.setLineDash([]);
        });
    }

    /**
     * Draw nodes on canvas
     * @private
     */
    _drawNodes(ctx, nodesData) {
        nodesData.forEach(n => {
            if (!n) return;
            if (n._legendHidden) return;
            if (this._isStdSelectionActive() && isProperty(n) && n._dimmed) return;
            const r = n._canvasR == null ? n.size : n._canvasR;
            const opacity = n._canvasOpacity == null ? 1 : n._canvasOpacity;
            const strokeW = n._canvasStrokeWidth == null ? 1.5 : n._canvasStrokeWidth;
            if (r <= 0 || opacity <= 0) return;
            ctx.globalAlpha = opacity;
            ctx.fillStyle = n.color;
            ctx.beginPath();
            ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = strokeW;
            ctx.strokeStyle = '#2C3E50';
            ctx.stroke();
        });
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

        // Manage per-edge hover highlight flags for canvas rendering
        if (highlight) {
            // Clear previous hover highlights to avoid stale edges
            this._clearEdgeHoverFlags();
        }
        // Set or clear hover highlight on edges connected to the node
        this.links.each(function (l) {
            if (!l?.source || !l?.target) return;
            if (l.source.id === nodeId || l.target.id === nodeId) {
                l._hoverHighlight = !!highlight;
            } else if (!highlight) {
                // On unhighlight, only clear flags for edges incident to this node
                // leave other edges (possibly highlighted by another node) intact
                // but since we clear on new highlight above, this is sufficient
            }
        });
        if (Array.isArray(this.virtualEdgesData)) this.virtualEdgesData.forEach(vl => {
            if (!vl?.source || !vl?.target) return;
            if (vl.source.id === nodeId || vl.target.id === nodeId) {
                vl._hoverHighlight = !!highlight;
            }
        });

        // If selection is active (set externally), dim all unrelated nodes and links
        if (this.selectionActive) {
            this.setSelectionDimming(nodeId, connectedNodes, true);
        }

        // Trigger a canvas redraw to reflect edge hover state
        this.drawCanvas();
    }

    /**
     * Center the view on the visible nodes
     */
    centerView() {
        if (!this.svg || !this.nodes || this.nodes.size() === 0) return;

        // Calculate the bounding box of all visible nodes
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        this.nodes.each(function (d) {
            if (d3.select(this).style("display") !== "none") {
                minX = Math.min(minX, d.x);
                minY = Math.min(minY, d.y);
                maxX = Math.max(maxX, d.x);
                maxY = Math.max(maxY, d.y);
            }
        });

        // If no visible nodes, return
        if (minX === Infinity) return;

        // Calculate center and scale
        const width = this.width;
        const height = this.height;
        const graphWidth = maxX - minX;
        const graphHeight = maxY - minY;
        const centerX = minX + graphWidth / 2;
        const centerY = minY + graphHeight / 2;

        // Calculate scale to fit the graph with some padding
        const padding = 50;
        const scale = Math.min(
            0.9 * width / (graphWidth + padding),
            0.9 * height / (graphHeight + padding),
            3 // Maximum zoom level
        );

        // Apply the transform
        const transform = d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(scale)
            .translate(-centerX, -centerY);

        this.svg.transition()
            .duration(750)
            .call(d3.zoom().transform, transform);
        // Do not set currentTransform/currentZoomScale here.
        // The zoom behavior's 'zoom' event will update transforms progressively during the transition
        // keeping the Canvas and SVG labels in sync.
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
     * Get the visibility and visual state for a single node based on current zoom
     * @param {Object} d - Node data
     * @param {number} zoom - Current zoom scale
     * @returns {Object} State object {visible, size, opacity, strokeWidth}
     * @private
     */
    _getNodeVisibilityState(d, zoom) {
        if (!d || d._legendHidden) return { visible: false };

        const isProp = isProperty(d);
        const isDimmedPropUnderStd = this._isStdSelectionActive() && isProp && d._dimmed;
        if (isDimmedPropUnderStd) return { visible: false };

        if (isRoot(d) || isProp) {
            return { visible: true, size: d.size, opacity: 1, strokeWidth: 1.5 };
        }

        const visibilityThreshold = this._nodeVisibilityThreshold(d);
        const isHighlighted = this._nodeHighlighted(d);

        if (!isHighlighted && zoom < visibilityThreshold) {
            return { visible: false };
        }

        const sizeFactor = Math.min(1, Math.max(0.5, zoom / 1.5));
        const strokeWidth = Math.min(1.5, Math.max(0.5, zoom / 1.5));

        if (isHighlighted) {
            const size = this.selectionActive ? d.size * sizeFactor : d.size;
            const sw = this.selectionActive ? strokeWidth : 1.5;
            return { visible: true, size, opacity: 1, strokeWidth: sw };
        }

        const baseOpacity = Math.min(1, Math.max(0.6, zoom / 1.2));
        const finalOpacity = d._dimmed ? Math.min(baseOpacity, 0.15) : baseOpacity;

        return {
            visible: true,
            size: d.size * sizeFactor,
            opacity: finalOpacity,
            strokeWidth: strokeWidth
        };
    }

    /**
     * Apply a visibility state to a node element and its data (for canvas)
     * @param {d3.Selection} element
     * @param {Object} d
     * @param {Object} state
     * @private
     */
    _applyNodeVisibilityState(element, d, state) {
        if (state.visible) {
            element.style("display", null).attr("opacity", state.opacity).attr("r", state.size).attr("stroke-width", state.strokeWidth);
            d._canvasR = state.size;
            d._canvasOpacity = state.opacity;
            d._canvasStrokeWidth = state.strokeWidth;
        } else {
            element.style("display", "none").attr("opacity", 0);
            d._canvasR = 0;
            d._canvasOpacity = 0;
            d._canvasStrokeWidth = 1.5;
        }
    }

    /**
     * Creates a function to update node visibility and detail based on zoom level
     *
     * @param {d3.Selection} node - Node selection
     * @param {number} initialZoomScale - Initial zoom scale
     * @returns {Function} Function to update node visibility and detail
     */
    createNodeVisibilityUpdater(node, initialZoomScale) {
        let currentZoomScale = initialZoomScale;
        const renderer = this;

        return function (nodeData) {
            // If nodeData is provided as an object, we're checking visibility for a single node
            if (nodeData && typeof nodeData === 'object') {
                return renderer._getNodeVisibilityState(nodeData, currentZoomScale);
            }

            // Update all nodes
            if (typeof arguments[0] === 'number') {
                currentZoomScale = arguments[0];
            }

            node.each(function (d) {
                const state = renderer._getNodeVisibilityState(d, currentZoomScale);
                renderer._applyNodeVisibilityState(d3.select(this), d, state);
            });
        };
    }

    /**
     * Get the visibility state (opacity) for a single label based on current zoom
     * @param {Object} d - Node data
     * @param {number} zoom - Current zoom scale
     * @returns {number} 0 or 1
     * @private
     */
    _getLabelVisibilityState(d, zoom) {
        if (!d) return 0;
        // Root label must always be visible (even when dimmed/selection active)
        if (d.id === "quality-root") return 1;
        if (d._legendHidden) return 0;

        const isProp = isProperty(d);
        const isDimmedPropUnderStd = this._isStdSelectionActive() && isProp && d._dimmed;
        if (isDimmedPropUnderStd) return 0;

        if (isRoot(d) || isProp) return 1;

        const isHighlighted = this._nodeHighlighted(d);
        if (d._dimmed && !isHighlighted) return 0;

        const threshold = this._labelVisibilityThreshold(d);
        return (isHighlighted || zoom > threshold) ? 1 : 0;
    }

    /**
     * Apply a visibility state to a label element
     * @param {d3.Selection} element
     * @param {Object} d
     * @param {number} opacity
     * @private
     */
    _applyLabelVisibilityState(element, d, opacity) {
        const isHighlighted = this._nodeHighlighted(d);
        const isBold = d.id === "quality-root" || isRoot(d) || isProperty(d);

        element.attr("opacity", opacity);
        if (isBold) element.attr("font-weight", "bold");

        // Labels are only hidden if opacity is 0 and they are not highlighted
        const shouldHide = opacity === 0 && !isHighlighted;
        element.style("display", shouldHide ? "none" : null);
    }

    /**
     * Creates a function to update label visibility based on zoom level
     *
     * @param {d3.Selection} label - Label selection
     * @param {number} initialZoomScale - Initial zoom scale
     * @returns {Function} Function to update label visibility
     */
    createLabelVisibilityUpdater(label, initialZoomScale) {
        let currentZoomScale = initialZoomScale;
        const renderer = this;

        return function (nodeData) {
            // If nodeData is provided as an object, we're checking visibility for a single node
            if (nodeData && typeof nodeData === 'object') {
                return renderer._getLabelVisibilityState(nodeData, currentZoomScale);
            }

            // Update all labels
            if (typeof arguments[0] === 'number') {
                currentZoomScale = arguments[0];
            }

            label.each(function (d) {
                const opacity = renderer._getLabelVisibilityState(d, currentZoomScale);
                renderer._applyLabelVisibilityState(d3.select(this), d, opacity);
            });
        };
    }

    _addResizeHandler() {
        new ResizeObserver(entries => {
            const rect = entries[0].contentRect;
            this._handleResize(rect.width, rect.height);
        }).observe(this.container);
    }
}
