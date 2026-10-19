import { DEFAULT_SITE } from "./json.js";

// Markdown export of a map, shaped for arc42: §1.2 quality goals, §10 quality
// tree (with own requirements) and an approach × quality matrix. Pure over
// (state, subgraph, options): no DOM, so it runs in unit tests as is.

export const MARKDOWN_SECTIONS = Object.freeze(["goals", "tree", "matrix", "custom"]);

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };
const NO_PRIORITY = "–";
const LINKED = "●";

const absolute = (site, page) => `${site.replace(/\/$/, "")}${page}`;
// A "|" inside a cell would split the table row.
const cell = (text) => String(text).replace(/\|/g, "\\|");
// Titles are user or content text: keep them from turning into emphasis, links or code.
export const escapeInline = (text) => String(text).replace(/[\\*_[\]`]/g, "\\$&");
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function goalsSection(qualities, title) {
  const ranked = qualities
    .map((q, i) => ({ q, i, rank: PRIORITY_RANK[q.priority] ?? 3 }))
    .sort((a, b) => a.rank - b.rank || a.i - b.i);
  return [
    "## 1.2 Quality goals",
    "",
    "| Priority | Quality | Why it matters (edit me) |",
    "|---|---|---|",
    ...ranked.map(
      ({ q }) => `| ${q.priority ?? NO_PRIORITY} | ${cell(title(q))} | [YOUR REASON] |`,
    ),
  ];
}

function treeSection(qualities, title) {
  const byDimension = new Map();
  const undimensioned = [];
  for (const q of qualities) {
    if (q.dimensions.length === 0) undimensioned.push(q);
    for (const d of q.dimensions) {
      if (!byDimension.has(d)) byDimension.set(d, []);
      byDimension.get(d).push(q);
    }
  }
  const full = (q) => `  - **${title(q)}**${q.excerpt ? ` — ${q.excerpt}` : ""}`;
  const lines = ["## 10 Quality tree", ""];
  for (const d of [...byDimension.keys()].sort()) {
    lines.push(`- **#${d}**`);
    for (const q of byDimension.get(d)) {
      // Listed in full under its first dimension, as a pointer under the others.
      lines.push(q.dimensions[0] === d ? full(q) : `  - ${title(q)} (also listed above)`);
    }
  }
  if (undimensioned.length) {
    lines.push("- **(no dimension)**", ...undimensioned.map(full));
  }
  return lines;
}

function customSection(custom, qualities, hiddenItems, insideTree) {
  const labels = new Map(qualities.map((q) => [q.id, escapeInline(q.label)]));
  const hidden = new Set(hiddenItems);
  // Inside §10 when the tree is exported, a section of its own otherwise.
  const lines = [`${insideTree ? "###" : "##"} Own requirements`, ""];
  for (const c of custom) {
    const linked = c.qualities.filter((id) => labels.has(id)).map((id) => labels.get(id));
    const qualityList = linked.length ? ` (${linked.join(", ")})` : "";
    const hiddenNote = hidden.has(c.id) ? " _(hidden on map)_" : "";
    lines.push(`- **${escapeInline(c.title)}**${qualityList}${hiddenNote}`);
    const scenario = c.scenario.trim();
    if (scenario) lines.push(...scenario.split("\n").map((l) => `  ${l.trim()}`));
  }
  return lines;
}

function matrixSection(state, subgraph, title) {
  const lines = ["## Approaches serving two or more quality goals", ""];
  if (!state.layers.includes("approaches")) {
    return [...lines, "_Approaches layer is off on the map._"];
  }
  const approaches = subgraph.items.filter((i) => i.type === "approach");
  const shown = approaches.filter((i) => !i.hidden);
  const hidden = approaches.filter((i) => i.hidden);
  const columns = subgraph.qualities;
  if (shown.length) {
    lines.push(
      `| Approach | ${columns.map((q) => cell(title(q))).join(" | ")} |`,
      `|---|${columns.map(() => ":---:|").join("")}`,
      ...shown.map((item) => {
        const linked = new Set(item.linkedQualityIds);
        const marks = columns.map((q) => (linked.has(q.id) ? LINKED : " "));
        return `| ${cell(title(item))} | ${marks.join(" | ")} |`;
      }),
    );
  } else {
    lines.push("_No approach is shown on the map for these qualities._");
  }
  const notes = [];
  if (hidden.length)
    notes.push(`Hidden by you: ${hidden.map((i) => escapeInline(i.label)).join(", ")}.`);
  // Only approaches: other layers' singles are not part of this matrix.
  const singles = subgraph.singlesHiddenByType?.approach ?? 0;
  if (singles > 0 && !state.showSingles) {
    notes.push(`${plural(singles, "approach", "approaches")} with a single link omitted.`);
  }
  if (notes.length) lines.push("", notes.join(" "));
  return lines;
}

/**
 * @param {import("../store.js").MapState} state
 * @param {import("../subgraph.js").Subgraph} subgraph
 */
export function toMarkdown(
  state,
  subgraph,
  {
    sections = MARKDOWN_SECTIONS,
    links = false,
    site = DEFAULT_SITE,
    title = "Quality map",
    now = new Date(),
  } = {},
) {
  // Qualities and approaches have a page on Q42; own requirements and dimensions do not.
  const linkTitle = (node) => {
    const label = escapeInline(node.label);
    return links && node.page ? `[${label}](${absolute(site, node.page)})` : label;
  };
  const want = new Set(sections);
  const { qualities } = subgraph;
  const blocks = [
    [`# ${title}`, "", `Built with Q42, ${site} · ${now.toISOString().slice(0, 10)}`],
  ];
  if (want.has("goals")) blocks.push(goalsSection(qualities, linkTitle));
  if (want.has("tree")) blocks.push(treeSection(qualities, linkTitle));
  if (want.has("custom") && state.custom.length) {
    blocks.push(customSection(state.custom, qualities, state.hiddenItems, want.has("tree")));
  }
  if (want.has("matrix")) blocks.push(matrixSection(state, subgraph, linkTitle));
  return `${blocks.map((b) => b.join("\n")).join("\n\n")}\n`;
}
