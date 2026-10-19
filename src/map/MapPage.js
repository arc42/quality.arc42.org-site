import {
  SELECTION_EVENT,
  STORAGE_KEY,
  addCustom,
  createEmptyState,
  emitSelectionChanged,
  loadState,
  mergeStates,
  removeCustom,
  removeQuality,
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
import { plural, singlesChipText, summaryText, unknownIdsText } from "./format.js";

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
    // "Clear selection" was pressed once and awaits the inline confirmation.
    this.pendingClear = false;
    this.listView = new ListView(this.$("map-table"), {
      baseurl: this.baseurl,
      onDetails: (id) => this.select(id, { focusPanel: true }),
    });
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
      onRemoveQuality: (id) => this.removeQuality(id),
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
      getSvg: () => this.mapView.svg?.node() ?? null,
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

    const clear = this.$("map-clear");
    clear.addEventListener("click", () => {
      this.pendingClear = true;
      this.renderNotice();
      // Land on the safe choice; the reader confirms with a second press.
      this.$("map-notice").querySelector('[data-notice-choice="keep"]')?.focus();
    });

    this.$("map-notice").addEventListener("click", (event) => {
      const choice = event.target.closest("[data-notice-choice]")?.dataset.noticeChoice;
      if (!choice) return;
      if (choice === "clear" || choice === "keep") this.resolveClear(choice);
      else if (choice === "prune") this.pruneUnknown();
      else this.resolveShare(choice);
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
      this.$("map-notice").querySelector('[data-notice-choice="replace"]').focus();
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
    this.focusSummary();
  }

  focusSummary() {
    const summary = this.$("map-summary");
    summary.tabIndex = -1;
    summary.focus();
  }

  resolveClear(choice) {
    this.pendingClear = false;
    if (choice !== "clear") {
      this.renderNotice();
      this.$("map-clear").focus();
      return;
    }
    this.selectedId = null;
    this.update(() => createEmptyState());
    this.message = "Selection cleared";
    this.renderNotice();
    this.$("map-add-input").focus();
  }

  /** Drop selected ids that no longer exist on Q42, after the reader asked for it. */
  pruneUnknown() {
    const ids = this.subgraph.unknownIds;
    this.update((s) => ids.reduce((next, id) => removeQuality(next, id), s));
    this.focusSummary();
  }

  /** Remove a quality from the selection (the panel's "Remove from selection"). */
  removeQuality(id) {
    const label = this.subgraph.qualities.find((q) => q.id === id)?.label ?? id;
    if (this.selectedId === id) this.selectedId = null;
    this.update((s) => removeQuality(s, id));
    this.message = `${label} removed from your selection`;
    this.renderNotice();
    this.focusSummary();
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

  /**
   * #map-notice shows, in order: a pending share link, a pending clear, a
   * one-off message, or the stale-id report. Unchanged content is left alone
   * so the live region does not announce it again on every render.
   */
  renderNotice() {
    if (this.pendingShare) {
      this.noticeWithChoices("share", "A shared map was opened.", [
        ["replace", "Replace my selection"],
        ["merge", "Merge"],
        ["ignore", "Ignore"],
      ]);
      return;
    }
    if (this.pendingClear) {
      const n = this.state.qualities.length;
      const own = this.state.custom.length;
      const what = own
        ? `${plural(n, "quality", "qualities")} and ${plural(own, "own requirement", "own requirements")}`
        : plural(n, "quality", "qualities");
      this.noticeWithChoices(`clear:${n}:${own}`, `Remove all ${what}?`, [
        ["clear", "Clear"],
        ["keep", "Keep"],
      ]);
      return;
    }
    const unknown = this.subgraph.unknownIds;
    if (!this.message && unknown.length) {
      this.noticeWithChoices(`prune:${unknown.join(",")}`, unknownIdsText(unknown), [
        ["prune", "Remove them"],
      ]);
      return;
    }
    const notice = this.$("map-notice");
    delete notice.dataset.notice;
    if (notice.textContent !== this.message) notice.textContent = this.message;
  }

  noticeWithChoices(key, message, choices) {
    const notice = this.$("map-notice");
    if (notice.dataset.notice === key) return;
    notice.dataset.notice = key;
    const text = this.doc.createElement("span");
    text.textContent = message;
    const actions = this.doc.createElement("span");
    actions.className = "map-notice__actions";
    for (const [choice, label] of choices) {
      const button = this.doc.createElement("button");
      button.type = "button";
      button.className = "map-pill";
      button.dataset.noticeChoice = choice;
      button.textContent = label;
      actions.append(button);
    }
    notice.replaceChildren(text, " ", actions);
  }

  update(fn) {
    this.message = "";
    this.pendingClear = false;
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
    this.$("map-clear").hidden = empty;
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

  /**
   * Show `id` in the panel and highlight it on the canvas. With `focusPanel`
   * (the list view's Details buttons) focus moves to the panel heading, so the
   * next Tab reaches the panel's first control.
   */
  select(id, { focusPanel = false } = {}) {
    this.selectedId = id;
    this.renderSelection();
    if (focusPanel) this.$("map-panel").querySelector("h2")?.focus();
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
