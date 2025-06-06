import { MultiGraph } from "graphology";
import * as d3 from "d3";
import { calculateNodeSize, createLabelVisibilityUpdater, createNodeVisibilityUpdater } from "./common";
import { registerFullGraphEvents, registerHomeGraphEvents } from "./events";

/**
 * Filters the nodes in a graph based on a search term.
 * Nodes are shown if their labels match the term or if they are connected to nodes that match the term.
 * This ensures that blue (quality) and yellow/orange (requirement) nodes are visible when they are in the filter range.
 * The root node is always kept visible.
 * Empty filter term resets the filter and shows all nodes (respecting the graph type).
 * This implementation completely rebuilds the visualization to remove filtered nodes from the DOM.
 *
 * @param {string | null | undefined} filterTerm
 * @param {MultiGraph} graph
 * @param {Object} renderer - D3 renderer object
 */
const filterGraph = (filterTerm, graph, renderer) => {
    // First, update the graph's hidden attributes
    if (filterTerm?.trim() === "") {
        // Reset filter but respect the graph type
        const graphName = graph.getAttribute("name");

        graph.forEachNode((node) => {
            // For homepage, quality nodes should remain hidden
            if (graphName === "home" && graph.getNodeAttribute(node, "qualityType") === "quality") {
                graph.setNodeAttribute(node, "hidden", true);
            } else {
                graph.setNodeAttribute(node, "hidden", false);
            }
        });

        graph.forEachEdge((edge) => {
            const source = graph.source(edge);
            const target = graph.target(edge);

            // Only show edges where both nodes are visible
            const isHidden = graph.getNodeAttribute(source, "hidden") || graph.getNodeAttribute(target, "hidden");
            graph.setEdgeAttribute(edge, "hidden", isHidden);
        });
    } else {
        const lowerFilterTerm = filterTerm.toLowerCase();
        const visibleNodes = new Set();
        const connectedNodes = new Set();

        // Filter nodes and collect visible nodes
        graph.forEachNode((node) => {
            const nodeLabel = graph.getNodeAttribute(node, "label").toLowerCase();
            const isMatch = nodeLabel.includes(lowerFilterTerm);

            // Don't hide nodes yet, we'll determine visibility after checking connections
            if (isMatch) {
                visibleNodes.add(node);
            }
        });

        // Find all nodes connected to visible nodes
        graph.forEachEdge((edge, attrs, source, target) => {
            if (visibleNodes.has(source)) {
                connectedNodes.add(target);
            }
            if (visibleNodes.has(target)) {
                connectedNodes.add(source);
            }
        });

        // Set node visibility
        graph.forEachNode((node) => {
            const isVisible = visibleNodes.has(node) || connectedNodes.has(node);
            graph.setNodeAttribute(node, "hidden", !isVisible);
        });

        // Set edge visibility
        graph.forEachEdge((edge, attrs, source, target) => {
            const isVisible = !graph.getNodeAttribute(source, "hidden") && !graph.getNodeAttribute(target, "hidden");
            graph.setEdgeAttribute(edge, "hidden", !isVisible);
        });

        // Keep the root node always visible
        graph.updateNodeAttribute("quality-root", "hidden", () => false);
    }

    // Now rebuild the visualization with only visible nodes
    rebuildVisualization(graph, renderer);
}

/**
 * Rebuilds the D3 visualization with only visible nodes
 * This completely removes filtered nodes from the DOM for better performance
 *
 * @param {MultiGraph} graph - The graph
 * @param {Object} renderer - D3 renderer object
 */
const rebuildVisualization = (graph, renderer) => {
    // Get the container and dimensions
    const container = renderer.nodes.node().parentNode.parentNode.parentNode;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Get the current zoom transform
    const currentTransform = d3.zoomTransform(renderer.nodes.node().parentNode.parentNode);

    // Prepare new data with only visible nodes
    const graphData = {
        nodes: [],
        links: []
    };

    // Add only visible nodes to the new data
    graph.forEachNode((nodeId, attrs) => {
        if (!attrs.hidden) {
            // Calculate size based on connections
            const size = calculateNodeSize(graph, nodeId, attrs.qualityType);

            graphData.nodes.push({
                id: nodeId,
                ...attrs,
                size: size,
                // Preserve highlighted state if it exists
                highlighted: renderer.nodes.filter(d => d.id === nodeId).datum()?.highlighted || false,
                connectedHighlighted: renderer.nodes.filter(d => d.id === nodeId).datum()?.connectedHighlighted || false
            });
        }
    });

    // Add only edges between visible nodes
    graph.forEachEdge((edgeId, attrs, source, target) => {
        if (!graph.getNodeAttribute(source, "hidden") && !graph.getNodeAttribute(target, "hidden")) {
            graphData.links.push({
                id: edgeId,
                source,
                target,
                ...attrs
            });
        }
    });

    // Remove existing SVG elements
    const svg = d3.select(container).select("svg");
    svg.selectAll("g").remove();

    // Create new elements
    const link = svg.append("g")
        .selectAll("line")
        .data(graphData.links)
        .enter()
        .append("line")
        .attr("stroke", d => graph.getEdgeAttribute(d.id, "color") || "#E0E0E0")
        .attr("stroke-width", 1)
        .attr("opacity", 0.6);

    const node = svg.append("g")
        .selectAll("circle")
        .data(graphData.nodes)
        .enter()
        .append("circle")
        .attr("r", d => d.size)
        .attr("fill", d => d.color)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .classed("highlighted", d => d.highlighted)
        .classed("connected-highlighted", d => d.connectedHighlighted);

    const label = svg.append("g")
        .selectAll("text")
        .data(graphData.nodes)
        .enter()
        .append("text")
        .text(d => d.label)
        .attr("font-size", d => (d.qualityType === "property" || d.id === "quality-root") ? Math.max(10, d.size * 0.45) : 10)
        .attr("text-anchor", d => (d.id === "quality-root" || d.qualityType === "property") ? "middle" : "start")
        .attr("dominant-baseline", d => (d.id === "quality-root" || d.qualityType === "property") ? "middle" : "auto")
        .attr("dx", d => (d.id === "quality-root" || d.qualityType === "property") ? 0 : 12)
        .attr("dy", d => (d.id === "quality-root" || d.qualityType === "property") ? 0 : 4)
        .classed("highlighted", d => d.highlighted)
        .classed("connected-highlighted", d => d.connectedHighlighted);

    // Apply the current zoom transform
    svg.selectAll("g").attr("transform", currentTransform);

    // Update node positions
    graphData.nodes.forEach(node => {
        node.x = graph.getNodeAttribute(node.id, "x") + width / 2;
        node.y = graph.getNodeAttribute(node.id, "y") + height / 2;
    });

    // Update the simulation with new nodes and links
    renderer.simulation.nodes(graphData.nodes);
    renderer.simulation.force("link").links(graphData.links);

    // Optimize force simulation tick updates with requestAnimationFrame
    renderer.simulation.on("tick", () => {
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
            // Batch DOM updates for better performance
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            label
                .attr("x", d => d.x)
                .attr("y", d => d.y);
        });
    });

    // Update the renderer with new selections
    renderer.nodes = node;
    renderer.links = link;
    renderer.labels = label;

    // Setup drag behavior
    node.call(d3.drag()
        .on("start", (event, d) => {
            if (!event.active) renderer.simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        })
        .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
        })
        .on("end", (event, _) => {
            if (!event.active) renderer.simulation.alphaTarget(0);
        }));

    // Re-register event handlers
    const graphName = graph.getAttribute("name");

    // Double-click handler for navigation
    node.on("dblclick", (event, d) => {
        if (d.id !== "quality-root") {
            window.location.href = graph.getNodeAttribute(d.id, "page");
        }
    });

    // Create label and node visibility updaters
    const updateLabelVisibility = createLabelVisibilityUpdater(label, currentTransform.k);
    const updateNodeVisibility = createNodeVisibilityUpdater(node, currentTransform.k);

    // Re-register hover events based on graph type
    if (graphName === "home") {
        registerHomeGraphEvents(renderer, graph, container, updateNodeVisibility);
    } else {
        registerFullGraphEvents(renderer, graph, container, updateNodeVisibility);
    }

    // Set up zoom behavior again
    const zoom = d3.zoom()
        .on("zoom", (event) => {
            svg.selectAll("g").attr("transform", event.transform);
            // Update label and node visibility with the new zoom scale
            updateLabelVisibility(event.transform.k);
            updateNodeVisibility(event.transform.k);
        });

    // Apply the zoom behavior to the SVG
    svg.call(zoom);

    // Set the initial transform to match the previous state
    svg.call(zoom.transform, currentTransform);

    // Update label visibility with the current zoom scale
    updateLabelVisibility(currentTransform.k);

    // Restart the simulation
    renderer.simulation.alpha(0.3).restart();
};

export const registerFilterEvents = (graph, renderer) => {
    const filterInput = document.getElementById("full-q-graph-filter__input");
    const filterButton = document.getElementById("full-q-graph-filter__btn");

    if (!filterInput) {
        console.error("Filter input element not found");
        return;
    }

    if (!filterButton) {
        console.error("Filter button element not found");
        return;
    }

    const applyFilter = () => filterGraph(filterInput.value, graph, renderer);

    filterButton.addEventListener("click", () => applyFilter());
    filterInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
            applyFilter()
        }
    });
}
