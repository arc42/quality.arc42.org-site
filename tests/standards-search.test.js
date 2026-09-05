import { test } from "node:test";
import assert from "node:assert/strict";
import { createStandardsSearch } from "../src/explorers/standards-search.js";

const search = createStandardsSearch([
  {
    id: "c3a",
    shortname: "C3A",
    title: "Criteria enabling Cloud Computing Autonomy",
    organization: "BSI",
    body: "Cloud sovereignty includes external key management and privacy.",
  },
  {
    id: "eucsf",
    shortname: "EU CSF",
    title: "Cloud Sovereignty Framework",
    organization: "EU",
    body: "Assessment of cloud autonomy.",
  },
  {
    id: "iso25010",
    shortname: "ISO/IEC 25010",
    title: "Product quality model",
    organization: "ISO/IEC",
    body: "Flexibility and replaceability.",
  },
  {
    id: "other",
    shortname: "Other",
    title: "C3A companion",
    body: "ISO/IEC 25010. Cloud governance. C3A.",
  },
]);

test("exact names rank before mentions; titles rank before body matches", () => {
  assert.equal(search("C3A")[0], "c3a");
  assert.equal(search("cloud sovereignty")[0], "eucsf");
  assert.equal(search("ISO/IEC 25010")[0], "iso25010");
  assert.equal(search("iso25010")[0], "iso25010");
});

test("matches all words across fields, normalizes punctuation and completes the final word", () => {
  assert.deepEqual(search(" BSI / cloud   auton "), ["c3a"]);
  assert.deepEqual(search("ISO 25010").sort(), ["iso25010", "other"]);
  assert.deepEqual(search("cloud missing"), []);
  assert.deepEqual(search("privac"), ["c3a"]);
  assert.deepEqual(search("privacy"), ["c3a"]);
  assert.deepEqual(search("clou sovereignty"), []);
  assert.equal(search(" * : + "), null);
  assert.equal(search(""), null);
});

test("equal scores have a stable alphabetical order", () => {
  const tied = createStandardsSearch([
    { id: "z", shortname: "Zulu", body: "shared subject" },
    { id: "a", shortname: "Alpha", body: "shared subject" },
  ]);
  assert.deepEqual(tied("shared"), ["a", "z"]);
});
