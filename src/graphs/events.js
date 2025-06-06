import { MultiGraph } from "graphology";
import { Sigma } from "sigma";
import { DEFAULT_SETTINGS } from "sigma/settings";
import { getDefaultNodeColor } from "./utils";

/**
 * Adds a pointer cursor for non-quality root nodes
 * @param {String} hoveredNode
 * @param {Sigma} renderer
 */
const addPointerOnForNonQualityRootNode = (hoveredNode , renderer) => {
    if (hoveredNode !== "quality-root") renderer.getContainer().style.cursor = "pointer";
}

/**
 * Resets the cursor to default
 * @param {Sigma} renderer
 * @returns {string}
 */
const resetCursorToDefault = (renderer) => renderer.getContainer().style.cursor = "default";

/**
 * Registers event handlers for the home graph view
 * @param {MultiGraph} graph
 * @param {Sigma} renderer
 */
const registerHomeGraphEvents = (renderer , graph) => {
    renderer.on("enterNode" , (event) => {
        const hoveredNode = event.node;
        addPointerOnForNonQualityRootNode(hoveredNode , renderer);

        if (graph.getNodeAttribute(hoveredNode , "qualityType") === "property") {
            graph.forEachEdge((edge , _ , sourceNode , targetNode) => {
                const isSourceProperty = graph.getNodeAttribute(sourceNode , "qualityType") === "property";
                if (targetNode === hoveredNode) {
                    graph.updateNodeAttribute(sourceNode , "hidden" , () => false);
                    graph.updateEdgeAttribute(edge , "hidden" , () => false);
                } else if (!isSourceProperty) {
                    graph.updateEdgeAttribute(edge , "hidden" , () => true);
                }
            });
        }
        renderer.refresh();
    });

    renderer.on("leaveNode" , () => {
        resetCursorToDefault(renderer);
        graph.forEachNode((node) => {
            const { qualityType , hidden } = graph.getNodeAttributes(node);
            if (qualityType === "quality" && !hidden) {
                graph.updateNodeAttribute(node , "hidden" , () => true);
            }
        });
        renderer.refresh();
    });
};

/**
 * Registers event handlers for the full graph view
 * @param {MultiGraph} graph
 * @param {Sigma} renderer
 */
const registerFullGraphEvents = (renderer , graph) => {

    renderer.on("enterNode" , (event) => {
        const hoveredNode = event.node;
        addPointerOnForNonQualityRootNode(hoveredNode , renderer);

        graph.forEachEdge((edgeId , _ , sourceNode , targetNode) => {
            const isRelated = sourceNode === hoveredNode || targetNode === hoveredNode;
            graph.updateEdgeAttribute(edgeId , "color" , () => (isRelated ? "red" : "#E0E0E0"));
        });
        graph.forEachNode((node) => {
            const isConnected = graph.hasEdge(hoveredNode , node) || graph.hasEdge(node , hoveredNode);
            graph.updateNodeAttribute(node , "color" , () =>
                isConnected ? graph.getNodeAttribute(node , "color") : "#CCCCCC"
            );
        });
    });

    renderer.on("leaveNode" , () => {
        resetCursorToDefault(renderer);

        graph.forEachEdge((edgeId) => {
            graph.updateEdgeAttribute(edgeId , "color" , () => DEFAULT_SETTINGS.defaultEdgeColor);
        });
        graph.forEachNode((node) => {
            graph.updateNodeAttribute(node , "color" , () => getDefaultNodeColor(graph , node));
        });
    });
};

/**
 * Registers all event handlers for a given graph
 * @param {MultiGraph} graph
 * @param {Sigma} renderer
 */
export const registerGraphEvents = (graph , renderer) => {
    const graphName = graph.getAttribute("name");

    renderer.on("doubleClickNode" , (event) => {
        if (event.node !== "quality-root") {
            window.location.href = graph.getNodeAttribute(event.node , "page");
        }
    });

    if (graphName === "home") {
        registerHomeGraphEvents(renderer , graph);
    } else {
        registerFullGraphEvents(renderer , graph);
    }
};
