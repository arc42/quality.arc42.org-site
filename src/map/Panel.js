// Side panel next to the map canvas: details of the selected node, a link to
// its page on Q42, the priority rating and the hide/show toggle; for own
// requirements also Edit, Remove and the propose-as-issue link.

import { PRIORITIES } from "./store.js";
import { plural, priorityLabel } from "./format.js";
import { el } from "./dom.js";
import { proposeIssueUrl } from "./propose.js";

export const TYPE_BADGES = Object.freeze({
  quality: "Quality",
  approach: "Approach",
  requirement: "Requirement",
  standard: "Standard",
  dimension: "Dimension",
  custom: "Own requirement",
});

const PLACEHOLDER =
  "Select a node on the map or a Details button in the list to see details. You can also add your own requirement with the button above.";
const PRIVACY_NOTE =
  "Shares title, scenario and linked qualities. Not shared: your priorities, selection and map.";
const EXTERNAL_ICON = "M14 4h6v6M20 4l-9 9M19 14v6H4V5h6";
const SVG_NS = "http://www.w3.org/2000/svg";

export class Panel {
  constructor(
    container,
    {
      baseurl = "",
      onHide = () => {},
      onOpen = () => {},
      onPriority = () => {},
      getCustom = () => null,
      onEdit = () => {},
      onRemove = () => {},
      onRemoveQuality = () => {},
    } = {},
  ) {
    this.container = container;
    this.doc = container.ownerDocument;
    this.baseurl = baseurl;
    this.selection = null;
    this.getCustom = getCustom;

    // Delegated once: the panel content is rebuilt on every render.
    container.addEventListener("click", (event) => {
      const node = this.selection?.node;
      if (!node) return;
      const choice = event.target.closest("[data-priority]");
      if (choice) {
        const next = choice.dataset.priority;
        onPriority(node.id, next === node.priority ? null : next);
      } else if (event.target.closest("[data-panel-hide]")) onHide(node.id, !node.hidden);
      else if (event.target.closest("[data-panel-open]")) onOpen(node.id);
      else if (event.target.closest("[data-panel-edit]")) onEdit(node.id, event.target);
      else if (event.target.closest("[data-panel-remove]")) onRemove(node.id);
      else if (event.target.closest("[data-panel-remove-quality]")) onRemoveQuality(node.id);
    });
  }

  render(selection) {
    // Keep keyboard focus on the same control when it is rebuilt after a change.
    const active = this.doc.activeElement;
    const inside = this.container.contains(active);
    const refocus = inside && active.matches("[data-panel-hide]");
    const refocusPriority = inside ? active.closest("[data-priority]")?.dataset.priority : null;
    this.selection = selection;
    if (!selection) {
      this.container.replaceChildren(
        el(this.doc, "p", { className: "map-panel__placeholder", text: PLACEHOLDER }),
      );
      return;
    }

    const { kind, node, subgraph } = selection;
    const type = kind === "quality" ? "quality" : node.type;
    const parts = [
      el(this.doc, "span", {
        className: "map-panel__badge",
        text: TYPE_BADGES[type],
        attrs: { "data-type": type },
      }),
      // Focus target for the list view's Details buttons.
      el(this.doc, "h2", {
        className: "map-panel__title",
        text: node.label,
        attrs: { tabindex: "-1" },
      }),
    ];

    if (kind === "item") {
      const total = subgraph.qualities.length;
      const linked = new Set(node.linkedQualityIds);
      parts.push(
        el(this.doc, "p", {
          className: "map-panel__summary",
          text: `Supports ${linked.size} of ${plural(total, "quality", "qualities")}`,
        }),
        this.qualityList(subgraph.qualities, linked),
      );
    } else {
      parts.push(
        el(this.doc, "p", {
          className: "map-panel__summary",
          text: plural(node.sharedCount, "shared item", "shared items"),
        }),
      );
    }

    const custom = node.type === "custom" ? this.getCustom(node.id) : null;
    if (custom?.scenario.trim()) {
      parts.push(
        el(this.doc, "p", { className: "map-panel__scenario", text: custom.scenario.trim() }),
      );
    }
    parts.push(this.priorityGroup(node, kind === "quality" || node.type === "custom"));
    if (node.page) parts.push(this.openLink(node.page));
    if (custom) parts.push(this.customActions(), this.proposeBlock(custom));
    parts.push(this.hideButton(node.hidden));
    if (kind === "quality") parts.push(this.removeQualityButton());

    this.container.replaceChildren(...parts);
    if (refocus) this.container.querySelector("[data-panel-hide]")?.focus();
    if (refocusPriority)
      this.container.querySelector(`[data-priority="${refocusPriority}"]`)?.focus();
  }

  /** Low/Medium/High rating; empty slot for items that cannot be rated. */
  priorityGroup(node, rateable) {
    const slot = el(this.doc, "div", {
      className: "map-panel__priority",
      attrs: { "data-panel-priority": "" },
    });
    if (!rateable) return slot;
    const priority = node.priority ?? null;
    const group = el(this.doc, "div", {
      className: "map-segments",
      attrs: { role: "group", "aria-label": "My priority" },
    });
    for (const value of PRIORITIES) {
      group.append(
        el(this.doc, "button", {
          className: "map-segment",
          text: priorityLabel(value)[0].toUpperCase() + priorityLabel(value).slice(1),
          attrs: {
            type: "button",
            "data-priority": value,
            "aria-pressed": String(priority === value),
          },
        }),
      );
    }
    slot.append(
      el(this.doc, "h3", { className: "map-panel__subheading", text: "My priority" }),
      el(this.doc, "p", {
        className: "map-panel__hint",
        text:
          priority === null
            ? "Not rated yet. Your choice sets size and colour on the map."
            : `Rated ${priorityLabel(priority)}. Press the active choice again to clear.`,
      }),
      group,
    );
    return slot;
  }

  qualityList(qualities, linked) {
    const ul = el(this.doc, "ul", { className: "map-panel__qualities" });
    for (const q of qualities) {
      const on = linked.has(q.id);
      const li = el(this.doc, "li", { className: on ? "is-linked" : "is-unlinked" });
      li.append(
        el(this.doc, "span", {
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
    const a = el(this.doc, "a", {
      className: "map-panel__open",
      text: "Open on Q42",
      attrs: { href: this.baseurl + page, "data-panel-open": "" },
    });
    a.append(this.externalIcon());
    return a;
  }

  customActions() {
    const wrap = el(this.doc, "div", { className: "map-panel__actions" });
    wrap.append(
      el(this.doc, "button", {
        className: "map-panel__button",
        text: "Edit",
        attrs: { type: "button", "data-panel-edit": "" },
      }),
      el(this.doc, "button", {
        className: "map-panel__button",
        text: "Remove",
        attrs: { type: "button", "data-panel-remove": "" },
      }),
    );
    return wrap;
  }

  /** "Propose as contribution": a prefilled GitHub issue, opened in a new tab. */
  proposeBlock(custom) {
    const wrap = el(this.doc, "div", { className: "map-panel__propose" });
    const a = el(this.doc, "a", {
      className: "map-propose",
      text: "Propose as contribution",
      attrs: { href: proposeIssueUrl(custom), target: "_blank", rel: "noopener" },
    });
    a.append(
      this.externalIcon(),
      el(this.doc, "span", { className: "sr-only", text: " (opens GitHub in a new tab)" }),
    );
    wrap.append(a, el(this.doc, "p", { className: "map-panel__hint", text: PRIVACY_NOTE }));
    return wrap;
  }

  externalIcon() {
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
    return svg;
  }

  removeQualityButton() {
    return el(this.doc, "button", {
      className: "map-panel__button map-panel__button--secondary",
      text: "Remove from selection",
      attrs: { type: "button", "data-panel-remove-quality": "" },
    });
  }

  hideButton(hidden) {
    const wrap = el(this.doc, "div", { className: "map-panel__hide" });
    wrap.append(
      el(this.doc, "button", {
        className: "map-panel__button",
        text: hidden ? "Show on map" : "Hide from map",
        attrs: { type: "button", "data-panel-hide": "" },
      }),
      el(this.doc, "p", {
        className: "map-panel__hint",
        text: hidden
          ? "Hidden from the map. It stays in your selection."
          : "It stays in your selection. Bring it back from the Hidden list.",
      }),
    );
    return wrap;
  }
}
