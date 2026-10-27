// Pure size and colour helpers for the /map/ canvas. No DOM, no D3:
// MapView reads everything it draws from here, the unit tests pin the values.

import { NODE_COLORS } from "../graphs/colors.js";

export const QUALITY_RADIUS = Object.freeze({ none: 34, low: 40, medium: 48, high: 58 });
export const QUALITY_FILL = Object.freeze({
  none: "#ffffff",
  low: "#e6f7fe",
  medium: "#a6e4fb",
  high: NODE_COLORS.quality,
});

const QUALITY_STROKE = NODE_COLORS.quality;
const QUALITY_TEXT = "#003366";

const WHITE = "#ffffff";

// The count badge inverts the pill: stroke colour as fill, white digits, except
// on the dark dimension pill, where a white badge carries dark digits.
const ITEM_STYLES = Object.freeze({
  approach: { fill: "#d9f7d3", stroke: "#1b5e20", text: "#1b5e20", dashed: false },
  requirement: { fill: "#ffe0e0", stroke: "#8b0000", text: "#8b0000", dashed: false },
  standard: { fill: "#ffefc8", stroke: "#2c3e50", text: "#2c3e50", dashed: false },
  dimension: {
    fill: NODE_COLORS.dimension,
    stroke: NODE_COLORS.dimension,
    text: WHITE,
    dashed: false,
  },
  custom: { fill: "#ffe0e0", stroke: "#8b0000", text: "#8b0000", dashed: true },
});

const EDGE_LINK = "#d8d0d6";
const EDGE_CUSTOM = "#8b0000";
const EDGE_DASH = "6 5";

// Pill geometry: width approximated from the label length (no measureText).
export const PILL_HEIGHT = 32;
export const PILL_CHAR_WIDTH = 7;
export const PILL_PADDING = 48; // left padding + badge + right padding
export const PILL_MAX_CHARS = 32;

export function qualityStyle(priority) {
  const key = priority && QUALITY_RADIUS[priority] ? priority : "none";
  return {
    r: QUALITY_RADIUS[key],
    fill: QUALITY_FILL[key],
    stroke: QUALITY_STROKE,
    text: QUALITY_TEXT,
  };
}

export function itemStyle(type) {
  const style = ITEM_STYLES[type] ?? ITEM_STYLES.approach;
  const dark = style.text === WHITE;
  return {
    ...style,
    badgeFill: dark ? WHITE : style.stroke,
    badgeText: dark ? style.stroke : WHITE,
  };
}

/** Split a quality label into at most two lines that roughly fit the circle. */
export function wrapLabel(label, r) {
  const max = Math.max(9, Math.floor((r * 2) / 7.5));
  if (label.length <= max) return [label];
  const cut = label.lastIndexOf(" ", max);
  if (cut <= 0) return [label];
  const rest = label.slice(cut + 1);
  return [label.slice(0, cut), rest.length > max ? `${rest.slice(0, max - 1)}…` : rest];
}

/** Item pill label, shortened so very long requirement titles stay pill-sized. */
export function pillLabel(label) {
  return label.length > PILL_MAX_CHARS ? `${label.slice(0, PILL_MAX_CHARS - 1)}…` : label;
}

export function pillSize(label) {
  return { width: pillLabel(label).length * PILL_CHAR_WIDTH + PILL_PADDING, height: PILL_HEIGHT };
}

/** Radius the collision force keeps clear around a node (before the extra gap). */
export function nodeRadius(node) {
  if (node.kind === "quality") return qualityStyle(node.priority).r;
  return pillSize(node.label).width / 2;
}

export function edgeStyle(edge, { highlighted = false, itemType } = {}) {
  if (highlighted) {
    const type = itemType ?? (edge.kind === "custom" ? "custom" : "approach");
    return {
      stroke: itemStyle(type).stroke,
      width: 3,
      dash: edge.kind === "custom" ? EDGE_DASH : null,
    };
  }
  if (edge.kind === "custom") return { stroke: EDGE_CUSTOM, width: 1.5, dash: EDGE_DASH };
  return { stroke: EDGE_LINK, width: 1.5, dash: null };
}
