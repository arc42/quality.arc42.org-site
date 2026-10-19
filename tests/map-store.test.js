import { test } from "node:test";
import assert from "node:assert/strict";
import {
  STORAGE_KEY,
  createEmptyState,
  addQuality,
  removeQuality,
  hasQuality,
  setPriority,
  setQualityHidden,
  setItemHidden,
  setLayers,
  addCustom,
  removeCustom,
  normalizeState,
  createMemoryStorage,
  resolveStorage,
  loadState,
  saveState,
  setShowSingles,
  clearState,
  emitSelectionChanged,
  SELECTION_EVENT,
  mergeStates,
} from "../src/map/store.js";

test("empty state has version 1, no qualities, approaches layer on", () => {
  const s = createEmptyState(new Date("2026-10-19T10:00:00Z"));
  assert.deepEqual(s, {
    v: 1,
    qualities: [],
    custom: [],
    hiddenItems: [],
    layers: ["approaches"],
    showSingles: false,
    updated: "2026-10-19T10:00:00.000Z",
  });
});

test("addQuality is idempotent, ordered, and does not mutate", () => {
  const s0 = createEmptyState();
  const s1 = addQuality(addQuality(addQuality(s0, "availability"), "resilience"), "availability");
  assert.deepEqual(
    s1.qualities.map((q) => q.id),
    ["availability", "resilience"],
  );
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
  assert.deepEqual(
    s.custom.map((c) => [c.id, c.title]),
    [
      ["c-2", "Second"],
      ["c-3", "Third"],
    ],
  );
  assert.throws(() => addCustom(s, { title: "   " }), RangeError);
});

test("normalizeState survives garbage and wrong versions", () => {
  assert.equal(normalizeState(null).qualities.length, 0);
  assert.equal(normalizeState({ v: 99, qualities: [{ id: "x" }] }).qualities.length, 0);
  const n = normalizeState({
    v: 1,
    qualities: [{ id: "a", priority: "nope" }, { nope: 1 }],
    layers: "approaches",
    extra: 1,
  });
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
  const throwing = {
    getItem() {
      throw new Error("denied");
    },
    setItem() {
      throw new Error("denied");
    },
  };
  const storage = resolveStorage(throwing);
  storage.setItem("k", "v");
  assert.equal(storage.getItem("k"), "v");
});

test("resolveStorage returns one shared memory fallback across calls", () => {
  const throwing = {
    getItem() {
      throw new Error("denied");
    },
    setItem() {
      throw new Error("denied");
    },
  };
  assert.equal(resolveStorage(throwing), resolveStorage(throwing));
  saveState(addQuality(createEmptyState(), "availability"), resolveStorage(throwing));
  assert.ok(hasQuality(loadState(resolveStorage(throwing)), "availability"));
  clearState(resolveStorage(throwing));
});

test("loadState and saveState survive a throwing globalThis.localStorage getter", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get() {
      throw new Error("SecurityError");
    },
  });
  try {
    assert.equal(loadState().qualities.length, 0);
    saveState(addQuality(createEmptyState(), "availability"));
    assert.ok(hasQuality(loadState(), "availability"));
    clearState();
  } finally {
    if (original) Object.defineProperty(globalThis, "localStorage", original);
    else delete globalThis.localStorage;
  }
});

test("setShowSingles sets the flag without mutating", () => {
  const s0 = createEmptyState();
  const s1 = setShowSingles(s0, true);
  assert.equal(s1.showSingles, true);
  assert.equal(s0.showSingles, false);
});

test("clearState removes the stored selection", () => {
  const storage = createMemoryStorage();
  saveState(addQuality(createEmptyState(), "availability"), storage);
  clearState(storage);
  assert.equal(storage.getItem(STORAGE_KEY), null);
  assert.equal(loadState(storage).qualities.length, 0);
});

test("emitSelectionChanged dispatches the event and tolerates a missing target", () => {
  const events = [];
  const state = createEmptyState();
  emitSelectionChanged(state, { dispatchEvent: (e) => events.push(e) });
  assert.equal(events.length, 1);
  assert.equal(events[0].type, SELECTION_EVENT);
  assert.equal(events[0].detail.state, state);
  assert.doesNotThrow(() => emitSelectionChanged(state, undefined));
});

test("mergeStates keeps existing priorities, appends new qualities and renumbers custom", () => {
  let current = addQuality(addQuality(createEmptyState(), "availability"), "resilience");
  current = setPriority(current, "availability", "high");
  current = addCustom(current, { title: "Mine", qualities: ["availability"] });
  current = setItemHidden(current, "bulkheads", true);

  let incoming = addQuality(addQuality(createEmptyState(), "availability"), "security");
  incoming = setPriority(incoming, "availability", "low");
  incoming = setPriority(incoming, "security", "medium");
  incoming = addCustom(incoming, { title: "Theirs", scenario: "S", qualities: ["security"] });
  incoming = setItemHidden(incoming, "circuit-breaker", true);
  incoming = setItemHidden(incoming, "c-1", true);
  incoming = setItemHidden(incoming, "bulkheads", true);
  incoming = setLayers(incoming, ["requirements", "standards"]);

  const merged = mergeStates(current, incoming);
  assert.deepEqual(merged.qualities, [
    { id: "availability", priority: "high", hidden: false },
    { id: "resilience", priority: null, hidden: false },
    { id: "security", priority: "medium", hidden: false },
  ]);
  assert.deepEqual(
    merged.custom.map((c) => [c.id, c.title, c.scenario, c.qualities]),
    [
      ["c-1", "Mine", "", ["availability"]],
      ["c-2", "Theirs", "S", ["security"]],
    ],
  );
  // The incoming custom id c-1 became c-2; its hidden flag follows it.
  assert.deepEqual(merged.hiddenItems, ["bulkheads", "circuit-breaker", "c-2"]);
  assert.deepEqual(merged.layers, ["requirements", "standards"]);
  assert.equal(current.qualities.length, 2, "does not mutate");
});

test("mergeStates into an empty selection equals the incoming selection", () => {
  let incoming = addQuality(createEmptyState(), "availability");
  incoming = addCustom(incoming, { title: "Theirs" });
  const merged = mergeStates(createEmptyState(), incoming);
  assert.deepEqual(merged.qualities, incoming.qualities);
  assert.deepEqual(merged.custom, incoming.custom);
});

test("mergeStates drops incoming hidden custom ids that do not belong to an incoming custom", () => {
  let current = addCustom(addQuality(createEmptyState(), "availability"), { title: "Mine" });
  // A stale "c-1" in the link (its custom requirement was removed) must not hide my own c-1.
  const incoming = setItemHidden(
    setItemHidden(addQuality(createEmptyState(), "resilience"), "c-1", true),
    "bulkheads",
    true,
  );
  const merged = mergeStates(current, incoming);
  assert.deepEqual(merged.hiddenItems, ["bulkheads"]);
  assert.deepEqual(
    merged.custom.map((c) => c.id),
    ["c-1"],
  );
});
