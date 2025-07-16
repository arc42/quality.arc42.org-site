import propertyNodes from "../../../assets/data/property-nodes.json";
import nodes from "../../../assets/data/nodes.json";
import edges from "../../../assets/data/edges.json";
import { GraphDataProvider } from "../GraphDataProvider";
import { HomeGraph } from "../HomeGraph";

// Initialize data provider
const dataProvider = new GraphDataProvider(propertyNodes, nodes, edges);

// Initialize and render the homepage graph
const homeGraph = new HomeGraph("q-graph-container", dataProvider);
homeGraph
    .initialize()
    .buildGraph()
    .registerDefaultEventHandlers()
    .render();
