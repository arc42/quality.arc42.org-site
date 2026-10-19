import { test } from "node:test";
import assert from "node:assert/strict";
import { encodeShare, decodeShare, shareUrl, SHARE_MAX_LENGTH } from "../src/map/share.js";
import {
  createEmptyState,
  addQuality,
  addCustom,
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
