export const STORAGE_KEY = "q42.map.v1";
export const STORE_VERSION = 1;
export const PRIORITIES = Object.freeze(["low", "medium", "high"]);
export const DEFAULT_LAYERS = Object.freeze(["approaches"]);
export const ALL_LAYERS = Object.freeze(["approaches", "requirements", "standards", "dimensions"]);
export const SELECTION_EVENT = "q42:selection-changed";

const PROBE_KEY = "q42.map.probe";
const CUSTOM_ID = /^c-\d+$/;

/** @typedef {{ id: string, priority: "low"|"medium"|"high"|null, hidden: boolean }} SelectedQuality */
/** @typedef {{ id: string, title: string, scenario: string, qualities: string[], priority: "low"|"medium"|"high"|null }} CustomRequirement */
/** @typedef {{ v: 1, qualities: SelectedQuality[], custom: CustomRequirement[], hiddenItems: string[], layers: string[], showSingles: boolean, updated: string }} MapState */

export function createEmptyState(now = new Date()) {
  return {
    v: STORE_VERSION,
    qualities: [],
    custom: [],
    hiddenItems: [],
    layers: [...DEFAULT_LAYERS],
    showSingles: false,
    updated: now.toISOString(),
  };
}

export function hasQuality(state, id) {
  return state.qualities.some((q) => q.id === id);
}

export function addQuality(state, id) {
  if (hasQuality(state, id)) return state;
  return { ...state, qualities: [...state.qualities, { id, priority: null, hidden: false }] };
}

export function removeQuality(state, id) {
  return {
    ...state,
    qualities: state.qualities.filter((q) => q.id !== id),
    custom: state.custom.map((c) => ({ ...c, qualities: c.qualities.filter((q) => q !== id) })),
  };
}

export function setPriority(state, id, priority) {
  if (priority !== null && !PRIORITIES.includes(priority)) {
    throw new RangeError(`Invalid priority: ${priority}`);
  }
  return {
    ...state,
    qualities: state.qualities.map((q) => (q.id === id ? { ...q, priority } : q)),
    custom: state.custom.map((c) => (c.id === id ? { ...c, priority } : c)),
  };
}

export function setQualityHidden(state, id, hidden) {
  return {
    ...state,
    qualities: state.qualities.map((q) => (q.id === id ? { ...q, hidden: Boolean(hidden) } : q)),
  };
}

export function setItemHidden(state, itemId, hidden) {
  const rest = state.hiddenItems.filter((id) => id !== itemId);
  return { ...state, hiddenItems: hidden ? [...rest, itemId] : rest };
}

export function setLayers(state, layers) {
  const wanted = Array.isArray(layers) ? layers : [];
  return { ...state, layers: ALL_LAYERS.filter((l) => wanted.includes(l)) };
}

export function setShowSingles(state, flag) {
  return { ...state, showSingles: Boolean(flag) };
}

export function addCustom(state, { title, scenario = "", qualities = [], priority = null }) {
  const trimmed = typeof title === "string" ? title.trim() : "";
  if (!trimmed) throw new RangeError("Custom requirement needs a title");
  if (priority !== null && !PRIORITIES.includes(priority)) {
    throw new RangeError(`Invalid priority: ${priority}`);
  }
  const max = state.custom.reduce((m, c) => Math.max(m, Number(c.id.slice(2)) || 0), 0);
  const entry = {
    id: `c-${max + 1}`,
    title: trimmed,
    scenario,
    qualities: [...qualities],
    priority,
  };
  return { ...state, custom: [...state.custom, entry] };
}

export function removeCustom(state, id) {
  return { ...state, custom: state.custom.filter((c) => c.id !== id) };
}

const isString = (v) => typeof v === "string" && v !== "";
const asPriority = (v) => (PRIORITIES.includes(v) ? v : null);
const uniqueStrings = (v) => (Array.isArray(v) ? [...new Set(v.filter(isString))] : []);

function normalizeQualities(raw) {
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  const out = [];
  for (const q of raw) {
    if (!q || !isString(q.id) || seen.has(q.id)) continue;
    seen.add(q.id);
    out.push({ id: q.id, priority: asPriority(q.priority), hidden: q.hidden === true });
  }
  return out;
}

function normalizeCustom(raw) {
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  const out = [];
  for (const c of raw) {
    if (!c || !isString(c.id) || seen.has(c.id)) continue;
    const title = typeof c.title === "string" ? c.title.trim() : "";
    if (!title) continue;
    seen.add(c.id);
    out.push({
      id: c.id,
      title,
      scenario: typeof c.scenario === "string" ? c.scenario : "",
      qualities: uniqueStrings(c.qualities),
      priority: asPriority(c.priority),
    });
  }
  return out;
}

export function normalizeState(raw) {
  if (!raw || typeof raw !== "object" || raw.v !== STORE_VERSION) return createEmptyState();
  const updated = typeof raw.updated === "string" ? new Date(raw.updated) : null;
  return {
    v: STORE_VERSION,
    qualities: normalizeQualities(raw.qualities),
    custom: normalizeCustom(raw.custom),
    hiddenItems: uniqueStrings(raw.hiddenItems),
    layers: Array.isArray(raw.layers)
      ? ALL_LAYERS.filter((l) => raw.layers.includes(l))
      : [...DEFAULT_LAYERS],
    showSingles: raw.showSingles === true,
    updated:
      updated && !Number.isNaN(updated.getTime())
        ? updated.toISOString()
        : new Date().toISOString(),
  };
}

export function createMemoryStorage() {
  const data = new Map();
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => {
      data.set(k, String(v));
    },
    removeItem: (k) => {
      data.delete(k);
    },
  };
}

let fallbackStorage = null;

export function resolveStorage(candidate) {
  try {
    const storage = candidate ?? globalThis.localStorage;
    storage.setItem(PROBE_KEY, "1");
    storage.removeItem(PROBE_KEY);
    return storage;
  } catch {
    fallbackStorage ??= createMemoryStorage();
    return fallbackStorage;
  }
}

export function loadState(storage = resolveStorage()) {
  let raw = null;
  try {
    raw = JSON.parse(storage.getItem(STORAGE_KEY));
  } catch {
    raw = null;
  }
  return normalizeState(raw);
}

export function saveState(state, storage = resolveStorage()) {
  const saved = { ...state, updated: new Date().toISOString() };
  storage.setItem(STORAGE_KEY, JSON.stringify(saved));
  return saved;
}

export function clearState(storage = resolveStorage()) {
  storage.removeItem(STORAGE_KEY);
}

export function emitSelectionChanged(state, target = globalThis.document) {
  if (!target) return;
  target.dispatchEvent(new CustomEvent(SELECTION_EVENT, { detail: { state } }));
}

/**
 * Merge an incoming selection (e.g. from a share link) into the current one:
 * existing qualities keep their priorities, new ones are appended, incoming
 * custom requirements are appended with fresh ids, hidden items are united
 * (incoming custom ids follow their renamed requirement),
 * and the layers come from the incoming selection.
 */
export function mergeStates(current, incoming) {
  let next = { ...current, qualities: [...current.qualities] };
  for (const q of incoming.qualities) {
    if (!hasQuality(next, q.id)) next.qualities.push({ ...q });
  }
  const renamed = new Map();
  for (const c of incoming.custom) {
    next = addCustom(next, c);
    renamed.set(c.id, next.custom[next.custom.length - 1].id);
  }
  const hidden = new Set(current.hiddenItems);
  for (const id of incoming.hiddenItems) {
    if (renamed.has(id)) hidden.add(renamed.get(id));
    // A stale custom id (its requirement is gone) must not hide one of mine.
    else if (!CUSTOM_ID.test(id)) hidden.add(id);
  }
  return { ...setLayers(next, incoming.layers), hiddenItems: [...hidden] };
}
