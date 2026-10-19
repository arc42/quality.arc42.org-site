import {
  SELECTION_EVENT,
  STORAGE_KEY,
  emitSelectionChanged,
  loadState,
  saveState,
  setItemHidden,
  setLayers,
  setQualityHidden,
  setShowSingles,
} from "./store.js";
import { buildSubgraph } from "./subgraph.js";
import { ListView } from "./ListView.js";
import { singlesText, summaryText, unknownIdsText } from "./format.js";

// Thin controller for /map/: owns the selection state, wires the controls,
// and re-renders every view after each change. Rendering lives in the views.

export class MapPage {
  constructor(root, { index, initialState }) {
    this.root = root;
    this.doc = root.ownerDocument;
    this.index = index;
    this.state = initialState;
    this.baseurl = root.dataset.baseurl ?? "";
    this.$ = (id) => this.doc.getElementById(id);
    this.listView = new ListView(this.$("map-table"), { baseurl: this.baseurl });
  }

  mount() {
    this.$("map-layers").addEventListener("click", (event) => {
      const button = event.target.closest("[data-layer]");
      if (!button) return;
      const layer = button.dataset.layer;
      this.update((s) =>
        setLayers(
          s,
          s.layers.includes(layer) ? s.layers.filter((l) => l !== layer) : [...s.layers, layer],
        ),
      );
    });

    this.$("map-singles").addEventListener("click", () =>
      this.update((s) => setShowSingles(s, !s.showSingles)),
    );

    const toggle = this.$("map-hidden-toggle");
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      this.$("map-hidden-list").hidden = !open;
    });

    this.$("map-hidden-list").addEventListener("click", (event) => {
      const button = event.target.closest("[data-restore]");
      if (!button) return;
      const { restore, kind } = button.dataset;
      if (restore === "*") this.update((s) => this.restoreAll(s));
      else if (kind === "quality") this.update((s) => setQualityHidden(s, restore, false));
      else this.update((s) => setItemHidden(s, restore, false));
      // The button just pressed is gone after the re-render; keep focus nearby.
      (toggle.hidden ? this.$("map-table") : toggle).focus();
    });

    this.doc.addEventListener(SELECTION_EVENT, (event) => {
      const next = event.detail?.state;
      // Ignore the echo of our own emit.
      if (!next || next === this.state) return;
      this.state = next;
      this.render();
    });

    this.doc.defaultView?.addEventListener("storage", (event) => {
      if (event.key !== null && event.key !== STORAGE_KEY) return;
      this.state = loadState();
      this.render();
    });

    this.render();
    return this;
  }

  update(fn) {
    const next = fn(this.state);
    try {
      this.state = saveState(next);
    } catch {
      // Storage full or unavailable: keep the page working in memory.
      this.state = next;
    }
    emitSelectionChanged(this.state, this.doc);
    this.render();
  }

  restoreAll(state) {
    let next = state;
    for (const q of this.subgraph.qualities)
      if (q.hidden) next = setQualityHidden(next, q.id, false);
    for (const item of this.subgraph.items)
      if (item.hidden) next = setItemHidden(next, item.id, false);
    return next;
  }

  render() {
    const state = this.state;
    this.subgraph = buildSubgraph(this.index, state);
    const subgraph = this.subgraph;
    const empty = state.qualities.length === 0;

    this.$("map-empty").hidden = !empty;
    this.root.querySelector(".map-layout").hidden = empty;
    this.root.querySelector(".map-controls").hidden = empty;
    this.root.querySelector(".map-list").hidden = empty;
    this.$("map-summary").textContent = empty
      ? "No qualities selected yet"
      : summaryText(subgraph, state);
    this.$("map-notice").textContent = unknownIdsText(subgraph.unknownIds.length);
    if (empty) return;

    this.root.querySelectorAll("#map-layers [data-layer]").forEach((button) => {
      button.setAttribute("aria-pressed", String(state.layers.includes(button.dataset.layer)));
    });
    this.$("map-singles").setAttribute("aria-pressed", String(state.showSingles));
    this.$("map-singles-hint").textContent = state.showSingles
      ? ""
      : singlesText(subgraph.singlesHidden);

    this.renderHidden(subgraph);
    this.listView.render(subgraph, state);
  }

  renderHidden(subgraph) {
    const hidden = [
      ...subgraph.qualities.filter((q) => q.hidden).map((q) => ({ ...q, kind: "quality" })),
      ...subgraph.items.filter((i) => i.hidden).map((i) => ({ ...i, kind: "item" })),
    ];
    const toggle = this.$("map-hidden-toggle");
    const list = this.$("map-hidden-list");
    this.$("map-hidden-count").textContent = String(hidden.length);
    toggle.hidden = hidden.length === 0;
    if (hidden.length === 0) {
      toggle.setAttribute("aria-expanded", "false");
      list.hidden = true;
    }

    const doc = this.doc;
    const ul = doc.createElement("ul");
    ul.className = "map-hidden__items";
    for (const entry of hidden) {
      const li = doc.createElement("li");
      const name = doc.createElement("span");
      name.textContent = entry.label;
      li.append(name, this.restoreButton("Restore", entry.id, entry.kind, entry.label));
      ul.append(li);
    }
    list.replaceChildren(ul);
    if (hidden.length > 1) list.append(this.restoreButton("Restore all", "*", "all"));
  }

  restoreButton(text, id, kind, label) {
    const button = this.doc.createElement("button");
    button.type = "button";
    button.className = "map-pill";
    button.dataset.restore = id;
    button.dataset.kind = kind;
    button.textContent = text;
    if (label) {
      const sr = this.doc.createElement("span");
      sr.className = "sr-only";
      sr.textContent = ` ${label}`;
      button.append(sr);
    }
    return button;
  }
}
