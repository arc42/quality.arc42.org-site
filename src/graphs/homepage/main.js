import propertyNodes from "../../../assets/data/property-nodes.json";
import nodes from "../../../assets/data/nodes.json";
import edges from "../../../assets/data/edges.json";
import { GraphDataProvider } from "../GraphDataProvider";
import { HomeGraph } from "../HomeGraph";

const LAYER_MAP = {
    q: "quality",
    r: "requirement",
    s: "standard",
    a: "approach",
};

// Initialize data provider
const dataProvider = new GraphDataProvider(propertyNodes, nodes, edges);

// Initialize and render the homepage graph
const homeGraph = new HomeGraph("q-graph-home", dataProvider);
homeGraph
    .initialize()
    .buildGraph()
    .registerDefaultEventHandlers()
    .render();

homeGraph.applyGraphState(homeGraph.previewLayerState, homeGraph.previewDimensionFilter);
homeGraph.syncPreviewControls();
homeGraph.syncOverlayControls();

document.querySelectorAll(".q42-layer-toggle[data-layer]").forEach((button) => {
    button.addEventListener("click", () => {
        if (button.dataset.context !== "overlay") return;
        const nodeType = LAYER_MAP[button.dataset.layer];
        if (!nodeType || button.disabled) return;

        const nextState = button.getAttribute("aria-pressed") !== "true";
        homeGraph.setLayerVisible(nodeType, nextState);
    });
});

document.querySelectorAll(".q42-dim-pin[data-d]").forEach((button) => {
    button.addEventListener("click", () => {
        homeGraph.toggleDimensionFilter(button.dataset.d);
    });
});

const homeGraphCanvas = document.getElementById("q-graph-home");
homeGraphCanvas?.addEventListener("click", () => {
    homeGraph.openOverlay(homeGraphCanvas);
});

window.openGraphOverlay = function () {
    homeGraph.openOverlay();
};

window.closeGraphOverlay = function () {
    homeGraph.closeOverlay();
};
