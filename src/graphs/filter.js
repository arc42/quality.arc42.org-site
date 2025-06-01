import { MultiGraph } from "graphology";
import { Sigma } from "sigma";

/**
 * Filters the nodes in a graph based on a search term.
 * Nodes are hidden if their labels do not match the term and edges are hidden if both of their connected nodes are hidden.
 * The root node is always kept visible.
 *
 * @param {string | null | undefined} filterTerm
 * @param {MultiGraph} graph
 * @param {Sigma} renderer
 */
const filterGraph = (filterTerm , graph , renderer) => {
    if (!filterTerm || filterTerm.trim() === "") {
        graph.forEachNode((node) => {
            graph.setNodeAttribute(node , "hidden" , false);
        });
        graph.forEachEdge((edge) => {
            graph.setEdgeAttribute(edge , "hidden" , false);
        });
        renderer.refresh();
        return;
    }

    const lowerFilterTerm = filterTerm.toLowerCase();
    const visibleNodes = new Set();

    // Filter nodes and collect visible nodes
    graph.forEachNode((node) => {
        const nodeLabel = graph.getNodeAttribute(node , "label").toLowerCase();
        const isMatch = nodeLabel.includes(lowerFilterTerm);
        graph.setNodeAttribute(node , "hidden" , !isMatch);
        if (isMatch) visibleNodes.add(node);
    });

    // Filter edges: visible if at least one end is visible
    graph.forEachEdge((edge , attrs , source , target) => {
        const isVisible = visibleNodes.has(source) || visibleNodes.has(target);
        graph.setEdgeAttribute(edge , "hidden" , !isVisible);

        // Make connected nodes visible
        if (isVisible) {
            graph.setNodeAttribute(source , "hidden" , false);
            graph.setNodeAttribute(target , "hidden" , false);
        }
    });

    // Keep the root node always visible
    graph.updateNodeAttribute("quality-root" , "hidden" , () => false);

    renderer.refresh();
}


export const registerFilterEvents = (graph , renderer) => {
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

    const applyFilter = () => filterGraph(filterInput.value , graph , renderer);

    filterButton.addEventListener("click" , () => applyFilter());
    filterInput.addEventListener("keyup" , (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
            applyFilter()
        }
    });
}
