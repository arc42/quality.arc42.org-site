import { test } from "node:test";
import assert from "node:assert/strict";
import { toExportJson, fromImportJson } from "../src/map/exporters/json.js";
import {
  createEmptyState,
  addQuality,
  addCustom,
  setPriority,
  setQualityHidden,
  setItemHidden,
  setLayers,
  setShowSingles,
} from "../src/map/store.js";

function sample() {
  let s = addQuality(addQuality(createEmptyState(), "availability"), "resilience");
  s = setPriority(s, "availability", "high");
  s = setQualityHidden(s, "resilience", true);
  s = addCustom(s, {
    title: "Checkout survives",
    scenario: "No order lost",
    qualities: ["availability"],
    priority: "medium",
  });
  s = setItemHidden(s, "circuit-breaker", true);
  s = setLayers(s, ["approaches", "standards"]);
  return setShowSingles(s, true);
}

const SUBGRAPH = {
  qualities: [
    { id: "availability", label: "Availability", page: "/qualities/availability" },
    { id: "resilience", label: "Resilience", page: "/qualities/resilience" },
  ],
  items: [
    {
      id: "circuit-breaker",
      label: "Circuit Breaker",
      type: "approach",
      page: "/approaches/circuit-breaker",
      linkedQualityIds: ["availability", "resilience"],
      hidden: true,
    },
    {
      id: "c-1",
      label: "Checkout survives",
      type: "custom",
      page: "",
      linkedQualityIds: ["availability"],
      hidden: false,
    },
  ],
};

const withoutUpdated = ({ updated, ...rest }) => rest;

test("round-trips a state through export and import (ignoring `updated`)", () => {
  const state = sample();
  const text = toExportJson(state, SUBGRAPH);
  assert.deepEqual(withoutUpdated(fromImportJson(text)), withoutUpdated(state));
});

test("export carries format header, site, exported timestamp and titles", () => {
  const now = new Date("2026-10-19T12:00:00Z");
  const json = JSON.parse(toExportJson(sample(), SUBGRAPH, { now }));
  assert.equal(json.format, "q42-map");
  assert.equal(json.v, 1);
  assert.equal(json.exported, "2026-10-19T12:00:00.000Z");
  assert.equal(json.site, "https://quality.arc42.org");
  assert.deepEqual(json.qualities[0], {
    id: "availability",
    title: "Availability",
    url: "https://quality.arc42.org/qualities/availability",
    priority: "high",
    hidden: false,
  });
  assert.deepEqual(json.layers, ["approaches", "standards"]);
  assert.equal(json.showSingles, true);
});

test("items carry url = site + page; custom items get url null", () => {
  const json = JSON.parse(toExportJson(sample(), SUBGRAPH, { site: "https://example.org/q42" }));
  const cb = json.items.find((i) => i.id === "circuit-breaker");
  assert.equal(cb.url, "https://example.org/q42/approaches/circuit-breaker");
  assert.equal(cb.title, "Circuit Breaker");
  assert.deepEqual(cb.linkedQualityIds, ["availability", "resilience"]);
  assert.equal(json.items.find((i) => i.id === "c-1").url, null);
});

test("export is pretty-printed", () => {
  assert.match(toExportJson(sample(), SUBGRAPH), /\n {2}"format": "q42-map"/);
});

test("import accepts a raw MapState", () => {
  const state = sample();
  assert.deepEqual(withoutUpdated(fromImportJson(JSON.stringify(state))), withoutUpdated(state));
});

test("import normalizes untrusted content", () => {
  const text = JSON.stringify({
    format: "q42-map",
    v: 1,
    qualities: [{ id: "availability", priority: "urgent", hidden: "yes" }, { id: 7 }],
    custom: [{ id: "c-1", title: "  " }],
    hiddenItems: ["x", 3, "x"],
    layers: ["approaches", "evil"],
  });
  const s = fromImportJson(text);
  assert.deepEqual(s.qualities, [{ id: "availability", priority: null, hidden: false }]);
  assert.deepEqual(s.custom, []);
  assert.deepEqual(s.hiddenItems, ["x"]);
  assert.deepEqual(s.layers, ["approaches"]);
});

test("import rejects anything else", () => {
  for (const text of [
    "{}",
    "[]",
    "null",
    "not json",
    '{"v":2,"qualities":[]}',
    '{"format":"other"}',
  ]) {
    assert.throws(() => fromImportJson(text), { message: "Not a Q42 map file" }, text);
  }
});
