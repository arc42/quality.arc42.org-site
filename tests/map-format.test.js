import { test } from "node:test";
import assert from "node:assert/strict";
import {
  summaryText,
  servesText,
  priorityLabel,
  singlesChipText,
  unknownIdsText,
} from "../src/map/format.js";

test("summary wording", () => {
  const sg = (n, items) => ({
    qualities: Array(n).fill({}),
    items,
    edges: [],
    unknownIds: [],
    singlesHidden: 0,
  });
  const st = (layers, custom = []) => ({ layers, custom });
  assert.equal(
    summaryText(sg(4, [{ type: "approach" }, { type: "approach" }]), st(["approaches"])),
    "4 qualities · 2 approaches serve two or more of them",
  );
  assert.equal(summaryText(sg(1, []), st(["approaches"])), "1 quality · nothing shared yet");
  assert.equal(
    summaryText(sg(2, [{ type: "requirement" }]), st(["requirements"], [{}])),
    "2 qualities · 1 requirement shared · 1 own requirement",
  );
});

test("serves and priority labels", () => {
  assert.equal(servesText({ linkedQualityIds: ["a", "b", "c"] }, 4), "3 of 4");
  assert.equal(priorityLabel(null), "not rated");
  assert.equal(priorityLabel("high"), "high");
});

test("single-link chip wording", () => {
  const sg = (n) => ({ singlesHidden: n });
  const st = (layers, showSingles = false) => ({ layers, showSingles });
  assert.equal(
    singlesChipText(sg(9), st(["approaches"])),
    "9 approaches with one link are hidden · Show",
  );
  assert.equal(
    singlesChipText(sg(1), st(["approaches"])),
    "1 approach with one link is hidden · Show",
  );
  assert.equal(
    singlesChipText(sg(3), st(["approaches", "standards"])),
    "3 items with one link are hidden · Show",
  );
  assert.equal(singlesChipText(sg(0), st(["approaches"])), "");
  assert.equal(singlesChipText(sg(0), st(["approaches"], true)), "Single-link items shown · Hide");
});

test("unknown-id notice names the stale ids", () => {
  assert.equal(unknownIdsText([]), "");
  assert.equal(
    unknownIdsText(["gone"]),
    "1 quality in your selection no longer exists on Q42: gone.",
  );
  assert.equal(
    unknownIdsText(["a", "b"]),
    "2 qualities in your selection no longer exist on Q42: a, b.",
  );
});
