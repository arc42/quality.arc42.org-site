/**
 * GraphDataProvider class
 * Responsible for providing and filtering graph data
 */
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
    filterByTerm(filterTerm) {
        // If filter term is empty, reset filter
        if (!filterTerm || filterTerm.trim() === "") {
            this.resetFilter();
            return this.getData();
        }

        const lowerFilterTerm = filterTerm.toLowerCase();

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

        // Find requirement nodes that are connected to matching nodes (directly or via a hop)
        const requirementNodeIds = new Set();

        // First, identify all requirement nodes
        const allRequirementNodes = this.nodes.filter(node =>
            node.qualityType === "requirement"
        );

        // For each requirement node, check if it's connected to a matching node
        allRequirementNodes.forEach(reqNode => {
            // Check direct connections
            let isConnected = filteredNodeIds.has(reqNode.id) || connectedNodeIds.has(reqNode.id);

            // If not directly connected, check connections via a hop
            if (!isConnected) {
                // Find all nodes connected to this requirement node
                const connectedToReq = new Set();
                this.edges.forEach(edge => {
                    if (edge.source === reqNode.id) {
                        connectedToReq.add(edge.target);
                    }
                    if (edge.target === reqNode.id) {
                        connectedToReq.add(edge.source);
                    }
                });

                // Check if any of these nodes are connected to a matching node
                connectedToReq.forEach(nodeId => {
                    if (filteredNodeIds.has(nodeId) || connectedNodeIds.has(nodeId)) {
                        isConnected = true;
                    }
                });
            }

            // If connected, add to visible requirement nodes
            if (isConnected) {
                requirementNodeIds.add(reqNode.id);
            }
        });

        // Combine filtered, connected, and requirement node IDs
        const allVisibleNodeIds = new Set([
            ...filteredNodeIds,
            ...connectedNodeIds,
            ...requirementNodeIds
        ]);

        // Always include the root node
        allVisibleNodeIds.add("quality-root");

        // Filter nodes to include only visible ones
        this.filteredNodes = this.nodes.filter(node =>
            allVisibleNodeIds.has(node.id)
        );

        // Filter edges to include only those between visible nodes
        this.filteredEdges = this.edges.filter(edge =>
            allVisibleNodeIds.has(edge.source) && allVisibleNodeIds.has(edge.target)
        );

        // Always include all property nodes
        this.filteredPropertyNodes = this.propertyNodes;

        return this.getData();
    }

    /**
     * Prepare data for the home graph (hide quality nodes, remove requirement nodes)
     * @returns {Object} Object with prepared propertyNodes, nodes, and edges
     */
    prepareHomeGraphData() {
        // For homepage, hide quality nodes and remove requirement nodes
        const homeNodes = this.nodes.filter(node =>
            node.qualityType !== "requirement"
        ).map(node => ({
            ...node,
            hidden: node.qualityType === "quality"
        }));


        // Filter edges to include only those between visible nodes
        const homeEdges = this.edges.filter(edge => {
            const sourceNode = this.nodes.find(node => node.id === edge.source);
            const targetNode = this.nodes.find(node => node.id === edge.target);

            return sourceNode && targetNode &&
                sourceNode.qualityType !== "requirement" &&
                targetNode.qualityType !== "requirement";
        });

        return {
            propertyNodes: this.propertyNodes,
            nodes: homeNodes,
            edges: homeEdges
        };
    }
}
