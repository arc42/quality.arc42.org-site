// Pure text helpers for the map page: summary line, list-view cells, labels.

const TYPE_ORDER = Object.freeze([
  { type: "approach", layer: "approaches" },
  { type: "requirement", layer: "requirements" },
  { type: "standard", layer: "standards" },
  { type: "dimension", layer: "dimensions" },
]);

/** "1 quality", "3 qualities". */
export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/** Absolute URL of a Q42 page on `site`; null when there is no page. */
export const absolute = (site, page) => (page ? `${site.replace(/\/$/, "")}${page}` : null);

/** Summary line under the page title; parts are joined by " · ". */
export function summaryText(subgraph, state) {
  const n = subgraph.qualities.length;
  const parts = [plural(n, "quality", "qualities")];
  for (const { type, layer } of TYPE_ORDER) {
    if (!state.layers.includes(layer)) continue;
    const k = subgraph.items.filter((item) => item.type === type).length;
    if (k === 0) continue;
    if (type === "approach") {
      const reach = state.showSingles ? "one or more" : "two or more";
      parts.push(`${plural(k, "approach serves", "approaches serve")} ${reach} of them`);
    } else {
      parts.push(`${plural(k, type, `${type}s`)} shared`);
    }
  }
  const own = state.custom?.length ?? 0;
  if (own) parts.push(plural(own, "own requirement", "own requirements"));
  if (n > 0 && parts.length === 1) parts.push("nothing shared yet");
  return parts.join(" · ");
}

/** "3 of 4": how many of the selected qualities an item serves. */
export function servesText(item, total) {
  return `${item.linkedQualityIds.length} of ${total}`;
}

const PRIORITY_LABELS = Object.freeze({ low: "low", medium: "medium", high: "high" });

export function priorityLabel(priority) {
  return PRIORITY_LABELS[priority] ?? "not rated";
}

const LAYER_NOUNS = Object.freeze({
  approaches: ["approach", "approaches"],
  requirements: ["requirement", "requirements"],
  standards: ["standard", "standards"],
  dimensions: ["dimension", "dimensions"],
});

/** Text of the single-link chip; empty when nothing is held back and singles are off. */
export function singlesChipText(subgraph, state) {
  if (state.showSingles) return "Single-link items shown · Hide";
  const n = subgraph.singlesHidden;
  if (!n) return "";
  const [one, many] = (state.layers.length === 1 && LAYER_NOUNS[state.layers[0]]) || [
    "item",
    "items",
  ];
  return `${n} ${n === 1 ? one : many} with one link ${n === 1 ? "is" : "are"} hidden · Show`;
}

/** Notice for selected ids that no longer exist on Q42; names them so the reader can decide. */
export function unknownIdsText(ids) {
  const count = ids.length;
  if (!count) return "";
  return `${plural(count, "quality", "qualities")} in your selection no longer ${
    count === 1 ? "exists" : "exist"
  } on Q42: ${ids.join(", ")}.`;
}

/** Heading of each item group in the list view. */
export const GROUP_LABELS = Object.freeze({
  approach: "Approaches",
  requirement: "Requirements",
  standard: "Standards",
  dimension: "Dimensions",
  custom: "Own requirements",
});
