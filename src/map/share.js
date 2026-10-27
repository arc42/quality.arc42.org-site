import { normalizeState, ALL_LAYERS, PRIORITIES, STORE_VERSION } from "./store.js";

export const SHARE_PARAM = "s";
export const SHARE_MAX_LENGTH = 8000;

const TOKEN_PREFIX = "v1.";
const MAX_INFLATED_BYTES = 1024 * 1024;
const BASE64URL = /^[A-Za-z0-9_-]*$/;

const priorityToCompact = (p) => (PRIORITIES.includes(p) ? p[0] : 0);
const priorityFromCompact = (c) => PRIORITIES.find((p) => p[0] === c) ?? null;

function toCompact(state) {
  return {
    v: STORE_VERSION,
    q: state.qualities.map((q) => [q.id, priorityToCompact(q.priority), q.hidden ? 1 : 0]),
    c: state.custom.map((c, i) => {
      const row = [c.title, c.scenario, c.qualities, priorityToCompact(c.priority)];
      // Ids are regenerated from position unless they differ (e.g. after a removal).
      if (c.id !== `c-${i + 1}`) row.push(c.id);
      return row;
    }),
    h: state.hiddenItems,
    l: state.layers.map((l) => l[0]).join(""),
    x: state.showSingles ? 1 : 0,
  };
}

function fromCompact(obj) {
  if (!obj || obj.v !== STORE_VERSION) return null;
  return normalizeState({
    v: STORE_VERSION,
    qualities: obj.q.map(([id, p, hidden]) => ({
      id,
      priority: priorityFromCompact(p),
      hidden: hidden === 1,
    })),
    custom: obj.c.map(([title, scenario, qualities, p, id], i) => ({
      id: id ?? `c-${i + 1}`,
      title,
      scenario,
      qualities,
      priority: priorityFromCompact(p),
    })),
    hiddenItems: obj.h,
    layers: typeof obj.l === "string" ? ALL_LAYERS.filter((l) => obj.l.includes(l[0])) : undefined,
    showSingles: obj.x === 1,
  });
}

async function pipe(bytes, stream) {
  const out = new Blob([bytes]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(out).arrayBuffer());
}

const deflate = (text) =>
  pipe(new TextEncoder().encode(text), new CompressionStream("deflate-raw"));

async function inflate(bytes) {
  const reader = new Blob([bytes])
    .stream()
    .pipeThrough(new DecompressionStream("deflate-raw"))
    .getReader();
  const chunks = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > MAX_INFLATED_BYTES) {
      await reader.cancel();
      throw new RangeError("Share payload too large");
    }
    chunks.push(value);
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(await new Blob(chunks).arrayBuffer());
}

function b64urlEncode(bytes) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(text) {
  if (!BASE64URL.test(text) || text.length % 4 === 1) throw new RangeError("Invalid base64url");
  const std = text.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(std + "=".repeat((4 - (std.length % 4)) % 4));
  return Uint8Array.from(bin, (ch) => ch.charCodeAt(0));
}

function extractToken(input) {
  let text = String(input ?? "").trim();
  const hash = text.indexOf("#");
  if (hash !== -1) text = text.slice(hash + 1);
  text = text.replace(/^[#?]/, "");
  const prefix = `${SHARE_PARAM}=`;
  if (text.startsWith(prefix)) text = text.slice(prefix.length);
  return text;
}

export async function encodeShare(state) {
  const bytes = await deflate(JSON.stringify(toCompact(state)));
  return TOKEN_PREFIX + b64urlEncode(bytes);
}

export async function decodeShare(fragmentOrUrl) {
  try {
    const token = extractToken(fragmentOrUrl);
    if (token.length > SHARE_MAX_LENGTH || !token.startsWith(TOKEN_PREFIX)) return null;
    const json = await inflate(b64urlDecode(token.slice(TOKEN_PREFIX.length)));
    return fromCompact(JSON.parse(json));
  } catch {
    return null;
  }
}

export async function shareUrl(state, baseHref) {
  return `${baseHref}#${SHARE_PARAM}=${await encodeShare(state)}`;
}
