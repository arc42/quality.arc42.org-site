import { select } from "d3-selection";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCollide,
  forceCenter,
  forceX,
  forceY,
} from "d3-force";
import { zoom, zoomIdentity } from "d3-zoom";
import { drag } from "d3-drag";
import {
  edgeStyle,
  itemStyle,
  nodeRadius,
  pillLabel,
  pillSize,
  qualityStyle,
  wrapLabel,
} from "./nodeStyle.js";

// The map canvas: the selection's subgraph as a D3 force layout in an <svg>.
// The svg is aria-hidden: the list view is the accessible twin. Nodes keep
// their positions across re-renders; dragging pins a node, double-click frees it,
// and tighten() frees them all and fits the regrouped layout into view.

const WIDTH = 960;
const HEIGHT = 600;
const LINK_DISTANCE = 140;
const CHARGE = -420;
// A weak pull toward the centre keeps unlinked qualities from drifting off.
const GRAVITY = 0.05;
const COLLIDE_GAP = 18;
const MAX_TICKS = 300;
const RESTART_ALPHA = 0.3;
const START_JITTER = 40;
const ZOOM_EXTENT = [0.3, 3];
const FIT_MARGIN = 0.95;
const LINE_HEIGHT = 15;

const edgeKey = (e) => `${e.itemId}->${e.qualityId}`;
const jitter = () => (Math.random() - 0.5) * 2 * START_JITTER;

export class MapView {
  constructor(container, { onSelect = () => {} } = {}) {
    this.onSelect = onSelect;
    this.positions = new Map(); // id -> { x, y, fx?, fy? }
    this.nodesById = new Map();
    this.selectedId = null;
    this.ticks = 0;
    this.reducedMotion =
      container.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)")
        .matches ?? false;

    const svg = select(container)
      .append("svg")
      .attr("class", "map-svg")
      .attr("aria-hidden", "true")
      .attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`)
      .attr("preserveAspectRatio", "xMidYMid meet");
    const layer = svg.append("g").attr("class", "map-zoom");
    this.edgeLayer = layer.append("g").attr("class", "map-edges");
    this.nodeLayer = layer.append("g").attr("class", "map-nodes");

    this.svg = svg;
    this.fitted = false;
    this.zoomBehaviour = zoom()
      .scaleExtent(ZOOM_EXTENT)
      .on("zoom", (event) => layer.attr("transform", event.transform));
    svg
      .call(this.zoomBehaviour)
      .on("dblclick.zoom", null) // double-click releases a pinned node instead
      .on("click", (event) => {
        if (!event.target.closest(".map-node")) this.onSelect(null);
      });

    this.simulation = forceSimulation()
      .force(
        "link",
        forceLink()
          .id((d) => d.id)
          .distance(LINK_DISTANCE),
      )
      .force("charge", forceManyBody().strength(CHARGE))
      .force(
        "collide",
        forceCollide((d) => nodeRadius(d) + COLLIDE_GAP),
      )
      .force("center", forceCenter(WIDTH / 2, HEIGHT / 2))
      .force("x", forceX(WIDTH / 2).strength(GRAVITY))
      .force("y", forceY(HEIGHT / 2).strength(GRAVITY))
      .stop()
      .on("tick", () => {
        this.ticks += 1;
        // Never cap mid-drag: alphaTarget stays above zero until the drag ends.
        if (this.ticks >= MAX_TICKS && this.simulation.alphaTarget() === 0) this.simulation.stop();
        this.draw();
      });

    this.dragBehaviour = drag()
      .on("start", (event, d) => {
        if (!event.active) this.simulation.alphaTarget(RESTART_ALPHA).restart();
        this.ticks = 0;
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = d.x = event.x;
        d.fy = d.y = event.y;
        this.draw();
      })
      .on("end", (event) => {
        this.ticks = 0;
        if (!event.active) this.simulation.alphaTarget(0);
      });
  }

  render(subgraph) {
    const qualities = subgraph.qualities.filter((q) => !q.hidden);
    const items = subgraph.items.filter((i) => !i.hidden);
    const shownQualities = new Set(qualities.map((q) => q.id));
    const nodes = [
      ...qualities.map((q) => ({ ...q, kind: "quality", type: "quality" })),
      ...items.map((i) => ({
        ...i,
        kind: "item",
        count: i.linkedQualityIds.filter((id) => shownQualities.has(id)).length,
      })),
    ];
    const visible = new Set(nodes.map((n) => n.id));
    this.nodesById = new Map(nodes.map((n) => [n.id, n]));
    for (const node of nodes) Object.assign(node, this.startPosition(node));

    const edges = subgraph.edges
      .filter((e) => visible.has(e.source) && visible.has(e.target))
      .map((e) => ({ ...e, itemId: e.source, qualityId: e.target }));

    this.edgeSel = this.edgeLayer
      .selectAll("line")
      .data(edges, edgeKey)
      .join("line")
      .attr("class", "map-edge");

    this.nodeSel = this.nodeLayer
      .selectAll("g.map-node")
      .data(nodes, (d) => d.id)
      .join((enter) =>
        enter
          .append("g")
          .attr("class", "map-node")
          .call(this.dragBehaviour)
          .on("click", (event, d) => {
            event.stopPropagation();
            this.onSelect(d.id);
          })
          .on("dblclick", (event, d) => {
            event.stopPropagation();
            d.fx = null;
            d.fy = null;
            this.restart(RESTART_ALPHA);
          }),
      )
      .attr("data-id", (d) => d.id)
      .attr("data-type", (d) => d.type)
      .each(function (d) {
        drawNode(select(this), d);
      });

    this.simulation.nodes(nodes);
    this.simulation.force("link").links(edges);
    this.focusNode(this.selectedId);
    this.restart(this.fitted ? RESTART_ALPHA : 1);
  }

  /** Previous position if the node was drawn before, else near its qualities. */
  startPosition(node) {
    const known = this.positions.get(node.id);
    if (known) return { ...known };
    const anchors = (node.linkedQualityIds ?? [])
      .map((id) => this.positions.get(id))
      .filter(Boolean);
    const cx = anchors.length ? mean(anchors, "x") : WIDTH / 2;
    const cy = anchors.length ? mean(anchors, "y") : HEIGHT / 2;
    return { x: cx + jitter(), y: cy + jitter() };
  }

  /**
   * The first layout (and every layout under reduced motion) is settled off
   * screen and drawn once, then fitted into view; later changes animate.
   */
  restart(alpha) {
    this.ticks = 0;
    this.simulation.alpha(alpha);
    if (this.fitted && !this.reducedMotion) {
      this.simulation.restart();
      return;
    }
    this.simulation.stop();
    for (let i = 0; i < MAX_TICKS; i++) this.simulation.tick();
    this.draw();
    if (!this.fitted && this.simulation.nodes().length) this.fit();
  }

  /** Release every pinned node, settle the layout afresh and fit it into view. */
  tighten() {
    const nodes = this.simulation.nodes();
    if (!nodes.length) return;
    for (const d of nodes) {
      d.fx = null;
      d.fy = null;
    }
    this.ticks = 0;
    this.simulation.alpha(1).stop();
    for (let i = 0; i < MAX_TICKS; i++) this.simulation.tick();
    this.draw();
    this.fit();
  }

  /** Zoom out (never in) so the whole settled layout is visible. */
  fit() {
    this.fitted = true;
    let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
    for (const d of this.simulation.nodes()) {
      const r = nodeRadius(d);
      [x0, y0] = [Math.min(x0, d.x - r), Math.min(y0, d.y - r)];
      [x1, y1] = [Math.max(x1, d.x + r), Math.max(y1, d.y + r)];
    }
    const k = Math.min(1, FIT_MARGIN * Math.min(WIDTH / (x1 - x0), HEIGHT / (y1 - y0)));
    const t = zoomIdentity
      .translate(WIDTH / 2 - (k * (x0 + x1)) / 2, HEIGHT / 2 - (k * (y0 + y1)) / 2)
      .scale(k);
    this.svg.call(this.zoomBehaviour.transform, t);
  }

  draw() {
    if (!this.nodeSel) return;
    for (const d of this.simulation.nodes()) {
      this.positions.set(d.id, { x: d.x, y: d.y, fx: d.fx, fy: d.fy });
    }
    this.edgeSel
      .attr("x1", (e) => e.source.x)
      .attr("y1", (e) => e.source.y)
      .attr("x2", (e) => e.target.x)
      .attr("y2", (e) => e.target.y);
    this.nodeSel.attr("transform", (d) => `translate(${d.x},${d.y})`);
  }

  /** Highlight one node and the edges touching it; null clears the highlight. */
  focusNode(id) {
    this.selectedId = id ?? null;
    if (!this.nodeSel) return;
    this.nodeSel.classed("is-selected", (d) => d.id === this.selectedId);
    this.edgeSel.each((e, i, group) => {
      const highlighted = e.itemId === this.selectedId || e.qualityId === this.selectedId;
      const itemType = this.nodesById.get(e.itemId)?.type;
      const style = edgeStyle(e, { highlighted, itemType });
      select(group[i])
        .classed("is-highlighted", highlighted)
        .attr("stroke", style.stroke)
        .attr("stroke-width", style.width)
        .attr("stroke-dasharray", style.dash);
      if (highlighted) group[i].parentNode.append(group[i]); // draw on top
    });
  }
}

function mean(points, key) {
  return points.reduce((sum, p) => sum + p[key], 0) / points.length;
}

/** Append an SVG child with attributes (null values are skipped) and optional text. */
function add(parent, tag, attrs, text) {
  const el = parent.append(tag);
  for (const [name, value] of Object.entries(attrs)) if (value !== null) el.attr(name, value);
  if (text !== undefined) el.text(text);
  return el;
}

function drawNode(g, d) {
  g.selectAll("*").remove();
  if (d.kind === "quality") drawQuality(g, d);
  else drawItem(g, d);
}

function drawQuality(g, d) {
  const { r, fill, stroke, text } = qualityStyle(d.priority);
  add(g, "circle", { class: "map-node__shape", r, fill, stroke });
  const lines = wrapLabel(d.label, r);
  const top = -((lines.length - 1) * LINE_HEIGHT) / 2 - 6;
  const label = add(g, "text", { class: "map-node__label", fill: text });
  lines.forEach((line, i) => add(label, "tspan", { x: 0, y: top + i * LINE_HEIGHT }, line));
  const subY = top + lines.length * LINE_HEIGHT + 2;
  add(g, "text", { class: "map-node__sub", fill: text, y: subY }, `${d.sharedCount} shared`);
}

function drawItem(g, d) {
  const style = itemStyle(d.type);
  const { width, height } = pillSize(d.label);
  add(g, "rect", {
    class: "map-node__shape",
    x: -width / 2,
    y: -height / 2,
    width,
    height,
    rx: style.dashed ? 6 : height / 2,
    fill: style.fill,
    stroke: style.stroke,
    "stroke-dasharray": style.dashed ? "5 4" : null,
  });
  const labelAttrs = { class: "map-node__pill-label", x: -width / 2 + 14, dy: "0.35em" };
  add(g, "text", { ...labelAttrs, fill: style.text }, pillLabel(d.label));
  const cx = width / 2 - 17;
  add(g, "circle", { class: "map-node__badge", cx, r: 10, fill: style.badgeFill });
  const badgeAttrs = { class: "map-node__badge-text", x: cx, dy: "0.35em" };
  add(g, "text", { ...badgeAttrs, fill: style.badgeText }, d.count);
}
