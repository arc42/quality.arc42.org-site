import { STORE_VERSION, normalizeState } from "../store.js";

// JSON export and import of a map selection. The export is self-describing
// (titles and absolute URLs) so it stays useful outside Q42, e.g. for an LLM;
// the import only trusts the selection fields and normalizes them.

export const EXPORT_FORMAT = "q42-map";
export const DEFAULT_SITE = "https://quality.arc42.org";

const NOT_A_MAP = "Not a Q42 map file";

const absolute = (site, page) => (page ? `${site.replace(/\/$/, "")}${page}` : null);

export function toExportJson(state, subgraph, { site = DEFAULT_SITE, now = new Date() } = {}) {
  const known = new Map(subgraph.qualities.map((q) => [q.id, q]));
  const doc = {
    format: EXPORT_FORMAT,
    v: STORE_VERSION,
    exported: now.toISOString(),
    site,
    qualities: state.qualities.map((q) => ({
      id: q.id,
      title: known.get(q.id)?.label ?? q.id,
      url: absolute(site, known.get(q.id)?.page),
      priority: q.priority,
      hidden: q.hidden,
    })),
    items: subgraph.items.map((item) => ({
      id: item.id,
      title: item.label,
      type: item.type,
      // Custom items have no page on Q42: never link them.
      url: item.type === "custom" ? null : absolute(site, item.page),
      linkedQualityIds: [...item.linkedQualityIds],
    })),
    custom: state.custom.map((c) => ({ ...c, qualities: [...c.qualities] })),
    hiddenItems: [...state.hiddenItems],
    layers: [...state.layers],
    showSingles: state.showSingles,
  };
  return `${JSON.stringify(doc, null, 2)}\n`;
}

const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

/** Parse an export file or a raw MapState; throws Error("Not a Q42 map file") otherwise. */
export function fromImportJson(text) {
  let raw;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error(NOT_A_MAP);
  }
  if (!isObject(raw) || raw.v !== STORE_VERSION || !Array.isArray(raw.qualities)) {
    throw new Error(NOT_A_MAP);
  }
  if (raw.format !== undefined && raw.format !== EXPORT_FORMAT) throw new Error(NOT_A_MAP);
  return normalizeState({
    v: STORE_VERSION,
    qualities: raw.qualities,
    custom: raw.custom,
    hiddenItems: raw.hiddenItems,
    layers: raw.layers,
    showSingles: raw.showSingles,
    updated: raw.format === EXPORT_FORMAT ? raw.exported : raw.updated,
  });
}
