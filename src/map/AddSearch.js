import { rankQualities } from "./addSearchRank.js";

// "Add a quality" combobox on /map/. Fetches search-lookup.json lazily on the
// first focus and lists up to 8 matching qualities. Each row carries a
// [data-map-add] button, so src/scripts/site/selection.js handles the click
// and keeps the "+ Add" / "✓ Added" state in sync.

const DEBOUNCE_MS = 100;

export class AddSearch {
  constructor(root, { baseurl = "" } = {}) {
    this.root = root;
    this.doc = root.ownerDocument;
    this.baseurl = baseurl;
    this.input = root.querySelector("#map-add-input");
    this.list = root.querySelector("#map-add-results");
    this.status = root.querySelector("#map-add-status");
    this.entries = null;
    this.loading = null;
    this.failed = false;
    this.hits = [];
    this.active = -1;
    this.timer = null;
  }

  mount() {
    const { input, root, doc } = this;
    input.addEventListener("focus", () => this.load());
    input.addEventListener("input", () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.search(), DEBOUNCE_MS);
    });
    input.addEventListener("keydown", (event) => this.onKey(event));
    doc.addEventListener("click", (event) => {
      if (!root.contains(event.target)) this.close();
    });
    return this;
  }

  load() {
    if (this.loading) return this.loading;
    this.loading = fetch(`${this.baseurl}/assets/data/search-lookup.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        this.entries = Object.values(data).filter((entry) => entry.type === "quality");
        this.failed = false;
      })
      .catch(() => {
        this.loading = null; // allow a retry on the next focus
        this.failed = true;
      });
    return this.loading;
  }

  async search() {
    const query = this.input.value.trim();
    if (!query) return this.close();
    await this.load();
    // The input may have changed or been emptied while the lookup loaded.
    if (this.input.value.trim() !== query) return;
    if (this.failed) {
      this.close();
      this.status.textContent = "Search unavailable";
      return;
    }
    this.hits = rankQualities(this.entries, query);
    this.active = -1;
    this.render();
  }

  render() {
    const { doc, list, input } = this;
    const items = this.hits.map((hit, i) => {
      const li = doc.createElement("li");
      li.id = `map-add-opt-${i}`;
      li.className = "map-add-search__item";
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", "false");

      const label = doc.createElement("span");
      label.className = "map-add-search__label";
      const title = doc.createElement("span");
      title.className = "map-add-search__title";
      title.textContent = hit.title;
      label.append(title);
      if (hit.via) {
        const via = doc.createElement("span");
        via.className = "map-add-search__via";
        via.textContent = `via ${hit.via}`;
        label.append(via);
      }

      const button = doc.createElement("button");
      button.type = "button";
      button.className = "map-add";
      button.tabIndex = -1; // the combobox owns keyboard access
      button.dataset.mapAdd = hit.id;
      button.dataset.mapTitle = hit.title;
      button.setAttribute("aria-pressed", "false");
      button.textContent = "+ Add";

      li.append(label, button);
      return li;
    });
    list.replaceChildren(...items);
    list.hidden = items.length === 0;
    input.setAttribute("aria-expanded", String(items.length > 0));
    input.removeAttribute("aria-activedescendant");
    this.status.textContent =
      items.length === 0
        ? "No results"
        : `${items.length} ${items.length === 1 ? "result" : "results"}`;
  }

  close() {
    clearTimeout(this.timer);
    this.hits = [];
    this.active = -1;
    this.list.replaceChildren();
    this.list.hidden = true;
    this.input.setAttribute("aria-expanded", "false");
    this.input.removeAttribute("aria-activedescendant");
    this.status.textContent = "";
  }

  setActive(index) {
    const rows = this.list.children;
    if (rows.length === 0) return;
    this.active = (index + rows.length) % rows.length;
    for (const [i, row] of [...rows].entries()) {
      row.setAttribute("aria-selected", String(i === this.active));
    }
    const row = rows[this.active];
    this.input.setAttribute("aria-activedescendant", row.id);
    row.scrollIntoView?.({ block: "nearest" });
  }

  onKey(event) {
    const open = !this.list.hidden;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!open) {
        if (this.hits.length === 0) return;
        this.list.hidden = false;
        this.input.setAttribute("aria-expanded", "true");
      }
      event.preventDefault();
      this.setActive(this.active + (event.key === "ArrowDown" ? 1 : -1));
    } else if (event.key === "Enter") {
      if (!open || this.active < 0) return;
      event.preventDefault();
      this.list.children[this.active].querySelector("[data-map-add]").click();
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      this.close();
    }
  }
}
