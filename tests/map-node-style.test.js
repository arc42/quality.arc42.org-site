import { test } from "node:test";
import assert from "node:assert/strict";
import { qualityStyle, itemStyle, edgeStyle, QUALITY_RADIUS } from "../src/map/nodeStyle.js";

test("quality size and fill follow priority", () => {
  assert.equal(qualityStyle(null).r, QUALITY_RADIUS.none);
  assert.equal(qualityStyle("high").r, QUALITY_RADIUS.high);
  assert.equal(qualityStyle(null).fill, "#ffffff");
  assert.equal(qualityStyle("high").fill, "#00b8f5");
});

test("item styles per type, custom is dashed", () => {
  assert.equal(itemStyle("approach").stroke, "#1b5e20");
  assert.equal(itemStyle("custom").dashed, true);
  assert.equal(itemStyle("dimension").text, "#ffffff");
});

test("edge style", () => {
  assert.equal(edgeStyle({ kind: "link" }, { highlighted: false }).width, 1.5);
  assert.equal(edgeStyle({ kind: "custom" }, { highlighted: false }).dash, "6 5");
});
