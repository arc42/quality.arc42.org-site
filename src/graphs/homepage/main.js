import { MultiGraph } from "graphology";
import { Sigma } from "sigma";

import propertyNodes from "../../../assets/data/property-nodes.json";
import nodes from "../../../assets/data/nodes.json";
import edges from "../../../assets/data/edges.json";
import { registerGraphEvents } from "../events";
import { createEdges, createNodes, createRootNode, applyEnhancedRadialLayout } from "../utils";

const graph = new MultiGraph();
graph.setAttribute("name", "home");
graph.setAttribute("qualityType", "q42");

try {
  createRootNode(graph, "Quality", 35, "orange");
  createNodes(graph, propertyNodes);
  createNodes(graph, nodes);
  createEdges(graph, edges);
} catch (error) {
  console.error("Could not render graph", { cause: error });
}

graph.forEachNode((node) => {
  const nodeType = graph.getNodeAttribute(node, "qualityType");
  const isQualityNode = nodeType === "quality";
  const isRequirementNode = nodeType === "requirement";

  if (isRequirementNode) graph.dropNode(node);
  if (isQualityNode) graph.setNodeAttribute(node, "hidden", true);
});

applyEnhancedRadialLayout(graph, "quality-root", 250);

const renderer = new Sigma(graph, document.getElementById("q-graph-container"), {
  allowInvalidContainer: true,
  autoRescale: true,
  autoCenter: true,
});

registerGraphEvents(graph, renderer);
renderer.refresh();
