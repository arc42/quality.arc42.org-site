import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { indexGraph, buildSubgraph } from "../src/map/subgraph.js";
import {
  createEmptyState,
  addQuality,
  setLayers,
  setShowSingles,
  setItemHidden,
  addCustom,
} from "../src/map/store.js";

const graph = JSON.parse(readFileSync(new URL("./fixtures/map-graph.json", import.meta.url)));
const index = indexGraph(graph);
const base = addQuality(
  addQuality(addQuality(createEmptyState(), "availability"), "resilience"),
  "recoverability",
);

test("approaches shared by two or more selected qualities are included, singles are counted", () => {
  const sg = buildSubgraph(index, base);
  assert.deepEqual(sg.items.map((i) => i.id).sort(), ["bulkheads", "circuit-breaker"]);
  assert.equal(sg.singlesHidden, 1); // quarantine
  assert.deepEqual(sg.items.find((i) => i.id === "circuit-breaker").linkedQualityIds, [
    "availability",
    "resilience",
  ]);
});

test("showSingles reveals single-link items", () => {
  const sg = buildSubgraph(index, setShowSingles(base, true));
  assert.ok(sg.items.some((i) => i.id === "quarantine"));
  assert.equal(sg.singlesHidden, 0);
});

test("layers gate item types; standards come from the quality's standards array; dimensions from property nodes", () => {
  const sg = buildSubgraph(
    index,
    setLayers(addQuality(base, "fault-tolerance"), ["requirements", "standards", "dimensions"]),
  );
  const types = Object.fromEntries(sg.items.map((i) => [i.id, i.type]));
  assert.equal(types["zone-failure"], "requirement");
  assert.equal(types["reliable"], "dimension");
  assert.equal(types["circuit-breaker"], undefined);
  assert.equal(
    buildSubgraph(index, setShowSingles(setLayers(base, ["standards"]), true)).items.find(
      (i) => i.id === "iso25010",
    ).type,
    "standard",
  );
});

test("sharedCount per quality and hidden items do not count", () => {
  let sg = buildSubgraph(index, base);
  assert.equal(sg.qualities.find((q) => q.id === "availability").sharedCount, 2);
  sg = buildSubgraph(index, setItemHidden(base, "bulkheads", true));
  assert.equal(sg.qualities.find((q) => q.id === "availability").sharedCount, 1);
  assert.equal(sg.items.find((i) => i.id === "bulkheads").hidden, true);
});

test("unknown ids are reported, not thrown", () => {
  const sg = buildSubgraph(index, addQuality(base, "no-such-quality"));
  assert.deepEqual(sg.unknownIds, ["no-such-quality"]);
  assert.equal(sg.qualities.length, 3);
});

test("a lonely quality still appears with sharedCount 0", () => {
  const sg = buildSubgraph(index, addQuality(createEmptyState(), "recoverability"));
  assert.equal(sg.qualities[0].sharedCount, 0);
  assert.equal(sg.items.length, 0);
});

test("custom requirements are items of type custom with custom edges, regardless of layers", () => {
  const sg = buildSubgraph(
    index,
    addCustom(setLayers(base, []), {
      title: "Checkout survives",
      qualities: ["availability", "resilience"],
    }),
  );
  const c = sg.items.find((i) => i.type === "custom");
  assert.equal(c.label, "Checkout survives");
  assert.deepEqual(
    sg.edges.filter((e) => e.kind === "custom").map((e) => e.target),
    ["availability", "resilience"],
  );
});

test("qualities carry their excerpt and their sorted dimension ids", () => {
  const sg = buildSubgraph(index, base);
  const byId = Object.fromEntries(sg.qualities.map((q) => [q.id, q]));
  assert.equal(
    byId.availability.excerpt,
    "Capability of a product to be accessible and operational when required for use.",
  );
  assert.equal(byId.resilience.excerpt, "");
  assert.deepEqual(byId.availability.dimensions, ["reliable"]);
  assert.deepEqual(byId.resilience.dimensions, ["reliable", "secure"]);
});
