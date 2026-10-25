import propertyNodes from "../../assets/data/property-nodes.json";
import nodes from "../../assets/data/nodes.json";
import edges from "../../assets/data/edges.json";
import { indexGraph } from "./subgraph.js";
import { loadState } from "./store.js";
import { MapPage } from "./MapPage.js";
import { decodeShare, encodeShare } from "./share.js";

// Handy for support and used by the UI tests to mint share tokens.
window.q42Map = { encodeShare, decodeShare };

const root = document.getElementById("map-page");
if (root) {
  const index = indexGraph({ nodes, edges, propertyNodes });
  new MapPage(root, { index, initialState: loadState() }).mount();
}
