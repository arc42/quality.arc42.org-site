export class GraphDataProvider {
    /**
     * @param {Array} propertyNodes - Property nodes data
     * @param {Array} nodes - Quality and requirement nodes data
     * @param {Array} edges - Edge data
     */
    constructor(propertyNodes, nodes, edges) {
        this.propertyNodes = propertyNodes;
        this.nodes = nodes;
        this.edges = edges;
        this.filteredPropertyNodes = propertyNodes;
        this.filteredNodes = nodes;
        this.filteredEdges = edges;
    }

    /**
     * Get the current data
     * @returns {Object} Object with propertyNodes, nodes, and edges
     */
    getData() {
        return {
            propertyNodes: this.filteredPropertyNodes,
            nodes: this.filteredNodes,
            edges: this.filteredEdges
        };
    }

    /**
     * Reset the filter to show all data
     */
    resetFilter() {
        this.filteredPropertyNodes = this.propertyNodes;
        this.filteredNodes = this.nodes;
        this.filteredEdges = this.edges;
    }

    /**
     * Filter the data based on a search term
     * @param {string} filterTerm - The search term to filter by
     * @returns {Object} Object with filtered propertyNodes, nodes, and edges
     */
    filterByTerm(filterTerm, options = {}) {
        // If filter term is empty, reset filter
        if (!filterTerm || filterTerm.trim() === "") {
            this.resetFilter();
            return this.getData();
        }

        const lowerFilterTerm = filterTerm.toLowerCase();

        const qualitiesHidden = options.qualitiesHidden === true;
        const requirementsVisible = options.requirementsVisible !== false;

        // Filter nodes that match the search term
        const filteredNodes = this.nodes.filter(node =>
            node.label.toLowerCase().includes(lowerFilterTerm)
        );

        // Get IDs of filtered nodes
        const filteredNodeIds = new Set(filteredNodes.map(node => node.id));

        // Find connected nodes
        const connectedNodeIds = new Set();

        // Find all nodes connected to filtered nodes
        this.edges.forEach(edge => {
            if (filteredNodeIds.has(edge.source)) {
                connectedNodeIds.add(edge.target);
            }
            if (filteredNodeIds.has(edge.target)) {
                connectedNodeIds.add(edge.source);
            }
        });

        // Determine requirement nodes to include
        const requirementNodeIds = new Set();
        const allRequirementNodes = this.nodes.filter(node => node.qualityType === "requirement");

        if (qualitiesHidden && requirementsVisible) {
            // Only include requirement nodes that match the term themselves
            allRequirementNodes.forEach(reqNode => {
                if (filteredNodeIds.has(reqNode.id)) {
                    requirementNodeIds.add(reqNode.id);
                }
            });
        } else {
            // Original behavior: include requirements connected to matches (direct or via hop)
            allRequirementNodes.forEach(reqNode => {
                // Check direct connections
                let isConnected = filteredNodeIds.has(reqNode.id) || connectedNodeIds.has(reqNode.id);

                // If not directly connected, check connections via a hop
                if (!isConnected) {
                    const connectedToReq = new Set();
                    this.edges.forEach(edge => {
                        if (edge.source === reqNode.id) {
                            connectedToReq.add(edge.target);
                        }
                        if (edge.target === reqNode.id) {
                            connectedToReq.add(edge.source);
                        }
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

        // When qualities are hidden and requirements visible, do not include non-matching requirements via generic connectedNodeIds
        let effectiveConnected = connectedNodeIds;
        if (qualitiesHidden && requirementsVisible) {
            effectiveConnected = new Set();
            connectedNodeIds.forEach(id => {
                const node = this.nodes.find(n => n.id === id);
                if (!node) return;
                if (node.qualityType === "requirement") {
                    // include only if requirement itself matched
                    if (filteredNodeIds.has(id)) effectiveConnected.add(id);
                } else {
                    // keep properties and root and qualities (qualities will be hidden by renderer anyway)
                    effectiveConnected.add(id);
                }
            });
        }

        // Combine filtered, connected, and requirement node IDs
        const allVisibleNodeIds = new Set([
            ...filteredNodeIds,
            ...effectiveConnected,
            ...requirementNodeIds
        ]);

        // Always include the root node
        allVisibleNodeIds.add("quality-root");

        // Find property nodes that have visible neighbors other than the root node
        const visiblePropertyNodeIds = new Set();

        // For each property node, check if it has visible neighbors other than the root node
        this.propertyNodes.forEach(propNode => {
            let hasVisibleNeighbor = false;

            // Check if this property node is connected to any visible node other than the root
            this.edges.forEach(edge => {
                if (edge.source === propNode.id && edge.target !== "quality-root" && allVisibleNodeIds.has(edge.target)) {
                    hasVisibleNeighbor = true;
                }
                if (edge.target === propNode.id && edge.source !== "quality-root" && allVisibleNodeIds.has(edge.source)) {
                    hasVisibleNeighbor = true;
                }
            });

            // If it has visible neighbors, add it to the visible property nodes
            if (hasVisibleNeighbor) {
                visiblePropertyNodeIds.add(propNode.id);
                allVisibleNodeIds.add(propNode.id);
            }
        });

        // Filter nodes to include only visible ones
        this.filteredNodes = this.nodes.filter(node =>
            allVisibleNodeIds.has(node.id)
        );

        // Filter edges to include only those between visible nodes
        this.filteredEdges = this.edges.filter(edge => {
            // Include edges between visible nodes
            return allVisibleNodeIds.has(edge.source) && allVisibleNodeIds.has(edge.target);
        });

        // Only include property nodes that have visible neighbors
        this.filteredPropertyNodes = this.propertyNodes.filter(node =>
            visiblePropertyNodeIds.has(node.id)
        );

        return this.getData();
    }

    /**
     * Prepare data for the home graph (only include root and property nodes)
     * @returns {Object} Object with prepared propertyNodes, nodes, and edges
     */
    prepareHomeGraphData() {
        const rootNode = this.nodes.find(node => node.id === "quality-root");
        const homeNodes = rootNode ? [rootNode] : [];

        // Filter edges to only include those connecting property nodes to the root node
        const homeEdges = this.edges.filter(edge => {
            // Only keep edges between property nodes and the root node
            return (edge.source === "quality-root" && this.propertyNodes.some(node => node.id === edge.target)) ||
                (edge.target === "quality-root" && this.propertyNodes.some(node => node.id === edge.source));
        });

        return {
            propertyNodes: this.propertyNodes,
            nodes: homeNodes,
            edges: homeEdges
        };
    }
}
