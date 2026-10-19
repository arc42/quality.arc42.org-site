import { test } from "node:test";
import assert from "node:assert/strict";
import {
  STORAGE_KEY, createEmptyState, addQuality, removeQuality, hasQuality, setPriority,
  setQualityHidden, setItemHidden, setLayers, addCustom, removeCustom, normalizeState,
  createMemoryStorage, resolveStorage, loadState, saveState,
} from "../src/map/store.js";

test("empty state has version 1, no qualities, approaches layer on", () => {
  const s = createEmptyState(new Date("2026-10-19T10:00:00Z"));
  assert.deepEqual(s, { v: 1, qualities: [], custom: [], hiddenItems: [], layers: ["approaches"], showSingles: false, updated: "2026-10-19T10:00:00.000Z" });
});

test("addQuality is idempotent, ordered, and does not mutate", () => {
  const s0 = createEmptyState();
  const s1 = addQuality(addQuality(addQuality(s0, "availability"), "resilience"), "availability");
  assert.deepEqual(s1.qualities.map((q) => q.id), ["availability", "resilience"]);
  assert.equal(s1.qualities[0].priority, null);
  assert.equal(s1.qualities[0].hidden, false);
  assert.equal(s0.qualities.length, 0);
  assert.ok(hasQuality(s1, "resilience"));
});

test("removeQuality strips the id from custom requirements", () => {
  let s = addQuality(addQuality(createEmptyState(), "availability"), "resilience");
  s = addCustom(s, { title: "Checkout survives", qualities: ["availability", "resilience"] });
  s = removeQuality(s, "resilience");
  assert.deepEqual(s.custom[0].qualities, ["availability"]);
  assert.equal(hasQuality(s, "resilience"), false);
});

test("setPriority validates and applies to qualities and custom requirements", () => {
  let s = addCustom(addQuality(createEmptyState(), "availability"), { title: "X" });
  s = setPriority(s, "availability", "high");
  s = setPriority(s, "c-1", "low");
  assert.equal(s.qualities[0].priority, "high");
  assert.equal(s.custom[0].priority, "low");
  assert.throws(() => setPriority(s, "availability", "urgent"), RangeError);
  assert.equal(setPriority(s, "availability", null).qualities[0].priority, null);
});

test("hidden flags: qualities inline, other items in hiddenItems", () => {
  let s = addQuality(createEmptyState(), "availability");
  s = setQualityHidden(s, "availability", true);
  s = setItemHidden(s, "circuit-breaker", true);
  assert.equal(s.qualities[0].hidden, true);
  assert.deepEqual(s.hiddenItems, ["circuit-breaker"]);
  assert.deepEqual(setItemHidden(s, "circuit-breaker", false).hiddenItems, []);
});

test("setLayers keeps only known layers in canonical order", () => {
  const s = setLayers(createEmptyState(), ["dimensions", "bogus", "approaches"]);
  assert.deepEqual(s.layers, ["approaches", "dimensions"]);
});

test("addCustom assigns c-N ids and rejects empty titles", () => {
  let s = addCustom(createEmptyState(), { title: " First " });
  s = addCustom(s, { title: "Second" });
  s = removeCustom(s, "c-1");
  s = addCustom(s, { title: "Third" });
  assert.deepEqual(s.custom.map((c) => [c.id, c.title]), [["c-2", "Second"], ["c-3", "Third"]]);
  assert.throws(() => addCustom(s, { title: "   " }), RangeError);
});

test("normalizeState survives garbage and wrong versions", () => {
  assert.equal(normalizeState(null).qualities.length, 0);
  assert.equal(normalizeState({ v: 99, qualities: [{ id: "x" }] }).qualities.length, 0);
  const n = normalizeState({ v: 1, qualities: [{ id: "a", priority: "nope" }, { nope: 1 }], layers: "approaches", extra: 1 });
  assert.deepEqual(n.qualities, [{ id: "a", priority: null, hidden: false }]);
  assert.deepEqual(n.layers, ["approaches"]);
  assert.equal("extra" in n, false);
});

test("load/save round-trip through a storage object; corrupt JSON yields empty state", () => {
  const storage = createMemoryStorage();
  const s = saveState(addQuality(createEmptyState(), "availability"), storage);
  assert.ok(storage.getItem(STORAGE_KEY).includes('"availability"'));
  assert.deepEqual(loadState(storage).qualities, s.qualities);
  storage.setItem(STORAGE_KEY, "{not json");
  assert.equal(loadState(storage).qualities.length, 0);
});

test("resolveStorage falls back to memory when the candidate throws", () => {
  const throwing = { getItem() { throw new Error("denied"); }, setItem() { throw new Error("denied"); } };
  const storage = resolveStorage(throwing);
  storage.setItem("k", "v");
  assert.equal(storage.getItem("k"), "v");
});
