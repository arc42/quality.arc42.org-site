import { MAX_FILTER_TERMS, NODE_TYPES, QUALITY_ROOT_ID } from './constants';

export class GraphDataProvider {
    #propertyNodes;
    #nodes;
    #edges;
    #filteredPropertyNodes;
    #filteredNodes;
    #filteredEdges;
    #filterMatchedNodeIds;
    #filterRelatedNodeIds;

    /**
     * @param {Array} propertyNodes - Property nodes data
     * @param {Array} nodes - Quality and requirement nodes data
     * @param {Array} edges - Edge data
     */
    constructor(propertyNodes, nodes, edges) {
        this.#propertyNodes = propertyNodes;
        this.#nodes = nodes;
        this.#edges = edges;
        this.resetFilter();
    }

    /**
     * Get the current data
     * @returns {Object} Object with propertyNodes, nodes, and edges
     */
    getData() {
        return {
            propertyNodes: this.#filteredPropertyNodes,
            nodes: this.#filteredNodes,
            edges: this.#filteredEdges
        };
    }

    /**
     * Returns the currently filtered snapshot (alias of getData for clarity)
     * @returns {{propertyNodes:Array,nodes:Array,edges:Array}}
     */
    getFilteredData() {
        return this.getData();
    }

    /**
     * Reset the filter to show all data
     */
    resetFilter() {
        this.#filteredPropertyNodes = this.#propertyNodes;
        this.#filteredNodes = this.#nodes;
        this.#filteredEdges = this.#edges;
        this.#filterMatchedNodeIds = new Set();
        this.#filterRelatedNodeIds = new Set();
    }

    /**
     * Get node id sets used for filter-match highlighting in the renderer.
     * - matchedNodeIds: nodes whose labels directly matched active filter terms
     * - relatedNodeIds: visible context nodes brought in by graph connectivity
     * @returns {{matchedNodeIds: Set<string>, relatedNodeIds: Set<string>}}
     */
    getFilterHighlightSets() {
        return {
            matchedNodeIds: new Set(this.#filterMatchedNodeIds || []),
            relatedNodeIds: new Set(this.#filterRelatedNodeIds || [])
        };
    }

    /**
     * Filter the data based on one or more search terms
     * @param {string|string[]} filterTerm - The search term or list of terms to filter by
     * @param {Object} options - Additional options
     * @param {boolean} [options.qualitiesHidden] - Whether qualities are hidden via legend
     * @param {boolean} [options.requirementsVisible] - Whether requirements are visible via legend
     * @param {Set<string>|string[]|null} [options.baseNodeIdSet] - Optional base restriction set for nodes
     * @param {Set<string>|string[]|null} [options.forceInclude] - Node ids to force-include in the filtered output regardless of text matches
     * @returns {Object} Object with filtered propertyNodes, nodes, and edges
     */
    filterByTerm(filterTerm, options = {}) {
        const terms = this._normalizeFilterTerms(filterTerm);
        if (terms.length === 0) {
            this.resetFilter();
            return this.getData();
        }

        const baseSet = options.baseNodeIdSet instanceof Set ? options.baseNodeIdSet : null;
        const nodesPool = baseSet ? this.#nodes.filter(n => baseSet.has(n.id)) : this.#nodes;
        const propertyIds = new Set(this.#propertyNodes.map(p => p.id));
        const edgesPool = this._getEdgesPool(baseSet, propertyIds);

        const filteredNodeIds = this._getFilteredNodeIds(nodesPool, terms);
        const connectedNodeIds = this._getConnectedNodeIds(edgesPool, filteredNodeIds, baseSet);

        const qualitiesHidden = options.qualitiesHidden === true;
        const requirementsVisible = options.requirementsVisible !== false;
        const requirementNodeIds = this._getRequirementNodeIds(nodesPool, edgesPool, filteredNodeIds, connectedNodeIds, qualitiesHidden, requirementsVisible);

        const effectiveConnected = this._getEffectiveConnected(nodesPool, connectedNodeIds, filteredNodeIds, qualitiesHidden, requirementsVisible);

        const forceInclude = options.forceInclude instanceof Set
                             ? options.forceInclude
                             : new Set(options.forceInclude || []);

        const allVisibleNodeIds = new Set([...filteredNodeIds, ...effectiveConnected, ...requirementNodeIds, QUALITY_ROOT_ID, ...forceInclude]);

        const restrictedVisible = baseSet
                                  ? new Set(Array.from(allVisibleNodeIds).filter(id => baseSet.has(id) || id === QUALITY_ROOT_ID))
                                  : allVisibleNodeIds;

        const visiblePropertyNodeIds = this._getVisiblePropertyNodeIds(edgesPool, restrictedVisible);
        visiblePropertyNodeIds.forEach(id => restrictedVisible.add(id));

        this.#filteredNodes = nodesPool.filter(node => restrictedVisible.has(node.id));
        this.#filteredEdges = edgesPool.filter(edge => restrictedVisible.has(edge.source) && restrictedVisible.has(edge.target));
        this.#filteredPropertyNodes = this.#propertyNodes.filter(node => visiblePropertyNodeIds.has(node.id));

        // Keep explicit sets for visual distinction:
        // 1) direct term matches vs 2) related context nodes.
        this.#filterMatchedNodeIds = new Set(Array.from(filteredNodeIds).filter(id => restrictedVisible.has(id)));
        this.#filterRelatedNodeIds = new Set(
            Array.from(restrictedVisible).filter(id => !this.#filterMatchedNodeIds.has(id))
        );

        return this.getData();
    }

    _normalizeFilterTerms(filterTerm) {
        if (Array.isArray(filterTerm)) {
            return filterTerm
                .map(t => String(t || "").trim().replace(/^#/, ""))
                .filter(t => t.length > 0)
                .slice(0, MAX_FILTER_TERMS);
        }

        const v = String(filterTerm || "").trim().replace(/^#/, "");
        return v === '' ? [] : [v];
    }

    _getEdgesPool(baseSet, propertyIds) {
        if (!baseSet) return this.#edges;
        return this.#edges.filter(e =>
            (baseSet.has(e.source) && baseSet.has(e.target)) ||
            ((propertyIds.has(e.source) && baseSet.has(e.target)) || (propertyIds.has(e.target) && baseSet.has(e.source)))
        );
    }

    _getFilteredNodeIds(nodesPool, terms) {
        const lowerTerms = terms.map(t => t.toLowerCase());
        const filteredNodeIds = new Set();

        // Match regular nodes (qualities, requirements, standards)
        nodesPool.forEach(node => {
            const label = String(node.label || "").toLowerCase();
            const id = String(node.id || "").toLowerCase();
            if (lowerTerms.some(t => label.includes(t) || id.includes(t))) {
                filteredNodeIds.add(node.id);
            }
        });

        // Match dimension/property nodes as first-class filter targets
        this.#propertyNodes.forEach(node => {
            const label = String(node.label || "").toLowerCase();
            const id = String(node.id || "").toLowerCase();
            if (lowerTerms.some(t => label.includes(t) || id.includes(t))) {
                filteredNodeIds.add(node.id);
            }
        });

        return filteredNodeIds;
    }

    _getConnectedNodeIds(edgesPool, filteredNodeIds, baseSet) {
        const connectedNodeIds = new Set();
        edgesPool.forEach(edge => {
            if (filteredNodeIds.has(edge.source)) {
                if (!baseSet || baseSet.has(edge.target)) connectedNodeIds.add(edge.target);
            }
            if (filteredNodeIds.has(edge.target)) {
                if (!baseSet || baseSet.has(edge.source)) connectedNodeIds.add(edge.source);
            }
        });
        return connectedNodeIds;
    }

    _getRequirementNodeIds(nodesPool, edgesPool, filteredNodeIds, connectedNodeIds, qualitiesHidden, requirementsVisible) {
        const requirementNodeIds = new Set();
        const allRequirementNodes = nodesPool.filter(node => node.qualityType === NODE_TYPES.REQUIREMENT);

        if (qualitiesHidden && requirementsVisible) {
            allRequirementNodes.forEach(reqNode => {
                if (filteredNodeIds.has(reqNode.id)) {
                    requirementNodeIds.add(reqNode.id);
                }
            });
        } else {
            allRequirementNodes.forEach(reqNode => {
                let isConnected = filteredNodeIds.has(reqNode.id) || connectedNodeIds.has(reqNode.id);
                if (!isConnected) {
                    const connectedToReq = new Set();
                    edgesPool.forEach(edge => {
                        if (edge.source === reqNode.id) connectedToReq.add(edge.target);
                        if (edge.target === reqNode.id) connectedToReq.add(edge.source);
                    });
                    connectedToReq.forEach(nodeId => {
                        if (filteredNodeIds.has(nodeId) || connectedNodeIds.has(nodeId)) {
                            isConnected = true;
                        }
                    });
                }
                if (isConnected) {
                    requirementNodeIds.add(reqNode.id);
                }
            });
        }
        return requirementNodeIds;
    }

    _getEffectiveConnected(nodesPool, connectedNodeIds, filteredNodeIds, qualitiesHidden, requirementsVisible) {
        if (!(qualitiesHidden && requirementsVisible)) return connectedNodeIds;

        const effectiveConnected = new Set();
        connectedNodeIds.forEach(id => {
            const node = nodesPool.find(n => n.id === id);
            if (!node) return;
            if (node.qualityType === NODE_TYPES.REQUIREMENT) {
                if (filteredNodeIds.has(id)) effectiveConnected.add(id);
            } else {
                effectiveConnected.add(id);
            }
        });
        return effectiveConnected;
    }

    _getVisiblePropertyNodeIds(edgesPool, restrictedVisible) {
        const visiblePropertyNodeIds = new Set();
        this.#propertyNodes.forEach(propNode => {
            let hasVisibleNeighbor = false;
            edgesPool.forEach(edge => {
                if (edge.source === propNode.id && edge.target !== QUALITY_ROOT_ID && restrictedVisible.has(edge.target)) {
                    hasVisibleNeighbor = true;
                }
                if (edge.target === propNode.id && edge.source !== QUALITY_ROOT_ID && restrictedVisible.has(edge.source)) {
                    hasVisibleNeighbor = true;
                }
            });
            if (hasVisibleNeighbor) {
                visiblePropertyNodeIds.add(propNode.id);
            }
        });
        return visiblePropertyNodeIds;
    }

    /**
     * Prepare data for the home graph (only include root and property nodes)
     * @returns {Object} Object with prepared propertyNodes, nodes, and edges
     */
    prepareHomeGraphData() {
        const rootNode = this.#nodes.find(node => node.id === QUALITY_ROOT_ID);
        const homeNodes = rootNode ? [rootNode] : [];
        const homeEdges = this.#edges.filter(edge => {
            return (edge.source === QUALITY_ROOT_ID && this.#propertyNodes.some(node => node.id === edge.target)) ||
                (edge.target === QUALITY_ROOT_ID && this.#propertyNodes.some(node => node.id === edge.source));
        });
        return {
            propertyNodes: this.#propertyNodes,
            nodes: homeNodes,
            edges: homeEdges
        };
    }

    /**
     * Filter the data based on a selected standard
     * @param {string} standard - Standard key to filter by (e.g., "iso25010"). If falsy or "all", resets filter.
     * @returns {Object} Object with filtered propertyNodes, nodes, and edges
     */
    filterByStandard(standard) {
        if (!standard || standard.toLowerCase() === "all") {
            this.resetFilter();
            return this.getData();
        }

        const std = standard.toLowerCase();
        const matchedQualityNodes = this.#nodes.filter(node =>
            node.qualityType === NODE_TYPES.QUALITY && Array.isArray(node.standards) && node.standards.map(s => String(s).toLowerCase()).includes(std)
        );
        const matchedQualityIds = new Set(matchedQualityNodes.map(n => n.id));

        const visibleNodeIds = new Set(matchedQualityIds);
        this.#edges.forEach(edge => {
            if (matchedQualityIds.has(edge.source)) visibleNodeIds.add(edge.target);
            if (matchedQualityIds.has(edge.target)) visibleNodeIds.add(edge.source);
        });

        visibleNodeIds.add(QUALITY_ROOT_ID);

        const visiblePropertyNodeIds = this._getVisiblePropertyNodeIds(this.#edges, visibleNodeIds);
        visiblePropertyNodeIds.forEach(id => visibleNodeIds.add(id));

        this.#filteredNodes = this.#nodes.filter(node => visibleNodeIds.has(node.id));
        this.#filteredEdges = this.#edges.filter(edge => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target));
        this.#filteredPropertyNodes = this.#propertyNodes.filter(node => visiblePropertyNodeIds.has(node.id));
        this.#filterMatchedNodeIds = new Set();
        this.#filterRelatedNodeIds = new Set();

        return this.getData();
    }
}
