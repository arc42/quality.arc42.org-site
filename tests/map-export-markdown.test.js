import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { toMarkdown } from "../src/map/exporters/markdown.js";
import { indexGraph, buildSubgraph } from "../src/map/subgraph.js";
import { bodyExcerpt } from "../src/scripts/data.js";
import {
  createEmptyState,
  addQuality,
  addCustom,
  setPriority,
  setItemHidden,
  setLayers,
  setQualityHidden,
} from "../src/map/store.js";

const graph = JSON.parse(readFileSync(new URL("./fixtures/map-graph.json", import.meta.url)));
const index = indexGraph(graph);
const NOW = new Date("2026-10-19T12:00:00Z");

// Two qualities, one own requirement, two shared approaches (Bulkheads, Circuit Breaker).
function sample() {
  let s = addQuality(addQuality(createEmptyState(), "availability"), "resilience");
  s = setPriority(s, "resilience", "high");
  return addCustom(s, {
    title: "Checkout survives",
    scenario: "Payment provider down for 30 s: orders are queued.",
    qualities: ["availability", "resilience"],
  });
}

const md = (state, options = {}) =>
  toMarkdown(state, buildSubgraph(index, state), { now: NOW, ...options });

test("the full document follows the arc42 layout", () => {
  assert.equal(
    md(sample()),
    `# Quality map

Built with Q42, https://quality.arc42.org · 2026-10-19

## 1.2 Quality goals

| Priority | Quality | Why it matters (edit me) |
|---|---|---|
| high | Resilience | [YOUR REASON] |
| – | Availability | [YOUR REASON] |

## 10 Quality tree

- **#reliable**
  - **Availability** — Capability of a product to be accessible and operational when required for use.
  - **Resilience**
- **#secure**
  - Resilience (also listed above)

### Own requirements

- **Checkout survives** (Availability, Resilience)
  Payment provider down for 30 s: orders are queued.

## Approaches serving two or more quality goals

| Approach | Availability | Resilience |
|---|:---:|:---:|
| Bulkheads | ● | ● |
| Circuit Breaker | ● | ● |
`,
  );
});

test("links: true turns quality and approach titles into links back to the site", () => {
  const out = md(sample(), { links: true });
  const url = "[Availability](https://quality.arc42.org/qualities/availability)";
  assert.ok(out.includes(`| – | ${url} | [YOUR REASON] |`));
  assert.ok(out.includes(`  - **${url}** — Capability`));
  assert.ok(out.includes(`| Approach | ${url} |`));
  assert.ok(
    out.includes("| [Bulkheads](https://quality.arc42.org/approaches/bulkheads) | ● | ● |"),
  );
  // Own requirements and dimensions have no page on Q42.
  assert.ok(out.includes("- **Checkout survives** (Availability, Resilience)"));
  assert.ok(out.includes("- **#reliable**\n"));
  assert.ok(!md(sample()).includes("](https://"));
});

test("sections can be left out; title and site are configurable", () => {
  const out = md(sample(), {
    sections: ["goals", "matrix"],
    title: "Checkout platform",
    site: "https://example.org/",
  });
  assert.ok(
    out.startsWith("# Checkout platform\n\nBuilt with Q42, https://example.org/ · 2026-10-19\n"),
  );
  assert.ok(out.includes("## 1.2 Quality goals"));
  assert.ok(!out.includes("## 10 Quality tree"));
  assert.ok(!out.includes("### Own requirements"));
  assert.ok(out.includes("## Approaches serving two or more quality goals"));
  assert.ok(!md(sample(), { sections: ["goals", "tree"] }).includes("### Own requirements"));
  assert.ok(!md(sample(), { sections: ["tree", "custom"] }).includes("## 1.2"));
  assert.ok(!md(sample(), { sections: ["goals"] }).includes("## Approaches"));
});

test("own requirements are omitted when there are none", () => {
  const s = addQuality(createEmptyState(), "availability");
  assert.ok(!md(s).includes("### Own requirements"));
});

test("goals rank high → medium → low → –, keep selection order and include hidden qualities", () => {
  let s = ["availability", "resilience", "fault-tolerance", "recoverability"].reduce(
    addQuality,
    createEmptyState(),
  );
  s = setPriority(s, "recoverability", "medium");
  s = setPriority(s, "fault-tolerance", "low");
  s = setPriority(s, "availability", "medium");
  s = setQualityHidden(s, "resilience", true);
  const rows = md(s, { sections: ["goals"] })
    .split("\n")
    .filter((l) => l.endsWith("| [YOUR REASON] |"));
  assert.deepEqual(rows, [
    "| medium | Availability | [YOUR REASON] |",
    "| medium | Recoverability | [YOUR REASON] |",
    "| low | Fault Tolerance | [YOUR REASON] |",
    "| – | Resilience | [YOUR REASON] |",
  ]);
});

test("the matrix lists hidden approaches and counts omitted single links", () => {
  let s = ["availability", "resilience", "recoverability"].reduce(addQuality, createEmptyState());
  s = setItemHidden(s, "bulkheads", true);
  const out = md(s, { sections: ["matrix"] });
  assert.ok(out.includes("| Approach | Availability | Resilience | Recoverability |"));
  assert.ok(out.includes("|---|:---:|:---:|:---:|"));
  assert.ok(out.includes("| Circuit Breaker | ● | ● |   |\n"));
  assert.ok(!out.includes("| Bulkheads |"));
  assert.ok(out.endsWith("\nHidden by you: Bulkheads. 1 approach with a single link omitted.\n"));
});

test("the matrix says so when the approaches layer is off", () => {
  const out = md(setLayers(sample(), ["requirements"]), { sections: ["matrix"] });
  assert.ok(
    out.includes(
      "## Approaches serving two or more quality goals\n\n_Approaches layer is off on the map._\n",
    ),
  );
  assert.ok(!out.includes("| Approach |"));
});

test("qualities without a dimension go under a final (no dimension) bullet", () => {
  const state = addQuality(addQuality(createEmptyState(), "a"), "b");
  const subgraph = {
    qualities: [
      { id: "a", label: "Alpha", page: "/qualities/a", excerpt: "", dimensions: [] },
      { id: "b", label: "Beta", page: "/qualities/b", excerpt: "Second.", dimensions: ["usable"] },
    ],
    items: [],
    edges: [],
    unknownIds: [],
    singlesHidden: 0,
  };
  const out = toMarkdown(state, subgraph, { sections: ["tree"], now: NOW });
  assert.ok(
    out.endsWith(
      "## 10 Quality tree\n\n- **#usable**\n  - **Beta** — Second.\n- **(no dimension)**\n  - **Alpha**\n",
    ),
  );
});

test("bodyExcerpt takes the first prose paragraph, stripped of Markdown, cut at 240", () => {
  const body = `
{% include quality-header.html %}
<!-- a comment -->
<div class="intro">

## Definition

>Capability of a **product** to be [accessible](/q/a) and \`operational\`
>when _required_.
>
>[ISO-25010:2023](/references/#iso-25010-2023)
`;
  assert.equal(
    bodyExcerpt(body),
    "Capability of a product to be accessible and operational when required.",
  );
  const long = bodyExcerpt(`${"word ".repeat(100)}\n\nNext paragraph.`);
  assert.ok(long.length <= 241);
  assert.ok(long.endsWith("word…"));
  assert.equal(bodyExcerpt(""), "");
  assert.equal(bodyExcerpt(undefined), "");
});

test("the singles note counts approaches only, not single-link requirements", () => {
  const s = setLayers(
    ["availability", "resilience", "recoverability"].reduce(addQuality, createEmptyState()),
    ["approaches", "requirements"],
  );
  const sg = buildSubgraph(index, s);
  assert.equal(sg.singlesHidden, 2); // quarantine and zone-failure
  assert.ok(
    toMarkdown(s, sg, { sections: ["matrix"], now: NOW }).endsWith(
      "\n1 approach with a single link omitted.\n",
    ),
  );
});

test("own requirements get their own ## section when the tree is left out", () => {
  assert.ok(md(sample()).includes("\n### Own requirements\n"));
  const out = md(sample(), { sections: ["goals", "custom"] });
  assert.ok(out.includes("\n## Own requirements\n"));
  assert.ok(!out.includes("### Own requirements"));
});

test("titles are escaped so they stay plain text", () => {
  const s = addCustom(addQuality(createEmptyState(), "availability"), {
    title: "A*B [c]",
    qualities: ["availability"],
  });
  assert.ok(md(s).includes("- **A\\*B \\[c\\]** (Availability)\n"));
});

test("hidden own requirements are still exported, marked as hidden on the map", () => {
  const s = setItemHidden(sample(), "c-1", true);
  assert.ok(
    md(s).includes("- **Checkout survives** (Availability, Resilience) _(hidden on map)_\n"),
  );
});

// The first lines of _qualities/U/usability.md and _qualities/A/accessibility.md.
const USABILITY_BODY = `

See also 

* [#usable](/tag-usable)
* [interaction-capability](/qualities/interaction-capability), a term that is used within the ISO-25010:2023 standard as a successor to "usability"


Definitions:

>Capability of a product to be used by specified users to exchange information between a user and an interactive system via the user interface to complete the intended task.
>
>[ISO-25010:2023](/references/#iso-25010-2023)
`;

const ACCESSIBILITY_BODY = `

See also [#usable](/tag-usable). 

There is a [W3C standard on this topic](https://www.w3.org/TR/WCAG21/)

Definitions:

>Capability of a product or system to be usable by people with the widest range of characteristics and capabilities to achieve a specified goal in a specified context of use.
>
>Note: The range of capabilities includes disabilities associated with age.
>
>Derived from [ISO-25010-2011](/references/#iso-25010-2011)
`;

test("bodyExcerpt prefers the quoted definition over signposts and meta sentences", () => {
  assert.equal(
    bodyExcerpt(USABILITY_BODY),
    "Capability of a product to be used by specified users to exchange information between a user and an interactive system via the user interface to complete the intended task.",
  );
  assert.equal(
    bodyExcerpt(ACCESSIBILITY_BODY),
    "Capability of a product or system to be usable by people with the widest range of characteristics and capabilities to achieve a specified goal in a specified context of use.",
  );
  // Without a quote, the first prose paragraph after the signposts is taken.
  assert.equal(
    bodyExcerpt("See also\n\n* [a](/a)\n* b\n\nAtomicity is all or nothing.\n"),
    "Atomicity is all or nothing.",
  );
});
