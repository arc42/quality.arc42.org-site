import { MultiGraph } from "graphology";
import { Sigma } from "sigma";

import propertyNodes from "../../../assets/data/property-nodes.json";
import nodes from "../../../assets/data/nodes.json";
import edges from "../../../assets/data/edges.json";
import { registerGraphEvents } from "../events";
import { applyEnhancedRadialLayout , createEdges , createNodes , createRootNode } from "../utils";
import { registerFilterEvents } from '../filter';

// Create Graph and its elements
const graph = new MultiGraph();
graph.setAttribute("name" , "fullpage");
graph.setAttribute("qualityType" , "q42");

try {
    createRootNode(graph , "Quality" , 35 , "orange");
    createNodes(graph , propertyNodes);
    createNodes(graph , nodes);
    createEdges(graph , edges);
} catch (error) {
    console.error("Could not render graph" , { cause: error });
}

applyEnhancedRadialLayout(graph , "quality-root" , 250);

// Render graph
const renderer = new Sigma(graph , document.getElementById("full-q-graph-container") , {
    allowInvalidContainer: true ,
    autoRescale: true ,
    autoCenter: true ,
});

// Register custom interactions
registerGraphEvents(graph , renderer);
registerFilterEvents(graph , renderer);
