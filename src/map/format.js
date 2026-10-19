// Pure text helpers for the map page: summary line, list-view cells, labels.

const TYPE_ORDER = Object.freeze([
  { type: "approach", layer: "approaches" },
  { type: "requirement", layer: "requirements" },
  { type: "standard", layer: "standards" },
  { type: "dimension", layer: "dimensions" },
]);

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

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

/** Hint next to the "show singles" toggle; empty when nothing is held back. */
export function singlesText(count) {
  if (!count) return "";
  return `${plural(count, "item links", "items link")} to only one of your qualities`;
}

/** Notice for selected ids that no longer exist on Q42. */
export function unknownIdsText(count) {
  if (!count) return "";
  return `${plural(count, "quality", "qualities")} in your selection no longer ${
    count === 1 ? "exists" : "exist"
  } on Q42 and ${count === 1 ? "was" : "were"} ignored`;
}

/** Heading of each item group in the list view. */
export const GROUP_LABELS = Object.freeze({
  approach: "Approaches",
  requirement: "Requirements",
  standard: "Standards",
  dimension: "Dimensions",
  custom: "Own requirements",
});
