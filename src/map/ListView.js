import { GROUP_LABELS, priorityLabel, servesText, summaryText } from "./format.js";
import { el } from "./dom.js";

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

  srOnly(text) {
    return el(this.doc, "span", { className: "sr-only", text });
  }

  detailsButton(id, label) {
    return el(this.doc, "button", {
      className: "map-pill map-pill--small map-table__details",
      text: "Details",
      attrs: { type: "button", "data-map-details": id, "aria-label": `Details for ${label}` },
    });
  }

  hiddenBadge() {
    return el(this.doc, "span", { className: "map-table__badge", text: "hidden" });
  }

  render(subgraph, state) {
    const { qualities, items } = subgraph;
    const columns = qualities.length + 2;

    const table = el(this.doc, "table", { className: "map-table" });
    table.append(el(this.doc, "caption", { text: summaryText(subgraph, state) }));

    const headRow = el(this.doc, "tr");
    headRow.append(el(this.doc, "th", { text: "Item", attrs: { scope: "col" } }));
    for (const q of qualities) {
      const th = el(this.doc, "th", { attrs: { scope: "col" } });
      th.append(
        this.doc.createTextNode(q.label),
        el(this.doc, "span", { className: "map-table__priority", text: priorityLabel(q.priority) }),
      );
      if (q.hidden) th.append(this.hiddenBadge());
      th.append(this.detailsButton(q.id, q.label));
      headRow.append(th);
    }
    headRow.append(el(this.doc, "th", { text: "Serves", attrs: { scope: "col" } }));
    const thead = el(this.doc, "thead");
    thead.append(headRow);
    table.append(thead);

    for (const type of GROUP_ORDER) {
      const group = items.filter((item) => item.type === type);
      if (group.length === 0) continue;
      const tbody = el(this.doc, "tbody", { attrs: { "data-type": type } });
      const headingRow = el(this.doc, "tr", { className: "map-table__group" });
      headingRow.append(
        el(this.doc, "th", {
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
    const tr = el(this.doc, "tr", { className: item.hidden ? "is-hidden" : undefined });
    const th = el(this.doc, "th", { attrs: { scope: "row" } });
    // Custom items have no page on Q42: never link an empty href.
    if (item.page) {
      th.append(el(this.doc, "a", { text: item.label, attrs: { href: this.baseurl + item.page } }));
    } else {
      th.append(this.doc.createTextNode(item.label));
    }
    if (item.hidden) th.append(this.hiddenBadge());
    th.append(this.detailsButton(item.id, item.label));
    tr.append(th);

    const linked = new Set(item.linkedQualityIds);
    for (const q of qualities) {
      const td = el(this.doc, "td", { className: "map-table__cell" });
      if (linked.has(q.id)) {
        td.append(el(this.doc, "span", { text: "●", attrs: { "aria-hidden": "true" } }));
        td.append(this.srOnly("linked"));
      } else {
        td.append(el(this.doc, "span", { text: "–", attrs: { "aria-hidden": "true" } }));
        td.append(this.srOnly("not linked"));
      }
      tr.append(td);
    }
    tr.append(
      el(this.doc, "td", {
        className: "map-table__serves",
        text: servesText(item, qualities.length),
      }),
    );
    return tr;
  }
}
