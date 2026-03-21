import propertyNodes from "../../../assets/data/property-nodes.json";
import nodes from "../../../assets/data/nodes.json";
import edges from "../../../assets/data/edges.json";
import { GraphDataProvider } from "../GraphDataProvider";
import { FullGraph } from "../FullGraph";
import { GraphPageController } from "../GraphPageController.js";

// Initialize data provider
const dataProvider = new GraphDataProvider(propertyNodes, nodes, edges);

// Initialize and render the fullpage graph
const fullGraph = new FullGraph("full-q-graph-container", dataProvider);
fullGraph
    .initialize()
    .buildGraph()
    .registerDefaultEventHandlers()
    .render();

// Initialize page UI controller (mobile sheet, quick filters, reset)
new GraphPageController(fullGraph).initialize();
