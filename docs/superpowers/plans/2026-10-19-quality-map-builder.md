# Quality Map Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a reader collect qualities while browsing Q42, open a `/map/` page that shows those qualities and what they share (approaches, requirements, standards, dimensions), rate and hide items, add own requirements, and take the result away as link, JSON, Markdown or image — with no backend.

**Architecture:** A browser-only feature inside the existing Jekyll site. A tiny selection store (`localStorage`, key `q42.map.v1`) is shared by (a) a site-bundle script that powers `+ Add` buttons and a header tray on content pages and (b) a new esbuild entry for the `/map/` page. The map page imports the already generated `assets/data/{nodes,edges,property-nodes}.json` at build time (exactly as `src/graphs/fullpage/main.js` does), derives a subgraph with pure functions, and renders it twice: an SVG force layout (D3) and an accessible table. Exports are pure functions over the same subgraph.

**Tech Stack:** Jekyll (Docker only), Node 22 ESM, esbuild, D3 (`d3-force`, `d3-selection`, `d3-drag`, `d3-zoom` from the existing `d3` dependency), lunr (already shipped), `node --test` for unit tests, Playwright in Docker for UI tests, Prettier.

**Spec:** `TODO/map/quality-map-builder.md` (design and phases). Visual reference: `TODO/map/mockup/` (four artboards, `.dc.html`, open as plain HTML) and the published canvas https://claude.ai/artifact/V9hiuaV8tMK2Rvpr3tX1sM. Origin: GitHub issue #552.

## Global Constraints

- **No local Ruby/Jekyll.** Dev server: `make dev` → http://localhost:4245. UI tests: `make test`, or one file: `docker compose --profile test run --rm playwright npx playwright test --config _docker/playwright/playwright.config.ts tests/ui/<file>.spec.ts`. Unit tests: `npm run test:unit` (added in Task 1; runs `node --test tests/`, needs no Docker and no `node_modules` as long as tests import only `src/`).
- **Restart Docker** (`make down && make dev`) after adding `_pages/` files, changing frontmatter, or adding an esbuild entry point.
- **Git staging:** stage files explicitly by name. Never `git add -A`, `git add .`, `git commit -am`, or globs.
- **Commits:** imperative mood with area prefix: `map: …`, `content: …`, `build: …`, `test: …`, `docs: …`.
- **JS:** ES modules, `.js` extension in imports, Prettier (2 spaces, semicolons, 100 cols). Map code lives in `src/map/`; nothing in `src/map/` may import from `src/graphs/` except `src/graphs/colors.js` and `src/graphs/constants.js`.
- **SCSS:** new partials go under `_sass/components/` or `_sass/pages/`, are `@import`ed from `assets/css/style.scss`, and must pass `npm run test:css`.
- **Accessibility (WCAG 2.2 AA):** every control is a real `<button>`/`<a>`/`<input>`; toggles carry `aria-pressed`; focus uses `box-shadow: var(--focus-ring)` (on violet: `var(--focus-ring-on-violet)`); the SVG map is `aria-hidden="true"` and the table in Task 6 is the accessible equivalent; the toast is a `role="status"` live region.
- **Liquid URLs:** every internal href is `{{ '/path/' | prepend: site.baseurl }}` or `| relative_url`. JS reads `window.baseurl` (already set by the default layout) or the `data-baseurl` attribute on the mounting element.
- **Node IDs:** a quality's id is the last permalink segment (`/qualities/availability` → `availability`). That is the id in `nodes.json`, in `data-map-add`, and in the store. Never use titles as keys.
- **Store is versioned:** `v: 1`. Any later shape change bumps `v` and adds a migration in `store.js`.
- **Nothing leaves the browser** except through an explicit user action (copy link, download, open GitHub issue).
- **Branch:** work on `map-feature` (already created from `main` in this worktree). Do not create further branches.

## Review Focus

Conditions the spec implies but no happy-path test covers. Each line names the task whose tests pin it.

1. **Stale ids in a stored or shared selection** (a quality renamed or deleted since the link was made): the map must drop unknown ids silently and say "1 quality in your link no longer exists" rather than crash. → Task 3 (`buildSubgraph` ignores unknown ids and reports them), Task 8 (import banner).
2. **Corrupt or foreign `localStorage` content** (`q42.map.v1` is not JSON, or has `v: 99`): `loadState` returns a fresh empty state, never throws. → Task 1.
3. **Private window / storage disabled** (`localStorage` access throws): Add buttons still toggle for the page lifetime; the tray shows the in-memory count. → Task 1 (`createMemoryStorage` fallback), Task 4.
4. **Hash longer than browsers tolerate** (someone selects 60 qualities and 10 custom requirements): `encodeShare` must stay under 8 000 characters for 60 qualities; the UI shows a warning above that instead of a broken link. → Task 2 (length assertion), Task 8.
5. **A quality selected that shares nothing** with the others: the map must still draw it, the summary must say "0 approaches serve two or more", and the "show singles" escape hatch must reveal its single-link neighbours. → Task 3, Task 6.

---

## Phase 1 — collect and map

### Task 1: Selection store

**Files:**
- Create: `src/map/store.js`
- Create: `tests/map-store.test.js`
- Modify: `package.json` (add script `"test:unit": "node --test tests/"`)

**Interfaces:**
- Produces:
  ```js
  export const STORAGE_KEY = "q42.map.v1";
  export const STORE_VERSION = 1;
  export const PRIORITIES = Object.freeze(["low", "medium", "high"]);
  export const DEFAULT_LAYERS = Object.freeze(["approaches"]);
  export const ALL_LAYERS = Object.freeze(["approaches", "requirements", "standards", "dimensions"]);

  /** @typedef {{ id: string, priority: "low"|"medium"|"high"|null, hidden: boolean }} SelectedQuality */
  /** @typedef {{ id: string, title: string, scenario: string, qualities: string[], priority: "low"|"medium"|"high"|null }} CustomRequirement */
  /** @typedef {{ v: 1, qualities: SelectedQuality[], custom: CustomRequirement[], hiddenItems: string[], layers: string[], showSingles: boolean, updated: string }} MapState */

  export function createEmptyState(now = new Date()) → MapState
  export function addQuality(state, id) → MapState          // no-op if present; appends in insertion order
  export function removeQuality(state, id) → MapState       // also strips id from every custom.qualities
  export function hasQuality(state, id) → boolean
  export function setPriority(state, id, priority) → MapState   // id of a quality or a custom requirement; priority ∈ PRIORITIES or null; throws RangeError otherwise
  export function setQualityHidden(state, id, hidden) → MapState
  export function setItemHidden(state, itemId, hidden) → MapState   // non-quality nodes → hiddenItems
  export function setLayers(state, layers) → MapState       // keeps only ALL_LAYERS members, preserves ALL_LAYERS order
  export function setShowSingles(state, flag) → MapState
  export function addCustom(state, { title, scenario = "", qualities = [], priority = null }) → MapState  // id = "c-" + (max existing n + 1); title trimmed, must be non-empty (throws RangeError)
  export function removeCustom(state, id) → MapState
  export function normalizeState(raw) → MapState            // any input → valid MapState; unknown keys dropped; wrong `v` → empty state
  export function createMemoryStorage() → { getItem(k), setItem(k,v), removeItem(k) }
  export function resolveStorage(candidate = globalThis.localStorage) → Storage-like  // returns candidate if getItem/setItem work in a try/catch probe, else createMemoryStorage()
  export function loadState(storage = resolveStorage()) → MapState   // never throws
  export function saveState(state, storage = resolveStorage()) → MapState  // sets `updated` to now ISO, writes JSON, returns the saved state
  export function clearState(storage = resolveStorage()) → void
  export const SELECTION_EVENT = "q42:selection-changed";
  export function emitSelectionChanged(state, target = globalThis.document) → void  // dispatches CustomEvent(SELECTION_EVENT, { detail: { state } }) if target exists
  ```
  Every mutator is pure: returns a new object, never mutates its input. `saveState` is the only function that touches storage besides `loadState`/`clearState`.

- [ ] **Step 1: Write the failing tests** in `tests/map-store.test.js`

```js
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test tests/map-store.test.js`
Expected: FAIL, `Cannot find module '.../src/map/store.js'`

- [ ] **Step 3: Implement `src/map/store.js`** with the signatures above. `normalizeState` is the single validation path; `loadState` = `try { JSON.parse } catch → null` then `normalizeState`. `resolveStorage` probes with `setItem("q42.map.probe","1"); removeItem(...)` inside try/catch.

- [ ] **Step 4: Add the script** `"test:unit": "node --test tests/"` to `package.json` `scripts`, then run `npm run test:unit`
Expected: PASS, 13 tests (3 existing + 10 new)

- [ ] **Step 5: Commit**

```bash
git add src/map/store.js tests/map-store.test.js package.json
git commit -m "map: add versioned selection store with storage fallback"
```

---

### Task 2: Share-link codec

**Files:**
- Create: `src/map/share.js`
- Create: `tests/map-share.test.js`

**Interfaces:**
- Consumes: `normalizeState`, `createEmptyState`, `addQuality`, `addCustom` from Task 1.
- Produces:
  ```js
  export const SHARE_PARAM = "s";
  export const SHARE_MAX_LENGTH = 8000;
  export async function encodeShare(state) → string            // "v1." + base64url(deflate-raw(JSON of compact form))
  export async function decodeShare(fragmentOrUrl) → MapState|null  // accepts "#s=…", "s=…", a full URL, or the bare token; null on any failure
  export function shareUrl(state, baseHref) → Promise<string>  // baseHref + "#s=" + token
  ```
  Compact form (to keep links short): `{ v, q: [[id, priorityInitial|0, hidden?1:0]], c: [[title, scenario, [ids], priorityInitial|0]], h: hiddenItems, l: layerInitials, x: showSingles?1:0 }`. Decode maps back and passes through `normalizeState`. Uses the platform `CompressionStream`/`DecompressionStream("deflate-raw")` (Node ≥ 20 and all evergreen browsers) — no new dependency.

- [ ] **Step 1: Write the failing tests** in `tests/map-share.test.js`

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { encodeShare, decodeShare, shareUrl, SHARE_MAX_LENGTH } from "../src/map/share.js";
import { createEmptyState, addQuality, addCustom, setPriority, setLayers } from "../src/map/store.js";

function sample() {
  let s = setLayers(addQuality(addQuality(createEmptyState(), "availability"), "resilience"), ["approaches", "dimensions"]);
  s = setPriority(s, "availability", "high");
  return addCustom(s, { title: "Checkout survives", scenario: "No order lost", qualities: ["availability"], priority: "medium" });
}

test("round-trips a state (ignoring `updated`)", async () => {
  const s = sample();
  const back = await decodeShare(await encodeShare(s));
  const strip = ({ updated, ...rest }) => rest;
  assert.deepEqual(strip(back), strip(s));
});

test("accepts a fragment, a query-like string and a full URL", async () => {
  const token = await encodeShare(sample());
  for (const input of [`#s=${token}`, `s=${token}`, `https://quality.arc42.org/map/#s=${token}`]) {
    assert.equal((await decodeShare(input)).qualities.length, 2);
  }
});

test("returns null for garbage", async () => {
  assert.equal(await decodeShare("#s=v1.not-base64!!"), null);
  assert.equal(await decodeShare(""), null);
  assert.equal(await decodeShare("#s=v9.AAAA"), null);
});

test("60 qualities with priorities stay under the length budget", async () => {
  let s = createEmptyState();
  for (let i = 0; i < 60; i++) s = setPriority(addQuality(s, `quality-number-${i}-with-long-slug`), `quality-number-${i}-with-long-slug`, "high");
  const token = await encodeShare(s);
  assert.ok(token.length < SHARE_MAX_LENGTH, `token length ${token.length}`);
});

test("shareUrl appends the fragment", async () => {
  const url = await shareUrl(sample(), "https://quality.arc42.org/map/");
  assert.match(url, /^https:\/\/quality\.arc42\.org\/map\/#s=v1\./);
});
```

- [ ] **Step 2: Run** `node --test tests/map-share.test.js` → FAIL (module missing)
- [ ] **Step 3: Implement `src/map/share.js`.** Helpers: `toCompact(state)`, `fromCompact(obj)`, `deflate(string) → Uint8Array`, `inflate(bytes) → string`, `b64urlEncode/Decode`. Priority initials: `l|m|h`, `0` for null. Layer initials: `a|r|s|d`.
- [ ] **Step 4: Run** `npm run test:unit` → PASS
- [ ] **Step 5: Commit**

```bash
git add src/map/share.js tests/map-share.test.js
git commit -m "map: add compressed share-link codec"
```

---

### Task 3: Subgraph builder

**Files:**
- Create: `src/map/subgraph.js`
- Create: `tests/map-subgraph.test.js`
- Create: `tests/fixtures/map-graph.json` (hand-written mini graph, shape identical to `assets/data/*.json`)

**Interfaces:**
- Consumes: `MapState` from Task 1; `NODE_TYPES` from `src/graphs/constants.js`.
- Produces:
  ```js
  /** @typedef {{ id, label, page, qualityType, priority, hidden, sharedCount: number, custom?: true, scenario?: string }} MapQuality */
  /** @typedef {{ id, label, page, type: "approach"|"requirement"|"standard"|"dimension"|"custom", linkedQualityIds: string[], hidden: boolean }} MapItem */
  /** @typedef {{ source: string, target: string, kind: "link"|"custom" }} MapEdge */
  /** @typedef {{ qualities: MapQuality[], items: MapItem[], edges: MapEdge[], unknownIds: string[], singlesHidden: number }} Subgraph */

  export function indexGraph({ nodes, edges, propertyNodes }) → GraphIndex
      // GraphIndex = { byId: Map<id, node>, neighbours: Map<id, Set<id>> } — edges treated as undirected;
      // propertyNodes become nodes with qualityType "dimension"; a quality node's `standards` array adds neighbour links to standard ids (case-insensitive match on node id)
  export const LAYER_TO_TYPE = Object.freeze({ approaches: "approach", requirements: "requirement", standards: "standard", dimensions: "dimension" });
  export function buildSubgraph(index, state) → Subgraph
  ```
  Rules: selected qualities are always included (hidden ones with `hidden: true`, still counted); an item appears if its type's layer is on and `linkedQualityIds.length >= 2`, or `>= 1` when `state.showSingles`; `sharedCount` of a quality = number of included (non-hidden) items linked to it; `singlesHidden` = count of items excluded only by the ≥2 rule; custom requirements become items of type `"custom"` linked by their `qualities` list, always shown regardless of layers, with edges of kind `"custom"`; ids not in the index land in `unknownIds` and are otherwise ignored; `hiddenItems` marks items `hidden: true` (still in `items`, still counted for `sharedCount`? — **no**: hidden items do not count toward `sharedCount`).

- [ ] **Step 1: Write the fixture** `tests/fixtures/map-graph.json`

Nodes: qualities `availability`, `resilience`, `fault-tolerance`, `recoverability` (`availability` has `"standards": ["ISO25010"]`); approaches `circuit-breaker` (→ availability, resilience, fault-tolerance), `bulkheads` (→ availability, resilience), `quarantine` (→ recoverability only); requirement `zone-failure` (→ availability, fault-tolerance); standard `iso25010`. Property nodes: `reliable`, `secure`. Edges: each quality → `reliable`; `resilience` → `secure`; the approach/requirement edges above; `availability` → `resilience` (related). All ids lowercase; standard edge comes only via the `standards` array to exercise that path.

- [ ] **Step 2: Write the failing tests** in `tests/map-subgraph.test.js`

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { indexGraph, buildSubgraph } from "../src/map/subgraph.js";
import { createEmptyState, addQuality, setLayers, setShowSingles, setItemHidden, addCustom } from "../src/map/store.js";

const graph = JSON.parse(readFileSync(new URL("./fixtures/map-graph.json", import.meta.url)));
const index = indexGraph(graph);
const base = addQuality(addQuality(addQuality(createEmptyState(), "availability"), "resilience"), "recoverability");

test("approaches shared by two or more selected qualities are included, singles are counted", () => {
  const sg = buildSubgraph(index, base);
  assert.deepEqual(sg.items.map((i) => i.id).sort(), ["bulkheads", "circuit-breaker"]);
  assert.equal(sg.singlesHidden, 1); // quarantine
  assert.deepEqual(sg.items.find((i) => i.id === "circuit-breaker").linkedQualityIds, ["availability", "resilience"]);
});

test("showSingles reveals single-link items", () => {
  const sg = buildSubgraph(index, setShowSingles(base, true));
  assert.ok(sg.items.some((i) => i.id === "quarantine"));
  assert.equal(sg.singlesHidden, 0);
});

test("layers gate item types; standards come from the quality's standards array; dimensions from property nodes", () => {
  const sg = buildSubgraph(index, setLayers(addQuality(base, "fault-tolerance"), ["requirements", "standards", "dimensions"]));
  const types = Object.fromEntries(sg.items.map((i) => [i.id, i.type]));
  assert.equal(types["zone-failure"], "requirement");
  assert.equal(types["reliable"], "dimension");
  assert.equal(types["circuit-breaker"], undefined);
  assert.equal(buildSubgraph(index, setShowSingles(setLayers(base, ["standards"]), true)).items.find((i) => i.id === "iso25010").type, "standard");
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
  const sg = buildSubgraph(index, addCustom(setLayers(base, []), { title: "Checkout survives", qualities: ["availability", "resilience"] }));
  const c = sg.items.find((i) => i.type === "custom");
  assert.equal(c.label, "Checkout survives");
  assert.deepEqual(sg.edges.filter((e) => e.kind === "custom").map((e) => e.target), ["availability", "resilience"]);
});
```

- [ ] **Step 3: Run** `node --test tests/map-subgraph.test.js` → FAIL
- [ ] **Step 4: Implement `src/map/subgraph.js`.** Quality order in the result = selection order. Items sorted by `linkedQualityIds.length` desc, then label. Edges: one `{source: item.id, target: quality.id}` per link.
- [ ] **Step 5: Run** `npm run test:unit` → PASS
- [ ] **Step 6: Commit**

```bash
git add src/map/subgraph.js tests/map-subgraph.test.js tests/fixtures/map-graph.json
git commit -m "map: derive the selection subgraph from graph data"
```

---

### Task 4: Add buttons and header tray on content pages

**Files:**
- Create: `src/scripts/site/selection.js`
- Modify: `src/scripts/site/main.js` (call `initSelection()`)
- Modify: `_includes/site-header.html` (tray inside `.site-actions`, before the search form)
- Modify: `_sass/_header.scss` (`.site-actions` grid gains a third auto column when the tray is visible)
- Create: `_sass/components/_map-selection.scss` (tray, `.map-add` button states, `.map-toast`)
- Modify: `assets/css/style.scss` (import)
- Modify: `_includes/section-hero.liquid` (optional `actions_html` param rendered as `<div class="section-hero__actions">` right after the H1)
- Modify: `_includes/quality-header.liquid` (pass the Add button as `actions_html`)
- Modify: `src/explorers/qualities.js` (`renderItem`: canonical items get a `.map-add` button)
- Modify: `_includes/one-quality.liquid` (Add button per `<li>`)
- Create: `tests/ui/map-selection.spec.ts`

**Interfaces:**
- Consumes: Task 1 store (`loadState`, `saveState`, `addQuality`, `removeQuality`, `hasQuality`, `emitSelectionChanged`, `SELECTION_EVENT`).
- Produces (DOM contract used by Task 5+):
  - Add button: `<button type="button" class="map-add" data-map-add="<quality-id>" data-map-title="<title>" aria-pressed="false">+ Add</button>`; pressed state shows `✓ Added`. Text is set by JS from `data-map-title`-independent constants `ADD_LABEL = "+ Add"`, `ADDED_LABEL = "✓ Added"`; the detail-page variant uses `data-map-add-variant="hero"` and labels `"+ Add to selection"` / `"✓ In selection"`.
  - Tray: `<a class="map-tray" href="{{ '/map/' | prepend: site.baseurl }}" data-map-tray hidden>Selection <span class="map-tray__count" data-map-tray-count>0</span><span class="map-tray__cta">Open map</span></a>`. `hidden` is removed when count > 0.
  - Toast: created lazily by JS as `<div class="map-toast" role="status" aria-live="polite">` appended to `document.body`, with an Undo `<button>`; auto-hides after 6 s.
  - `export function initSelection({ document = globalThis.document } = {})` — idempotent; safe on pages without buttons.

- [ ] **Step 1: Write the failing UI test** `tests/ui/map-selection.spec.ts`

```ts
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.removeItem("q42.map.v1"));
});

test("tray is hidden until a quality is added from the index", async ({ page }) => {
  await page.goto("/qualities/");
  const tray = page.locator("[data-map-tray]");
  await expect(tray).toBeHidden();
  const add = page.locator('[data-map-add="availability"]');
  await add.click();
  await expect(add).toHaveAttribute("aria-pressed", "true");
  await expect(add).toHaveText(/Added/);
  await expect(tray).toBeVisible();
  await expect(page.locator("[data-map-tray-count]")).toHaveText("1");
  await expect(page.getByRole("status")).toContainText("Availability added");
});

test("undo in the toast removes the quality again", async ({ page }) => {
  await page.goto("/qualities/");
  await page.locator('[data-map-add="availability"]').click();
  await page.getByRole("status").getByRole("button", { name: "Undo" }).click();
  await expect(page.locator('[data-map-add="availability"]')).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("[data-map-tray]")).toBeHidden();
});

test("selection persists across pages and the detail hero button reflects it", async ({ page }) => {
  await page.goto("/qualities/");
  await page.locator('[data-map-add="availability"]').click();
  await page.goto("/qualities/availability");
  const hero = page.locator('.section-hero [data-map-add="availability"]');
  await expect(hero).toHaveAttribute("aria-pressed", "true");
  await hero.click();
  await expect(hero).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("[data-map-tray]")).toBeHidden();
});

test("tag pages carry add buttons too", async ({ page }) => {
  await page.goto("/tag-reliable/");
  await expect(page.locator('[data-map-add="availability"]')).toBeVisible();
});

test("add buttons are keyboard operable and announce state", async ({ page }) => {
  await page.goto("/qualities/availability");
  const hero = page.locator('.section-hero [data-map-add="availability"]');
  await hero.focus();
  await page.keyboard.press("Enter");
  await expect(hero).toHaveAttribute("aria-pressed", "true");
});
```

- [ ] **Step 2: Run** `docker compose --profile test run --rm playwright npx playwright test --config _docker/playwright/playwright.config.ts tests/ui/map-selection.spec.ts` (site must be up via `make dev`) → FAIL (no `[data-map-add]`)
- [ ] **Step 3: Implement `src/scripts/site/selection.js`.** On init: `state = loadState()`; sync every `[data-map-add]` (pressed + label); sync tray; delegate `click` on `document` for `[data-map-add]`: toggle via `addQuality`/`removeQuality`, `saveState`, `emitSelectionChanged`, re-sync, show toast `"<title> added" / "<title> removed"` with `"<n> qualities in your selection"` and Undo. Listen to `SELECTION_EVENT` and to `storage` events (other tabs) to re-sync.
- [ ] **Step 4: Wire the templates.** `section-hero.liquid`: after the `<h1>`, `{% if include.actions_html and include.actions_html != "" %}<div class="section-hero__actions">{{ include.actions_html }}</div>{% endif %}`. `quality-header.liquid`: compute `canonical_slug` the same way `_layouts/qualities.html` does, capture the hero button, pass `actions_html`; skip the button when `page.alias_of` is set. `one-quality.liquid`: button after the link, id = `item.permalink | split: "/" | last`. `qualities.js` `renderItem`: for `item.kind === "canonical"`, append `<button class="map-add" data-map-add=item.id data-map-title=item.title>`; alias items get none.
- [ ] **Step 5: Styles.** `_map-selection.scss`: `.map-add` (outline violet, 44 px min-height, `[aria-pressed="true"]` filled violet/white), `.map-tray` (white pill on the violet header, count badge, teal CTA chip, `:focus-visible { box-shadow: var(--focus-ring-on-violet) }`), `.map-toast` (fixed bottom-right, ink background, `prefers-reduced-motion` respected), `.section-hero__actions` (right-aligned on ≥800 px, stacked below on narrow). Header: `.site-actions { grid-template-columns: auto minmax(0, clamp(9rem, 16vw, 12rem)) 2.35rem; }` and the same adjustment in the ≤`$nav-compact-width` block so the tray collapses to the badge only (`.map-tray__cta { display: none }`) on narrow screens.
- [ ] **Step 6: Run** `npm run test:css` → PASS; restart the stack (`make down && make dev`); run the spec from Step 2 → PASS; run `tests/ui/characteristics.spec.ts` and `tests/ui/wcag.spec.ts` → still PASS.
- [ ] **Step 7: Commit**

```bash
git add src/scripts/site/selection.js src/scripts/site/main.js _includes/site-header.html _includes/section-hero.liquid _includes/quality-header.liquid _includes/one-quality.liquid src/explorers/qualities.js _sass/_header.scss _sass/components/_map-selection.scss assets/css/style.scss tests/ui/map-selection.spec.ts
git commit -m "map: add selection buttons, header tray and toast on quality pages"
```

---

### Task 5: Map page skeleton, layers, summary and the list view

The page is useful before any force layout exists: summary line, layer toggles, "show singles", and the table.

**Files:**
- Create: `_pages/65-quality-map.md` (permalink `/map/`, layout `graph`, `order: 65`, `hide: true`)
- Create: `src/map/main.js` (entry)
- Create: `src/map/MapPage.js` (controller: owns state, re-renders views on change)
- Create: `src/map/ListView.js`
- Create: `src/map/format.js` (pure text helpers)
- Modify: `src/scripts/build.js` (entry `"map/main": "src/map/main.js"`)
- Modify: `.gitignore` (`assets/js/map/*.js`)
- Modify: `_data/navigation.yml` (secondary: `- label: Map`, `url: /map/`)
- Create: `_sass/pages/_map.scss`; Modify: `assets/css/style.scss`
- Create: `tests/map-format.test.js`, `tests/ui/map-page.spec.ts`

**Interfaces:**
- Consumes: Tasks 1–3.
- Produces:
  - DOM ids on `/map/`: `#map-page[data-baseurl]`, `#map-summary`, `#map-layers` (one `<button data-layer="approaches|requirements|standards|dimensions" aria-pressed>` each), `#map-singles` (`<button aria-pressed>`), `#map-hidden-toggle` + `#map-hidden-list`, `#map-canvas` (filled by Task 6), `#map-panel` (Task 6), `#map-table`, `#map-empty` (shown when no qualities; links to `/qualities/`), `#map-notice` (unknown-id and import messages, `role="status"`), `#map-export` (Task 8).
  - `format.js`:
    ```js
    export function summaryText(subgraph, state) → string
      // parts joined by " · ": "<n> qualit(y|ies)"; per layer that is on and has items — approaches: "<k> approaches serve two or more of them", other types: "<k> <type>[s] shared"; then " <c> own requirement[s]" when custom.length; a single quality with no items → "1 quality · nothing shared yet"
    export function servesText(item, total) → string   // "3 of 4"
    export function priorityLabel(priority) → string     // "not rated" | "low" | "medium" | "high"
    ```
  - `ListView`: `new ListView(tableEl).render(subgraph, state)` — `<table>` with `<caption>`, a column per quality (`<th scope="col">` with priority label), a row per item (`<th scope="row">` linking to the item's page), `●` cells with `<span class="sr-only">linked</span>`, hidden items get a "hidden" badge. Items grouped by type with a `<tbody>` per type and a group heading row.
  - `MapPage`: `new MapPage(rootEl, { index, initialState }).mount()`; exposes `update(fn)` where `fn(state) → state`, which saves, emits, rebuilds the subgraph and re-renders all views.

- [ ] **Step 1: Unit test `format.js`** in `tests/map-format.test.js`

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { summaryText, servesText, priorityLabel } from "../src/map/format.js";

test("summary wording", () => {
  const sg = (n, items) => ({ qualities: Array(n).fill({}), items, edges: [], unknownIds: [], singlesHidden: 0 });
  const st = (layers, custom = []) => ({ layers, custom });
  assert.equal(summaryText(sg(4, [{ type: "approach" }, { type: "approach" }]), st(["approaches"])), "4 qualities · 2 approaches serve two or more of them");
  assert.equal(summaryText(sg(1, []), st(["approaches"])), "1 quality · nothing shared yet");
  assert.equal(summaryText(sg(2, [{ type: "requirement" }]), st(["requirements"], [{}])), "2 qualities · 1 requirement shared · 1 own requirement");
});

test("serves and priority labels", () => {
  assert.equal(servesText({ linkedQualityIds: ["a", "b", "c"] }, 4), "3 of 4");
  assert.equal(priorityLabel(null), "not rated");
  assert.equal(priorityLabel("high"), "high");
});
```

- [ ] **Step 2: Write the failing UI test** `tests/ui/map-page.spec.ts`

```ts
import { expect, test } from "@playwright/test";

const SEED = { v: 1, qualities: [{ id: "availability", priority: null, hidden: false }, { id: "resilience", priority: null, hidden: false }, { id: "fault-tolerance", priority: null, hidden: false }], custom: [], hiddenItems: [], layers: ["approaches"], showSingles: false, updated: "2026-10-19T00:00:00.000Z" };

test("empty selection shows the empty state and a link to qualities", async ({ page }) => {
  await page.addInitScript(() => localStorage.removeItem("q42.map.v1"));
  await page.goto("/map/");
  await expect(page.locator("#map-empty")).toBeVisible();
  await expect(page.locator("#map-empty a[href$='/qualities/']")).toBeVisible();
});

test("seeded selection renders summary, layer toggles and the table", async ({ page }) => {
  await page.addInitScript((seed) => localStorage.setItem("q42.map.v1", JSON.stringify(seed)), SEED);
  await page.goto("/map/");
  await expect(page.locator("#map-summary")).toContainText("3 qualities");
  const table = page.locator("#map-table table");
  await expect(table.locator("thead th")).toContainText(["Availability", "Resilience", "Fault tolerance"]);
  await expect(table.locator("tbody th[scope=row]").first()).toBeVisible();
  const req = page.locator('#map-layers [data-layer="requirements"]');
  await expect(req).toHaveAttribute("aria-pressed", "false");
  await req.click();
  await expect(req).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#map-summary")).toContainText("requirement");
  await page.reload();
  await expect(page.locator('#map-layers [data-layer="requirements"]')).toHaveAttribute("aria-pressed", "true");
});

test("show singles toggle changes the row count", async ({ page }) => {
  await page.addInitScript((seed) => localStorage.setItem("q42.map.v1", JSON.stringify(seed)), SEED);
  await page.goto("/map/");
  const rows = page.locator("#map-table tbody tr");
  const before = await rows.count();
  await page.locator("#map-singles").click();
  await expect.poll(() => rows.count()).toBeGreaterThan(before);
});
```

- [ ] **Step 3: Run** both tests → FAIL
- [ ] **Step 4: Build the page.** `_pages/65-quality-map.md`: `<header class="graph-intro">` with H1 "Your map" and `<p id="map-summary">`; the controls row; `<div class="map-layout">` holding `#map-canvas` (empty, `aria-hidden="true"`) and `#map-panel`; `#map-table`; `<noscript>` explaining the map needs JavaScript and linking to `/qualities/`; `<script defer src="{{ '/assets/js/map/main.js' | prepend: site.baseurl }}">`. `main.js`: import the three JSON files, `indexGraph`, `loadState`, `new MapPage(document.getElementById("map-page"), {...}).mount()`. `MapPage.mount()` renders once, binds layer/singles/hidden-list clicks, listens to `SELECTION_EVENT` and `storage`. Show `#map-notice` "N qualities in your selection no longer exist on Q42 and were ignored" when `unknownIds.length`.
- [ ] **Step 5: Styles** `_sass/pages/_map.scss`: controls row (pill buttons reuse `.map-add` tokens, per-layer colours from the `--approaches-*`, `--reqs-*`, `--standard-*`, `--dimension-*` variables), `.map-layout` = flex, wrap, `#map-canvas` `flex: 999 1 560px; min-height: 420px`, `#map-panel` `flex: 1 1 300px; max-width: 400px`, table with `overflow-x: auto` wrapper, sticky first column on ≥800 px.
- [ ] **Step 6: Run** `npm run test:unit`, `npm run test:css`, restart the stack, run `tests/ui/map-page.spec.ts` → PASS
- [ ] **Step 7: Commit**

```bash
git add _pages/65-quality-map.md src/map/main.js src/map/MapPage.js src/map/ListView.js src/map/format.js src/scripts/build.js .gitignore _data/navigation.yml _sass/pages/_map.scss assets/css/style.scss tests/map-format.test.js tests/ui/map-page.spec.ts
git commit -m "map: add /map/ page with layers, summary and accessible list view"
```

---

### Task 6: SVG map view and side panel

**Files:**
- Create: `src/map/MapView.js` (D3 force layout into an `<svg>`)
- Create: `src/map/Panel.js`
- Create: `src/map/nodeStyle.js` (pure: size/fill per type and priority)
- Create: `tests/map-node-style.test.js`
- Modify: `src/map/MapPage.js` (mount both), `_sass/pages/_map.scss`
- Modify: `tests/ui/map-page.spec.ts` (add canvas and panel tests)

**Interfaces:**
- Consumes: `Subgraph`, `MapState`; `NODE_COLORS` from `src/graphs/colors.js`.
- Produces:
  ```js
  // nodeStyle.js
  export const QUALITY_RADIUS = Object.freeze({ none: 34, low: 40, medium: 48, high: 58 });
  export const QUALITY_FILL = Object.freeze({ none: "#ffffff", low: "#e6f7fe", medium: "#a6e4fb", high: "#00b8f5" });
  export function qualityStyle(priority) → { r, fill, stroke: "#00b8f5", text: "#003366" }
  export function itemStyle(type) → { fill, stroke, text, dashed: boolean }   // approach #d9f7d3/#1b5e20, requirement #ffe0e0/#8b0000, standard #ffefc8/#2c3e50, dimension #1a3a5c/#1a3a5c text #ffffff, custom = requirement colours with dashed:true
  export function edgeStyle(edge, { highlighted }) → { stroke, width, dash }   // link: #d8d0d6 / 1.5 ; highlighted: item's stroke / 3 ; custom: #8b0000 dashed "6 5"
  ```
  `MapView`: `new MapView(svgContainerEl, { onSelect(id|null) }).render(subgraph, state)`; keeps node positions across re-renders (keyed join on id), restarts the simulation with low alpha on changes, `d3-zoom` pan/zoom, `d3-drag` on nodes, click → `onSelect`. Nodes are `<g class="map-node" data-id data-type>`; the `<svg>` is `aria-hidden="true"` (the table is the accessible twin) and sits in `#map-canvas`. Quality nodes show label + `"<n> shared"` sub-label; item pills show label + count badge. Hidden items are not drawn. `focusNode(id)` highlights the node and its edges.
  `Panel`: `new Panel(panelEl, { onHide(id, hidden), onOpen(id) }).render(selection: { kind: "quality"|"item", node, subgraph } | null)` — shows type badge, title, "Supports n of m qualities" with the ✓/– list (items) or "n shared items" (qualities), **Open on Q42** link (`node.page`, prefixed with baseurl), **Hide from map / Show on map** button. Priority controls come in Task 9; leave a `<div data-panel-priority>` placeholder.

- [ ] **Step 1: Unit test `nodeStyle.js`**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { qualityStyle, itemStyle, edgeStyle, QUALITY_RADIUS } from "../src/map/nodeStyle.js";

test("quality size and fill follow priority", () => {
  assert.equal(qualityStyle(null).r, QUALITY_RADIUS.none);
  assert.equal(qualityStyle("high").r, QUALITY_RADIUS.high);
  assert.equal(qualityStyle(null).fill, "#ffffff");
  assert.equal(qualityStyle("high").fill, "#00b8f5");
});

test("item styles per type, custom is dashed", () => {
  assert.equal(itemStyle("approach").stroke, "#1b5e20");
  assert.equal(itemStyle("custom").dashed, true);
  assert.equal(itemStyle("dimension").text, "#ffffff");
});

test("edge style", () => {
  assert.equal(edgeStyle({ kind: "link" }, { highlighted: false }).width, 1.5);
  assert.equal(edgeStyle({ kind: "custom" }, { highlighted: false }).dash, "6 5");
});
```

- [ ] **Step 2: Extend the UI test** `tests/ui/map-page.spec.ts`

```ts
test("canvas draws one node per quality and shared item; clicking an item opens the panel", async ({ page }) => {
  await page.addInitScript((seed) => localStorage.setItem("q42.map.v1", JSON.stringify(seed)), SEED);
  await page.goto("/map/");
  const svg = page.locator("#map-canvas svg");
  await expect(svg).toHaveAttribute("aria-hidden", "true");
  await expect(svg.locator('.map-node[data-type="quality"]')).toHaveCount(3);
  const item = svg.locator('.map-node[data-type="approach"]').first();
  const id = await item.getAttribute("data-id");
  await item.click();
  const panel = page.locator("#map-panel");
  await expect(panel.getByRole("heading", { level: 2 })).toBeVisible();
  await expect(panel.getByRole("link", { name: /Open on Q42/ })).toHaveAttribute("href", new RegExp(`/approaches/${id}$`));
  await panel.getByRole("button", { name: /Hide from map/ }).click();
  await expect(svg.locator(`.map-node[data-id="${id}"]`)).toHaveCount(0);
  await expect(page.locator("#map-hidden-toggle")).toContainText("1");
  await page.locator("#map-hidden-toggle").click();
  await page.locator("#map-hidden-list").getByRole("button", { name: /Restore/ }).first().click();
  await expect(svg.locator(`.map-node[data-id="${id}"]`)).toHaveCount(1);
});
```

- [ ] **Step 3: Run** both → FAIL
- [ ] **Step 4: Implement** `nodeStyle.js`, `MapView.js` (forces: `forceLink` distance 140 for quality–item links, `forceManyBody` strength −420, `forceCollide` radius = node radius + 18, `forceCenter`; cap at 300 ticks; respect `prefers-reduced-motion` by rendering the settled layout without animation), `Panel.js`, and the hidden list (`#map-hidden-list` rows: badge, label, Restore button; "Restore all" when > 1). `MapPage` wires `onSelect` → `Panel.render`, `onHide` → `update(setItemHidden / setQualityHidden)`.
- [ ] **Step 5: Run** unit + UI tests → PASS; `tests/ui/wcag.spec.ts` on `/map/` → no violations (add `/map/` to its page list if the spec enumerates pages).
- [ ] **Step 6: Commit**

```bash
git add src/map/MapView.js src/map/Panel.js src/map/nodeStyle.js src/map/MapPage.js _sass/pages/_map.scss tests/map-node-style.test.js tests/ui/map-page.spec.ts
git commit -m "map: render the selection as an SVG force layout with a detail panel"
```

---

### Task 7: Legend, "how to read", and the selected quality's node in the header tray link

Small polish task that closes Phase 1's visual contract.

**Files:**
- Modify: `_pages/65-quality-map.md` (legend block `#map-legend` in the canvas corner, text per the mockup), `_sass/pages/_map.scss`
- Modify: `src/map/MapView.js` (the "N approaches with one link are hidden · Show" chip bound to `singlesHidden`, calls `update(setShowSingles)`)
- Modify: `tests/ui/map-page.spec.ts`

- [ ] **Step 1: Extend the UI test**: with `SEED`, `#map-legend` is visible and contains "my priority"; the singles chip text matches `/\d+ (approaches|items) with one link/` and clicking it sets `#map-singles` to pressed.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement.** **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `map: add legend and single-link chip`

---

### Task 8: Share link, JSON export and import

**Files:**
- Create: `src/map/exporters/json.js`
- Create: `src/map/ExportPanel.js`
- Create: `src/map/download.js` (`downloadText(filename, text, mime)` via Blob + object URL)
- Modify: `src/map/MapPage.js` (open the export panel; read `#s=` on load), `_pages/65-quality-map.md` (`#map-export` button + `<dialog id="map-export-dialog">`), `_sass/pages/_map.scss`
- Create: `tests/map-export-json.test.js`; Modify: `tests/ui/map-page.spec.ts`

**Interfaces:**
- Consumes: Task 2 codec, Task 1 store.
- Produces:
  ```js
  // exporters/json.js
  export function toExportJson(state, subgraph, { site = "https://quality.arc42.org", now = new Date() } = {}) → string
      // pretty JSON: { "format": "q42-map", "v": 1, "exported": ISO, "site", "qualities": [{id,title,url,priority,hidden}], "items": [{id,title,type,url,linkedQualityIds}], "custom": [...], "layers", "showSingles" }
  export function fromImportJson(text) → MapState   // accepts the export format or a raw MapState; throws Error("Not a Q42 map file") otherwise
  ```
  `ExportPanel`: `new ExportPanel(dialogEl, { getState, getSubgraph, onImport(state, mode: "replace"|"merge") })`; sections: Share link (readonly input + Copy via `navigator.clipboard.writeText`, with a visible "Copied" confirmation; warning when token length > `SHARE_MAX_LENGTH`), JSON (Download `q42-map.json`, Import `<input type="file" accept="application/json">`), Markdown and Image sections rendered disabled with "coming soon" copy until Tasks 10 and 13 replace them.
  On load with `#s=`: decode; if OK, show `#map-notice` "A shared map was opened. [Replace my selection] [Merge] [Ignore]"; after the choice, remove the hash via `history.replaceState`. `merge` = union of qualities (keeping existing priorities), custom appended with fresh ids, `hiddenItems` union, layers from the link.

- [ ] **Step 1: Unit test** `tests/map-export-json.test.js`: round-trip `fromImportJson(toExportJson(state, subgraph))` equals state (minus `updated`); `fromImportJson("{}")` throws; items carry `url` = `site + page`.
- [ ] **Step 2: UI tests**: (a) opening `/map/#s=<token>` with a fresh storage shows the notice and "Replace" yields 2 qualities in the summary and clears the hash; (b) Export dialog Copy puts a URL starting with `/map/#s=v1.` into the readonly input; (c) Download triggers a `download` event with filename `q42-map.json` (`page.waitForEvent("download")`). Generate the token in the test via `page.evaluate` against `window.q42Map.encodeShare` — so `main.js` must expose `window.q42Map = { encodeShare, decodeShare }` (also handy for support).
- [ ] **Step 3: Run** → FAIL. **Step 4: Implement.** **Step 5: Run** unit + UI → PASS.
- [ ] **Step 6: Commit**

```bash
git add src/map/exporters/json.js src/map/ExportPanel.js src/map/download.js src/map/MapPage.js src/map/main.js _pages/65-quality-map.md _sass/pages/_map.scss tests/map-export-json.test.js tests/ui/map-page.spec.ts
git commit -m "map: share links, JSON export and import"
```

**Phase 1 is shippable after Task 8.** Open a PR to `main` here if you want early feedback from the issue author.

---

## Phase 2 — refine

### Task 9: Priority rating

**Files:**
- Modify: `src/map/Panel.js` (segmented Low/Medium/High `role="group"` with `aria-pressed` buttons for qualities and custom requirements; clicking the active one clears to null), `src/map/MapPage.js` (`onPriority(id, p)` → `update(setPriority)`), `src/map/ListView.js` (already shows the label — verify), `_sass/pages/_map.scss`
- Modify: `tests/ui/map-page.spec.ts`

- [ ] **Step 1: UI test**: click a quality node → panel shows the group; press "High" → `aria-pressed=true`, the node's `<circle>` radius grows to `58`, the table header reads "high"; reload keeps it.
- [ ] **Step 2–4:** FAIL → implement → PASS. **Step 5: Commit** `map: rate priority per quality`

---

### Task 10: Markdown export (arc42-shaped)

**Files:**
- Modify: `src/scripts/data.js` (`addMainNode`: quality nodes gain `excerpt` = first paragraph of the Markdown body, stripped of Markdown syntax, ≤ 240 chars; requirements unchanged). Confirms `assets/data/nodes.json` stays < 250 KB.
- Create: `src/map/exporters/markdown.js`, `tests/map-export-markdown.test.js`
- Modify: `src/map/ExportPanel.js` (Markdown section: checkboxes `goals`, `tree`, `matrix`, `custom`, `links`; Copy; Download `quality-map.md`; live `<pre>` preview)
- Modify: `tests/map-subgraph.test.js` fixture (add `excerpt` to one quality)

**Interfaces:**
```js
export function toMarkdown(state, subgraph, { sections = ["goals", "tree", "matrix", "custom"], links = false, site = "https://quality.arc42.org", title = "Quality map", now = new Date() } = {}) → string
```
Exact section layout (copy fixed by the spec and the Export mockup):
- H1 `# <title>` then `Built with Q42, <site> · <YYYY-MM-DD>`
- `## 1.2 Quality goals` — table `| Priority | Quality | Why it matters (edit me) |`, rows ordered high → medium → low → `–`, then selection order; third column `[YOUR REASON]`
- `## 10 Quality tree` — one bullet per dimension (from the quality's neighbouring dimension nodes, `#tag` bold), nested `**Title** — excerpt`; a quality with several dimensions is listed under its first and noted "(also listed above)" under the others
- `### Own requirements` — `**Title** (quality titles)` + scenario lines, only when `custom.length`
- `## Approaches serving two or more quality goals` — matrix with `●`, columns = qualities in selection order, blank cell when not linked; a trailing line `Hidden by you: …` and `N approaches with a single link omitted.` when applicable
- With `links: true`, every quality/approach title becomes a Markdown link to `site + page`.

- [ ] **Step 1: Unit tests**: a snapshot-style assertion on a small state (two qualities, one custom, two approaches) comparing to an expected string literal kept in the test; `links: true` turns `Availability` into `[Availability](https://quality.arc42.org/qualities/availability)`; omitting `"tree"` removes that section.
- [ ] **Step 2:** FAIL → implement → PASS (`npm run test:unit`, then `npm run data` in Docker: `docker compose run --rm esbuild npm run data` and check `assets/data/nodes.json` has `excerpt` on qualities).
- [ ] **Step 3: UI test**: Export dialog → Markdown preview contains `## 1.2 Quality goals`; unchecking "Quality tree" removes `## 10 Quality tree`.
- [ ] **Step 4: Commit**

```bash
git add src/scripts/data.js src/map/exporters/markdown.js src/map/ExportPanel.js tests/map-export-markdown.test.js tests/fixtures/map-graph.json tests/ui/map-page.spec.ts
git commit -m "map: export the map as arc42-shaped Markdown"
```

---

### Task 11: "Add to map" search on the map page

**Files:**
- Create: `src/map/AddSearch.js` (fetches `assets/data/search-index.json` + `search-lookup.json` lazily on first focus, exactly like `src/scripts/site/search.js`; lunr query restricted to `type: "quality"`; renders a listbox of ≤ 8 results with Add buttons that reuse the `[data-map-add]` contract so `selection.js` handles the click)
- Modify: `_pages/65-quality-map.md` (`#map-add` combobox markup mirroring the header search's ARIA pattern), `src/map/MapPage.js`, `_sass/pages/_map.scss`
- Modify: `tests/ui/map-page.spec.ts`

- [ ] **Step 1: UI test**: type "recover" into `#map-add-input` → a result "Recoverability" with a `[data-map-add="recoverability"]` button appears; click → summary says "4 qualities" and a new quality node is drawn.
- [ ] **Step 2–4:** FAIL → implement → PASS. **Step 5: Commit** `map: add qualities from the map page`

---

## Phase 3 — own content

### Task 12: Own requirements

**Files:**
- Create: `src/map/CustomForm.js` (`<dialog>` form: Title (required), Scenario (textarea, with a link to `/requirements/` guidance), Link to qualities (pressed chips for selected qualities), Priority; "Add to map" / "Cancel"; edit mode for an existing custom item; "Remove")
- Create: `src/map/propose.js` — `export function proposeIssueUrl(custom, qualityTitles, { repo = "arc42/quality.arc42.org-site" } = {}) → string` building `https://github.com/<repo>/issues/new?title=...&labels=requirement-proposal&body=...` with a body that follows the Tier-1 requirement template (`### Requirement`, `### Acceptance Criteria`) plus a `related:` line of quality ids; URL-encoded; body truncated to 6 000 chars with a note
- Modify: `src/map/Panel.js` (custom item: Edit, Remove, "Propose as contribution" link with `rel="noopener"` and the privacy note "Shares title, scenario and linked qualities. Not shared: your priorities, selection and map.")
- Modify: `src/map/MapPage.js`, `_pages/65-quality-map.md` ("+ Own requirement" button), `_sass/pages/_map.scss`
- Create: `tests/map-propose.test.js`; Modify: `tests/ui/map-page.spec.ts`

- [ ] **Step 1: Unit test `propose.js`**: URL starts with the repo's `issues/new?`, decoded `title` equals the custom title, decoded `body` contains `### Acceptance Criteria` and `related: [availability, resilience]`, and a 20 000-char scenario yields a body ≤ 6 100 chars ending in a truncation note.
- [ ] **Step 2: UI test**: open the form, submit title "Checkout keeps working" linked to two qualities → a `.map-node[data-type="custom"]` appears, dashed; panel shows "Propose as contribution" with an `href` starting `https://github.com/arc42/quality.arc42.org-site/issues/new?`; Remove deletes it.
- [ ] **Step 3–5:** FAIL → implement → PASS. **Step 6: Commit** `map: add own requirements and propose-as-issue link`

---

### Task 13: Image export (SVG, PNG)

**Files:**
- Create: `src/map/exporters/svg.js` — `export function serializeMapSvg(svgEl, { legendEl, background = "#ffffff" }) → string` (clones the SVG, inlines the computed font-family and colours as attributes, appends a legend group, adds `xmlns`); `export async function svgToPngBlob(svgString, { scale = 2 }) → Blob` via `<img>` + `<canvas>`
- Modify: `src/map/ExportPanel.js` (Image section: PNG / SVG buttons → `downloadText("quality-map.svg", …, "image/svg+xml")` / Blob download `quality-map.png`)
- Modify: `tests/ui/map-page.spec.ts`

- [ ] **Step 1: UI test**: SVG download event has filename `quality-map.svg` and the file content starts with `<svg` and contains the first quality's label; PNG download has filename `quality-map.png`.
- [ ] **Step 2–4:** FAIL → implement → PASS. **Step 5: Commit** `map: export the map as SVG and PNG`

---

### Task 14: Documentation and discoverability

**Files:**
- Modify: `_pages/05-how-to-use-this-site.md` (section "Build your own quality map": three sentences + link to `/map/`)
- Modify: `_pages/20-quality-characteristics.md` (dismissible intro banner "Build your own map …" above the explorer, `localStorage` key `q42.map.banner-dismissed`, rendered by `selection.js` so other index pages can reuse it via `<div data-map-banner>`)
- Modify: `CLAUDE.md` (short "Quality map" paragraph under Repository Layout: `src/map/`, store key, the `data-map-add` contract, and "restart Docker after touching `_pages/65-quality-map.md`")
- Modify: `TODO/map/quality-map-builder.md` (status line → "implemented on branch map-feature; see plan")
- Modify: `tests/ui/how-to.spec.ts` (the new section heading is visible), `tests/ui/map-selection.spec.ts` (banner shows, dismiss hides it and survives reload)

- [ ] **Step 1: Tests** → FAIL. **Step 2: Implement.** **Step 3:** `make test` (full UI suite) → PASS; `npm run test:unit`, `npm run test:css`, `npm run test:links` → PASS.
- [ ] **Step 4: Commit**

```bash
git add _pages/05-how-to-use-this-site.md _pages/20-quality-characteristics.md src/scripts/site/selection.js CLAUDE.md TODO/map/quality-map-builder.md tests/ui/how-to.spec.ts tests/ui/map-selection.spec.ts
git commit -m "docs: explain the quality map and surface it on the qualities index"
```

Then: `superpowers:finishing-a-development-branch` — open the PR against `main`, reference issue #552, and link the mockup canvas in the PR body.

---

## Decisions made in this plan (not in the spec)

- **SVG renderer, not the existing canvas `GraphRenderer`.** The map has ≤ ~60 nodes, needs real DOM for hover/click styling, and SVG export falls out for free. The canvas renderer is tuned for 444 nodes and would need a parallel accessibility layer anyway. If the sigma/ForceAtlas2 evaluation lands later, `MapView.js` is the only file to swap.
- **Hidden non-quality items live in `hiddenItems: string[]`** (the spec only had a per-quality flag). Needed because the mockup hides approaches too.
- **Priority applies to qualities and own requirements only**, not to approaches (the mockup panel showed it on an approach; dropped as YAGNI — approaches get their emphasis from the count badge).
- **Share token uses platform `CompressionStream`** rather than adding `lz-string`. Browsers without it (none evergreen) get the JSON export path.
- **`excerpt` added to quality nodes in `nodes.json`** so the Markdown quality tree can carry definitions; requirements and approaches stay excerpt-free to keep the bundle small.
- **The map page uses the `graph` layout** (full width, header + footer) rather than `page`, because the canvas + panel need more than the 1200 px article column.
