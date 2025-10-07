import * as d3 from "d3";

/**
 * GraphRenderer class
 * Responsible for rendering graph data using D3
 */
export class GraphRenderer {
    /**
     * Indicates whether a term filter is currently active (affects property visibility rules)
     * This is controlled by Graph/FullGraph when applying or resetting filters.
     */
    /**
     * @param {HTMLElement} container - The container element to render the graph in
     */
    constructor(container) {
        // Bind lightweight helpers (kept internal to avoid new files and keep behavior)
        this._isRoot = (d) => d && d.id === 'quality-root';
        this._isProperty = (d) => d && d.qualityType === 'property';
        this._isQuality = (d) => d && d.qualityType === 'quality';
        this._isRequirement = (d) => d && d.qualityType === 'requirement';
        this._isStandard = (d) => d && d.qualityType === 'standard';
        this._legendHidden = (d, typeVis) => {
            if (!d) return false;
            const t = d.qualityType;
            if (t === 'quality') return typeVis.quality === false;
            if (t === 'requirement') return typeVis.requirement === false;
            if (t === 'standard') return typeVis.standard === false;
            return false; // root & property never hidden by legend
        };
        this._isStdSelectionActive = () => !!(this.selectionActive && this.selection && this.selection.isStandard);
        this._nodeHighlighted = (d) => !!(d && (d.highlighted || d.connectedHighlighted));
        this._labelVisibilityThreshold = (d) => ((this._isQuality(d) || this._isRequirement(d) || this._isStandard(d)) ? 1.2 : 0.8) / (d.size / 10);
        this._nodeVisibilityThreshold = (d) => 0.4 / (d.size / 10);
        this._edgeEndpointsRelated = (edge, sel) => {
            const a = edge.source.id, b = edge.target.id;
            const aRel = (a === sel.id) || sel.connected.has(a);
            const bRel = (b === sel.id) || sel.connected.has(b);
            return aRel && bRel;
        };
        this._edgeShouldShowDespiteRoot = (edge, sel) => {
            if (!sel.isStandard) return false;
            const a = edge.source, b = edge.target;
            const isRootAPropB = a.id === 'quality-root' && this._isProperty(b);
            const isRootBPropA = b.id === 'quality-root' && this._isProperty(a);
            if (isRootAPropB && (sel.connected.has(b.id) || sel.id === b.id)) return true;
            if (isRootBPropA && (sel.connected.has(a.id) || sel.id === a.id)) return true;
            return false;
        };
        this._hideIfDimmedPropertyUnderStd = (d) => this._isStdSelectionActive() && this._isProperty(d) && d._dimmed;
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
     * @param {('quality'|'requirement')} type
     * @param {boolean} visible
     */
    setTypeVisibility(type, visible) {
        if (!this.isValidNodeType(type)) return;
        this.typeVisibility[type] = !!visible;
        this.applyTypeVisibility();
    }

    /**
     * Apply current type visibility to nodes, labels, and links
     */
    applyTypeVisibility() {
        if (!this.nodes || !this.labels || !this.links) return;
        const typeVis = this.typeVisibility;

        // Mark nodes with legendHidden flag used by updaters
        this.nodes.each(function (d) {
            const t = d.qualityType;
            d._legendHidden = (t === 'quality' && !typeVis.quality) || (t === 'requirement' && !typeVis.requirement) || (t === 'standard' && !typeVis.standard);
        });

        // Update node display immediately in case simulation/zoom updaters haven't run yet
        this.nodes.style("display", d => d._legendHidden ? "none" : null);
        this.labels.style("display", d => d._legendHidden ? "none" : null);

        // Hide links connected to hidden nodes
        this.links.style("display", d => {
            const sh = d.source._legendHidden === true;
            const th = d.target._legendHidden === true;
            return (sh || th) ? "none" : null;
        });

        // When qualities are hidden but requirements are visible, add virtual links between
        // visible requirements and their connected properties (via hidden quality nodes)
        const showVirtual = !typeVis.quality && typeVis.requirement;
        if (showVirtual) {
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

            // Collect virtual edges req -> property if there exists a path req->quality->property
            const virtualEdges = [];
            nodeById.forEach((node, id) => {
                if (node.qualityType === 'requirement' && !node._legendHidden) {
                    const nbs = neighbors.get(id) || new Set();
                    nbs.forEach(qId => {
                        const qNode = nodeById.get(qId);
                        if (!qNode || qNode.qualityType !== 'quality') return;
                        const qNbs = neighbors.get(qId) || new Set();
                        qNbs.forEach(pId => {
                            const pNode = nodeById.get(pId);
                            if (!pNode || pNode.qualityType !== 'property') return;
                            // Only create if property is visible (never hidden by legend)
                            // and we don't already have a direct req<->property edge
                            const hasDirect = neighbors.get(id)?.has(pId);
                            if (!hasDirect) {
                                virtualEdges.push({ source: node, target: pNode });
                            }
                        });
                    });
                }
            });

            // Bind virtual edges
            this.virtualLinks = this.virtualLinksLayer
                .selectAll('line')
                .data(virtualEdges, d => d.source.id + '->' + d.target.id);

            // Exit old
            this.virtualLinks.exit().remove();

            // Enter new
            const enter = this.virtualLinks.enter().append('line')
                .attr('stroke', '#E0E0E0')
                .attr('stroke-width', 1)
                .attr('opacity', 0.4)
                .attr('stroke-dasharray', '3,3');

            this.virtualLinks = enter.merge(this.virtualLinks);

            // Immediately position virtual links so they are visible without requiring a tick/drag
            if (this.virtualLinks) {
                this.virtualLinks
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);
            }

            // Lightly kick the simulation to ensure at least one tick runs
            if (this.simulation) {
                const prevAlphaTarget = this.simulation.alphaTarget();
                this.simulation.alpha(0.3).alphaTarget(Math.max(prevAlphaTarget, 0.01)).restart();
                // Cool down shortly after to avoid unintended motion
                setTimeout(() => {
                    if (this.simulation) this.simulation.alphaTarget(prevAlphaTarget || 0);
                }, 100);
            }
        } else if (this.virtualLinksLayer) {
            // Remove any virtual links when not in this mode
            this.virtualLinksLayer.selectAll('line').remove();
        }

        // Re-run the zoom-based visibility updaters with current scale so they respect legendHidden
        if (this.updateNodeVisibility) this.updateNodeVisibility(this.currentZoomScale);
        if (this.updateLabelVisibility) this.updateLabelVisibility(this.currentZoomScale);

        // After legend/type visibility, if a term filter is active, hide property nodes that have no visible neighbor (excluding root).
        if (this.isFiltering) {
            const nodeById = new Map();
            this.nodes.each(function (d) {
                nodeById.set(d.id, d);
            });
            const neighbors = new Map();

            function addNb(a, b) {
                if (!neighbors.has(a)) neighbors.set(a, new Set());
                neighbors.get(a).add(b);
            }

            this.links.each(function (d) {
                addNb(d.source.id, d.target.id);
                addNb(d.target.id, d.source.id);
            });

            const considerVirtual = !typeVis.quality && typeVis.requirement;
            const renderer = this;
            this.nodes.each(function (d) {
                if (d.qualityType !== 'property') return;
                let hasVisibleNeighbor = false;
                const nbs = neighbors.get(d.id) || new Set();
                nbs.forEach(nbId => {
                    if (hasVisibleNeighbor) return;
                    const nb = nodeById.get(nbId);
                    if (!nb) return;
                    if ((nb.qualityType === 'quality' || nb.qualityType === 'requirement') && !nb._legendHidden) {
                        hasVisibleNeighbor = true;
                    }
                });
                if (!hasVisibleNeighbor && considerVirtual) {
                    // Check via hidden quality for any visible requirement reaching this property
                    nbs.forEach(qId => {
                        if (hasVisibleNeighbor) return;
                        const qNode = nodeById.get(qId);
                        if (!qNode || qNode.qualityType !== 'quality') return;
                        const qNbs = neighbors.get(qId) || new Set();
                        qNbs.forEach(rId => {
                            if (hasVisibleNeighbor) return;
                            const rNode = nodeById.get(rId);
                            if (rNode && rNode.qualityType === 'requirement' && !rNode._legendHidden) {
                                hasVisibleNeighbor = true;
                            }
                        });
                    });
                }
                const displayVal = hasVisibleNeighbor ? null : 'none';
                d3.select(this).style('display', displayVal);
                renderer.labels.filter(ld => ld.id === d.id).style('display', displayVal);
            });
            // Hide virtual links attached to hidden properties
            if (this.virtualLinks) {
                this.virtualLinks.style('display', vl => {
                    const sHidden = d3.select(renderer.nodes.filter(nd => nd.id === vl.source.id).node()).style('display') === 'none';
                    const tHidden = d3.select(renderer.nodes.filter(nd => nd.id === vl.target.id).node()).style('display') === 'none';
                    return (sHidden || tHidden) ? 'none' : null;
                });
            }
        }

        // Re-run the zoom-based visibility updaters with current scale so they respect legendHidden
        if (this.updateNodeVisibility) this.updateNodeVisibility(this.currentZoomScale);
        if (this.updateLabelVisibility) this.updateLabelVisibility(this.currentZoomScale);
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
        this._addResizeHandler();

        return this;
    }

    /**
     * Handle container resize
     */
    _handleResize(width, height) {
        this.width = width;
        this.height = height;

        if (this.svg) {
            this.svg.attr("width", this.width).attr("height", this.height);
        }

        if (this.simulation) {
            const centerX = this.width / 2;

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

        // Create links
        this.links = this.svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graphData.links)
            .enter()
            .append("line")
            .attr("stroke", "#E0E0E0")
            .attr("stroke-width", 1)
            .attr("opacity", 0.6);

        // Layer for virtual links (requirement <-> property) shown when qualities are hidden
        this.virtualLinksLayer = this.svg.append("g").attr("class", "virtual-links");
        this.virtualLinks = this.virtualLinksLayer.selectAll("line");

        // Create nodes
        this.nodes = this.svg.append("g")
            .selectAll("circle")
            .data(graphData.nodes)
            .enter()
            .append("circle")
            .attr("r", d => d.size)
            .attr("fill", d => d.color)
            .attr("stroke", '#2C3E50')
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

            // Add mouseleave event to reset highlighting (only if no active selection)
            this.nodes.on("mouseleave", (event, d) => {
                if (this.selectionActive) return;
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
                if (this.selectionActive) return;
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
        if (onNodeClick) {
            this.nodes.on("click", onNodeClick);
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

        // Apply legend-driven type visibility (requirements initially hidden by default)
        this.applyTypeVisibility();

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
        if (!this.nodes || !this.links || !this.labels) return;

        if (!active) {
            // Clear flags
            this.selection = { id: null, connected: new Set(), isStandard: false };
            this.nodes.each(function (d) {
                d._dimmed = false;
            });
            this.links.each(function (l) {
                l._dimmed = false;
            });
            if (this.virtualLinks) this.virtualLinks.each(function (l) {
                l._dimmed = false;
            });

            // Restore base link opacity & display
            this.links.attr("opacity", 0.6).style("display", null);
            if (this.virtualLinks) this.virtualLinks.attr("opacity", 0.4).style("display", null);

            // Re-apply zoom-based updaters
            if (this.updateNodeVisibility) this.updateNodeVisibility(this.currentZoomScale);
            if (this.updateLabelVisibility) this.updateLabelVisibility(this.currentZoomScale);
            return;
        }

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
        });
        if (this.virtualLinks) this.virtualLinks.each(function (l) {
            const endpointsRelated = renderer._edgeEndpointsRelated(l, selected);
            l._dimmed = !endpointsRelated;
        });

        // Apply visual dimming to links immediately
        // Make unrelated edges significantly more dimmed for better focus
        this.links
            .attr("opacity", d => d._dimmed ? 0.05 : 0.6)
            .style("display", function (d) {
                if (!selected.isStandard) return null;
                // Hide links connected to dimmed property nodes when a standard is selected
                if (renderer._hideIfDimmedPropertyUnderStd(d.source) || renderer._hideIfDimmedPropertyUnderStd(d.target)) return 'none';
                return null;
            });
        if (this.virtualLinks) this.virtualLinks
            .attr("opacity", d => d._dimmed ? 0.05 : 0.4)
            .style("display", function (d) {
                if (!selected.isStandard) return null;
                if (renderer._hideIfDimmedPropertyUnderStd(d.source) || renderer._hideIfDimmedPropertyUnderStd(d.target)) return 'none';
                return null;
            });

        // Re-apply zoom-based updaters for nodes/labels to respect _dimmed and hiding rules
        if (this.updateNodeVisibility) this.updateNodeVisibility(this.currentZoomScale);
        if (this.updateLabelVisibility) this.updateLabelVisibility(this.currentZoomScale);
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

            if (this.virtualLinks) {
                this.virtualLinks
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

        // Highlight normal edges connected to the node
        this.links.filter(d => d.source.id === nodeId || d.target.id === nodeId)
            .classed("highlighted", highlight)
            .attr("stroke", highlight ? "#cb9fff" : "#e6daf2")
            .attr("stroke-width", highlight ? 2 : 1);

        // Apply same hover behavior to virtual edges (if present)
        if (this.virtualLinks) {
            this.virtualLinks.filter(d => d.source.id === nodeId || d.target.id === nodeId)
                .classed("highlighted", highlight)
                .attr("stroke", highlight ? "#cb9fff" : "#E0E0E0")
                .attr("stroke-width", highlight ? 2 : 1)
                .attr("opacity", highlight ? 0.8 : 0.4)
                .attr("stroke-dasharray", "3,3");
        }

        // If selection is active (set externally), dim all unrelated nodes and links
        if (this.selectionActive) {
            this.setSelectionDimming(nodeId, connectedNodes, true);
        }
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

        // Update current zoom scale
        this.currentZoomScale = scale;

        // Update label and node visibility with the new zoom scale
        if (this.updateLabelVisibility) {
            this.updateLabelVisibility(this.currentZoomScale);
        }

        if (this.updateNodeVisibility) {
            this.updateNodeVisibility(this.currentZoomScale);
        }
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
        const renderer = this;

        // Return a function that can either update all nodes or check a single node
        return (nodeData) => {
            // If nodeData is provided as an object, we're checking visibility for a single node
            if (nodeData && typeof nodeData === 'object') {
                // If hidden by legend, hide regardless of zoom/highlight
                if (nodeData._legendHidden) {
                    return { visible: false };
                }

                // When a standard is selected, hide dimmed property nodes entirely
                if (renderer.selectionActive && renderer.selection && renderer.selection.isStandard && nodeData.qualityType === 'property' && nodeData._dimmed) {
                    return { visible: false };
                }

                // Always show root and property nodes at full detail
                if (nodeData.id === "quality-root" || nodeData.qualityType === "property") {
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

                // For highlighted nodes, handle size depending on persistent selection state
                if (isHighlighted) {
                    // When a standard is selected (persistent selection), keep size consistent with zoom
                    // i.e., do not grow nodes to full size, only raise opacity
                    if (renderer.selectionActive) {
                        const baseOpacity = 1; // highlighted should be fully opaque
                        return {
                            visible: true,
                            size: nodeData.size * sizeFactor,
                            opacity: baseOpacity,
                            strokeWidth: strokeWidth
                        };
                    }
                    // Hover highlight (no persistent selection): keep previous behavior (full size)
                    return {
                        visible: true,
                        size: nodeData.size,
                        opacity: 1,
                        strokeWidth: 1.5
                    };
                }

                // For normal nodes, adjust detail based on zoom
                const baseOpacity = Math.min(1, Math.max(0.6, currentZoomScale / 1.2));
                const finalOpacity = nodeData._dimmed ? Math.min(baseOpacity, 0.15) : baseOpacity;
                return {
                    visible: true,
                    size: nodeData.size * sizeFactor,
                    opacity: finalOpacity,
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

                    // If hidden by legend, hide regardless
                    if (d._legendHidden) {
                        nodeElement.style("display", "none");
                        nodeElement.attr("opacity", 0);
                        return;
                    }

                    // When a standard is selected, hide dimmed property nodes entirely
                    if (renderer.selectionActive && renderer.selection && renderer.selection.isStandard && d.qualityType === 'property' && d._dimmed) {
                        nodeElement.style("display", "none");
                        nodeElement.attr("opacity", 0);
                        return;
                    }

                    // Always show root and property nodes at full detail
                    if (d.id === "quality-root" || d.qualityType === "property") {
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

                    // For highlighted nodes, handle size depending on persistent selection state
                    if (isHighlighted) {
                        nodeElement.style("display", null);
                        nodeElement.attr("opacity", 1);
                        if (renderer.selectionActive) {
                            // Keep size consistent with zoom during selection
                            nodeElement.attr("r", d.size * sizeFactor);
                            nodeElement.attr("stroke-width", strokeWidth);
                        } else {
                            // Hover highlight: show full size as before
                            nodeElement.attr("r", d.size);
                            nodeElement.attr("stroke-width", 1.5);
                        }
                        return;
                    }

                    // For normal nodes, adjust detail based on zoom
                    nodeElement.style("display", null);
                    const baseOpacity = Math.min(1, Math.max(0.6, currentZoomScale / 1.2));
                    const finalOpacity = d._dimmed ? Math.min(baseOpacity, 0.15) : baseOpacity;
                    nodeElement.attr("opacity", finalOpacity);
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
            // If nodeData is provided as an object, we're checking visibility for a single node
            if (nodeData && typeof nodeData === 'object') {
                // If hidden by legend, hide label
                if (nodeData._legendHidden) {
                    return 0;
                }

                // If a standard is selected and a property node is dimmed, that property node is hidden -> keep label hidden
                if (this.selectionActive && this.selection && this.selection.isStandard && nodeData.qualityType === 'property' && nodeData._dimmed) {
                    return 0;
                }

                // Always show labels for root and property nodes when the node is displayed
                if (nodeData.id === "quality-root" || nodeData.qualityType === "property") {
                    return 1;
                }

                // Check if this node or a connected node is highlighted
                const isHighlighted = nodeData.highlighted || nodeData.connectedHighlighted;

                // Hide labels for dimmed nodes (unless highlighted)
                if (nodeData._dimmed && !isHighlighted) {
                    return 0;
                }

                // For quality, requirement, and standard nodes, hide labels when zoom level is too low
                const visibilityThreshold = (nodeData.qualityType === "quality" || nodeData.qualityType === "requirement" || nodeData.qualityType === "standard")
                                            ? 1.2 / (nodeData.size / 10)
                                            : 0.8 / (nodeData.size / 10);

                // Show label if node is highlighted or zoom is sufficient
                return (isHighlighted || currentZoomScale > visibilityThreshold) ? 1 : 0;
            }
            // Otherwise, update all labels with the current zoom scale
            else {
                // If a zoom scale is provided as the first argument, update the stored value
                if (typeof arguments[0] === 'number') {
                    currentZoomScale = arguments[0];
                }

                // Capture renderer via closure (do not bind and override d3's element context)
                const renderer = this;

                // Update all labels based on their type and zoom level
                label.each(function (d) {
                    const labelElement = d3.select(this);

                    // If hidden by legend, hide label
                    if (d._legendHidden) {
                        labelElement.attr("opacity", 0);
                        labelElement.style("display", "none");
                        return;
                    }

                    // If a standard is selected and a property node is dimmed, that property node is hidden -> keep label hidden
                    if (renderer.selectionActive && renderer.selection && renderer.selection.isStandard && d.qualityType === 'property' && d._dimmed) {
                        labelElement.attr("opacity", 0);
                        labelElement.style("display", "none");
                        return;
                    }

                    // Always show labels for root and property nodes when the node is displayed
                    if (d.id === "quality-root" || d.qualityType === "property") {
                        labelElement.attr("opacity", 1);
                        labelElement.attr("font-weight", "bold");
                        labelElement.style("display", null);
                        return;
                    }

                    // Check if this node or a connected node is highlighted
                    const isHighlighted = d.highlighted || d.connectedHighlighted;

                    // Hide labels for dimmed nodes (unless highlighted)
                    if (d._dimmed && !isHighlighted) {
                        labelElement.attr("opacity", 0);
                        labelElement.style("display", "none");
                        return;
                    }

                    // For quality, requirement, and standard nodes, hide labels when zoom level is too low
                    const visibilityThreshold = (d.qualityType === "quality" || d.qualityType === "requirement" || d.qualityType === "standard")
                                                ? 1.2 / (d.size / 10)
                                                : 0.8 / (d.size / 10);

                    // Show label if node is highlighted or zoom is sufficient
                    const opacity = (isHighlighted || currentZoomScale > visibilityThreshold) ? 1 : 0;
                    labelElement.attr("opacity", opacity);

                    if (opacity === 0 && !isHighlighted) {
                        labelElement.style("display", "none");
                    } else {
                        labelElement.style("display", null);
                    }
                });
            }
        };
    }

    _addResizeHandler() {
        new ResizeObserver(entries => {
            const rect = entries[0].contentRect;
            this._handleResize(rect.width, rect.height);
        }).observe(this.container);
    }
}
