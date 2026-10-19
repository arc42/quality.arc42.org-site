import { NODE_TYPES } from "../graphs/constants.js";

export const LAYER_TO_TYPE = Object.freeze({
  approaches: NODE_TYPES.APPROACH,
  requirements: NODE_TYPES.REQUIREMENT,
  standards: NODE_TYPES.STANDARD,
  dimensions: NODE_TYPES.DIMENSION,
});

const ROOT_ID = "quality-root";

/**
 * @typedef {{ id: string, label: string, page: string, qualityType: string, priority: string|null, hidden: boolean, sharedCount: number }} MapQuality
 * @typedef {{ id: string, label: string, page: string, type: "approach"|"requirement"|"standard"|"dimension"|"custom", linkedQualityIds: string[], hidden: boolean }} MapItem
 * @typedef {{ source: string, target: string, kind: "link"|"custom" }} MapEdge
 * @typedef {{ qualities: MapQuality[], items: MapItem[], edges: MapEdge[], unknownIds: string[], singlesHidden: number }} Subgraph
 */

function link(neighbours, a, b) {
  if (a === b) return;
  if (!neighbours.has(a)) neighbours.set(a, new Set());
  if (!neighbours.has(b)) neighbours.set(b, new Set());
  neighbours.get(a).add(b);
  neighbours.get(b).add(a);
}

/** Index generated graph data: nodes by id and undirected neighbour sets. */
export function indexGraph({ nodes = [], edges = [], propertyNodes = [] }) {
  const byId = new Map();
  for (const node of nodes) byId.set(node.id, node);
  for (const node of propertyNodes) {
    byId.set(node.id, { ...node, qualityType: NODE_TYPES.DIMENSION });
  }
  const neighbours = new Map();
  for (const { source, target } of edges) {
    if (source === ROOT_ID || target === ROOT_ID) continue;
    link(neighbours, source, target);
  }
  const standardIds = new Map();
  for (const node of byId.values()) {
    if (node.qualityType === NODE_TYPES.STANDARD) standardIds.set(node.id.toLowerCase(), node.id);
  }
  for (const node of byId.values()) {
    if (node.qualityType !== NODE_TYPES.QUALITY || !Array.isArray(node.standards)) continue;
    for (const sid of node.standards) {
      const standardId = standardIds.get(String(sid).toLowerCase());
      if (standardId) link(neighbours, node.id, standardId);
    }
  }
  return { byId, neighbours };
}

/** Build the subgraph the map page draws for a given selection state. */
export function buildSubgraph(index, state) {
  const { byId, neighbours } = index;
  const unknownIds = [];
  const known = []; // { node, sel } in selection order
  for (const sel of state.qualities) {
    const node = byId.get(sel.id);
    if (node && node.qualityType === NODE_TYPES.QUALITY) known.push({ node, sel });
    else unknownIds.push(sel.id);
  }
  const selectedIds = new Set(known.map((k) => k.node.id));
  const order = known.map((k) => k.node.id);
  const hiddenItems = new Set(state.hiddenItems);
  const enabledTypes = new Set(state.layers.map((l) => LAYER_TO_TYPE[l]).filter(Boolean));

  const candidates = new Set();
  for (const id of order) {
    for (const n of neighbours.get(id) ?? []) {
      const type = byId.get(n)?.qualityType;
      if (enabledTypes.has(type)) candidates.add(n);
    }
  }

  const items = [];
  let singlesHidden = 0;
  for (const id of candidates) {
    const node = byId.get(id);
    const linked = order.filter((q) => neighbours.get(id).has(q));
    if (linked.length < (state.showSingles ? 1 : 2)) {
      if (linked.length === 1) singlesHidden++;
      continue;
    }
    items.push({
      id,
      label: node.label,
      page: node.page,
      type: node.qualityType,
      linkedQualityIds: linked,
      hidden: hiddenItems.has(id),
    });
  }

  for (const c of state.custom) {
    items.push({
      id: c.id,
      label: c.title,
      page: "",
      type: "custom",
      linkedQualityIds: order.filter((q) => c.qualities.includes(q)),
      hidden: hiddenItems.has(c.id),
    });
  }

  items.sort(
    (a, b) =>
      b.linkedQualityIds.length - a.linkedQualityIds.length || a.label.localeCompare(b.label),
  );

  const edges = [];
  const sharedCount = new Map(order.map((id) => [id, 0]));
  for (const item of items) {
    for (const q of item.linkedQualityIds) {
      edges.push({ source: item.id, target: q, kind: item.type === "custom" ? "custom" : "link" });
      if (!item.hidden) sharedCount.set(q, sharedCount.get(q) + 1);
    }
  }

  const qualities = known.map(({ node, sel }) => ({
    id: node.id,
    label: node.label,
    page: node.page,
    qualityType: node.qualityType,
    priority: sel.priority,
    hidden: sel.hidden,
    sharedCount: sharedCount.get(node.id),
  }));

  return { qualities, items, edges, unknownIds, singlesHidden };
}
