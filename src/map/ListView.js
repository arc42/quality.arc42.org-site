import { GROUP_LABELS, priorityLabel, servesText, summaryText } from "./format.js";

// The list twin of the map: the same subgraph as an accessible table.
// One column per selected quality, one row per item, grouped by item type.

const GROUP_ORDER = Object.freeze(["approach", "requirement", "standard", "dimension", "custom"]);

export class ListView {
  constructor(container, { baseurl = "", onDetails = () => {} } = {}) {
    this.container = container;
    this.baseurl = baseurl;
    this.doc = container.ownerDocument;
    // Delegated once: the table is rebuilt on every render. The Details
    // buttons are the keyboard path to the panel (the canvas is aria-hidden).
    container.addEventListener("click", (event) => {
      const button = event.target.closest("[data-map-details]");
      if (button) onDetails(button.dataset.mapDetails);
    });
  }

  el(tag, { className, text, attrs } = {}) {
    const node = this.doc.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    for (const [name, value] of Object.entries(attrs ?? {})) node.setAttribute(name, value);
    return node;
  }

  srOnly(text) {
    return this.el("span", { className: "sr-only", text });
  }

  detailsButton(id, label) {
    return this.el("button", {
      className: "map-pill map-pill--small map-table__details",
      text: "Details",
      attrs: { type: "button", "data-map-details": id, "aria-label": `Details for ${label}` },
    });
  }

  hiddenBadge() {
    return this.el("span", { className: "map-table__badge", text: "hidden" });
  }

  render(subgraph, state) {
    const { qualities, items } = subgraph;
    const columns = qualities.length + 2;

    const table = this.el("table", { className: "map-table" });
    table.append(this.el("caption", { text: summaryText(subgraph, state) }));

    const headRow = this.el("tr");
    headRow.append(this.el("th", { text: "Item", attrs: { scope: "col" } }));
    for (const q of qualities) {
      const th = this.el("th", { attrs: { scope: "col" } });
      th.append(
        this.doc.createTextNode(q.label),
        this.el("span", { className: "map-table__priority", text: priorityLabel(q.priority) }),
      );
      if (q.hidden) th.append(this.hiddenBadge());
      th.append(this.detailsButton(q.id, q.label));
      headRow.append(th);
    }
    headRow.append(this.el("th", { text: "Serves", attrs: { scope: "col" } }));
    const thead = this.el("thead");
    thead.append(headRow);
    table.append(thead);

    for (const type of GROUP_ORDER) {
      const group = items.filter((item) => item.type === type);
      if (group.length === 0) continue;
      const tbody = this.el("tbody", { attrs: { "data-type": type } });
      const headingRow = this.el("tr", { className: "map-table__group" });
      headingRow.append(
        this.el("th", {
          text: GROUP_LABELS[type],
          attrs: { scope: "rowgroup", colspan: String(columns) },
        }),
      );
      tbody.append(headingRow);
      for (const item of group) tbody.append(this.row(item, qualities));
      table.append(tbody);
    }

    this.container.replaceChildren(table);
  }

  row(item, qualities) {
    const tr = this.el("tr", { className: item.hidden ? "is-hidden" : undefined });
    const th = this.el("th", { attrs: { scope: "row" } });
    // Custom items have no page on Q42: never link an empty href.
    if (item.page) {
      th.append(this.el("a", { text: item.label, attrs: { href: this.baseurl + item.page } }));
    } else {
      th.append(this.doc.createTextNode(item.label));
    }
    if (item.hidden) th.append(this.hiddenBadge());
    th.append(this.detailsButton(item.id, item.label));
    tr.append(th);

    const linked = new Set(item.linkedQualityIds);
    for (const q of qualities) {
      const td = this.el("td", { className: "map-table__cell" });
      if (linked.has(q.id)) {
        td.append(this.el("span", { text: "●", attrs: { "aria-hidden": "true" } }));
        td.append(this.srOnly("linked"));
      } else {
        td.append(this.el("span", { text: "–", attrs: { "aria-hidden": "true" } }));
        td.append(this.srOnly("not linked"));
      }
      tr.append(td);
    }
    tr.append(
      this.el("td", { className: "map-table__serves", text: servesText(item, qualities.length) }),
    );
    return tr;
  }
}
