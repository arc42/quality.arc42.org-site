import { test } from "node:test";
import assert from "node:assert/strict";
import { rankQualities } from "../src/map/addSearchRank.js";

const q = (title, aliasList = []) => ({
  title,
  type: "quality",
  url: `/qualities/${title.toLowerCase().replace(/\s+/g, "-")}`,
  aliasList,
});

const entries = [
  q("Recoverability", ["Restorability", "Recovery Time"]),
  q("Recovery Point Objective"),
  q("Disaster Recovery"),
  q("Reliability"),
  q("Availability"),
  { title: "Recover Approach", type: "approach", url: "/approaches/recover" },
  q("Fault Tolerance"),
];

test("exact title ranks first and only qualities are returned", () => {
  const hits = rankQualities([...entries, q("Recover")], "recover");
  assert.equal(hits[0].title, "Recover");
  assert.ok(hits.every((h) => h.url.startsWith("/qualities/")));
});

test("results carry the id from the url and no via for title hits", () => {
  const [hit] = rankQualities(entries, "availab");
  assert.deepEqual(hit, {
    id: "availability",
    title: "Availability",
    url: "/qualities/availability",
    via: null,
  });
});

test("an alias hit reports the matching alias", () => {
  const hits = rankQualities(entries, "restorab");
  assert.equal(hits.length, 1);
  assert.equal(hits[0].id, "recoverability");
  assert.equal(hits[0].via, "Restorability");
});

test("an exact alias outranks a title prefix", () => {
  const hits = rankQualities([q("Restorability Index"), ...entries], "restorability");
  assert.equal(hits[0].id, "recoverability");
  assert.equal(hits[0].via, "Restorability");
});

test("title prefix comes before word matches", () => {
  const titles = rankQualities(entries, "recover").map((h) => h.title);
  assert.deepEqual(titles.slice(0, 3), [
    "Recoverability",
    "Recovery Point Objective",
    "Disaster Recovery",
  ]);
});

test("every query word must match", () => {
  const titles = rankQualities(entries, "recovery obj").map((h) => h.title);
  assert.deepEqual(titles, ["Recovery Point Objective"]);
});

test("limit is respected and defaults to 8", () => {
  const many = Array.from({ length: 20 }, (_, i) => q(`Quality ${i}`));
  assert.equal(rankQualities(many, "quality").length, 8);
  assert.equal(rankQualities(many, "quality", { limit: 3 }).length, 3);
});

test("empty and one-character queries return nothing", () => {
  assert.deepEqual(rankQualities(entries, ""), []);
  assert.deepEqual(rankQualities(entries, "  "), []);
  assert.deepEqual(rankQualities(entries, "r"), []);
});

test("matching is case-insensitive and no match gives an empty list", () => {
  assert.equal(rankQualities(entries, "FAULT")[0].id, "fault-tolerance");
  assert.deepEqual(rankQualities(entries, "zzzz"), []);
});
