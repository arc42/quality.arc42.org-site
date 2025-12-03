import { MAX_FILTER_TERMS } from './constants';

export class GraphDataProvider {
    #propertyNodes;
    #nodes;
    #edges;
    #filteredPropertyNodes;
    #filteredNodes;
    #filteredEdges;

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
    }

    /**
     * Filter the data based on one or more search terms
     * @param {string|string[]} filterTerm - The search term or list of terms to filter by
     * @param {Object} options - Additional options
     * @returns {Object} Object with filtered propertyNodes, nodes, and edges
     */
    filterByTerm(filterTerm, options = {}) {
        // Normalize terms → array of up to MAX_FILTER_TERMS non-empty strings
        let terms = [];
        if (Array.isArray(filterTerm)) {
            terms = filterTerm
                .map(t => String(t).trim())
                .filter(t => t.length > 0)
                .slice(0, MAX_FILTER_TERMS);
        } else if (typeof filterTerm === 'string') {
            const v = filterTerm.trim();
            if (v !== '') terms = [v];
        }

        if (terms.length === 0) {
            this.resetFilter();
            return this.getData();
        }

        const lowerTerms = terms.map(t => t.toLowerCase());
        const matches = (label) => {
            const l = label.toLowerCase();
            // OR semantics: match if any term is included
            return lowerTerms.some(t => l.includes(t));
        };
        const qualitiesHidden = options.qualitiesHidden === true;
        const requirementsVisible = options.requirementsVisible !== false;
        const baseSet = options.baseNodeIdSet instanceof Set ? options.baseNodeIdSet : null;

        const propertyIds = new Set(this.#propertyNodes.map(p => p.id));
        const nodesPool = baseSet ? this.#nodes.filter(n => baseSet.has(n.id)) : this.#nodes;
        const edgesPool = baseSet ? this.#edges.filter(e =>
            (baseSet.has(e.source) && baseSet.has(e.target)) ||
            ((propertyIds.has(e.source) && baseSet.has(e.target)) || (propertyIds.has(e.target) && baseSet.has(e.source)))
        ) : this.#edges;

        const filteredNodes = nodesPool.filter(node => matches(node.label));
        const filteredNodeIds = new Set(filteredNodes.map(node => node.id));

        const connectedNodeIds = new Set();
        edgesPool.forEach(edge => {
            if (filteredNodeIds.has(edge.source)) {
                if (!baseSet || baseSet.has(edge.target)) connectedNodeIds.add(edge.target);
            }
            if (filteredNodeIds.has(edge.target)) {
                if (!baseSet || baseSet.has(edge.source)) connectedNodeIds.add(edge.source);
            }
        });

        const requirementNodeIds = new Set();
        const allRequirementNodes = nodesPool.filter(node => node.qualityType === "requirement");

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

        let effectiveConnected = connectedNodeIds;
        if (qualitiesHidden && requirementsVisible) {
            effectiveConnected = new Set();
            connectedNodeIds.forEach(id => {
                const node = nodesPool.find(n => n.id === id);
                if (!node) return;
                if (node.qualityType === "requirement") {
                    if (filteredNodeIds.has(id)) effectiveConnected.add(id);
                } else {
                    effectiveConnected.add(id);
                }
            });
        }

        const allVisibleNodeIds = new Set([
            ...filteredNodeIds,
            ...effectiveConnected,
            ...requirementNodeIds
        ]);
        allVisibleNodeIds.add("quality-root");

        const restrictedVisible = baseSet
                                  ? new Set(Array.from(allVisibleNodeIds).filter(id => baseSet.has(id) || id === "quality-root"))
                                  : allVisibleNodeIds;

        const visiblePropertyNodeIds = new Set();
        this.#propertyNodes.forEach(propNode => {
            let hasVisibleNeighbor = false;
            edgesPool.forEach(edge => {
                if (edge.source === propNode.id && edge.target !== "quality-root" && restrictedVisible.has(edge.target)) {
                    hasVisibleNeighbor = true;
                }
                if (edge.target === propNode.id && edge.source !== "quality-root" && restrictedVisible.has(edge.source)) {
                    hasVisibleNeighbor = true;
                }
            });
            if (hasVisibleNeighbor) {
                visiblePropertyNodeIds.add(propNode.id);
                restrictedVisible.add(propNode.id);
            }
        });

        this.#filteredNodes = nodesPool.filter(node =>
            restrictedVisible.has(node.id)
        );
        this.#filteredEdges = edgesPool.filter(edge =>
            restrictedVisible.has(edge.source) && restrictedVisible.has(edge.target)
        );
        this.#filteredPropertyNodes = this.#propertyNodes.filter(node =>
            visiblePropertyNodeIds.has(node.id)
        );

        return this.getData();
    }

    /**
     * Prepare data for the home graph (only include root and property nodes)
     * @returns {Object} Object with prepared propertyNodes, nodes, and edges
     */
    prepareHomeGraphData() {
        const rootNode = this.#nodes.find(node => node.id === "quality-root");
        const homeNodes = rootNode ? [rootNode] : [];
        const homeEdges = this.#edges.filter(edge => {
            return (edge.source === "quality-root" && this.#propertyNodes.some(node => node.id === edge.target)) ||
                (edge.target === "quality-root" && this.#propertyNodes.some(node => node.id === edge.source));
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
            node.qualityType === "quality" && Array.isArray(node.standards) && node.standards.map(s => String(s).toLowerCase()).includes(std)
        );
        const matchedQualityIds = new Set(matchedQualityNodes.map(n => n.id));

        const visibleNodeIds = new Set(matchedQualityIds);
        this.#edges.forEach(edge => {
            if (matchedQualityIds.has(edge.source)) visibleNodeIds.add(edge.target);
            if (matchedQualityIds.has(edge.target)) visibleNodeIds.add(edge.source);
        });

        visibleNodeIds.add("quality-root");

        const visiblePropertyNodeIds = new Set();
        this.#propertyNodes.forEach(propNode => {
            let hasVisibleNeighbor = false;
            this.#edges.forEach(edge => {
                if (edge.source === propNode.id && edge.target !== "quality-root" && visibleNodeIds.has(edge.target)) {
                    hasVisibleNeighbor = true;
                }
                if (edge.target === propNode.id && edge.source !== "quality-root" && visibleNodeIds.has(edge.source)) {
                    hasVisibleNeighbor = true;
                }
            });
            if (hasVisibleNeighbor) {
                visiblePropertyNodeIds.add(propNode.id);
                visibleNodeIds.add(propNode.id);
            }
        });

        this.#filteredNodes = this.#nodes.filter(node => visibleNodeIds.has(node.id));
        this.#filteredEdges = this.#edges.filter(edge => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target));
        this.#filteredPropertyNodes = this.#propertyNodes.filter(node => visiblePropertyNodeIds.has(node.id));

        return this.getData();
    }
}
