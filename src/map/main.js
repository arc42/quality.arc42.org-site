import propertyNodes from "../../assets/data/property-nodes.json";
import nodes from "../../assets/data/nodes.json";
import edges from "../../assets/data/edges.json";
import { indexGraph } from "./subgraph.js";
import { loadState } from "./store.js";
import { MapPage } from "./MapPage.js";

const root = document.getElementById("map-page");
if (root) {
  const index = indexGraph({ nodes, edges, propertyNodes });
  new MapPage(root, { index, initialState: loadState() }).mount();
}
