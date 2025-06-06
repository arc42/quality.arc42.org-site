import propertyNodes from "../../../assets/data/property-nodes.json";
import nodes from "../../../assets/data/nodes.json";
import edges from "../../../assets/data/edges.json";
import { initializeAndRenderGraph } from "../common";

// Initialize and render the fullpage graph
initializeAndRenderGraph("full-q-graph-container", "fullpage", propertyNodes, nodes, edges);
