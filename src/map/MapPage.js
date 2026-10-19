import {
  SELECTION_EVENT,
  STORAGE_KEY,
  addCustom,
  emitSelectionChanged,
  loadState,
  mergeStates,
  removeCustom,
  saveState,
  setItemHidden,
  setLayers,
  setPriority,
  setQualityHidden,
  setShowSingles,
  updateCustom,
} from "./store.js";
import { buildSubgraph } from "./subgraph.js";
import { ListView } from "./ListView.js";
import { MapView } from "./MapView.js";
import { Panel } from "./Panel.js";
import { ExportPanel } from "./ExportPanel.js";
import { CustomForm } from "./CustomForm.js";
import { AddSearch } from "./AddSearch.js";
import { SHARE_PARAM, decodeShare } from "./share.js";
import { singlesChipText, summaryText, unknownIdsText } from "./format.js";

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
    this.selectedId = null;
    // A decoded share link awaiting the user's choice, and a one-off message;
    // both take #map-notice over from the unknown-id notice.
    this.pendingShare = null;
    this.message = "";
    this.listView = new ListView(this.$("map-table"), { baseurl: this.baseurl });
    this.mapView = new MapView(this.$("map-canvas"), { onSelect: (id) => this.select(id) });
    this.panel = new Panel(this.$("map-panel"), {
      baseurl: this.baseurl,
      onPriority: (id, priority) => this.update((s) => setPriority(s, id, priority)),
      onHide: (id, hidden) =>
        this.update((s) =>
          s.qualities.some((q) => q.id === id)
            ? setQualityHidden(s, id, hidden)
            : setItemHidden(s, id, hidden),
        ),
      getCustom: (id) => this.state.custom.find((c) => c.id === id) ?? null,
      onEdit: (id, opener) =>
        this.customForm.open({ custom: this.state.custom.find((c) => c.id === id), opener }),
      onRemove: (id) => this.removeCustom(id),
    });
    this.customForm = new CustomForm(this.$("map-custom-dialog"), {
      getQualities: () => this.subgraph.qualities,
      onSubmit: (data, id) => this.saveCustom(data, id),
      onRemove: (id) => this.removeCustom(id),
      // The opener was rebuilt or removed: land on the item's Edit button or the add button.
      onFocusLost: () =>
        (
          this.$("map-panel").querySelector("[data-panel-edit]") ?? this.$("map-custom-open")
        ).focus(),
    });
    this.exportPanel = new ExportPanel(this.$("map-export-dialog"), {
      getState: () => this.state,
      getSubgraph: () => this.subgraph,
      onImport: (state) => this.update(() => state),
    });
  }

  mount() {
    new AddSearch(this.$("map-add"), { baseurl: this.baseurl }).mount();

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

    const toggleSingles = () => this.update((s) => setShowSingles(s, !s.showSingles));
    this.$("map-singles").addEventListener("click", toggleSingles);
    this.$("map-singles-chip").addEventListener("click", toggleSingles);

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

    const customOpen = this.$("map-custom-open");
    customOpen.addEventListener("click", () => this.customForm.open({ opener: customOpen }));

    const exportOpen = this.$("map-export-open");
    exportOpen.addEventListener("click", () => this.exportPanel.open(exportOpen));

    this.$("map-notice").addEventListener("click", (event) => {
      const button = event.target.closest("[data-share-choice]");
      if (button) this.resolveShare(button.dataset.shareChoice);
    });
    this.doc.defaultView?.addEventListener("hashchange", () => this.readShareHash());

    this.render();
    this.readShareHash();
    return this;
  }

  /** Read a `#s=` share link from the address bar and ask what to do with it. */
  async readShareHash() {
    const { hash } = this.doc.location;
    if (!hash.startsWith(`#${SHARE_PARAM}=`)) return;
    const decoded = await decodeShare(hash);
    if (!decoded) {
      this.clearHash();
      this.pendingShare = null;
      this.message = "This share link is invalid or damaged.";
      this.renderNotice();
      return;
    }
    this.pendingShare = decoded;
    this.message = "";
    this.renderNotice();
    if (this.state.qualities.length === 0) {
      this.$("map-notice").querySelector('[data-share-choice="replace"]').focus();
    }
  }

  resolveShare(choice) {
    const incoming = this.pendingShare;
    this.pendingShare = null;
    this.clearHash();
    if (incoming && choice === "replace") this.update(() => incoming);
    else if (incoming && choice === "merge") this.update((s) => mergeStates(s, incoming));
    else this.renderNotice();
    // The pressed button is gone; land on the summary, which reports the result.
    const summary = this.$("map-summary");
    summary.tabIndex = -1;
    summary.focus();
  }

  clearHash() {
    const { location, defaultView } = this.doc;
    if (!location.hash) return;
    defaultView.history.replaceState(
      defaultView.history.state,
      "",
      location.pathname + location.search,
    );
  }

  renderNotice() {
    const notice = this.$("map-notice");
    if (this.pendingShare) {
      if (notice.querySelector("[data-share-choice]")) return;
      const text = this.doc.createElement("span");
      text.textContent = "A shared map was opened.";
      const actions = this.doc.createElement("span");
      actions.className = "map-notice__actions";
      for (const [choice, label] of [
        ["replace", "Replace my selection"],
        ["merge", "Merge"],
        ["ignore", "Ignore"],
      ]) {
        const button = this.doc.createElement("button");
        button.type = "button";
        button.className = "map-pill";
        button.dataset.shareChoice = choice;
        button.textContent = label;
        actions.append(button);
      }
      notice.replaceChildren(text, " ", actions);
      return;
    }
    notice.textContent = this.message || unknownIdsText(this.subgraph.unknownIds.length);
  }

  update(fn) {
    this.message = "";
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

  /** Add (id null) or update an own requirement, then show it in the panel. */
  saveCustom(data, id) {
    if (id) this.update((s) => updateCustom(s, id, data));
    else this.update((s) => addCustom(s, data));
    this.select(id ?? this.state.custom[this.state.custom.length - 1].id);
  }

  removeCustom(id) {
    const custom = this.state.custom.find((c) => c.id === id);
    if (!custom) return;
    if (this.selectedId === id) this.selectedId = null;
    // Drop a hidden flag too, so a later requirement reusing the id starts visible.
    this.update((s) => setItemHidden(removeCustom(s, id), id, false));
    this.message = `${custom.title} removed`;
    this.renderNotice();
    if (!this.doc.activeElement || this.doc.activeElement === this.doc.body) {
      this.$("map-custom-open").focus();
    }
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
    // An own requirement needs qualities to link to.
    this.$("map-custom-open").hidden = empty;
    this.$("map-summary").textContent = empty
      ? "No qualities selected yet"
      : summaryText(subgraph, state);
    this.renderNotice();
    if (empty) {
      this.hideHiddenList();
      this.selectedId = null;
      return;
    }

    this.root.querySelectorAll("#map-layers [data-layer]").forEach((button) => {
      button.setAttribute("aria-pressed", String(state.layers.includes(button.dataset.layer)));
    });
    this.$("map-singles").setAttribute("aria-pressed", String(state.showSingles));
    const chipText = singlesChipText(subgraph, state);
    const chip = this.$("map-singles-chip");
    chip.textContent = chipText;
    chip.hidden = chipText === "";
    chip.setAttribute("aria-pressed", String(state.showSingles));

    this.renderHidden(subgraph);
    this.listView.render(subgraph, state);
    this.mapView.render(subgraph, state);
    this.renderSelection();
  }

  select(id) {
    this.selectedId = id;
    this.renderSelection();
  }

  /** Panel and canvas highlight for the selected node; hidden nodes stay selectable. */
  renderSelection() {
    const { qualities, items } = this.subgraph;
    const id = this.selectedId;
    const quality = qualities.find((q) => q.id === id);
    const item = quality ? null : items.find((i) => i.id === id);
    const node = quality ?? item;
    if (!node) this.selectedId = null;
    this.panel.render(
      node ? { kind: quality ? "quality" : "item", node, subgraph: this.subgraph } : null,
    );
    this.mapView.focusNode(this.selectedId);
  }

  hideHiddenList() {
    const toggle = this.$("map-hidden-toggle");
    toggle.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    this.$("map-hidden-list").hidden = true;
  }

  renderHidden(subgraph) {
    const hidden = [
      ...subgraph.qualities.filter((q) => q.hidden).map((q) => ({ ...q, kind: "quality" })),
      ...subgraph.items.filter((i) => i.hidden).map((i) => ({ ...i, kind: "item" })),
    ];
    const toggle = this.$("map-hidden-toggle");
    const list = this.$("map-hidden-list");
    this.$("map-hidden-count").textContent = String(hidden.length);
    if (hidden.length === 0) this.hideHiddenList();
    else toggle.hidden = false;

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
