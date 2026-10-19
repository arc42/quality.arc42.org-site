import { test } from "node:test";
import assert from "node:assert/strict";
import { summaryText, servesText, priorityLabel } from "../src/map/format.js";

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
