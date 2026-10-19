import { test } from "node:test";
import assert from "node:assert/strict";
import { encodeShare, decodeShare, shareUrl, SHARE_MAX_LENGTH } from "../src/map/share.js";
import {
  createEmptyState,
  addQuality,
  addCustom,
  removeCustom,
  setQualityHidden,
  setItemHidden,
  setShowSingles,
  setPriority,
  setLayers,
} from "../src/map/store.js";

function sample() {
  let s = setLayers(addQuality(addQuality(createEmptyState(), "availability"), "resilience"), [
    "approaches",
    "dimensions",
  ]);
  s = setPriority(s, "availability", "high");
  return addCustom(s, {
    title: "Checkout survives",
    scenario: "No order lost",
    qualities: ["availability"],
    priority: "medium",
  });
}

test("round-trips a state (ignoring `updated`)", async () => {
  const s = sample();
  const back = await decodeShare(await encodeShare(s));
  const strip = ({ updated, ...rest }) => rest;
  assert.deepEqual(strip(back), strip(s));
});

test("accepts a fragment, a query-like string and a full URL", async () => {
  const token = await encodeShare(sample());
  for (const input of [`#s=${token}`, `s=${token}`, `https://quality.arc42.org/map/#s=${token}`]) {
    assert.equal((await decodeShare(input)).qualities.length, 2);
  }
});

test("returns null for garbage", async () => {
  assert.equal(await decodeShare("#s=v1.not-base64!!"), null);
  assert.equal(await decodeShare(""), null);
  assert.equal(await decodeShare("#s=v9.AAAA"), null);
});

test("60 qualities with priorities stay under the length budget", async () => {
  let s = createEmptyState();
  for (let i = 0; i < 60; i++) {
    const id = `quality-number-${i}-with-long-slug`;
    s = setPriority(addQuality(s, id), id, "high");
  }
  const token = await encodeShare(s);
  assert.ok(token.length < SHARE_MAX_LENGTH, `token length ${token.length}`);
});

test("shareUrl appends the fragment", async () => {
  const url = await shareUrl(sample(), "https://quality.arc42.org/map/");
  assert.match(url, /^https:\/\/quality\.arc42\.org\/map\/#s=v1\./);
});

async function tokenFor(text) {
  const out = new Blob([new TextEncoder().encode(text)])
    .stream()
    .pipeThrough(new CompressionStream("deflate-raw"));
  const bytes = new Uint8Array(await new Response(out).arrayBuffer());
  return `v1.${Buffer.from(bytes).toString("base64url")}`;
}

const strip = ({ updated, ...rest }) => rest;

test("round-trips every field, non-ASCII text and non-sequential custom ids", async () => {
  let s = addQuality(addQuality(createEmptyState(), "availability"), "resilience");
  s = setQualityHidden(s, "resilience", true);
  s = setItemHidden(setItemHidden(s, "approach-a", true), "c-2", true);
  s = setShowSingles(s, true);
  s = addCustom(s, {
    title: "Größe ✓ 日本語",
    scenario: 'Zeile\n"zwei"',
    qualities: ["resilience"],
  });
  s = addCustom(s, { title: "Second", qualities: [], priority: "low" });
  s = removeCustom(s, "c-1");
  assert.equal(s.custom[0].id, "c-2");
  assert.deepEqual(strip(await decodeShare(await encodeShare(s))), strip(s));
});

test("round-trips an empty state", async () => {
  const s = createEmptyState();
  assert.deepEqual(strip(await decodeShare(await encodeShare(s))), strip(s));
});

test("returns null for tokens that are valid base64url but not a share payload", async () => {
  const token = await encodeShare(sample());
  assert.equal(await decodeShare(token.slice(0, -8)), null);
  assert.equal(await decodeShare("#s=v1.AAAAAAAA"), null);
  assert.equal(await decodeShare(`#s=${await tokenFor("not json")}`), null);
  assert.equal(await decodeShare(`#s=${await tokenFor("{}")}`), null);
  assert.equal(await decodeShare(`#s=${await tokenFor('{"v":1}')}`), null);
});

test("rejects over-length tokens and oversized inflated payloads", async () => {
  assert.equal(await decodeShare(`#s=v1.${"A".repeat(SHARE_MAX_LENGTH)}`), null);
  const bomb = await tokenFor(
    JSON.stringify({ v: 1, q: [], c: [], h: ["x".repeat(2 * 1024 * 1024)] }),
  );
  assert.ok(bomb.length < SHARE_MAX_LENGTH);
  assert.equal(await decodeShare(bomb), null);
});

test("a compact object without `l` decodes to the default layers", async () => {
  const back = await decodeShare(await tokenFor(JSON.stringify({ v: 1, q: [], c: [], h: [] })));
  assert.deepEqual(back.layers, ["approaches"]);
});
