import { MultiGraph } from "graphology";
import { Sigma } from "sigma";
import { DEFAULT_SETTINGS } from "sigma/settings";
import { getDefaultNodeColor } from "./utils";

/**
 * Registers all event handlers for a given graph
 * @param {MultiGraph} graph
 * @param {Sigma} renderer
 */
export function registerGraphEvents(graph, renderer) {
  const graphName = graph.getAttribute("name");

  // Visit a nodes documentation on double clicking it
  renderer.on("doubleClickNode", (event) => {
    if (event.node !== "quality-root") {
      window.location.href = `${graph.getNodeAttribute(event.node, "page")}`;
    }
  });

  // All events for the homepage graph
  if (graphName === "home") {
    // Visit the fullscreen graph, when clicking somewhere on the homepage graph
    renderer.on("clickStage", () => {
      window.location.href = "/full-quality-graph";
    });

    // Hover effect to display quality nodes when hovering over property node
    renderer.on("enterNode", (event) => {
      const hoveredNode = event.node;
      const isPropertyNode = graph.getNodeAttribute(hoveredNode, "qualityType") === "property";

      if (isPropertyNode) {
        graph.forEachEdge((edge, _, sourceNode, targetNode) => {
          const isSourcePropertyNode =
            graph.getNodeAttribute(sourceNode, "qualityType") === "property";
          if (targetNode === hoveredNode) {
            graph.updateNodeAttribute(sourceNode, "hidden", () => false);
            graph.updateEdgeAttribute(edge, "hidden", () => false);
          } else if (!isSourcePropertyNode) {
            graph.updateEdgeAttribute(edge, "hidden", () => true);
          }
        });
      }

      renderer.refresh();
    });

    renderer.on("leaveNode", () => {
      graph.forEachNode((node) => {
        const { qualityType, hidden } = graph.getNodeAttributes(node);
        if (qualityType === "quality" && !hidden) {
          graph.updateNodeAttribute(node, "hidden", () => true);
        }
      });

      renderer.refresh();
    });
  }

  // All events for the fullscreen graph
  if (graphName !== "home") {
    renderer.on("enterNode", (event) => {
      const hoveredNode = event.node;

      graph.forEachEdge((edgeId, _, sourceNode, targetNode) => {
        const isRelated = sourceNode === hoveredNode || targetNode === hoveredNode;
        graph.updateEdgeAttribute(edgeId, "color", () => (isRelated ? "red" : "#E0E0E0"));
      });

      graph.forEachNode((node) => {
        const isConnected = graph.hasEdge(hoveredNode, node) || graph.hasEdge(node, hoveredNode);
        graph.updateNodeAttribute(node, "color", () =>
          isConnected ? graph.getNodeAttribute(node, "color") : "#CCCCCC",
        );
      });
    });

    renderer.on("leaveNode", () => {
      graph.forEachEdge((edgeId) => {
        graph.updateEdgeAttribute(edgeId, "color", () => DEFAULT_SETTINGS.defaultEdgeColor);
      });

      graph.forEachNode((node) => {
        graph.updateNodeAttribute(node, "color", () => getDefaultNodeColor(graph, node));
      });
    });
  }
}
