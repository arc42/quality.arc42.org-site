// Side panel next to the map canvas: details of the selected node, a link to
// its page on Q42 and the hide/show toggle. Priority controls arrive later and
// fill the empty [data-panel-priority] slot.

export const TYPE_BADGES = Object.freeze({
  quality: "Quality",
  approach: "Approach",
  requirement: "Requirement",
  standard: "Standard",
  dimension: "Dimension",
  custom: "Own requirement",
});

const PLACEHOLDER = "Select a node on the map to see details.";
const EXTERNAL_ICON = "M14 4h6v6M20 4l-9 9M19 14v6H4V5h6";
const SVG_NS = "http://www.w3.org/2000/svg";

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

export class Panel {
  constructor(container, { baseurl = "", onHide = () => {}, onOpen = () => {} } = {}) {
    this.container = container;
    this.doc = container.ownerDocument;
    this.baseurl = baseurl;
    this.selection = null;

    // Delegated once: the panel content is rebuilt on every render.
    container.addEventListener("click", (event) => {
      const node = this.selection?.node;
      if (!node) return;
      if (event.target.closest("[data-panel-hide]")) onHide(node.id, !node.hidden);
      else if (event.target.closest("[data-panel-open]")) onOpen(node.id);
    });
  }

  el(tag, { className, text, attrs } = {}) {
    const node = this.doc.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    for (const [name, value] of Object.entries(attrs ?? {})) node.setAttribute(name, value);
    return node;
  }

  render(selection) {
    // Keep keyboard focus on the toggle when it is rebuilt after a hide/show.
    const active = this.doc.activeElement;
    const refocus = this.container.contains(active) && active.matches("[data-panel-hide]");
    this.selection = selection;
    if (!selection) {
      this.container.replaceChildren(
        this.el("p", { className: "map-panel__placeholder", text: PLACEHOLDER }),
      );
      return;
    }

    const { kind, node, subgraph } = selection;
    const type = kind === "quality" ? "quality" : node.type;
    const parts = [
      this.el("span", {
        className: "map-panel__badge",
        text: TYPE_BADGES[type],
        attrs: { "data-type": type },
      }),
      this.el("h2", { className: "map-panel__title", text: node.label }),
    ];

    if (kind === "item") {
      const total = subgraph.qualities.length;
      const linked = new Set(node.linkedQualityIds);
      parts.push(
        this.el("p", {
          className: "map-panel__summary",
          text: `Supports ${linked.size} of ${plural(total, "quality", "qualities")}`,
        }),
        this.qualityList(subgraph.qualities, linked),
      );
    } else {
      parts.push(
        this.el("p", {
          className: "map-panel__summary",
          text: plural(node.sharedCount, "shared item", "shared items"),
        }),
      );
    }

    parts.push(
      this.el("div", { className: "map-panel__priority", attrs: { "data-panel-priority": "" } }),
    );
    if (node.page) parts.push(this.openLink(node.page));
    parts.push(this.hideButton(node.hidden));

    this.container.replaceChildren(...parts);
    if (refocus) this.container.querySelector("[data-panel-hide]")?.focus();
  }

  qualityList(qualities, linked) {
    const ul = this.el("ul", { className: "map-panel__qualities" });
    for (const q of qualities) {
      const on = linked.has(q.id);
      const li = this.el("li", { className: on ? "is-linked" : "is-unlinked" });
      li.append(
        this.el("span", {
          className: "map-panel__mark",
          text: on ? "✓" : "–",
          attrs: { "aria-hidden": "true" },
        }),
        this.doc.createTextNode(on ? q.label : `${q.label}, not linked`),
      );
      ul.append(li);
    }
    return ul;
  }

  openLink(page) {
    const a = this.el("a", {
      className: "map-panel__open",
      text: "Open on Q42",
      attrs: { href: this.baseurl + page, "data-panel-open": "" },
    });
    const svg = this.doc.createElementNS(SVG_NS, "svg");
    for (const [k, v] of Object.entries({
      "aria-hidden": "true",
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
    }))
      svg.setAttribute(k, v);
    const path = this.doc.createElementNS(SVG_NS, "path");
    path.setAttribute("d", EXTERNAL_ICON);
    svg.append(path);
    a.append(svg);
    return a;
  }

  hideButton(hidden) {
    const wrap = this.el("div", { className: "map-panel__hide" });
    wrap.append(
      this.el("button", {
        className: "map-panel__button",
        text: hidden ? "Show on map" : "Hide from map",
        attrs: { type: "button", "data-panel-hide": "" },
      }),
      this.el("p", {
        className: "map-panel__hint",
        text: hidden
          ? "Hidden from the map. It stays in your selection."
          : "It stays in your selection. Bring it back from the Hidden list.",
      }),
    );
    return wrap;
  }
}
