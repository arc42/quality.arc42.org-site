// Canonical graph color palette.
//
// These mirror the design tokens in `_sass/base/_variables.scss`. They live in
// JS because the graph is drawn on a <canvas>, which can't read CSS custom
// properties. When a graph color changes, update it here AND in the SCSS token
// so the two layers don't drift (this file replaced ~17 scattered literals).

// Node fill colors keyed by qualityType (consumed by data.js when emitting the
// graph data, and as canvas fillStyle at render time).
export const NODE_COLORS = Object.freeze({
  requirement: "#ffb3b3", // --reqs-background-color
  quality: "#00b8f5", // --quality-background-color / $brand-blue
  dimension: "#1a3a5c", // --dimension-background-color
  property: "#f8f9fa", // legacy property nodes
  standard: "#ffc95c", // --standard-background-color
  approach: "#92ef80", // --approaches-background-color
  root: "#ebebeb", // central "Quality" hub node
});

// Per-type label text colors (only where the fill needs a non-default).
export const NODE_TEXT_COLORS = Object.freeze({
  dimension: "#c8e6f5", // --dimension-text-color
});

// Renderer-layer colors for canvas strokes, links, and highlight rings.
export const GRAPH_COLORS = Object.freeze({
  nodeStroke: "#2c3e50", // default node outline
  nodeStrokeMatch: "#0f172a", // outline for filter-matched nodes
  link: "#e0e0e0", // edge stroke
  linkHover: "#cb9fff", // edge stroke on hover
  outerRing: "#f97316", // filter-match emphasis ring
  synonymAccent: "#00b8f5", // tooltip "also known as" accent
  propertyLabelText: "#ffffff", // dimension/property label fill fallback
  propertyLabelHalo: "#1a3a5c", // dimension/property label outline (= dimension fill)
});
