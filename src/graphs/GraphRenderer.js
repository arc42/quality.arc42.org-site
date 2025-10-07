import * as d3 from "d3";

/**
 * GraphRenderer class
 * Responsible for rendering graph data using D3 (Canvas for nodes/links + SVG for labels/interactions)
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
        this._isStdSelectionActive = () => !!(this.selectionActive && this.selection?.isStandard);
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
            return !!(isRootBPropA && (sel.connected.has(a.id) || sel.id === a.id));
        };
        this._hideIfDimmedPropertyUnderStd = (d) => this._isStdSelectionActive() && this._isProperty(d) && d._dimmed;
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

        // Hide links connected to hidden nodes (store flag for canvas)
        this.links.style("display", d => {
            const sh = d.source._legendHidden === true;
            const th = d.target._legendHidden === true;
            d._hiddenByLegendEdge = (sh || th);
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

            // Collect virtual edges depending on standards visibility:
            // - If standards are visible: req -> standard via path req->quality->standard
            // - Otherwise: req -> property via path req->quality->property (existing behavior)
            const virtualEdges = [];
            const standardsVisible = !!typeVis.standard;
            nodeById.forEach((node, id) => {
                if (node.qualityType === 'requirement' && !node._legendHidden) {
                    const nbs = neighbors.get(id) || new Set();
                    nbs.forEach(qId => {
                        const qNode = nodeById.get(qId);
                        if (!qNode || qNode.qualityType !== 'quality') return;
                        const qNbs = neighbors.get(qId) || new Set();

                        if (standardsVisible) {
                            // Prefer virtual links to standards when the standards are shown
                            qNbs.forEach(sId => {
                                const sNode = nodeById.get(sId);
                                if (!sNode || sNode.qualityType !== 'standard') return;
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
                                if (!pNode || pNode.qualityType !== 'property') return;
                                const hasDirect = neighbors.get(id)?.has(pId);
                                if (!hasDirect) {
                                    virtualEdges.push({ source: node, target: pNode });
                                }
                            });
                        }
                    });
                }
            });

            // Store virtual edges for canvas rendering
            this.virtualEdgesData = virtualEdges;

            // Lightly kick the simulation to ensure at least one tick runs
            if (this.simulation) {
                const prevAlphaTarget = this.simulation.alphaTarget();
                this.simulation.alpha(0.3).alphaTarget(Math.max(prevAlphaTarget, 0.01)).restart();
                // Cool down shortly after to avoid unintended motion
                setTimeout(() => {
                    if (this.simulation) this.simulation.alphaTarget(prevAlphaTarget || 0);
                }, 100);
            }
        } else {
            // Remove any virtual links when not in this mode
            this.virtualEdgesData = [];
            if (this.virtualLinksLayer) this.virtualLinksLayer.selectAll('line').remove();
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
        }

        // Re-run the zoom-based visibility updaters with current scale so they respect legendHidden
        if (this.updateNodeVisibility) this.updateNodeVisibility(this.currentZoomScale);
        if (this.updateLabelVisibility) this.updateLabelVisibility(this.currentZoomScale);

        // Redraw canvas to reflect visibility changes
        this.drawCanvas();
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
            .attr("dy", d => (d.id === "quality-root" || d.qualityType === "property") ? 0 : 4)
            .style("pointer-events", (d) => (d.id === "quality-root" || d.qualityType === "property") ? "all" : "none");

        // Setup zoom
        this.setupZoom();

        // Setup drag
        this.setupDrag();

        // Setup node interactions (on invisible hit circles and selected labels)
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
        if (!this.nodes || !this.links || !this.labels) return;

        if (!active) {
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

            // Re-apply zoom-based updaters
            if (this.updateNodeVisibility) this.updateNodeVisibility(this.currentZoomScale);
            if (this.updateLabelVisibility) this.updateLabelVisibility(this.currentZoomScale);
            this.drawCanvas();
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
            // canvas-specific hidden flag when std selection hides dimmed property links
            if (selected.isStandard && (renderer._hideIfDimmedPropertyUnderStd(l.source) || renderer._hideIfDimmedPropertyUnderStd(l.target))) {
                l._canvasHidden = true;
            } else {
                l._canvasHidden = false;
            }
        });
        if (Array.isArray(this.virtualEdgesData)) this.virtualEdgesData.forEach(function (l) {
            const endpointsRelated = renderer._edgeEndpointsRelated(l, selected);
            l._dimmed = !endpointsRelated;
        });

        // Re-apply zoom-based updaters for nodes/labels to respect _dimmed and hiding rules
        if (this.updateNodeVisibility) this.updateNodeVisibility(this.currentZoomScale);
        if (this.updateLabelVisibility) this.updateLabelVisibility(this.currentZoomScale);
        this.drawCanvas();
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

        // Apply drag behavior to labels that are inside nodes (quality-root and property types)
        this.labels.filter(d => d.id === "quality-root" || d.qualityType === "property")
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

        // Draw normal links
        linksData.forEach(l => {
            if (!l?.source || !l?.target) return;
            // Respect legend hidden
            if (l.source._legendHidden || l.target._legendHidden) return;
            // Hide links connected to dimmed property nodes when a standard is selected
            if (this._isStdSelectionActive() && (this._hideIfDimmedPropertyUnderStd(l.source) || this._hideIfDimmedPropertyUnderStd(l.target))) return;
            // Determine style
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

        // Draw virtual links (dashed)
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

        // Draw nodes
        nodesData.forEach(n => {
            if (!n) return;
            // Hidden by legend
            if (n._legendHidden) return;
            // When a standard is selected, hide dimmed property nodes entirely
            if (this._isStdSelectionActive() && this._isProperty(n) && n._dimmed) return;
            const r = n._canvasR == null ? n.size : n._canvasR;
            const opacity = n._canvasOpacity == null ? 1 : n._canvasOpacity;
            const strokeW = n._canvasStrokeWidth == null ? 1.5 : n._canvasStrokeWidth;
            if (r <= 0 || opacity <= 0) return;
            ctx.globalAlpha = opacity;
            ctx.fillStyle = n.color;
            ctx.beginPath();
            ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
            ctx.fill();
            // Border
            ctx.lineWidth = strokeW;
            ctx.strokeStyle = '#2C3E50';
            ctx.stroke();
        });

        // Reset alpha
        ctx.globalAlpha = 1;
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
            this.links.each(function (l) {
                l._hoverHighlight = false;
            });
            if (Array.isArray(this.virtualEdgesData)) this.virtualEdgesData.forEach(vl => {
                vl._hoverHighlight = false;
            });
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
                if (renderer.selectionActive && renderer.selection?.isStandard && nodeData.qualityType === 'property' && nodeData._dimmed) {
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
                        // canvas props
                        d._canvasR = 0;
                        d._canvasOpacity = 0;
                        d._canvasStrokeWidth = 1.5;
                        return;
                    }

                    // When a standard is selected, hide dimmed property nodes entirely
                    if (renderer.selectionActive && renderer.selection?.isStandard && d.qualityType === 'property' && d._dimmed) {
                        nodeElement.style("display", "none");
                        nodeElement.attr("opacity", 0);
                        d._canvasR = 0;
                        d._canvasOpacity = 0;
                        d._canvasStrokeWidth = 1.5;
                        return;
                    }

                    // Always show root and property nodes at full detail
                    if (d.id === "quality-root" || d.qualityType === "property") {
                        nodeElement.style("display", null);
                        nodeElement.attr("opacity", 1);
                        nodeElement.attr("r", d.size);
                        nodeElement.attr("stroke-width", 1.5);
                        d._canvasR = d.size;
                        d._canvasOpacity = 1;
                        d._canvasStrokeWidth = 1.5;
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
                        d._canvasR = 0;
                        d._canvasOpacity = 0;
                        d._canvasStrokeWidth = 1.5;
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
                            d._canvasR = d.size * sizeFactor;
                            d._canvasOpacity = 1;
                            d._canvasStrokeWidth = strokeWidth;
                        } else {
                            // Hover highlight: show full size as before
                            nodeElement.attr("r", d.size);
                            nodeElement.attr("stroke-width", 1.5);
                            d._canvasR = d.size;
                            d._canvasOpacity = 1;
                            d._canvasStrokeWidth = 1.5;
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
                    d._canvasR = d.size * sizeFactor;
                    d._canvasOpacity = finalOpacity;
                    d._canvasStrokeWidth = strokeWidth;
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
        let currentZoomScale = initialZoomScale;
        const renderer = this;

        return (nodeData) => {
            // Einzelne Node-Überprüfung
            if (nodeData && typeof nodeData === 'object') {
                if (nodeData._legendHidden) return 0;
                if (renderer.selectionActive && renderer.selection?.isStandard && nodeData.qualityType === 'property' && nodeData._dimmed) return 0;
                if (nodeData.id === "quality-root" || nodeData.qualityType === "property") return 1;

                const isHighlighted = nodeData.highlighted || nodeData.connectedHighlighted;
                if (nodeData._dimmed && !isHighlighted) return 0;

                const threshold = (["quality", "requirement", "standard"].includes(nodeData.qualityType))
                                  ? 1.2 / (nodeData.size / 10)
                                  : 0.8 / (nodeData.size / 10);

                return (isHighlighted || currentZoomScale > threshold) ? 1 : 0;
            }
            // Alle Labels aktualisieren
            if (typeof arguments[0] === 'number') currentZoomScale = arguments[0];

            label.each(function (d) {
                const labelElement = d3.select(this);

                if (d._legendHidden ||
                    (renderer.selectionActive && renderer.selection?.isStandard && d.qualityType === 'property' && d._dimmed) ||
                    (d._dimmed && !(d.highlighted || d.connectedHighlighted))) {
                    labelElement.attr("opacity", 0).style("display", "none");
                    return;
                }

                if (d.id === "quality-root" || d.qualityType === "property") {
                    labelElement.attr("opacity", 1).attr("font-weight", "bold").style("display", null);
                    return;
                }

                const isHighlighted = d.highlighted || d.connectedHighlighted;
                const threshold = (["quality", "requirement", "standard"].includes(d.qualityType))
                                  ? 1.2 / (d.size / 10)
                                  : 0.8 / (d.size / 10);

                const opacity = (isHighlighted || currentZoomScale > threshold) ? 1 : 0;
                labelElement.attr("opacity", opacity);
                labelElement.style("display", (opacity === 0 && !isHighlighted) ? "none" : null);
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
